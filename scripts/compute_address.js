const ethers = require("ethers");

async function main() {
  x = "0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92"; // to set
  y = "0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f"; // to set

  // P256SignerFactory contract address
  from = "0x5b1D6E2D364DB7d4c7e3d1324a00680065dBD176"; // to verify

  // P256Signer contract address
  implementation = "0x47F4A373FDa84823129f01532D5e32935389EC81"; // to verify

  // Compute salt
  salt = ethers.keccak256(
    ethers.solidityPacked(["uint256", "uint256"], [x, y])
  );

  // Init code of minimal proxy from solady 0.0.123
  initCode =
    "0x602c3d8160093d39f33d3d3d3d363d3d37363d73" +
    implementation.substring(2) +
    "5af43d3d93803e602a57fd5bf3";
  initCodeHash = ethers.keccak256(initCode);

  // Compute address
  computedAddress = ethers.getCreate2Address(from, salt, initCodeHash);

  // Bytecode
  // See https://github.com/Vectorized/solady/blob/08901b1131be4903e989884571198d72de1c0ee9/src/utils/LibClone.sol#L55
  bytecode = "0x" + initCode.substring(20);

  console.log("Address:", computedAddress);
  console.log("Bytecode:", bytecode);
}

main().catch(console.error);