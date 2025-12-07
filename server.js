const express = require('express');
require('dotenv').config('./.env');
const cors = require('cors');
require('./DB');
const app = express();
app.use(cors())

const userRoutes = require('./routes/user-routes');
app.use(userRoutes);

app.listen(5000, () => {
  console.log('App is Running ');
});
