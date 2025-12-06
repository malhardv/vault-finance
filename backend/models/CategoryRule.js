import mongoose from 'mongoose';

const categoryRuleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Keyword is required'],
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create index on keyword field for fast lookups
categoryRuleSchema.index({ keyword: 1 });

const CategoryRule = mongoose.model('CategoryRule', categoryRuleSchema);

export default CategoryRule;
