const express = require('express');
require('dotenv').config('./.env');
const cors = require('cors');
require('./DB');
const app = express();
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/user-routes');
app.use(userRoutes);
const jobRoutes = require('./routes/job-Routes');
app.use(jobRoutes);

const blockchainRoutes = require('./routes/escrow');
app.use("/escrow", blockchainRoutes);
app.listen(5000, () => {
  console.log('App is Running ');
});
