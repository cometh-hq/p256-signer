const { ethers } = require('hardhat');

async function main() {
  const signer = await ethers.getContractAt("P256Signer", "0x9d298C181Fcb376199c7665560a93F5Ba373F522");

  console.log(signer);
  console.log((await signer.x()).toString(16), (await signer.y()).toString(16));
}

main().catch(console.error);
