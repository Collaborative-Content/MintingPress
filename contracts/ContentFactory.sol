//  SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ContentFactory is Ownable{
  address private _owner;
  uint private _totalSupply;
  uint private _ownerStake;
  uint private _startingPrice;
  string private _tokenName;
  string private _tokenSymbol;
  mapping( address => uint256 ) private _tokensOutstanding;
  string private _content;
  
  
  constructor(uint totalSupply, 
  uint ownerStake, 
  uint startingPrice, 
  string memory tokenName, 
  string memory tokenSymbol, 
  string memory content) {
    _owner = msg.sender;
    _totalSupply = totalSupply;
    _ownerStake = ownerStake;
    _startingPrice = startingPrice;
    _tokenName = tokenName;
    _tokenSymbol = tokenSymbol;
    _content = content;
  }

  event Greet(string message);
  
  function test() public {
    emit Greet("hello world!");
  }

}
