// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./Settings.sol";
import "./Content.sol";

contract AdminProxy is Ownable {
    bool public contributionsOpen;
    bool public votingOpen;
    Content public contentContract;
    address public immutable contentAddress;

    uint lastPeriod;
    uint votingStartTime;
    uint contributionStartTime;

    event ContributionsOpen();
    event VotingOpen();
    
    Settings private settings;

    constructor() {
        settings = new Settings();
        contentContract = new Content(address(this), address(settings));
        contentAddress = address(contentContract);
    }

    // @notice Order of the round is as follows:
    //      admin calls startContributionPeriod() - requires contributionsOpen == votingOpen == false
    //      admin calls startVotingPeriod() - requires ContributionDuration has passed since contributionsStartTime
    //      admin calls endRound() - requires VotingDuration has passed since votingStartTime
    //          this contributionsOpen = votingOpen = false period at end of round allows modifications of content to occur
    //          before contribution period is again opened up.

    function startContributionPeriod() external onlyOwner {
        require(!contributionsOpen && !votingOpen, "Contributions cannot begin until last round has ended");
        contributionsOpen = true;
        votingOpen = false;
        contributionStartTime = block.timestamp;
        emit ContributionsOpen();
    }

    function startVotingPeriod() external onlyOwner {
        require(contributionsOpen && !votingOpen, "Voting must begin after contribution period");
        require(block.timestamp > contributionStartTime + settings.ContributionDuration(), "Voting cannot begin until end of contribution time");
        contentContract._assignVoteCredits();
        contributionsOpen = false; 
        votingOpen = true;
        votingStartTime = block.timestamp;
        emit VotingOpen();
    }

    function endRound() external onlyOwner {
        require(!contributionsOpen && votingOpen, "Round must end after voting period");
        require(block.timestamp > votingStartTime + settings.VotingDuration(), "Round cannot end until end of voting time");
        votingOpen = false;
        contentContract.approvePRs();
    }

}