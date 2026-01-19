import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { createWindowBrowserReceiver } from './communicationBridge/mainCommunicationBridge';
import { createCustomCommandReceiver } from './communicationBridge/customCommandReceiver';
import {
  customCommandChannelName,
  mainCommChannelName,
} from './communicationBridge/constants';
import { setupWindowStateTracking } from './windowStateManager';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    frame: false, // controls whether the window has minimize, maximaize, close. Do not want this when showing semi-transparent timer
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }
  createWindowBrowserReceiver({ window: win });
  createCustomCommandReceiver({ window: win });
  setupWindowStateTracking(win);
  
  // win.webContents.openDevTools(); // opens chrome dev tools
}

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  // if (process.platform !== 'darwin') {
  //   app.quit();
  //   win = null;
  // }
  ipcMain.removeAllListeners(mainCommChannelName);
  ipcMain.removeAllListeners(customCommandChannelName);
  win = null;
  app.quit();
});

app.on('browser-window-focus', () => {
  win?.webContents.send('main-process-message', 'browser-gained-focus');
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', () => {
  ipcMain.removeAllListeners(mainCommChannelName);
  ipcMain.removeAllListeners(customCommandChannelName);
  app.quit();
});

app.whenReady().then(() => {
  createWindow();
});
