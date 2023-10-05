pragma solidity ^0.8.0;

import {P256Signer} from "./P256Signer.sol";
import "solady/src/utils/LibClone.sol";

/// @title P256SignerFactory
/// @notice Factory contract for creating proxies for P256Signer
contract P256SignerFactory {
    /// @notice The implementation address of the P256Signer contract
    address public immutable implementation;

    constructor(address implementation_) {
        implementation = implementation_;
    }

    /// @notice Emitted when a new P256Signer proxy contract is created
    event NewSignerCreated(uint256 indexed x, uint256 indexed y, address signer);

    /// @notice Creates a new P256Signer proxy contract
    /// @param x The x coordinate of the public key
    /// @param y The y coordinate of the public key
    function create(uint256 x, uint256 y) external returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(x, y));
        address signer = LibClone.cloneDeterministic(implementation, salt);
        P256Signer(signer).initialize(x, y);
        emit NewSignerCreated(x, y, signer);
        return signer;
    }
}
