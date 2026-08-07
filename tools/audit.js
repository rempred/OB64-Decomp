#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { resolveLocalTools } = require('./lib/local_tools');
const {
  prepareContext,
  runNode,
  verifyCurrent,
  writeJson,
} = require('./lib/current_workflow');
const { ROOT } = require('./lib/phase7_conventional');

function usage() {
  console.log('Usage: node tools/audit.js [--phase5a-root <accepted-evidence-root>]');
}

function parseArgs(argv) {
  let phase5aRoot = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') return { help: true, phase5aRoot: null };
    if (arg !== '--phase5a-root' || phase5aRoot || !argv[index + 1] || argv[index + 1].startsWith('--')) {
      throw new Error(`invalid argument: ${arg}`);
    }
    phase5aRoot = path.resolve(argv[++index]);
  }
  return { help: false, phase5aRoot };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    usage();
    return;
  }
  const context = prepareContext();
  const phase5aRoot = args.phase5aRoot || resolveLocalTools({ audit: true }).phase5aRoot;
  if (!fs.existsSync(phase5aRoot) || !fs.statSync(phase5aRoot).isDirectory()) {
    throw new Error(`accepted Phase 5A evidence root is missing: ${phase5aRoot}`);
  }
  console.log('OB64 Decomp Structural Audit');
  console.log('');
  console.log('Running structural ROM, coverage, overlay, ownership, and toolchain checks...');
  runNode('verify_setup.js', ['--phase5a-root', phase5aRoot], 'structural audit');
  console.log('Running CURRENT ownership and exact-ROM verification...');
  const current = verifyCurrent(context);
  const report = {
    schemaVersion: 1,
    status: 'pass',
    completedAt: new Date().toISOString(),
    structuralReport: 'build/setup/verify-setup-report.json',
    currentVerificationReport: 'build/current/verification.json',
    romSha256: current.verification.verification.outputs.rom.sha256,
    sourcePolicyCounts: current.sourcePolicy.counts,
  };
  const reportFile = path.join(ROOT, 'build', 'audit', 'report.json');
  writeJson(reportFile, report);
  console.log('');
  console.log('Structural protections ...... PASS');
  console.log('CURRENT exact ROM ........... PASS');
  console.log(`Report ...................... ${reportFile}`);
  console.log('RESULT: AUDIT PASS');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Audit failed: ${error.message}`);
    console.error('RESULT: AUDIT FAIL');
    process.exitCode = 1;
  }
}

module.exports = { main, parseArgs };
