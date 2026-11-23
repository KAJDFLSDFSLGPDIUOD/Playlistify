// VRChat chatbox over OSC, plus lyrics lookup (LRCLIB, a free lyrics database, no account needed).
const dgram = require('dgram');

const HOST = '127.0.0.1';
const PORT = 9000;       // VRChat listens for OSC messages here by default
const MIN_GAP = 1500;    // VRChat ignores chatbox messages that arrive faster than this
const MAX_CHARS = 140;   // the chatbox limit is 144
const UA = 'Playlistify (https://github.com/KAJDFLSDFSLGPDIUOD/Playlistify)';

const pad4 = b => Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4)]);
const oscStr = s => pad4(Buffer.from(s + '\0', 'utf8'));
// /chatbox/input ,sTF "<text>"  =  show the text right away (T), without the notification sound (F)
const chatboxPacket = text => Buffer.concat([oscStr('/chatbox/input'), oscStr(',sTF'), oscStr(text)]);

class VRChat {
  constructor(port = PORT, gap = MIN_GAP) {
    this.port = port; this.gap = gap;
    this.sock = dgram.createSocket('udp4');
    this.sock.on('error', () => {});
    this.last = 0; this.timer = null; this.pending = null; this.sent = '';
  }
  raw(text) {
    const t = Array.from(String(text || '')).slice(0, MAX_CHARS).join('');
    this.sock.send(chatboxPacket(t), this.port, HOST, () => {});
  }
  // Latest line wins: if lines arrive faster than VRChat accepts, the in-between ones are skipped.
  say(text) {
    text = String(text || '');
    if (text === this.sent && this.pending === null) return;
    this.pending = text;
    const wait = this.last + this.gap - Date.now();
    if (wait <= 0) this.flush();
    else if (!this.timer) this.timer = setTimeout(() => this.flush(), wait);
  }
  flush() {
    clearTimeout(this.timer); this.timer = null;
    if (this.pending === null) return;
    const t = this.pending; this.pending = null;
    this.sent = t; this.last = Date.now();
    this.raw(t);
  }
  clear() { // empty the chatbox right now (used when quitting)
    clearTimeout(this.timer); this.timer = null; this.pending = null;
    if (this.sent !== '') { this.sent = ''; this.raw(''); }
  }
  close() { try { this.sock.close(); } catch (e) {} }
}

async function searchLyrics(q, base = 'https://lrclib.net') {
  const r = await fetch(base + '/api/search?q=' + encodeURIComponent(q), { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const list = await r.json();
  return (Array.isArray(list) ? list : []).slice(0, 20).map(x => ({
    id: x.id, title: x.trackName || x.name || '', artist: x.artistName || '', duration: x.duration || 0, synced: x.syncedLyrics || ''
  }));
}

module.exports = { VRChat, searchLyrics, chatboxPacket };
