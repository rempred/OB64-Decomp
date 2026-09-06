#!/usr/bin/env node
'use strict';

const fs = require('fs');
const textContract = require('./lib/text_contract');
const path = require('path');
const { resolveLocalTools } = require('./lib/local_tools');
const {
  prepareContext,
  runNode,
  verifyCurrent,
  writeJson,
} = require('./lib/current_workflow');
const { ROOT, sha256Buffer } = require('./lib/phase7_conventional');
const { verifyFunc002861C8Structure } = require('../tests/func_002861C8_structure');

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

// These migrated owners were accepted on canonical main at 24d0818.
// Keep the historical migration canary, but pin the accepted PURE_C state.
const SQUAD_MIGRATION = [
    ['p3063', 'func_0019554C', 3063, '5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B'],
    ['p3064', 'func_001957D0', 3064, 'E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B'],
    ['p3066', 'func_001960A8', 3066, '9C56D2EDC784BCE4B789A3A5FE3A0226C10F9EC60CDD90DD27A2A41C834F46F6'],
];

function validateSquadMigrationModel(targets) {
  for (const [, symbol, rowIndex, hash] of SQUAD_MIGRATION) {
    const matches = targets.filter((target) => target.symbol === symbol || target.rowIndex === rowIndex);
    if (matches.length !== 1 || matches[0].symbol !== symbol || matches[0].rowIndex !== rowIndex
        || matches[0].source !== `src/lib/${symbol}.c` || matches[0].expectedTextSha256 !== hash) {
      throw new Error(`p3063/p3064/p3066 migration gate failed: model ${symbol}`);
    }
  }
  return { p3066Active: true };
}

