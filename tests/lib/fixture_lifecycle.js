'use strict';

// Only fresh per-invocation synthetic test fixtures. No historical selection API.
const fs = require('fs');
const path = require('path');
const { AsyncLocalStorage } = require('async_hooks');

function plain(file, type) {
  const absolute = path.resolve(file), parsed = path.parse(absolute);
  let ancestor = parsed.root;
  for (const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    ancestor = path.join(ancestor, part);
    const stat = fs.lstatSync(ancestor);
    if (stat.isSymbolicLink() || (ancestor !== absolute && !stat.isDirectory())) throw Error(`unsafe fixture ancestor: ${ancestor}`);
  }
  const stat = fs.lstatSync(absolute, { bigint: true });
  if (fs.realpathSync.native(absolute).toLowerCase() !== absolute.toLowerCase()) throw Error(`aliased fixture path: ${absolute}`);
  if (type === 'directory' && !stat.isDirectory()) throw Error(`not a fixture directory: ${absolute}`);
  if (type === 'file' && (!stat.isFile() || stat.nlink !== 1n)) throw Error(`nonregular/hardlinked fixture: ${absolute}`);
  // Windows file IDs can exceed Number's exact integer range.
  return { dev: stat.dev.toString(), ino: stat.ino.toString(), size: Number(stat.size),
    mtimeMs: stat.mtimeNs.toString(), nlink: Number(stat.nlink),
    isFile: () => stat.isFile(), isDirectory: () => stat.isDirectory() };
}

function mkdirPlain(directory) {
  const missing = [];
  let existing = path.resolve(directory);
  while (!fs.existsSync(existing)) { missing.unshift(existing); existing = path.dirname(existing); }
  plain(existing, 'directory');
  for (const file of missing) { fs.mkdirSync(file); plain(file, 'directory'); }
}

function writeRecord(directory, name, value) {
  plain(directory, 'directory');
  const fd = fs.openSync(path.join(directory, name), 'wx');
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2) + '\n'); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
}

function inside(root, file) {
  const relative = path.relative(root, file);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw Error('fixture path outside exact case root');
  return file;
}
const sameObject = (a, b) => a.dev === b.dev && a.ino === b.ino;
const sameFile = (a, b) => sameObject(a, b) && a.size === b.size && a.mtimeMs === b.mtimeMs && a.nlink === b.nlink;

function snapshot(context) {
  const rootStat = plain(context.root, 'directory');
  if (!sameObject(rootStat, context.identity)) throw Error('owned case root replaced');
  // Ownership comes from allocation, not whichever directory later occupies the path.
  // Validate every allocation before adopting any descendant into a cleanup census.
  for (const [directory, identity] of context.fixtures) {
    inside(context.root, directory);
    if (!sameObject(plain(directory, 'directory'), identity)) throw Error('allocated fixture root replaced');
  }
  const files = [], directories = [];
  function walk(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = inside(context.root, path.join(directory, name)), stat = plain(file);
      // Retain the whole case on junctions/links/nonregular files. Never follow or unlink them.
      if (stat.isDirectory()) { directories.push({ file, stat }); walk(file); }
      else { plain(file, 'file'); files.push({ file, stat }); }
    }
  }
  const children = fs.readdirSync(context.root);
  for (const name of children) if (!context.fixtures.has(path.join(context.root, name))) throw Error('unregistered case-root child');
  walk(context.root);
  return { files, directories, bytes: files.reduce((sum, record) => sum + record.stat.size, 0) };
}

