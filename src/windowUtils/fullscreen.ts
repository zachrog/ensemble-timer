import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { sendMessage } from '@/communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';

export function transitionToFullscreen() {
  RendererWindowBrowser.setOpacity(1.0);
  RendererWindowBrowser.focus();
  sendMessage({ channel: customCommandChannelName, message: 'focus' });
  RendererWindowBrowser.maximize();
  RendererWindowBrowser.setAlwaysOnTop(true);
  setTimeout(() => {
    RendererWindowBrowser.setAlwaysOnTop(false); // When the driver switches make sure no other window takes the spotlight for a brief period.
  }, 1500);
}

export function restoreNormalWindow() {
  RendererWindowBrowser.setOpacity(1.0);
  RendererWindowBrowser.focus();
  sendMessage({ channel: customCommandChannelName, message: 'focus' });
  sendMessage({ channel: customCommandChannelName, message: 'restore-normal-window' });
  RendererWindowBrowser.setAlwaysOnTop(true);
  setTimeout(() => {
    RendererWindowBrowser.setAlwaysOnTop(false); // When the driver switches make sure no other window takes the spotlight for a brief period.
  }, 1500);
}
