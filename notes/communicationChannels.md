# Communication Channels
- When you have multiple windows open the


# State
- When you have multiple windows open, react or client state is not shared between the windows.
- When sending a message from the renderer to the main process using `window.ipcRenderer.send()` that message is listened to by all channels. So if a message is sent on channel `hello` then every listener will receive that message and it will act as if it came from every window, even though only one initiated it. 