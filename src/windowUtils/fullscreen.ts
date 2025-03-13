import { RendererWindowBrowser } from '@/communicationBridge/fakeWindowBrowser';
import { sendMessage } from '@/communicationBridge/rendererCommunicationBridge';
import { customCommandChannelName } from '../../electron/communicationBridge/constants';

export function saveCurrentWindowSize() {
  sendMessage({ channel: customCommandChannelName, message: 'save-window-size' });
}

export function restoreLastWindowSize() {
  sendMessage({ channel: customCommandChannelName, message: 'restore-window-size' });
}

// Original function that always maximizes
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

// New function that tries to restore the previous size if coming from timer
export function transitionFromTimer() {
  console.log('Transitioning from timer, will try to restore previous size');
  
  // Make window opaque and focused
  RendererWindowBrowser.setOpacity(1.0);
  RendererWindowBrowser.focus();
  sendMessage({ channel: customCommandChannelName, message: 'focus' });
  
  // Try to restore previous size instead of maximizing
  sendMessage({ channel: customCommandChannelName, message: 'restore-window-size' });
  
  // Still ensure it's visible and active
  RendererWindowBrowser.setAlwaysOnTop(true);
  setTimeout(() => {
    RendererWindowBrowser.setAlwaysOnTop(false);
  }, 1500);
}
