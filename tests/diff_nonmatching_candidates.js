#!/usr/bin/env node
'use strict';

// Explicit, heavier development-diff regression; not a full-ROM acceptance run.
// Substitute only one source in an isolated in-memory active model. Production
// C/configuration files are never edited, including on interruption or failure.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const cases = {
  unfinished: { symbol: 'func_001FFE80', id: '1d2ef51fa2', words: 4, bytes: 4 },
  short: { symbol: 'func_001FFE80', id: '9edc78cf1b', reject: /extent|shape|size/i },
  decoded: { symbol: 'func_00129268', id: '726821885f', words: 20, bytes: 20, decodedExact: true },
  differing: { symbol: 'func_00129268', id: '9a04de33e8', words: 27, bytes: 47, decodedExact: false, relocationsMatch: false },
  scenario: { symbol: 'func_00249A14', id: 'a715baaf13', inactive: true,
    reject: /undefined reference to [`']D_801D7C78'/, rejectionStage: 'link-phase8' },
};
const name = process.argv[2];
assert(cases[name] && process.argv.length === 3, 'Usage: node tests/diff_nonmatching_candidates.js <unfinished|short|decoded|differing|scenario>');
const item = cases[name];
const archive = `docs/archive/matching-c-candidates/2026-09-29-${item.symbol}-${item.id}.c`;
const observation = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/dossiers', `${item.symbol}-${item.id}.observation.json`)));
const bytes = fs.readFileSync(path.join(ROOT, archive));
assert.equal(hash(bytes), observation.authenticated.sourceSha256, 'preserved candidate identity changed');
fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const output = fs.mkdtempSync(path.join(ROOT, 'build/tests/diff-candidates-'));
const source = path.join(output, `${item.symbol}.c`);
fs.writeFileSync(source, bytes, { flag: 'wx' });
const relative = path.relative(ROOT, source).replace(/\\/g, '/');
const active = require('../tools/lib/active_targets');
const load = active.loadActiveTargetModelForContext;
assert(!require.cache[require.resolve('../tools/lib/current_workflow')], 'fixture must install its model override before workflow initialization');
let productionSource, productionHash;
const configPath = active.CONFIG_PATH;
const originalConfig = fs.readFileSync(configPath);
active.loadActiveTargetModelForContext = options => {
  let model;
  if (item.inactive) {
    // Test-only in-memory activation of an accepted ASM owner. The real loader
    // still resolves its entire structural contract; no production config is
    // written, and the CLI's missing-relocation diagnostic remains in force.
    const config = JSON.parse(originalConfig);
    assert(!config.targets.some(target => target.symbol === item.symbol), 'fixture owner is already active');
    config.targets.push({ symbol: item.symbol, source: relative });
    const read = fs.readFileSync;
    try {
      fs.readFileSync = function(file, ...args) {
        const result = read.call(this, file, ...args);
        if (typeof file !== 'string' || path.resolve(file) !== configPath) return result;
        const replacement = JSON.stringify(config);
        return typeof result === 'string' ? replacement : Buffer.from(replacement);
      };
      model = load(options);
    } finally { fs.readFileSync = read; }
  } else model = load(options);
  const target = model.targets.find(value => value.symbol === item.symbol);
  assert(target && !target.compilationGroup, 'fixture requires its accepted standalone owner');
  productionSource = path.join(ROOT, item.inactive ? target.originalAssembly : target.source);
  productionHash = hash(fs.readFileSync(productionSource));
  target.source = relative;
  target.sourceSha256 = hash(bytes);
  return model;
};
const reportPath = path.join(ROOT, 'build/diff', `${item.symbol}.json`);
const priorReportBytes = fs.existsSync(reportPath) ? fs.readFileSync(reportPath) : null;
const priorReport = priorReportBytes ? hash(priorReportBytes) : null;
if (priorReportBytes) fs.writeFileSync(path.join(output, 'prior-report.json'), priorReportBytes, { flag: 'wx' });
let result;
try {
  let report, error;
  try { report = require('../tools/diff').main(['--profile', item.symbol]); }
  catch (caught) { error = caught; }
  if (item.reject) {
    assert(error && item.reject.test(error.message), `expected candidate rejection, got ${error?.message || 'success'}`);
    assert.equal(fs.existsSync(reportPath) ? hash(fs.readFileSync(reportPath)) : null, priorReport, 'rejected candidate published a diff report');
    result = { status: 'pass', case: name, expectedRejection: error.message, profile: error.diffProfileFile };
    const profile = JSON.parse(fs.readFileSync(error.diffProfileFile));
    if (item.rejectionStage) {
      assert.equal(profile.stages.find(stage => stage.name === item.rejectionStage)?.failures, 1);
      assert(!profile.stages.some(stage => stage.name === 'write-layout'), 'unlinked candidate reached layout publication');
      const manifest = JSON.parse(fs.readFileSync(path.join(profile.metadata.output, 'objects/manifest.json')));
      const owners = manifest.linkedObjects.filter(record => record.targetSymbol === item.symbol && record.ownerKind === 'matching-c-target');
      assert.equal(owners.length, 1);
      assert.equal(owners[0].textContract.owners[0].bytes, 900);
      assert.equal(owners[0].objectEvidence.artifacts.compilationInput.sha256, observation.authored.expected.expandedSha256);
      result.compilationInputSha256 = owners[0].objectEvidence.artifacts.compilationInput.sha256;
      result.rejectionStage = item.rejectionStage;
    } else assert(!profile.stages.some(stage => ['link-phase8', 'write-layout'].includes(stage.name)), 'short owner reached linking');
  } else {
    if (error) throw error;
    assert.equal(report.sourceClass, 'PURE_C');
    assert.equal(report.compilationInput.sha256, observation.authored.expected.expandedSha256);
    assert.equal(report.comparison.exact, false);
    assert.equal(report.comparison.rawBytesExact, false);
    assert.equal(report.comparison.differingInstructionWordCount, item.words);
    assert.equal(report.comparison.differingByteCount, item.bytes);
    assert.equal(report.relocationContract.matches, item.relocationsMatch !== false);
    if (item.inactive) assert.equal(report.relocationContract.source, 'missing-diff-only');
    if (item.decodedExact !== undefined) assert.equal(report.comparison.asmDifferPairwiseExact, item.decodedExact);
    assert.equal(report.objectCache.requestedFresh, 1);
    assert.equal(report.objectCache.entries.find(entry => entry.symbol === item.symbol).status, 'requested-fresh');
    const profiles = fs.readdirSync(path.join(ROOT, 'build/warm-diff-profile'))
      .filter(file => file.startsWith(item.symbol + '-') && file.endsWith(`-${process.pid}.json`))
      .map(file => ({ file, profile: JSON.parse(fs.readFileSync(path.join(ROOT, 'build/warm-diff-profile', file))) }))
      .filter(value => value.profile.metadata.artifacts?.output === report.output);
    assert.equal(profiles.length, 1, 'fixture timing profile is ambiguous');
    assert.equal(profiles[0].profile.metadata.preprocessCache.requested, 1);
    result = { status: 'pass', case: name, sourceClass: report.sourceClass, comparison: report.comparison,
      relocationContractMatches: report.relocationContract.matches, objectCache: report.objectCache,
      profile: profiles[0].file, seconds: profiles[0].profile.totalMs / 1000 };
  }
} finally {
  active.loadActiveTargetModelForContext = load;
  if (priorReportBytes) fs.writeFileSync(reportPath, priorReportBytes);
  else if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);
  if (productionSource) assert.equal(hash(fs.readFileSync(productionSource)), productionHash, 'production source changed during fixture');
  assert(fs.readFileSync(configPath).equals(originalConfig), 'production target configuration changed during fixture');
}
result.archive = archive;
result.sourceSha256 = hash(bytes);
result.isolatedSource = relative;
result.acceptanceEligible = false;
result.scope = 'development-test';
fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, case: name, acceptanceEligible: false, result: path.join(output, 'result.json') }, null, 2));
