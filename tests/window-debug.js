/**
 * This is a standalone script to debug window size issues.
 * It adds instrumentation to the app to log window events.
 */

const { _electron: electron } = require('playwright');
const path = require('path');

async function main() {
  console.log('Starting window debug utility...');
  
  // Path to the Electron app
  const appPath = path.join(__dirname, '..', 'dist-electron', 'main.js');
  
  // Launch the Electron app
  const app = await electron.launch({ 
    args: [appPath],
    timeout: 5000
  });
  
  // Get the first window
  const window = await app.firstWindow();
  
  // Wait for app to be fully loaded
  await window.waitForLoadState('domcontentloaded');
  console.log('App loaded');
  
  // Add instrumentation to log window events
  await app.evaluate(async ({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    
    // Log all window events
    const events = [
      'resize', 'move', 'maximize', 'unmaximize', 'minimize', 'restore',
      'focus', 'blur', 'show', 'hide', 'ready-to-show'
    ];
    
    events.forEach(event => {
      win.on(event, () => {
        const size = win.getSize();
        const position = win.getPosition();
        const state = {
          event,
          width: size[0],
          height: size[1],
          x: position[0],
          y: position[1],
          isMaximized: win.isMaximized(),
          isMinimized: win.isMinimized(),
          isVisible: win.isVisible(),
          isFocused: win.isFocused(),
          timestamp: new Date().toISOString()
        };
        console.log('Window Event:', JSON.stringify(state, null, 2));
      });
    });
    
    // Also log state every 2 seconds for monitoring
    setInterval(() => {
      const size = win.getSize();
      const position = win.getPosition();
      const state = {
        event: 'interval-check',
        width: size[0],
        height: size[1],
        x: position[0],
        y: position[1],
        isMaximized: win.isMaximized(),
        isMinimized: win.isMinimized(),
        isVisible: win.isVisible(),
        isFocused: win.isFocused(),
        timestamp: new Date().toISOString()
      };
      console.log('Window State Check:', JSON.stringify(state, null, 2));
    }, 2000);
    
    console.log('Window event instrumentation added');
  });
  
  // Keep the app running until user interrupts
  console.log('Debug utility running. Press Ctrl+C to exit');
  
  // Wait indefinitely
  await new Promise(() => {});
}

main().catch(error => {
  console.error('Error in debug utility:', error);
  process.exit(1);
});