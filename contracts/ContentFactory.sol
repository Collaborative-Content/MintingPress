// //  SPDX-License-Identifier: UNLICENSED

// pragma solidity ^0.8.0;
// import "contracts/libraries/math.sol";
// // import "abdk-libraries-solidity/ABDKMath64x64.sol";
// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract ContentFactory is ERC1155, Ownable{
//   address private _owner;
//   uint256 public _totalSupply;
//   uint256 public _ownerStake;
//   uint256 public _startingPrice;
//   bytes32 public _tokenName;
//   bytes32 public _tokenSymbol;
//   mapping(uint256 => mapping(address => uint256 )) public tokensOutstanding;
//   mapping(uint256 => uint256) _reserveCounter;
//   string public _content;
//   event Tokens(uint256, uint256, bytes32);

  
//   constructor(uint totalSupply, 
//   uint ownerStake, 
//   uint startingPrice, 
//   bytes32  tokenName, 
//   bytes32  tokenSymbol, 
//   string memory content
//   ) ERC1155("") {
//     _owner = msg.sender;
//     _totalSupply = totalSupply;
//     _ownerStake = ownerStake;
//     _startingPrice = startingPrice;
//     _tokenName = tokenName;
//     _tokenSymbol = tokenSymbol;
//     _content = content;
//     tokensOutstanding[0][msg.sender] = ownerStake;
//     _reserveCounter[0] = ownerStake;
//     _mint(_owner, 0, _ownerStake, "");
//   }

//   function setValues(uint totalSupply, 
//   uint ownerStake, 
//   uint startingPrice, 
//   string memory tokenName, 
//   string memory tokenSymbol, 
//   string memory content) public {
//     _totalSupply = totalSupply;
//     _ownerStake = ownerStake;
//     _startingPrice = startingPrice;
//     _tokenName = tokenName;
//     _tokenSymbol = tokenSymbol;
//     _content = content;
//   }

//   function createContent() public returns(uint256) {}
//   function getBalances(address sender) external view returns(uint256) {
//     return tokensOutstanding[sender];
//   }

//   /*TODO: Handle total token supply overflow. */
//   function calculatePurchaseReturn(uint256 price, address creater_address, uint256 tokenID) external{
//     require(tokenID % 2 == 0, "Ownership tokenID required");
//     // TODO update to use tokenID
//     require(price >= _startingPrice, "Below the minimum value for the pull request");
//     uint256 returnStake;
//     returnStake = (_totalSupply - _ownerStake)*((mathUtils.ceilSqrt(1 + mathUtils.roundDivision((price * 10000),(_totalSupply-_reserveCounter)))/100) - 1)/10;
//     //require(_reserveCounter + returnStake < _totalSupply, "No more tokens for sale, check back later!");
//     _reserveCounter[tokenID] += returnStake;
//     _mint(creater_address, tokenID , returnStake,"");
//     emit Tokens(tokenID, returnStake, _tokenSymbol);
//   }




// }
