'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const RESERVED = new Set(['calibration', 'manual', 'research-preserve', 'runs', 'targets', 'probes', 'candidates', 'reports', 'shared', 'current', 'workbench', 'con', 'prn', 'aux', 'nul']);
const MARKER = 'OB64_PRIVATE_GUARD';
const MAX_ROOT = 120; // Leaves room for target/probes/64-digit ids and output suffixes below MAX_PATH.

function same(a, b) { return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase(); }
function inspectExisting(file, recursive = false) {
  if (!fs.existsSync(file)) {
    // existsSync follows a dangling symlink, so lstat it as well.
    try { fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  }
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) throw new Error(`private workspace rejects links: ${file}`);
  if (!stat.isDirectory() && !stat.isFile()) throw new Error(`private workspace requires regular files/directories: ${file}`);
  if (stat.isFile() && stat.nlink !== 1) throw new Error(`private workspace rejects hardlinks: ${file}`);
  if (!same(fs.realpathSync.native(file), file)) throw new Error(`private workspace rejects path aliases: ${file}`);
  if (recursive && stat.isDirectory()) for (const name of fs.readdirSync(file)) inspectExisting(path.join(file, name), true);
}
function inspectAncestors(file) {
  const ancestors = [];
  for (let p = path.resolve(file); ; p = path.dirname(p)) { ancestors.push(p); if (path.dirname(p) === p) break; }
  for (const p of ancestors.reverse()) inspectExisting(p);
}
function resolvePrivateWorkspace({ root, scratchRoot, nativeConcurrency = 'parallel' }) {
  if (!root || typeof scratchRoot !== 'string' || !scratchRoot) throw new Error('scratch-root requires a repository-local path');
  if (!['serial', 'parallel'].includes(nativeConcurrency)) throw new Error('native-concurrency must be serial or parallel');
  if (/\\\\|(^|[\\/])\.\.?([\\/]|$)|:.*:|[ .]$/.test(scratchRoot)) throw new Error('scratch-root rejects aliases, traversal and device paths');
  const repository = path.resolve(root);
  const parent = path.join(repository, 'build', 'matching');
  const matchingRoot = path.resolve(repository, scratchRoot);
  const worker = path.basename(matchingRoot);
  if (!same(path.dirname(matchingRoot), parent) || !/^[a-z][a-z0-9-]{0,23}$/.test(worker) || RESERVED.has(worker) || /^(com|lpt)[0-9]$/.test(worker)) throw new Error('scratch-root must be a nonreserved short lowercase immediate child of build/matching');
  if (matchingRoot.length > MAX_ROOT) throw new Error(`scratch-root exceeds ${MAX_ROOT} characters; historical compiler paths require a shorter repository path`);
  const workspace = { root: repository, matchingRoot, storeOptions: { database: path.join(matchingRoot, 'workbench.sqlite') }, nativeConcurrency };
  assertPrivateWorkspace(workspace);
  return workspace;
}
function assertPrivatePath(workspace, file, { mustExist = true, regularFile = true } = {}) {
  const resolved = path.resolve(file);
  const relative = path.relative(workspace.matchingRoot, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('private artifact must be below scratch-root');
  inspectAncestors(resolved);
  if (mustExist && !fs.existsSync(resolved)) throw new Error(`private artifact is missing: ${resolved}`);
  if (fs.existsSync(resolved) && regularFile && !fs.lstatSync(resolved).isFile()) throw new Error(`private artifact is not a regular file: ${resolved}`);
  return resolved;
}
function assertPrivateWorkspace(workspace) {
  inspectAncestors(workspace.matchingRoot);
  inspectExisting(workspace.matchingRoot, true);
  if (!same(workspace.storeOptions.database, path.join(workspace.matchingRoot, 'workbench.sqlite'))) throw new Error('private database must remain in scratch-root');
  if (fs.existsSync(workspace.matchingRoot) && !fs.lstatSync(workspace.matchingRoot).isDirectory()) throw new Error('scratch-root is occupied by a file');
}
async function withPrivateWorkspace(workspace, options, callback) {
  assertPrivateWorkspace(workspace);
  const native = options.native === true && workspace.nativeConcurrency === 'serial';
  const key = crypto.createHash('sha256').update(workspace.matchingRoot.toLowerCase()).digest('hex');
  // The CPP environment identity is stable across command/native modes. Exact
  // mode, PID and supervisor identity remain authenticated by the ticket below.
  const marker = key;
  if (process.env[MARKER] === marker) {
    // Bind reentry to the single suspended child. A nested CLI inherits the env
    // string but must not bypass exclusion for the already occupied root.
    const ticketFile = assertPrivatePath(workspace, path.join(workspace.matchingRoot, '.private-guard.json'));
    const ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
    if (ticket.pid !== process.pid || ticket.supervisorPid !== process.ppid || ticket.rootKey !== key || ticket.native !== native) throw new Error('private guard process identity mismatch');
    const result = await callback();
    assertPrivateWorkspace(workspace);
    return result;
  }
  if (process.env[MARKER]) throw new Error('private guard context differs from requested workspace');
  if (process.platform !== 'win32') throw new Error('private command guard currently requires Windows Job Objects');
  // Resolve only Python here. resolveLocalTools() also creates the shared workRoot.
  const configuredPython = options.python || process.env.OB64_MATCH_PYTHON || process.env.OB64_SPLAT_PYTHON;
  const python = configuredPython || path.resolve(workspace.root, require('../local_tools').loadLocalConfig().config.splatPython);
  const guard = options.guardPath || path.join(workspace.root, 'tools', 'matching_workbench', 'private_guard.py');
  // A first private context can spend several minutes authenticating/preprocessing
  // the complete active census; allow the other assigned worker to finish it.
  const waitMs = options.waitMs === undefined ? 300000 : options.waitMs;
  if (!Number.isInteger(waitMs) || waitMs < 0 || waitMs > 300000) throw new Error('private guard wait must be 0..300000 ms');
  await new Promise((resolve, reject) => {
    const child = spawn(python, [guard, '--parent', String(process.pid), '--root-key', key, '--root', workspace.matchingRoot, '--wait-ms', String(waitMs), ...(native ? ['--native'] : []), '--', process.execPath, ...process.argv.slice(1)], { cwd: process.cwd(), stdio: 'inherit', windowsHide: true, env: { ...process.env, [MARKER]: marker } });
    child.once('error', reject);
    child.once('exit', (code, signal) => { process.exitCode = code === null ? 1 : code; resolve(); });
  });
}

module.exports = { resolvePrivateWorkspace, assertPrivateWorkspace, assertPrivatePath, withPrivateWorkspace };
