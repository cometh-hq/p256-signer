pragma solidity ^0.8.0;

import {Webauthn} from "./Webauthn.sol";
import "hardhat/console.sol";

contract P256Signer {
  uint256 immutable public x;
  uint256 immutable public y;

  bytes4 constant internal EIP1271_MAGICVALUE = 0x1626ba7e;
  bytes4 constant internal OLD_EIP1271_MAGICVALUE = 0x20c13b0b;

  error InvalidSignature();
  error InvalidHash();

  constructor(uint256 _x, uint256 _y) {
    x = _x;
    y = _y;
  }

  function _validate(bytes memory data, bytes memory _signature) private view {
    bytes32 _hash = keccak256(data);
    (
      bytes memory authenticatorData,
      bytes memory clientData,
      uint256 challengeOffset,
      uint256[2] memory rs
    ) = abi.decode(_signature, (bytes, bytes, uint256, uint256[2]));

    bool valid = Webauthn.checkSignature(
      authenticatorData, 0x01, clientData, _hash, challengeOffset, rs, [x, y]
    );
    
    if (!valid) revert InvalidSignature();
  }

  function isValidSignature(bytes32 _hash, bytes memory _signature) public view returns (bytes4) {
    _validate(abi.encode(_hash), _signature);
    return EIP1271_MAGICVALUE;
  }

  function isValidSignature(bytes memory _hash, bytes memory _signature) public view returns (bytes4) {
    _validate(_hash, _signature);
    return OLD_EIP1271_MAGICVALUE;
  }
}
