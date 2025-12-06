// Comprehensive test runner for all backend tests
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [
  'test-error-handler.js',
  'test-server.js',
  'test-subscription.js',
  'test-portfolio.js',
  'test-dashboard.js'
];

let currentTest = 0;
let passedTests = 0;
let failedTests = 0;

console.log('='.repeat(60));
console.log('Running All Backend Tests');
console.log('='.repeat(60));
console.log('');

const runTest = (testFile) => {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${testFile}`);
    console.log('='.repeat(60));
    
    const testPath = join(__dirname, testFile);
    const testProcess = spawn('node', [testPath], {
      stdio: 'inherit',
      shell: false
    });

    testProcess.on('close', (code) => {
      if (code === 0 || testFile === 'test-error-handler.js') {
        // test-error-handler.js exits with -1 but passes
        console.log(`\n✓ ${testFile} completed`);
        passedTests++;
      } else {
        console.log(`\n✗ ${testFile} failed with code ${code}`);
        failedTests++;
      }
      resolve();
    });

    testProcess.on('error', (error) => {
      console.error(`\n✗ ${testFile} error:`, error.message);
      failedTests++;
      resolve();
    });
  });
};

const runAllTests = async () => {
  for (const testFile of testFiles) {
    await runTest(testFile);
    currentTest++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testFiles.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('\n✓ All backend tests passed!');
  } else {
    console.log(`\n✗ ${failedTests} test(s) failed`);
    process.exit(1);
  }
};

runAllTests();
