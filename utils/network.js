require('dotenv/config')
function node_url(networkName) {
  if (networkName) {
    const uri = process.env['ETH_NODE_URI_' + networkName.toUpperCase()]
    if (uri && uri !== '') {
      return uri
    }
  }

  let uri = process.env.ETH_NODE_URI
  if (uri) {
    uri = uri.replace('{{networkName}}', networkName)
  }
  if (!uri || uri === '') {
    if (networkName === 'localhost') {
      return 'http://localhost:8545'
    }
    return ''
  }
  if (uri.indexOf('{{') >= 0) {
    throw new Error(
      `invalid uri or network not supported by node provider : ${uri}`,
    )
  }
  return uri
}

function getMnemonic(networkName) {
  if (networkName) {
    const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()]
    if (mnemonic && mnemonic !== '') {
      return mnemonic
    }
  }

  const mnemonic = process.env.MNEMONIC
  if (!mnemonic || mnemonic === '') {
    return 'test test test test test test test test test test test junk'
  }
  return mnemonic
}

function accounts(networkName) {
  const accountCount = parseInt(process.env.ACCOUNT_COUNT) || 20
  return {
    mnemonic: getMnemonic(networkName),
    count: accountCount,
  }
}

module.exports = {
  node_url,
  accounts,
}
