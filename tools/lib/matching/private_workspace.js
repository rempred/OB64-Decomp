'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const RESERVED = new Set(['calibration', 'manual', 'research-preserve', 'runs', 'targets', 'probes', 'candidates', 'reports', 'shared', 'current', 'workbench', 'con', 'prn', 'aux', 'nul']);
const MARKER = 'OB64_PRIVATE_GUARD';
const MAX_ROOT = 120; // Leaves room for target/probes/64-digit ids and output suffixes below MAX_PATH.
const activeWatches = new WeakMap();

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
function resolvePrivateWorkspace({ root, scratchRoot, nativeConcurrency = 'parallel', command, diagnostic = false }) {
  if (command !== undefined && !['intake', 'watch', 'probe'].includes(command)) throw new Error('unsupported private admission command');
  if(diagnostic && !['watch','probe'].includes(command))throw new Error('diagnostic admission requires watch/probe');
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
  Object.defineProperty(workspace, 'admission', { value: command === 'intake' ? 'research-intake' : diagnostic && ['watch','probe'].includes(command) ? 'candidate-diagnostic-v1' : command==='watch' ? 'strict-watch-v1' : 'strict', enumerable: true });
  if (['strict-watch-v1','candidate-diagnostic-v1'].includes(workspace.admission)) assertPrivateControls(workspace);
  else assertPrivateWorkspace(workspace);
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
  if (workspace.admission !== undefined && !['strict', 'research-intake', 'strict-watch-v1','candidate-diagnostic-v1'].includes(workspace.admission)) throw new Error('unknown private admission policy');
  if (['research-intake','candidate-diagnostic-v1'].includes(workspace.admission)) {
    for (const name of ['workbench.sqlite', 'workbench.sqlite-wal', 'workbench.sqlite-shm', 'workbench.sqlite-journal', '.private-guard.json']) {
      assertPrivatePath(workspace, path.join(workspace.matchingRoot, name), { mustExist: false });
    }
  } else inspectExisting(workspace.matchingRoot, true);
  if (!same(workspace.storeOptions.database, path.join(workspace.matchingRoot, 'workbench.sqlite'))) throw new Error('private database must remain in scratch-root');
  if (fs.existsSync(workspace.matchingRoot) && !fs.lstatSync(workspace.matchingRoot).isDirectory()) throw new Error('scratch-root is occupied by a file');
}
function assertPrivateControls(workspace) {
  inspectAncestors(workspace.matchingRoot);
  if (!same(workspace.storeOptions.database, path.join(workspace.matchingRoot, 'workbench.sqlite'))) throw new Error('private database must remain in scratch-root');
  if (fs.existsSync(workspace.matchingRoot) && !fs.lstatSync(workspace.matchingRoot).isDirectory()) throw new Error('scratch-root is occupied by a file');
  for (const name of ['workbench.sqlite', 'workbench.sqlite-wal', 'workbench.sqlite-shm', 'workbench.sqlite-journal', '.private-guard.json']) {
    assertPrivatePath(workspace, path.join(workspace.matchingRoot, name), { mustExist: false });
  }
}
function requireActiveWatchWorkspace(workspace, inputs, root, matchingRoot) {
  const active = activeWatches.get(workspace);
  if (!active || active.pid !== process.pid || active.parent !== process.ppid || active.inputs !== inputs
      || active.root !== workspace.root || active.matchingRoot !== workspace.matchingRoot
      || active.database !== workspace.storeOptions.database || active.mode !== workspace.nativeConcurrency
      || !['strict-watch-v1','candidate-diagnostic-v1'].includes(workspace.admission) || !same(root, active.root) || !same(matchingRoot, active.matchingRoot)) {
    throw new Error('private watch callback scope mismatch');
  }
  assertPrivateControls(workspace);
  return workspace;
}
function combinePrivateErrors(primary, secondary) {
  if (!primary) return secondary;
  const error = new AggregateError([primary, secondary], `${primary.message || primary}; private postcheck: ${secondary.message || secondary}`, { cause: primary });
  if (primary.code !== undefined) error.code = primary.code;
  return error;
}
function validateWatchCommand(workspace, command, nativeRequested) {
  if (!nativeRequested || !same(command[1], path.join(workspace.root, 'tools/match.js')) || !['watch','probe'].includes(command[2])) throw new Error('strict watch admission requires the watch CLI');
  const argument = (name, optional = false) => {
    const positions = command.flatMap((value, index) => value === name ? [index] : []);
    if (optional && positions.length === 0) return undefined;
    if (positions.length !== 1 || !command[positions[0] + 1] || command[positions[0] + 1].startsWith('--')) throw new Error(`strict watch requires one ${name}`);
    return command[positions[0] + 1];
  };
  if (!same(path.resolve(workspace.root, argument('--scratch-root')), workspace.matchingRoot)) throw new Error('strict watch command/root mismatch');
  assertPrivatePath(workspace, path.resolve(workspace.root, argument('--source')), { mustExist: false });
  if ((argument('--native-concurrency', true) || 'parallel') !== workspace.nativeConcurrency) throw new Error('strict watch scheduling mismatch');
}
async function withPrivateWorkspace(workspace, options, callback) {
  const watch = ['strict-watch-v1','candidate-diagnostic-v1'].includes(workspace.admission);
  if (watch) assertPrivateControls(workspace);
  else assertPrivateWorkspace(workspace);
  const research = workspace.admission === 'research-intake';
  if (research && options.native) throw new Error('research admission cannot supervise a native command');
  const command = [process.execPath, ...process.argv.slice(1)];
  if (watch) validateWatchCommand(workspace, command, options.native === true);
  if (research && (!same(command[1], path.join(workspace.root, 'tools/match.js')) || command[2] !== 'intake')) throw new Error('research admission requires the intake CLI');
  const commandSha256 = crypto.createHash('sha256').update(JSON.stringify(command)).digest('hex');
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
    if (research ? ticket.admission !== 'research-intake' || ticket.commandSha256 !== commandSha256
      : watch ? ticket.admission !== workspace.admission || ticket.commandSha256 !== commandSha256
        : ticket.admission !== undefined) throw new Error('private guard admission identity mismatch');
    if (watch) {
      workspace.guardTimings=ticket.timings;
      if (activeWatches.has(workspace)) throw new Error('private watch callback is already active');
      const closingWorkspace = { ...workspace, storeOptions: { database: workspace.storeOptions.database } };
      activeWatches.set(workspace, { pid: process.pid, parent: process.ppid, inputs: options.inputs,
        root: workspace.root, matchingRoot: workspace.matchingRoot, database: workspace.storeOptions.database, mode: workspace.nativeConcurrency });
      let result, failure;
      try {
        try { result = await callback(); } catch (error) { failure = error || new Error('private watch callback failed', { cause: error }); }
        try {
          requireActiveWatchWorkspace(workspace, options.inputs, workspace.root, workspace.matchingRoot);
        } catch (error) { failure = combinePrivateErrors(failure, error); }
        // Even a failed scope/control check closes the originally admitted root.
        try { if(workspace.admission==='candidate-diagnostic-v1') assertPrivateControls(closingWorkspace); else assertPrivateWorkspace(closingWorkspace); }
        catch (error) { failure = combinePrivateErrors(failure, error); }
      } finally { activeWatches.delete(workspace); }
      if (failure) throw failure;
      // Completion is returned as a closure only by the diagnostic CLI. Input
      // and workspace closes have passed; store path checks run in its transaction.
      return workspace.admission==='candidate-diagnostic-v1' ? await result() : result;
    }
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
    const child = spawn(python, [...(options.isolatedPython ? ['-I','-S'] : []), guard, '--parent', String(process.pid), '--root-key', key, '--root', workspace.matchingRoot, '--wait-ms', String(waitMs), ...(workspace.admission==='candidate-diagnostic-v1' ? ['--parent-elapsed-ms',String(process.uptime()*1000)] : []), ...(native ? ['--native'] : []), ...(research ? ['--research-intake'] : []), ...(watch ? [workspace.admission==='candidate-diagnostic-v1' ? '--candidate-diagnostic' : '--strict-watch'] : []), '--', ...command], { cwd: process.cwd(), stdio: 'inherit', windowsHide: true, env: { ...Object.fromEntries(Object.entries(process.env).filter(([name]) => !options.isolatedPython || !/^PYTHON/i.test(name))), [MARKER]: marker } });
    child.once('error', reject);
    child.once('exit', (code, signal) => { process.exitCode = code === null ? 1 : code; resolve(); });
  });
}

module.exports = { resolvePrivateWorkspace, assertPrivateWorkspace, assertPrivatePath, withPrivateWorkspace,
  assertPrivateControls, requireActiveWatchWorkspace, combinePrivateErrors };
