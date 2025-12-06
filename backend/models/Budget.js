import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  totalBudget: {
    type: Number,
    required: [true, 'Total budget is required'],
    min: [0, 'Total budget must be non-negative']
  },
  categoryBudgets: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    limit: {
      type: Number,
      required: true,
      min: [0, 'Category budget limit must be non-negative']
    }
  }]
}, {
  timestamps: true
});

// Create compound unique index on userId and month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
