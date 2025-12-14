

// const { ethers } = require('ethers');
// const EscrowABI = require('../abi/Escrow.json');
// const Job = require('../DB/models/Job-Schmea');

// // Hardhat RPC
// const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// // Hardhat default accounts
// const buyerKey =
//   '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
// const buyer = new ethers.Wallet(buyerKey, provider);

// async function createEscrowForJob(req, res) {
//   try {
//     const jobId = req.params.id;

//     // 1. Get job
//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     if (!job.selectedFreelancer) {
//       return res.status(400).json({ error: 'No freelancer selected yet' });
//     }

//     // 2. Deploy escrow using clientWallet + selectedFreelancer
//     const factory = new ethers.ContractFactory(
//       EscrowABI.abi,
//       EscrowABI.bytecode,
//       buyer // signer (must be a funded wallet)
//     );

//     const escrowContract = await factory.deploy(
//       job.clientWallet, // correct constructor arg 1
//       job.selectedFreelancer // correct constructor arg 2
//     );

//     await escrowContract.waitForDeployment();

//     const escrowAddress = await escrowContract.getAddress();

//     // 3. Save escrow in job
//     job.escrowAddress = escrowAddress;
//     job.escrowAmount = job.budget;
//     job.escrowStatus = 'pending_fund';
//     await job.save();

//     res.json({
//       message: 'Escrow created',
//       escrowAddress,
//       amount: job.escrowAmount,
//       status: job.escrowStatus,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// module.exports = { createEscrowForJob };

const { ethers } = require("ethers");
const EscrowABI = require("../abi/Escrow.json");
const Job = require("../DB/models/Job-Schmea");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const buyerKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const buyer = new ethers.Wallet(buyerKey, provider);

async function createEscrowForJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!job.selectedFreelancer) {
      return res.status(400).json({ error: "No freelancer selected" });
    }

    const factory = new ethers.ContractFactory(
      EscrowABI.abi,
      EscrowABI.bytecode,
      buyer
    );

    // ✅ ONLY ONE ARGUMENT
    const escrow = await factory.deploy(job.selectedFreelancer);

    await escrow.waitForDeployment();

    job.escrowAddress = await escrow.getAddress();
    job.escrowAmount = job.budget;
    job.escrowStatus = "pending_fund";

    await job.save();

    res.json({
      message: "Escrow created",
      escrowAddress: job.escrowAddress,
      amount: job.escrowAmount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createEscrowForJob };

