import { BrowserWindow, screen, ipcMain } from 'electron';
import { customCommandChannelName } from './constants';
import { app } from 'electron';

export function createCustomCommandReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(customCommandChannelName, async (_metadata, message: string) => {
    console.log(`${customCommandChannelName} received a message: `, message);
    switch (message) {
      case 'move-to-bottom-right':
        moveWindowToBottomRight({ window });
        break;
      case 'move-to-bottom-left':
        moveWindowToBottomLeft({ window });
        break;
      case 'move-to-top-right':
        moveWindowToTopRight({ window });
        break;
      case 'move-to-top-left':
        moveWindowToTopLeft({ window });
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
      default:
        console.warn('UH OH no command found for: ', message);
        break;
    }
  });
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

function moveWindowToTopRight({ window }: { window: BrowserWindow }) {
  const display = screen.getDisplayMatching(window.getBounds());
  const x =
    display.workArea.x + display.workAreaSize.width - window.getSize()[0];
  const y = display.workArea.y;
  window.setPosition(x, y);
}

function moveWindowToTopLeft({ window }: { window: BrowserWindow }) {
  const display = screen.getDisplayMatching(window.getBounds());
  const x = display.workArea.x;
  const y = display.workArea.y;
  window.setPosition(x, y);
}

function moveWindowToOppositeCorner({ window }: { window: BrowserWindow }) {
  const display = screen.getDisplayMatching(window.getBounds());
  const displayCenterX = display.workArea.x + display.workArea.width / 2;
  const displayCenterY = display.workArea.y + display.workArea.height / 2;
  const [currentWindowX, currentWindowY] = window.getPosition();

  const isLeft = currentWindowX < displayCenterX;
  const isTop = currentWindowY < displayCenterY;

  if (isTop) {
    if (isLeft) {
      moveWindowToTopRight({ window });
    } else {
      moveWindowToTopLeft({ window });
    }
  } else {
    // Bottom
    if (isLeft) {
      moveWindowToBottomRight({ window });
    } else {
      moveWindowToBottomLeft({ window });
    }
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
