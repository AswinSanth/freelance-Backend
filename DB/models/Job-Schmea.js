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
    lowercase: false

  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open',
  },
  escrowAddress: {
    type: String,
    default: null,
  },

  escrowStatus: {
    type: String,
    enum: ['not_created', 'pending_fund', 'funded', 'released', 'refunded'],
    default: 'not_created',
  },

  escrowAmount: {
    type: Number,
    default: 0,
  },
});

const Jobs = model('Job', JobSchema);

module.exports = Jobs;
