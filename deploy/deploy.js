const deploy = async (hre) => {
  const {
    deployments: { deploy },
  } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const P256Signer = await deploy("P256Signer", {
    from: deployer.address,
    log: true,
    deterministicDeployment: true,
  });

  const factory = await deploy("P256SignerFactory", {
    from: deployer.address,
    log: true,
    deterministicDeployment: true,
    args: [P256Signer.address],
  });

  /*   await run("verify:verify", {
    address: P256Signer.address,
  }); */
  await run("verify:verify", {
    address: factory.address,
    constructorArguments: [P256Signer.address],
  });
};

module.exports = deploy;
deploy.tags = "p256-signer";
