'use strict';

// Diagnostic scratch accounting only. No deletion, proof/cache changes or quota.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const GiB = 1024 ** 3;
const RUN = /^([A-Za-z_.$][A-Za-z0-9_.$]*)-(\d{13})-([a-f0-9]{6})$/i;
const RECORDS = Object.freeze(['authored.c', 'input.c', 'report.json', 'summary.json', 'census.json']);
const DEFAULTS = Object.freeze({ maxRuns: 32, maxBytes: 12 * GiB, maxRecordBytes: 4 * GiB,
  floorBytes: 8 * GiB, peakBytes: 2 * GiB });
const META = '.scratch-retention';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const portable = file => file.replace(/\\/g, '/');
const identity = bytes => ({ bytes: bytes.length, sha256: hash(bytes) });
function fail(message) { throw new Error(`scratch retention: ${message}`); }

function settings(env = process.env) {
  const result = { ...DEFAULTS };
  for (const [key, suffix] of Object.entries({ maxRuns: 'MAX_RUNS', maxBytes: 'MAX_BYTES',
    maxRecordBytes: 'MAX_RECORD_BYTES', floorBytes: 'FLOOR_BYTES', peakBytes: 'PEAK_BYTES' })) {
    const text = env[`OB64_SCRATCH_${suffix}`];
    if (text === undefined) continue;
    if (!/^[1-9][0-9]*$/.test(text) || !Number.isSafeInteger(Number(text))) fail(`invalid ${suffix}`);
    result[key] = Number(text);
  }
  return validateSettings(result);
}

function validateSettings(config) {
  for (const key of Object.keys(DEFAULTS)) if (!Number.isSafeInteger(config[key]) || config[key] <= 0) fail(`invalid setting: ${key}`);
  if (!Number.isSafeInteger(config.floorBytes + config.peakBytes)) fail('reserve arithmetic overflow');
  return config;
}

function contained(root, file) {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) fail('path escapes root');
  return path.resolve(file);
}

// Check every existing ancestor, not just the leaf. Never follow junctions or links.
function plain(file, kind = null) {
  file = path.resolve(file);
  const parsed = path.parse(file);
  let current = parsed.root;
  for (const part of file.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) fail(`linked/reparse path: ${current}`);
    if (current !== file && !stat.isDirectory()) fail(`non-directory ancestor: ${current}`);
  }
  const stat = fs.lstatSync(file);
  if (portable(fs.realpathSync.native(file)).toLowerCase() !== portable(file).toLowerCase()) fail(`aliased path: ${file}`);
  if (kind === 'file' && (!stat.isFile() || stat.nlink !== 1)) fail(`nonregular or hardlinked file: ${file}`);
  if (kind === 'directory' && !stat.isDirectory()) fail(`non-directory: ${file}`);
  return stat;
}

function sameStat(a, b) {
  return a.dev === b.dev && a.ino === b.ino && a.size === b.size && a.mtimeMs === b.mtimeMs && a.nlink === b.nlink;
}

function readPlain(file) {
  const before = plain(file, 'file');
  const bytes = fs.readFileSync(file);
  if (!sameStat(before, plain(file, 'file')) || bytes.length !== before.size) fail(`file changed while reading: ${file}`);
  return bytes;
}

function writeNew(directory, name, bytes) {
  plain(directory, 'directory');
  if (path.basename(name) !== name) fail('nonlocal record name');
  const file = path.join(directory, name);
  const descriptor = fs.openSync(file, 'wx');
  try { fs.writeFileSync(descriptor, bytes); fs.fsyncSync(descriptor); }
  finally { fs.closeSync(descriptor); }
  return identity(readPlain(file));
}
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');

function census(root) {
  plain(root, 'directory');
  const files = [], issues = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = contained(root, path.join(directory, entry.name));
      try {
        const stat = plain(file);
        if (stat.isDirectory()) walk(file);
        else if (stat.isFile() && stat.nlink === 1) files.push({ path: portable(path.relative(root, file)),
          bytes: stat.size, mtimeMs: stat.mtimeMs, dev: stat.dev, ino: stat.ino });
        else issues.push(`nonregular or hardlinked: ${file}`);
      } catch (error) { issues.push(error.message); }
    }
  }
  walk(root);
  return { files: files.sort((a, b) => a.path.localeCompare(b.path)), issues,
    bytes: files.reduce((sum, item) => sum + item.bytes, 0) };
}

