// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract DystopianFuture is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    uint256 public DTFU_PRICE = 2.00 ether;
    uint256 public maxSwapPerTransaction = 1000000 * 10 ** decimals();

    event Swap(address indexed user, uint256 maticAmount, uint256 tokenAmount);
    event Withdraw(address indexed owner, uint256 amount);
    event Received(address indexed sender, uint256 amount);

    // Correctly call the Ownable constructor with the deployer's address
    constructor() ERC20("DystopianFuture", "DTFU") Ownable(msg.sender) {
        _mint(msg.sender, 21_000_000 * 10 ** decimals());
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function swap() external payable whenNotPaused {
        require(msg.value > 0, "Send MATIC to swap");
        uint256 amountToTransfer = (msg.value * 10 ** decimals()) / DTFU_PRICE;
        require(amountToTransfer > 0, "Insufficient MATIC sent");
        require(amountToTransfer <= maxSwapPerTransaction, "Exceeds max swap limit");
        require(balanceOf(owner()) >= amountToTransfer, "Not enough tokens in contract");

        _transfer(owner(), msg.sender, amountToTransfer);
        emit Swap(msg.sender, msg.value, amountToTransfer);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No MATIC to withdraw");
        payable(owner()).transfer(balance);
        emit Withdraw(msg.sender, balance);
    }

    function setTokenPrice(uint256 _price) external onlyOwner {
        DTFU_PRICE = _price;
    }

    function setMaxSwapPerTransaction(uint256 _max) external onlyOwner {
        maxSwapPerTransaction = _max;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}