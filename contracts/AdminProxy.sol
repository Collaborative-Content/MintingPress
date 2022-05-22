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
    Settings public settings;
    address public immutable settingsAddress;

    uint lastPeriod;
    uint votingStartTime;
    uint contributionStartTime;

    event ContributionsOpen();
    event VotingOpen();

    constructor() {
        settings = new Settings();
        settingsAddress = address(settings);
        contentContract = new Content(address(this), address(settings));
        contentAddress = address(contentContract);
    }

    // @notice Order of the round is as follows:
    // admin calls startContributionPeriod() - requires contributionsOpen == votingOpen == false, sets contributionsOpen = True
    // admin calls startVotingPeriod() - requires ContributionDuration has passed since contributionsStartTime
    // admin calls endRound() - requires VotingDuration has passed since votingStartTime
    //     this contributionsOpen == votingOpen == false period after endRound() is called allows modifications of content to
    //     occur (minting & burning) before contribution period is again opened up

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
        contributionsOpen = false;
        votingOpen = true;
        contentContract.assignVoteCredits();
        votingStartTime = block.timestamp;
        emit VotingOpen();
    }

    function endRound() external onlyOwner {
        require(!contributionsOpen && votingOpen, "Round must end after voting period");
        require(block.timestamp > votingStartTime + settings.VotingDuration(), "Round cannot end until end of voting time");
        contributionsOpen = false;
        votingOpen = false;
        contentContract.approvePRs();
    }

}