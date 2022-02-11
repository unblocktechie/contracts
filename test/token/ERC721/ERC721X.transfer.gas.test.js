const { BN, constants } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const { web3, artifacts } = require('hardhat')
const { ZERO_ADDRESS } = constants

const ERC721XMock = artifacts.require('ERC721XMock')
const ERC721AMock = artifacts.require('ERC721AMock')
const ERC721Mock = artifacts.require('ERC721Mock')

if (!process.env.REPORT_GAS || !process.env.REPORT_GAS.toLowerCase() == 'true')
  throw new Error('Please run with environmental variable REPORT_GAS=true')

contract('ERC721X: Gas usage when transferring 1 NFT', ([a0, a1]) => {
  beforeEach(async function () {
    this.erc721x = await ERC721XMock.new('Mock', 'MK')
    this.erc721a = await ERC721AMock.new('Mock', 'MK')
    this.erc721 = await ERC721Mock.new('Mock', 'MK')
    await this.erc721x.mint(a0, false)
    await this.erc721a.mint(a0, '1')
    await this.erc721.mint(a0, '1')
  })

  it('ERC721X: Transfer 1', async function () {
    await this.erc721x.transferFrom(a0, a1, '1')
  })

  it('ERC721A: Transfer 1', async function () {
    await this.erc721a.transferFrom(a0, a1, '0')
  })

  it('ERC721: Transfer 1', async function () {
    await this.erc721.transferFrom(a0, a1, '1')
  })
})
