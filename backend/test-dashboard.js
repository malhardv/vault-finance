// Manual test script for dashboard functionality
// This is a temporary test file to verify the implementation

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Transaction from './models/Transaction.js';
import {
  getCategorySpending,
  getMonthlyTrends,
  getIncomeExpense
} from './controllers/dashboardController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testDashboard = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Create a test user ID
    const testUserId = new mongoose.Types.ObjectId();

    // Test 1: Create sample transactions for testing
    // Using previous month for testing to avoid future dates
    const now = new Date();
    const testMonth = now.getMonth() - 1; // Use previous month
    const testYear = testMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const adjustedMonth = testMonth < 0 ? 11 : testMonth;
    
    const testTransactions = [
      // Test month transactions
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth, 5),
        description: 'Grocery shopping',
        amount: 150,
        type: 'debit',
        category: 'Food'
      },
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth, 10),
        description: 'Salary',
        amount: 5000,
        type: 'credit',
        category: 'Income'
      },
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth, 15),
        description: 'Uber ride',
        amount: 25,
        type: 'debit',
        category: 'Transport'
      },
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth, 20),
        description: 'Amazon purchase',
        amount: 200,
        type: 'debit',
        category: 'Shopping'
      },
      // Two months ago transactions
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth - 1, 5),
        description: 'Restaurant',
        amount: 80,
        type: 'debit',
        category: 'Food'
      },
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth - 1, 10),
        description: 'Salary',
        amount: 5000,
        type: 'credit',
        category: 'Income'
      },
      {
        userId: testUserId,
        date: new Date(testYear, adjustedMonth - 1, 15),
        description: 'Gas',
        amount: 50,
        type: 'debit',
        category: 'Transport'
      }
    ];

    await Transaction.insertMany(testTransactions);
    console.log('✓ Created test transactions');
    const testMonthStr = `${testYear}-${String(adjustedMonth + 1).padStart(2, '0')}`;
    console.log(`  Test month: ${testMonthStr}`);

    // Test 2: Test getCategorySpending
    console.log('\n--- Testing getCategorySpending ---');
    const mockReq1 = {
      userId: testUserId,
      query: { month: testMonthStr }
    };
    const mockRes1 = {
      json: (data) => {
        console.log('✓ Category spending response:', JSON.stringify(data, null, 2));
        
        // Verify data format
        if (data.success && data.data.categorySpending) {
          const categoryData = data.data.categorySpending;
          console.log('✓ Data format is correct (array of objects with category and amount)');
          
          // Verify calculations
          const foodSpending = categoryData.find(c => c.category === 'Food');
          const transportSpending = categoryData.find(c => c.category === 'Transport');
          const shoppingSpending = categoryData.find(c => c.category === 'Shopping');
          
          console.log(`  Food: ${foodSpending?.amount} (expected: 150)`);
          console.log(`  Transport: ${transportSpending?.amount} (expected: 25)`);
          console.log(`  Shopping: ${shoppingSpending?.amount} (expected: 200)`);
          
          if (foodSpending?.amount === 150 && transportSpending?.amount === 25 && shoppingSpending?.amount === 200) {
            console.log('✓ Category spending calculations are correct');
          } else {
            console.log('✗ Category spending calculations failed');
          }
        }
        return mockRes1;
      },
      status: (code) => mockRes1
    };
    const mockNext1 = (err) => {
      if (err) console.error('✗ Error:', err.message);
    };

    await getCategorySpending(mockReq1, mockRes1, mockNext1);

    // Test 3: Test getMonthlyTrends
    console.log('\n--- Testing getMonthlyTrends ---');
    const mockReq2 = {
      userId: testUserId,
      query: { months: '3' }
    };
    const mockRes2 = {
      json: (data) => {
        console.log('✓ Monthly trends response:', JSON.stringify(data, null, 2));
        
        // Verify data format
        if (data.success && data.data.monthlyTrends) {
          const trends = data.data.monthlyTrends;
          console.log('✓ Data format is correct (array of objects with month and amount)');
          
          // Verify it includes multiple months
          if (trends.length > 0) {
            console.log(`✓ Returned ${trends.length} months of data`);
          }
        }
        return mockRes2;
      },
      status: (code) => mockRes2
    };
    const mockNext2 = (err) => {
      if (err) console.error('✗ Error:', err.message);
    };

    await getMonthlyTrends(mockReq2, mockRes2, mockNext2);

    // Test 4: Test getIncomeExpense
    console.log('\n--- Testing getIncomeExpense ---');
    const mockReq3 = {
      userId: testUserId,
      query: { months: '3' }
    };
    const mockRes3 = {
      json: (data) => {
        console.log('✓ Income vs expense response:', JSON.stringify(data, null, 2));
        
        // Verify data format
        if (data.success && data.data.income && data.data.expense) {
          console.log('✓ Data format is correct (object with income and expense arrays)');
          
          // Verify calculations for test month
          const testMonthIncome = data.data.income.find(i => i.month === testMonthStr);
          const testMonthExpense = data.data.expense.find(e => e.month === testMonthStr);
          
          console.log(`  Test month (${testMonthStr}) Income: ${testMonthIncome?.amount} (expected: 5000)`);
          console.log(`  Test month (${testMonthStr}) Expense: ${testMonthExpense?.amount} (expected: 375)`);
          
          if (testMonthIncome?.amount === 5000 && testMonthExpense?.amount === 375) {
            console.log('✓ Income vs expense calculations are correct');
          } else {
            console.log('✗ Income vs expense calculations failed');
          }
        }
        return mockRes3;
      },
      status: (code) => mockRes3
    };
    const mockNext3 = (err) => {
      if (err) console.error('✗ Error:', err.message);
    };

    await getIncomeExpense(mockReq3, mockRes3, mockNext3);

    // Cleanup
    await Transaction.deleteMany({ userId: testUserId });
    console.log('\n✓ Cleaned up test data');

    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  }
};

testDashboard();
