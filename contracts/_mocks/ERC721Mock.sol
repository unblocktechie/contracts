// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @notice Basic ERC721 mock with unprotected mint
 *         and burn functions
 *
 * @dev Only to be used for testing
 */
contract ERC721Mock is ERC721, ERC721Enumerable {
   constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

  function mint(address _account, uint256 _id) external {
    _mint(_account, _id);
  }

  function safeMint(address to, uint256 tokenId) public {
    _safeMint(to, tokenId);
  }

  function safeMint(
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public {
    _safeMint(to, tokenId, _data);
  }

  function burn(uint256 _id) external {
    _burn(_id);
  }

  function baseURI() public view returns (string memory) {
    return _baseURI();
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }

  function supportsInterface(bytes4 _interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(_interfaceId);
  }

  function _beforeTokenTransfer(
    address _from,
    address _to,
    uint256 _tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);
  }
}
