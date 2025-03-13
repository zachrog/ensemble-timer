import { BrowserWindow, ipcMain } from 'electron';
import { mainCommChannelName } from './constants';

// Import the customCommandReceiver
import { setProgrammaticResizeState } from './customCommandReceiver';

export function createWindowBrowserReceiver({
  window,
}: {
  window: BrowserWindow;
}) {
  ipcMain.on(
    mainCommChannelName,
    async (_metadata, message: { functionName: string; arguments: any[] }) => {
      console.log(`${mainCommChannelName} received message: `, message);
      
      // Handle window resize operations specially
      const resizeFunctions = ['setSize', 'setContentSize', 'maximize', 'unmaximize', 'restore'];
      
      if (resizeFunctions.includes(message.functionName)) {
        console.log(`Performing programmatic resize: ${message.functionName}`, message.arguments);
        
        // If the external function exists, use it
        // If not, we'll just proceed with the resize
        try {
          if (typeof setProgrammaticResizeState === 'function') {
            // Set the flag for programmatic resize
            setProgrammaticResizeState(true);
          }
        } catch (e) {
          console.error('Failed to access resize state:', e);
        }
        
        // Execute the resize operation
        await (window as any)[message.functionName](...message.arguments);
        
        // Reset the flag after a delay
        setTimeout(() => {
          try {
            if (typeof setProgrammaticResizeState === 'function') {
              // Reset the flag
              setProgrammaticResizeState(false);
            }
          } catch (e) {
            console.error('Failed to reset resize state:', e);
          }
        }, 100);
      } else {
        // For non-resize functions, just execute them directly
        await (window as any)[message.functionName](...message.arguments);
      }
    },
  );
}
