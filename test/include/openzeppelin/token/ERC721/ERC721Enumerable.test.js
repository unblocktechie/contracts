const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
  shouldBehaveLikeERC721Enumerable,
} = require('./ERC721.behavior')

const ERC721XMock = artifacts.require('ERC721XMock')

contract('ERC721Enumerable', function (accounts) {
  const name = 'Non Fungible Token'
  const symbol = 'NFT'

  beforeEach(async function () {
    this.token = await ERC721XMock.new(name, symbol)
  })

  shouldBehaveLikeERC721('ERC721X', ...accounts)
  shouldBehaveLikeERC721Metadata('ERC721X', name, symbol, ...accounts)
  shouldBehaveLikeERC721Enumerable('ERC721X', ...accounts)
})
