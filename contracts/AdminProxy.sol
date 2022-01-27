// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Settings.sol";

contract AdminProxy is Ownable {
    bool public contributionsOpen;
    bool public votingOpen;

    uint lastPeriod;
    uint votingStartTime;
    uint contributionStartTime;

    event ContributionsOpen();
    event VotingOpen();
    
    Settings private settings;

    constructor(address _settings) {
        settings = Settings(_settings);
    }
    
    // ToDO : enhance this
    modifier areWeThereYet(uint _secondsElapsed) {
        require(block.timestamp > lastPeriod + _secondsElapsed, "Cannot initiate next period yet");
        lastPeriod = block.timestamp;
        if (contributionsOpen) {
            contributionsOpen = false; 
            votingOpen = true;
        } else {
            contributionsOpen = true;
            votingOpen = false;
        }
        _; 
    }

    function startContributionPeriod() external onlyOwner areWeThereYet(settings.VotingDuration()) {
        emit ContributionsOpen();
    }

    function startVotingPeriod() external onlyOwner areWeThereYet(settings.ContributionDuration()) {
        emit VotingOpen();
    }

}