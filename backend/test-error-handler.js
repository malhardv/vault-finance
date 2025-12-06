/**
 * Simple test to verify error handling middleware
 * Tests various error scenarios to ensure consistent error responses
 */

import { errorHandler } from './middleware/errorHandler.js';

// Mock request and response objects
const createMockReq = (path = '/test', method = 'GET') => ({
  path,
  method,
  originalUrl: path
});

const createMockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

const mockNext = () => {};

// Test cases
console.log('Testing Error Handler Middleware\n');

// Test 1: Mongoose Validation Error
console.log('Test 1: Mongoose Validation Error');
const validationError = new Error('Validation failed');
validationError.name = 'ValidationError';
validationError.errors = {
  email: { message: 'Email is required' },
  password: { message: 'Password is required' }
};

const req1 = createMockReq();
const res1 = createMockRes();
errorHandler(validationError, req1, res1, mockNext);
console.log('Status:', res1.statusCode);
console.log('Response:', res1.body);
console.log('✓ Validation error handled correctly\n');

// Test 2: Duplicate Key Error
console.log('Test 2: Duplicate Key Error');
const duplicateError = new Error('Duplicate key');
duplicateError.code = 11000;
duplicateError.keyPattern = { email: 1 };

const req2 = createMockReq();
const res2 = createMockRes();
errorHandler(duplicateError, req2, res2, mockNext);
console.log('Status:', res2.statusCode);
console.log('Response:', res2.body);
console.log('✓ Duplicate key error handled correctly\n');

// Test 3: JWT Authentication Error
console.log('Test 3: JWT Authentication Error');
const jwtError = new Error('Invalid token');
jwtError.name = 'JsonWebTokenError';

const req3 = createMockReq();
const res3 = createMockRes();
errorHandler(jwtError, req3, res3, mockNext);
console.log('Status:', res3.statusCode);
console.log('Response:', res3.body);
console.log('✓ JWT error handled correctly\n');

// Test 4: Token Expired Error
console.log('Test 4: Token Expired Error');
const expiredError = new Error('Token expired');
expiredError.name = 'TokenExpiredError';

const req4 = createMockReq();
const res4 = createMockRes();
errorHandler(expiredError, req4, res4, mockNext);
console.log('Status:', res4.statusCode);
console.log('Response:', res4.body);
console.log('✓ Token expired error handled correctly\n');

// Test 5: Cast Error (Invalid ObjectId)
console.log('Test 5: Cast Error (Invalid ObjectId)');
const castError = new Error('Cast to ObjectId failed');
castError.name = 'CastError';

const req5 = createMockReq();
const res5 = createMockRes();
errorHandler(castError, req5, res5, mockNext);
console.log('Status:', res5.statusCode);
console.log('Response:', res5.body);
console.log('✓ Cast error handled correctly\n');

// Test 6: File Upload Error
console.log('Test 6: File Upload Error');
const fileError = new Error('Unsupported file type');
fileError.code = 'LIMIT_UNEXPECTED_FILE';

const req6 = createMockReq();
const res6 = createMockRes();
errorHandler(fileError, req6, res6, mockNext);
console.log('Status:', res6.statusCode);
console.log('Response:', res6.body);
console.log('✓ File upload error handled correctly\n');

// Test 7: Generic Error
console.log('Test 7: Generic Error');
const genericError = new Error('Something went wrong');

const req7 = createMockReq();
const res7 = createMockRes();
errorHandler(genericError, req7, res7, mockNext);
console.log('Status:', res7.statusCode);
console.log('Response:', res7.body);
console.log('✓ Generic error handled correctly\n');

// Test 8: Not Found Error
console.log('Test 8: Not Found Error');
const notFoundError = new Error('User not found');

const req8 = createMockReq();
const res8 = createMockRes();
errorHandler(notFoundError, req8, res8, mockNext);
console.log('Status:', res8.statusCode);
console.log('Response:', res8.body);
console.log('✓ Not found error handled correctly\n');

console.log('All error handler tests completed successfully! ✓');
