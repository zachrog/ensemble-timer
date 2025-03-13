const { test, _electron: electron, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Enhanced fully automated test to verify window size persistence
 */
test.describe('Window size persistence', () => {
  // Test multiple window size configurations
  const testSizes = [
    { width: 800, height: 600, name: 'Medium size' },
    { width: 1024, height: 768, name: 'Large size' },
    { width: 640, height: 480, name: 'Small size' }
  ];
  
  // Create a dedicated test log file
  const logFile = path.join(os.tmpdir(), `ensemble-timer-test-${Date.now()}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  
  // Custom logging function to write to console and file
  const log = (message) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;
    console.log(formattedMessage);
    logStream.write(formattedMessage + '\n');
  };
  
  // Setup test environment
  test.beforeAll(async () => {
    log('================ TEST STARTED ================');
    log(`Log file: ${logFile}`);
    log(`Platform: ${os.platform()} (${os.release()})`);
    log(`Node version: ${process.version}`);
  });
  
  // Cleanup after tests
  test.afterAll(async () => {
    log('================ TEST COMPLETED ================');
    logStream.end();
    console.log(`Test log saved to: ${logFile}`);
  });
  
  // Create a test for each window size
  for (const testSize of testSizes) {
    test(`Window size should be preserved after timer cycle - ${testSize.name}`, async () => {
      // Create a screenshots directory
      const screenshotsDir = path.join(__dirname, 'screenshots', `size-${testSize.width}x${testSize.height}`);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      // Capture screenshots at key points
      const captureScreenshot = async (name, window) => {
        const screenshotPath = path.join(screenshotsDir, `${name}.png`);
        if (window) {
          await window.screenshot({ path: screenshotPath });
          log(`Screenshot captured: ${screenshotPath}`);
        } else {
          log(`Screenshot skipped for ${name} - no window available`);
        }
        return screenshotPath;
      };
      
      // Helper to log detailed window state
      const logWindowState = async (app, label) => {
        const state = await app.evaluate(async ({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          const size = win.getSize();
          const position = win.getPosition();
          const bounds = win.getBounds();
          
          return {
            size: { width: size[0], height: size[1] },
            position: { x: position[0], y: position[1] },
            bounds,
            isMaximized: win.isMaximized(),
            isMinimized: win.isMinimized(),
            isFullScreen: win.isFullScreen(),
            isResizable: win.isResizable(),
            isMovable: win.isMovable(),
            isVisible: win.isVisible(),
            isFocused: win.isFocused()
          };
        });
        
        log(`Window State - ${label}:`);
        log(JSON.stringify(state, null, 2));
        return state;
      };
      
      try {
        // Path to the Electron app
        const appPath = path.join(__dirname, '..', 'dist-electron', 'main.js');
        log(`App path: ${appPath}`);
        
        // Launch the Electron app
        log('Launching Electron app...');
        const app = await electron.launch({ 
          args: [appPath],
          timeout: 10000
        });
        
        // Add instrumentation for detailed window event logging
        await app.evaluate(async ({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          
          // Intercept all window events for debugging
          const events = [
            'resize', 'move', 'maximize', 'unmaximize', 'minimize', 'restore',
            'focus', 'blur', 'show', 'hide'
          ];
          
          events.forEach(event => {
            win.on(event, () => {
              const size = win.getSize();
              const isMax = win.isMaximized();
              console.log(`EVENT: ${event} - Size: ${size[0]}x${size[1]}, Maximized: ${isMax}`);
            });
          });
        });
        
        // Get the first window
        const window = await app.firstWindow();
        
        // Wait for app to be fully loaded
        await window.waitForLoadState('domcontentloaded');
        log('App loaded successfully');
        await captureScreenshot('01-app-loaded', window);
        
        // Get initial window bounds
        const originalBounds = await logWindowState(app, 'Initial');
        
        // Ensure window is not maximized
        await app.evaluate(async ({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          if (win.isMaximized()) {
            win.unmaximize();
          }
        });
        
        // Resize to our test size
        log(`Resizing window to ${testSize.width}x${testSize.height}...`);
        await app.evaluate(async ({ BrowserWindow }, { width, height }) => {
          const win = BrowserWindow.getAllWindows()[0];
          win.setSize(width, height);
        }, testSize);
        
        // Wait for resize to apply
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the window size has been set
        const resizedBounds = await logWindowState(app, 'After Resize');
        await captureScreenshot('02-after-resize', window);
        
        // Validate resize worked
        expect(resizedBounds.size.width).toBe(testSize.width);
        expect(resizedBounds.size.height).toBe(testSize.height);
        log('Resize validation passed');
        
        // Find and click the 'Start' button
        log('Attempting to start timer...');
        await window.waitForSelector('button:has-text("Start")');
        await window.click('button:has-text("Start")');
        log('Clicked Start button');
        
        // Wait for the window to transition to timer mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify timer mode dimensions (should be smaller)
        const timerBounds = await logWindowState(app, 'Timer Mode');
        await captureScreenshot('03-timer-mode', window);
        
        // Timer should be significantly smaller
        expect(timerBounds.size.width).toBeLessThan(testSize.width);
        expect(timerBounds.size.height).toBeLessThan(testSize.height);
        log('Timer size validation passed');
        
        // Check if the window was actually resized to a small overlay
        if (timerBounds.size.width > 300 || timerBounds.size.height > 300) {
          log('WARNING: Timer window may not have properly resized to overlay mode');
        }
        
        // Press Escape to exit the timer
        log('Exiting timer mode...');
        await window.keyboard.press('Escape');
        
        // Wait longer for the window to fully transition back
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check final window size after timer exit
        const finalBounds = await logWindowState(app, 'After Timer Exit');
        await captureScreenshot('04-after-exit', window);
        
        // CRITICAL TEST: Verify window size was properly restored
        expect(finalBounds.isMaximized).toBe(false);
        
        // First test - exact match with slight tolerance
        const widthMatch = Math.abs(finalBounds.size.width - testSize.width) <= 10;
        const heightMatch = Math.abs(finalBounds.size.height - testSize.height) <= 10;
        
        if (widthMatch && heightMatch) {
          log('SUCCESS: Window size was properly restored');
        } else {
          log(`ERROR: Window size was not properly restored. Expected: ${testSize.width}x${testSize.height}, Actual: ${finalBounds.size.width}x${finalBounds.size.height}`);
          
          // This will fail the test
          expect(finalBounds.size.width).toBeCloseTo(testSize.width, -1); // -1 gives tolerance of about ±10
          expect(finalBounds.size.height).toBeCloseTo(testSize.height, -1);
        }
        
        // Print a summary
        log('=== TEST SUMMARY ===');
        log(`Original size: ${originalBounds.size.width}x${originalBounds.size.height}`);
        log(`Custom size: ${testSize.width}x${testSize.height}`);
        log(`Timer size: ${timerBounds.size.width}x${timerBounds.size.height}`);
        log(`Final size: ${finalBounds.size.width}x${finalBounds.size.height}`);
        log(`Maximized: ${finalBounds.isMaximized}`);
        log(`Size matches: ${widthMatch && heightMatch}`);
        
        // Close the app
        await app.close();
        
      } catch (error) {
        // Log any errors and take a screenshot
        log(`ERROR during test: ${error.message}`);
        try {
          const errorWindow = await app.firstWindow().catch(() => null);
          await captureScreenshot('error', errorWindow);
        } catch (screenshotError) {
          log(`Failed to capture error screenshot: ${screenshotError.message}`);
        }
        throw error;
      }
    });
  }
  
  // Add an additional test that checks saved window size persistence
  test('Saved window size should persist between app restarts', async () => {
    const customWidth = 850;
    const customHeight = 650;
    let appInstance;
    
    try {
      log('=== Testing window size persistence across app restarts ===');
      const appPath = path.join(__dirname, '..', 'dist-electron', 'main.js');
      
      // First session: launch app and set custom size
      log('Starting first app session...');
      appInstance = await electron.launch({ args: [appPath], timeout: 10000 });
      const window1 = await appInstance.firstWindow();
      await window1.waitForLoadState('domcontentloaded');
      
      // Set custom size
      await appInstance.evaluate(async ({ BrowserWindow }, { width, height }) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win.isMaximized()) win.unmaximize();
        win.setSize(width, height);
      }, { width: customWidth, height: customHeight });
      
      // Wait for size to be applied
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Start timer to ensure size is saved
      log('Starting timer to trigger size saving...');
      await window1.click('button:has-text("Start")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exit timer to trigger size restoration
      await window1.keyboard.press('Escape');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close app
      log('Closing first app session...');
      await appInstance.close();
      appInstance = null;
      
      // Second session: relaunch app and verify size is restored
      log('Starting second app session...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between sessions
      
      appInstance = await electron.launch({ args: [appPath], timeout: 10000 });
      const window2 = await appInstance.firstWindow();
      await window2.waitForLoadState('domcontentloaded');
      
      // Wait for window to fully initialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if size was restored
      const newSessionBounds = await appInstance.evaluate(async ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return {
          width: win.getSize()[0],
          height: win.getSize()[1],
          isMaximized: win.isMaximized()
        };
      });
      
      log('Second session window bounds:', JSON.stringify(newSessionBounds));
      
      // Allow for slight variations in exact size due to window decorations, etc.
      const widthWithinTolerance = Math.abs(newSessionBounds.width - customWidth) <= 20;
      const heightWithinTolerance = Math.abs(newSessionBounds.height - customHeight) <= 20;
      
      if (widthWithinTolerance && heightWithinTolerance && !newSessionBounds.isMaximized) {
        log('SUCCESS: Window size was properly remembered between app sessions');
      } else {
        log(`ERROR: Window size was not preserved. Expected ~${customWidth}x${customHeight}, Got: ${newSessionBounds.width}x${newSessionBounds.height}`);
      }
      
      // This will fail the test if dimensions are way off
      expect(newSessionBounds.isMaximized).toBe(false);
      expect(newSessionBounds.width).toBeGreaterThan(customWidth - 50);
      expect(newSessionBounds.width).toBeLessThan(customWidth + 50);
      expect(newSessionBounds.height).toBeGreaterThan(customHeight - 50);
      expect(newSessionBounds.height).toBeLessThan(customHeight + 50);
      
    } finally {
      // Ensure app is closed
      if (appInstance) {
        await appInstance.close().catch(() => {}); // Ignore errors if already closed
      }
    }
  });
});