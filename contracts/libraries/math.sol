//  SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

library mathUtils{
  function roundDivision(uint256 n, uint256 d) internal pure returns(uint256) {
    return n / d + (n % d) / (d - d / 2);
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