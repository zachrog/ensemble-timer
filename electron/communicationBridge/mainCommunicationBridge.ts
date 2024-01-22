import { BrowserWindow, ipcMain } from 'electron';
import { CommsAction, mainCommChannelName } from './constants';
import { rendererHandler } from './rendererHandler';

export function createCommunicationBridge({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(mainCommChannelName, async (metadata, message: CommsAction) => {
    await rendererHandler({ message, window });
  });
}
