/// <reference types="vite/client" />

interface Window {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => void;
    on: (channel: string, listener: (...args: any[]) => void) => () => void;
    once: (channel: string, listener: (...args: any[]) => void) => void;
  };
}
