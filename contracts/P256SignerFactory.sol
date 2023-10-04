pragma solidity ^0.8.0;

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
    function create(uint256 x, uint256 y) external {
        bytes memory args = abi.encodePacked(x, y);
        bytes32 salt = keccak256(args);
        address signer = LibClone.cloneDeterministic(implementation, args, salt);
        emit NewSignerCreated(x, y, signer);
    }
}
