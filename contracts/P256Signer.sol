pragma solidity ^0.8.0;

import {Webauthn} from "./Webauthn.sol";
import "solady/src/utils/Clone.sol";

/// @title P256Signer
/// @notice A contract that can be used to verify signatures from a secp256r1 public key
/// @dev This contract is the implementation. It is meant to be used through
///      proxy clone.
contract P256Signer is Clone {

  /// @notice The EIP-1271 magic value
  bytes4 constant internal EIP1271_MAGICVALUE = 0x1626ba7e;
  
  /// @notice The old EIP-1271 magic value
  bytes4 constant internal OLD_EIP1271_MAGICVALUE = 0x20c13b0b;
  
  /// @notice The x coordinate of the public key
  /// @dev It uses the Clone helper library to get the x coordinate
  ///      from calldata
  function x() public pure returns (uint256) {
    return _getArgUint256(0);
  }

  /// @notice The y coordinate of the public key
  /// @dev It uses the Clone helper library to get the y coordinate
  ///      from calldata
  function y() public pure returns (uint256) {
    return _getArgUint256(32);
  }

  /// @notice Error message when the signature is invalid
  error InvalidSignature();
  /// @notice Error message when the hash is invalid
  error InvalidHash();

  function _validate(bytes memory data, bytes memory _signature) private view {
    bytes32 _hash = keccak256(data);
    (
      bytes memory authenticatorData,
      bytes memory clientData,
      uint256 challengeOffset,
      uint256[2] memory rs
    ) = abi.decode(_signature, (bytes, bytes, uint256, uint256[2]));

    bool valid = Webauthn.checkSignature(
      authenticatorData, 0x01, clientData, _hash, challengeOffset, rs, [x(), y()]
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
