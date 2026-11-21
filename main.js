const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { Discord } = require('./discord');

// Discord Application ID (public, safe to keep in the app).
const DISCORD_CLIENT_ID = '1573501566202151022';

let win = null;
let discord = null;
let lastStatus = '';

function setStatus(text) {
  lastStatus = text;
  if (win && !win.isDestroyed()) win.webContents.send('presence-status', text);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 920,
    center: true,
    minWidth: 380,
    backgroundColor: '#050309',
    title: 'Playlistify',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.js') }
  });
  Menu.setApplicationMenu(null);
  win.webContents.on('did-finish-load', () => win.webContents.send('presence-status', lastStatus));
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  if (/^\d{17,20}$/.test(DISCORD_CLIENT_ID)) {
    discord = new Discord(DISCORD_CLIENT_ID, setStatus);
    discord.start();
    ipcMain.on('presence', (e, d) => discord && discord.set(d));
  } else {
    setStatus('Not set up yet. Paste your Application ID into main.js, then rebuild (see README.txt).');
  }

  // Only check for updates in the installed app, never during "npm start"
  if (app.isPackaged) {
    autoUpdater.on('error', () => {}); // no internet or no release yet: stay quiet
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }
});

app.on('before-quit', () => { if (discord) discord.stop(); });
app.on('window-all-closed', () => app.quit());
