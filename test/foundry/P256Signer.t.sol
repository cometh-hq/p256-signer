pragma solidity ^0.8.0;

import {P256Signer} from "../../contracts/P256Signer.sol";
import {P256SignerFactory} from "../../contracts/P256SignerFactory.sol";
import {InvalidClientData} from "../../contracts/Webauthn.sol";

import "forge-std/Test.sol";

contract TestP256Signer is Test {
    P256Signer signer;
    P256Signer signerInstance;
    P256SignerFactory factory;

    // A valid P256 public key
    uint256 x = 0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92;
    uint256 y = 0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f;
    // Valid Webauthn signature
    bytes signature =
        hex"00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000024f96f45dc5dd16534b2bcc45b87b71b3cfd413a6bcb288e643895bd3477203d74a11c98f8421c52839fff32d61140e793d353a47319bfe0dfd2af18af1d8f016b000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22704a76594669576e4174537138646c72426f6a7243724135454a7846417852757071504b39737077744430222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000";
    bytes messageToSign = hex"cdf841e2c26037e4331174c05ee3e822c5cb6c076b70101637af03284c56e29e";

    function setUp() public {
        signer = new P256Signer();
        factory = new P256SignerFactory(address(signer));
        signerInstance = P256Signer(factory.create(x, y));
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

    function testIsValidSignatureOld() public {
        bytes memory signatureMem = signature;
        bytes memory messageToSignMem = messageToSign;
        assertEq(signerInstance.isValidSignature(messageToSignMem, signatureMem), bytes4(0x20c13b0b));
    }

    // Here Webauthn.checkSignature from _validate will revert
    // To harden the test, a way needs to be found for Webauthn.checkSignature to return false
    // Once done, test that a revert with InvalidSignature() is expected
    function testFuzzRevertInvalidSignatureOld(bytes memory signature_) public {
        bytes memory messageToSignMem = messageToSign;
        vm.expectRevert(bytes(""));
        signerInstance.isValidSignature(messageToSignMem, signature_);
    }

    function testFuzzRevertInvalidMessageToSignValidSignatureOld(bytes memory messageToSign_) public {
        vm.assume(keccak256(messageToSign_) != keccak256(messageToSign));
        bytes memory signatureMem = signature;
        vm.expectRevert(InvalidClientData.selector);
        signerInstance.isValidSignature(messageToSign_, signatureMem);
    }
}
