const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log('DB Connected');
  })
  .catch(e => {
    console.log(e);
  });

module.exports = mongoose;
