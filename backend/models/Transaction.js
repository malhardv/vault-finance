import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required']
  },
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['debit', 'credit']
  },
  category: {
    type: String,
    required: [true, 'Transaction category is required'],
    trim: true
  },
  balance: {
    type: Number
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
transactionSchema.index({ userId: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