function validateSquadMigration(targets, verifiedTargets) {
  validateSquadMigrationModel(targets);
  const result = {};
  for (const [key, symbol, rowIndex, hash] of SQUAD_MIGRATION) {
    const modelRows = targets.filter((target) => target.symbol === symbol || target.rowIndex === rowIndex);
    const records = verifiedTargets.filter((target) => target.symbol === symbol || target.rowIndex === rowIndex);
    const target = modelRows[0];
    const record = records[0];
    if (modelRows.length !== 1 || records.length !== 1
        || target.symbol !== symbol || target.rowIndex !== rowIndex
        || record.symbol !== symbol || record.rowIndex !== rowIndex
        || record.sourceObjectEvidence?.sourceClass !== 'PURE_C'
        || record.linkedTargetSha256 !== hash || record.expectedTargetSha256 !== hash
        || record.rawBytesExact !== true
        || record.sectionName !== `.ob64.r${rowIndex}`
        || record.linkedOwner !== `objects/c/${symbol}.o`
        || !Array.isArray(record.owners) || record.owners.length !== 1
        || record.owners[0].rowIndex !== rowIndex
        || record.owners[0].sectionName !== record.sectionName
        || record.owners[0].rawBytesExact !== true
        || record.owners[0].linkedSha256 !== hash || record.owners[0].expectedSha256 !== hash
        || !Array.isArray(record.retainedAssemblySlices) || record.retainedAssemblySlices.length !== 0) {
      throw new Error(`p3063/p3064/p3066 migration gate failed: ${symbol}`);
    }
    result[key] = { sourceClass: record.sourceObjectEvidence.sourceClass, targetSha256: record.linkedTargetSha256 };
  }
  return { ...result, p3066Active: true };
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
  const func002861C8Structure = verifyFunc002861C8Structure({ runMutations: true });
  console.log('Running CURRENT ownership and exact-ROM verification...');
  const current = verifyCurrent(context);
  const sourceObjectEvidence = current.verification.verification.sourceObjectEvidence;
  if (!sourceObjectEvidence
      || sourceObjectEvidence.identity.sourceCommit !== '54514ded39ceb32165a125ddba04ca5b551773a2'
      || sourceObjectEvidence.counts.proofTargets !== context.phase8.targets.length
      || sourceObjectEvidence.counts.pureTargets !== current.sourcePolicy.counts.PURE_C
      || sourceObjectEvidence.counts.hybridTargets !== current.sourcePolicy.counts.HYBRID_C
      || sourceObjectEvidence.counts.compilerAssemblyRewrites !== 0
      || sourceObjectEvidence.counts.retiredPdrRelocations !== 38
      || sourceObjectEvidence.targets.some((target) => target.compilerAssemblyRewritten !== false)) {
    throw new Error('verified GNU 2.6 source-to-object evidence invariant failed');
  }
  if (context.phase8.targets.some((target) => target.expectedRelocations.some((record) => record.section === '.rel.pdr'))
      || !context.phase8.targets.every((target) => target.legacyAncillaryRelocations.every((record) => record.section === '.rel.pdr'))) {
    throw new Error('active/retired relocation policy invariant failed');
  }
  const canonicalLinkageTargets = context.phase8.targets.filter((target) => target.relocationContractSource === 'canonical');
  const legacyLinkageTargets = context.phase8.targets.filter((target) => target.relocationContractSource === 'legacy-compatibility');
  const func135a0Linkage = context.phase8.compatibility.find((target) => target.symbol === 'func_000135a0');
  if (canonicalLinkageTargets.length !== context.phase8.linkageConfig.targets.length
      || !func135a0Linkage || func135a0Linkage.legacyRecord !== false
      || func135a0Linkage.relocationContractSource !== 'canonical') {
    throw new Error('reviewed matching-C linkage migration invariant failed');
  }
  const rebuiltRom = fs.readFileSync(path.join(current.build.output, 'phase8.us_rev0.z64'));
  const func2cd70 = context.phase8.targets.find((target) => target.symbol === 'func_0002CD70');
  if (!func2cd70) throw new Error('func_0002CD70 is missing from the active target model');
  const func2cd70Bytes = rebuiltRom.subarray(func2cd70.romStartNumber, func2cd70.romEndNumber);
  const func2cd70Gate = {
    sourceClass: sourceObjectEvidence.targets.find((target) => target.symbol === func2cd70.symbol).sourceClass,
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
  const squadMigration = validateSquadMigration(context.phase8.targets, current.verification.verification.targets);
  const textRepresentations = sourceObjectEvidence.targets.map((record) => {
    const target = context.phase8.targets.find((entry) => entry.symbol === record.symbol);
    textContract.validateRecords(record, { textContract: textContract.resolveTextContract(target) }, 'audit');
    if (!record.objectEvidence || !record.linkEvidence || record.linkEvidence.fullOwnerExact !== true) {
      throw new Error('audit text representation evidence is incomplete');
    }
    return { symbol: target.symbol, mode: record.textContract.mode, textContractSha256: textContract.hash(record.textContract) };
  });
  const report = {
    schemaVersion: 4,
    textRepresentations,
    status: 'pass',
    completedAt: new Date().toISOString(),
    structuralReport: 'build/setup/verify-setup-report.json',
    currentVerificationReport: 'build/current/verification.json',
    romSha256: current.verification.verification.outputs.rom.sha256,
    sourcePolicyCounts: current.sourcePolicy.counts,
    gnuBinutils26: {
      identity: sourceObjectEvidence.identity,
      counts: sourceObjectEvidence.counts,
      sourcePolicy: sourceObjectEvidence.sourcePolicy,
      compilerAssemblyRewrites: 0,
    },
    relocationPolicy: {
      contract: context.phase8.linkageConfigIdentity,
      sharedLinkSymbols: Object.keys(context.phase8.linkSymbols).length,
      canonicalTargets: canonicalLinkageTargets.length,
      legacyCompatibilityTargets: legacyLinkageTargets.length,
      loadRelevantRelocations: sourceObjectEvidence.counts.loadRelevantRelocations,
      ancillaryRelocations: sourceObjectEvidence.counts.ancillaryRelocations,
      retiredPdrRelocations: sourceObjectEvidence.counts.retiredPdrRelocations,
      activePdrRelocations: 0,
    },
    func0002CD70: func2cd70Gate,
    ...squadMigration,
    func002861C8Structure,
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

module.exports = { main, parseArgs, validateSquadMigration, validateSquadMigrationModel };
