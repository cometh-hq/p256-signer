const deploy = async (hre) => {
  const {
    deployments: { deploy },
  } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const wrapperFCLWebAuthn = await deploy("WrapperFCLWebAuthn", {
    from: deployer.address,
    log: true,
    deterministicDeployment: true,
  });

  const P256Signer = await deploy("P256Signer", {
    from: deployer.address,
    log: true,
    libraries: {
      WrapperFCLWebAuthn: wrapperFCLWebAuthn.address,
    },
    deterministicDeployment: true,
  });

  const factory = await deploy("P256SignerFactory", {
    from: deployer.address,
    log: true,
    deterministicDeployment: true,
    args: [P256Signer.address],
  });

  await run("verify:verify", { address: wrapperFCLWebAuthn.address });
  await run("verify:verify", {
    address: P256Signer.address,
    libraries: {
      WrapperFCLWebAuthn: wrapperFCLWebAuthn.address,
    },
  });
  await run("verify:verify", { address: factory.address });
};

module.exports = deploy;
deploy.tags = "p256-signer";
