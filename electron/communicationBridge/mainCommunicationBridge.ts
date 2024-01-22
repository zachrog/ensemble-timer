import { BrowserWindow, ipcMain } from 'electron';
import { mainCommChannelName } from './constants';

export function createCommunicationBridge({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(
    mainCommChannelName,
    async (metadata, message: { functionName: string; arguments: any[] }) => {
      console.log('Main Channel received message: ', message);
      await (window as any)[message.functionName](...message.arguments);
    },
  );
}
