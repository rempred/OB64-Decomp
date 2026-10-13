#!/usr/bin/env node
'use strict';
// Actual diff CLI orchestration; only expensive producers and the native boundary are mocked.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const crypto = require('crypto');
const Module = require('module');
const REPO = path.resolve(__dirname, '../..');
const SOURCE = process.env.OB64_DIFF_ADMISSION_SOURCE_ROOT || REPO;
const SYMBOL = 'func_00123456';
const TIME = 1791900000000;
const RUN = `${SYMBOL}-${TIME}-000000`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();

function preload() {
  const config = JSON.parse(fs.readFileSync(process.env.OB64_DIFF_ADMISSION_JOB, 'utf8'));
  const { root, mode } = config;
  const repository = path.join(root, 'repository');
  const work = mode === 'inside-output' ? path.join(repository, 'work') : path.join(root, 'work');
  const output = path.join(work, 'diff', RUN);
  const events = [];
  const note = name => events.push(name);
  const originalResolve = Module._resolveFilename;
  Module._resolveFilename = function(request, parent, ...rest) {
    try { return originalResolve.call(this, request, parent, ...rest); }
    catch (error) {
      // Private staging only: unchanged dependencies remain in the actual checkout.
      if (!request.startsWith('.') || !parent?.filename.startsWith(config.codeRoot + path.sep)) throw error;
      const candidate = path.resolve(path.dirname(parent.filename), request);
      return originalResolve.call(this, path.join(SOURCE, path.relative(config.codeRoot, candidate)), parent, ...rest);
    }
  };
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    const value = originalLoad.call(this, request, parent, isMain);
    if (request.endsWith('/phase7_conventional')) return { ...value, ROOT: repository };
    if (request.endsWith('/current_workflow')) return {
      ...value,
      prepareContext() {
        note('context');
        const bytes = Buffer.from('int candidate(void) { return 1; }\n');
        return { phase8: { targets: [{ symbol: SYMBOL }], model: {} }, localTools: { workRoot: work },
          sourcePolicy: { targets: [{ symbol: SYMBOL, source: 'candidate.c', sourceBytes: bytes.length,
            sourceSha256: hash(bytes), compilationInput: { bytes: bytes.length, sha256: hash(bytes) }, digest: 'tiny-policy' }] } };
      },
      ensureBaseline(context, options) {
        note('baseline');
        if (mode === 'missing-baseline' || mode === 'stale-baseline') {
          options.onStep('mock baseline requires native build');
          note('FORBIDDEN-native-baseline'); throw new Error('onStep did not refuse');
        }
        return { phase7Output: mode === 'inside-phase7' ? path.join(repository, 'phase7') : mode === 'equal-phase7' ? output : path.join(root, 'baseline') };
      },
    };
    if (request.endsWith('/source_policy')) return { ...value, compilationInputBytes: () => Buffer.from('int candidate(void) { return 1; }\n') };
    if (request.endsWith('/phase8_matching_c')) {
      const wrapped = { ...value,
        verifyRuntimeTools() {
          note('runtime-boundary');
          if (!mode.startsWith('capture')) throw new Error('MOCK_COSTLY_BOUNDARY');
          return { tools: { 'mips-kmc-elf-objcopy.exe': { path: 'never-executed' } } };
        },
        verifyCompiler() { note('mock-compiler-identity'); return {}; },
        verifyPhase7Input() { note('after-capture'); throw new Error('MOCK_AFTER_CAPTURE'); },
      };
      for (const name of ['assertBuildLocations', 'assertBuildOutputLocation', 'assertBuildPathSeparation']) {
        if (value[name]) wrapped[name] = (...args) => { note(name); return value[name](...args); };
      }
      return wrapped;
    }
    if (request.endsWith('/scratch_retention')) return { ...value, begin(options) { note('begin'); return value.begin(options); } };
    return value;
  };
  Date.now = () => TIME;
  const random = crypto.randomBytes;
  crypto.randomBytes = size => size === 3 ? Buffer.alloc(3) : random(size);
  fs.statfsSync = () => ({ bavail: BigInt(mode === 'low-space' ? 1 : 40 * 1024 ** 3), bsize: 1n });
  const rawWrite = fs.writeFileSync;
  const rawMkdir = fs.mkdirSync;
  const inside = file => {
    if (typeof file === 'number') return;
    const relative = path.relative(root, path.resolve(String(file)));
    assert(relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative), `write escaped tiny root: ${file}`);
  };
  fs.mkdirSync = function(file, ...args) {
    inside(file);
    if (mode === 'racing-collision' && path.resolve(file) === output && !fs.existsSync(file)) {
      rawMkdir(file); rawWrite(path.join(file, 'racer.txt'), 'preserve racing owner'); note('racing-owner-created');
    }
    return rawMkdir(file, ...args);
  };
  for (const name of ['writeFileSync', 'appendFileSync', 'renameSync', 'unlinkSync', 'rmSync', 'rmdirSync']) {
    const original = fs[name]; fs[name] = function(file, ...args) { inside(file); if (name === 'renameSync') inside(args[0]); return original.call(this, file, ...args); };
  }
  const rawOpen = fs.openSync;
  fs.openSync = function(file, flags, ...args) {
    if (typeof flags !== 'string' || /[wa+]/.test(flags)) inside(file);
    if (mode === 'capture-release-error' && path.basename(file) === 'release.json') { note('release-error'); throw new Error('MOCK_RELEASE_ERROR'); }
    return rawOpen(file, flags, ...args);
  };
  for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync']) cp[name] = () => { note('FORBIDDEN-native'); throw new Error('unexpected child process'); };
  process.on('exit', () => rawWrite(path.join(root, 'events.json'), JSON.stringify(events)));
}

