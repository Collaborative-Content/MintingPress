// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AdminProxy.sol";

contract Settings is Ownable {

    // @dev note that this is currently just a minimum duration, blocking 
    // admins from ending the vote and contribution periods. 
    uint public VotingDuration;
    uint public ContributionDuration;
    uint8 ReserveTokenSpaces;
    // tokenomics limitations for content to be created
    // TODO verify this is all
    uint public MinimumPRPrice;
    uint public MinimumInitialPrice;
    uint public MinimumInitialSupply;

    event NewMinimumPRPrice(uint amount);
    event NewMinimumInitialPrice(uint amount);
    event NewVotingDuration(uint duration);
    event NewContributionDuration(uint duration);
    event NewMinimumSupply(uint supply);

    constructor() Ownable() {
        // TODO confirm the initial numbers for these vars
        ReserveTokenSpaces = 2;
        VotingDuration = 2 * 86400; // two days
        ContributionDuration = 5 * 86400; // five days
        MinimumPRPrice = 0.01 * 10 ** 18; //0.01 ETH, in wei
        MinimumInitialPrice = 0.1 * 10 ** 18; //0.1 ETH, in wei
        MinimumInitialSupply = 10 ** 18;
    }

    function _setVotingDuration(uint _duration) external onlyOwner() {
        VotingDuration = _duration;
        emit NewVotingDuration(_duration);
    }

    function _setContributionDuration(uint _duration) external onlyOwner() {
        ContributionDuration = _duration;
        emit NewContributionDuration(_duration);
    }

    function _setMinimumPRPrice(uint _amount) external onlyOwner() {
        MinimumPRPrice = _amount;
        emit NewMinimumPRPrice(MinimumPRPrice);
    }

    function _setMinimumInitialPrice(uint _amount) external onlyOwner() {
        MinimumInitialPrice = _amount;
        emit NewMinimumInitialPrice(MinimumInitialPrice);
    }

    function _setMinimumInitialSupply(uint _supply) external onlyOwner() {
        MinimumInitialSupply = _supply;
        emit NewMinimumSupply(MinimumInitialSupply);
}
}