function availableBytes(root) {
  plain(root, 'directory');
  const stat = fs.statfsSync(root, { bigint: true });
  const bytes = stat.bavail * stat.bsize;
  if (bytes < 0n || bytes > BigInt(Number.MAX_SAFE_INTEGER)) fail('unavailable free-space measurement');
  return Number(bytes);
}

// Append-only claims avoid a check-then-create reservation race. Publish a claim
// BEFORE checking space; any malformed concurrent claim fails admission closed.
// Release is a separate immutable record. Crash claims are never reclaimed by age/PID.
function reservations(root) {
  plain(root, 'directory');
  let reservedBytes = 0, activeFloorBytes = 0;
  const active = [];
  for (const name of fs.readdirSync(root)) {
    if (!RUN.test(name)) continue;
    const run = path.join(root, name);
    plain(run, 'directory');
    const meta = path.join(run, META);
    if (!fs.existsSync(meta)) continue; // Legacy runs are unknown, never cleanup candidates.
    plain(meta, 'directory');
    const claim = JSON.parse(readPlain(path.join(meta, 'claim.json')));
    if (claim.schemaVersion !== 2 || claim.run !== name || !Number.isSafeInteger(claim.peakBytes) || claim.peakBytes <= 0
      || !Number.isSafeInteger(claim.floorBytes) || claim.floorBytes <= 0
      || typeof claim.token !== 'string' || !/^[a-f0-9]{32}$/.test(claim.token)) fail(`invalid reservation: ${name}`);
    const releaseFile = path.join(meta, 'release.json');
    if (fs.existsSync(releaseFile)) {
      const release = JSON.parse(readPlain(releaseFile));
      if (release.schemaVersion !== 1 || release.token !== claim.token || !['complete', 'failed'].includes(release.status)) fail(`invalid release: ${name}`);
    } else {
      reservedBytes += claim.peakBytes;
      activeFloorBytes = Math.max(activeFloorBytes, claim.floorBytes);
      if (!Number.isSafeInteger(reservedBytes)) fail('reservation arithmetic overflow');
      active.push(name);
    }
  }
  return { active, reservedBytes, activeFloorBytes };
}

function checkSpace(root, config, phase, readSpace = availableBytes) {
  validateSettings(config);
  const claims = reservations(root);
  const freeBytes = readSpace(root);
  if (!Number.isSafeInteger(freeBytes) || freeBytes < 0) fail('invalid free-space result');
  // A lower-floor caller cannot spend another active participant's floor.
  const requiredBytes = Math.max(config.floorBytes, claims.activeFloorBytes) + claims.reservedBytes;
  if (!Number.isSafeInteger(requiredBytes)) fail('reserve arithmetic overflow');
  if (freeBytes < requiredBytes) fail(`free-space reserve at ${phase}: available ${freeBytes}, required ${requiredBytes}; ${claims.active.length} cooperative slot(s)`);
  return { phase, freeBytes, requiredBytes, ...claims };
}

