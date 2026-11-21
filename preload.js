const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('presence', {
  update: d => ipcRenderer.send('presence', d),
  onStatus: cb => ipcRenderer.on('presence-status', (e, t) => cb(t))
});
