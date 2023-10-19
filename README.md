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

## Signature malleability
Clients need to note there is a potential signature malleability by replacing `(r, s)` by `(r, -s mod n)`.
It is the responsibility of the client to check the message signed is played only once if necessary.

## Launch tests

You will need `INFURA_ID=<your_infura_id>` in your env variables.  
You will need forge installed, see foundry book for instructions [here](https://book.getfoundry.sh/getting-started/installation).

Install FCL dependency:
```bash
forge install
```

To launch both hardhat and forge tests:
```bash
yarn test
```

### Hardhat
```bash
npx hardhat test
```

### Forge
```bash
forge test
```

## Deploy

```bash
HARDHAT_NETWORK=<target_network> npx hardhat deploy
```