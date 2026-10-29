#!/usr/bin/env node
'use strict';

const fs = require('fs');
const textContract = require('./lib/text_contract');
const { loadPhase8Model, loadCanonicalBaserom } = require('./lib/phase8_matching_c');
const path = require('path');
const {
  fail,
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
  console.log('Usage: node tools/compare_phase8_reproducibility.js --left <phase8-output> --right <phase8-output> [--report <json>]');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function compareArtifact(leftRoot, rightRoot, relative, label) {
  const left = confinedArtifactIdentity(leftRoot, relative, `Phase 8 reproducibility left ${label}`);
  const right = confinedArtifactIdentity(rightRoot, relative, `Phase 8 reproducibility right ${label}`);
  if (left.bytes !== right.bytes || left.sha256 !== right.sha256
      || !fs.readFileSync(left.file).equals(fs.readFileSync(right.file))) {
    fail(`Phase 8 reproducibility ${label} bytes differ: ${relative}`);
  }
  return { left, right };
}

function compareTargetCompilationInput(leftRoot, rightRoot, target, sourcePolicyTarget) {
  const label = `Phase 8 reproducibility ${target && target.symbol ? target.symbol : 'target'} KMC compilation input`;
  const expected = acceptedCompilationInputIdentity(target, sourcePolicyTarget, label);
  const left = verifyCompilationInputArtifact(leftRoot, target && target.compilationInput, expected, `left ${label}`);
  const right = verifyCompilationInputArtifact(rightRoot, target && target.compilationInput, expected, `right ${label}`);
  if (!fs.readFileSync(left.file).equals(fs.readFileSync(right.file))) {
    fail(`${label} bytes differ: ${expected.path}`);
  }
  return { left, right };
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  const leftRoot = value('--left');
  const rightRoot = value('--right');
  const reportFile = process.argv.includes('--report') ? value('--report') : null;
  const leftBuildFile = path.join(leftRoot, 'build-report.json');
  const rightBuildFile = path.join(rightRoot, 'build-report.json');
  const leftVerificationFile = path.join(leftRoot, 'verification.json');
  const rightVerificationFile = path.join(rightRoot, 'verification.json');
  const model = loadPhase8Model();
  const leftBuild = textContract.readVerifiedBuildView(leftRoot, model);
  const rightBuild = textContract.readVerifiedBuildView(rightRoot, model);
  const leftVerification = readJson(leftVerificationFile);
  const rightVerification = readJson(rightVerificationFile);
  for (const build of [leftBuild, rightBuild]) if (!([5, 7].includes(build.schemaVersion) && build.status === 'pass'
    || build.schemaVersion === 8 && build.status === 'constructed')) fail('Phase 8 reproducibility input did not pass');
  for (const verified of [leftVerification, rightVerification]) if (![5, 6, 7].includes(verified.schemaVersion) || verified.status !== 'pass') fail('Phase 8 reproducibility verification did not pass');
  const baserom = loadCanonicalBaserom(model);
  for (const [root, build] of [[leftRoot, leftBuild], [rightRoot, rightBuild]]) {
    const linkContext = textContract.linkContext(root, baserom);
    if (build.targetReplacements?.length !== model.targets.length) fail('reproducibility target census drift');
    for (const target of model.targets) {
      const matches = build.targetReplacements.filter((record) => record.symbol === target.symbol);
      if (matches.length !== 1) fail('reproducibility target does not resolve uniquely');
      const representation = textContract.recordsForTarget(target, root, linkContext);
      if (build.schemaVersion >= 7) textContract.withSourceObjectProof(root, target, matches[0], proof => textContract.validateRecords(proof, representation, 'reproducibility'));
      else textContract.validateRecords(matches[0], representation, 'reproducibility');
    }
    textContract.finishLinkContext(linkContext);
  }
  if (JSON.stringify(leftBuild) !== JSON.stringify(rightBuild)) fail('path-independent Phase 8 build reports differ');
  if (JSON.stringify(leftVerification) !== JSON.stringify(rightVerification)) fail('path-independent Phase 8 verification reports differ');
  if (sha256File(leftBuildFile) !== sha256File(rightBuildFile)) fail('Phase 8 build-report file SHA-256 drift');
  if (sha256File(leftVerificationFile) !== sha256File(rightVerificationFile)) fail('Phase 8 verification-report file SHA-256 drift');
  for (const relative of ['phase8.elf', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'phase8.elf-report.json', 'objects/manifest.json']) {
    compareArtifact(leftRoot, rightRoot, relative, 'output');
  }
  if (!Array.isArray(leftBuild.targetReplacements)) fail('Phase 8 reproducibility target records are missing');
  for (const target of leftBuild.targetReplacements) {
    for (const [field, label] of [
      ['cObject', 'object'],
      ['sourceObject', 'source object'],
      ['compilerAssembly', 'compiler assembly'],
      ['linkedAssembly', 'section-adjusted assembly'],
    ]) compareArtifact(leftRoot, rightRoot, target[field], `${target.symbol} ${label}`);
    if (target.assemblerObject) compareArtifact(leftRoot, rightRoot, target.assemblerObject, `${target.symbol} unsplit assembler object`);
    const policyMatches = Array.isArray(leftBuild.sourcePolicy?.targets)
      ? leftBuild.sourcePolicy.targets.filter((record) => record.symbol === target.symbol)
      : [];
    if (policyMatches.length !== 1) fail(`Phase 8 reproducibility source-policy target does not resolve uniquely: ${target.symbol}`);
    compareTargetCompilationInput(leftRoot, rightRoot, target, policyMatches[0]);
    compareArtifact(leftRoot, rightRoot, target.sourceObjectProof && target.sourceObjectProof.path, `${target.symbol} source-to-object proof`);
  }
  const result = {
    schemaVersion: 5,
    status: 'pass',
    reportsIdentical: true,
    buildReportSha256: sha256File(leftBuildFile),
    verificationReportSha256: sha256File(leftVerificationFile),
    outputs: leftBuild.verification.outputs,
    targets: leftBuild.verification.targets,
    decodedDiagnostics: leftBuild.verification.decodedDiagnostics || { status: 'legacy-recorded', targets: leftBuild.verification.asmDiffer },
  };
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 8 reproducibility comparison: PASS (${result.buildReportSha256})`);
}

if (require.main === module) main();

module.exports = { compareArtifact, compareTargetCompilationInput, main };
