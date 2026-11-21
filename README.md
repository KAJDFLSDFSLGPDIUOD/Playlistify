# Playlistify

![Playlistify](icon.png)

**A desktop music player for your local music library.**

Playlistify lets you play music from files on your device, organize songs into playlists, adjust playback speed, and share what you're listening to through Discord Rich Presence.

## Features

- **Local music playback** — add audio files from your computer. Your music files are stored locally and are not uploaded by Playlistify.
- **Multiple playlists** — create, rename, and delete playlists, and add songs to more than one playlist.
- **Playback controls** — play, pause, skip, seek, adjust volume, and mute.
- **Playback speed** — change speed from **0.25× to 2×**, with quick presets.
- **Pitch preservation** — keep the original pitch while changing playback speed, or turn it off to change pitch along with speed.
- **WAV export** — export the current song with the selected speed and pitch settings.
- **Shuffle and repeat** — shuffle the playlist, repeat the playlist, or repeat one song.
- **Remembered settings** — playlist data, volume, and per-song playback speed are saved locally.
- **Discord Rich Presence** — optionally show the current song and playback speed in your Discord activity.
- **Automatic updates** — installed builds can check for updates published through GitHub Releases.

## Getting started

### Requirements

- Windows
- [Node.js](https://nodejs.org/) (Node.js 20 or newer recommended)
- npm (included with Node.js)
- [Discord desktop app](https://discord.com/download) if you want to use Discord Rich Presence

### Run from source

1. Download or clone this repository.
2. Open a terminal in the project folder.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start Playlistify:

   ```bash
   npm start
   ```

## Building the Windows installer

To build the Windows installer locally:

```bash
npm install
npx electron-builder --win nsis
```

The installer is generated in the `dist` directory. The configured installer filename is `Playlistify-Installer.exe`.

## Using Playlistify

1. Launch Playlistify.
2. Select **+ Add songs** and choose audio files from your computer.
3. Select a song in the playlist to start playback.
4. Use the playback controls to pause, skip, seek, change volume, shuffle, or repeat.
5. Adjust the speed slider or choose one of the preset speeds.
6. Use **Keep original pitch** to decide whether pitch should stay the same when playback speed changes.
7. Create additional playlists with **New playlist**. Use the playlist selector to switch between them.
8. To export a processed copy of the current song, select **Export current song at this speed**.

### Discord Rich Presence

Playlistify can display the current song and playback speed as your Discord activity.

- Discord Rich Presence is available in the **desktop application**, not when opening the player in a regular browser.
- Keep the Discord desktop app running.
- Use the **Show on Discord** setting in Playlistify to enable or disable activity sharing.
- If Discord does not connect, check that the desktop app is open and that the Discord application ID configured in `main.js` is valid.

## Data and privacy

Playlistify stores imported audio files and playlist information in the browser storage provided by Electron (IndexedDB) on your device. The application does not upload your music files.

Discord Rich Presence sends the activity details needed to show your listening status to Discord when that option is enabled. The app also loads its Bricolage Grotesque font from Google Fonts when an internet connection is available.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Player interface, playback logic, playlist management, and WAV export |
| `main.js` | Electron main process, application window, Discord integration, and update checks |
| `preload.js` | Secure bridge between the renderer and Electron's Discord presence integration |
| `discord.js` | Discord Rich Presence connection over the local Discord IPC pipe |
| `package.json` | Dependencies, npm scripts, and Windows installer configuration |
| `prepare-release.js` | Prepares version and publishing settings for automated releases |
| `.github/workflows/installer.yml` | Builds and publishes the Windows installer through GitHub Actions |
| `icon.png` | Application icon |

## Updates and releases

The GitHub Actions workflow builds a Windows installer when changes are pushed to the `main` branch, and can also be run manually from the Actions tab. It publishes the installer as a GitHub Release.

Installed versions check for updates through `electron-updater`. Running the project with `npm start` does not perform the packaged-app update check.

## Technologies

- [Electron](https://www.electronjs.org/)
- [Node.js](https://nodejs.org/)
- [electron-updater](https://www.electron.build/auto-update)
- [electron-builder](https://www.electron.build/)
- IndexedDB and the Web Audio APIs
- Discord Rich Presence

## License

Playlistify is released under the [MIT License](https://opensource.org/license/mit/).
