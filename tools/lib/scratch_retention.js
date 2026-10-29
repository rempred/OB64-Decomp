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
function symbols(value) {
  if (!Array.isArray(value) || !value.length || value.some(s => typeof s !== 'string' || !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(s))) fail('invalid claimed symbols');
  const normalized = value.map(s => s.toLowerCase()).sort();
  if (new Set(normalized).size !== normalized.length) fail('duplicate claimed symbols');
  return normalized;
}
function reservations(root, producerGroups = []) {
  plain(root, 'directory');
  let reservedBytes = 0, activeFloorBytes = 0;
  const active = [];
  const activeClaims = [];
  for (const name of fs.readdirSync(root)) {
    if (!RUN.test(name)) continue;
    const run = path.join(root, name);
    plain(run, 'directory');
    const meta = path.join(run, META);
    if (!fs.existsSync(meta)) continue; // Legacy runs are unknown, never cleanup candidates.
    plain(meta, 'directory');
    const claim = JSON.parse(readPlain(path.join(meta, 'claim.json')));
    if (![2, 3].includes(claim.schemaVersion) || claim.run !== name || !Number.isSafeInteger(claim.peakBytes) || claim.peakBytes <= 0
      || !Number.isSafeInteger(claim.floorBytes) || claim.floorBytes <= 0
      || typeof claim.token !== 'string' || !/^[a-f0-9]{32}$/.test(claim.token)) fail(`invalid reservation: ${name}`);
    let claimed = claim.schemaVersion === 3 ? symbols(claim.claimedSymbols) : [RUN.exec(name)[1].toLowerCase()];
    if (!claimed.includes(RUN.exec(name)[1].toLowerCase())) fail('reservation basename membership drift');
    for (const group of producerGroups.map(symbols)) if (group.some(s => claimed.includes(s))) claimed = [...new Set([...claimed, ...group])];
    const releaseFile = path.join(meta, 'release.json');
    if (fs.existsSync(releaseFile)) {
      const release = JSON.parse(readPlain(releaseFile));
      if (release.schemaVersion !== 1 || release.token !== claim.token || !['complete', 'failed'].includes(release.status)) fail(`invalid release: ${name}`);
    } else {
      reservedBytes += claim.peakBytes;
      activeFloorBytes = Math.max(activeFloorBytes, claim.floorBytes);
      if (!Number.isSafeInteger(reservedBytes)) fail('reservation arithmetic overflow');
      active.push(name);
      activeClaims.push({ run: name, token: claim.token, symbols: claimed });
    }
  }
  return { active, activeClaims, reservedBytes, activeFloorBytes };
}

function checkSpace(root, config, phase, readSpace = availableBytes, producerGroups = []) {
  validateSettings(config);
  const claims = reservations(root, producerGroups);
  const freeBytes = readSpace(root);
  if (!Number.isSafeInteger(freeBytes) || freeBytes < 0) fail('invalid free-space result');
  // A lower-floor caller cannot spend another active participant's floor.
  const requiredBytes = Math.max(config.floorBytes, claims.activeFloorBytes) + claims.reservedBytes;
  if (!Number.isSafeInteger(requiredBytes)) fail('reserve arithmetic overflow');
  if (freeBytes < requiredBytes) fail(`free-space reserve at ${phase}: available ${freeBytes}, required ${requiredBytes}; ${claims.active.length} cooperative slot(s)`);
  return { phase, freeBytes, requiredBytes, ...claims };
}

