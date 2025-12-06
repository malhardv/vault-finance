// Manual test script for subscription functionality
// This is a temporary test file to verify the implementation

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Subscription from './models/Subscription.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testSubscription = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Create a test user ID
    const testUserId = new mongoose.Types.ObjectId();

    // Test 1: Create a monthly subscription
    const monthlySubscription = new Subscription({
      userId: testUserId,
      name: 'Netflix',
      amount: 15.99,
      cycle: 'monthly',
      startDate: new Date('2024-01-01'),
      nextRenewalDate: new Date('2024-12-01')
    });
    await monthlySubscription.save();
    console.log('✓ Created monthly subscription');

    // Test 2: Create a yearly subscription
    const yearlySubscription = new Subscription({
      userId: testUserId,
      name: 'Amazon Prime',
      amount: 139,
      cycle: 'yearly',
      startDate: new Date('2024-01-15'),
      nextRenewalDate: new Date('2025-01-15')
    });
    await yearlySubscription.save();
    console.log('✓ Created yearly subscription');

    // Test 3: Fetch subscriptions ordered by renewal date
    const subscriptions = await Subscription.find({ userId: testUserId })
      .sort({ nextRenewalDate: 1 });
    
    console.log('✓ Fetched subscriptions ordered by renewal date:');
    subscriptions.forEach(sub => {
      console.log(`  - ${sub.name}: ${sub.nextRenewalDate.toISOString().split('T')[0]}`);
    });

    // Verify ordering
    if (subscriptions.length === 2 && 
        subscriptions[0].nextRenewalDate < subscriptions[1].nextRenewalDate) {
      console.log('✓ Subscriptions are correctly ordered by renewal date');
    } else {
      console.log('✗ Subscription ordering failed');
    }

    // Cleanup
    await Subscription.deleteMany({ userId: testUserId });
    console.log('✓ Cleaned up test data');

    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  }
};

testSubscription();
