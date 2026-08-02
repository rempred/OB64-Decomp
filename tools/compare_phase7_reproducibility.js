#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  fail,
  readJson,
  sha256File,
  writeJson,
} = require('./lib/phase7_conventional');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function main() {
  const leftFile = value('--left');
  const rightFile = value('--right');
  const reportFile = process.argv.includes('--report') ? value('--report') : null;
  const left = readJson(leftFile);
  const right = readJson(rightFile);
  if (left.schemaVersion !== 1 || left.status !== 'pass' || right.schemaVersion !== 1 || right.status !== 'pass') fail('reproducibility inputs did not pass');
  const leftText = JSON.stringify(left);
  const rightText = JSON.stringify(right);
  if (leftText !== rightText) fail('path-independent build reports differ');
  const result = {
    schemaVersion: 1,
    status: 'pass',
    reportsIdentical: true,
    reportSha256: sha256File(leftFile),
    outputs: left.verification.outputs,
    objectManifest: left.objects.manifest,
    linker: left.linker,
    asmDiffer: left.verification.asmDiffer,
  };
  if (sha256File(rightFile) !== result.reportSha256) fail('build-report file SHA-256 drift');
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 7 reproducibility comparison: PASS (${result.reportSha256})`);
}

main();
