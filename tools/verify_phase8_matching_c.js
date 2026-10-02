#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { withVerificationProfile, measure } = require('./lib/verification_profile');
const {
  fail,
  loadPhase8Model,
  readJson,
  validateRecordedPhase8Build,
  verifyCompiler,
  verifyPhase8Output,
  verifyRuntimeTools,
  writeJson,
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
  const buildReport = readJson(buildReportFile);
  measure(profile, 'validate-recorded-build', () => validateRecordedPhase8Build(phase8, {
    output: options.output,
    buildReport,
    verification,
    compilerSha256: compiler.sha256,
  }));
  const result = { schemaVersion: 5, status: 'pass', output: '.', verification };
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 8 matching C verification: PASS (${verification.outputs.rom.sha256})`);
}

main();
