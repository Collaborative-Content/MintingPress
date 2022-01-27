// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


import "./Settings.sol";
import "./AdminProxy.sol";

contract Content is ERC1155, Ownable, IERC1155Receiver{
    AdminProxy immutable adminProxy;
    Settings immutable settings;
    address public contentContract;

    // content mapping
    uint public contentTokenID = 1;
    mapping(uint => string) public contentData;

    bool public contentComplete;

    struct BondingCurve {
        bytes32 tokenSymbol;
        uint tokenID;
        uint totalSupply;
        uint minPRPrice;
        uint ownerStake;
    }

    mapping( uint => BondingCurve ) bondingCurveParams;
    mapping( uint => mapping( address => uint )) outstandingFungibleBalance;
    mapping( uint => uint ) tokenReserveCounter;

    function setBondingCurveParams(bytes32 _tokenSymbol,
    uint _tokenID, 
    uint _totalSupply, 
    uint _ownerStake, 
    uint _minPRPrice) internal {
        bondingCurveParams[_tokenID].tokenSymbol = _tokenSymbol;  
        bondingCurveParams[_tokenID].tokenID = _tokenID;
        bondingCurveParams[_tokenID].ownerStake  = _ownerStake; 
        bondingCurveParams[_tokenID].minPRPrice  = _minPRPrice;    
        bondingCurveParams[_tokenID].totalSupply = _totalSupply;
        tokenReserveCounter[_tokenID] += _ownerStake;
    }
    
    struct voteTally {
        int positiveVotes;
        int negativeVotes;
    }

    struct PR {
        string content;
        uint blockTimestamp;
        voteTally PRVoteTally;
        uint PRPrice;
    }

    mapping(address => PR) public PRs;
    mapping(address => bool) public PRexists;
    mapping(address => int) public PRvotes;
    address[] public PRauthors;
    address[] public topPRAuthors;

    mapping(address => mapping(uint => uint)) public voteCredits;

    event Voted(address voter, address PRowner, int voteCredits);
    event PRApproved(string message);
    event NewPR(address PRowner, uint PRPrice);
    event FungibleTokensEmitted(address owner, uint tokenID, uint amount, bytes32 tokenSymbol);

    constructor(address _adminAddr,
                address _settingsAddr 
                ) 
                ERC1155("") {
        settings = Settings(_settingsAddr);
        adminProxy = AdminProxy(_adminAddr);
        ContentContractAddress = address(this);
    }

    function calculatePurchaseReturn(uint256 price, address creator_address, uint256 tokenID) internal returns(uint) {
        require(tokenID % 2 == 0, "Ownership tokenID required");
        require(price >= bondingCurveParams[tokenID].minPRPrice, "Below the minimum value for the pull request");
        uint256 returnStake;
        returnStake = (bondingCurveParams[tokenID].totalSupply - bondingCurveParams[tokenID].ownerStake)*((mathUtils.ceilSqrt(1 + mathUtils.roundDivision((price * 10000),(bondingCurveParams[tokenID].totalSupply-tokenReserveCounter[tokenID])))/100) - 1)/10;
        //require(_reserveCounter + returnStake < _totalSupply, "No more tokens for sale, check back later!");
        tokenReserveCounter[tokenID] += returnStake;
        emit FungibleTokensEmitted(creator_address, tokenID, returnStake, bondingCurveParams[tokenID].tokenSymbol);
        return returnStake;
    }

    modifier onlyAuthor() {
        require(balanceOf(msg.sender, AUTHORSHIP_TOKENID) > 0, 
                "Must have content authorship tokens");
        _;
    }


    function tallyVotes(uint _tokenId) public onlyOwner {
    for (uint i = 0; i < PRauthors.length; i++) {
        PR memory thisPR = PRs[PRauthors[i]];
        int totalVotes;
        totalVotes = thisPR.PRVoteTally.positiveVotes - thisPR.PRVoteTally.negativeVotes;
        PRvotes[PRauthors[i]] = totalVotes;
    }
}

    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) 
    external returns (bytes4) {
             contentData[id] = data;
    }

    function append(string a, string b, string c) internal pure returns (string) {
        return string(abi.encodePacked(a, b, c));
    }
    
    // @params data - story, symbol - fungible token symbol, 
    // mint a new piece of content. called the first time a new piece of content is created, and never again
    function mint(bytes memory data, uint totalSupply, uint minPRPrice, uint ownerStake) external {
        // PUT IN BONDING CURVE METHOD
        require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
        setBondingCurveParams(tokenSymbol, contentTokenID - 1, ownerStake,  minPRPrice, totalSupply);

        // TODO other checks on bonding curve based on additional settings

        super._mint(contentContract, contentTokenID, 1, data); // non fungible
        _mintOwnership(msg.sender, contentTokenID-1, bondingCurveParams[contentTokenID-1].ownerStake, bondingCurveParams[contentTokenID - 1].symbol);   // fungible
        contentTokenID += Settings.ReserveTokenSpaces;  // increment to make space for new content
    }

    function _mintOwnership(address to, uint256 id, uint256 amount, bytes memory data) internal {
        super._mint(to, id, amount, data);
    }

    function submitPR(string memory _PRtext, uint tokenID) external payable {
        require(adminProxy.contributionsOpen(), 
                "Contributions are currently closed");
        require(!PRexists[msg.sender], "Existing PR");
        require((msg.value >= bondingCurveParams[tokenID].minPRPrice), 
                "ETH Value is below minimum PR price");
        PRauthors.push(msg.sender);
        PRs[msg.sender] = PR({content: _PRtext, 
                              blockTimestamp: block.timestamp,
                              PRPrice: msg.value,
                              PRVoteTally: voteTally({
                                  positiveVotes: 0,
                                  negativeVotes: 0
                              })});
        PRexists[msg.sender] = true;
        // TODO determine the number of ownership tokens that would be minted upon approval, given this price?
        // May be useful for owners when voting

        emit NewPR(msg.sender, msg.value);
    }

    function vote(address _PRowner, int _numVotes, unit tokenId) external onlyAuthor {
        require(adminProxy.votingOpen(), "Voting is currently closed");
        voteCredits[msg.sender][tokenId] == outstandingFungibleBalance[tokenId][msg.sender] ** 2;
        require((_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
        PR storage votingPR = PRs[msg.sender];
        if (_numVotes >= 0) {
            require((_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
            votingPR.PRVoteTally.positiveVotes += _numVotes; 
            voteCredits[msg.sender][tokenId] -= (_numVotes ** 2); 
        } else {
            require((-_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
            votingPR.PRVoteTally.negativeVotes -= _numVotes; 
            voteCredits[msg.sender][tokenId] -= (_numVotes ** 2); 
        }
        emit Voted(msg.sender, _PRowner, _numVotes);
    }

    // TODO approvePR should be called by the ContentFactory on all contracts at the same time
    // ideally right before calling startContributionPeriod
    // TODO extra security: verify votes have been tallied, contributionsOpen AND votesOpen both false
    // (I think we need a third state where neither are true to avoid edge case new contributions during vote tally)
    function approvePR(uint tokenID) external onlyOwner {
        require(!adminProxy.votingOpen(), "Voting is still open");
        require(!adminProxy.contributionsOpen(), "Contributions are currently open");
        uint _id = 1;   // start with the first piece of content
        while (balanceOf(contentContract, _id) > 0) {   // for each piece of content
            tallyVotes(_id);
            PRwinner = _determineWinner(_id);
            _modifyContent(_id, PRwinner);
            _clearPRs(_id);
            _id = _id+2;
    }
    
    // TODO : Create a new function to set all the params for the first mint of the content
    // Will also call the bonding curve to determine the number of tokens to mint

    
    function _determineWinner(uint _tokenId) internal onlyOwner returns (address) {
        address topPRAuthor;
        // find AN author with the max vote value.
        for (uint i = 0; i < PRauthors.length; i++) {
            if (i == 0) {
                topPRAuthor = PRauthors[i];
                continue;
            }
            if (PRvotes[PRauthors[i]] >= PRvotes[topPRAuthor]) {
                topPRAuthor = PRauthors[i];
            }
        }
        // determine ALL addresses with the same max vote value in event of a tie.
        int maxVotes = PRvotes[topPRAuthor];
        for (uint i = 0; i < PRauthors.length; i++) {
            if (PRvotes[PRauthors[i]] == maxVotes) {
                topPRAuthors.push(PRauthors[i]);
            }
        }
        if (topPRAuthors.length != 1) {
            // TODO determine the winner of the tie
            // for now, just pick the first one
            topPRAuthor = topPRAuthors[0];
            return topPRAuthor;
        }
        else {
            return topPRAuthor;
        }
    }

    function _modifyContent(uint _tokenId, address _PRwinner) internal onlyOwner {
        PR memory winningPR = PRs[_PRwinner];
        contentData = append(contentData[_tokenId], "\n\n", winningPR.content); 
        // existing content + new lines + winning PR
        _mintOwnership(_PRwinner, _tokenId-1, GET-FROM-BONDING-CURVE-MAPPING, bytes(""));
    }

    function _clearPRs() internal onlyOwner {
        for (uint i = 0; i < PRauthors.length; i++) {
            address PRauthor = PRauthors[i];
            PR memory emptyPR;
            PRs[PRauthor] = emptyPR;
            PRexists[PRauthor] = false;
        }
        delete PRauthors;
        delete topPRAuthors;
    }
}
