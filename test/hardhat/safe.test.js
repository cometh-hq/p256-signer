const SafeABI = require('./abis/Safe.json');
const SafeFactoryABI = require('./abis/SafeFactory.json');
const { expect } = require("chai");

const factoryAddress = '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2';

describe("Gnosis Safe", function () {
  
  it('should deploy a Safe, add a p256 signer and verify a signature with Webauthn', async () => {
    const signer = await ethers.getImpersonatedSigner('0xb908ca274f85c4732640aaf44a99543ab63c7626');

    const WrapperFCLWebAuthn = await ethers.getContractFactory("WrapperFCLWebAuthn");
    const wrapperFCLWebAuthn = await WrapperFCLWebAuthn.connect(signer).deploy();
    await wrapperFCLWebAuthn.waitForDeployment();

    const P256SignerImplementationFactory = await ethers.getContractFactory("P256Signer",  {
      libraries: {
        WrapperFCLWebAuthn: await wrapperFCLWebAuthn.getAddress()
      }
    });
  
    const implementation = await P256SignerImplementationFactory.connect(signer).deploy();
    await implementation.waitForDeployment();

    const P256SignerFactory = await ethers.getContractFactory("P256SignerFactory");

    const factory = await P256SignerFactory.connect(signer).deploy(implementation);
    await factory.waitForDeployment();

    const x = '0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92';
    const y = '0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f';

    const deploySignerTx = await factory.create(x, y);
    const deploySignerReceipt = await deploySignerTx.wait();

    const p256SignerAddress = deploySignerReceipt.logs[0].args.signer;

    const safeFactory = await ethers.getContractAt(SafeFactoryABI, factoryAddress);

    const Safe = new ethers.Interface(SafeABI);

    const singleton = '0x3E5c63644E683549055b9Be8653de26E0B4CD36E';
    const initializer = Safe.encodeFunctionData("setup", [
      /*signers*/ [p256SignerAddress],
      /*threshold */ 1,
      /*to*/ ethers.ZeroAddress,
      /*data*/ '0x',
      /*fallbackHandler*/ '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      /*paymentToken*/ ethers.ZeroAddress,
      /*payment*/ 0,
      /*paymentReceiver*/ ethers.ZeroAddress
    ]);

    const salt = ethers.zeroPadValue('0x12', 32);

    const deploySafeTx = await safeFactory.connect(signer).createProxyWithNonce(singleton, initializer, salt);
    const deploySafeReceipt = await deploySafeTx.wait();

    const safeAddress = deploySafeReceipt.logs[1].args.proxy;
    const safe = await ethers.getContractAt(SafeABI, safeAddress);

    const messageToSign = '0xcdf841e2c26037e4331174c05ee3e822c5cb6c076b70101637af03284c56e29e';

    const signature = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000024f96f45dc5dd16534b2bcc45b87b71b3cfd413a6bcb288e643895bd3477203d74a11c98f8421c52839fff32d61140e793d353a47319bfe0dfd2af18af1d8f016b000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22704a76594669576e4174537138646c72426f6a7243724135454a7846417852757071504b39737077744430222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000';

  const encodedSignature =
    ethers.AbiCoder.defaultAbiCoder().encode(
    ['uint256', 'uint256'], [p256SignerAddress, 65]
    ) +
    '00' +
    ethers.zeroPadValue(ethers.toBeHex(ethers.getBytes(signature).length), 32).slice(2) +
    signature.slice(2);

    const result = await safe['isValidSignature(bytes,bytes)'](messageToSign, encodedSignature)
    expect(result).to.equal('0x20c13b0b');
  });
});

