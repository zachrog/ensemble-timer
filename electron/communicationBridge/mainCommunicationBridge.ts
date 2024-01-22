import { BrowserWindow, ipcMain } from "electron";
import { CommsAction, mainCommChannelName } from "./constants";

export function createCommunicationBridge(win: BrowserWindow) {
  ipcMain.on(mainCommChannelName, (metadata, message: CommsAction) => {
    console.log(`Setting opacity to ${message.payload}`);
    win.setOpacity(message.payload);
  });
}