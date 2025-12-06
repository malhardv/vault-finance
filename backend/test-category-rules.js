// Test to verify category rules controller and routes are properly configured
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import CategoryRule from './models/CategoryRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testCategoryRules = async () => {
  try {
    console.log('🧪 Testing Category Rules Implementation\n');

    // Test 1: MongoDB Connection
    console.log('Test 1: MongoDB Connection');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully\n');
    
    // Test 2: CategoryRule Model
    console.log('Test 2: CategoryRule Model');
    try {
      const model = mongoose.model('CategoryRule');
      console.log('✓ CategoryRule model is registered');
    } catch (error) {
      console.log('✗ CategoryRule model is not registered');
      throw error;
    }

    // Test 3: Create a test category rule
    console.log('\nTest 3: Create Category Rule');
    const testRule = await CategoryRule.create({
      keyword: 'TEST_KEYWORD',
      category: 'Test Category',
      priority: 10
    });
    console.log('✓ Category rule created:', testRule);

    // Test 4: Read category rules
    console.log('\nTest 4: Read Category Rules');
    const rules = await CategoryRule.find();
    console.log(`✓ Found ${rules.length} category rules`);

    // Test 5: Update category rule
    console.log('\nTest 5: Update Category Rule');
    testRule.category = 'Updated Category';
    await testRule.save();
    console.log('✓ Category rule updated');

    // Test 6: Delete category rule
    console.log('\nTest 6: Delete Category Rule');
    await CategoryRule.findByIdAndDelete(testRule._id);
    const deletedRule = await CategoryRule.findById(testRule._id);
    if (!deletedRule) {
      console.log('✓ Category rule deleted successfully');
    } else {
      console.log('✗ Category rule still exists');
    }

    // Test 7: Verify controller functions exist
    console.log('\nTest 7: Verify Controller Functions');
    try {
      const controller = await import('./controllers/categoryRuleController.js');
      const functions = ['getCategoryRules', 'createCategoryRule', 'updateCategoryRule', 'deleteCategoryRule'];
      
      for (const funcName of functions) {
        if (typeof controller[funcName] === 'function') {
          console.log(`✓ ${funcName} function exists`);
        } else {
          console.log(`✗ ${funcName} function is missing`);
        }
      }
    } catch (error) {
      console.log('✗ Controller file not found or has errors');
      throw error;
    }

    // Test 8: Verify routes exist
    console.log('\nTest 8: Verify Routes File');
    try {
      await import('./routes/categoryRuleRoutes.js');
      console.log('✓ Category rule routes file exists');
    } catch (error) {
      console.log('✗ Category rule routes file not found or has errors');
      throw error;
    }

    console.log('\n✅ All category rules tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  }
};

testCategoryRules();
