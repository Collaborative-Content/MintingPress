// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./libraries/math.sol";

contract BondingCurve {
  
  struct CurveParams {
    bytes tokenSymbol;
    uint tokenID;
    uint totalSupply;
    uint minPRPrice;
    uint ownerStake;
  }
  
  mapping( uint => uint ) public reserveCounter;
  mapping( uint => CurveParams ) public bondingCurveParams;
  event FungibleTokensEmitted(address owner, uint tokenID, uint amount, bytes tokenSymbol);

  constructor() {}

  function setCurveParams(
    bytes memory _tokenSymbol,
    uint _tokenID, 
    uint _totalSupply, 
    uint _ownerStake, 
    uint _minPRPrice
  ) public {
    CurveParams memory temp;
    temp.tokenSymbol = _tokenSymbol;
    temp.tokenID = _tokenID;
    temp.totalSupply = _totalSupply;
    temp.ownerStake = _ownerStake;
    temp.minPRPrice = _minPRPrice;

    bondingCurveParams[_tokenID] = temp;
    reserveCounter[_tokenID] += _ownerStake;
  }

  function calculatePurchaseReturn(uint price, address creator_address, uint tokenID) public returns(uint) {
    require(tokenID % 2 == 0, "Ownership tokenID required");
    require(price >= bondingCurveParams[tokenID].minPRPrice, "Below the minimum value for the pull request");
    uint returnStake;
    returnStake = (bondingCurveParams[tokenID].totalSupply - bondingCurveParams[tokenID].ownerStake)*((mathUtils.ceilSqrt(1 + mathUtils.roundDivision((price * 10000),(bondingCurveParams[tokenID].totalSupply-reserveCounter[tokenID])))/100) - 1)/10;
    //require(_reserveCounter + returnStake < _totalSupply, "No more tokens for sale, check back later!");
    reserveCounter[tokenID] += returnStake;
    emit FungibleTokensEmitted(creator_address, tokenID, returnStake, bondingCurveParams[tokenID].tokenSymbol);
    return returnStake;
  }

  function getOwnerStake(uint _tokenID) public view returns(uint) {
    return bondingCurveParams[_tokenID].ownerStake;
  }

  function getTokenSymbol(uint _tokenID) public view returns(bytes memory) {
    return bondingCurveParams[_tokenID].tokenSymbol;
  }

  function getTotalSupply(uint _tokenID) public view returns(uint) {
    return bondingCurveParams[_tokenID].totalSupply;
  }

  function getMinPRPrice(uint _tokenID) public view returns(uint) {
    return bondingCurveParams[_tokenID].minPRPrice;
  }

  function getTokenId(uint _tokenID) public view returns(uint) {
    return bondingCurveParams[_tokenID].tokenID;
  }
}