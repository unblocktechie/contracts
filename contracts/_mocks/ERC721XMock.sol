// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.11;

import "../token/ERC721/ERC721X.sol";

/**
 * @notice Basic ERC721X mock with unprotected mint function
 *
 * @dev Only to be used for testing
 */
contract ERC721XMock is ERC721X {
   constructor(string memory _name, string memory _symbol) ERC721X(_name, _symbol) {}

  function mint(address _account, bool _extra) external {
    _mint(_account, _extra);
  }

  function safeMint(address _to, bool _extra) public {
    _safeMint(_to, _extra);
  }

  function safeMint(
    address _to,
    bool _extra,
    bytes memory _data
  ) public {
    _safeMint(_to, _extra, _data);
  }

  function baseURI() public view returns (string memory) {
    return _baseURI();
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }
}
