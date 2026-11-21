PLAYLISTIFY - one-time setup, then updates are automatic

You do NOT need Node.js, build.bat, release.bat, a version number, or a GitHub token.
GitHub builds the installer for you in the cloud.

ONE-TIME SETUP (about 5 minutes)
  1. On GitHub use a PUBLIC repository (your existing Playlistify desktop one, or make a new
     one named  playlistify). It must be public so the app can find its updates.
  2. Upload every file from this folder, including the ".github" folder, and commit.
     If ".github" does not upload: Add file > Create new file, type the name
     .github/workflows/release.yml  and paste in the contents of release.yml from this folder.
  3. Open the Actions tab. "Build Playlistify Installer" starts by itself and takes about
     5 to 10 minutes. Wait for the green tick.
  4. On the repository's main page, click "Releases" on the right, open the newest one and
     download  Playlistify-Installer.exe . Run it. Done: it installs and opens the app.
     (This replaces any older copy of Playlistify you installed. Your songs are kept.)

     Handy permanent link (replace YOURNAME and REPO):
     https://github.com/KAJDFLSDFSLGPDIUOD/Playlistify/releases/latest/download/Playlistify-Installer.exe

UPDATING LATER
  Upload the changed file (for example a new index.html) to the repository.
  GitHub builds a new version automatically. Installed copies update themselves:
  open Playlistify, then close and reopen it once after a few minutes.

WINDOWS WARNING
  The installer is unsigned, so SmartScreen may say "unknown publisher".
  Choose "More info" then "Run anyway".

DISCORD
  The Discord Application ID is already built in. Keep the Discord desktop app open.
