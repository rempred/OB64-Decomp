#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  loadActiveTargetModel,
  selectRelocationContract,
  validateLinkageConfig,
  validateNoActiveLinkSymbolShadows,
  validateToolchainPin,
} = require('../tools/lib/active_targets');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { writeJson } = require('../tools/lib/current_workflow');

function expectRejection(name, callback) {
  try {
    callback();
  } catch (_) {
    return name;
  }
  throw new Error(`mutation was accepted: ${name}`);
}

function main() {
  const active = loadActiveTargetModel();
  const pin = active.minimalConfig.toolchain;
  validateToolchainPin(pin);
  const rejectedToolchainMutations = [
    ['manifest path', { ...pin, manifest: 'config/other.json' }],
    ['manifest hash', { ...pin, manifestSha256: '0'.repeat(64) }],
    ['provenance path', { ...pin, buildProvenance: 'config/other.json' }],
    ['provenance hash', { ...pin, buildProvenanceSha256: '0'.repeat(64) }],
    ['unexpected field', { ...pin, selector: 'latest' }],
  ].map(([name, mutation]) => expectRejection(name, () => validateToolchainPin(mutation)));
  const linkage = active.linkageConfig;
  validateLinkageConfig(linkage, active.minimalConfig.profile);
  const rejectedLinkageMutations = [
    ['schema', { ...linkage, schemaVersion: 0 }],
    ['profile', { ...linkage, profile: 'other' }],
    ['unexpected root field', { ...linkage, note: 'unreviewed' }],
    ['duplicate symbol', { ...linkage, symbols: [...linkage.symbols, linkage.symbols[0]] }],
    ['unsafe symbol', { ...linkage, symbols: [{ name: 'bad symbol', address: '0x80000000' }] }],
    ['symbol address', { ...linkage, symbols: [{ name: 'good_symbol', address: '80000000' }] }],
    ['duplicate target', { ...linkage, targets: [...linkage.targets, linkage.targets[0]] }],
    ['ancillary relocation', {
      ...linkage,
      targets: [{
        symbol: 'fixture_target',
        expectedRelocations: [{ offset: '0x00000000', type: 'R_MIPS_26', symbol: '.text', section: '.rel.pdr' }],
      }],
    }],
    ['relocation offset', {
      ...linkage,
      targets: [{
        symbol: 'fixture_target',
        expectedRelocations: [{ offset: '0x00000002', type: 'R_MIPS_26', symbol: '.text', section: '.rel.text' }],
      }],
    }],
  ].map(([name, mutation]) => expectRejection(name, () => validateLinkageConfig(mutation, active.minimalConfig.profile)));
  const rejectedActiveLinkSymbolShadows = [
    expectRejection('active target absolute-symbol shadow', () => validateNoActiveLinkSymbolShadows(
      [{ symbol: 'fixture_target' }],
      { fixture_target: '0x80000000' },
    )),
  ];
  const missingContract = selectRelocationContract('fixture_target', null, null, true);
  if (missingContract.source !== 'missing-diff-only' || missingContract.expectedRelocations.length !== 0) {
    throw new Error('diff-only missing relocation contract state drift');
  }
  const rejectedContractMutations = [
    expectRejection('missing strict contract', () => selectRelocationContract('fixture_target', null, null, false)),
    expectRejection('canonical/legacy mismatch', () => selectRelocationContract(
      'fixture_target',
      { symbol: 'fixture_target', expectedRelocations: [] },
      { expectedRelocations: [{ offset: '0x00000000', type: 'R_MIPS_26', symbol: 'fixture_target', section: '.rel.text' }] },
    )),
  ];

  let retiredPdrRelocations = 0;
  let loadRelevantRelocations = 0;
  for (const target of active.targets) {
    if (target.expectedRelocations.some((record) => record.section === '.rel.pdr')) {
      throw new Error(`active load-relevant relocation contract contains .pdr: ${target.symbol}`);
    }
    if (!target.legacyAncillaryRelocations.every((record) => record.section === '.rel.pdr')) {
      throw new Error(`retired ancillary relocation census drift: ${target.symbol}`);
    }
    loadRelevantRelocations += target.expectedRelocations.length;
    retiredPdrRelocations += target.legacyAncillaryRelocations.length;
    if (!['canonical', 'legacy-compatibility'].includes(target.relocationContractSource)) {
      throw new Error(`unreviewed relocation contract entered strict model: ${target.symbol}`);
    }
  }
  const memcpy = active.targets.find((target) => target.symbol === 'memcpy_bytewise');
  const func135a0 = active.targets.find((target) => target.symbol === 'func_000135a0');
  const func135a0Compatibility = active.compatibility.find((target) => target.symbol === 'func_000135a0');
  if (!memcpy || memcpy.relocationContractSource !== 'canonical' || memcpy.expectedRelocations.length !== 0
      || !func135a0 || func135a0.relocationContractSource !== 'canonical' || func135a0.expectedRelocations.length !== 2
      || !func135a0Compatibility || func135a0Compatibility.legacyRecord !== false
      || !active.linkSymbols.func_00023780 || Object.keys(active.linkSymbols).length !== linkage.symbols.length) {
    throw new Error('canonical matching-C linkage migration drift');
  }
  for (const record of active.compatibility) {
    if (!record.comparisons.every((comparison) => comparison.equivalent)) {
      throw new Error(`legacy structural contract mismatch: ${record.symbol}`);
    }
    if (record.relocationContractSource === 'legacy-compatibility'
        && record.relocationComparison !== 'legacy-load-relevant-contract-retained') {
      throw new Error(`relocation retirement status drift: ${record.symbol}`);
    }
    if (record.relocationContractSource === 'canonical'
        && record.relocationComparison !== 'canonical-reviewed-contract') {
      throw new Error(`canonical relocation status drift: ${record.symbol}`);
    }
  }

  const retiredPaths = [
    path.join(ROOT, 'config', 'compiler-assembly-dialect.json'),
    path.join(ROOT, 'tools', 'lib', 'compiler_assembly_dialect.js'),
  ];
  if (retiredPaths.some((file) => fs.existsSync(file))) throw new Error('retired compiler-assembly adapter remains active');
  const minimalText = fs.readFileSync(CONFIG_PATH, 'utf8');
  if (/compilerAssemblyDialect|compiler[-_ ]assembly[-_ ]dialect/i.test(minimalText)) {
    throw new Error('active target configuration still references the retired adapter');
  }

  const report = {
    schemaVersion: 3,
    status: 'pass',
    activeConfig: { path: path.relative(ROOT, CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(CONFIG_PATH) },
    linkageContract: { path: path.relative(ROOT, LINKAGE_CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(LINKAGE_CONFIG_PATH) },
    legacyContract: { path: path.relative(ROOT, LEGACY_CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(LEGACY_CONFIG_PATH) },
    targetCount: active.targets.length,
    toolchain: active.toolchain.identity,
    rejectedToolchainMutations,
    rejectedLinkageMutations,
    rejectedActiveLinkSymbolShadows,
    rejectedContractMutations,
    structuralFieldsEquivalent: true,
    sharedLinkSymbols: Object.keys(active.linkSymbols).length,
    loadRelevantRelocations,
    retiredPdrRelocations,
    compilerAssemblyAdapterRetired: true,
    compatibility: active.compatibility,
  };
  const reportFile = path.join(ROOT, 'build', 'workflow-migration', 'active-targets.json');
  writeJson(reportFile, report);
  console.log(JSON.stringify({ status: 'pass', targets: active.targets.length, report: reportFile }, null, 2));
}

main();
