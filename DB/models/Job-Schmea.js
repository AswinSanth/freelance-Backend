const { Schema, model } = require('mongoose');

const JobSchema = Schema({
  clientWallet: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applicants: {
    type: [String], // freelancer wallet addresses
    default: [],
  },
  selectedFreelancer: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open',
  },
});

const Jobs = model('Job', JobSchema);

module.exports = Jobs;
