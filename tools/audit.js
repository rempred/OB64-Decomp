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
const { ROOT, sha256Buffer } = require('./lib/phase7_conventional');

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
  const dialect = current.verification.verification.dialect;
  const perRuleTotal = dialect && dialect.counts && dialect.counts.ruleTransformations
    ? Object.values(dialect.counts.ruleTransformations).reduce((sum, count) => sum + count, 0)
    : -1;
  const hybridRuleCountsZero = dialect && Array.isArray(dialect.targets)
    && dialect.targets.filter((target) => target.sourceClass === 'HYBRID_C').every((target) => (
      target.ruleTransformations
      && Object.values(target.ruleTransformations).every((count) => count === 0)
    ));
  if (!dialect || dialect.counts.hybridTransformations !== 0
      || dialect.counts.hybridByteIdenticalTargets !== dialect.counts.hybridTargets
      || perRuleTotal !== dialect.counts.transformations || !hybridRuleCountsZero) {
    throw new Error('verified HYBRID_C dialect passthrough invariant failed');
  }
  const rebuiltRom = fs.readFileSync(path.join(current.build.output, 'phase8.us_rev0.z64'));
  const func2cd70 = context.phase8.targets.find((target) => target.symbol === 'func_0002CD70');
  if (!func2cd70) throw new Error('func_0002CD70 is missing from the active target model');
  const func2cd70Bytes = rebuiltRom.subarray(func2cd70.romStartNumber, func2cd70.romEndNumber);
  const func2cd70Gate = {
    sourceClass: dialect.targets.find((target) => target.symbol === func2cd70.symbol).sourceClass,
    targetSha256: sha256Buffer(func2cd70Bytes),
    expectedTargetSha256: func2cd70.expectedTextSha256,
    instructionWords: {
      offset004: `0x${func2cd70Bytes.readUInt32BE(0x004).toString(16).toUpperCase().padStart(8, '0')}`,
      offset028: `0x${func2cd70Bytes.readUInt32BE(0x028).toString(16).toUpperCase().padStart(8, '0')}`,
    },
  };
  if (func2cd70Gate.sourceClass !== 'HYBRID_C'
      || func2cd70Gate.targetSha256 !== '9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF'
      || func2cd70Gate.targetSha256 !== func2cd70Gate.expectedTargetSha256
      || func2cd70Gate.instructionWords.offset004 !== '0x00801025'
      || func2cd70Gate.instructionWords.offset028 !== '0x00801025') {
    throw new Error('func_0002CD70 hybrid target gate failed');
  }
  const report = {
    schemaVersion: 2,
    status: 'pass',
    completedAt: new Date().toISOString(),
    structuralReport: 'build/setup/verify-setup-report.json',
    currentVerificationReport: 'build/current/verification.json',
    romSha256: current.verification.verification.outputs.rom.sha256,
    sourcePolicyCounts: current.sourcePolicy.counts,
    compilerAssemblyDialect: {
      identity: dialect.identity,
      counts: dialect.counts,
      sourcePolicy: dialect.sourcePolicy,
      hybridPassthroughVerified: true,
    },
    func0002CD70: func2cd70Gate,
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
