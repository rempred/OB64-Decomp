'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(ROOT, 'build/matching-studies/reload-trace');
const SOURCE = 'C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/source/mips-gcc-2.7.2';
const COMMIT = '43d1cdb67ed135879869b5266f01efaaada5e35a', TREE = 'bbed133c38a1feffafe941c36b20d3b38ba47a33';
const COMPILER = 'F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6';
const BOOTSTRAP = '67F92A13C607836C90DF877E93A8D1096F44DC9D4193986C12783D7D3B57E904';
const hash = b => crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const identity = file => { const b = fs.readFileSync(file); return { path: path.resolve(file), bytes: b.length, sha256: hash(b) }; };
function same(value, expected, message) { if (value !== expected) throw Error(message + ': ' + value); return value; }
function contained(file, root = OUT) {
  const absolute = path.resolve(file), relative = path.relative(path.resolve(root), absolute);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw Error('unsafe output path: ' + file);
  const workspaceRelative = path.relative(ROOT, absolute);
  if (workspaceRelative.startsWith('..') || path.isAbsolute(workspaceRelative)) throw Error('output outside workspace');
  let current = ROOT;
  for (const part of workspaceRelative.split(path.sep)) {
    current = path.join(current, part);
    if (fs.existsSync(current)) {
      if (fs.lstatSync(current).isSymbolicLink()) throw Error('symlink output path');
      const realRelative = path.relative(fs.realpathSync(ROOT), fs.realpathSync(current));
      if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) throw Error('redirected output path');
    }
  }
  return absolute;
}
function fresh(prefix) { const candidate = contained(path.join(OUT, prefix + '-')); fs.mkdirSync(OUT, { recursive: true }); return fs.mkdtempSync(candidate); }
function write(file, value) { contained(file); fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' }); }
function environment(settings = {}, base = process.env) {
  const env = { ...base };
  for (const [key, value] of Object.entries(env)) {
    if (/^(CL|_CL_|LINK|_LINK_)$/i.test(key) && value) throw Error('host option environment rejected: ' + key);
    if (/^OB64_.*FORCE/i.test(key) && value) throw Error('forcing environment rejected: ' + key);
    if (/^VR4300MUL$/i.test(key) && /^OFF/i.test(value)) throw Error('VR4300MUL override rejected');
    if (/^OB64_(RA_|RELOAD_|SCHED_|LATE_|TRACE)/i.test(key)) delete env[key];
  }
  for (const key of Object.keys(settings)) if (!['OB64_RELOAD_TRACE', 'OB64_RELOAD_FUNCTION'].includes(key)) throw Error('unsupported trace setting');
  return { ...env, ...settings };
}
function run(exe, args, options = {}) {
  const result = cp.spawnSync(exe, args, { cwd: ROOT, encoding: 'utf8', windowsHide: true, maxBuffer: 128 * 1024 * 1024, ...options, env: environment({}, options.env || process.env) });
  if (result.error || result.status !== 0) throw Error('command failed: ' + exe + ' ' + args.join(' ') + '\n' + (result.error?.message || '') + '\n' + result.stdout + result.stderr);
  return result;
}
function authenticateSource() {
  same(run('git', ['-C', SOURCE, 'rev-parse', 'HEAD']).stdout.trim(), COMMIT, 'source commit');
  same(run('git', ['-C', SOURCE, 'rev-parse', 'HEAD^{tree}']).stdout.trim(), TREE, 'source tree');
  same(run('git', ['-C', SOURCE, 'status', '--porcelain', '--untracked-files=no']).stdout.trim(), '', 'dirty compiler source');
  const bootstrapFile = path.resolve(SOURCE, '../../bootstrap-result.json');
  same(identity(bootstrapFile).sha256, BOOTSTRAP, 'bootstrap identity');
  const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile));
  const compiler = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json'))).compiler;
  same(identity(compiler).sha256, COMPILER, 'pinned compiler');
  same(identity(path.join(SOURCE, 'cc1.exe')).sha256, COMPILER, 'source compiler');
  const vcvars = bootstrap.host.tools.find(t => /vcvarsall\.bat$/i.test(t.path));
  same(identity(vcvars.path).sha256, vcvars.sha256, 'vcvars identity');
  return { commit: COMMIT, tree: TREE, source: SOURCE, bootstrap: identity(bootstrapFile), compiler: identity(compiler), vcvars, buildFlags: bootstrap.compiler };
}
module.exports = { fs, path, cp, ROOT, OUT, SOURCE, COMPILER, hash, identity, same, contained, fresh, write, environment, run, authenticateSource };
