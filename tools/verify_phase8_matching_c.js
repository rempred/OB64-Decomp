#!/usr/bin/env node
'use strict';

const fs = require('fs');
const textContract = require('./lib/text_contract');
const path = require('path');
const { withVerificationProfile, measure } = require('./lib/verification_profile');
const {
  fail,
  loadPhase8Model,
  validateRecordedPhase8Build,
  verifyCompiler,
  verifyPhase8Output,
  verifyRuntimeTools,
} = require('./lib/phase8_matching_c');

function usage() {
  console.log('Usage: node tools/verify_phase8_matching_c.js --output <phase8-dir> --compiler <accepted-cc1.exe> --splat-python <python.exe> --splat-split <split.py> --asm-differ <checkout> [--powershell-runtime-root <pinned-windows-runtime>] [--report <json>] [--profile]');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  return withVerificationProfile(process.argv.includes('--profile'), 'verify-phase8', runVerification);
}

function runVerification(profile) {
  const options = {
    output: value('--output'),
    compiler: value('--compiler'),
    powershellRuntimeRoot: process.argv.includes('--powershell-runtime-root') ? value('--powershell-runtime-root') : null,
    splatPython: value('--splat-python'),
    splatSplit: value('--splat-split'),
    asmDifferRoot: value('--asm-differ'),
  };
  const reportFile = process.argv.includes('--report') ? value('--report') : null;
  const buildReportFile = path.join(options.output, 'build-report.json');
  if (!fs.existsSync(buildReportFile)) fail(`build report is missing: ${buildReportFile}`);
  const { report: buildReport, identity: buildReportIdentity } = textContract.readCompactReport(options.output);
  const { outputSeal } = require('./lib/current_workflow');
  const initialOutputs = measure(profile, 'verify-initial-output-seal', () => outputSeal(options.output));
  const phase8 = measure(profile, 'load-target-model', () => loadPhase8Model());
  const runtime = measure(profile, 'authenticate-runtime', () => verifyRuntimeTools(phase8.model, options));
  const compiler = measure(profile, 'authenticate-compiler', () => verifyCompiler(phase8, options.compiler));
  const verification = measure(profile, 'verify-output', () => verifyPhase8Output(phase8, {
    profile,
    output: options.output,
    asmDifferRoot: options.asmDifferRoot,
    splatPython: options.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path,
    objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path,
  }));
  measure(profile, 'validate-recorded-build', () => validateRecordedPhase8Build(phase8, {
    profile,
    output: options.output,
    buildReport,
    verification,
    compilerSha256: compiler.sha256,
    compiler,
    runtime,
  }));
  if (!textContract.same(textContract.readCompactReport(options.output).identity, buildReportIdentity)) fail('build report changed during verification');
  if (!textContract.same(initialOutputs, measure(profile, 'verify-final-output-seal', () => outputSeal(options.output)))) fail('output changed during verification');
  const result = { schemaVersion: 7, status: 'pass', output: '.', buildReport: buildReportIdentity, verification };
  if (reportFile) textContract.publishCompactReport(reportFile, result);
  console.log(`Verification report SHA-256: ${require('./lib/phase7_conventional').sha256Buffer(Buffer.from(JSON.stringify(result, null, 2) + '\n'))}`);
  console.log(`Phase 8 matching C verification: PASS (${verification.outputs.rom.sha256})`);
}

main();
