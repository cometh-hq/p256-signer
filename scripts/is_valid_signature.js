const hre = require("hardhat");
const Safe = require('./Safe.json');
const Webauthn = require('../artifacts/contracts/Webauthn.sol/Webauthn.json');

async function main() {

  const signer = await ethers.getContractAt("P256Signer", '0x76203006d3aa237041145b0820b10c02aa8153cb');

  const hash = '0x9f37a21d977d696edece789a55eb0c4b0cb5270f0cf98b8ae5bfe57b0c0d75cc';
  const message = '0x1901608cd89d3051538bd71ec68e08ab6ba586d2eb81904649e26a44d36bfbc54d0a4e42699d17cf24a4a952d8469a07235cce13d343c1b92ee8ecfae0236a05deb5';

  const signature = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000024dbd42ad2257b2431e039491bc9157bed9b6b085a8d6f25e10f03b671f4cd8f6d0f5fd2d9fcc050a642881259c1772edccaa70955967ad2238249d73b1c175daa000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a226e7a6569485a6439615737657a6e69615665734d537779314a77384d2d59754b35625f6c6577774e646377222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000';

  //console.log(await signer['isValidSignature(bytes,bytes)'](message, signature));
  //await signer.isValidSignature(hash, signature);

  const safe = await ethers.getContractAt(Safe, '0x3B00f44D3C258Db3C342E5C22ED4492dA8B00beE');

  const encodedSignature =
    ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256'], [signer.address, 65]
    ) +
    '00' +
    ethers.utils.hexZeroPad(ethers.utils.arrayify(signature).length, 32).slice(2) +
    signature.slice(2);

  console.log(encodedSignature)

  try {
    const messageToSign = ethers.utils.hashMessage('0x01')
    console.log(
      await safe['isValidSignature(bytes,bytes)'](
        messageToSign,
        encodedSignature,
        //{ gasLimit: 1_000_000 }
      )
    );
  } catch (err) {
    console.error(err);
    const webauthn = new ethers.utils.Interface(Webauthn.abi)

    console.log(webauthn.parseError(err.data));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
