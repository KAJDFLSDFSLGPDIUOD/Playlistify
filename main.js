const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { Discord } = require('./discord');

// Discord Application ID (public, safe to keep in the app).
const DISCORD_CLIENT_ID = '1573501566202151022';

let win = null;
let splash = null;
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

// Opens the real app (and starts the Discord connection)
function startApp() {
  createWindow();
  if (/^\d{17,20}$/.test(DISCORD_CLIENT_ID)) {
    discord = new Discord(DISCORD_CLIENT_ID, setStatus);
    discord.start();
    ipcMain.on('presence', (e, d) => discord && discord.set(d));
  } else {
    setStatus('Not set up yet. Add your Application ID to main.js.');
  }
}

// ---- Update screen: check, update, restart, THEN open the app ----
function showSplash() {
  splash = new BrowserWindow({
    width: 440, height: 250, frame: false, resizable: false, maximizable: false, minimizable: false,
    center: true, show: false, backgroundColor: '#050309', title: 'Playlistify',
    icon: path.join(__dirname, 'icon.png')
  });
  splash.loadFile('splash.html');
  splash.once('ready-to-show', () => splash && splash.show());
}
let splashMsg = null, splashLoaded = false;
function say(title, sub, pct) {
  splashMsg = [title, sub || '', pct == null ? null : pct];
  if (splash && !splash.isDestroyed() && splashLoaded) {
    splash.webContents.executeJavaScript('setStatus(' + splashMsg.map(v => JSON.stringify(v)).join(',') + ')').catch(() => {});
  }
}

function updateThenOpen() {
  let finished = false, updating = false, timer = null;
  const openApp = () => {
    if (finished) return;
    finished = true; clearTimeout(timer);
    const s = splash; splash = null;
    startApp();                                   // open the app first, so closing the splash never quits Electron
    if (s && !s.isDestroyed()) s.close();
  };

  showSplash();
  splash.webContents.on('did-finish-load', () => { splashLoaded = true; if (splashMsg) say.apply(null, splashMsg); });
  say('Checking for updates\u2026');

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('update-not-available', openApp);
  autoUpdater.on('update-available', info => {
    if (finished) return;                         // the check was too slow; the next launch will update
    updating = true; clearTimeout(timer);
    say('Updating Playlistify\u2026', 'Downloading version ' + info.version, 0);
    autoUpdater.downloadUpdate().catch(() => {});
  });
  autoUpdater.on('download-progress', p => {
    const mb = n => (n / 1048576).toFixed(1);
    say('Updating Playlistify\u2026', Math.round(p.percent) + '%  \u00b7  ' + mb(p.transferred) + ' of ' + mb(p.total) + ' MB', p.percent);
  });
  autoUpdater.on('update-downloaded', () => {
    say('Update finished', 'Restarting Playlistify\u2026', 100);
    setTimeout(() => autoUpdater.quitAndInstall(true, true), 1200); // silent install, then Playlistify opens by itself
  });
  autoUpdater.on('error', () => {
    if (!updating) return openApp();              // no internet, no release yet: just open the app
    say('Update failed', 'Opening Playlistify\u2026');
    setTimeout(openApp, 2000);
  });

  timer = setTimeout(openApp, 10000);             // slow or offline: do not keep you waiting
  autoUpdater.checkForUpdates().catch(openApp);
}

app.whenReady().then(() => {
  if (app.isPackaged) updateThenOpen();           // installed app: update first
  else startApp();                                // "npm start": no update check
});

app.on('before-quit', () => { if (discord) discord.stop(); });
app.on('window-all-closed', () => app.quit());
