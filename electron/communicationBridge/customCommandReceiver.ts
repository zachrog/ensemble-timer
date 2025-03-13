import { BrowserWindow, screen, ipcMain } from 'electron';
import { customCommandChannelName } from './constants';
import { app } from 'electron';

// Store the window size before maximizing
let savedWindowSize: { width: number; height: number } | null = null;

export function createCustomCommandReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  // Listen for window resize events to track manual resizing by the user
  window.on('resize', () => {
    // Only save size if window is not maximized to avoid saving fullscreen dimensions
    if (!window.isMaximized()) {
      const [width, height] = window.getSize();
      savedWindowSize = { width, height };
      console.log('Window resized by user, saved size:', savedWindowSize);
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
      default:
        console.warn('UH OH no command found for: ', message);
        break;
    }
  });
}

function saveWindowSize({ window }: { window: BrowserWindow }) {
  if (!window.isMaximized()) {
    const [width, height] = window.getSize();
    savedWindowSize = { width, height };
    console.log('Saved window size:', savedWindowSize);
  }
}

function restoreWindowSize({ window }: { window: BrowserWindow }) {
  if (savedWindowSize) {
    window.unmaximize();
    window.setSize(savedWindowSize.width, savedWindowSize.height);
    console.log('Restored window size to:', savedWindowSize);
  }
}

function moveWindowToBottomRight({ window }: { window: BrowserWindow }) {
  const display = screen.getDisplayMatching(window.getBounds());
  const x =
    display.workArea.x + display.workAreaSize.width - window.getSize()[0];
  const y =
    display.workArea.y + display.workAreaSize.height - window.getSize()[1];
  window.setPosition(x, y);
}

function moveWindowToBottomLeft({ window }: { window: BrowserWindow }) {
  const display = screen.getDisplayMatching(window.getBounds());
  const x = display.workArea.x;
  const y =
    display.workArea.y + display.workAreaSize.height - window.getSize()[1];
  window.setPosition(x, y);
}

function moveWindowToOppositeCorner({ window }: { window: BrowserWindow }) {
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
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
}

function focus() {
  app.focus({ steal: true });
}
