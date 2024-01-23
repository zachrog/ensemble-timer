export function sendMessage({
  channel,
  message,
}: {
  channel: string;
  message: any;
}) {
  window.ipcRenderer.send(channel, message);
}