function begin({ root, output, config = settings(), readSpace = availableBytes }) {
  validateSettings(config);
  root = path.resolve(root); output = contained(root, output);
  if (path.dirname(output) !== root || !RUN.test(path.basename(output))) fail('invalid direct diff run path');
  // Creating the small owned run/claim is the only work before admission.
  plain(path.dirname(root), 'directory');
  if (!fs.existsSync(root)) fs.mkdirSync(root);
  plain(root, 'directory');
  fs.mkdirSync(output); // Exclusive collision rejection; no replacement/reuse.
  const meta = path.join(output, META);
  fs.mkdirSync(meta);
  const token = crypto.randomBytes(16).toString('hex');
  writeNew(meta, 'claim.json', jsonBytes({ schemaVersion: 2, run: path.basename(output), token,
    floorBytes: config.floorBytes, peakBytes: config.peakBytes, pid: process.pid, startedAt: new Date().toISOString() }));
  let released = false;
  const handle = {
    root, output, meta, config,
    check(phase) {
      if (released) fail('reservation already released');
      const result = checkSpace(root, config, phase, readSpace);
      const symbol = RUN.exec(path.basename(output))[1].toLowerCase();
      if (result.active.filter(name => RUN.exec(name)[1].toLowerCase() === symbol).length !== 1) fail(`same-symbol active/crashed reservation: ${symbol}`);
      return result;
    },
    release(status) {
      if (released) return;
      if (!['complete', 'failed'].includes(status)) fail('invalid release status');
      writeNew(meta, 'release.json', jsonBytes({ schemaVersion: 1, token, status, finishedAt: new Date().toISOString() }));
      released = true;
    },
  };
  try { handle.check('admission'); } catch (error) {
    try { handle.release('failed'); } catch (releaseError) { error.scratchReleaseError = releaseError.message; }
    throw error;
  }
  return handle;
}

function authenticate(bytes, expected, label) {
  if (!expected || bytes.length !== expected.bytes || hash(bytes) !== expected.sha256) fail(`${label} identity mismatch`);
}

function captureSource(handle, repository, classification, inputBytes) {
  if (!classification || typeof classification.source !== 'string') fail('missing classification');
  const source = contained(repository, path.resolve(repository, classification.source));
  const authored = readPlain(source);
  authenticate(authored, { bytes: classification.sourceBytes, sha256: classification.sourceSha256 }, 'authored source');
  authenticate(inputBytes, classification.compilationInput, 'preprocessed input');
  const authoredIdentity = writeNew(handle.meta, 'authored.c', authored);
  const inputIdentity = writeNew(handle.meta, 'input.c', inputBytes);
  return { source: classification.source, sourcePolicyDigest: classification.digest,
    authored: authoredIdentity, input: inputIdentity };
}

function captureReport(handle, captured, report) {
  if (path.resolve(report.output) !== handle.output || report.source !== captured.source
    || report.sourcePolicyDigest !== captured.sourcePolicyDigest) fail('report/source binding mismatch');
  authenticate(readPlain(path.join(handle.meta, 'authored.c')), captured.authored, 'retained authored source');
  authenticate(readPlain(path.join(handle.meta, 'input.c')), captured.input, 'retained input');
  const actual = report.object && report.object.compilationInput;
  if (!actual || actual.path !== captured.source) fail('compiled input path mismatch');
  authenticate(readPlain(contained(handle.output, path.resolve(handle.output, actual.path))), actual, 'actual compiler input');
  if (actual.bytes !== captured.input.bytes || actual.sha256 !== captured.input.sha256
    || report.compilationInput?.bytes !== captured.input.bytes || report.compilationInput?.sha256 !== captured.input.sha256) fail('report input identity mismatch');
  const reportIdentity = writeNew(handle.meta, 'report.json', jsonBytes(report));
  const snapshot = census(handle.output);
  if (snapshot.issues.length) fail(`incomplete run census: ${snapshot.issues.join('; ')}`);
  const censusIdentity = writeNew(handle.meta, 'census.json', jsonBytes({ schemaVersion: 1,
    scope: 'files before census and summary capture; metadata sizes, not proof hashes', ...snapshot }));
  const summary = { schemaVersion: 1, status: 'complete', diagnosticOnly: true,
    run: path.basename(handle.output), source: captured, report: reportIdentity, census: censusIdentity,
    completedAt: new Date().toISOString(), exact: report.comparison?.exact,
    retainedFileAllowlist: RECORDS, deletionEnabled: false,
    storageImplementation: identity(readPlain(__filename)),
    bytesBeforeSummary: snapshot.bytes + censusIdentity.bytes,
    retainedBytesBeforeSummary: captured.authored.bytes + captured.input.bytes + reportIdentity.bytes + censusIdentity.bytes };
  writeNew(handle.meta, 'summary.json', jsonBytes(summary));
  return summary;
}

