import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  investmentName: {
    type: String,
    required: [true, 'Investment name is required'],
    trim: true
  },
  initialAmount: {
    type: Number,
    required: [true, 'Initial amount is required'],
    min: [0, 'Initial amount must be non-negative']
  },
  currentValue: {
    type: Number,
    required: [true, 'Current value is required'],
    min: [0, 'Current value must be non-negative']
  },
  investmentDate: {
    type: Date,
    required: [true, 'Investment date is required']
  }
}, {
  timestamps: true
});

// Create index on userId for efficient querying
portfolioSchema.index({ userId: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
