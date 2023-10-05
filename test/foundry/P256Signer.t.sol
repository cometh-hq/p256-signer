pragma solidity ^0.8.0;

import {P256Signer} from "../../contracts/P256Signer.sol";

import "forge-std/Test.sol";

contract TestP256Signer is Test {
    function testDeploy() public {
        P256Signer signer = new P256Signer();
        assertTrue(signer.initialized());
        assertEq(signer.x(), 0);
        assertEq(signer.y(), 0);
    }

    function testRevertInitializeImplementation() public {
        P256Signer signer = new P256Signer();
        vm.expectRevert(P256Signer.AlreadyInitialized.selector);
        signer.initialize(1, 1);
    }
}
