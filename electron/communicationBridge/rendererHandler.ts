import { BrowserWindow } from 'electron';
import { CommsAction } from './constants';

export async function rendererHandler({
  message,
  window,
}: {
  message: CommsAction;
  window: BrowserWindow;
}) {
  switch (message.action) {
    case 'setOpacity':
      console.log(`Setting opacity to ${message.payload}`);
      window.setOpacity(message.payload);
      break;
    case 'moveWindow':
      
      break;

    default:
      console.log(
        `Unhandled Message. No function found for action: ${message.action}`,
      );
      break;
  }
}
