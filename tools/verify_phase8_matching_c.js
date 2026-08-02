#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  fail,
  loadPhase8Model,
  readJson,
  verifyCompiler,
  verifyPhase8Output,
  verifyRuntimeTools,
  writeJson,
} = require('./lib/phase8_matching_c');

function usage() {
  console.log('Usage: node tools/verify_phase8_matching_c.js --output <phase8-dir> --compiler <accepted-cc1.exe> --splat-python <python.exe> --splat-split <split.py> --asm-differ <checkout> [--report <json>]');
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
  const options = {
    output: value('--output'),
    compiler: value('--compiler'),
    splatPython: value('--splat-python'),
    splatSplit: value('--splat-split'),
    asmDifferRoot: value('--asm-differ'),
  };
  const reportFile = process.argv.includes('--report') ? value('--report') : null;
  const buildReportFile = path.join(options.output, 'build-report.json');
  if (!fs.existsSync(buildReportFile)) fail(`build report is missing: ${buildReportFile}`);
  const phase8 = loadPhase8Model();
  const runtime = verifyRuntimeTools(phase8.model, options);
  const compiler = verifyCompiler(phase8, options.compiler);
  const verification = verifyPhase8Output(phase8, {
    output: options.output,
    asmDifferRoot: options.asmDifferRoot,
    splatPython: options.splatPython,
    objdump: runtime.tools['mips64-elf-objdump.exe'].path,
  });
  const buildReport = readJson(buildReportFile);
  if (buildReport.schemaVersion !== 1 || buildReport.status !== 'pass') fail('recorded Phase 8 build report did not pass');
  if (buildReport.compiler.sha256 !== compiler.sha256) fail('recorded KMC compiler identity drift');
  for (const name of ['elf', 'map', 'rom', 'layout', 'readelf', 'objectManifest']) {
    if (buildReport.verification.outputs[name].sha256 !== verification.outputs[name].sha256) fail(`recorded Phase 8 ${name} identity drift`);
  }
  if (buildReport.verification.outputs.codeRegionSha256 !== verification.outputs.codeRegionSha256) fail('recorded Phase 8 code-region identity drift');
  if (JSON.stringify(buildReport.verification.target) !== JSON.stringify(verification.target)) fail('recorded Phase 8 target proof drift');
  if (JSON.stringify(buildReport.verification.asmDiffer) !== JSON.stringify(verification.asmDiffer)) fail('recorded Phase 8 asm-differ proof drift');
  const result = { schemaVersion: 1, status: 'pass', output: '.', verification };
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 8 matching C verification: PASS (${verification.outputs.rom.sha256})`);
}

main();
