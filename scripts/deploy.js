// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Webauthn = await ethers.getContractFactory("Webauthn");
  const webauthn = await Webauthn.deploy();
  await webauthn.deployed();

  const P256SignerFactory = await ethers.getContractFactory("P256SignerFactory", {
    libraries: {
      Webauthn: webauthn.address
    }
  });

  const factory = await P256SignerFactory.deploy();
  await factory.deployed();

  console.log(factory.address);

  /*
  const OptimizedCurve = await hre.ethers.getContractFactory("OptimizedCurve");
  const optimizedCurve = await OptimizedCurve.deploy();

  await optimizedCurve.deployed();

  console.log(optimizedCurve.address);

  const Webauthn = await hre.ethers.getContractFactory("Webauthn", { libraries: { OptimizedCurve: optimizedCurve.address } });
  const webauthn = await Webauthn.deploy();

  await webauthn.deployed();

  console.log(webauthn.address);
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
