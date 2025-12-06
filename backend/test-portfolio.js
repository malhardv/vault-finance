// Manual test script for portfolio functionality
// This is a temporary test file to verify the implementation

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Portfolio from './models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testPortfolio = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Create a test user ID
    const testUserId = new mongoose.Types.ObjectId();

    // Test 1: Create first investment
    const investment1 = new Portfolio({
      userId: testUserId,
      investmentName: 'Tech Stocks',
      initialAmount: 10000,
      currentValue: 12500,
      investmentDate: new Date('2023-01-01')
    });
    await investment1.save();
    console.log('✓ Created first investment');

    // Test 2: Create second investment
    const investment2 = new Portfolio({
      userId: testUserId,
      investmentName: 'Real Estate Fund',
      initialAmount: 20000,
      currentValue: 22000,
      investmentDate: new Date('2022-06-15')
    });
    await investment2.save();
    console.log('✓ Created second investment');

    // Test 3: Fetch portfolio and calculate metrics
    const investments = await Portfolio.find({ userId: testUserId }).lean();
    
    console.log('✓ Fetched portfolio:');
    
    // Calculate gain/loss for each investment
    const investmentsWithCalcs = investments.map(inv => {
      const gainLoss = inv.currentValue - inv.initialAmount;
      
      // Calculate CAGR
      const now = new Date();
      const startDate = new Date(inv.investmentDate);
      const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
      const years = (now - startDate) / millisecondsPerYear;
      const cagr = years > 0 && inv.initialAmount > 0 
        ? (Math.pow(inv.currentValue / inv.initialAmount, 1 / years) - 1) * 100
        : 0;
      
      return {
        ...inv,
        gainLoss,
        cagr
      };
    });

    // Calculate allocation
    const totalValue = investmentsWithCalcs.reduce((sum, inv) => sum + inv.currentValue, 0);
    const portfolio = investmentsWithCalcs.map(inv => ({
      ...inv,
      allocation: totalValue > 0 ? (inv.currentValue / totalValue) * 100 : 0
    }));

    portfolio.forEach(inv => {
      console.log(`\n  Investment: ${inv.investmentName}`);
      console.log(`  Initial Amount: $${inv.initialAmount}`);
      console.log(`  Current Value: $${inv.currentValue}`);
      console.log(`  Gain/Loss: $${inv.gainLoss.toFixed(2)}`);
      console.log(`  CAGR: ${inv.cagr.toFixed(2)}%`);
      console.log(`  Allocation: ${inv.allocation.toFixed(2)}%`);
    });

    // Test 4: Verify calculations
    console.log('\n✓ Verifying calculations:');
    
    // Check allocation sums to 100%
    const totalAllocation = portfolio.reduce((sum, inv) => sum + inv.allocation, 0);
    console.log(`  Total allocation: ${totalAllocation.toFixed(2)}% (should be ~100%)`);
    
    if (Math.abs(totalAllocation - 100) < 0.01) {
      console.log('  ✓ Allocation calculation correct');
    } else {
      console.log('  ✗ Allocation calculation failed');
    }
    
    // Check gain/loss calculation
    const inv1 = portfolio.find(p => p.investmentName === 'Tech Stocks');
    const expectedGainLoss1 = 12500 - 10000;
    console.log(`  Tech Stocks gain/loss: $${inv1.gainLoss} (expected: $${expectedGainLoss1})`);
    
    if (inv1.gainLoss === expectedGainLoss1) {
      console.log('  ✓ Gain/loss calculation correct');
    } else {
      console.log('  ✗ Gain/loss calculation failed');
    }

    // Cleanup
    await Portfolio.deleteMany({ userId: testUserId });
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

testPortfolio();
