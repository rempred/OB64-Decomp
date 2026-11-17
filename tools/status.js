#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const {
  CURRENT_STATE_PATH,
  currentVerificationState,
  prepareContext,
} = require('./lib/current_workflow');
const { ROOT, sha256Buffer, sha256File } = require('./lib/phase7_conventional');
const { summarizeAcceptedOwnership } = require('./lib/status_accounting');

function retainedSnapshot(statePath = CURRENT_STATE_PATH, configPath = path.join(ROOT, 'config/phase7/conventional-build.json')) {
  try {
    const stateBytes = fs.readFileSync(statePath);
    const state = JSON.parse(stateBytes);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const digest = /^[A-F0-9]{64}$/;
    if (state.schemaVersion !== 7 || state.status !== 'verified' || !state.verifiedAt
        || !digest.test(state.fingerprint) || !digest.test(state.baselineFingerprint)) {
      throw new Error('retained state lacks a supported verification record');
    }
    const reports = [
      [state.report, state.buildReport?.sha256, state.buildReport?.bytes],
      [state.freshCompilationReport, state.freshCompilationSha256],
      [state.verificationReport, state.verificationSha256],
    ].map(([file, expectedHash, expectedBytes]) => {
      if (!file || !digest.test(expectedHash)) throw new Error('retained report identity is missing');
      const bytes = fs.readFileSync(file);
      if (sha256Buffer(bytes) !== expectedHash
          || expectedBytes !== undefined && bytes.length !== expectedBytes) {
        throw new Error('retained report identity differs from its recorded hash');
      }
      return JSON.parse(bytes);
    });
    const [build, fresh, verified] = reports;
    if (build.schemaVersion !== 8 || build.status !== 'constructed'
        || fresh.schemaVersion !== 7 || fresh.status !== 'pass'
        || verified.schemaVersion !== 7 || verified.status !== 'pass'
        || verified.verification?.status !== 'pass'
        || fresh.inputFingerprint !== state.fingerprint
        || fresh.baselineFingerprint !== state.baselineFingerprint
        || !isDeepStrictEqual(fresh.buildReport, state.buildReport)
        || !isDeepStrictEqual(verified.buildReport, state.buildReport)
        || !Array.isArray(fresh.targets) || !Array.isArray(build.targetReplacements)
        || fresh.targets.length !== build.targetReplacements.length) {
      throw new Error('retained reports do not bind the same accepted build');
    }
    const replacements = new Map(build.targetReplacements.map(target => [target.symbol, target]));
    const counts = { PURE_C: 0, HYBRID_C: 0 };
    const seen = new Set();
    for (const target of fresh.targets) {
      const built = replacements.get(target.symbol);
      if (seen.has(target.symbol) || !Object.hasOwn(counts, target.sourceClass)
          || !built || built.sourceClass !== target.sourceClass
          || built.source !== target.source || built.sourceSha256 !== target.sourceSha256) {
        throw new Error('retained target census differs between reports');
      }
      seen.add(target.symbol);
      counts[target.sourceClass] += 1;
    }
    if (state.rom?.bytes !== config.rom.bytes || state.rom?.sha256 !== config.rom.sha256
        || fs.statSync(state.rom.path).size !== config.rom.bytes
        || sha256File(state.rom.path) !== config.rom.sha256) {
      throw new Error('retained ROM differs from the canonical Rev 0 identity');
    }
    if (!stateBytes.equals(fs.readFileSync(statePath))) throw new Error('retained state changed during inspection');
    return { status: 'pass', fingerprint: state.fingerprint, verifiedAt: state.verifiedAt, counts };
  } catch (error) {
    return { status: 'unavailable', reason: error.message };
  }
}

function main(args = process.argv.slice(2), services = {}) {
  const log = services.log || console.log;
  const printLine = (label, value) => log(`${label.padEnd(30, '.')} ${value}`);
  if (args.length > 1 || args.some(arg => !['--snapshot', '--help'].includes(arg))) {
    throw new Error('Usage: tools/status.ps1 [--snapshot]');
  }
  if (args.includes('--help')) {
    log('Usage: tools/status.ps1 [--snapshot]');
    log('Default checks current sources. --snapshot checks retained report and ROM hashes only.');
    return 0;
  }
  const snapshot = (services.retainedSnapshot || retainedSnapshot)();
  log('OB64 Decomp Status');
  printLine('Retained artifact hashes ', snapshot.status === 'pass' ? 'PASS' : `UNAVAILABLE: ${snapshot.reason}`);
  if (snapshot.status === 'pass') {
    printLine('Recorded acceptance ', `${snapshot.verifiedAt} / ${snapshot.fingerprint}`);
    printLine('Recorded PURE_C targets ', snapshot.counts.PURE_C);
    printLine('Recorded HYBRID_C targets ', snapshot.counts.HYBRID_C);
  }
  if (args.includes('--snapshot')) {
    printLine('Current sources ', 'NOT CHECKED (--snapshot)');
    return snapshot.status === 'pass' ? 0 : 1;
  }
  const context = (services.prepareContext || prepareContext)({ readOnly: true });
  const policy = context.sourcePolicy;
  const verification = (services.currentVerificationState || currentVerificationState)(context);
  const ownership = (services.summarizeAcceptedOwnership || summarizeAcceptedOwnership)(context.model, context.phase8.targets);

  printLine('Current sources ', verification.exact ? 'VERIFIED / EXACT ROM' : 'UNVERIFIED for these inputs');
  printLine('Exact PURE_C targets ', verification.exact ? `${policy.counts.PURE_C} targets / ${policy.bytes.PURE_C} bytes` : '0 targets / 0 bytes');
  printLine('Exact HYBRID_C targets ', verification.exact ? `${policy.counts.HYBRID_C} targets / ${policy.bytes.HYBRID_C} bytes` : '0 targets / 0 bytes');
  printLine('Assembly owners remaining ', `${ownership.assembly.owners} / ${ownership.assembly.bytes} bytes`);
  printLine('Other/data owners ', `${ownership.otherData.owners} / ${ownership.otherData.bytes} bytes`);
  printLine('UNKNOWN classifications ', policy.counts.UNKNOWN);
  printLine('Compilation producers ', new Set(context.phase8.targets.map(target => target.compilationGroup
    ? 'group:' + target.compilationGroup.id : 'target:' + target.symbol)).size);
  if (!verification.exact) printLine('Classified active targets ', `${context.phase8.targets.length} (run node tools/verify.js)`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`Status failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { main, retainedSnapshot };
