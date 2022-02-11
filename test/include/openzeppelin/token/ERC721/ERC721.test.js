const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
} = require('./ERC721.behavior')

const ERC721XMock = artifacts.require('ERC721XMock')

contract('ERC721X', function (accounts) {
  const name = 'Non Fungible Token'
  const symbol = 'NFT'

  beforeEach(async function () {
    this.token = await ERC721XMock.new(name, symbol)
  })

  shouldBehaveLikeERC721('ERC721X', ...accounts)
  shouldBehaveLikeERC721Metadata('ERC721X', name, symbol, ...accounts)
})
