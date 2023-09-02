
const hre = require("hardhat");

async function main() {
  const factory = await ethers.getContractAt(
    "P256SignerFactory",
    '0xdF51EE1ab0f0Ee8A128a7BCA2d7641636A1a7EC4'
  );

  const x = '0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92';
  const y = '0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f';

  const tx = await factory.create(x, y);
  console.log(tx.hash);

  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
