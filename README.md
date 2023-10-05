# P256 Signer
This library implements the decoding and verification of a signed [Webauthn](https://www.w3.org/TR/webauthn-2/) payload following the [EIP 1271](https://eips.ethereum.org/EIPS/eip-1271) providing an implementation of Standard Signature Validation Method when the account is a smart contract.

## Contracts overview

### FCL/FCL_elliptic.sol

The `FCL_Elliptic_ZZ` library implements computation of ECDSA verification using the secp256r1 curve.It uses a [XYZZ system coordinates](https://hyperelliptic.org/EFD/g1p/auto-shortw-xyzz.html).
This contract is from [here](https://github.com/rdubois-crypto/FreshCryptoLib/tree/master). The original repository also contains tests.

### Webauthn.sol

The `Webauthn` library implements the decoding and verification of a signed Webauthn payload.

### P256Signer.sol

The `P256Signer` contract represents a Gnosis Safe signer for a given secp256r1 public key.

### P256SignerFactory.sol

The `P256SignerFactory` contract is a factory for P256Signers. It allows us to have deterministic addresses for a given secp256r1 public key.


## Launch tests

Hardhat
```bash
INFURA_ID=<ID> npx hardhat test
```

Forge
```bash
forge test
```