function begin({ root, output, config = settings(), readSpace = availableBytes, claimedSymbols = null, producerGroups = [] }) {
  validateSettings(config);
  root = path.resolve(root); output = contained(root, output);
  if (path.dirname(output) !== root || !RUN.test(path.basename(output))) fail('invalid direct diff run path');
  const claimed = symbols(claimedSymbols || [RUN.exec(path.basename(output))[1]]);
  if (!claimed.includes(RUN.exec(path.basename(output))[1].toLowerCase())) fail('requested basename is not claimed');
  producerGroups = producerGroups.map(symbols);
  for (const group of producerGroups) if (group.some(s => claimed.includes(s)) && group.some(s => !claimed.includes(s))) fail('incomplete producer claim');
  // Creating the small owned run/claim is the only work before admission.
  plain(path.dirname(root), 'directory');
  if (!fs.existsSync(root)) fs.mkdirSync(root);
  plain(root, 'directory');
  fs.mkdirSync(output); // Exclusive collision rejection; no replacement/reuse.
  const meta = path.join(output, META);
  fs.mkdirSync(meta);
  const token = crypto.randomBytes(16).toString('hex');
  writeNew(meta, 'claim.json', jsonBytes({ schemaVersion: 3, claimedSymbols: claimed, run: path.basename(output), token,
    floorBytes: config.floorBytes, peakBytes: config.peakBytes, pid: process.pid, startedAt: new Date().toISOString() }));
  let released = false;
  const handle = {
    root, output, meta, config,
    check(phase) {
      if (released) fail('reservation already released');
      const result = checkSpace(root, config, phase, readSpace, producerGroups);
      const own = result.activeClaims.filter(c => c.run === path.basename(output));
      if (own.length !== 1 || own[0].token !== token || JSON.stringify([...own[0].symbols].sort()) !== JSON.stringify(claimed)) fail('active reservation identity changed');
      if (result.activeClaims.some(c => c.run !== path.basename(output) && c.symbols.some(s => claimed.includes(s)))) fail('same-symbol active/crashed reservation overlaps requested producer');
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

function captureSource(handle, repository, classification, inputBytes, names = { authored: 'authored.c', input: 'input.c' }) {
  if (!classification || typeof classification.source !== 'string') fail('missing classification');
  const source = contained(repository, path.resolve(repository, classification.source));
  const authored = readPlain(source);
  authenticate(authored, { bytes: classification.sourceBytes, sha256: classification.sourceSha256 }, 'authored source');
  authenticate(inputBytes, classification.compilationInput, 'preprocessed input');
  const authoredIdentity = writeNew(handle.meta, names.authored, authored);
  const inputIdentity = writeNew(handle.meta, names.input, inputBytes);
  return { source: classification.source, sourcePolicyDigest: classification.digest,
    authored: authoredIdentity, input: inputIdentity };
}

function validateCapturedReport(handle, captured, report, names = { authored: 'authored.c', input: 'input.c' }) {
  if (path.resolve(report.output) !== handle.output || report.source !== captured.source
    || report.sourcePolicyDigest !== captured.sourcePolicyDigest) fail('report/source binding mismatch');
  authenticate(readPlain(path.join(handle.meta, names.authored)), captured.authored, 'retained authored source');
  authenticate(readPlain(path.join(handle.meta, names.input)), captured.input, 'retained input');
  const actual = report.object && report.object.compilationInput;
  if (!actual || actual.path !== captured.source) fail('compiled input path mismatch');
  authenticate(readPlain(contained(handle.output, path.resolve(handle.output, actual.path))), actual, 'actual compiler input');
  if (actual.bytes !== captured.input.bytes || actual.sha256 !== captured.input.sha256
    || report.compilationInput?.bytes !== captured.input.bytes || report.compilationInput?.sha256 !== captured.input.sha256) fail('report input identity mismatch');
}
function captureReport(handle, captured, report) {
  validateCapturedReport(handle, captured, report);
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

function captureBatchSource(handle, repository, classification, inputBytes, index, members) {
  if (!Number.isSafeInteger(index) || index < 0) fail('invalid producer ordinal');
  const names = { authored: `producer-${index}-authored.c`, input: `producer-${index}-input.c` };
  return { ...captureSource(handle, repository, classification, inputBytes, names), names, members: symbols(members) };
}

// One immutable diagnostic manifest describes the entire shared output. Failed
// captures stay protected; they never replace latest per-target reports.
function captureBatchReport(handle, sources, requested, reports, allowance, error = null) {
  const requestedSymbols = symbols(requested);
  if (!Number.isSafeInteger(allowance) || allowance <= 0 || !Array.isArray(sources) || !sources.length) fail('invalid batch retention inputs');
  const sourceMembers = new Set();
  for (const source of sources) {
    for (const name of symbols(source.members)) { if (sourceMembers.has(name)) fail('duplicate retained producer member'); sourceMembers.add(name); }
    authenticate(readPlain(path.join(handle.meta, source.names.authored)), source.authored, 'retained batch authored source');
    authenticate(readPlain(path.join(handle.meta, source.names.input)), source.input, 'retained batch input');
  }
  if (!error && requestedSymbols.some(s => !sourceMembers.has(s))) fail('missing retained producer');
  const seen = new Set(), prepared = reports.map((report, index) => {
    const symbol = String(report.symbol).toLowerCase();
    if (!requestedSymbols.includes(symbol) || seen.has(symbol)) fail('unexpected or duplicate batch report');
    seen.add(symbol);
    const captured = sources.find(s => s.members.includes(symbol));
    if (!captured) fail('batch report has no captured producer');
    validateCapturedReport(handle, captured, report, captured.names);
    const value = { ...report, diagnosticOnly: true, incompleteBatch: Boolean(error), sharedIdentitySealed: !error };
    return { symbol: report.symbol, name: `target-${index}-report.json`, bytes: jsonBytes(value), exact: report.comparison?.exact === true };
  });
  if (!error && seen.size !== requestedSymbols.length) fail('incomplete batch reports');
  const byteCount = prepared.reduce((n, r) => n + r.bytes.length, 0);
  if (!Number.isSafeInteger(byteCount) || byteCount > allowance) fail('batch diagnostic report allowance exceeded');
  handle.check('before-batch-records');
  const records = prepared.map(r => ({ symbol: r.symbol, path: r.name, exact: r.exact, ...writeNew(handle.meta, r.name, r.bytes) }));
  const manifest = { schemaVersion: 1, diagnosticOnly: true, status: error ? 'incomplete' : 'complete',
    requested: requestedSymbols, sources, reports: records, output: handle.output,
    unavailable: requestedSymbols.filter(s => !seen.has(s)), allExact: !error && records.every(r => r.exact),
    error: error ? { name: error.name, message: error.message } : null };
  if (jsonBytes(manifest).length > allowance) fail('batch manifest allowance exceeded');
  const manifestIdentity = writeNew(handle.meta, 'batch.json', jsonBytes(manifest));
  const snapshot = census(handle.output);
  if (snapshot.issues.length) fail('incomplete batch run census');
  const censusBytes = jsonBytes({ schemaVersion: 1, scope: 'files before census/summary', ...snapshot });
  if (censusBytes.length + jsonBytes(manifest).length > allowance) fail('batch metadata allowance exceeded');
  const censusIdentity = writeNew(handle.meta, 'census.json', censusBytes);
  const files = [...sources.flatMap(s => [s.names.authored, s.names.input]), ...records.map(r => r.path), 'batch.json', 'census.json'];
  const summary = { schemaVersion: 2, status: error ? 'failed' : 'complete', diagnosticOnly: true, run: path.basename(handle.output),
    manifest: manifestIdentity, census: censusIdentity, retainedFileAllowlist: [...files, 'summary.json'], deletionEnabled: false,
    bytesBeforeSummary: snapshot.bytes + censusIdentity.bytes, retainedBytesBeforeSummary: files.reduce((n, f) => n + plain(path.join(handle.meta, f), 'file').size, 0) };
  writeNew(handle.meta, 'summary.json', jsonBytes(summary));
  return { manifest, identity: manifestIdentity, path: path.join(handle.meta, 'batch.json') };
}

function readBatch(run, summary) {
  const meta = path.join(run, META), bytes = readPlain(path.join(meta, 'batch.json'));
  authenticate(bytes, summary.manifest, 'batch manifest');
  const batch = JSON.parse(bytes);
  if (batch.schemaVersion !== 1 || batch.diagnosticOnly !== true || path.resolve(batch.output) !== run
      || !['complete', 'incomplete'].includes(batch.status)) fail('invalid retained batch');
  const requested = symbols(batch.requested), members = new Set();
  const names = new Set(['batch.json', 'census.json', 'summary.json']);
  for (const s of batch.sources) {
    for (const m of symbols(s.members)) { if (members.has(m)) fail('duplicate batch member'); members.add(m); }
    for (const role of ['authored', 'input']) {
      const name = s.names[role];
      if (typeof name !== 'string' || !/^producer-\d+-(authored|input)\.c$/.test(name) || names.has(name)) fail('invalid retained source filename');
      names.add(name); authenticate(readPlain(path.join(meta, name)), s[role], 'batch source');
    }
  }
  const reported = new Set();
  for (const r of batch.reports) {
    const symbol = r.symbol.toLowerCase();
    if (!requested.includes(symbol) || reported.has(symbol) || !members.has(symbol) || !/^target-\d+-report\.json$/.test(r.path) || names.has(r.path)) fail('invalid batch report membership');
    reported.add(symbol); names.add(r.path);
    const bytes = readPlain(path.join(meta, r.path)); authenticate(bytes, r, 'batch report');
    const report = JSON.parse(bytes), source = batch.sources.find(s => s.members.includes(symbol));
    if (report.symbol !== r.symbol || report.diagnosticOnly !== true
        || report.incompleteBatch !== (batch.status === 'incomplete')
        || report.sharedIdentitySealed !== (batch.status === 'complete')
        || r.exact !== (report.comparison?.exact === true)) fail('retained batch report binding drift');
    validateCapturedReport({ output: run, meta }, source, report, source.names);
  }
  if (batch.status === 'complete' && reported.size !== requested.length) fail('missing batch reports');
  if (batch.allExact !== (batch.status === 'complete' && batch.reports.every(r => r.exact))
      || JSON.stringify(batch.unavailable) !== JSON.stringify(requested.filter(s => !reported.has(s)))
      || summary.status !== (batch.status === 'complete' ? 'complete' : 'failed')) fail('batch outcome census drift');
  if (JSON.stringify([...names].sort()) !== JSON.stringify([...summary.retainedFileAllowlist].sort())) fail('batch retained file allowlist drift');
  authenticate(readPlain(path.join(meta, 'census.json')), summary.census, 'batch census');
  return batch;
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
  let records = RECORDS;
  const summaryFile = path.join(run, META, 'summary.json');
  if (fs.existsSync(summaryFile)) {
    const summary = JSON.parse(readPlain(summaryFile));
    if (summary.schemaVersion === 2) { readBatch(run, summary); records = summary.retainedFileAllowlist; }
  }
  for (const name of records) {
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
  // Latest member reports protect their common output even when no prose cites it.
  const latest = path.resolve(__dirname, '../../build/diff');
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
      let batch = null;
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
            if (![1, 2].includes(summary.schemaVersion) || summary.status !== 'complete' || summary.run !== name) fail('invalid completed summary');
            if (summary.schemaVersion === 2) batch = readBatch(run, summary);
            else {
            authenticate(readPlain(path.join(meta, 'report.json')), summary.report, 'retained report');
            authenticate(readPlain(path.join(meta, 'authored.c')), summary.source.authored, 'retained source');
            authenticate(readPlain(path.join(meta, 'input.c')), summary.source.input, 'retained input');
            authenticate(readPlain(path.join(meta, 'census.json')), summary.census, 'retained census');
            }
          }
        }
      }
      if (status !== 'complete') protection.push(status);
      if (references.issues.length) protection.push('reference inventory incomplete');
      const aliases = batch ? batch.requested.map(symbol => name.replace(RUN.exec(name)[1], symbol)) : [];
      const memberReferences = [];
      try {
        const memberSymbols = batch ? batch.reports.map(r => r.symbol) : RUN.test(name) ? [RUN.exec(name)[1]] : [];
        for (const symbol of memberSymbols) {
          const file = path.join(latest, `${symbol}.json`);
          if (fs.existsSync(file)) memberReferences.push({ file, text: readPlain(file).toString('utf8') });
        }
      } catch (error) { protection.push('latest reference inventory incomplete'); issues.push(error.message); }
      const matches = [...references.texts, ...memberReferences].filter(item => referenced(name, item.text, run)
        || aliases.some(alias => referenced(alias, item.text, run))).map(item => item.file);
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
      if (![1, 2].includes(summary.schemaVersion) || summary.run !== name || !Number.isSafeInteger(summary.bytesBeforeSummary)) fail('invalid accounting summary');
      totals.bytes += summary.bytesBeforeSummary + bytes.length;
      totals.retainedBytes += retainedBytes(run);
    } catch (error) { unknownRuns++; issues.push(error.message); }
  }
  return { totals, unknownRuns, issues, warnings: [...limitWarnings(totals, config),
    ...(unknownRuns ? [`WARN ONLY: ${unknownRuns} legacy/incomplete runs have unknown bytes; use read-only inventory`] : [])] };
}

module.exports = { DEFAULTS, RECORDS, settings, contained, plain, census, availableBytes, begin,
  reservations, checkSpace, captureSource, captureReport, captureBatchSource, captureBatchReport, readBatch, publishLatest, accounting, limitWarnings, referenced, inventory };
