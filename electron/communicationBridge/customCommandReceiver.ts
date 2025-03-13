import { BrowserWindow, screen, ipcMain } from 'electron';
import { customCommandChannelName } from './constants';
import { app } from 'electron';

// Store the window size and position before maximizing
let savedWindowState: { 
  width: number; 
  height: number;
  x: number;
  y: number;
} | null = null;

// Flag to ignore programmatic resize events
// We'll use a regular variable since we don't have direct access to globals
let isProgrammaticResize = false;

// Functions to access and modify the flag
const getProgrammaticResize = () => isProgrammaticResize;
const setProgrammaticResize = (value: boolean) => {
  isProgrammaticResize = value;
};

// Export the function for other modules to use
export const setProgrammaticResizeState = setProgrammaticResize;

export function createCustomCommandReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  // Listen for window resize events to track manual resizing by the user
  let lastResizeTimeStamp = 0;
  
  window.on('resize', () => {
    // Get current timestamp for throttling
    const now = Date.now();
    
    // Only save size if it's not a programmatic resize, not maximized, and not throttled
    if (!getProgrammaticResize() && !window.isMaximized() && (now - lastResizeTimeStamp > 100)) {
      const [width, height] = window.getSize();
      
      // Don't save timer overlay sizes
      const isTooSmall = width <= 300 && height <= 300;
      
      if (!isTooSmall) {
        // Get current position
        const [x, y] = window.getPosition();
        
        // Save both size and position
        savedWindowState = { width, height, x, y };
        console.log('Window resized by user, saved state:', savedWindowState);
      } else {
        console.log('Window too small, likely a timer overlay. Not saving size.');
      }
      
      // Update timestamp
      lastResizeTimeStamp = now;
    } else {
      // For clarity in the logs
      if (getProgrammaticResize()) {
        console.log('Ignoring programmatic resize event');
      } else if (window.isMaximized()) {
        console.log('Ignoring resize event for maximized window');
      } else {
        console.log('Ignoring throttled resize event');
      }
    }
  });

  ipcMain.on(customCommandChannelName, async (_metadata, message: string) => {
    console.log(`${customCommandChannelName} received a message: `, message);
    switch (message) {
      case 'move-to-bottom-right':
        moveWindowToBottomRight({ window });
        break;
      case 'toggle-maximize':
        toggleMaximize({ window });
        break;
      case 'move-window-to-opposite-corner':
        moveWindowToOppositeCorner({ window });
        break;
      case 'focus':
        focus();
        break;
      case 'save-window-size':
        saveWindowSize({ window });
        break;
      case 'restore-window-size':
        restoreWindowSize({ window });
        break;
      case 'restore-window-size-and-reposition':
        restoreWindowSizeAndReposition({ window });
        break;
      default:
        console.warn('UH OH no command found for: ', message);
        break;
    }
  });
}

function saveWindowSize({ window }: { window: BrowserWindow }) {
  // Don't save if window is maximized - we're only interested in custom sizes
  if (!window.isMaximized()) {
    const [width, height] = window.getSize();
    const [x, y] = window.getPosition();
    
    // Also don't save super small sizes that are likely the timer overlay
    // Timer overlay is 240x240, so we'll use 300 as a threshold
    const isLikelyTimerOverlay = width <= 300 && height <= 300;
    
    if (!isLikelyTimerOverlay) {
      savedWindowState = { width, height, x, y };
      console.log('Explicitly saved window state:', savedWindowState);
    } else {
      console.log('Not saving timer overlay size');
    }
  } else {
    console.log('Not saving maximized window size');
  }
}

function restoreWindowSize({ window }: { window: BrowserWindow }) {
  if (savedWindowState) {
    console.log('Restoring window state to:', savedWindowState);
    
    // Set flag to ignore resize events during this operation
    setProgrammaticResize(true);
    
    // First unmaximize if it's maximized
    const wasMaximized = window.isMaximized();
    if (wasMaximized) {
      window.unmaximize();
      console.log('Window was maximized, unmaximizing first');
    }
    
    // Restore in steps with appropriate delays to ensure correct sequencing
    setTimeout(() => {
      if (savedWindowState) { // Double-check savedWindowState is still defined
        // First restore width and height
        window.setSize(savedWindowState.width, savedWindowState.height);
        
        // Then restore position
        window.setPosition(savedWindowState.x, savedWindowState.y);
        
        // Log success
        console.log('Successfully restored window state to:', savedWindowState);
        
        // Move to a visible position if needed
        setTimeout(() => {
          const display = screen.getDisplayMatching(window.getBounds());
          const bounds = window.getBounds();
          
          // Check if window is off-screen
          const isOffScreenX = bounds.x < 0 || bounds.x > display.bounds.width;
          const isOffScreenY = bounds.y < 0 || bounds.y > display.bounds.height;
          
          if (isOffScreenX || isOffScreenY) {
            // Center the window if it's off-screen
            window.center();
            console.log('Window was off-screen, centering it');
          }
          
          // Reset flag after all operations complete
          setProgrammaticResize(false);
        }, 100);
      } else {
        setProgrammaticResize(false);
      }
    }, 100);
  } else {
    console.log('No saved window state to restore');
  }
}

