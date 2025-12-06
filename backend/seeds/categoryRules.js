import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import CategoryRule from '../models/CategoryRule.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Category rules with common keywords
const categoryRules = [
  // Food & Dining
  { keyword: 'zomato', category: 'Food & Dining', priority: 10 },
  { keyword: 'swiggy', category: 'Food & Dining', priority: 10 },
  { keyword: 'restaurant', category: 'Food & Dining', priority: 5 },
  { keyword: 'cafe', category: 'Food & Dining', priority: 5 },
  { keyword: 'coffee', category: 'Food & Dining', priority: 5 },
  { keyword: 'pizza', category: 'Food & Dining', priority: 5 },
  { keyword: 'burger', category: 'Food & Dining', priority: 5 },
  { keyword: 'food', category: 'Food & Dining', priority: 3 },
  { keyword: 'dining', category: 'Food & Dining', priority: 3 },
  { keyword: 'mcdonald', category: 'Food & Dining', priority: 8 },
  { keyword: 'kfc', category: 'Food & Dining', priority: 8 },
  { keyword: 'dominos', category: 'Food & Dining', priority: 8 },
  { keyword: 'starbucks', category: 'Food & Dining', priority: 8 },

  // Transport
  { keyword: 'uber', category: 'Transport', priority: 10 },
  { keyword: 'ola', category: 'Transport', priority: 10 },
  { keyword: 'rapido', category: 'Transport', priority: 10 },
  { keyword: 'taxi', category: 'Transport', priority: 5 },
  { keyword: 'cab', category: 'Transport', priority: 5 },
  { keyword: 'metro', category: 'Transport', priority: 5 },
  { keyword: 'bus', category: 'Transport', priority: 5 },
  { keyword: 'train', category: 'Transport', priority: 5 },
  { keyword: 'fuel', category: 'Transport', priority: 5 },
  { keyword: 'petrol', category: 'Transport', priority: 5 },
  { keyword: 'diesel', category: 'Transport', priority: 5 },
  { keyword: 'parking', category: 'Transport', priority: 5 },
  { keyword: 'toll', category: 'Transport', priority: 5 },

  // Shopping
  { keyword: 'amazon', category: 'Shopping', priority: 10 },
  { keyword: 'flipkart', category: 'Shopping', priority: 10 },
  { keyword: 'myntra', category: 'Shopping', priority: 10 },
  { keyword: 'ajio', category: 'Shopping', priority: 10 },
  { keyword: 'shopping', category: 'Shopping', priority: 3 },
  { keyword: 'mall', category: 'Shopping', priority: 5 },
  { keyword: 'store', category: 'Shopping', priority: 3 },
  { keyword: 'retail', category: 'Shopping', priority: 3 },

  // Groceries
  { keyword: 'bigbasket', category: 'Groceries', priority: 10 },
  { keyword: 'grofers', category: 'Groceries', priority: 10 },
  { keyword: 'blinkit', category: 'Groceries', priority: 10 },
  { keyword: 'zepto', category: 'Groceries', priority: 10 },
  { keyword: 'grocery', category: 'Groceries', priority: 8 },
  { keyword: 'supermarket', category: 'Groceries', priority: 8 },
  { keyword: 'dmart', category: 'Groceries', priority: 10 },
  { keyword: 'reliance fresh', category: 'Groceries', priority: 10 },
  { keyword: 'more', category: 'Groceries', priority: 5 },

  // Entertainment
  { keyword: 'netflix', category: 'Entertainment', priority: 10 },
  { keyword: 'amazon prime', category: 'Entertainment', priority: 10 },
  { keyword: 'hotstar', category: 'Entertainment', priority: 10 },
  { keyword: 'spotify', category: 'Entertainment', priority: 10 },
  { keyword: 'youtube', category: 'Entertainment', priority: 10 },
  { keyword: 'movie', category: 'Entertainment', priority: 5 },
  { keyword: 'cinema', category: 'Entertainment', priority: 5 },
  { keyword: 'pvr', category: 'Entertainment', priority: 10 },
  { keyword: 'inox', category: 'Entertainment', priority: 10 },
  { keyword: 'bookmyshow', category: 'Entertainment', priority: 10 },
  { keyword: 'game', category: 'Entertainment', priority: 3 },

  // Utilities
  { keyword: 'electricity', category: 'Utilities', priority: 10 },
  { keyword: 'water', category: 'Utilities', priority: 8 },
  { keyword: 'gas', category: 'Utilities', priority: 8 },
  { keyword: 'internet', category: 'Utilities', priority: 8 },
  { keyword: 'broadband', category: 'Utilities', priority: 8 },
  { keyword: 'mobile', category: 'Utilities', priority: 5 },
  { keyword: 'phone', category: 'Utilities', priority: 5 },
  { keyword: 'airtel', category: 'Utilities', priority: 10 },
  { keyword: 'jio', category: 'Utilities', priority: 10 },
  { keyword: 'vodafone', category: 'Utilities', priority: 10 },
  { keyword: 'bsnl', category: 'Utilities', priority: 10 },

  // Healthcare
  { keyword: 'hospital', category: 'Healthcare', priority: 10 },
  { keyword: 'doctor', category: 'Healthcare', priority: 10 },
  { keyword: 'pharmacy', category: 'Healthcare', priority: 10 },
  { keyword: 'medical', category: 'Healthcare', priority: 8 },
  { keyword: 'medicine', category: 'Healthcare', priority: 8 },
  { keyword: 'clinic', category: 'Healthcare', priority: 10 },
  { keyword: 'apollo', category: 'Healthcare', priority: 10 },
  { keyword: 'medplus', category: 'Healthcare', priority: 10 },
  { keyword: '1mg', category: 'Healthcare', priority: 10 },
  { keyword: 'pharmeasy', category: 'Healthcare', priority: 10 },

  // Education
  { keyword: 'school', category: 'Education', priority: 10 },
  { keyword: 'college', category: 'Education', priority: 10 },
  { keyword: 'university', category: 'Education', priority: 10 },
  { keyword: 'course', category: 'Education', priority: 8 },
  { keyword: 'tuition', category: 'Education', priority: 10 },
  { keyword: 'book', category: 'Education', priority: 5 },
  { keyword: 'udemy', category: 'Education', priority: 10 },
  { keyword: 'coursera', category: 'Education', priority: 10 },
  { keyword: 'byju', category: 'Education', priority: 10 },

  // Insurance
  { keyword: 'insurance', category: 'Insurance', priority: 10 },
  { keyword: 'premium', category: 'Insurance', priority: 5 },
  { keyword: 'policy', category: 'Insurance', priority: 5 },
  { keyword: 'lic', category: 'Insurance', priority: 10 },
  { keyword: 'hdfc life', category: 'Insurance', priority: 10 },
  { keyword: 'icici prudential', category: 'Insurance', priority: 10 },

  // Investment
  { keyword: 'mutual fund', category: 'Investment', priority: 10 },
  { keyword: 'sip', category: 'Investment', priority: 10 },
  { keyword: 'stock', category: 'Investment', priority: 8 },
  { keyword: 'zerodha', category: 'Investment', priority: 10 },
  { keyword: 'groww', category: 'Investment', priority: 10 },
  { keyword: 'upstox', category: 'Investment', priority: 10 },
  { keyword: 'investment', category: 'Investment', priority: 8 },

  // Rent
  { keyword: 'rent', category: 'Rent', priority: 10 },
  { keyword: 'lease', category: 'Rent', priority: 10 },
  { keyword: 'housing', category: 'Rent', priority: 5 },

  // Salary/Income
  { keyword: 'salary', category: 'Income', priority: 10 },
  { keyword: 'income', category: 'Income', priority: 8 },
  { keyword: 'payment received', category: 'Income', priority: 8 },
  { keyword: 'credit', category: 'Income', priority: 3 },
  { keyword: 'deposit', category: 'Income', priority: 5 },

  // ATM/Banking
  { keyword: 'atm', category: 'Banking', priority: 10 },
  { keyword: 'withdrawal', category: 'Banking', priority: 8 },
  { keyword: 'transfer', category: 'Banking', priority: 5 },
  { keyword: 'bank charges', category: 'Banking', priority: 10 },
  { keyword: 'service charge', category: 'Banking', priority: 8 },

  // Miscellaneous
  { keyword: 'gift', category: 'Gifts & Donations', priority: 8 },
  { keyword: 'donation', category: 'Gifts & Donations', priority: 8 },
  { keyword: 'charity', category: 'Gifts & Donations', priority: 8 }
];

// Connect to MongoDB and seed the data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing category rules
    await CategoryRule.deleteMany({});
    console.log('Cleared existing category rules');

    // Insert new category rules
    const result = await CategoryRule.insertMany(categoryRules);
    console.log(`Successfully seeded ${result.length} category rules`);

    // Display summary by category
    const categories = [...new Set(categoryRules.map(rule => rule.category))];
    console.log('\nCategory Summary:');
    categories.forEach(category => {
      const count = categoryRules.filter(rule => rule.category === category).length;
      console.log(`  ${category}: ${count} keywords`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
