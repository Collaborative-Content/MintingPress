//  SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ContentFactory is Ownable{
  address private _owner;
  uint256 public _totalSupply;
  uint256 public _ownerStake;
  uint256 public _startingPrice;
  string public _tokenName;
  string public _tokenSymbol;
  mapping( address => uint256 ) public tokensOutstanding;
  uint256 private _reserveCounter;
  string public _content;
  event Tokens(uint256);
  
  constructor(uint totalSupply, 
  uint ownerStake, 
  uint startingPrice, 
  string memory tokenName, 
  string memory tokenSymbol, 
  string memory content
  ) {
    _owner = msg.sender;
    _totalSupply = totalSupply;
    _ownerStake = ownerStake;
    _startingPrice = startingPrice;
    _tokenName = tokenName;
    _tokenSymbol = tokenSymbol;
    _content = content;
    tokensOutstanding[msg.sender] = ownerStake;
    _reserveCounter = ownerStake;
  }

  function setValues(uint totalSupply, 
  uint ownerStake, 
  uint startingPrice, 
  string memory tokenName, 
  string memory tokenSymbol, 
  string memory content) public {
    _totalSupply = totalSupply;
    _ownerStake = ownerStake;
    _startingPrice = startingPrice;
    _tokenName = tokenName;
    _tokenSymbol = tokenSymbol;
    _content = content;
  }

  function createContent() public returns(uint256) {}
  function getBalances(address sender) external view returns(uint256) {
    return tokensOutstanding[sender];
  }

  /*TODO: Handle total token supply overflow. */
  function calculatePurchaseReturn(uint256 price) external {
    require(price >= _startingPrice, "Below the minimum value for the pull request");
    uint256 returnStake;
    returnStake = (_totalSupply - _ownerStake)*(((squareRoot((1 + ((price * 100)/_reserveCounter)))) - 1)/10);
    //require(_reserveCounter + returnStake < _totalSupply, "No more tokens for sale, check back later!");
    _reserveCounter += returnStake;
    emit Tokens(returnStake);
  }

  // No square root in solidity - using the babylonian square root method.
  // I really hope this does not cost a fortune in gas!
  function squareRoot(uint256 number) internal pure returns(uint256) {
    uint256 x = number / 2 + 1;
    uint256 y = (x + number / x) / 2;
    while(x > y) {
      x = y;
      y = (x + number / x) / 2;
    }
    return x;
  } 
}
