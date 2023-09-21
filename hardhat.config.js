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
  deterministicDeployment: getDeterministicDeployment,
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
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
      gasPrice: Number(ethers.parseUnits('100', 'gwei')),
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_ID,
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
