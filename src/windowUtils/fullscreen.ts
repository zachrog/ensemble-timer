import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { sendMessage } from '@/communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';

export function saveCurrentWindowSize() {
  sendMessage({ channel: customCommandChannelName, message: 'save-window-size' });
}

export function restoreLastWindowSize() {
  sendMessage({ channel: customCommandChannelName, message: 'restore-window-size' });
}

export function transitionToFullscreen() {
  // Save the current window size before maximizing
  sendMessage({ channel: customCommandChannelName, message: 'save-window-size' });
  
  RendererWindowBrowser.setOpacity(1.0);
  RendererWindowBrowser.focus();
  sendMessage({ channel: customCommandChannelName, message: 'focus' });
  RendererWindowBrowser.maximize();
  RendererWindowBrowser.setAlwaysOnTop(true);
  setTimeout(() => {
    RendererWindowBrowser.setAlwaysOnTop(false); // When the driver switches make sure no other window takes the spotlight for a brief period.
  }, 1500);
}
