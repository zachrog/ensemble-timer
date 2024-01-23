import { BrowserWindow, screen, ipcMain } from 'electron';
import { customCommandChannelName } from './constants';

export function createCustomCommandReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(customCommandChannelName, async (metadata, message) => {
    moveWindowToBottomRight({ window });
  });
}

function moveWindowToBottomRight({ window }: { window: BrowserWindow }) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = width - window.getSize()[0];
  const y = height - window.getSize()[1];
  window.setPosition(x, y);
}
