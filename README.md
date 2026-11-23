![Playlistify](icon.png)

# Playlistify

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
- **Lyrics in VRChat** — find time-synced lyrics (from LRCLIB) or load a `.lrc` file, see the current line in the app, and optionally send it to your VRChat chatbox over OSC.
- **Automatic updates** — installed builds can check for updates published through GitHub Releases.

## Installation

Getting started with Playlistify is simple!

1. Visit the [Playlistify Releases](https://github.com/KAJDFLSDFSLGPDIUOD/Playlistify/releases) page.
2. Find the latest release.
3. Download **Playlistify-Installer.exe**.
4. Once downloaded, run the installer.
5. Wait for the installation to finish.
6. Playlistify should automatically launch once installation is complete!

That's it! You're ready to enjoy your music with Playlistify.

### Updating Playlistify

Updates install themselves. When you open Playlistify and a newer version exists, a small **Updating Playlistify** window shows the download progress, installs the update, and then opens the app by itself. If there is no update, or you are offline, Playlistify just opens.

You can still download the latest `Playlistify-Installer.exe` from the [Releases page](https://github.com/KAJDFLSDFSLGPDIUOD/Playlistify/releases) at any time.

## Using Playlistify

1. Launch Playlistify.
2. Select **+ Add songs** and choose audio files from your computer.
3. Select a song in the playlist to start playback.
4. Use the playback controls to pause, skip, seek, change volume, shuffle, or repeat.
5. Adjust the speed slider or choose one of the preset speeds.
6. Use **Keep original pitch** to decide whether pitch should stay the same when playback speed changes.
7. Create additional playlists with **New playlist**. Use the playlist selector to switch between them.
8. To export a processed copy of the current song, select **Export current song at this speed**.

### Lyrics and the VRChat chatbox

The **Lyrics** panel is in the desktop application only.

1. Play a song and click **Find lyrics**. The search box is filled in from the file name. Pick the matching result (only time-synced lyrics are listed), or choose **Load a .lrc file instead**.
2. The current and next line show in the panel. Lyrics are saved with the song.
3. In VRChat turn on OSC (Action Menu, Options, OSC, Enabled), then switch on **Send lyrics to VRChat** in Playlistify.
4. If the timing is slightly off, use **Lyrics earlier** and **Lyrics later**. For sped-up uploads such as `Song (1.20x)`, the file speed is read from the name and the lyric times are adjusted for it. You can change it in the **File speed** box.

VRChat limits the chatbox to 144 characters and ignores messages that come too fast, so fast songs may skip lines. Lyrics are looked up on lrclib.net, which receives the search text you type.

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
| `main.js` | Electron main process, application window, Discord integration, and the update screen |
| `splash.html` | The update screen shown while Playlistify updates itself |
| `vrchat.js` | VRChat chatbox messages over OSC, and the lyrics search |
| `preload.js` | Secure bridge between the renderer and Electron's Discord presence integration |
| `discord.js` | Discord Rich Presence connection over the local Discord IPC pipe |
| `package.json` | Dependencies, npm scripts, and Windows installer configuration |
| `prepare-release.js` | Prepares version and publishing settings for automated releases |
| `.github/workflows/installer.yml` | Builds and publishes the Windows installer through GitHub Actions |
| `icon.png` | Application icon |

## Updates and releases

The GitHub Actions workflow builds a Windows installer when changes are pushed to the `main` branch, and can also be run manually from the Actions tab. It gives every build a higher version number automatically and publishes the installer as a GitHub Release.

Each time the installed app starts, it checks for a newer release through `electron-updater`. If one exists, an update screen downloads and installs it, then opens the new version. The update check is skipped when running the project with `npm start`, and the app opens normally after 10 seconds if the check cannot finish.

## Technologies

- [Electron](https://www.electronjs.org/)
- [Node.js](https://nodejs.org/)
- [electron-updater](https://www.electron.build/auto-update)
- [electron-builder](https://www.electron.build/)
- IndexedDB and the Web Audio APIs
- Discord Rich Presence

## License

Playlistify is released under the [MIT License](https://opensource.org/license/mit/).