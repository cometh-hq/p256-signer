pragma solidity ^0.8.0;

import {P256Signer} from "./P256Signer.sol";

contract P256SignerFactory {

  event NewSignerCreated(uint256 indexed x, uint256 indexed y, address signer);

  function create(uint256 x, uint256 y) external {
    bytes32 salt = keccak256(abi.encode(x, y));
    address signer = address(new P256Signer{salt: salt}(x, y));

    emit NewSignerCreated(x, y, signer);
  }
}
