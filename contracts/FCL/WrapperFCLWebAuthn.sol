pragma solidity ^0.8.0;

import {FCL_WebAuthn} from "FreshCryptoLib/FCL_Webauthn.sol";

/// @title WrapperFCLWebAuthn
/// @notice A contract used to verify ECDSA signatures over secp256r1 through
///         EIP-1271 of Webauthn payloads.
/// @dev This contract is only a wrapper around the FCL_WebAuthn library.
///      It is meant to be used with 1271 signatures.
///      The wrapping is necessary because the library is not compatible with
///      memory and only works with calldata.
contract WrapperFCLWebAuthn {
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