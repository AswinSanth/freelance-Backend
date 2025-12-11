const express = require("express");
const { ethers } = require("ethers");
const EscrowABI = require("../abi/Escrow.json");

const router = express.Router();

// Hardhat RPC
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Default Hardhat accounts
const buyerKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const sellerKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const buyer = new ethers.Wallet(buyerKey, provider);
const seller = new ethers.Wallet(sellerKey, provider);

// Your deployed address
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const buyerContract = new ethers.Contract(contractAddress, EscrowABI.abi, buyer);
const sellerContract = new ethers.Contract(contractAddress, EscrowABI.abi, seller);

// Fund
router.post("/fund", async (req, res) => {
  try {
    const { amount } = req.body;
    const tx = await buyerContract.fund({
      value: ethers.parseEther(amount),
    });
    await tx.wait();
    res.json({ message: "Funds deposited", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Release
router.post("/release", async (req, res) => {
  try {
    const tx = await buyerContract.release();
    await tx.wait();
    res.json({ message: "Funds released", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refund
router.post("/refund", async (req, res) => {
  try {
    const tx = await sellerContract.refund();
    await tx.wait();
    res.json({ message: "Refund issued", txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Status
router.get("/status", async (req, res) => {
  try {
    const funded = await buyerContract.isFunded();
    const released = await buyerContract.isReleased();
    const amount = await buyerContract.amount();
    res.json({
      funded,
      released,
      amount: amount.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
