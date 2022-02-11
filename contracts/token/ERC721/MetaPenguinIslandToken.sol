// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721X.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MetaPenguinIslandToken is ERC721X, Ownable {
  // Use OZ MerkleProof Library to verify Merkle proofs
  using MerkleProof for bytes32[];

  uint256 public immutable price = 24000000000000000000; // 0.24 Ether
  uint256 public immutable maxTotalSupply = 8888;
  uint256 public immutable maxAdminMint = 100;

  mapping(address => uint256) private mints;

  string private theBaseURI;

  bytes32 root;

  constructor() ERC721X("Meta Penguin Island", "MPI") {}

  function buy(bool _amount, uint256 _startTime, bytes32[] memory _proof) public payable {
    uint256 n = !_amount ? 1 : 2;

    require(msg.sender == tx.origin, "mint from contract not allowed");
    require(msg.value == price * n, "incorrect price");
    require(nextId <= maxTotalSupply - maxAdminMint, "not enough tokens");
    require(mints[msg.sender] + n <= 2, "mint limit reached");

    bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _startTime));

    require(_proof.verify(root, leaf), "invalid proof");

    require(_startTime <= block.timestamp, "too early");

    mints[msg.sender] += n;

    _mint(msg.sender, _amount);
  }

  function _baseURI() internal view override returns (string memory) {
    return theBaseURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    theBaseURI = _newBaseURI;
  }

  function setRoot(bytes32 _newRoot) public onlyOwner {
    root = _newRoot;
  }

  function adminBuy(address _to, bool _amount) public {
    uint256 n = !_amount ? 1 : 2;

    require(nextId <= maxTotalSupply, "not enough tokens");

    _mint(_to, _amount);
  }

  function withdraw() public onlyOwner {
    payable(msg.sender).transfer(address(this).balance);
  }
}
