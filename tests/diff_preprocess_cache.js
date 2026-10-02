#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const policy = require('../tools/lib/source_policy');
const { createDiffPreprocessCache } = require('../tools/lib/diff_preprocess_cache');
const ROOT = policy.ROOT, hash = policy.sha256Buffer;
fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/diff-preprocess-'));
const sourceRoot = path.join(root, 'src'), includeRoot = path.join(root, 'include');
fs.mkdirSync(sourceRoot); fs.mkdirSync(includeRoot);
const source = path.join(sourceRoot, 'unit.c'), header = path.join(includeRoot, 'unit.h');
const tool = path.join(root, 'cpp.exe'), engine = path.join(root, 'cc1.exe'), config = path.join(root, 'policy.json'), manifest = path.join(root, 'compiler.json');
const implementation = path.join(root, 'implementation.js');
fs.writeFileSync(source, 'int unit(int x) { return x + 3; }\n'); fs.writeFileSync(header, 'typedef int word;\n');
fs.writeFileSync(tool, 'fixture cpp'); fs.writeFileSync(engine, 'fixture cc1'); fs.writeFileSync(manifest, '{}'); fs.writeFileSync(implementation, 'fixture implementation');
fs.writeFileSync(config, JSON.stringify({ matchingCompiler: { manifest: path.relative(ROOT, manifest) } }));
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
const identity = file => ({ path: relative(file), bytes: fs.statSync(file).size, sha256: policy.sha256File(file) });
function preprocessor() { return { path: tool, sha256: policy.sha256File(tool), version: 'fixture',
  executables: [{ ...identity(tool), role: 'driver', version: 'fixture' }, { ...identity(engine), role: 'engine' }],
  flags: ['-P', '-undef', '-nostdinc'], includeDirectories: [includeRoot], dependencyMode: 'authenticated-depfile',
  dependencyRoot: ROOT, dependencyTarget: 'ob64-compilation-input', configIdentity: identity(config),
  matchingCompiler: { manifestSha256: policy.sha256File(manifest), executableSha256: 'A'.repeat(64), preprocessingMode: 'authenticated-external-companion' } }; }
let calls = 0, environment = { PATH: 'fixture', PRIVATE_VALUE: 'must-not-be-recorded' };
function fresh(file, pp, extra) {
  calls++;
  const text = fs.readFileSync(file, 'utf8'), deps = text.includes('#include') ? [file, header] : [file];
  const dependencies = policy.dependencyIdentities(deps, file), bytes = Buffer.from('CPP:' + text + (deps.length > 1 ? fs.readFileSync(header, 'utf8') : ''));
  const includes = [...new Set([path.dirname(file), ...pp.includeDirectories, ...extra].map(relative))];
  return { ok: true, bytes, text: bytes.toString(), stderr: '', args: [...pp.flags, '-MD', '-MF', path.join(root, 'unused.d'), '-MT', pp.dependencyTarget,
    ...includes.flatMap(dir => ['-I', dir]), relative(file)], source: dependencies.find(v => v.path === relative(file)), dependencies };
}
const cacheRoot = path.join(root, 'cache');
const factory = (extra = {}) => createDiffPreprocessCache({ cacheRoot, requestedSources: [], preprocessSource: fresh,
  resolvePreprocessor: preprocessor, getEnvironment: () => environment, implementationFiles: [implementation], ...extra });
