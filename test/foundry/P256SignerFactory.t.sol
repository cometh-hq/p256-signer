pragma solidity ^0.8.0;

import {P256Signer} from "../../contracts/P256Signer.sol";
import {P256SignerFactory} from "../../contracts/P256SignerFactory.sol";
import {LibClone} from "solady/src/utils/LibClone.sol";

import "forge-std/Test.sol";

contract TestP256SignerFactory is Test {
    address signerImplementation;
    P256SignerFactory factory;

    /// @notice Emitted when a new P256Signer proxy contract is created
    event NewSignerCreated(uint256 indexed x, uint256 indexed y, address signer);

    function setUp() public {
        signerImplementation = address(new P256Signer());
        factory = new P256SignerFactory(signerImplementation);
    }

    function testDeploy() public {
        assertEq(factory.implementation(), signerImplementation);
    }

    function testFuzzCreate(uint256 x, uint256 y) public {
        bytes32 salt = keccak256(abi.encodePacked(x, y));
        address predictedAddress =
            LibClone.predictDeterministicAddress(factory.implementation(), salt, address(factory));
        vm.expectEmit(true, true, true, true, address(factory));
        emit NewSignerCreated(x, y, predictedAddress);
        P256Signer signer = P256Signer(factory.create(x, y));

        assertTrue(signer.initialized());
        assertEq(signer.x(), x);
        assertEq(signer.y(), y);
        // ensure the proxy cannot be initialized again
        vm.expectRevert(P256Signer.AlreadyInitialized.selector);
        signer.initialize(1, 1);
    }
}
