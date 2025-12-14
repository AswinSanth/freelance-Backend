// const express = require('express');
// const { ethers } = require('ethers');
// const EscrowABI = require('../abi/Escrow.json');

// const router = express.Router();

// // Hardhat RPC
// const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// // Default Hardhat accounts
// const buyerKey =
//   '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
// const sellerKey =
//   '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

// const buyer = new ethers.Wallet(buyerKey, provider);
// const seller = new ethers.Wallet(sellerKey, provider);

// // Your deployed address
// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// const buyerContract = new ethers.Contract(
//   contractAddress,
//   EscrowABI.abi,
//   buyer
// );
// const sellerContract = new ethers.Contract(
//   contractAddress,
//   EscrowABI.abi,
//   seller
// );

// // Fund
// router.post('/fund', async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const tx = await buyerContract.fund({
//       value: ethers.parseEther(amount),
//     });
//     await tx.wait();
//     job.escrowStatus = 'funded';
//     await job.save();

//     res.json({ message: 'Funds deposited', txHash: tx.hash });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Release
// router.post('/release1', async (req, res) => {
//   try {
//     const tx = await buyerContract.release();
//     await tx.wait();
//     res.json({ message: 'Funds released', txHash: tx.hash });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// //REALSE
// router.post('/release', async (req, res) => {
//     try {
//       const { jobId } = req.body;
  
//       // 1. Release funds on blockchain
//       const tx = await buyerContract.release();
//       await tx.wait();
  
//       // 2. Update job in DB
//       const job = await Job.findById(jobId);
//       if (!job) {
//         return res.status(404).json({ error: 'Job not found' });
//       }
  
//       job.escrowStatus = 'released';
//       job.status = 'completed';
//       await job.save();
  
//       res.json({
//         message: 'Funds released',
//         txHash: tx.hash,
//         jobStatus: job.status,
//         escrowStatus: job.escrowStatus,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
// // Refund
// router.post('/refund', async (req, res) => {
//   try {
//     const tx = await sellerContract.refund();
//     await tx.wait();
//     res.json({ message: 'Refund issued', txHash: tx.hash });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Status
// router.get('/status', async (req, res) => {
//   try {
//     const funded = await buyerContract.isFunded();
//     const released = await buyerContract.isReleased();
//     const amount = await buyerContract.amount();
//     res.json({
//       funded,
//       released,
//       amount: amount.toString(),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const { ethers } = require('ethers');
const EscrowABI = require('../abi/Escrow.json');
const Job = require('../DB/models/Job-Schmea');

const router = express.Router();

// Hardhat RPC
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Hardhat accounts
const buyerKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const sellerKey =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

const buyer = new ethers.Wallet(buyerKey, provider);
const seller = new ethers.Wallet(sellerKey, provider);

// Escrow contract address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const buyerContract = new ethers.Contract(contractAddress, EscrowABI.abi, buyer);
const sellerContract = new ethers.Contract(contractAddress, EscrowABI.abi, seller);


/// ==========================
/// FUND ESCROW
/// ==========================
router.post('/fund', async (req, res) => {
  try {
    const { amount, jobId } = req.body;

    const tx = await buyerContract.fund({
      value: ethers.parseEther(amount),
    });
    await tx.wait();

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.escrowStatus = 'funded';
    await job.save();

    res.json({
      message: 'Funds deposited',
      txHash: tx.hash,
      escrowStatus: job.escrowStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/// ==========================
/// RELEASE FUNDS
/// ==========================
router.post('/release', async (req, res) => {
  try {
    const { jobId } = req.body;

    const tx = await buyerContract.release();
    await tx.wait();

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.escrowStatus = 'released';
    job.status = 'completed';
    await job.save();

    res.json({
      message: 'Funds released',
      txHash: tx.hash,
      jobStatus: job.status,
      escrowStatus: job.escrowStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/// ==========================
/// REFUND
/// ==========================
router.post('/refund', async (req, res) => {
  try {
    const { jobId } = req.body;

    const tx = await sellerContract.refund();
    await tx.wait();

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.escrowStatus = 'refunded';
    job.status = 'open';
    await job.save();

    res.json({
      message: 'Refund issued',
      txHash: tx.hash,
      escrowStatus: job.escrowStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/// ==========================
/// STATUS
/// ==========================
router.get('/status', async (req, res) => {
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
