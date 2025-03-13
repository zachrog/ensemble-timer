/**
 * Automated test runner for window size persistence
 * This script:
 * 1. Builds the app
 * 2. Runs the tests
 * 3. Generates HTML report
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create a log directory for this run
const testRunTime = new Date().toISOString().replace(/[:.]/g, '-');
const logDir = path.join(__dirname, 'logs', testRunTime);
fs.mkdirSync(logDir, { recursive: true });

// Log both to console and to file
const logFile = path.join(logDir, 'run.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

// Run a command and log output
function runCommand(command, description) {
  log(`${description}...`);
  log(`Running: ${command}`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe', // Capture output
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
    });
    
    // Log command output to file only (can be very verbose)
    logStream.write(`\n--- ${description} OUTPUT START ---\n`);
    logStream.write(output);
    logStream.write(`\n--- ${description} OUTPUT END ---\n\n`);
    
    log(`${description} completed successfully`);
    return { success: true, output };
  } catch (error) {
    log(`ERROR in ${description}:`);
    log(error.message);
    
    // Log error details to file
    logStream.write(`\n--- ${description} ERROR OUTPUT START ---\n`);
    if (error.stdout) logStream.write(`STDOUT:\n${error.stdout}\n`);
    if (error.stderr) logStream.write(`STDERR:\n${error.stderr}\n`);
    logStream.write(`\n--- ${description} ERROR OUTPUT END ---\n\n`);
    
    return { success: false, error };
  }
}

async function main() {
  try {
    log('====== WINDOW SIZE PERSISTENCE TEST AUTOMATION ======');
    log(`Test run: ${testRunTime}`);
    log(`Platform: ${os.platform()} ${os.release()}`);
    log(`Node version: ${process.version}`);
    log(`Working directory: ${process.cwd()}`);
    log(`Log directory: ${logDir}`);
    
    // Install test dependencies if needed
    runCommand('npm run test:install', 'Installing test dependencies');
    
    // Build the app
    const buildResult = runCommand('npm run build', 'Building application');
    if (!buildResult.success) {
      log('Build failed, cannot continue with tests');
      process.exit(1);
    }
    
    // Run the test
    const testResult = runCommand(
      'npx playwright test tests/window-size-persistence.test.js --reporter=html,line', 
      'Running window size persistence tests'
    );
    
    if (testResult.success) {
      log('✅ Tests completed successfully');
    } else {
      log('❌ Tests failed');
    }
    
    // Copy test report to our log directory
    if (fs.existsSync('playwright-report')) {
      runCommand(`cp -r playwright-report ${logDir}/`, 'Copying test report');
      log(`Test report copied to: ${logDir}/playwright-report`);
    }
    
    // Print summary
    log('\n====== TEST SUMMARY ======');
    log(`Build: ${buildResult.success ? '✅ Passed' : '❌ Failed'}`);
    log(`Tests: ${testResult.success ? '✅ Passed' : '❌ Failed'}`);
    log(`Log file: ${logFile}`);
    log(`Report: ${path.join(logDir, 'playwright-report', 'index.html')}`);
    
  } catch (error) {
    log('Unhandled error in test automation:');
    log(error.stack || error.message);
  } finally {
    // Close log stream
    logStream.end();
  }
}

main().catch(console.error);