const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const { web3, artifacts } = require('hardhat')
const { ZERO_ADDRESS } = constants

const ERC721XMock = artifacts.require('ERC721XMock')

contract('ERC721X', ([a0, a1]) => {
  beforeEach(async function () {
    this.erc721x = await ERC721XMock.new('Mock', 'MK')
  })

  describe('init', () => {
    it('next id should be 1', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('1')
    })

    it('total supply should be 0', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('0')
    })

    it('balance of should be 0', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('0')
    })
  })

  describe('mint 2 nfts', () => {
    it('should refuse to mint to 0 address', async function () {
      const tx = this.erc721x.mint(ZERO_ADDRESS, false)

      await expectRevert(tx, 'ERC721X: mint to the zero address')
    })

    it('should emit a transfer event', async function () {
      let receipt = await this.erc721x.mint(a0, true)

      expectEvent(receipt, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '1',
      })

      expectEvent(receipt, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '2',
      })
    })
  })

  describe('mint many nfts', () => {
    it('should emit a transfer event', async function () {
      let receipt1 = await this.erc721x.mint(a0, false)
      let receipt2 = await this.erc721x.mint(a0, true)
      let receipt3 = await this.erc721x.mint(a0, true)
      let receipt4 = await this.erc721x.mint(a0, false)

      expectEvent(receipt1, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '1',
      })

      expectEvent(receipt2, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '2',
      })
      expectEvent(receipt2, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '3',
      })

      expectEvent(receipt3, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '4',
      })
      expectEvent(receipt3, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '5',
      })

      expectEvent(receipt4, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '6',
      })
    })
  })

  describe('mint 2 nfts', () => {
    it('should refuse to mint to 0 address', async function () {
      const tx = this.erc721x.mint(ZERO_ADDRESS, false)

      await expectRevert(tx, 'ERC721X: mint to the zero address')
    })

    it('should emit a transfer event', async function () {
      let receipt = await this.erc721x.mint(a0, true)

      expectEvent(receipt, 'Transfer', {
        from: ZERO_ADDRESS,
        to: a0,
        tokenId: '1',
      })
    })
  })

  describe('after mint 1 nft', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('2')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('1')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('1')
    })

    it('should assert minted nft exists', async function () {
      const exists = await this.erc721x.exists('1')

      expect(exists).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('2')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 1; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 1; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 2 nfts', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, true)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('3')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('2')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('2')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('3')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 2; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 2; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 3 nfts (1 => 2)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, true)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('4')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('3')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('3')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('4')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 3; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 3; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 3 nfts (2 => 1)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, false)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('4')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('3')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('3')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('4')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 3; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 3; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 4 nfts (2 => 2)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, true)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('5')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('4')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('4')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('5')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 4; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 4; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 4 nfts (1 => 1 => 1 => 1)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('5')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('4')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('4')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('5')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 4; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 4; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 5 nfts (2 => 1 => 2)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, true)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('6')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('5')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('5')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')
      const exists5 = await this.erc721x.exists('5')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
      expect(exists5).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('6')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 5; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 5; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 5 nfts (1 => 1 => 2 => 1)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, false)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('6')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('5')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('5')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')
      const exists5 = await this.erc721x.exists('5')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
      expect(exists5).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('6')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 5; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 5; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 6 nfts (1 => 1 => 2 => 2)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, true)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('7')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('6')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('6')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')
      const exists5 = await this.erc721x.exists('5')
      const exists6 = await this.erc721x.exists('6')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
      expect(exists5).to.equal(true)
      expect(exists6).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('7')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 6; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 6; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('after mint 6 nfts (1 => 1 => 2 => 1 => 1)', () => {
    beforeEach(async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, true)
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)
    })

    it('should update next ID to be minted', async function () {
      const nextId = await this.erc721x.nextId()

      expect(nextId).to.bignumber.equal('7')
    })

    it('should update total supply', async function () {
      const totalSupply = await this.erc721x.totalSupply()

      expect(totalSupply).to.bignumber.equal('6')
    })

    it('should update balance of owner', async function () {
      const balanceOfA0 = await this.erc721x.balanceOf(a0)

      expect(balanceOfA0).to.bignumber.equal('6')
    })

    it('should assert minted nfts exist', async function () {
      const exists1 = await this.erc721x.exists('1')
      const exists2 = await this.erc721x.exists('2')
      const exists3 = await this.erc721x.exists('3')
      const exists4 = await this.erc721x.exists('4')
      const exists5 = await this.erc721x.exists('5')
      const exists6 = await this.erc721x.exists('6')

      expect(exists1).to.equal(true)
      expect(exists2).to.equal(true)
      expect(exists3).to.equal(true)
      expect(exists4).to.equal(true)
      expect(exists5).to.equal(true)
      expect(exists6).to.equal(true)
    })

    it('should assert non-minted nft does not exist', async function () {
      const exists = await this.erc721x.exists('7')

      expect(exists).to.equal(false)
    })

    it('should not update balance of other account', async function () {
      const balanceOfA1 = await this.erc721x.balanceOf(a1)

      expect(balanceOfA1).to.bignumber.equal('0')
    })

    it('should correctly evaluate token of owner by index', async function () {
      for (let i = 0; i < 6; i++) {
        expect(
          await this.erc721x.tokenOfOwnerByIndex(a0, i),
        ).to.bignumber.equal(i + 1 + '')
      }
    })

    it('should correctly evaluate token by index', async function () {
      for (let i = 0; i < 6; i++) {
        expect(await this.erc721x.tokenByIndex(i)).to.bignumber.equal(
          i + 1 + '',
        )
      }
    })
  })

  describe('transfer', () => {
    it('should not be able to transfer to address(0)', async function () {
      await this.erc721x.mint(a0, false)

      await expectRevert(
        this.erc721x.transferFrom(a0, ZERO_ADDRESS, '1'),
        'ERC721X: transfer to the zero address',
      )
    })

    it('should be able to transfer token that is own (1, 1)', async function () {
      await this.erc721x.mint(a0, false)

      expectEvent(await this.erc721x.transferFrom(a0, a1, '1'), 'Transfer', {
        from: a0,
        to: a1,
        tokenId: '1',
      })

      expect(await this.erc721x.ownerOf('1')).to.equal(a1)
      expect(await this.erc721x.balanceOf(a0)).to.bignumber.equal('0')
      expect(await this.erc721x.balanceOf(a1)).to.bignumber.equal('1')
    })

    it('should be able to transfer token that is own (2, 1)', async function () {
      await this.erc721x.mint(a0, true)

      expectEvent(await this.erc721x.transferFrom(a0, a1, '1'), 'Transfer', {
        from: a0,
        to: a1,
        tokenId: '1',
      })

      expect(await this.erc721x.ownerOf('1')).to.equal(a1)
      expect(await this.erc721x.ownerOf('2')).to.equal(a0)
      expect(await this.erc721x.balanceOf(a0)).to.bignumber.equal('1')
      expect(await this.erc721x.balanceOf(a1)).to.bignumber.equal('1')
    })

    it('should be able to transfer token that is own (2, 2)', async function () {
      await this.erc721x.mint(a0, true)

      expectEvent(await this.erc721x.transferFrom(a0, a1, '2'), 'Transfer', {
        from: a0,
        to: a1,
        tokenId: '2',
      })

      expect(await this.erc721x.ownerOf('1')).to.equal(a0)
      expect(await this.erc721x.ownerOf('2')).to.equal(a1)
      expect(await this.erc721x.balanceOf(a0)).to.bignumber.equal('1')
      expect(await this.erc721x.balanceOf(a1)).to.bignumber.equal('1')
    })

    it('should be able to transfer token that is own (1=>1, 2)', async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)

      expectEvent(await this.erc721x.transferFrom(a0, a1, '2'), 'Transfer', {
        from: a0,
        to: a1,
        tokenId: '2',
      })

      expect(await this.erc721x.ownerOf('1')).to.equal(a0)
      expect(await this.erc721x.ownerOf('2')).to.equal(a1)
      expect(await this.erc721x.balanceOf(a0)).to.bignumber.equal('1')
      expect(await this.erc721x.balanceOf(a1)).to.bignumber.equal('1')
    })

    it('should not be able to transfer token that is not own (1, 1)', async function () {
      await this.erc721x.mint(a0, false)

      await expectRevert(
        this.erc721x.transferFrom(a1, ZERO_ADDRESS, '1'),
        'ERC721X: transfer of token that is not own',
      )
    })

    it('should not be able to transfer token that is not own (2, 1)', async function () {
      await this.erc721x.mint(a0, true)

      await expectRevert(
        this.erc721x.transferFrom(a1, ZERO_ADDRESS, '1'),
        'ERC721X: transfer of token that is not own',
      )
    })

    it('should not be able to transfer token that is not own (2, 2)', async function () {
      await this.erc721x.mint(a0, true)

      await expectRevert(
        this.erc721x.transferFrom(a1, ZERO_ADDRESS, '2'),
        'ERC721X: transfer of token that is not own',
      )
    })

    it('should not be able to transfer token that is not own (1=>1, 2)', async function () {
      await this.erc721x.mint(a0, false)
      await this.erc721x.mint(a0, false)

      await expectRevert(
        this.erc721x.transferFrom(a1, ZERO_ADDRESS, '2'),
        'ERC721X: transfer of token that is not own',
      )
    })
  })
})
