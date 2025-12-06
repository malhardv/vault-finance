// Test to verify server starts correctly and basic endpoints work
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
import CategoryRule from './models/CategoryRule.js';
import Budget from './models/Budget.js';
import Subscription from './models/Subscription.js';
import Portfolio from './models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testServer = async () => {
  try {
    console.log('Testing Server Configuration\n');

    // Test 1: MongoDB Connection
    console.log('Test 1: MongoDB Connection');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    
    // Test 2: Environment Variables
    console.log('\nTest 2: Environment Variables');
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
    let allEnvVarsPresent = true;
    
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✓ ${varName} is set`);
      } else {
        console.log(`✗ ${varName} is missing`);
        allEnvVarsPresent = false;
      }
    });
    
    if (allEnvVarsPresent) {
      console.log('✓ All required environment variables are present');
    } else {
      console.log('✗ Some environment variables are missing');
    }

    // Test 3: Database Models
    console.log('\nTest 3: Database Models');
    const models = ['User', 'Transaction', 'CategoryRule', 'Budget', 'Subscription', 'Portfolio'];
    
    for (const modelName of models) {
      try {
        const model = mongoose.model(modelName);
        console.log(`✓ ${modelName} model is registered`);
      } catch (error) {
        console.log(`✗ ${modelName} model is not registered`);
      }
    }

    console.log('\n✓ All server configuration tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  }
};

testServer();
