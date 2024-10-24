require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        }
      },
      {
        version: "0.8.26",
       settings: {
    optimizer: { enabled : false, runs : 200 },
    outputSelection: {
      "*": {
        "": ["ast"],
        "*": [
          "abi",
          "metadata",
          "devdoc",
          "userdoc",
          "storageLayout",
          "evm.legacyAssembly",
          "evm.bytecode",
          "evm.deployedBytecode",
          "evm.methodIdentifiers",
          "evm.gasEstimates",
          "evm.assembly"
        ]
      }
    },
    evmVersion: "cancun",
  }
  
    },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },"outputSelection": {
            "*": {
              "*": [
                "evm.bytecode",
                "evm.deployedBytecode",
                "devdoc",
                "userdoc",
                "metadata",
                "abi"
              ]
            }
          }
        }
      },
      {
        version: "0.8.22",
        settings: {
          "optimizer": {
            "enabled": false,
            "runs": 200
          },
          "outputSelection": {
            "*": {
              "*": [
                "evm.bytecode",
                "evm.deployedBytecode",
                "devdoc",
                "userdoc",
                "metadata",
                "abi"
              ]
            }
          }
        }
      }
    ]


  },

  // solidity: "0.8.4",
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  namedAccounts: {
    deployer: {
      default: 0,    // wallet address 0, of the mnemonic in .env
    },
    proxyOwner: {
      default: 1,
    },
  },

  mocha: {
    timeout: 100000000
  },

  networks: {
    base: {
      url: `https://mainnet.base.org/`,
      chainId: 8453,
    },
    
    ethereum: {
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
      chainId: 1,},
    bsc: {
      url: "https://bsc-dataseed1.binance.org",
      chainId: 56,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
     },
    polygon: {
      url: "https://polygon-bor-rpc.publicnode.com",
      chainId: 137,
     },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/G_2eAAdRO4Hqbzt_l3X3VjQOETzssTMv`,
      chainId: 42161,
     },
    optimism: {
      url: `https://mainnet.optimism.io`,
      chainId: 10,
     },
   
},
  etherscan: {
    apiKey: {
      base: 'ZDUYQ3B899161DBBFNDWZF5MK8MZHGINDX',
      ethereum: '',
      bsc: 'GSQQWM2AZ91QUBG7XP339ARQSVB4YYAPHQ',
      arbitrumOne: 'VWY2PECT9QY74VT14HSY2WJV5HQUY96M1T',
      polygon: 'EC9K4SVRF2PXVYY3ZWPS5TH9S48WBWKMGX',
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://api.basescan.org/"
        }
      }
    ]
  }
};