function publishLatest(directory, symbol, report) {
  if (!/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(symbol) || report.symbol !== symbol) fail('invalid latest symbol');
  plain(path.dirname(directory), 'directory');
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
  plain(directory, 'directory');
  const destination = path.join(directory, `${symbol}.json`);
  if (fs.existsSync(destination)) plain(destination, 'file');
  const temporary = `${symbol}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  writeNew(directory, temporary, jsonBytes(report));
  fs.renameSync(path.join(directory, temporary), destination);
  return destination;
}

function retainedBytes(run) {
  let bytes = 0;
  for (const name of RECORDS) {
    const file = path.join(run, META, name);
    if (fs.existsSync(file)) bytes += plain(file, 'file').size;
  }
  return bytes;
}

function limitWarnings(totals, config = settings()) {
  return [['runs', 'maxRuns'], ['bytes', 'maxBytes'], ['retainedBytes', 'maxRecordBytes']]
    .filter(([key, limit]) => totals[key] > config[limit])
    .map(([key, limit]) => `WARN ONLY: ${key} ${totals[key]} exceeds ${config[limit]}; deletion disabled, no hard quota`);
}

function escapeRegex(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function referenced(run, text, fullPath) {
  const value = text.replace(/\\+/g, '/').toLowerCase();
  const name = run.toLowerCase(), parts = RUN.exec(name);
  if (value.includes(portable(fullPath).toLowerCase()) || value.includes(name)) return true;
  if (parts) {
    const [, symbol, timestamp, suffix] = parts;
    if (new RegExp(`(?<![0-9])${timestamp}(?![0-9])`).test(value)) return true;
    // A six-hex suffix alone is ambiguous; require adjacency to this symbol.
    return new RegExp(`${escapeRegex(symbol)}[^a-z0-9]{1,32}${suffix}(?![a-f0-9])|(?<![a-f0-9])${suffix}[^a-z0-9]{1,32}${escapeRegex(symbol)}(?![a-z0-9])`).test(value);
  }
  // Workbench/probe identifiers only when the actual directory is a 64hex ID.
  // func_XXXXXXXX is never interpreted as an eight-hex run identifier.
  if (/^[a-f0-9]{64}$/.test(name)) return new RegExp(`(?<![a-z0-9_])(?:${name}|${name.slice(0, 8)})(?![a-z0-9_])`).test(value);
  return false;
}

function referenceInputs(inputs) {
  const issues = [], texts = [];
  for (const category of ['docs', 'memory', 'mail']) {
    const roots = inputs[category] || [];
    if (!roots.length) issues.push(`missing ${category} reference input`);
    for (const root of roots) {
      try {
        const stat = plain(root);
        const files = stat.isDirectory() ? census(root) : { files: [{ path: path.basename(root) }], issues: [] };
        issues.push(...files.issues.map(issue => `${category}: ${issue}`));
        for (const entry of files.files) {
          const file = stat.isDirectory() ? path.join(root, entry.path) : root;
          if (!/\.(md|txt|json|jsonl|toml)$/i.test(file)) continue;
          if (plain(file, 'file').size > 16 * 1024 * 1024) { issues.push(`oversize reference input: ${file}`); continue; }
          const bytes = readPlain(file), text = bytes.toString('utf8');
          if (!Buffer.from(text).equals(bytes)) { issues.push(`non-UTF8 reference input: ${file}`); continue; }
          texts.push({ file, text });
        }
      } catch (error) { issues.push(`${category}: ${error.message}`); }
    }
  }
  return { issues, texts };
}

function inventory(root, inputs = {}, config = settings()) {
  plain(root, 'directory');
  const references = referenceInputs(inputs), runs = [], issues = [...references.issues];
  for (const name of fs.readdirSync(root)) {
    const run = path.join(root, name), protection = [];
    try {
      plain(run, 'directory');
      const snapshot = census(run);
      if (snapshot.issues.length) protection.push('unsafe/incomplete file census');
      issues.push(...snapshot.issues);
      if (!RUN.test(name)) protection.push('unrecognized run name');
      const meta = path.join(run, META);
      let status = 'unknown';
      if (fs.existsSync(path.join(meta, 'claim.json'))) {
        const claim = JSON.parse(readPlain(path.join(meta, 'claim.json')));
        const releaseFile = path.join(meta, 'release.json');
        if (!fs.existsSync(releaseFile)) status = 'active-or-crashed';
        else {
          const release = JSON.parse(readPlain(releaseFile));
          if (claim.token !== release.token) fail('reservation/release mismatch');
          status = release.status;
          if (status === 'complete') {
            const summary = JSON.parse(readPlain(path.join(meta, 'summary.json')));
            if (summary.schemaVersion !== 1 || summary.status !== 'complete' || summary.run !== name) fail('invalid completed summary');
            authenticate(readPlain(path.join(meta, 'report.json')), summary.report, 'retained report');
            authenticate(readPlain(path.join(meta, 'authored.c')), summary.source.authored, 'retained source');
            authenticate(readPlain(path.join(meta, 'input.c')), summary.source.input, 'retained input');
            authenticate(readPlain(path.join(meta, 'census.json')), summary.census, 'retained census');
          }
        }
      }
      if (status !== 'complete') protection.push(status);
      if (references.issues.length) protection.push('reference inventory incomplete');
      const matches = references.texts.filter(item => referenced(name, item.text, run)).map(item => item.file);
      if (matches.length) protection.push('referenced: preserve complete dependency closure');
      // Stage one never emits an apply-authorizing candidate, even with no known references.
      protection.push('operator apply not implemented; live/best/pin closure requires later review');
      runs.push({ name, status, bytes: snapshot.bytes, retainedBytes: retainedBytes(run),
        protection, references: matches, wouldDelete: false });
    } catch (error) {
      issues.push(`${name}: ${error.message}`);
      runs.push({ name, status: 'unknown', bytes: null, retainedBytes: null, protection: ['inspection failed'], wouldDelete: false });
    }
  }
  const totals = { runs: runs.length, bytes: runs.reduce((s, r) => s + (r.bytes || 0), 0),
    retainedBytes: runs.reduce((s, r) => s + (r.retainedBytes || 0), 0) };
  return { schemaVersion: 1, mode: 'read-only-dry-run', deletionEnabled: false, quotaEnforced: false,
    referenceScope: 'operator-supplied roots only; live/current/best/pin closure requires separate review',
    referenceInventoryComplete: references.issues.length === 0, inventoryComplete: issues.length === 0,
    config, totals, warnings: limitWarnings(totals, config), issues, runs };
}

// Cheap future-run accounting, not a historical byte census. Unknown bytes stay explicit.
function accounting(root, config = settings()) {
  const totals = { runs: 0, bytes: 0, retainedBytes: 0 }, issues = [];
  let unknownRuns = 0;
  for (const name of fs.readdirSync(root)) {
    if (!RUN.test(name)) continue;
    totals.runs++;
    try {
      const run = path.join(root, name), file = path.join(run, META, 'summary.json');
      if (!fs.existsSync(file)) { unknownRuns++; continue; }
      const bytes = readPlain(file), summary = JSON.parse(bytes);
      if (summary.schemaVersion !== 1 || summary.run !== name || !Number.isSafeInteger(summary.bytesBeforeSummary)) fail('invalid accounting summary');
      totals.bytes += summary.bytesBeforeSummary + bytes.length;
      totals.retainedBytes += retainedBytes(run);
    } catch (error) { unknownRuns++; issues.push(error.message); }
  }
  return { totals, unknownRuns, issues, warnings: [...limitWarnings(totals, config),
    ...(unknownRuns ? [`WARN ONLY: ${unknownRuns} legacy/incomplete runs have unknown bytes; use read-only inventory`] : [])] };
}

module.exports = { DEFAULTS, RECORDS, settings, contained, plain, census, availableBytes, begin,
  reservations, checkSpace, captureSource, captureReport, publishLatest, accounting, limitWarnings, referenced, inventory };
