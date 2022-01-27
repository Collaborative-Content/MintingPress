// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


import "./Settings.sol";
import "./AdminProxy.sol";

contract Content is ERC1155, Ownable {
    AdminProxy immutable adminProxy;
    Settings immutable settings;

    // token IDs 
    uint public constant AUTHORSHIP_TOKENID = 0;
    uint public contentTokenID = 1;
    mapping(uint => string) public contentData;

    bool public contentComplete;

    struct BondingCurve {
        string contentName;
        uint totalSupply;
        uint initialPrice;
        uint minPRPrice;
    }

    BondingCurve bondingCurve;

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

    mapping(address => int) public voteCredits;

    event Voted(address voter, address PRowner, int voteCredits);
    event NewPR(address PRowner, uint PRPrice);

    constructor(address _adminAddr,
                address _settingsAddr, 
                string memory _originalContent,
                address _contentCreator,
                uint totalSupply,
                uint initialPrice,
                uint minPRPrice) 
                ERC1155("") {
        
        settings = Settings(_settingsAddr);
        adminProxy = AdminProxy(_adminAddr);

        require(minPRPrice >= settings.MinimumPRPrice(), "Min PR Price is too low");
        // TODO other checks on bonding curve based on additional settings
        bondingCurve.minPRPrice = minPRPrice;
        bondingCurve.totalSupply = totalSupply;
        bondingCurve.initialPrice = initialPrice;

        contentData[0] = ""; // this is the authorship token ID and thus will have no data associated.
        contentData[contentTokenID] = _originalContent;
        _mint(address(this), contentTokenID, 1, bytes(""));

        // TODO verify number of tokens to be minted, using 1 here for testing for now
        // mint one token0 and send to original content creator (passed through from transaction to ContentFactory)
        _mint(_contentCreator, 0, 1, bytes(""));
    }

    modifier onlyAuthor() {
        require(balanceOf(msg.sender, AUTHORSHIP_TOKENID) > 0, 
                "Must have content authorship tokens");
        _;
    }

    function submitPR(string memory _PRtext) external payable {
        require(adminProxy.contributionsOpen(), 
                "Contributions are currently closed");
        require(!PRexists[msg.sender], "Existing PR");
        require((msg.value >= bondingCurve.minPRPrice), 
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

    function vote(address _PRowner, int _numVotes) external onlyAuthor {
        require(adminProxy.votingOpen(), "Voting is currently closed");
        require((_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
        PR storage votingPR = PRs[msg.sender];
        if (_numVotes >= 0) {
            require((_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
            votingPR.PRVoteTally.positiveVotes += _numVotes; 
        } else {
            require((-_numVotes <= voteCredits[msg.sender]), "Not enough vote credits");
            votingPR.PRVoteTally.negativeVotes -= _numVotes; 
        }
        emit Voted(msg.sender, _PRowner, _numVotes);
    }

    // TODO approvePR should be called by the ContentFactory on all contracts at the same time
    // ideally right before calling startContributionPeriod
    // TODO extra security: verify votes have been tallied, contributionsOpen AND votesOpen both false
    // (I think we need a third state where neither are true to avoid edge case new contributions during vote tally)
    function approvePR() external onlyOwner {
        require(!adminProxy.votingOpen(), "Voting is still open");
        require(!adminProxy.contributionsOpen(), "Contributions are currently open");
        tallyVotes();
        address PRwinner = _determineWinner();
        _modifyContent(PRwinner);
        _clearPRs();
    }

    function tallyVotes() public onlyOwner {
        for (uint i = 0; i < PRauthors.length; i++) {
            PR memory thisPR = PRs[PRauthors[i]];
            int totalVotes;
            totalVotes = thisPR.PRVoteTally.positiveVotes - thisPR.PRVoteTally.negativeVotes;
            PRvotes[PRauthors[i]] = totalVotes;
        }
    }
    
    function _determineWinner() internal onlyOwner returns (address) {
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
            // TODO if there is a tie
        } else {
            return topPRAuthor;
        }
    }

    function _modifyContent(address _PRwinner) internal onlyOwner {
        PR memory winningPR = PRs[_PRwinner];
        uint newcontentTokenID = contentTokenID + 1;
        contentData[newcontentTokenID] = winningPR.content;
        _burn(address(this), contentTokenID, 1);
        _mint(address(this), newcontentTokenID, 1, bytes(""));
        contentTokenID = newcontentTokenID;
        // TODO determine amount of authorship token to mint based on winningPR.PRPrice; using 1 for now?
        // TODO other bonding curve updates
        _mint(_PRwinner, 0, 1, bytes(""));
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
