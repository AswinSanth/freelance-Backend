const express = require('express');
const router = express.Router();
const Job = require('../DB/models/Job-Schmea');

// POST Job (Client)
router.post('/job/post', async (req, res) => {
  const { clientWallet, title, description, budget, deadline } = req.body;

  try {
    const job = await Job.create({
      clientWallet,
      title,
      description,
      budget,
      deadline,
    });

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// GET All Jobs
router.get('/jobs', async (req, res) => {
  const jobs = await Job.find({});
  res.json({ success: true, jobs });
});

// APPLY to Job (Freelancer)
router.post("/apply", async (req, res) => {
    const { jobId, freelancerWallet } = req.body;
  
    try {
      const job = await Job.findById(jobId);
  
      // Check if already applied
      if (job.applicants.includes(freelancerWallet)) {
        return res.json({ success: false, message: "Already applied" });
      }
  
      job.applicants.push(freelancerWallet);
      await job.save();
  
      res.json({ success: true, job });
    } 
    catch (error) {
      res.json({ success: false, error: error.message });
    }
  });
  
  // SELECT FREELANCER (Client)
router.post("/job/select", async (req, res) => {
    const { jobId, freelancerWallet } = req.body;
  
    try {
      const job = await Job.findById(jobId);
  
      // Check if freelancer applied
      if (!job.applicants.includes(freelancerWallet)) {
        return res.json({ success: false, message: "Freelancer didn't apply" });
      }
  
      // Set selected freelancer
      job.selectedFreelancer = freelancerWallet;
      job.status = "in-progress";
  
      await job.save();
  
      res.json({ success: true, job });
    } 
    catch (error) {
      res.json({ success: false, error: error.message });
    }
  });
  
module.exports = router;
