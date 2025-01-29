// Import the ethers library
import { ethers } from "ethers";

// Set up the provider (use your preferred provider, like MetaMask or Infura)
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Get the signer (this will be your wallet)
const signer = provider.getSigner();

// Contract address and ABI
const contractAddress = "0xa7f2b206E8618D5016FFC78c9c1C6D86f6505cB2"; // your contract address
const contractABI = [
  "function withdraw() external onlyOwner nonReentrant",
  "event Withdraw(address indexed from, uint256 amount)",
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Call the withdraw function
async function withdrawFunds() {
  try {
    const tx = await contract.withdraw();
    console.log("Transaction sent: ", tx);

    // Wait for transaction to be mined
    await tx.wait();
    console.log("Withdrawal successful");
  } catch (error) {
    console.error("Error withdrawing MATIC:", error);
  }
}

// Trigger withdrawal
withdrawFunds();
