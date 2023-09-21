const artifact = require('../artifacts/contracts/P256Signer.sol/P256Signer.json');
const Webauthn = require('../deployments/sepolia/Webauthn.json');

async function main() {
  const bytecode = artifact.bytecode;

  const { length, start } = artifact.linkReferences["contracts/Webauthn.sol"]["Webauthn"][0];

  const { address } = Webauthn;

  // bytecode is not actual bytes, it's a string, each byte takes 2, we add 2 for the `0x` prefix
  const startOffset = start * 2 + 2;
  const endOffset = startOffset + length * 2;


  const finalBytecode = bytecode.slice(0, startOffset) + address.slice(2) + bytecode.slice(endOffset);
  console.log(finalBytecode);
}

main().catch(console.error);
