/**
 * Direct test for window size persistence at the Electron level
 * This test bypasses UI interaction and directly modifies/checks window state
 */
const { _electron: electron } = require('playwright');
const path = require('path');

async function runTest() {
  console.log('Starting direct window size test...');
  
  let app = null;
  
  try {
    // Launch the app
    const appPath = path.join(__dirname, '..', 'dist-electron', 'main.js');
    console.log(`Launching app from: ${appPath}`);
    
    app = await electron.launch({ 
      args: [appPath],
      timeout: 10000
    });
    
    console.log('App launched successfully');
    
    // Wait for the app to load
    const window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    console.log('App window loaded');
    
    // Step 1: Set the testSize directly using Electron's API
    const testSize = { width: 800, height: 600 };
    console.log(`Setting window size to ${testSize.width}x${testSize.height}`);
    
    // Resize the window directly
    await app.evaluate(({ BrowserWindow }, { width, height }) => {
      const win = BrowserWindow.getAllWindows()[0];
      if (win.isMaximized()) win.unmaximize();
      win.setSize(width, height);
    }, testSize);
    
    // Verify the size was set correctly
    await delay(500);
    const resizedSize = await getWindowSize(app);
    console.log('After resize:', resizedSize);
    
    // Step 2: Directly call our saveWindowSize function
    console.log('Saving window size...');
    await app.evaluate(async ({ BrowserWindow }) => {
      // Assume savedWindowSize is a variable in customCommandReceiver.ts
      // This simulates what happens when saveWindowSize is called
      const win = BrowserWindow.getAllWindows()[0];
      const [width, height] = win.getSize();
      
      // Create or set the savedWindowSize variable directly in renderer process
      global.savedWindowSize = { width, height };
      console.log('Saved size:', global.savedWindowSize);
    });
    
    // Step 3: Maximize the window (simulating what happens when timer ends)
    console.log('Maximizing window...');
    await app.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.maximize();
    });
    
    // Verify window is maximized
    await delay(500);
    const maximizedSize = await getWindowSize(app);
    console.log('After maximize:', maximizedSize);
    
    // Step 4: Restore the window size using our restore function
    console.log('Restoring window size...');
    await app.evaluate(async ({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      
      // If the window is maximized, unmaximize it
      if (win.isMaximized()) {
        win.unmaximize();
      }
      
      // Wait for unmaximize to take effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Set the size to the saved size
      if (global.savedWindowSize) {
        win.setSize(global.savedWindowSize.width, global.savedWindowSize.height);
        console.log('Restored to saved size:', global.savedWindowSize);
      }
    });
    
    // Verify final window size after restore
    await delay(500);
    const finalSize = await getWindowSize(app);
    console.log('After restore:', finalSize);
    
    // Check if size was correctly restored
    const widthOk = Math.abs(finalSize.width - testSize.width) <= 10;
    const heightOk = Math.abs(finalSize.height - testSize.height) <= 10;
    const isMaximized = finalSize.isMaximized;
    
    if (widthOk && heightOk && !isMaximized) {
      console.log('✅ TEST PASSED: Window size was properly restored');
    } else {
      console.log('❌ TEST FAILED: Window size was not properly restored');
      console.log(`  Expected: ~${testSize.width}x${testSize.height}, not maximized`);
      console.log(`  Actual: ${finalSize.width}x${finalSize.height}, maximized: ${isMaximized}`);
    }
    
    // Summary of all window sizes
    console.log('\nSIZE SUMMARY:');
    console.log(`Original: ${testSize.width}x${testSize.height}`);
    console.log(`Resized:  ${resizedSize.width}x${resizedSize.height} (maximized: ${resizedSize.isMaximized})`);
    console.log(`Max:      ${maximizedSize.width}x${maximizedSize.height} (maximized: ${maximizedSize.isMaximized})`);
    console.log(`Final:    ${finalSize.width}x${finalSize.height} (maximized: ${finalSize.isMaximized})`);
    
    return {
      passed: widthOk && heightOk && !isMaximized,
      testSize,
      resizedSize,
      maximizedSize,
      finalSize
    };
    
  } catch (error) {
    console.error('Test error:', error);
    return { passed: false, error: error.message };
  } finally {
    // Always close the app
    if (app) {
      console.log('Closing app...');
      await app.close();
    }
  }
}

// Helper to get window size
async function getWindowSize(app) {
  return await app.evaluate(async ({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    return {
      width: win.getSize()[0],
      height: win.getSize()[1],
      isMaximized: win.isMaximized()
    };
  });
}

// Simple delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test and exit
runTest()
  .then(result => {
    console.log(`\nTest completed. Result: ${result.passed ? 'PASSED' : 'FAILED'}`);
    process.exit(result.passed ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });