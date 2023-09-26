const { ethers } = require("ethers");
const { getDeterministicDeployment } = require('@cometh/contracts-factory');

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
  },
  deterministicDeployment: (network) => {
    const networkName = process.env.HARDHAT_NETWORK ?? '';
    const env = networkName.endsWith('_production') ? 'production' : 'develop';
    return getDeterministicDeployment(env)(network);
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.infura.io/v3/" + process.env.INFURA_ID,
        blockNumber: 47134068,
      }
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    mumbai_production: {
      url: "https://polygon-mumbai.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
      gasPrice: Number(ethers.parseUnits('100', 'gwei')),
    },
    polygon_production: {
      url: "https://polygon-mainnet.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
      gasPrice: Number(ethers.parseUnits('100', 'gwei')),
    },
    gnosischain: {
      url: "https://rpc.gnosischain.com",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    gnosischain_production: {
      url: "https://rpc.gnosischain.com",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    }

  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};
