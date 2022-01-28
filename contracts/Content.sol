// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./libraries/utils.sol";

import "./PullRequests.sol";
import "./Settings.sol";
import "./AdminProxy.sol";
import "./BondingCurve.sol";


contract Content is ERC1155, Ownable, IERC1155Receiver{
    //using BondingCurveLib for BondingCurveLib.BondingCurve;
    //using PRLib for PRLib.PR;


    AdminProxy immutable adminProxy;
    Settings immutable settings;
    PullRequests immutable PRsContract;
    BondingCurve immutable bondingCurve;
    address public contentContract;

    // content mapping
    uint public contentTokenID = 1;
    mapping(uint => bytes) public contentData;
    mapping(uint => bool) public contentComplete;
    mapping(uint => address[]) public contentAuthors;
    mapping(uint => mapping(address => uint)) public voteCredits;

    // TODO can we remove outstandingFungibleBalance and replace with balanceof() from ERC1155?
    mapping( uint => mapping( address => uint )) outstandingFungibleBalance; 
    mapping(uint => mapping(address => uint)) public voteCredits;

    // TODO implement completion vote
    mapping(uint => mapping(address => bool)) votesToComplete;

    event NewPR(address PRowner, uint tokenID, uint PRPrice, uint ownershipTokensToMint);
    event Voted(address voter, address PRowner, uint voteCredits, bool positive, uint tokenID);
    event PRApproved(uint tokenID, address PRwinner);
    event NoPRApproved(uint tokenID);
    event NewContentMinted(uint tokenID, address creator);

    constructor(address _adminAddr,
                address _settingsAddr,
                address _PRsAddr,
                address _bondingCurveAddr
                ) 
                ERC1155("") {
        PRsContract = new PullRequests();
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
        require((msg.value >= bondingCurveParams[tokenID].minPRPrice), 
                "ETH Value is below minimum PR price");
        // What happens if reverts inside below call? 
        PRsContract.submitPR(_PRtext, tokenID, msg.sender, msg.value);
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
        PRsContract.votePR(_PRowner, _numVotes, positive, tokenId);
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
            PRsContract.tallyVotes(_id);
            address PRwinner = PRsContract.determineWinner(_id);
            if (PRwinner != address(0)) {
                _modifyContentandMint(_id, PRwinner);
                emit PRApproved(tokenID, PRwinner);
            } else { // PRs all had 0 or negative votes, so no PR approved
                emit NoPRApproved(tokenID);
            }
            PRsContract.clearPRs(_id);
            _id = _id+2;
        }
    }

    function _modifyContentandMint(uint _contentTokenId, address _PRwinner) internal onlyOwner {
        bytes memory winningContent = PRsContract.getContent(_PRwinner, _contentTokenId);
        uint winningPRPrice = PRsContract.getPrice(_PRwinner, _contentTokenId);
        contentData[_contentTokenId] = winningContent;//bytes(append((contentData[_contentTokenId]), string("\n\n"), string(winningPR.content)));
        uint ownershipTokenId = _contentTokenId -1;
        // existing content + new lines + winning PR
        uint amount = bondingCurve.calculatePurchaseReturn(winningPR.PRPrice, _PRwinner, ownershipTokenId);
        _mintOwnership(_PRwinner, ownershipTokenId, amount, bytes(""));
    }
}
