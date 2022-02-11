/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-truffle5')
require('solidity-coverage')
require('hardhat-deploy')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')

const { node_url, accounts } = require('./utils/network')

const gasReporterEnabled =
  process.env.REPORT_GAS && process.env.REPORT_GAS.toLowerCase() == 'true'
const gasReporterDollarAmount =
  process.env.REPORT_GAS_DOLLAR &&
  process.env.REPORT_GAS_DOLLAR.toLowerCase() == 'true'

module.exports = {
  solidity: '0.8.11',
  networks: {
    hardhat: {
      accounts: accounts('hardhat'),
    },
    localhost: {
      url: node_url('localhost'),
      accounts: accounts('localhost'),
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
  },
  namedAccounts: {
    localhost: 1,
    rinkeby: 0,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: 'R9ECHH6U5WVVPQJ683W7K96M9MU2Q2VQDC',
  },
  gasReporter: {
    enabled: gasReporterEnabled,
    ...(gasReporterDollarAmount && {
      currency: 'USD',
      gasPrice: 300,
    }),
  },
}
