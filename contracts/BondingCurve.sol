// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./libraries/math.sol";
import "./libraries/ABDKMath64X64.sol";
import "./Settings.sol";

contract BondingCurve {

  Settings immutable settingsContract;
  
  struct CurveParams {
    bytes tokenSymbol;
    uint tokenID;
    uint totalSupply;
    uint minPRPrice;
    uint ownerStake;
  }
  
  mapping( uint => int128 ) public reserveCounter;
  mapping( uint => CurveParams ) public bondingCurveParams;
  event FungibleTokensEmitted(address owner, uint tokenID, int128 amount, bytes tokenSymbol);

  constructor() {
    settingsContract = new Settings();
  }

  function setCurveParams(
    bytes memory _tokenSymbol,
    uint _tokenID, 
    uint _totalSupply, 
    uint _ownerStake, 
    uint _minPRPrice
  ) public {
    CurveParams memory temp;
    temp.tokenSymbol = _tokenSymbol;
    temp.tokenID = _tokenID;  // fungible token ID
    temp.totalSupply = _totalSupply;
    temp.ownerStake = _ownerStake;
    temp.minPRPrice = _minPRPrice;

    bondingCurveParams[_tokenID] = temp;
    reserveCounter[_tokenID] += ABDKMath64x64.fromUInt(_ownerStake);
  }

  modifier onlyOwnershipTokens(uint tokenID) {
    require(tokenID % settingsContract.ReserveTokenSpaces() == 0, "Ownership tokenID required");
    _;
  }

  function calculatePurchaseReturn(uint256 price, address creator_address, uint _ownershipTokenId) public onlyOwnershipTokens(_ownershipTokenId) returns(int128) {
    require(price >= bondingCurveParams[_ownershipTokenId].minPRPrice, "Below the minimum value for the pull request");
    int128 returnStake;
    int128 y = ABDKMath64x64.sqrt(1 + ABDKMath64x64.div(ABDKMath64x64.fromUInt(price), (ABDKMath64x64.fromUInt(bondingCurveParams[_ownershipTokenId].totalSupply)-reserveCounter[_ownershipTokenId])));
    int128 x = ABDKMath64x64.fromUInt(bondingCurveParams[_ownershipTokenId].totalSupply) - ABDKMath64x64.fromUInt(bondingCurveParams[_ownershipTokenId].ownerStake);
    returnStake = ABDKMath64x64.mul(x,y) - 1;
    require(reserveCounter[_ownershipTokenId] + returnStake < ABDKMath64x64.fromUInt(bondingCurveParams[_ownershipTokenId].totalSupply), "No more tokens for sale, check back later!");
    reserveCounter[_ownershipTokenId] += returnStake;
    emit FungibleTokensEmitted(creator_address, _ownershipTokenId, returnStake, bondingCurveParams[_ownershipTokenId].tokenSymbol);
    return returnStake;
  }

  function getOwnerStake(uint _ownershipTokenId) public view onlyOwnershipTokens(_ownershipTokenId) returns(uint) {
    return bondingCurveParams[_ownershipTokenId].ownerStake;
  }

  function getTokenSymbol(uint _ownershipTokenId) public view onlyOwnershipTokens(_ownershipTokenId) returns(bytes memory) {
    return bondingCurveParams[_ownershipTokenId].tokenSymbol;
  }

  function getTotalSupply(uint _ownershipTokenId) public view onlyOwnershipTokens(_ownershipTokenId) returns(uint) {
    return bondingCurveParams[_ownershipTokenId].totalSupply;
  }

  function getMinPRPrice(uint _ownershipTokenId) public view onlyOwnershipTokens(_ownershipTokenId) returns(uint) {
    return bondingCurveParams[_ownershipTokenId].minPRPrice;
  }

  function getTokenId(uint _ownershipTokenId) public view onlyOwnershipTokens(_ownershipTokenId) returns(uint) {
    return bondingCurveParams[_ownershipTokenId].tokenID;
  }
}