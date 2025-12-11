const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  walletAddress: {
    type: String,
    required: true,
    unquie: true,
  },
  name: {
    type: String,
    default: ""

  },
  role: {
    type: String,
    required: true,
  },
  rating: { type: Number, default: 0 },
  skills: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model('users', UserSchema);

module.exports = User;
