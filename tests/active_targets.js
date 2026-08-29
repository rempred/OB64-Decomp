#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  loadActiveTargetModel,
  resolveAuxiliarySectionContracts,
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
  const canaryEntry = linkage.targets.find((entry) => entry.symbol === 'func_00283E14');
  const canaryTarget = active.targets.find((target) => target.symbol === 'func_00283E14');
  if (!canaryEntry || !canaryTarget || !Array.isArray(canaryEntry.auxiliarySections)
      || canaryEntry.auxiliarySections.length !== 1 || canaryTarget.auxiliarySections.length !== 1) {
    throw new Error('canonical auxiliary switch-table canary contract is missing');
  }
  const unpaddedCanary = canaryTarget.auxiliarySections[0];
  if (Object.prototype.hasOwnProperty.call(canaryEntry.auxiliarySections[0], 'trailingPaddingBytes')
      || Object.prototype.hasOwnProperty.call(canaryEntry.auxiliarySections[0], 'expectedTrailingPaddingSha256')
      || unpaddedCanary.entryBytes !== unpaddedCanary.bytes
      || unpaddedCanary.trailingPaddingBytes !== 0
      || unpaddedCanary.expectedTrailingPaddingSha256 !== 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855') {
    throw new Error('canonical unpadded auxiliary switch-table behavior drift');
  }
  const paddedFixture = {
    ...canaryEntry.auxiliarySections[0],
    entries: 7,
    trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: 'DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119',
    expectedRelocations: canaryEntry.auxiliarySections[0].expectedRelocations.slice(0, 7),
  };
  const paddedFixtureConfig = {
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      auxiliarySections: [paddedFixture],
    } : entry),
  };
  const normalizedPaddedFixture = validateLinkageConfig(
    paddedFixtureConfig,
    active.minimalConfig.profile,
  ).targets.get(canaryEntry.symbol.toLowerCase()).auxiliarySections[0];
  if (normalizedPaddedFixture.entryBytes !== 28
      || normalizedPaddedFixture.trailingPaddingBytes !== 4
      || normalizedPaddedFixture.bytes !== 32) {
    throw new Error('canonical padded auxiliary switch-table normalization drift');
  }
  const legacyUnpaddedFixture = {
    ...canaryEntry.auxiliarySections[0],
    romEndExclusive: '0x00286BAC',
    vramEndExclusive: '0x8022ABDC',
    bytes: 28,
    entries: 7,
    preservedTail: {
      ...canaryEntry.auxiliarySections[0].preservedTail,
      romStart: '0x00286BAC',
      vramStart: '0x8022ABDC',
      bytes: 36,
    },
    expectedRelocations: canaryEntry.auxiliarySections[0].expectedRelocations.slice(0, 7),
  };
  const legacyUnpaddedFixtureConfig = {
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      auxiliarySections: [legacyUnpaddedFixture],
    } : entry),
  };
  const normalizedLegacyUnpaddedFixture = validateLinkageConfig(
    legacyUnpaddedFixtureConfig,
    active.minimalConfig.profile,
  ).targets.get(canaryEntry.symbol.toLowerCase()).auxiliarySections[0];
  if (normalizedLegacyUnpaddedFixture.entryBytes !== 28
      || normalizedLegacyUnpaddedFixture.trailingPaddingBytes !== 0
      || normalizedLegacyUnpaddedFixture.bytes !== 28) {
    throw new Error('legacy unpadded auxiliary switch-table compatibility drift');
  }
  const mutateCanaryAuxiliary = (mutate) => ({
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      auxiliarySections: [mutate({ ...entry.auxiliarySections[0] })],
    } : entry),
  });
  const validateAuxiliaryPlacementMutation = (mutation) => {
    const reviewed = validateLinkageConfig(mutation, active.minimalConfig.profile);
    return resolveAuxiliarySectionContracts(
      active.model,
      fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64')),
      canaryTarget,
      reviewed.targets.get(canaryEntry.symbol.toLowerCase()).auxiliarySections,
    );
  };
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
  const rejectedAuxiliaryMutations = [
    ['unexpected field', (record) => ({ ...record, permissive: true }), validateLinkageConfig],
    ['unknown compiler section', (record) => ({ ...record, compilerSection: '.mystery' }), validateLinkageConfig],
    ['writable data section', (record) => ({ ...record, compilerSection: '.data' }), validateLinkageConfig],
    ['bss section', (record) => ({ ...record, compilerSection: '.bss' }), validateLinkageConfig],
    ['unknown output section', (record) => ({ ...record, outputSection: '.rodata' }), validateLinkageConfig],
    ['writable flags', (record) => ({ ...record, sectionFlags: ['SHF_ALLOC', 'SHF_WRITE'] }), validateLinkageConfig],
    ['NOBITS type', (record) => ({ ...record, sectionType: 'SHT_NOBITS' }), validateLinkageConfig],
    ['malformed alignment', (record) => ({ ...record, alignment: 3 }), validateLinkageConfig],
    ['table count', (record) => ({ ...record, entries: record.entries + 1 }), validateLinkageConfig],
    ['table byte count', (record) => ({ ...record, bytes: record.bytes + 4 }), validateLinkageConfig],
    ['relocation count', (record) => ({ ...record, expectedRelocations: record.expectedRelocations.slice(0, -1) }), validateLinkageConfig],
    ['relocation type', (record) => ({
      ...record,
      expectedRelocations: record.expectedRelocations.map((relocation, index) => index === 0
        ? { ...relocation, type: 'R_MIPS_26' }
        : relocation),
    }), validateLinkageConfig],
    ['ROM placement', (record) => ({ ...record, romStart: '0x00286B94', romEndExclusive: '0x00286BB4' }), validateAuxiliaryPlacementMutation],
    ['VMA placement', (record) => ({ ...record, vramStart: '0x8022ABC8', vramEndExclusive: '0x8022ABE8' }), validateAuxiliaryPlacementMutation],
    ['linked byte hash', (record) => ({ ...record, expectedLinkedSha256: '0'.repeat(64) }), validateAuxiliaryPlacementMutation],
    ['object byte hash', (record) => ({ ...record, expectedObjectSha256: '0'.repeat(64) }), validateAuxiliaryPlacementMutation],
    ['tail conventional data section', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, inputSection: '.data' },
    }), validateLinkageConfig],
    ['tail bss section', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, inputSection: '.bss' },
    }), validateLinkageConfig],
    ['tail unknown section', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, inputSection: '.ob64.r9999.tail' },
    }), validateLinkageConfig],
    ['tail writable flags', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, sectionFlags: ['SHF_ALLOC', 'SHF_WRITE'] },
    }), validateLinkageConfig],
    ['tail executable flags', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, sectionFlags: ['SHF_ALLOC', 'SHF_EXECINSTR'] },
    }), validateLinkageConfig],
    ['tail NOBITS type', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, sectionType: 'SHT_NOBITS' },
    }), validateLinkageConfig],
    ['tail byte count', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, bytes: record.preservedTail.bytes + 4 },
    }), validateLinkageConfig],
    ['tail ROM placement', (record) => ({
      ...record,
      preservedTail: {
        ...record.preservedTail,
        romStart: '0x00286BB4',
        romEndExclusive: '0x00286BD4',
      },
    }), validateAuxiliaryPlacementMutation],
    ['tail VMA placement', (record) => ({
      ...record,
      preservedTail: {
        ...record.preservedTail,
        vramStart: '0x8022ABE4',
        vramEndExclusive: '0x8022AC04',
      },
    }), validateAuxiliaryPlacementMutation],
    ['tail byte hash', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, expectedSha256: '0'.repeat(64) },
    }), validateAuxiliaryPlacementMutation],
    ['tail assembly owner', (record) => ({
      ...record,
      preservedTail: { ...record.preservedTail, ownerOriginalAssembly: 'asm/original/rev0/lib/other.s' },
    }), validateAuxiliaryPlacementMutation],
    ['relocation addend', (record) => ({
      ...record,
      expectedRelocations: record.expectedRelocations.map((relocation, index) => index === 0
        ? { ...relocation, addend: '0x00000100' }
        : relocation),
    }), validateAuxiliaryPlacementMutation],
    ['text ownership collision', (record) => ({ ...record, outputSection: canaryTarget.sectionName }), validateAuxiliaryPlacementMutation],
  ].map(([name, mutate, validator]) => expectRejection(`auxiliary ${name}`, () => {
    const mutation = mutateCanaryAuxiliary(mutate);
    if (validator === validateLinkageConfig) validator(mutation, active.minimalConfig.profile);
    else validator(mutation);
  }));
  const mutatePaddedFixture = (mutate) => ({
    ...paddedFixtureConfig,
    targets: paddedFixtureConfig.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      auxiliarySections: [mutate({ ...entry.auxiliarySections[0] })],
    } : entry),
  });
  const rejectedPaddingMutations = [
    ['missing padding hash', (record) => {
      const { expectedTrailingPaddingSha256, ...rest } = record;
      return rest;
    }],
    ['missing padding byte count', (record) => {
      const { trailingPaddingBytes, ...rest } = record;
      return rest;
    }],
    ['zero explicit padding', (record) => ({ ...record, trailingPaddingBytes: 0 })],
    ['arbitrary padding length', (record) => ({ ...record, trailingPaddingBytes: 8 })],
    ['nonzero padding hash', (record) => ({ ...record, expectedTrailingPaddingSha256: '0'.repeat(64) })],
    ['relocation in padding', (record) => ({
      ...record,
      expectedRelocations: record.expectedRelocations.map((relocation, index) => index === 6
        ? { ...relocation, offset: '0x0000001C' }
        : relocation),
    })],
  ].map(([name, mutate]) => expectRejection(`auxiliary ${name}`, () => validateLinkageConfig(
    mutatePaddedFixture(mutate),
    active.minimalConfig.profile,
  )));
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
    rejectedAuxiliaryMutations,
    rejectedPaddingMutations,
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
