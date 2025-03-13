/**
 * Simple test for window size persistence that exits when complete
 */
const { _electron: electron } = require('playwright');
const path = require('path');

async function runTest() {
  console.log('Starting simple window size persistence test...');
  
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
    
    // Get initial size
    const initialSize = await getWindowSize(app);
    console.log('Initial window size:', initialSize);
    
    // Resize to a custom size
    const customWidth = 800;
    const customHeight = 600;
    console.log(`Resizing window to ${customWidth}x${customHeight}`);
    
    await app.evaluate(({ BrowserWindow }, { width, height }) => {
      const win = BrowserWindow.getAllWindows()[0];
      if (win.isMaximized()) win.unmaximize();
      win.setSize(width, height);
    }, { width: customWidth, height: customHeight });
    
    // Verify new size
    await delay(500); // Wait for resize to apply
    const resizedSize = await getWindowSize(app);
    console.log('After resize:', resizedSize);
    
    // Click "Start" to enter timer mode
    console.log('Starting timer...');
    
    // Take a screenshot to see what's on screen
    await window.screenshot({ path: 'debug-screenshot.png' });
    console.log('Took debug screenshot: debug-screenshot.png');
    
    // Log the page content for debugging
    const pageContent = await window.content();
    console.log('Page content:', pageContent.substring(0, 500) + '...');
    
    // Try to find all visible buttons
    try {
      const buttons = await window.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        return allButtons.map(button => ({
          text: button.textContent,
          visible: button.offsetParent !== null,
          classes: button.className
        }));
      });
      console.log('All buttons on page:', buttons);
    } catch (e) {
      console.log('Error getting buttons:', e.message);
    }
    
    // Try a different selector
    console.log('Looking for the Start button with multiple selectors...');
    try {
      await window.waitForSelector('button:has-text("Start")', { timeout: 5000 });
      console.log('Found button with selector: button:has-text("Start")');
      await window.click('button:has-text("Start")');
    } catch (e) {
      console.log('Could not find with first selector, trying alternatives...');
      try {
        await window.waitForSelector('button:visible:has-text("Start")', { timeout: 5000 });
        console.log('Found button with selector: button:visible:has-text("Start")');
        await window.click('button:visible:has-text("Start")');
      } catch (e) {
        console.log('Still could not find, trying by class...');
        try {
          await window.waitForSelector('button.bg-emerald-600', { timeout: 5000 });
          console.log('Found button with selector: button.bg-emerald-600');
          await window.click('button.bg-emerald-600');
        } catch (e) {
          console.log('Failed to find button with all selectors');
          throw e;
        }
      }
    }
    
    // Verify timer size (should be smaller)
    await delay(1000);
    const timerSize = await getWindowSize(app);
    console.log('Timer size:', timerSize);
    
    // Exit timer with Escape
    console.log('Exiting timer...');
    await window.keyboard.press('Escape');
    
    // Wait for transition back to normal size
    await delay(3000);
    
    // Verify final size
    const finalSize = await getWindowSize(app);
    console.log('Final size after exiting timer:', finalSize);
    
    // Check if size was preserved
    const widthOk = Math.abs(finalSize.width - customWidth) <= 10;
    const heightOk = Math.abs(finalSize.height - customHeight) <= 10;
    const isMaximized = finalSize.isMaximized;
    
    if (widthOk && heightOk && !isMaximized) {
      console.log('✅ TEST PASSED: Window size was properly restored');
    } else {
      console.log('❌ TEST FAILED: Window size was not properly restored');
      console.log(`  Expected: ~${customWidth}x${customHeight}, not maximized`);
      console.log(`  Actual: ${finalSize.width}x${finalSize.height}, maximized: ${isMaximized}`);
    }
    
    // Summary of all window sizes
    console.log('\nSIZE SUMMARY:');
    console.log(`Initial:  ${initialSize.width}x${initialSize.height} (maximized: ${initialSize.isMaximized})`);
    console.log(`Custom:   ${customWidth}x${customHeight}`);
    console.log(`Timer:    ${timerSize.width}x${timerSize.height} (maximized: ${timerSize.isMaximized})`);
    console.log(`Final:    ${finalSize.width}x${finalSize.height} (maximized: ${finalSize.isMaximized})`);
    
    return {
      passed: widthOk && heightOk && !isMaximized,
      initialSize,
      timerSize,
      finalSize,
      expected: { width: customWidth, height: customHeight, isMaximized: false }
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