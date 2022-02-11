// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.11;

import "../token/ERC721/ERC721A.sol";

/**
 * @notice Basic ERC721 mock with unprotected mint
 *         and burn functions
 *
 * @dev Only to be used for testing
 */
contract ERC721AMock is ERC721A {
   constructor(string memory _name, string memory _symbol) ERC721A(_name, _symbol) {}

  function mint(address to, uint256 q) external {
    _mint(to, q, "", false);
  }

  function safeMint(address to, uint256 q) public {
    _mint(to, q, "", true);
  }

  function safeMint(
    address to,
    uint256 q,
    bytes memory _data
  ) public {
    _mint(to, q, _data, true);
  }

  function baseURI() public view returns (string memory) {
    return _baseURI();
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }
}
