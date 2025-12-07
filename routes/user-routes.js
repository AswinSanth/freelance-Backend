const express = require('express');
const router = express.Router();

const User = require('../DB/models/User-Schema');

router.post('/login', async (req, res) => {
  const { walletAddress, role } = req.body;

  try {
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = await User.create({ walletAddress, role });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
