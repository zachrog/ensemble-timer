import { CommsAction, mainCommChannelName } from "../../electron/communicationBridge/constants";

export function sendMessage(action: CommsAction) {
  window.ipcRenderer.send(mainCommChannelName, action);
}
