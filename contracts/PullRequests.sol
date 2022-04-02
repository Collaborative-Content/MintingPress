// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";



contract PullRequests is Ownable {

    struct PR {
        bytes content;
        uint blockTimestamp;
        uint positiveVotes;
        uint negativeVotes;
        uint totalVotes;
        uint PRPrice;
    }

    mapping(uint => mapping(address => PR)) public PRs;
    mapping(uint => mapping(address => bool)) public PRexists;
    mapping(uint => address[]) public PRauthors;


    function votePR(address _PRowner, uint _numVotes, bool positive, uint tokenID) external onlyOwner {
        require(PRexists[tokenID][_PRowner], "PR does not exist");
        PR storage votingPR = PRs[tokenID][_PRowner];
        if (positive) {
            votingPR.positiveVotes += _numVotes; 
        } else {
            votingPR.negativeVotes += _numVotes; 
        }
    }

    function submitPR(bytes memory _PRtext, uint tokenID, address caller, uint128 value) external payable onlyOwner {
        // require(!PRexists[tokenID][caller], "Existing PR");
        PRauthors[tokenID].push(caller);
        // tokenID is content token ID
        PRs[tokenID][caller] = PR({content: _PRtext, 
                                       blockTimestamp: block.timestamp,
                                       PRPrice: value,
                                       positiveVotes: 0,
                                       negativeVotes: 0,
                                       totalVotes: 0
                                    });
        PRexists[tokenID][caller] = true;
    }
    
    function determineWinner(uint _tokenId) external view onlyOwner returns (address) {
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

    function clearPRs(uint tokenId) external onlyOwner {
        for (uint i = 0; i < PRauthors[tokenId].length; i++) {
            address PRauthor = PRauthors[tokenId][i];
            PR memory emptyPR;
            PRs[tokenId][PRauthor] = emptyPR;
            PRexists[tokenId][PRauthor] = false;
        }
        delete PRauthors[tokenId];
    }

    function tallyVotes(uint _tokenId) external onlyOwner {
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

    function getContent(address _PRowner, uint tokenID) view external returns (bytes memory) {
        return PRs[tokenID][_PRowner].content;
    }

    function getPrice(address _PRowner, uint tokenID) view external returns (uint) {
        return PRs[tokenID][_PRowner].PRPrice;
    }

    function getPRexists(address _PRowner, uint tokenID) view external returns(bool) {
        return PRexists[tokenID][_PRowner];
    }

}