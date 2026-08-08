#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  fail,
  readJson,
  sha256File,
  writeJson,
} = require('./lib/phase8_matching_c');

function usage() {
  console.log('Usage: node tools/compare_phase8_reproducibility.js --left <phase8-output> --right <phase8-output> [--report <json>]');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function compareArtifact(leftRoot, rightRoot, relative, label) {
  if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.replace(/\\/g, '/').startsWith('../')) {
    fail(`Phase 8 reproducibility ${label} path is malformed`);
  }
  const left = path.join(leftRoot, ...relative.replace(/\\/g, '/').split('/'));
  const right = path.join(rightRoot, ...relative.replace(/\\/g, '/').split('/'));
  if (!fs.existsSync(left) || !fs.existsSync(right)
      || fs.statSync(left).size !== fs.statSync(right).size
      || sha256File(left) !== sha256File(right)
      || !fs.readFileSync(left).equals(fs.readFileSync(right))) {
    fail(`Phase 8 reproducibility ${label} bytes differ: ${relative}`);
  }
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
  const leftBuild = readJson(leftBuildFile);
  const rightBuild = readJson(rightBuildFile);
  const leftVerification = readJson(leftVerificationFile);
  const rightVerification = readJson(rightVerificationFile);
  for (const valueToCheck of [leftBuild, rightBuild, leftVerification, rightVerification]) {
    if (valueToCheck.schemaVersion !== 2 || valueToCheck.status !== 'pass') fail('Phase 8 reproducibility input did not pass');
  }
  if (JSON.stringify(leftBuild) !== JSON.stringify(rightBuild)) fail('path-independent Phase 8 build reports differ');
  if (JSON.stringify(leftVerification) !== JSON.stringify(rightVerification)) fail('path-independent Phase 8 verification reports differ');
  if (sha256File(leftBuildFile) !== sha256File(rightBuildFile)) fail('Phase 8 build-report file SHA-256 drift');
  if (sha256File(leftVerificationFile) !== sha256File(rightVerificationFile)) fail('Phase 8 verification-report file SHA-256 drift');
  for (const relative of ['phase8.elf', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'phase8.readelf.txt', 'objects/manifest.json']) {
    compareArtifact(leftRoot, rightRoot, relative, 'output');
  }
  if (!Array.isArray(leftBuild.targetReplacements)) fail('Phase 8 reproducibility target records are missing');
  for (const target of leftBuild.targetReplacements) {
    for (const [field, label] of [
      ['cObject', 'object'],
      ['compilerAssembly', 'compiler assembly'],
      ['dialectAssembly', 'dialect assembly'],
      ['linkedAssembly', 'section-adjusted assembly'],
    ]) compareArtifact(leftRoot, rightRoot, target[field], `${target.symbol} ${label}`);
    compareArtifact(leftRoot, rightRoot, target.dialectProof && target.dialectProof.path, `${target.symbol} dialect proof`);
  }
  const result = {
    schemaVersion: 2,
    status: 'pass',
    reportsIdentical: true,
    buildReportSha256: sha256File(leftBuildFile),
    verificationReportSha256: sha256File(leftVerificationFile),
    outputs: leftBuild.verification.outputs,
    targets: leftBuild.verification.targets,
    asmDiffer: leftBuild.verification.asmDiffer,
  };
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 8 reproducibility comparison: PASS (${result.buildReportSha256})`);
}

main();
