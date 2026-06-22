#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..', '..');

function parseArgs(argv) {
  const args = {
    host: '127.0.0.1',
    port: Number(process.env.OB64_AGENT_BRIDGE_PORT || 17776),
    stateDir: path.join(ROOT, 'build', 'agent-bridge'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--host') {
      args.host = argv[++i];
    } else if (arg === '--port') {
      args.port = Number(argv[++i]);
    } else if (arg === '--state-dir') {
      args.stateDir = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isInteger(args.port) || args.port <= 0 || args.port > 65535) {
    throw new Error(`Invalid --port: ${args.port}`);
  }
  return args;
}

function usage() {
  console.log(`Usage: node tools/agent_bridge/agent_bridge_server.js [--host 127.0.0.1] [--port 17776] [--state-dir build/agent-bridge]

Local-only bridge for Codex agent handoffs. Agents POST completion events; a
separate heartbeat monitor reads /events and sends follow-up prompts.`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function appendJsonl(file, value) {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, `${JSON.stringify(value)}\n`);
}

function nowIso() {
  return new Date().toISOString();
}

function eventId(type) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const rand = Math.random().toString(16).slice(2, 8);
  return `${stamp}-${type}-${rand}`;
}

function loadEvents(stateFile) {
  const state = readJson(stateFile, { events: [] });
  if (!Array.isArray(state.events)) state.events = [];
  return state;
}

function saveEvents(stateFile, state) {
  writeJson(stateFile, state);
}

function sendJson(res, status, body) {
  const text = `${JSON.stringify(body, null, 2)}\n`;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(text),
    'cache-control': 'no-store',
  });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error(`Invalid JSON body: ${err.message}`));
      }
    });
    req.on('error', reject);
  });
}

function createEvent(type, payload) {
  return {
    id: eventId(type),
    type,
    status: 'new',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    payload: payload || {},
    notes: [],
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDir(args.stateDir);
  const stateFile = path.join(args.stateDir, 'events.json');
  const logFile = path.join(args.stateDir, 'events.jsonl');

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${args.host}:${args.port}`);

      if (req.method === 'GET' && url.pathname === '/health') {
        const state = loadEvents(stateFile);
        sendJson(res, 200, {
          ok: true,
          service: 'ob64-agent-bridge',
          time: nowIso(),
          stateDir: args.stateDir,
          events: state.events.length,
          newEvents: state.events.filter((event) => event.status === 'new').length,
        });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/events') {
        const state = loadEvents(stateFile);
        const status = url.searchParams.get('status');
        const events = status ? state.events.filter((event) => event.status === status) : state.events;
        sendJson(res, 200, { ok: true, events });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/agent/run-complete') {
        const payload = await readBody(req);
        const state = loadEvents(stateFile);
        const event = createEvent('run_complete', payload);
        state.events.push(event);
        saveEvents(stateFile, state);
        appendJsonl(logFile, event);
        console.log(`[${event.createdAt}] run_complete ${event.id}`);
        sendJson(res, 201, { ok: true, event });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/agent/review-complete') {
        const payload = await readBody(req);
        const state = loadEvents(stateFile);
        const event = createEvent('review_complete', payload);
        state.events.push(event);
        saveEvents(stateFile, state);
        appendJsonl(logFile, event);
        console.log(`[${event.createdAt}] review_complete ${event.id}`);
        sendJson(res, 201, { ok: true, event });
        return;
      }

      if (req.method === 'POST' && url.pathname === '/agent/error') {
        const payload = await readBody(req);
        const state = loadEvents(stateFile);
        const event = createEvent('agent_error', payload);
        state.events.push(event);
        saveEvents(stateFile, state);
        appendJsonl(logFile, event);
        console.log(`[${event.createdAt}] agent_error ${event.id}`);
        sendJson(res, 201, { ok: true, event });
        return;
      }

      const handled = url.pathname.match(/^\/events\/([^/]+)\/handled$/);
      if (req.method === 'POST' && handled) {
        const payload = await readBody(req);
        const state = loadEvents(stateFile);
        const event = state.events.find((candidate) => candidate.id === handled[1]);
        if (!event) {
          sendJson(res, 404, { ok: false, error: `event not found: ${handled[1]}` });
          return;
        }
        event.status = 'handled';
        event.updatedAt = nowIso();
        event.notes.push({ at: nowIso(), note: payload.note || 'handled' });
        saveEvents(stateFile, state);
        appendJsonl(logFile, { id: event.id, type: 'event_handled', at: nowIso(), note: payload.note || null });
        sendJson(res, 200, { ok: true, event });
        return;
      }

      sendJson(res, 404, { ok: false, error: 'not found' });
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
    }
  });

  server.listen(args.port, args.host, () => {
    console.log(`OB64 agent bridge listening at http://${args.host}:${args.port}`);
    console.log(`State: ${stateFile}`);
  });
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
