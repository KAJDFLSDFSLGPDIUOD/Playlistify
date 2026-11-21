// Minimal Discord Rich Presence client (talks to the Discord desktop app over its local pipe).
const net = require('net');
const crypto = require('crypto');

function pipePath(i) {
  if (process.platform === 'win32') return '\\\\?\\pipe\\discord-ipc-' + i;
  const base = process.env.XDG_RUNTIME_DIR || process.env.TMPDIR || '/tmp';
  return base + '/discord-ipc-' + i;
}

class Discord {
  constructor(clientId, onStatus) {
    this.id = clientId;
    this.onStatus = onStatus || (() => {});
    this.sock = null;
    this.ready = false;
    this.buf = Buffer.alloc(0);
    this.last = undefined;   // newest activity requested (null = clear)
    this.inflight = null;    // the SET_ACTIVITY we are waiting on
    this.noType = false;     // fall back if Discord rejects the "Listening" type
    this.noTimes = false;    // fall back if Discord rejects the progress bar times
    this.timer = null;
    this.stopped = false;
  }
  start() { this.onStatus('Looking for the Discord app. Open the Discord desktop app.'); this.tryPipe(0); }
  stop() {
    this.stopped = true;
    clearTimeout(this.timer);
    try { if (this.ready) this.set(null); this.sock && this.sock.end(); } catch (e) {}
  }
  tryPipe(i) {
    if (this.stopped) return;
    if (i > 9) { this.onStatus('Cannot find Discord. Open the Discord desktop app (not the browser). Retrying…'); return this.retry(); }
    const s = net.connect(pipePath(i));
    let opened = false;
    s.once('connect', () => {
      opened = true; this.sock = s; this.buf = Buffer.alloc(0);
      this.send(0, { v: 1, client_id: this.id });
    });
    s.on('data', d => this.onData(d));
    s.on('error', () => { if (!opened) this.tryPipe(i + 1); });
    s.on('close', () => {
      if (opened) { this.sock = null; this.ready = false; this.retry(); }
    });
  }
  retry() {
    if (this.stopped) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tryPipe(0), 15000);
  }
  send(op, obj) {
    const j = Buffer.from(JSON.stringify(obj));
    const h = Buffer.alloc(8);
    h.writeInt32LE(op, 0); h.writeInt32LE(j.length, 4);
    this.sock.write(Buffer.concat([h, j]));
  }
  onData(d) {
    this.buf = Buffer.concat([this.buf, d]);
    while (this.buf.length >= 8) {
      const op = this.buf.readInt32LE(0), len = this.buf.readInt32LE(4);
      if (this.buf.length < 8 + len) break;
      let msg = null;
      try { msg = JSON.parse(this.buf.slice(8, 8 + len).toString()); } catch (e) {}
      this.buf = this.buf.slice(8 + len);
      if (op === 3) this.send(4, msg || {});                       // ping -> pong
      else if (op === 2) {                                         // Discord closed us (for example a wrong Application ID)
        this.onStatus('Discord refused the connection: ' + ((msg && msg.message) || 'check your Application ID in main.js') + '.');
      } else if (op === 1 && msg) this.onFrame(msg);
    }
  }
  onFrame(msg) {
    if (msg.evt === 'READY') {
      this.ready = true;
      this.onStatus('Connected to Discord.');
      if (this.last !== undefined) this.push(this.last);
    } else if (msg.cmd === 'SET_ACTIVITY' && this.inflight && msg.nonce === this.inflight.nonce) {
      if (msg.evt === 'ERROR') {
        const text = (msg.data && msg.data.message) || 'unknown error';
        // Try again with fewer fields: first without the "Listening" type, then without times
        if (!this.noType) { this.noType = true; return this.push(this.inflight.d); }
        if (!this.noTimes) { this.noTimes = true; return this.push(this.inflight.d); }
        this.onStatus('Discord rejected the status: ' + text);
      } else if (this.inflight.d) {
        this.onStatus(this.noType ? 'Showing on Discord (as "Playing Playlistify").' : 'Showing on Discord.');
      } else {
        this.onStatus('Connected to Discord. Status cleared.');
      }
    }
  }
  build(d) {
    const args = { pid: process.pid };
    if (d) {
      const a = { details: d.details, state: d.state, assets: { large_image: 'logo', large_text: 'Playlistify' } };
      if (!this.noType) a.type = 2; // "Listening to"
      if (d.start && d.end && !this.noTimes) a.timestamps = { start: d.start, end: d.end };
      args.activity = a;
    }
    return args;
  }
  push(d) {
    const nonce = crypto.randomUUID();
    this.inflight = { nonce, d };
    try { this.send(1, { cmd: 'SET_ACTIVITY', args: this.build(d), nonce }); } catch (e) {}
  }
  // d = null to clear, or { details, state, start?, end? }
  set(d) {
    this.last = d;
    if (!this.ready || !this.sock) return;
    this.push(d);
  }
}
module.exports = { Discord };
