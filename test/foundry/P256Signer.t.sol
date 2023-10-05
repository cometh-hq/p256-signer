pragma solidity ^0.8.0;

import {P256Signer} from "../../contracts/P256Signer.sol";

import "forge-std/Test.sol";

contract TestP256Signer is Test {
    P256Signer signer;

    function setUp() public {
        signer = new P256Signer();
    }

    function testDeploy() public {
        assertTrue(signer.initialized());
        assertEq(signer.x(), 0);
        assertEq(signer.y(), 0);
    }

    function testRevertInitializeImplementation() public {
        vm.expectRevert(P256Signer.AlreadyInitialized.selector);
        signer.initialize(1, 1);
    }
}