function restoreWindowSizeAndReposition({ window }: { window: BrowserWindow }) {
  // This function is specifically for the timer overlay, so we should always
  // position at the bottom right corner regardless of previous position
  
  if (savedWindowState) {
    console.log('Restoring window size and repositioning to bottom right:', savedWindowState.width, 'x', savedWindowState.height);
    
    // Set flag to ignore resize events during this operation
    setProgrammaticResize(true);
    
    // First unmaximize if it's maximized
    const wasMaximized = window.isMaximized();
    if (wasMaximized) {
      window.unmaximize();
      console.log('Window was maximized, unmaximizing first');
    }
    
    // Then set the size with a longer delay to ensure unmaximize completed
    setTimeout(() => {
      if (savedWindowState) { // Double-check savedWindowState is still defined
        // Set the size first
        window.setSize(savedWindowState.width, savedWindowState.height);
        console.log('Restored window size to:', savedWindowState.width, 'x', savedWindowState.height);
        
        // Give a longer delay to ensure the window size is properly set before repositioning
        setTimeout(() => {
          const display = screen.getDisplayMatching(window.getBounds());
          const x = display.workArea.x + display.workAreaSize.width - window.getSize()[0];
          const y = display.workArea.y + display.workAreaSize.height - window.getSize()[1];
          
          // Always position at bottom right for this specific function,
          // ignoring the saved position
          window.setPosition(x, y);
          console.log('Repositioned window to bottom right at:', x, y);
          
          // Reset flag after all operations complete
          setProgrammaticResize(false);
        }, 100);
      } else {
        setProgrammaticResize(false);
      }
    }, 150);
  } else {
    // If no saved size, still position at bottom right with default size
    console.log('No saved window state, using default size and position');
    moveWindowToBottomRight({ window });
  }
}

function moveWindowToBottomRight({ window }: { window: BrowserWindow }) {
  // Set flag to ignore resize events during this operation
  setProgrammaticResize(true);
  
  const display = screen.getDisplayMatching(window.getBounds());
  const x =
    display.workArea.x + display.workAreaSize.width - window.getSize()[0];
  const y =
    display.workArea.y + display.workAreaSize.height - window.getSize()[1];
  window.setPosition(x, y);
  
  // Reset flag after a delay to ensure operation completes
  setTimeout(() => {
    setProgrammaticResize(false);
  }, 50);
}

function moveWindowToBottomLeft({ window }: { window: BrowserWindow }) {
  // Set flag to ignore resize events during this operation
  setProgrammaticResize(true);
  
  const display = screen.getDisplayMatching(window.getBounds());
  const x = display.workArea.x;
  const y =
    display.workArea.y + display.workAreaSize.height - window.getSize()[1];
  window.setPosition(x, y);
  
  // Reset flag after a delay to ensure operation completes
  setTimeout(() => {
    setProgrammaticResize(false);
  }, 50);
}

function moveWindowToOppositeCorner({ window }: { window: BrowserWindow }) {
  // The child functions will set and clear the flag
  const display = screen.getDisplayMatching(window.getBounds());
  const displayCenterLine = display.workArea.x + display.workArea.width / 2;
  const [currentWindowX] = window.getPosition();
  if (currentWindowX < displayCenterLine) {
    moveWindowToBottomRight({ window });
  } else {
    moveWindowToBottomLeft({ window });
  }
}

function toggleMaximize({ window }: { window: BrowserWindow }) {
  // Set flag to ignore resize events during this operation
  setProgrammaticResize(true);
  
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
  
  // Reset flag after a delay to ensure operation completes
  setTimeout(() => {
    setProgrammaticResize(false);
  }, 100);
}

function focus() {
  app.focus({ steal: true });
}
