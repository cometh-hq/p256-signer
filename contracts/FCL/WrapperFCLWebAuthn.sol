pragma solidity ^0.8.0;

import {FCL_WebAuthn} from "FreshCryptoLib/FCL_Webauthn.sol";

/// @title WrapperFCLWebAuthn
/// @notice A library used to verify ECDSA signatures over secp256r1 through
///         EIP-1271 of Webauthn payloads.
/// @dev This lib is only a wrapper around the FCL_WebAuthn library.
///      It is meant to be used with 1271 signatures.
///      The wrapping is necessary because the FCL_WebAuthn has only internal
///      functions and use calldata. This makes it impossible to use it with
///      isValidSignature that use memory.
library WrapperFCLWebAuthn {
    function checkSignature(
        bytes calldata authenticatorData,
        bytes1 authenticatorDataFlagMask,
        bytes calldata clientData,
        bytes32 clientChallenge,
        uint256 clientChallengeDataOffset,
        uint256[2] calldata rs,
        uint256[2] calldata Q
    ) external view returns (bool) {
        return FCL_WebAuthn.checkSignature(
            authenticatorData,
            authenticatorDataFlagMask,
            clientData,
            clientChallenge,
            clientChallengeDataOffset,
            rs,
            Q
        );
    }
}