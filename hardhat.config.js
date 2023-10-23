const { ethers } = require("ethers");
const { getDeterministicDeployment } = require('@cometh/contracts-factory');

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-foundry");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
      evmVersion: "paris",
    },
  },
  deterministicDeployment: (network) => {
    const networkName = process.env.HARDHAT_NETWORK ?? '';
    const env = (() => {
      switch (true) {
        case networkName.endsWith('_production'):
          return 'production';
        case networkName.endsWith('_staging'):
          return 'staging';
        default:
          return 'develop';
      }
    })();return getDeterministicDeployment(env)(network);
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.infura.io/v3/" + process.env.INFURA_ID,
        blockNumber: 47134068,
      }
    },
    muster_testnet: {
      url: "https://muster-anytrust.alt.technology",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    muster_testnet_production: {
      url: "https://muster-anytrust.alt.technology",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    muster_testnet_staging: {
      url: "https://muster-anytrust.alt.technology",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    mumbai_production: {
      url: "https://polygon-mumbai.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    mumbai_staging: {
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
    polygon_staging: {
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
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    chiado_production: {
      url: "https://rpc.chiadochain.net",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    avalanche_production: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    fuji: {
      url: "https://rpc.ankr.com/avalanche_fuji",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    fuji_production: {
      url: "https://rpc.ankr.com/avalanche_fuji",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
    polygon_zkevm_testnet_production: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.PRIVATE_KEY || ethers.ZeroHash],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com/"
        }
      },
      {
        network: "polygon_zkevm_testnet",
        chainId: 1442,
        urls: {
          apiURL: "https://testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com/"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};
