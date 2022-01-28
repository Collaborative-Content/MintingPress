// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./libraries/utils.sol";

import "./Settings.sol";
import "./AdminProxy.sol";
import "./BondingCurve.sol";

library PRLib {

}

contract Content is ERC1155, Ownable, IERC1155Receiver{
    //using BondingCurveLib for BondingCurveLib.BondingCurve;
    //using PRLib for PRLib.PR;

    struct PR {
        bytes content;
        uint blockTimestamp;
        uint positiveVotes;
        uint negativeVotes;
        uint totalVotes;
        uint PRPrice;
    }

    AdminProxy immutable adminProxy;
    Settings immutable settings;
    BondingCurve immutable bondingCurve;
    address public contentContract;

    // content mapping
    uint public contentTokenID = 1;
    mapping(uint => bytes) public contentData;
    mapping(uint => bool) public contentComplete;
    mapping(uint => address[]) public contentAuthors;

    // TODO can we remove outstandingFungibleBalance and replace with balanceof() from ERC1155?
    mapping( uint => mapping( address => uint )) outstandingFungibleBalance; 
    
    mapping(uint => mapping(address => PR)) public PRs;
    mapping(uint => mapping(address => bool)) public PRexists;
    mapping(uint => address[]) public PRauthors;

    mapping(uint => mapping(address => uint)) public voteCredits;

    // TODO implement completion vote
    mapping(uint => mapping(address => bool)) votesToComplete;

    event Voted(address voter, address PRowner, uint voteCredits, bool positive, uint tokenID);
    event PRApproved(uint tokenID, address PRwinner);
    event NoPRApproved(uint tokenID);
    event NewPR(address PRowner, uint tokenID, uint PRPrice, uint ownershipTokensToMint);
    event NewContentMinted(uint tokenID, address creator);

    constructor(address _adminAddr,
                address _settingsAddr,
                address _bondingCurveAddr
                ) 
                ERC1155("") {
        settings = Settings(_settingsAddr);
        adminProxy = AdminProxy(_adminAddr);
        bondingCurve = BondingCurve(_bondingCurveAddr);
        contentContract = address(this);
    }

    modifier onlyAuthor(uint tokenID) {
        require(balanceOf(msg.sender, tokenID) > 0, 
                "Must have content authorship tokens");
        _;
    }

    function tallyVotes(uint _tokenId) public onlyOwner {
        address[] memory thisPRauthors = PRauthors[_tokenId];
        for (uint i = 0; i < thisPRauthors.length; i++) {
            PR memory thisPR = PRs[_tokenId][thisPRauthors[i]];
            uint totalVotes;
            if (thisPR.positiveVotes > thisPR.negativeVotes) {
                totalVotes = thisPR.positiveVotes - thisPR.negativeVotes;
            } else {
                totalVotes = 0;
            }
            PRs[_tokenId][thisPRauthors[i]].totalVotes = totalVotes;
        }
    }

    function onERC1155Received(address operator, address from, uint id, uint value, bytes calldata data) 
    external returns (bytes4) {
             contentData[id] = data;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {}

    function append(string calldata a, string calldata b, string calldata c) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }
    
    // @params data - story, symbol - fungible token 
    function mint(bytes memory data, uint totalSupply, uint minPRPrice, uint ownerStake, bytes memory tokenSymbol) external payable {
        // PUT IN BONDING CURVE METHOD
        // TODO other checks on bonding curve based on additional settings
        require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
        require(msg.value >= settings.MinimumInitialPrice(), "Not enough ETH to mint content");
        require(totalSupply >= settings.MinimumInitialSupply(), "Total Supply too low");
        require(ownerStake <= totalSupply, "Owner stake must be less than supply");
        
        bondingCurve.setCurveParams(tokenSymbol, contentTokenID - 1, ownerStake,  minPRPrice, totalSupply);
        super._mint(contentContract, contentTokenID, 1, data); // non fungible
        _mintOwnership(msg.sender, 
                       contentTokenID-1, 
                       bondingCurve.getOwnerStake(contentTokenID-1), 
                       bondingCurve.getTokenSymbol(contentTokenID-1));   // fungible
        emit NewContentMinted(contentTokenID, msg.sender);
        contentTokenID += settings.ReserveTokenSpaces();  // increment to make space for new content
    }

    function _mintOwnership(address to, uint id, uint amount, bytes memory data) internal {
        require(id % 2 == 0, "TokenID must be ownership token");
        super._mint(to, id, amount, data);
    }

    function submitPR(string memory _PRtext, uint tokenID) external payable {
        require(adminProxy.contributionsOpen(), 
                "Contributions are currently closed");
        require(!PRexists[tokenID][msg.sender], "Existing PR");
        require((msg.value >= bondingCurve.getMinPRPrice(tokenID)), 
                "ETH Value is below minimum PR price");
        PRauthors[tokenID].push(msg.sender);
        PRs[tokenID][msg.sender] = PR({content: bytes(_PRtext), 
                                       blockTimestamp: block.timestamp,
                                       PRPrice: msg.value,
                                       positiveVotes: 0,
                                       negativeVotes: 0,
                                       totalVotes: 0
                                    });
        PRexists[tokenID][msg.sender] = true;
        // TODO verify below line is OK for PR; this is how much that WOULD be minted if this was approved
        uint amount = bondingCurve.calculatePurchaseReturn(PRs[tokenID][msg.sender].PRPrice, msg.sender, tokenID);
        emit NewPR(msg.sender, tokenID, msg.value, amount);
    }

    // TODO function for admin to assign vote credits at start of voting; Otherwise there is a bug 
    function _assignVoteCredits() external onlyOwner {
        for (uint tokenId = 0; tokenId < contentTokenID; tokenId=tokenId+2) {
            for (uint i = 0; i < contentAuthors[tokenId].length; i++) {
                address author = contentAuthors[tokenId][i];
                voteCredits[tokenId][author] = outstandingFungibleBalance[tokenId][author] ** 2;
            }
        }
    }

    function vote(address _PRowner, uint _numVotes, bool positive, uint tokenId) external onlyAuthor(tokenId) {
        require(adminProxy.votingOpen(), "Voting is currently closed");
        //voteCredits[tokenId][msg.sender] == outstandingFungibleBalance[tokenId][msg.sender] ** 2;
        require((_numVotes <= voteCredits[tokenId][msg.sender]), "Not enough vote credits");
        PR storage votingPR = PRs[tokenId][msg.sender];
        if (positive) {
            votingPR.positiveVotes += _numVotes; 
        } else {
            votingPR.negativeVotes += _numVotes; 
        }
        voteCredits[tokenId][msg.sender] -= (_numVotes ** 2); 
        emit Voted(msg.sender, _PRowner, _numVotes, positive, tokenId);
    }

    function voteToComplete(address _PRowner, uint tokenId) external onlyAuthor(tokenId) {

    }

    // TODO approvePR should be called by the ContentFactory on all contracts at the same time
    // ideally right before calling startContributionPeriod
    // TODO extra security: verify votes have been tallied, contributionsOpen AND votesOpen both false
    // (I think we need a third state where neither are true to avoid edge case new contributions during vote tally)
    function approvePRs(uint tokenID) external onlyOwner {
        require(!adminProxy.votingOpen(), "Voting is still open");
        require(!adminProxy.contributionsOpen(), "Contributions are currently open");
        uint _id = 1;   // start with the first piece of content
        while (balanceOf(contentContract, _id) > 0) {   // for each piece of content
            tallyVotes(_id);
            address PRwinner = _determineWinner(_id);
            if (PRwinner != address(0)) {
                _modifyContentandMint(_id, PRwinner);
                emit PRApproved(tokenID, PRwinner);
            } else { // PRs all had 0 or negative votes, so no PR approved
                emit NoPRApproved(tokenID);
            }
            _clearPRs(_id);
            _id = _id+2;
        }
    }
    
    function _determineWinner(uint _tokenId) internal view onlyOwner returns (address) {
        address topPRAuthor;
        // find AN author with the max vote value.
        address[] memory thisPRauthors = PRauthors[_tokenId];
        for (uint i = 0; i < thisPRauthors.length; i++) {
            if (i == 0) {
                topPRAuthor = thisPRauthors[i];
                continue;
            }
            if (PRs[_tokenId][thisPRauthors[i]].totalVotes >= PRs[_tokenId][topPRAuthor].totalVotes) {
                topPRAuthor = thisPRauthors[i];
            }
        }
        address[100] memory topPRAuthors;
        // determine ALL addresses with the same max vote value in event of a tie.
        uint maxVotes = PRs[_tokenId][topPRAuthor].totalVotes;
        uint numAuthorsTied = 0;
        for (uint i = 0; i < thisPRauthors.length; i++) {
            if (PRs[_tokenId][thisPRauthors[i]].totalVotes == maxVotes) {
                topPRAuthors[numAuthorsTied] = thisPRauthors[i];
                numAuthorsTied++;
            }
        }
        // if all totalVotes were <= 0, no PR is approved, return 0 address.
        if (maxVotes > 0) {
            if (numAuthorsTied != 1) {
                // TODO determine the winner of the tie
                // for now, just pick the first one
                topPRAuthor = topPRAuthors[0];
                return topPRAuthor;
            }
            else {
                return topPRAuthor;
            }
        } else {
            return address(0);
        }
    }

    function _modifyContentandMint(uint _contentTokenId, address _PRwinner) internal onlyOwner {
        PR memory winningPR = PRs[_contentTokenId][_PRwinner];
        contentData[_contentTokenId] = winningPR.content;//bytes(append((contentData[_contentTokenId]), string("\n\n"), string(winningPR.content)));
        uint ownershipTokenId = _contentTokenId -1;
        // existing content + new lines + winning PR
        uint amount = bondingCurve.calculatePurchaseReturn(winningPR.PRPrice, _PRwinner, ownershipTokenId);
        _mintOwnership(_PRwinner, ownershipTokenId, amount, bytes(""));
    }

    function _clearPRs(uint tokenId) internal onlyOwner {
        for (uint i = 0; i < PRauthors[tokenId].length; i++) {
            address PRauthor = PRauthors[tokenId][i];
            PR memory emptyPR;
            PRs[tokenId][PRauthor] = emptyPR;
            PRexists[tokenId][PRauthor] = false;
        }
        delete PRauthors[tokenId];
    }
}
