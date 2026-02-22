// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Minting state
    bool public isMintingActive = false;
    bool public isRevealActive = false;
    string private _baseTokenURI;
    string public unrevealedURI;
    mapping(address => bool) private whitelist;
    mapping(address => uint256) private mintedCount;
    uint256 public maxMintAmount = 5;
    uint256 public royaltyFee = 500; // 5%

    constructor(string memory name, string memory symbol, string memory baseURI, string memory unrevealedURI) 
        ERC721(name, symbol) {
        _baseTokenURI = baseURI;
        this.unrevealedURI = unrevealedURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function toggleMinting() external onlyOwner {
        isMintingActive = !isMintingActive;
    }

    function toggleReveal() external onlyOwner {
        isRevealActive = !isRevealActive;
    }

    function setRoyaltyFee(uint256 fee) external onlyOwner {
        royaltyFee = fee;
    }

    function mintWhitelist(uint256 amount) external {
        require(isMintingActive, "Minting is not active");
        require(whitelist[msg.sender], "You are not whitelisted");
        require(mintedCount[msg.sender] + amount <= maxMintAmount, "Exceeds max mint amount");

        for (uint256 i = 0; i < amount; i++) {
            _mintNFT();
        }

        mintedCount[msg.sender] += amount;
    }

    function mintPublic(uint256 amount) external {
        require(isMintingActive, "Minting is not active");
        require(amount <= maxMintAmount, "Exceeds max mint amount");

        for (uint256 i = 0; i < amount; i++) {
            _mintNFT();
        }
    }

    function _mintNFT() private {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter.increment();
    }

    function setWhitelisted(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return isRevealActive ? _baseTokenURI : unrevealedURI;
    }

    function royaltyInfo(uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        return (address(this), (salePrice * royaltyFee) / 10000);
    }
}