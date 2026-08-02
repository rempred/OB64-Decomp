#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  fail,
  loadAcceptedModel,
  readJson,
  verifyOutput,
  verifyRuntimeTools,
  writeJson,
} = require('./lib/phase7_conventional');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function main() {
  const options = {
    output: value('--output'),
    splatPython: value('--splat-python'),
    splatSplit: value('--splat-split'),
    asmDifferRoot: value('--asm-differ'),
  };
  const reportFile = process.argv.includes('--report') ? value('--report') : null;
  const buildReportFile = path.join(options.output, 'build-report.json');
  if (!fs.existsSync(buildReportFile)) fail(`build report is missing: ${buildReportFile}`);
  const model = loadAcceptedModel();
  const runtime = verifyRuntimeTools(model, options);
  const verification = verifyOutput(model, {
    ...options,
    objdump: runtime.tools['mips64-elf-objdump.exe'].path,
  });
  const buildReport = readJson(buildReportFile);
  if (buildReport.schemaVersion !== 1 || buildReport.status !== 'pass') fail('recorded build report did not pass');
  for (const name of ['elf', 'map', 'rom', 'layout']) {
    if (buildReport.verification.outputs[name].sha256 !== verification.outputs[name].sha256) fail(`recorded ${name} identity drift`);
  }
  if (buildReport.verification.outputs.codeRegionSha256 !== verification.outputs.codeRegionSha256) fail('recorded code-region identity drift');
  const result = {
    schemaVersion: 1,
    status: 'pass',
    output: '.',
    verification,
  };
  if (reportFile) writeJson(reportFile, result);
  console.log(`Phase 7 conventional verification: PASS (${verification.outputs.rom.sha256})`);
}

main();
