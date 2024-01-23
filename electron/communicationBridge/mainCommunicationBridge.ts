import { BrowserWindow, ipcMain } from 'electron';
import { mainCommChannelName } from './constants';

export function createWindowBrowserReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(
    mainCommChannelName,
    async (metadata, message: { functionName: string; arguments: any[] }) => {
      console.log(`${mainCommChannelName} received message: ${message}`);
      await (window as any)[message.functionName](...message.arguments);
    },
  );
}
