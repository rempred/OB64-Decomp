#!/usr/bin/env node
'use strict';

const fs = require('fs');
const textContract = require('./lib/text_contract');
const { loadCanonicalBaserom } = require('./lib/phase8_matching_c');
const path = require('path');
const {
  ROOT,
  fail,
  loadPhase8Model,
  readJson,
  sha256File,
  writeJson,
} = require('./lib/phase8_matching_c');
const {
  acceptedCompilationInputIdentity,
  confinedArtifactIdentity,
  verifyCompilationInputArtifact,
} = require('./lib/current_workflow');

function usage() {
  console.log('Usage: node tools/verify_shared_header_compatibility.js --old <accepted-output> --new <candidate-output> --old-state <state.json> --report <json>');
}

function value(argv, flag) {
  const index = argv.indexOf(flag);
  if (index < 0 || !argv[index + 1] || argv[index + 1].startsWith('--')) fail(`missing ${flag}`);
  return path.resolve(argv[index + 1]);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function artifact(root, relative, expectedSha256, label) {
  const result = confinedArtifactIdentity(root, relative, label);
  if (expectedSha256 && result.sha256 !== expectedSha256) fail(`${label} recorded identity drift`);
  return result;
}

function compareArtifact(oldRoot, newRoot, oldRecord, newRecord, field, hashField, label) {
  const oldArtifact = artifact(oldRoot, oldRecord[field], oldRecord[hashField], `old ${label}`);
  const newArtifact = artifact(newRoot, newRecord[field], newRecord[hashField], `new ${label}`);
  if (!fs.readFileSync(oldArtifact.file).equals(fs.readFileSync(newArtifact.file))) {
    fail(`${label} differs: ${oldRecord.symbol}`);
  }
  return { bytes: oldArtifact.bytes, sha256: oldArtifact.sha256 };
}

function targetOutcome(record) {
  const { sourceObjectEvidence: _sourceObjectEvidence, ...outcome } = record;
  return outcome;
}

function verifyTargetCompilationInput(root, target, sourcePolicyTarget) {
  const label = `new ${target && target.symbol ? target.symbol : 'target'} authenticated compilation input`;
  const expected = acceptedCompilationInputIdentity(target, sourcePolicyTarget, label);
  return verifyCompilationInputArtifact(root, target && target.compilationInput, expected, label);
}

function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    usage();
    return;
  }
  const oldRoot = value(argv, '--old');
  const newRoot = value(argv, '--new');
  const oldStateFile = value(argv, '--old-state');
  const reportFile = value(argv, '--report');
  const phase8 = loadPhase8Model();
  const canonicalRomSha256 = phase8.model.config.rom.sha256;
  const oldState = readJson(oldStateFile);
  const oldReport = readJson(path.join(oldRoot, 'build-report.json'));
  const newReport = readJson(path.join(newRoot, 'build-report.json'));
  const historical = argv.includes('--historical-v3-v4');
  const oldSchema = historical ? 3 : 5;
  const newSchema = historical ? 4 : 5;
  if (oldState.schemaVersion !== oldSchema || oldState.output !== oldRoot || !oldState.verifiedAt
      || oldState.rom?.sha256 !== canonicalRomSha256
      || path.resolve(oldState.report) !== path.join(oldRoot, 'build-report.json')) {
    fail('old accepted CURRENT state is not authenticated');
  }
  if (oldReport.schemaVersion !== oldSchema || oldReport.status !== 'pass'
      || oldReport.verification?.schemaVersion !== oldSchema || oldReport.verification.status !== 'pass') {
    fail('old accepted build report is not a passing schema-v3 CURRENT build');
  }
  if (newReport.schemaVersion !== newSchema || newReport.status !== 'pass'
      || newReport.verification?.schemaVersion !== newSchema || newReport.verification.status !== 'pass') {
    fail('new build report is not a passing authenticated-input build');
  }
  if (!sameJson(oldReport.compiler.compileFlags, newReport.compiler.compileFlags)
      || oldReport.compiler.sha256 !== newReport.compiler.sha256
      || !Array.isArray(oldReport.targetReplacements)
      || !Array.isArray(newReport.targetReplacements)
      || oldReport.targetReplacements.length !== phase8.targets.length
      || newReport.targetReplacements.length !== phase8.targets.length) {
    fail('header-free compiler or target census drift');
  }

  const outputFiles = [
    'phase8.elf',
    'phase8.map',
    'phase8.us_rev0.z64',
    'layout.json',
    'phase8.elf-report.json',
    'objects/manifest.json',
  ].map((relative) => {
    const oldArtifact = artifact(oldRoot, relative, null, `old ${relative}`);
    const newArtifact = artifact(newRoot, relative, null, `new ${relative}`);
    if (!fs.readFileSync(oldArtifact.file).equals(fs.readFileSync(newArtifact.file))) {
      fail(`header-free linked output differs: ${relative}`);
    }
    return { path: relative, bytes: oldArtifact.bytes, sha256: oldArtifact.sha256 };
  });
  const rom = outputFiles.find((record) => record.path === 'phase8.us_rev0.z64');
  if (!rom || rom.sha256 !== canonicalRomSha256
      || newReport.verification.outputs.rom.sha256 !== canonicalRomSha256) {
    fail('header-free complete ROM is not canonical');
  }

  const baserom = historical ? null : loadCanonicalBaserom(phase8);
  const oldTextContext = historical ? null : textContract.linkContext(oldRoot, baserom);
  const newTextContext = historical ? null : textContract.linkContext(newRoot, baserom);
  if (!historical) {
    for (const [field, file] of [['freshCompilationSha256', oldState.freshCompilationReport], ['verificationSha256', oldState.verificationReport]]) {
      if (!oldState[field] || oldState[field] !== sha256File(file) || readJson(file).schemaVersion !== 5 || readJson(file).status !== 'pass') fail('old verified state evidence drift');
    }
  }
  const targets = [];
  for (const target of phase8.targets) {
    const oldTarget = oldReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const newTarget = newReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const newPolicyMatches = Array.isArray(newReport.sourcePolicy?.targets)
      ? newReport.sourcePolicy.targets.filter((record) => record.symbol === target.symbol)
      : [];
    const oldOutcome = oldReport.verification.targets.find((record) => record.symbol === target.symbol);
    const newOutcome = newReport.verification.targets.find((record) => record.symbol === target.symbol);
    if (!oldTarget || !newTarget || !oldOutcome || !newOutcome
        || oldTarget.source !== target.source || newTarget.source !== target.source
        || oldTarget.sourceSha256 !== newTarget.sourceSha256
        || oldTarget.sourceClass !== newTarget.sourceClass
        || !sameJson(targetOutcome(oldOutcome), targetOutcome(newOutcome))) {
      fail(`header-free target provenance or linked outcome differs: ${target.symbol}`);
    }
    if (!historical) {
      textContract.validateRecords(oldTarget, textContract.recordsForTarget(target, oldRoot, oldTextContext), 'old header comparison');
      textContract.validateRecords(newTarget, textContract.recordsForTarget(target, newRoot, newTextContext), 'new header comparison');
      if (oldState.buildReportSha256 !== undefined && oldState.buildReportSha256 !== sha256File(path.join(oldRoot, 'build-report.json'))) fail('old state build identity drift');
    }
    const compilerAssembly = compareArtifact(
      oldRoot, newRoot, oldTarget, newTarget,
      'compilerAssembly', 'compilerAssemblySha256', `${target.symbol} compiler assembly`,
    );
    const linkedAssembly = compareArtifact(
      oldRoot, newRoot, oldTarget, newTarget,
      'linkedAssembly', 'linkedAssemblySha256', `${target.symbol} section-adjusted assembly`,
    );
    const sourceObject = compareArtifact(
      oldRoot, newRoot, oldTarget, newTarget,
      'sourceObject', 'sourceObjectSha256', `${target.symbol} source object`,
    );
    const finalObject = compareArtifact(
      oldRoot, newRoot, oldTarget, newTarget,
      'cObject', 'cObjectSha256', `${target.symbol} final object`,
    );
    if (Boolean(oldTarget.assemblerObject) !== Boolean(newTarget.assemblerObject)) {
      fail(`header-free assembler-object census differs: ${target.symbol}`);
    }
    const assemblerObject = oldTarget.assemblerObject
      ? compareArtifact(
        oldRoot, newRoot, oldTarget, newTarget,
        'assemblerObject', 'assemblerObjectSha256', `${target.symbol} assembler object`,
      )
      : null;
    if (newPolicyMatches.length !== 1) fail(`new source-policy target does not resolve uniquely: ${target.symbol}`);
    const compilationInput = verifyTargetCompilationInput(newRoot, newTarget, newPolicyMatches[0]);
    targets.push({
      symbol: target.symbol,
      source: target.source,
      sourceClass: newTarget.sourceClass,
      compilerAssembly,
      linkedAssembly,
      sourceObject,
      assemblerObject,
      finalObject,
      compilationInput: {
        path: newTarget.compilationInput.path,
        bytes: compilationInput.bytes,
        sha256: compilationInput.sha256,
      },
      targetOutcomeExact: true,
    });
  }

  const report = {
    schemaVersion: historical ? 1 : 2,
    mode: historical ? 'historical-v3-v4' : 'current-v5-v5',
    status: 'pass',
    kind: 'ob64-header-free-authenticated-compilation-input-compatibility',
    oldAccepted: {
      state: path.relative(ROOT, oldStateFile).replace(/\\/g, '/'),
      fingerprint: oldState.fingerprint,
      output: oldRoot,
      buildReportSha256: sha256File(path.join(oldRoot, 'build-report.json')),
    },
    newAuthenticatedInputBuild: {
      output: newRoot,
      buildReportSha256: sha256File(path.join(newRoot, 'build-report.json')),
      sourcePolicy: newReport.sourcePolicy,
    },
    counts: {
      targets: targets.length,
      pureC: targets.filter((record) => record.sourceClass === 'PURE_C').length,
      hybridC: targets.filter((record) => record.sourceClass === 'HYBRID_C').length,
      comparedLinkedOutputs: outputFiles.length,
    },
    invariants: {
      compilerIdentityAndFlagsExact: true,
      compilerAssemblyExactForEveryTarget: true,
      sectionAdjustedAssemblyExactForEveryTarget: true,
      sourceObjectExactForEveryTarget: true,
      finalObjectExactForEveryTarget: true,
      placementRelocationsAndTargetOutcomesExactForEveryTarget: true,
      linkedOutputsExact: true,
      completeRomExact: true,
    },
    rom,
    outputFiles,
    targets,
  };
  writeJson(reportFile, report);
  console.log(`Shared-header header-free compatibility: PASS (${targets.length} targets, ${rom.sha256})`);
  console.log(`Report: ${reportFile}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Shared-header compatibility failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { artifact, main, targetOutcome, verifyTargetCompilationInput };
