import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Subscription from '../models/Subscription.js';
import Portfolio from '../models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const createDemoUser = async () => {
  try {
    console.log('🌱 Creating demo user with sample data...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Demo user credentials
    const demoEmail = 'demo@vault.com';
    const demoPassword = 'demo123';
    const demoName = 'Demo User';

    // Check if demo user already exists
    let user = await User.findOne({ email: demoEmail });
    
    if (user) {
      console.log('⚠️  Demo user already exists. Deleting old data...');
      // Delete all existing data for this user
      await Transaction.deleteMany({ userId: user._id });
      await Budget.deleteMany({ userId: user._id });
      await Subscription.deleteMany({ userId: user._id });
      await Portfolio.deleteMany({ userId: user._id });
      console.log('✓ Deleted old demo data\n');
    } else {
      // Create new demo user
      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      user = await User.create({
        email: demoEmail,
        password: hashedPassword,
        name: demoName
      });
      console.log('✓ Created demo user');
    }

    console.log('📧 Email:', demoEmail);
    console.log('🔑 Password:', demoPassword);
    console.log('');

    // Create transactions for the last 3 months
    const transactions = [];
    const today = new Date();
    
    // Helper function to create date
    const createDate = (monthsAgo, day) => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - monthsAgo);
      date.setDate(day);
      return date;
    };

    // Month 1 (2 months ago) - Transactions
    transactions.push(
      // Income
      { date: createDate(2, 1), description: 'Monthly Salary', amount: 5000, type: 'credit', category: 'Salary' },
      
      // Expenses
      { date: createDate(2, 2), description: 'Rent Payment', amount: 1200, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(2, 3), description: 'Grocery Shopping at Walmart', amount: 150, type: 'debit', category: 'Food' },
      { date: createDate(2, 5), description: 'UBER Ride to Office', amount: 15, type: 'debit', category: 'Transport' },
      { date: createDate(2, 7), description: 'ZOMATO Food Order', amount: 25, type: 'debit', category: 'Food' },
      { date: createDate(2, 10), description: 'AMAZON Shopping', amount: 80, type: 'debit', category: 'Shopping' },
      { date: createDate(2, 12), description: 'Electricity Bill', amount: 120, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(2, 15), description: 'NETFLIX Subscription', amount: 15, type: 'debit', category: 'Entertainment' },
      { date: createDate(2, 18), description: 'Gas Station', amount: 50, type: 'debit', category: 'Transport' },
      { date: createDate(2, 20), description: 'Restaurant Dinner', amount: 60, type: 'debit', category: 'Food' },
      { date: createDate(2, 22), description: 'FLIPKART Electronics', amount: 200, type: 'debit', category: 'Shopping' },
      { date: createDate(2, 25), description: 'Gym Membership', amount: 50, type: 'debit', category: 'Healthcare' }
    );

    // Month 2 (1 month ago) - Transactions
    transactions.push(
      // Income
      { date: createDate(1, 1), description: 'Monthly Salary', amount: 5000, type: 'credit', category: 'Salary' },
      { date: createDate(1, 15), description: 'Freelance Project Payment', amount: 800, type: 'credit', category: 'Other Income' },
      
      // Expenses
      { date: createDate(1, 2), description: 'Rent Payment', amount: 1200, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(1, 4), description: 'Grocery Shopping', amount: 180, type: 'debit', category: 'Food' },
      { date: createDate(1, 6), description: 'OLA Cab Service', amount: 20, type: 'debit', category: 'Transport' },
      { date: createDate(1, 8), description: 'SWIGGY Food Delivery', amount: 30, type: 'debit', category: 'Food' },
      { date: createDate(1, 10), description: 'Internet Bill', amount: 60, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(1, 12), description: 'SPOTIFY Premium', amount: 10, type: 'debit', category: 'Entertainment' },
      { date: createDate(1, 14), description: 'Coffee Shop', amount: 15, type: 'debit', category: 'Food' },
      { date: createDate(1, 16), description: 'MYNTRA Clothing', amount: 120, type: 'debit', category: 'Shopping' },
      { date: createDate(1, 18), description: 'Movie Tickets BOOKMYSHOW', amount: 25, type: 'debit', category: 'Entertainment' },
      { date: createDate(1, 20), description: 'Pharmacy Medicine', amount: 40, type: 'debit', category: 'Healthcare' },
      { date: createDate(1, 22), description: 'Gas Station', amount: 55, type: 'debit', category: 'Transport' },
      { date: createDate(1, 25), description: 'Restaurant Weekend', amount: 70, type: 'debit', category: 'Food' },
      { date: createDate(1, 28), description: 'Mobile Recharge', amount: 30, type: 'debit', category: 'Bills & Utilities' }
    );

    // Current Month - Transactions
    transactions.push(
      // Income
      { date: createDate(0, 1), description: 'Monthly Salary', amount: 5000, type: 'credit', category: 'Salary' },
      
      // Expenses
      { date: createDate(0, 2), description: 'Rent Payment', amount: 1200, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(0, 3), description: 'Grocery Shopping', amount: 160, type: 'debit', category: 'Food' },
      { date: createDate(0, 5), description: 'UBER Ride', amount: 18, type: 'debit', category: 'Transport' },
      { date: createDate(0, 7), description: 'ZOMATO Lunch Order', amount: 28, type: 'debit', category: 'Food' },
      { date: createDate(0, 9), description: 'AMAZON Prime Renewal', amount: 15, type: 'debit', category: 'Entertainment' },
      { date: createDate(0, 11), description: 'Electricity Bill', amount: 110, type: 'debit', category: 'Bills & Utilities' },
      { date: createDate(0, 13), description: 'Coffee Shop', amount: 12, type: 'debit', category: 'Food' },
      { date: createDate(0, 15), description: 'Gas Station', amount: 52, type: 'debit', category: 'Transport' },
      { date: createDate(0, 17), description: 'FLIPKART Books', amount: 45, type: 'debit', category: 'Shopping' },
      { date: createDate(0, 19), description: 'Restaurant Dinner', amount: 65, type: 'debit', category: 'Food' },
      { date: createDate(0, 21), description: 'Gym Membership', amount: 50, type: 'debit', category: 'Healthcare' }
    );

    // Insert all transactions
    const transactionDocs = transactions.map(t => ({
      ...t,
      userId: user._id
    }));
    await Transaction.insertMany(transactionDocs);
    console.log(`✓ Created ${transactions.length} transactions\n`);

    // Create Budget for current month
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    await Budget.create({
      userId: user._id,
      month: currentMonth,
      totalBudget: 3000,
      categoryBudgets: [
        { category: 'Food', limit: 500 },
        { category: 'Transport', limit: 200 },
        { category: 'Shopping', limit: 300 },
        { category: 'Entertainment', limit: 100 },
        { category: 'Bills & Utilities', limit: 1500 },
        { category: 'Healthcare', limit: 200 }
      ]
    });
    console.log('✓ Created budget for current month\n');

    // Create Subscriptions
    const subscriptions = [
      {
        userId: user._id,
        name: 'Netflix',
        amount: 15,
        cycle: 'monthly',
        startDate: createDate(6, 15),
        nextRenewalDate: new Date(today.getFullYear(), today.getMonth() + 1, 15)
      },
      {
        userId: user._id,
        name: 'Spotify Premium',
        amount: 10,
        cycle: 'monthly',
        startDate: createDate(4, 10),
        nextRenewalDate: new Date(today.getFullYear(), today.getMonth() + 1, 10)
      },
      {
        userId: user._id,
        name: 'Amazon Prime',
        amount: 139,
        cycle: 'yearly',
        startDate: createDate(3, 1),
        nextRenewalDate: new Date(today.getFullYear() + 1, today.getMonth() - 3, 1)
      },
      {
        userId: user._id,
        name: 'Gym Membership',
        amount: 50,
        cycle: 'monthly',
        startDate: createDate(8, 1),
        nextRenewalDate: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      }
    ];
    await Subscription.insertMany(subscriptions);
    console.log('✓ Created 4 subscriptions\n');

    // Create Portfolio Investments
    const portfolioItems = [
      {
        userId: user._id,
        investmentName: 'Tech Stocks (AAPL, GOOGL)',
        initialAmount: 10000,
        currentValue: 12500,
        investmentDate: createDate(24, 1) // 2 years ago
      },
      {
        userId: user._id,
        investmentName: 'Index Fund (S&P 500)',
        initialAmount: 15000,
        currentValue: 17800,
        investmentDate: createDate(18, 15) // 1.5 years ago
      },
      {
        userId: user._id,
        investmentName: 'Real Estate Fund',
        initialAmount: 20000,
        currentValue: 22000,
        investmentDate: createDate(36, 1) // 3 years ago
      },
      {
        userId: user._id,
        investmentName: 'Cryptocurrency (BTC, ETH)',
        initialAmount: 5000,
        currentValue: 6200,
        investmentDate: createDate(12, 10) // 1 year ago
      }
    ];
    await Portfolio.insertMany(portfolioItems);
    console.log('✓ Created 4 portfolio investments\n');

    console.log('═'.repeat(60));
    console.log('✅ Demo user created successfully!');
    console.log('═'.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • User: ${demoName}`);
    console.log(`   • Email: ${demoEmail}`);
    console.log(`   • Password: ${demoPassword}`);
    console.log(`   • Transactions: ${transactions.length}`);
    console.log(`   • Budget: 1 (current month)`);
    console.log(`   • Subscriptions: 4`);
    console.log(`   • Portfolio Items: 4`);
    console.log('\n🚀 You can now login with these credentials!\n');

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  }
};

createDemoUser();
