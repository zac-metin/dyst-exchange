import React, { useState } from "react";
import { ethers } from "ethers";
import DTFU_ABI from "./DystopianFuture.json";

const DTFU_CONTRACT_ADDRESS = "0xa7f2b206E8618D5016FFC78c9c1C6D86f6505cB2";

function App() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleSwap = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(DTFU_CONTRACT_ADDRESS, DTFU_ABI, signer);

      // Define the swap price: 1 DTFU = 0.01 POL
      const DTFU_PRICE = ethers.utils.parseEther("2.00");

      const totalCost = ethers.utils.parseEther(amount).mul(DTFU_PRICE);
      await signer.sendTransaction({
        to: DTFU_CONTRACT_ADDRESS,
        value: totalCost,
      });

      const tx = await contract.transfer(await signer.getAddress(), ethers.utils.parseEther(amount));
      await tx.wait();

      setStatus(`Successfully swapped ${amount} DTFU for ${ethers.utils.formatEther(totalCost)} POL`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Dystopian Future Token Exchange</h1>
      <input
        type="number"
        placeholder="Amount of DTFU"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSwap}>Swap POL for DTFU</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