function test() {
  const parent = process.env.OB64_DIFF_ADMISSION_FIXTURE_ROOT || path.join(SOURCE, 'build');
  const root = fs.mkdtempSync(path.join(parent, 'diff-admission-tests-'));
  const results = [];
  const modes = ['fresh', 'preexisting-empty', 'preexisting-nonempty', 'racing-collision', 'inside-output', 'inside-phase7', 'equal-phase7', 'low-space', 'same-symbol', 'missing-baseline', 'stale-baseline', 'capture', 'capture-release-error'];
  const cases = modes.map(mode => ({ mode, cli: path.join(REPO, 'tools/diff.js') }));
  if (process.env.OB64_DIFF_ADMISSION_BUGGY_CLI) cases.push({ mode: 'negative-control', cli: process.env.OB64_DIFF_ADMISSION_BUGGY_CLI });
  for (const entry of cases) {
    const caseRoot = path.join(root, entry.mode); fs.mkdirSync(caseRoot);
    const repository = path.join(caseRoot, 'repository'); fs.mkdirSync(repository);
    fs.writeFileSync(path.join(repository, 'candidate.c'), 'int candidate(void) { return 1; }\n');
    const before = fs.readdirSync(repository);
    const work = path.join(caseRoot, 'work'); fs.mkdirSync(work);
    const diff = path.join(work, 'diff'); fs.mkdirSync(diff);
    const output = path.join(diff, RUN);
    if (entry.mode.startsWith('preexisting')) {
      fs.mkdirSync(output);
      if (entry.mode.endsWith('nonempty')) fs.writeFileSync(path.join(output, 'owner.txt'), 'preserve original');
    }
    if (entry.mode === 'same-symbol') {
      const meta = path.join(diff, `${SYMBOL}-${TIME - 1}-abcdef`, '.scratch-retention'); fs.mkdirSync(meta, { recursive: true });
      fs.writeFileSync(path.join(meta, 'claim.json'), JSON.stringify({ schemaVersion: 2, run: path.basename(path.dirname(meta)), token: 'a'.repeat(32), floorBytes: 8 * 1024 ** 3, peakBytes: 2 * 1024 ** 3, pid: process.pid }));
    }
    const job = path.join(caseRoot, 'job.json'); fs.writeFileSync(job, JSON.stringify({ root: caseRoot, mode: entry.mode, codeRoot: path.resolve(path.dirname(entry.cli), '..') }));
    const env = { ...process.env, OB64_DIFF_ADMISSION_JOB: job, OB64_DIFF_ADMISSION_SOURCE_ROOT: SOURCE };
    for (const key of Object.keys(env)) if (key.startsWith('OB64_SCRATCH_')) delete env[key];
    const child = cp.spawnSync(process.execPath, ['--require', __filename, entry.cli, SYMBOL], { env, encoding: 'utf8', timeout: 15000, windowsHide: true, maxBuffer: 128 * 1024 });
    fs.writeFileSync(path.join(caseRoot, 'stdout.txt'), child.stdout || ''); fs.writeFileSync(path.join(caseRoot, 'stderr.txt'), child.stderr || '');
    assert.ifError(child.error); assert.strictEqual(child.status, 1, entry.mode);
    const events = JSON.parse(fs.readFileSync(path.join(caseRoot, 'events.json')));
    assert(!events.some(x => x.startsWith('FORBIDDEN')), entry.mode);
    assert.deepStrictEqual(fs.readdirSync(repository), before, 'no created repository artifact: ' + entry.mode);
    const reaches = entry.mode === 'fresh' || entry.mode.startsWith('capture');
    assert.strictEqual(events.includes('runtime-boundary'), reaches, entry.mode);
    if (entry.mode === 'fresh') {
      assert.match(child.stderr, /MOCK_COSTLY_BOUNDARY/);
      assert.deepStrictEqual(events, ['context', 'assertBuildOutputLocation', 'begin', 'baseline', 'assertBuildPathSeparation', 'runtime-boundary']);
    }
    const rejection = { 'preexisting-empty': /EEXIST/, 'preexisting-nonempty': /EEXIST/, 'racing-collision': /EEXIST/,
      'inside-output': /Phase 8 build output must remain outside/, 'inside-phase7': /Phase 7 input must remain outside/,
      'equal-phase7': /outputs must differ/, 'low-space': /free-space reserve at admission/,
      'same-symbol': /same-symbol active\/crashed reservation/ };
    if (rejection[entry.mode]) assert.match(child.stderr, rejection[entry.mode]);
    if (entry.mode === 'negative-control') assert.match(child.stderr, /output must be absent or empty/);
    if (entry.mode === 'inside-output') { assert(!events.includes('begin')); assert(!fs.existsSync(path.join(repository, 'work'))); }
    if (['low-space', 'preexisting-empty', 'preexisting-nonempty', 'racing-collision', 'same-symbol'].includes(entry.mode)) assert(!events.includes('baseline'), entry.mode);
    if (entry.mode.endsWith('baseline')) assert.match(child.stderr, /requires an existing reusable baseline/);
    if (entry.mode === 'preexisting-nonempty') assert.strictEqual(fs.readFileSync(path.join(output, 'owner.txt'), 'utf8'), 'preserve original');
    if (entry.mode === 'racing-collision') assert.strictEqual(fs.readFileSync(path.join(output, 'racer.txt'), 'utf8'), 'preserve racing owner');
    const meta = path.join(output, '.scratch-retention');
    if (fs.existsSync(path.join(meta, 'claim.json'))) {
      if (entry.mode === 'capture-release-error') { assert(events.includes('release-error')); assert(!fs.existsSync(path.join(meta, 'release.json'))); }
      else assert.strictEqual(JSON.parse(fs.readFileSync(path.join(meta, 'release.json'))).status, 'failed');
    }
    if (entry.mode.startsWith('capture')) {
      assert.match(child.stderr, /MOCK_AFTER_CAPTURE/);
      for (const file of ['authored.c', 'input.c']) assert.strictEqual(fs.readFileSync(path.join(meta, file), 'utf8'), 'int candidate(void) { return 1; }\n');
    }
    results.push({ mode: entry.mode, actualEof: child.status !== null, status: 'pass', events });
  }
  fs.writeFileSync(path.join(root, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ suite: 'diff-admission', cases: results.length, root, status: 'pass' }));
}
if (process.env.OB64_DIFF_ADMISSION_JOB) preload(); else if (require.main === module) test();
