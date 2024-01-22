import type { BrowserWindow } from 'electron';
import { mainCommChannelName } from '../../electron/communicationBridge/constants';

export const RendererWindowBrowser: BrowserWindow = new Proxy(
  {},
  {
    get: (target, prop, receiver) => {
      console.log(`get.prop`, prop, typeof prop);
      console.log('get.target', target);
      return function sendMessageFunction(...args: any[]) {
        window.ipcRenderer.send(mainCommChannelName, {
          functionName: prop,
          arguments: args,
        });
      };
    },
    set: (target, prop, value, receiver) => {
      return Reflect.set(target, prop, value, receiver);
    },
  },
) as unknown as BrowserWindow;

// //Usage
// fakeWindowBrowser.blur()
// //creation
// window.ipcRenderer.send(mainCommChannelName, {functionName: 'blur', arguments: []});

// // Usage
// window.setPosition(10,30)
// // creation
// window.ipcRenderer.send(mainCommChannelName, {functionName: 'setPosition', arguments: [10,30]});
