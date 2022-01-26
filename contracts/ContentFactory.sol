//  SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
// import "contracts/libraries/ABDKMath64x64.sol";
// import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentFactory is ERC1155, Ownable{
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
  ) ERC1155("") {
    _owner = msg.sender;
    _totalSupply = totalSupply;
    _ownerStake = ownerStake;
    _startingPrice = startingPrice;
    _tokenName = tokenName;
    _tokenSymbol = tokenSymbol;
    _content = content;
    tokensOutstanding[msg.sender] = ownerStake;
    _reserveCounter = ownerStake;
    _mint(_owner, 0, _ownerStake, "");
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

  function roundDivision(uint256 n, uint256 d) internal pure returns(uint256) {
    return n / d + (n % d) / (d - d / 2);
  }

  /*TODO: Handle total token supply overflow. */
  function calculatePurchaseReturn(uint256 price, address creater_address) external{
    require(price >= _startingPrice, "Below the minimum value for the pull request");
    uint256 returnStake;
    returnStake = (_totalSupply - _ownerStake)*((ceilSqrt(1 + roundDivision((price * 10000),(_totalSupply-_reserveCounter)))/100) - 1)/10;
    //require(_reserveCounter + returnStake < _totalSupply, "No more tokens for sale, check back later!");
    _reserveCounter += returnStake;
    _mint(creater_address, 0 , returnStake,"");
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

  function ceilSqrt(uint256 number) internal pure returns (uint256){
    uint256 x = squareRoot(number);
    return x*x == number ? x : x+1;
  }

}
