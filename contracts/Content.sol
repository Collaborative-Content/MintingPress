// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "./libraries/math.sol";
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
    address public contentAddress;
    address public bondingCurveAddress;
    address public settingsAddress;
    address public PRsAddress;

    // content mapping
    uint public contentTokenID = 1;
    mapping(uint => bytes) public contentData;
    mapping(uint => bool) public contentComplete;
    mapping(uint => address[]) public contentAuthors;
    mapping(uint => mapping(address => uint)) public voteCredits;

    // TODO implement completion vote
    //mapping(uint => mapping(address => bool)) votesToComplete;

    event NewPR(address PRowner, uint tokenID, uint PRPrice);
    event Voted(address voter, address PRowner, uint voteCredits, bool positive, uint tokenID);
    event PRApproved(uint tokenID, address PRwinner);
    event NoPRApproved(uint tokenID);
    event NewContentMinted(uint tokenID, address creator);

    constructor(address _adminAddr,
                address _settingsAddr
                ) 
                ERC1155("") Ownable() {
        PRsContract = new PullRequests();
        PRsAddress = address(PRsContract);
        settings = Settings(_settingsAddr);
        settingsAddress = address(settings);
        adminProxy = AdminProxy(_adminAddr);
        bondingCurve = new BondingCurve();
        bondingCurveAddress = address(bondingCurve);
        contentAddress = address(this);
    }

    modifier onlyAuthor(uint tokenID) {
        require(balanceOf(msg.sender, tokenID) > 0, 
                "Must have content authorship tokens");
        _;
    }

    function onERC1155Received(address operator, address from, uint id, uint value, bytes calldata data) 
    external returns (bytes4) {
             contentData[id] = data;
             return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {}

    // function append(string calldata a, string calldata b, string calldata c) internal pure returns (string memory) {
    //     return string(abi.encodePacked(a, b, c));
    // }
    
    // @params data - story, symbol - fungible token 
    function mint(bytes memory tokenSymbol, uint totalSupply, uint ownerStake, uint minPRPrice, bytes memory data) external payable {
        // PUT IN BONDING CURVE METHOD
        // TODO other checks on bonding curve based on additional settings
        require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
        require(msg.value >= settings.MinimumInitialPrice(), "Not enough ETH to mint content");
        require(totalSupply >= settings.MinimumInitialSupply(), "Total Supply too low");
        require(ownerStake <= totalSupply, "Owner stake must be less than supply");
        
        bondingCurve.setCurveParams(tokenSymbol, contentTokenID - 1, totalSupply, ownerStake,  minPRPrice); // token ID is fungible token
        super._mint(contentAddress, contentTokenID, 1, data); // non fungible
        _mintOwnership(msg.sender, 
                       contentTokenID-1, 
                       bondingCurve.getOwnerStake(contentTokenID-1), 
                       bondingCurve.getTokenSymbol(contentTokenID-1));   // fungible
        emit NewContentMinted(contentTokenID-1, msg.sender);
        contentTokenID += settings.ReserveTokenSpaces();  // increment to make space for new content
    }

    function _mintOwnership(address to, uint id, uint amount, bytes memory data) internal {
        require(id % 2 == 0, "TokenID must be ownership token");
        super._mint(to, id, amount, data);
    }

    function submitPR(bytes memory _PRtext, uint _contentTokenID) external payable {
        require(adminProxy.contributionsOpen(), "Contributions are currently closed");
        require(_contentTokenID < contentTokenID, "Content does not exist");
        require(msg.value >= bondingCurve.getMinPRPrice(_contentTokenID-1), "ETH Value is below minimum PR price");
        require(!PRsContract.getPRexists(msg.sender, _contentTokenID), "Address has already submitted a PR for this content within this contribution period");
        PRsContract.submitPR(_PRtext, _contentTokenID, msg.sender, msg.value);
        // future feature should add calculating amount that this PR owner would mint if they are approved (based on their PR price)
        //uint amount = bondingCurve.calculatePurchaseReturn(PRsContract.getPrice(msg.sender, _contentTokenID), msg.sender, _contentTokenID-1);
        emit NewPR(msg.sender, _contentTokenID, msg.value);
    }

    // TODO function for admin to assign vote credits at start of voting; Otherwise there is a bug 
    function _assignVoteCredits() external onlyOwner {
        for (uint tokenId = 0; tokenId < contentTokenID; tokenId=tokenId+2) {
            for (uint i = 0; i < contentAuthors[tokenId].length; i++) {
                address author = contentAuthors[tokenId][i];
                voteCredits[tokenId][author] = balanceOf(author, tokenId) ** 2;
            }
        }
    }

    function vote(address _PRowner, uint _numVotes, bool positive, uint ownertokenId) external onlyAuthor(ownertokenId) {
        require(adminProxy.votingOpen(), "Voting is currently closed");
        require((_numVotes <= voteCredits[ownertokenId][msg.sender]), "Not enough vote credits");
        PRsContract.votePR(_PRowner, _numVotes, positive, ownertokenId);
        voteCredits[ownertokenId][msg.sender] -= (_numVotes ** 2); 
        emit Voted(msg.sender, _PRowner, _numVotes, positive, ownertokenId+1);
    }

    // function voteToComplete(address _PRowner, uint tokenId) external onlyAuthor(tokenId) {

    // }

    // TODO approvePR should be called by the ContentFactory on all contracts at the same time
    // ideally right before calling startContributionPeriod
    // TODO extra security: verify votes have been tallied, contributionsOpen AND votesOpen both false
    // (I think we need a third state where neither are true to avoid edge case new contributions during vote tally)
    function approvePRs() external onlyOwner {
        require(!adminProxy.votingOpen(), "Voting is still open");
        require(!adminProxy.contributionsOpen(), "Contributions are currently open");
        uint _id = 1;   // start with the first piece of content
        while (balanceOf(contentAddress, _id) > 0) {   // for each piece of content
            PRsContract.tallyVotes(_id);
            address PRwinner = PRsContract.determineWinner(_id);
            if (PRwinner != address(0)) {
                _modifyContentandMint(_id, PRwinner);
                emit PRApproved(_id, PRwinner);
            } else { // PRs all had 0 or negative votes, so no PR approved
                emit NoPRApproved(_id);
            }
            PRsContract.clearPRs(_id);
            _id = _id+2;
        }
    }

    function _modifyContentandMint(uint _contentTokenId, address _PRwinner) internal onlyOwner {
        bytes memory winningContent = PRsContract.getContent(_PRwinner, _contentTokenId);
        uint winningPRPrice = PRsContract.getPrice(_PRwinner, _contentTokenId);
        contentData[_contentTokenId] = bytes.concat(contentData[_contentTokenId], " ", winningContent);  // contentData[_contentTokenId] = winningContent;
        uint ownershipTokenId = _contentTokenId -1;
        // existing content + new lines + winning PR
        uint amount = bondingCurve.calculatePurchaseReturn(winningPRPrice, _PRwinner, ownershipTokenId);
        _mintOwnership(_PRwinner, ownershipTokenId, amount, bytes(""));
    }
}
