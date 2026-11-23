const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('presence', {
  update: d => ipcRenderer.send('presence', d),
  onStatus: cb => ipcRenderer.on('presence-status', (e, t) => cb(t))
});
contextBridge.exposeInMainWorld('vrc', {
  say: t => ipcRenderer.send('vrc-say', t),
  search: q => ipcRenderer.invoke('lyrics-search', q)
});