function cleanupOwned(context, captured) {
  const fresh = snapshot(context);
  const signature = records => records.map(record => [record.file, record.stat.dev, record.stat.ino, record.stat.size, record.stat.mtimeMs, record.stat.nlink]);
  if (JSON.stringify(signature(fresh.files)) !== JSON.stringify(signature(captured.files))
    || JSON.stringify(signature(fresh.directories)) !== JSON.stringify(signature(captured.directories))) throw Error('fixture tree changed after result capture');
  let removedFiles = 0;
  try {
    for (const record of captured.files) {
      inside(context.root, record.file);
      if (!sameObject(plain(context.root, 'directory'), context.identity)
        || !sameFile(plain(record.file, 'file'), record.stat)) throw Error('fixture identity changed before unlink');
      fs.unlinkSync(record.file); removedFiles++;
    }
    for (const record of [...captured.directories].reverse()) {
      inside(context.root, record.file);
      if (!sameObject(plain(context.root, 'directory'), context.identity)
        || !sameObject(plain(record.file, 'directory'), record.stat)) throw Error('fixture directory replaced');
      fs.rmdirSync(record.file); // Empty owned directories only; never recursive.
    }
    if (!sameObject(plain(context.root, 'directory'), context.identity)) throw Error('case root replaced');
    fs.rmdirSync(context.root);
    return { status: 'removed-successful-fixtures', removedFiles, removedBytes: captured.bytes };
  } catch (error) {
    return { status: 'retained-after-cleanup-error', removedFiles, reason: error.message };
  }
}

function createFixtureSuite(nodeTest, { root, keep = process.env.OB64_KEEP_TEST_FIXTURES || '0' } = {}) {
  if (!path.isAbsolute(root)) throw Error('fixture parent must be absolute');
  if (!['0', '1'].includes(keep)) throw Error('OB64_KEEP_TEST_FIXTURES must be 0 or 1');
  mkdirPlain(root);
  const invocation = fs.mkdtempSync(path.join(root, 'run-'));
  plain(invocation, 'directory');
  writeRecord(invocation, 'invocation.json', { schemaVersion: 1, pid: process.pid,
    startedAt: new Date().toISOString(), keepFixtures: keep === '1' });
  const storage = new AsyncLocalStorage();
  async function runCase(name, body, testContext = null) {
    const caseRoot = fs.mkdtempSync(path.join(invocation, 'case-'));
    const context = { root: caseRoot, identity: plain(caseRoot, 'directory'), fixtures: new Map() };
    const started = Date.now();
    let failure = null, failed = false, result;
    try { result = await storage.run(context, body); } catch (error) { failure = error; failed = true; }
    let captured = null, reason = null;
    if (failed) reason = 'failed test';
    else if (keep === '1') reason = 'keep-fixtures mode';
    else { try { captured = snapshot(context); } catch (error) { reason = error.message; } }
    const recordName = path.basename(caseRoot);
    try {
      // Durable test outcome precedes every fixture deletion. Crash before here retains all.
      writeRecord(invocation, `${recordName}.result.json`, { schemaVersion: 1, name,
        status: failed ? 'fail' : 'pass', durationMs: Date.now() - started,
        fixtures: [...context.fixtures.keys()], files: captured?.files.length ?? null,
        bytes: captured?.bytes ?? null, cleanupPlanned: captured !== null,
        retainedReason: reason, error: failed ? String(failure && failure.stack || failure).slice(0, 8192) : null });
    } catch (error) {
      if (!failed) throw error;
      if (failure && typeof failure === 'object') failure.fixtureCaptureError = error.message;
      throw failure;
    }
    let cleanup = { status: 'retained', reason };
    if (captured) {
      try { cleanup = cleanupOwned(context, captured); }
      catch (error) { cleanup = { status: 'retained', reason: error.message }; }
    }
    try { writeRecord(invocation, `${recordName}.cleanup.json`, cleanup); }
    catch (error) {
      if (!failed) throw error;
      if (failure && typeof failure === 'object') failure.fixtureCleanupRecordError = error.message;
    }
    if (cleanup.status !== 'removed-successful-fixtures') testContext?.diagnostic(`Fixtures retained at ${caseRoot}: ${cleanup.reason}`);
    if (failed) throw failure;
    return result;
  }
  function fixtureDirectory(prefix = 'fixture-') {
    const context = storage.getStore();
    if (!context || !/^[a-z][a-z-]{0,31}$/.test(prefix)) throw Error('fixture directory requires an active test and safe prefix');
    if (!sameObject(plain(context.root, 'directory'), context.identity)) throw Error('case root replaced');
    const directory = fs.mkdtempSync(path.join(context.root, prefix));
    context.fixtures.set(directory, plain(directory, 'directory'));
    return directory;
  }
  return { invocation, fixtureDirectory, runCase,
    test(name, callback) { return nodeTest(name, context => runCase(name, () => callback(context), context)); } };
}

module.exports = { createFixtureSuite };
