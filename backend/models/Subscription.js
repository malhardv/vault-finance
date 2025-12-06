import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Subscription amount is required'],
    min: [0, 'Amount must be non-negative']
  },
  cycle: {
    type: String,
    required: [true, 'Subscription cycle is required'],
    enum: ['monthly', 'yearly']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  nextRenewalDate: {
    type: Date,
    required: [true, 'Next renewal date is required']
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ nextRenewalDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
