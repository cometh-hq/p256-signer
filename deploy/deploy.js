const deploy = async (hre) => {
  const {
    deployments: { deploy },
  } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const webauthn = await deploy("Webauthn", {
    from: deployer.address,
    log: true,
    deterministicDeployment: true,
  });

  const factory = await deploy("P256SignerFactory", {
    from: deployer.address,
    log: true,
    libraries: {
        Webauthn: webauthn.address
    },
    deterministicDeployment: true,
  });

  await run("verify:verify", { address: webauthn.address });
  await run("verify:verify", {
    address: factory.address,
    libraries: {
      Webauthn: webauthn.address,
    },
  });
};

module.exports = deploy;
deploy.tags = 'p256-signer';
