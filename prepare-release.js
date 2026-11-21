// Runs in the cloud build only: gives every build a higher version number and
// points the auto-updater at THIS repository, so nothing has to be edited by hand.
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const { RUN, OWNER, REPO } = process.env;
if (!RUN || !OWNER || !REPO) { console.error('Missing RUN, OWNER or REPO'); process.exit(1); }
p.version = '1.2.' + RUN;
p.build.publish = [{ provider: 'github', owner: OWNER, repo: REPO, releaseType: 'release' }];
fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
console.log('Version ' + p.version + ', publishing to ' + OWNER + '/' + REPO);
