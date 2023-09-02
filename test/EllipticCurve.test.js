const { ec: EC } = require('elliptic');
const { loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const { generateTable, bundleTable } = require('sdk');

const curve = new EC('p256');
const hex = v => `0x${v.toString(16)}`;

describe("Webauthn", function () {
  function derToRS(der) {
    var offset = 3;
    var dataOffset;

    if (der[offset] == 0x21) {
      dataOffset = offset + 2;
    }
    else {
      dataOffset = offset + 1;
    }
    const r = der.slice(dataOffset, dataOffset + 32);
    offset = offset + der[offset] + 1 + 1
    if (der[offset] == 0x21) {
      dataOffset = offset + 2;
    }
    else {
      dataOffset = offset + 1;
    }
    const s = der.slice(dataOffset, dataOffset + 32);
    return [ r, s ]
  }

  async function deploy() {
    const pubKeyStr = Buffer.from(
      'fdf8bce27f54e06f3aee3b6a542db1ab1f2418d7370a78b150d06965f942b14a470cdee69ab50e610c39b840681bf816b030f4a0a5d5af02ce27dcce6bede89f', 'hex'
    );

    const pubKey = curve.keyFromPublic({ x: pubKeyStr.slice(0, 32), y: pubKeyStr.slice(32) });

    const gen = generateTable(curve.g, pubKey.getPublic(), 4);
    const { factory: BytecodeTable } = bundleTable(gen.table, ethers);

    const [deployer] = await ethers.getSigners();
    const table = await BytecodeTable.connect(deployer).deploy();

    const P256_mul = await ethers.getContractFactory('P256_mul');
    const pubKeyContract = await P256_mul.deploy(table.address);

    const OptimizedCurve = await ethers.getContractFactory('OptimizedCurve');
    const optimizedCurve = await OptimizedCurve.deploy();

    const Webauthn = await ethers.getContractFactory('Webauthn', {
      libraries: { OptimizedCurve: optimizedCurve.address }
    });
    const webauthn = await Webauthn.deploy();

    return { webauthn, pubKey, pubKeyContract };
  }

  it('should verify', async function () {
    const { webauthn, pubKeyContract } = await loadFixture(deploy);

    const signature = Buffer.from("30440220655c9a457615aac594d92fb6d842f0e910e5ee6677cddbcddaea624f3203f0e702207b71a302b06c91a52b9c4ba5a7fb85226738b02c144e8ee177d034022a79c946", "hex");
    const authenticatorData = Buffer.from("f8e4b678e1c62f7355266eaa4dc1148573440937063a46d848da1e25babbd20b010000004d", "hex");
    const clientData = Buffer.from("7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a224e546f2d3161424547526e78786a6d6b61544865687972444e5833697a6c7169316f776d4f643955474a30222c226f726967696e223a2268747470733a2f2f66726573682e6c65646765722e636f6d222c2263726f73734f726967696e223a66616c73657d", "hex");
    const clientChallenge = Buffer.from("353a3ed5a0441919f1c639a46931de872ac3357de2ce5aa2d68c2639df54189d", "hex");

    const challengeOffset = clientData.indexOf("226368616c6c656e6765223a", 0, "hex") + 12 + 1;    
    const signatureParsed = derToRS(signature);

    const sig = [
      ethers.BigNumber.from("0x" + signatureParsed[0].toString('hex')),
      ethers.BigNumber.from("0x" + signatureParsed[1].toString('hex'))
    ];
    const result = await webauthn.validate(
      authenticatorData, 0x01, clientData, clientChallenge, challengeOffset, sig, pubKeyContract.address);
    expect(result);
  });
});

describe("OptimizedCurve", function () {
  async function deploy() {
    const key = curve.keyFromPrivate(
      'be760ee3c44735144cf0861866b3fa188028211b73753f4db6bc0ff964bfa183'
    );
    const pubKey = key.getPublic()

    const gen = generateTable(curve.g, pubKey, 4);
    const { factory: BytecodeTable } = bundleTable(gen.table, ethers);

    const [deployer] = await ethers.getSigners();
    const table = await BytecodeTable.connect(deployer).deploy();

    const P256_mul = await ethers.getContractFactory('P256_mul');
    const multiplier = await P256_mul.deploy(table.address);

    const OptimizedCurve = await ethers.getContractFactory('OptimizedCurve');
    const contract = await OptimizedCurve.deploy();

    const Wrapper = await ethers.getContractFactory(
      'OptimizedCurveWrapper',
      { libraries: { OptimizedCurve: contract.address } }
    );
    const wrapper = await Wrapper.deploy();

    return { key, pubKeyContract: multiplier, contract: wrapper };
  }

  describe("OptimizedCurve", function () {
    it("perform", async function () {
        const { key, contract, pubKeyContract } = await loadFixture(deploy);

      const msg = Buffer.from('hello world');
      const hash = ethers.utils.keccak256(msg);

      const sig = key.sign(hash.slice(2));
      const pubKey = key.getPublic()

      const rs = [hex(sig.r), hex(sig.s)];

      await contract.validateSignature(hash, rs, pubKeyContract.address)

      const pub = pubKey.encode('hex');
      const kkey = curve.keyFromPublic(pub, 'hex');
      const local = kkey.verify(hash.slice(2), { r: rs[0].slice(2), s: rs[1].slice(2) });
      expect(local).to.equal(true);
    });
  });
});

describe('BytecodeTable', function () {
  async function deploy() {
    const key = curve.keyFromPrivate(
      'be760ee3c44735144cf0861866b3fa188028211b73753f4db6bc0ff964bfa183'
    );
    const pubKey = key.getPublic()

    const w = 4;
    const gen = generateTable(curve.g, pubKey, w);
    const { offset: pointsOffset, factory: BytecodeTable } = bundleTable(gen.table, ethers);

    return { key, p: curve.g, q: pubKey, w, gen, pointsOffset, BytecodeTable };
  }

  it('should contain elliptic point curve at the correct index', async () => {
    const { gen, pointsOffset, BytecodeTable } = await loadFixture(deploy);
    const [deployer] = await ethers.getSigners();

    const contract = await BytecodeTable.connect(deployer).deploy();

    const code = await ethers.provider.getCode(contract.address);
    const buffer = Buffer.from(code.slice(2), 'hex');
    
    const n = 5;
    const p1x = buffer.subarray(pointsOffset + n * 64, pointsOffset + n * 64 + 32);
    const p1y = buffer.subarray(pointsOffset + n * 64 + 32, pointsOffset + (n + 1) * 64);

    const point = gen.table[n];

    expect(p1x.toString('hex')).to.equal(point.getX().toString('hex'));
    expect(p1y.toString('hex')).to.equal(point.getY().toString('hex'));
  });
})

describe("P256_mul", function () {
  async function deploy() {
    const key = curve.keyFromPrivate(
      'be760ee3c44735144cf0861866b3fa188028211b73753f4db6bc0ff964bfa183'
    );
    const pubKey = key.getPublic()

    const gen = generateTable(curve.g, pubKey, 4);
    const { factory: BytecodeTable } = bundleTable(gen.table, ethers);

    const [deployer] = await ethers.getSigners();
    const table = await BytecodeTable.connect(deployer).deploy();

    const P256_mul = await ethers.getContractFactory('P256_mul');
    const contract = await P256_mul.deploy(table.address);

    return { key, p: curve.g, q: pubKey, gen, table, contract };
  }

  it('should compute correctly', async function () {
    const { p, q, contract } = await loadFixture(deploy);

    const a = BigInt("0x1654571b36d1b8964f9e7079e4adb4a9e4ae9e631bc6dcfeeec92a7d8f2e2207")
    const b = BigInt("0x0f4308c128ebdccd30f37cb17058ec6077afa8259924d5b6faec6c1b87db3914")

    const expected = p.mul(a.toString(16)).add(q.mul(b.toString(16)))

    const result = await contract.multiply(hex(a), hex(b));

    expect(expected.getX().toString(10)).to.be.equal(result[0].toString());
    expect(expected.getY().toString(10)).to.be.equal(result[1].toString());
  });
});
