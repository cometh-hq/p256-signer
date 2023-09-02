const SafeABI = require('./Safe.abi.json');
const SafeFactoryABI = require('./SafeFactory.abi.json');

const factoryAddress = '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2';

describe.only("Gnosis Safe", function () {
  it.only('', async () => {
    const signer = await ethers.getImpersonatedSigner('0xb908ca274f85c4732640aaf44a99543ab63c7626');

    const Webauthn = await ethers.getContractFactory("Webauthn");
    const webauthn = await Webauthn.connect(signer).deploy();
    await webauthn.deployed();

    const P256SignerFactory = await ethers.getContractFactory("P256SignerFactory", {
      libraries: {
        Webauthn: webauthn.address
      }
    });

    const factory = await P256SignerFactory.connect(signer).deploy();
    await factory.deployed();

    const x = '0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92';
    const y = '0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f';

    const deploySignerTx = await factory.create(x, y);
    const deploySignerReceipt = await deploySignerTx.wait();

    const p256SignerAddress = deploySignerReceipt.events[0].args.signer;
    const p256Signer = await ethers.getContractAt('P256Signer', p256SignerAddress);

    const safeFactory = await ethers.getContractAt(SafeFactoryABI, factoryAddress);

    const Safe = new ethers.utils.Interface(SafeABI);


    const singleton = '0x3E5c63644E683549055b9Be8653de26E0B4CD36E';
    const initializer = Safe.encodeFunctionData("setup", [
      /*signers*/ [p256Signer.address],
      /*threshold */ 1,
      /*to*/ ethers.constants.AddressZero,
      /*data*/ [],
      /*fallbackHandler*/ '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      /*paymentToken*/ ethers.constants.AddressZero,
      /*payment*/ 0,
      /*paymentReceiver*/ ethers.constants.AddressZero
    ]);

    const salt = ethers.utils.hexZeroPad('0x12', 32);

    const deploySafeTx = await safeFactory.connect(signer).createProxyWithNonce(singleton, initializer, salt);
    const deploySafeReceipt = await deploySafeTx.wait();

    const safeAddress = deploySafeReceipt.events[1].args.proxy;
    const safe = await ethers.getContractAt(SafeABI, safeAddress);

    const messageToSign = '0xcdf841e2c26037e4331174c05ee3e822c5cb6c076b70101637af03284c56e29e';

    const signature = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000024f96f45dc5dd16534b2bcc45b87b71b3cfd413a6bcb288e643895bd3477203d74a11c98f8421c52839fff32d61140e793d353a47319bfe0dfd2af18af1d8f016b000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22704a76594669576e4174537138646c72426f6a7243724135454a7846417852757071504b39737077744430222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000';

  const encodedSignature =
    ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256'], [p256Signer.address, 65]
    ) +
    '00' +
    ethers.utils.hexZeroPad(ethers.utils.arrayify(signature).length, 32).slice(2) +
    signature.slice(2);

    console.log(safe.address);

    console.log(await safe['isValidSignature(bytes,bytes)'](messageToSign, encodedSignature));
  });

  it('should create a safe, add P256 as owner and make a transaction', async () => {
    const safeFactory = await ethers.getContractAt(SafeFactoryABI, factoryAddress);

    const Safe = new ethers.utils.Interface(SafeABI);

    const signer = await ethers.getImpersonatedSigner('0xb908ca274f85c4732640aaf44a99543ab63c7626');

    const singleton = '0x3E5c63644E683549055b9Be8653de26E0B4CD36E';
    const initializer = Safe.encodeFunctionData("setup", [
      /*signers*/ [signer.address],
      /*threshold */ 1,
      /*to*/ ethers.constants.AddressZero,
      /*data*/ [],
      /*fallbackHandler*/ '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
      /*paymentToken*/ ethers.constants.AddressZero,
      /*payment*/ 0,
      /*paymentReceiver*/ ethers.constants.AddressZero
    ]);

    const salt = ethers.utils.hexZeroPad('0x12', 32);

    const deploySafeTx = await safeFactory.connect(signer).createProxyWithNonce(singleton, initializer, salt);
    const deploySafeReceipt = await deploySafeTx.wait();

    const safeAddress = deploySafeReceipt.events[1].args.proxy;
    const safe = await ethers.getContractAt(SafeABI, safeAddress);

    const Webauthn = await ethers.getContractFactory("Webauthn");
    const webauthn = await Webauthn.connect(signer).deploy();
    await webauthn.deployed();

    const P256SignerFactory = await ethers.getContractFactory("P256SignerFactory", {
      libraries: {
        Webauthn: webauthn.address
      }
    });

    const factory = await P256SignerFactory.connect(signer).deploy();
    await factory.deployed();

    const x = '0x6391e7beef1b4190a59dbd8b56df46efe1115426b644f8649221245f4d14ea92';
    const y = '0x5520dc0624735c802116c71e61721e7ef9f443b545c7b8c1a40dd5e194684a9f';

    const deploySignerTx = await factory.create(x, y);
    const deploySignerReceipt = await deploySignerTx.wait();

    const p256SignerAddress = deploySignerReceipt.events[0].args.signer;
    const p256Signer = await ethers.getContractAt('P256Signer', p256SignerAddress);


    const hash = '0x1901608cd89d3051538bd71ec68e08ab6ba586d2eb81904649e26a44d36bfbc54d0a3f175b16d6f9243534a338e81948e34823e5d7990f890313f524eecc2d9845b0';

    const signature = '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000248bf676a4279e2fd24b619ca848c1b323569feec8de3b6cdb5f3ad8dc38494dd1ecd1c4f6a84286f3f7db384cef05310c2c41b07f7264b41a877bccd2df7c6d44000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2255457351654c444c5654583752664d77393766326b57304c6168386d4f4b43653754767357684858553230222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000';

    console.log(ethers.utils.keccak256('0x1901608cd89d3051538bd71ec68e08ab6ba586d2eb81904649e26a44d36bfbc54d0a3f175b16d6f9243534a338e81948e34823e5d7990f890313f524eecc2d9845b0'))
    //console.log(await p256Signer['isValidSignature(bytes,bytes)'](hash, signature));
  });
});