function run(extra = {}) { const cache = factory(extra), result = cache.preprocess(source, preprocessor(), []); cache.finish(); return { result, stats: cache.stats }; }
const cold = run(), warm = run(); assert.equal(cold.stats.misses, 1); assert.equal(warm.stats.hits, 1);
const originalEntryName = fs.readdirSync(cacheRoot).find(name => /^[A-F0-9]{64}$/.test(name));
assert.deepEqual(warm.result, cold.result); assert.equal(calls, 1);
assert.equal(run({ requestedSources: [relative(source)] }).stats.requested, 1);
assert.equal(run({ requestedSources: [source] }).stats.hits, 0);
const original = fs.readFileSync(source), checks = [];
for (const [name, file] of [['source', source], ['tool', tool], ['engine', engine], ['config', config], ['manifest', manifest], ['implementation', implementation]]) {
  const bytes = fs.readFileSync(file); fs.appendFileSync(file, name === 'config' || name === 'manifest' ? ' ' : ' changed');
  assert.equal(run().stats.hits, 0, name + ' change reused bytes'); fs.writeFileSync(file, bytes); checks.push(name + ' invalidates');
}
environment = { ...environment, PRIVATE_VALUE: 'different-secret' }; assert.equal(run().stats.hits, 0); environment.PRIVATE_VALUE = 'must-not-be-recorded'; checks.push('environment invalidates');
const entry = path.join(cacheRoot, originalEntryName);
assert(entry);
const metadataFile = path.join(entry, 'metadata.json'), bytesFile = path.join(entry, 'bytes.bin');
const metadata = fs.readFileSync(metadataFile), cachedBytes = fs.readFileSync(bytesFile);
assert(!metadata.includes(Buffer.from('must-not-be-recorded'))); assert(!metadata.includes(Buffer.from('PRIVATE_VALUE')));
for (const [name, mutate] of [
  ['bytes', () => fs.appendFileSync(bytesFile, 'bad')],
  ['metadata extra', () => { const m = JSON.parse(metadata); m.class = 'PURE_C'; fs.writeFileSync(metadataFile, JSON.stringify(m) + '\n'); }],
  ['metadata key', () => { const m = JSON.parse(metadata); m.key.source.bytes++; fs.writeFileSync(metadataFile, JSON.stringify(m) + '\n'); }],
  ['metadata dependencies', () => { const m = JSON.parse(metadata); m.dependencies = []; fs.writeFileSync(metadataFile, JSON.stringify(m) + '\n'); }],
  ['file census', () => fs.writeFileSync(path.join(entry, 'unknown'), 'unknown')],
]) {
  mutate(); const value = run(); assert.equal(value.stats.hits, 0); assert.equal(value.stats.invalid, 1); assert.equal(value.stats.publishSkipped, 1); assert(value.result.bytes.equals(cold.result.bytes));
  const again = run(); assert.equal(again.stats.invalid, 1); assert.equal(again.stats.publishSkipped, 1);
  fs.writeFileSync(metadataFile, metadata); fs.writeFileSync(bytesFile, cachedBytes);
  if (fs.existsSync(path.join(entry, 'unknown'))) fs.unlinkSync(path.join(entry, 'unknown'));
  checks.push(name + ' falls back');
}
for (const [name, mutate, restore] of [
  ['source', () => fs.appendFileSync(source, ' changed'), () => fs.writeFileSync(source, original)],
  ['environment', () => { environment.NEW_VALUE = 'changed'; }, () => { delete environment.NEW_VALUE; }],
  ['tool', () => fs.appendFileSync(tool, 'changed'), () => fs.writeFileSync(tool, 'fixture cpp')],
  ['implementation', () => fs.appendFileSync(implementation, 'changed'), () => fs.writeFileSync(implementation, 'fixture implementation')],
]) { const cache = factory(); assert.equal(cache.preprocess(source, preprocessor(), []).ok, true); mutate(); assert.throws(() => cache.finish(), /drift/); restore(); checks.push(name + ' finish drift'); }
for (const spelling of ['#include HEADER\nint x;', 'int x = __COUNTER__;', 'int x;\\\n', 'int x;\\ \n', 'int x;??=', 'int x;%:', 'int x;\u00e9', 'int x;\x01', '_Pragma("once")', 'int \\u005fhidden;', 'int \\U0000005fhidden;']) {
  fs.writeFileSync(source, spelling); const before = calls; const a = run(), b = run(); assert.equal(calls, before + 2); assert.equal(a.stats.ineligible, 1); assert.equal(b.stats.hits, 0);
}
fs.writeFileSync(source, '#include "unit.h"\nint x;');
let a = run(); fs.appendFileSync(header, 'typedef int another;\n'); let b = run(); assert(!a.result.bytes.equals(b.result.bytes)); assert.equal(b.stats.hits, 0);
const cache = factory(); cache.preprocess(source, preprocessor(), []); fs.appendFileSync(header, 'changed'); assert.throws(() => cache.finish(), /drift/); checks.push('fresh header dependency finish drift');
fs.writeFileSync(source, original);
const shadow = path.join(sourceRoot, 'unit.h'); fs.writeFileSync(shadow, 'shadow'); assert.equal(run().stats.hits, 1); fs.unlinkSync(shadow); // Tier A has no include probes.
let symlink = 'unavailable';
const linkedCache = path.join(root, 'linked-cache');
try { fs.symlinkSync(cacheRoot, linkedCache, 'junction'); const value = run({ cacheRoot: linkedCache }); assert.equal(value.stats.hits, 0); symlink = 'rejected'; }
catch (error) { if (!['EPERM', 'EACCES'].includes(error.code)) throw error; }
finally { if (fs.existsSync(linkedCache)) fs.unlinkSync(linkedCache); }
// Default policy still calls its fresh child process path; supplying a warm
// provider changes neither classification nor the exact compilation input.
const childProcess = require('child_process'), spawn = childProcess.spawnSync;
let freshChildren = 0;
const provider = factory(), pp = preprocessor();
try {
  childProcess.spawnSync = (file, args) => {
    assert.equal(file, pp.path); freshChildren++;
    fs.writeFileSync(args[args.indexOf('-MF') + 1], pp.dependencyTarget + ': ' + relative(source) + '\n');
    return { status: 0, stdout: cold.result.bytes, stderr: Buffer.alloc(0) };
  };
  const defaultPolicy = policy.classifySource(relative(source), { preprocessor: pp });
  const warmPolicy = policy.classifySource(relative(source), { preprocessor: pp, preprocess: provider.preprocess });
  assert.equal(freshChildren, 1); assert.equal(provider.stats.hits, 1);
  assert.equal(defaultPolicy.class, 'PURE_C'); assert.equal(warmPolicy.digest, defaultPolicy.digest);
  assert(policy.compilationInputBytes(defaultPolicy).equals(policy.compilationInputBytes(warmPolicy)));
  const neverUsedRoot = path.join(root, 'default-must-not-create-cache');
  const neverUsed = factory({ cacheRoot: neverUsedRoot });
  const targets = [{ symbol: 'unit', source: relative(source), bytes: 4 }];
  const firstDefault = policy.classifyTargetSources(targets, { preprocessor: pp });
  const secondDefault = policy.classifyTargetSources(targets, { preprocessor: pp });
  assert.equal(freshChildren, 3); assert.equal(firstDefault.targets[0].digest, secondDefault.targets[0].digest);
  assert.equal(neverUsed.stats.hits, 0); assert.equal(fs.existsSync(neverUsedRoot), false); neverUsed.finish();
  provider.finish();
} finally { childProcess.spawnSync = spawn; }
const wrongDriver = factory(), wrongPP = { ...preprocessor(), path: engine };
wrongDriver.preprocess(source, wrongPP, []); assert.throws(() => wrongDriver.finish(), /identity differs/);
checks.push('default fresh and warm classification/input equivalence', 'driver path mismatch fails finish');
for (const flags of [[], ['-P'], ['-P', '-undef'], ['-undef', '-P', '-nostdinc'], ['-P', '-undef', '-nostdinc', '-P']]) {
  const pp = { ...preprocessor(), flags }, subset = factory({ resolvePreprocessor: () => pp });
  subset.preprocess(source, pp, []); assert.equal(subset.stats.hits, 0); assert.equal(subset.stats.firstIneligibleReason, 'flags'); subset.finish();
}
checks.push('exact ordered flag census');
const stages = [], profiled = factory();
profiled.preprocess(source, preprocessor(), [], { profile: { measure(name, callback) { stages.push(name); return callback(); } } });
profiled.finish(); assert(stages.includes('diff-preprocess-cache.input')); assert(stages.includes('diff-preprocess-cache.read'));
const malformed = factory({ cacheRoot: path.join(root, 'unpublishable'), preprocessSource: (...args) => ({ ...fresh(...args), args: [] }) });
malformed.preprocess(source, preprocessor(), []); assert.equal(malformed.stats.unpublishable, 1); malformed.finish();
// Literal include closure overapproximates inactive branches and follows quote
// header-directory search before the configured -I roots.
const unused = path.join(includeRoot, 'inactive.h'); fs.writeFileSync(unused, 'typedef int inactive;\n');
fs.writeFileSync(header, '#ifndef UNIT_H\n#define UNIT_H\ntypedef int word;\n#endif\n');
fs.writeFileSync(source, '#define ENABLE 1\n#if ENABLE\n#include "unit.h"\n#endif\n#if 0\n#include <inactive.h>\n#endif\nint x;\n');
const bCold = run(), bWarm = run(); assert.equal(bCold.stats.misses, 1); assert.equal(bWarm.stats.hits, 1); assert.deepEqual(bCold.result, bWarm.result);
const bProvider = factory();
try {
  childProcess.spawnSync = (file, args) => {
    assert.equal(file, pp.path);
    fs.writeFileSync(args[args.indexOf('-MF') + 1], pp.dependencyTarget + ': ' + bCold.result.dependencies.map(v => v.path).join(' ') + '\n');
    return { status: 0, stdout: bCold.result.bytes, stderr: Buffer.alloc(0) };
  };
  const a = policy.classifySource(relative(source), { preprocessor: pp });
  const b = policy.classifySource(relative(source), { preprocessor: pp, preprocess: bProvider.preprocess });
  assert.equal(bProvider.stats.hits, 1); assert.equal(a.digest, b.digest); assert(policy.compilationInputBytes(a).equals(policy.compilationInputBytes(b))); bProvider.finish();
} finally { childProcess.spawnSync = spawn; }
fs.appendFileSync(unused, 'typedef int another_inactive;\n'); assert.equal(run().stats.hits, 0);
fs.unlinkSync(unused); const missingInactive = run(); assert.equal(missingInactive.stats.firstIneligibleReason, 'unresolved-include');
fs.writeFileSync(unused, 'typedef int inactive;\n');
fs.writeFileSync(shadow, 'typedef int shadow;\n'); assert.equal(run().stats.hits, 0); fs.unlinkSync(shadow);
const inventoryDrift = factory(); inventoryDrift.preprocess(source, preprocessor(), []);
fs.writeFileSync(path.join(includeRoot, 'new-header.h'), 'new'); assert.throws(() => inventoryDrift.finish(), /inventory drift/); fs.unlinkSync(path.join(includeRoot, 'new-header.h'));
const removeDrift = factory(); removeDrift.preprocess(source, preprocessor(), []); const headerBytes = fs.readFileSync(header);
fs.unlinkSync(header); assert.throws(() => removeDrift.finish()); fs.writeFileSync(header, headerBytes);
const inactiveDrift = factory(); inactiveDrift.preprocess(source, preprocessor(), []); fs.appendFileSync(unused, 'changed'); assert.throws(() => inactiveDrift.finish(), /drift/);
fs.writeFileSync(header, '#ifndef UNIT_H\n#define UNIT_H\n#include "inactive.h"\n#endif\n');
fs.writeFileSync(unused, '#ifndef OTHER_H\n#define OTHER_H\n#include "unit.h"\n#endif\n');
assert.equal(run().stats.misses, 1); assert.equal(run().stats.hits, 1); // guarded include cycle has finite closure.
for (const directive of ['include HEADER', 'include "../escape.h"', 'include "/absolute.h"', 'include <unit /* comment */ .h>',
  'include_next "unit.h"', 'pragma once', 'line 2', 'import "unit.h"', 'warning ignored', 'define STR(x) #x', 'define JOIN(a,b) a##b', 'if __has_future_probe(x)']) {
  fs.writeFileSync(source, '#' + directive + '\nint x;'); const value = run(); assert.equal(value.stats.hits, 0); assert.equal(value.stats.ineligible, 1);
}
fs.writeFileSync(source, '#include "unit.h"\nint x;'); environment.CPATH = includeRoot;
assert.equal(run().stats.firstIneligibleReason, 'include-environment'); delete environment.CPATH;
let treeSymlink = 'unavailable'; const junction = path.join(includeRoot, 'linked');
try { fs.symlinkSync(sourceRoot, junction, 'junction'); const value = run(); assert.equal(value.stats.hits, 0); assert.equal(value.stats.firstIneligibleReason, 'include-tree-node'); treeSymlink = 'rejected'; }
catch (error) { if (!['EPERM', 'EACCES'].includes(error.code)) throw error; }
finally { if (fs.existsSync(junction)) fs.unlinkSync(junction); }
checks.push('Tier B headers/conditionals/inactive closure/shadow/inventory/cycles and unsupported directives');
function fixedDependencies(deps) {
  return (file, pp, extra) => {
    const base = fresh(file, pp, extra), dependencies = policy.dependencyIdentities([file, ...deps], file);
    const bytes = Buffer.concat(deps.map(dep => fs.readFileSync(dep)));
    return { ...base, dependencies, bytes, text: bytes.toString('utf8') };
  };
}
fs.writeFileSync(shadow, 'typedef int quote_selected;\n');
// The source directory is explicitly -I even for angle includes.
for (const [style, spelling, selected] of [['quote', '"unit.h"', shadow], ['angle', '<unit.h>', shadow]]) {
  fs.writeFileSync(source, '#include ' + spelling + '\nint x;');
  const extra = { cacheRoot: path.join(root, 'search-' + style), preprocessSource: fixedDependencies([selected]) };
  const first = run(extra); assert.equal(first.stats.published, 1, style + ' ' + JSON.stringify(first.stats)); assert.equal(run(extra).stats.hits, 1);
}
fs.unlinkSync(shadow);
const nested = path.join(includeRoot, 'nested'); fs.mkdirSync(nested);
const outer = path.join(nested, 'outer.h'), leaf = path.join(nested, 'leaf.h');
fs.writeFileSync(outer, '#include "leaf.h"\n'); fs.writeFileSync(leaf, 'typedef int nested_selected;\n');
fs.writeFileSync(path.join(includeRoot, 'leaf.h'), 'typedef int not_selected;\n');
fs.writeFileSync(source, '#include <nested/outer.h>\nint x;');
const nestedOptions = { cacheRoot: path.join(root, 'search-nested'), preprocessSource: fixedDependencies([outer, leaf]) };
assert.equal(run(nestedOptions).stats.published, 1); assert.equal(run(nestedOptions).stats.hits, 1);
const sourceLeaf = path.join(sourceRoot, 'leaf.h'); fs.writeFileSync(sourceLeaf, 'typedef int source_I_selected;\n');
fs.writeFileSync(outer, '#include <leaf.h>\n');
const nestedAngleOptions = { cacheRoot: path.join(root, 'search-nested-angle'), preprocessSource: fixedDependencies([outer, sourceLeaf]) };
assert.equal(run(nestedAngleOptions).stats.published, 1); assert.equal(run(nestedAngleOptions).stats.hits, 1);
fs.writeFileSync(outer, '#include "leaf.h"\n');
const lateJunction = factory(nestedOptions); lateJunction.preprocess(source, preprocessor(), []);
try { fs.symlinkSync(sourceRoot, junction, 'junction'); assert.throws(() => lateJunction.finish(), /include-tree-node/); }
catch (error) { if (!['EPERM', 'EACCES'].includes(error.code)) throw error; }
finally { if (fs.existsSync(junction)) fs.unlinkSync(junction); }
checks.push('quote versus angle and nested-header search precedence', 'post-use include subtree junction');
fs.writeFileSync(source, original);
for (const different of [false, true]) {
  const raceRoot = path.join(root, 'race-' + different), rename = fs.renameSync;
  try {
    fs.renameSync = (stage, destination) => {
      assert.equal(path.dirname(stage), raceRoot); fs.mkdirSync(destination);
      const m = JSON.parse(fs.readFileSync(path.join(stage, 'metadata.json')));
      const bytes = different ? Buffer.from('different winner bytes') : fs.readFileSync(path.join(stage, 'bytes.bin'));
      m.output = { bytes: bytes.length, sha256: hash(bytes) };
      fs.writeFileSync(path.join(destination, 'metadata.json'), JSON.stringify(m) + '\n');
      fs.writeFileSync(path.join(destination, 'bytes.bin'), bytes);
      throw Object.assign(new Error('race winner'), { code: 'EEXIST' });
    };
    const value = run({ cacheRoot: raceRoot }); assert(value.result.bytes.equals(cold.result.bytes));
    assert.equal(value.stats.writeFailures, different ? 1 : 0);
  } finally { fs.renameSync = rename; }
}
checks.push('atomic same-key winner byte equality; differing winner never substitutes for fresh result');
console.log(JSON.stringify({ status: 'pass', tiers: ['A', 'B'], checks, unsupportedFreshCases: 11, symlink, treeSymlink, output: root }, null, 2));
