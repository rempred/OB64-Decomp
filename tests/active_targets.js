#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CONFIG_PATH,
  LINKAGE_CONFIG_PATH,
  LEGACY_CONFIG_PATH,
  MULTI_OWNER_CONFIG_PATH,
  loadActiveTargetModel,
  normalizeAuxiliarySectionContracts,
  resolveAcceptedRow,
  resolveAcceptedRows,
  resolveAuxiliarySectionContracts,
  resolveCompilerTextFunctions,
  selectRelocationContract,
  validateAuxiliaryOwnerGroups,
  validateLinkageConfig,
  validateMultiOwnerConfig,
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

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function main() {
  const active = loadActiveTargetModel();
  const baserom = fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'));
  const multiOwnerConfig = JSON.parse(fs.readFileSync(MULTI_OWNER_CONFIG_PATH, 'utf8'));
  const validatedMultiOwners = validateMultiOwnerConfig(
    multiOwnerConfig,
    active.minimalConfig.profile,
    active.model,
    baserom,
  );
  const cutsceneOwners = validatedMultiOwners.get('func_002a0ef0');
  if (!cutsceneOwners || cutsceneOwners.bytes !== 1132
      || cutsceneOwners.romStartNumber !== 0x002A0EF0
      || cutsceneOwners.romEndNumber !== 0x002A135C
      || cutsceneOwners.vramStartNumber !== 0x802316C0
      || cutsceneOwners.vramEndNumber !== 0x80231B2C
      || !sameJson(cutsceneOwners.rows.map((row) => row.index), [5366, 5367])
      || !sameJson(cutsceneOwners.owners.map((owner) => owner.sectionName), ['.ob64.r5366', '.ob64.r5367'])
      || !sameJson(cutsceneOwners.owners.map((owner) => owner.chunkIndex), [41, 42])
      || !sameJson(cutsceneOwners.owners.map((owner) => owner.bytes), [272, 860])) {
    throw new Error('func_002A0EF0 accepted multi-owner contract drift');
  }
  const resolvedCutsceneOwners = resolveAcceptedRows(active.model, 'func_002A0EF0', validatedMultiOwners);
  if (!resolvedCutsceneOwners.contract || resolvedCutsceneOwners.rows.length !== 2) {
    throw new Error('func_002A0EF0 did not resolve as one logical multi-owner target');
  }
  const actionTailOwners = validatedMultiOwners.get('func_0021d374');
  if (!actionTailOwners || actionTailOwners.bytes !== 220
      || actionTailOwners.romStartNumber !== 0x0021D374
      || actionTailOwners.romEndNumber !== 0x0021D450
      || actionTailOwners.vramStartNumber !== 0x801DA0A4
      || actionTailOwners.vramEndNumber !== 0x801DA180
      || !sameJson(actionTailOwners.rows.map((row) => row.index), [4047, 4048])
      || !sameJson(actionTailOwners.owners.map((owner) => owner.sectionName), ['.ob64.r4047', '.ob64.r4048'])
      || !sameJson(actionTailOwners.owners.map((owner) => owner.chunkIndex), [33, 33])
      || !sameJson(actionTailOwners.owners.map((owner) => owner.bytes), [72, 148])
      || actionTailOwners.owners.some((owner) => owner.row.slices[0].loadSlabId !== 'resource-loader-00213b10')) {
    throw new Error('func_0021D374 accepted multi-entry owner contract drift');
  }
  const resolvedActionTailOwners = resolveAcceptedRows(active.model, 'func_0021D374', validatedMultiOwners);
  if (!resolvedActionTailOwners.contract || resolvedActionTailOwners.rows.length !== 2) {
    throw new Error('func_0021D374 did not resolve as one logical multi-entry target');
  }
  const comparatorOwners = resolveAcceptedRows(active.model, 'func_0021C8DC', validatedMultiOwners);
  if (comparatorOwners.contract !== null || comparatorOwners.rows.length !== 1
      || comparatorOwners.owners.length !== 1
      || comparatorOwners.rows[0].bytes !== 148
      || comparatorOwners.rows[0].slices.length !== 2
      || comparatorOwners.owners[0].sectionName !== '.ob64.r4033.s0'
      || comparatorOwners.owners[0].romStartNumber !== 0x0021C8DC
      || comparatorOwners.owners[0].romEndNumber !== 0x0021C968
      || comparatorOwners.owners[0].vramStartNumber !== 0x801D960C
      || comparatorOwners.owners[0].vramEndNumber !== 0x801D9698
      || comparatorOwners.owners[0].bytes !== 140) {
    throw new Error('func_0021C8DC executable-slice owner contract drift');
  }
  const comparatorPaddingMutationModel = JSON.parse(JSON.stringify(active.model));
  comparatorPaddingMutationModel.rows[4033].slices[1].executable = true;
  const rejectedFunctionPaddingMutations = [
    expectRejection('function padding became executable', () => resolveAcceptedRows(
      comparatorPaddingMutationModel,
      'func_0021C8DC',
      validatedMultiOwners,
    )),
  ];
  const mutateMultiOwner = (mutate, model = active.model) => validateMultiOwnerConfig(
    mutate(JSON.parse(JSON.stringify(multiOwnerConfig))),
    active.minimalConfig.profile,
    model,
    baserom,
  );
  const mutateContract = (config, mutate) => ({
    ...config,
    targets: config.targets.map((contract) => contract.symbol === 'func_002A0EF0'
      ? mutate({ ...contract, ownerRows: [...contract.ownerRows] })
      : contract),
  });
  const mutatedModel = (mutate) => {
    const model = JSON.parse(JSON.stringify(active.model));
    mutate(model.rows.find((row) => row.index === 5367));
    return model;
  };
  const rejectedMultiOwnerMutations = [
    expectRejection('multi-owner missing owner', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, ownerRows: [5366] })))),
    expectRejection('multi-owner reordered owners', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, ownerRows: [5367, 5366] })))),
    expectRejection('multi-owner noncontiguous owner', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, ownerRows: [5366, 5368] })))),
    expectRejection('multi-owner extra owner', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, ownerRows: [5366, 5367, 5368] })))),
    expectRejection('multi-owner duplicate owner', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, ownerRows: [5366, 5366] })))),
    expectRejection('multi-owner unexpected field', () => mutateMultiOwner((config) => mutateContract(config, (contract) => ({ ...contract, permissive: true })))),
    expectRejection('multi-owner overlapping placement', () => validateMultiOwnerConfig(
      multiOwnerConfig,
      active.minimalConfig.profile,
      mutatedModel((row) => {
        row.romStart -= 4;
        row.slices[0].romStart -= 4;
        row.part.romStartNumber -= 4;
      }),
      baserom,
    )),
    expectRejection('multi-owner VMA gap', () => validateMultiOwnerConfig(
      multiOwnerConfig,
      active.minimalConfig.profile,
      mutatedModel((row) => {
        row.slices[0].vramStart += 4;
      }),
      baserom,
    )),
    expectRejection('multi-owner ambiguous row', () => validateMultiOwnerConfig(
      multiOwnerConfig,
      active.minimalConfig.profile,
      mutatedModel((row) => { row.ambiguous = true; }),
      baserom,
    )),
    expectRejection('multi-owner placement-kind mismatch', () => validateMultiOwnerConfig(
      multiOwnerConfig,
      active.minimalConfig.profile,
      mutatedModel((row) => { row.slices[0].loadSlabId = 'other-slab'; }),
      baserom,
    )),
    expectRejection('multi-owner partial continuation activation', () => resolveAcceptedRows(
      active.model,
      'func_002A0EF0_chunk42tail',
      validatedMultiOwners,
    )),
    expectRejection('multi-entry shared-tail activation', () => resolveAcceptedRows(
      active.model,
      'func_0021D3BC',
      validatedMultiOwners,
    )),
  ];
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
  const canonicalTailFixture = {
    inputSection: '.ob64.r5131.tail',
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 1,
    romStart: '0x00286BB0',
    romEndExclusive: '0x00286BD0',
    vramStart: '0x8022ABE0',
    vramEndExclusive: '0x8022AC00',
    bytes: 32,
    expectedSha256: '3941B3E27A8BADD8F62F4C9B1240B837A018B71541D9841BD160AE0BC6005AF5',
    ownerOriginalAssembly: 'asm/original/rev0/lib/table_00286B90.s',
    ownerOriginalAssemblySha256: '458B0517364A95A1700DEEBE79DB27EC82505DA987F2BD24B3BE5DA05853E539',
  };
  const compilerTextFixture = [
    {
      symbol: canaryTarget.symbol,
      offset: '0x00000000',
      bytes: 4,
      binding: 'GLOBAL',
      entryEvidence: 'owner',
    },
    {
      symbol: `${canaryTarget.symbol}_local_0004`,
      offset: '0x00000004',
      bytes: canaryTarget.bytes - 4,
      binding: 'LOCAL',
      entryEvidence: 'internal-call-only',
    },
  ];
  const compilerTextFixtureConfig = {
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      compilerTextFunctions: compilerTextFixture,
    } : entry),
  };
  const normalizedCompilerTextFixture = validateLinkageConfig(
    compilerTextFixtureConfig,
    active.minimalConfig.profile,
  ).targets.get(canaryEntry.symbol.toLowerCase()).compilerTextFunctions;
  const resolvedCompilerTextFixture = resolveCompilerTextFunctions(canaryTarget, normalizedCompilerTextFixture);
  if (resolvedCompilerTextFixture.length !== 2
      || resolvedCompilerTextFixture[0].bytes !== 4
      || resolvedCompilerTextFixture[1].offsetNumber !== 4
      || resolvedCompilerTextFixture[1].binding !== 'LOCAL') {
    throw new Error('compiler text-function partition normalization drift');
  }
  const mutateCompilerTextFixture = (mutate) => ({
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      compilerTextFunctions: mutate(compilerTextFixture.map((record) => ({ ...record }))),
    } : entry),
  });
  const rejectedCompilerTextMutations = [
    ['single function escape hatch', (records) => records.slice(0, 1), validateLinkageConfig],
    ['primary symbol', (records) => [{ ...records[0], symbol: 'invented_owner' }, records[1]], validateLinkageConfig],
    ['primary binding', (records) => [{ ...records[0], binding: 'LOCAL' }, records[1]], validateLinkageConfig],
    ['local export', (records) => [records[0], { ...records[1], binding: 'GLOBAL' }], validateLinkageConfig],
    ['unknown evidence', (records) => [records[0], { ...records[1], entryEvidence: 'guessed' }], validateLinkageConfig],
    ['unaligned offset', (records) => [records[0], { ...records[1], offset: '0x00000002' }], validateLinkageConfig],
    ['duplicate symbol', (records) => [records[0], { ...records[1], symbol: records[0].symbol }], validateLinkageConfig],
    ['unexpected field', (records) => [records[0], { ...records[1], alias: true }], validateLinkageConfig],
    ['gap', (records) => [records[0], { ...records[1], offset: '0x00000008', bytes: records[1].bytes - 4 }], resolveCompilerTextFunctions],
    ['overlap', (records) => [{ ...records[0], bytes: 8 }, records[1]], resolveCompilerTextFunctions],
    ['short coverage', (records) => [records[0], { ...records[1], bytes: records[1].bytes - 4 }], resolveCompilerTextFunctions],
  ].map(([name, mutate, validator]) => expectRejection(`compiler text ${name}`, () => {
    const mutation = mutateCompilerTextFixture(mutate);
    const reviewed = validateLinkageConfig(mutation, active.minimalConfig.profile);
    if (validator === resolveCompilerTextFunctions) {
      resolveCompilerTextFunctions(canaryTarget, reviewed.targets.get(canaryEntry.symbol.toLowerCase()).compilerTextFunctions);
    }
  }));
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
  const actionDispatcherRow = resolveAcceptedRow(active.model, 'func_0021CBC4');
  const actionDispatcherSlice = actionDispatcherRow.slices.find((slice) => slice.executable);
  if (!actionDispatcherSlice || actionDispatcherSlice.loadSlabId !== 'resource-loader-00213b10') {
    throw new Error('func_0021CBC4 accepted load-slab text placement drift');
  }
  const actionDispatcherTarget = {
    symbol: 'func_0021CBC4',
    targetIndex: -1,
    chunkIndex: actionDispatcherRow.part.chunkIndex,
    overlayDescriptorId: actionDispatcherSlice.overlayDescriptorId,
    bytes: actionDispatcherSlice.bytes,
    vramStartNumber: actionDispatcherSlice.vramStart,
    sectionName: actionDispatcherSlice.sectionName,
    row: actionDispatcherRow,
    textOwners: [{ row: actionDispatcherRow, sectionName: actionDispatcherSlice.sectionName }],
  };
  const actionTableBytes = baserom.subarray(0x00229DF0, 0x00229EF8);
  const hex32 = (value) => `0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
  const actionTableRelocations = Array.from({ length: 65 }, (_, index) => ({
    offset: hex32(index * 4),
    type: 'R_MIPS_32',
    symbol: '.text',
    addend: hex32(actionTableBytes.readUInt32BE(index * 4) - actionDispatcherSlice.vramStart),
    section: '.rel.rodata',
  }));
  const actionTableRawContract = {
    kind: 'switch-table',
    compilerSection: '.rodata',
    outputSection: '.ob64.r4158',
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 8,
    romStart: '0x00229DF0',
    romEndExclusive: '0x00229EF8',
    vramStart: '0x801E6B20',
    vramEndExclusive: '0x801E6C28',
    bytes: 264,
    entries: 65,
    trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: 'DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119',
    expectedObjectSha256: 'B8C244F0C4F26E1576796A6E5309C3E951E433CAFDDE9FA15AC524B480599536',
    expectedLinkedSha256: 'D88942BC72126CDB2EAC36D63BCF8B262C671FFFA53ADD17DEBAC7BB6A02D112',
    preservedTail: null,
    expectedRelocations: actionTableRelocations,
  };
  const actionTableContract = normalizeAuxiliarySectionContracts(
    [actionTableRawContract],
    actionDispatcherTarget.symbol,
    'func_0021CBC4 load-slab auxiliary fixture',
  );
  const resolvedActionTable = resolveAuxiliarySectionContracts(
    active.model,
    baserom,
    actionDispatcherTarget,
    actionTableContract,
  )[0];
  if (!resolvedActionTable || resolvedActionTable.ownerRowIndex !== 4158
      || resolvedActionTable.ownerChunkIndex !== 34
      || resolvedActionTable.ownerChunkIndex === actionDispatcherTarget.chunkIndex
      || resolvedActionTable.ownerRomStartNumber !== 0x00229DF0
      || resolvedActionTable.ownerRomEndNumber !== 0x00229EF8
      || resolvedActionTable.ownerVramStartNumber !== 0x801E6B20
      || resolvedActionTable.ownerVramEndNumber !== 0x801E6C28
      || resolvedActionTable.entries !== 65
      || resolvedActionTable.trailingPaddingBytes !== 4
      || resolvedActionTable.ownerTailBytes !== 0) {
    throw new Error('func_0021CBC4 load-slab auxiliary owner relationship drift');
  }
  const mutateActionTableModel = (mutate) => {
    const model = JSON.parse(JSON.stringify(active.model));
    mutate(model.rows.find((row) => row.index === 4158).slices[0]);
    return model;
  };
  const rejectedLoadSlabAuxiliaryMutations = [
    expectRejection('load-slab auxiliary identity mismatch', () => resolveAuxiliarySectionContracts(
      mutateActionTableModel((slice) => { slice.loadSlabId = 'other-load-slab'; }),
      baserom,
      actionDispatcherTarget,
      actionTableContract,
    )),
    expectRejection('load-slab auxiliary placement-kind mismatch', () => resolveAuxiliarySectionContracts(
      mutateActionTableModel((slice) => { slice.placementKind = 'rom-only'; }),
      baserom,
      actionDispatcherTarget,
      actionTableContract,
    )),
    expectRejection('load-slab auxiliary executable drift', () => resolveAuxiliarySectionContracts(
      mutateActionTableModel((slice) => { slice.executable = true; }),
      baserom,
      actionDispatcherTarget,
      actionTableContract,
    )),
  ];
  const legacyUnpaddedFixture = {
    ...canaryEntry.auxiliarySections[0],
    romEndExclusive: '0x00286BAC',
    vramEndExclusive: '0x8022ABDC',
    bytes: 28,
    entries: 7,
    preservedTail: {
      ...canonicalTailFixture,
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
  const secondOwnerRow = resolveAcceptedRow(active.model, 'func_002861C8');
  const secondOwnerSlice = secondOwnerRow.slices.find((slice) => slice.executable);
  if (!secondOwnerSlice) throw new Error('func_002861C8 accepted executable slice is missing');
  const secondOwnerTarget = {
    symbol: 'func_002861C8',
    targetIndex: canaryTarget.targetIndex + 1,
    chunkIndex: secondOwnerRow.part.chunkIndex,
    overlayDescriptorId: secondOwnerSlice.overlayDescriptorId,
    bytes: secondOwnerRow.bytes,
    vramStartNumber: secondOwnerSlice.vramStart,
    sectionName: secondOwnerSlice.sectionName,
  };
  const sharedSecondRaw = {
    kind: 'switch-table',
    compilerSection: '.rodata',
    outputSection: '.ob64.r5131',
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 8,
    romStart: '0x00286BB0',
    romEndExclusive: '0x00286BC8',
    vramStart: '0x8022ABE0',
    vramEndExclusive: '0x8022ABF8',
    bytes: 24,
    entries: 6,
    expectedObjectSha256: 'A9135899EECACABBA7D375B9AAF0F702020116739459D10E049FF5C6FB884EE5',
    expectedLinkedSha256: '8BB46E4A653E8091810D96866D3A5D0CBCECF798DEAE3A6200901709D8642D17',
    preservedTail: {
      ...canonicalTailFixture,
      romStart: '0x00286BC8',
      romEndExclusive: '0x00286BD0',
      vramStart: '0x8022ABF8',
      vramEndExclusive: '0x8022AC00',
      bytes: 8,
      expectedSha256: 'AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC',
    },
    expectedRelocations: [
      { offset: '0x00000000', type: 'R_MIPS_32', symbol: '.text', addend: '0x00000054', section: '.rel.rodata' },
      { offset: '0x00000004', type: 'R_MIPS_32', symbol: '.text', addend: '0x00000070', section: '.rel.rodata' },
      { offset: '0x00000008', type: 'R_MIPS_32', symbol: '.text', addend: '0x0000008C', section: '.rel.rodata' },
      { offset: '0x0000000C', type: 'R_MIPS_32', symbol: '.text', addend: '0x000000AC', section: '.rel.rodata' },
      { offset: '0x00000010', type: 'R_MIPS_32', symbol: '.text', addend: '0x000000CC', section: '.rel.rodata' },
      { offset: '0x00000014', type: 'R_MIPS_32', symbol: '.text', addend: '0x000000E0', section: '.rel.rodata' },
    ],
  };
  const makeSharedAuxiliaryTargets = () => {
    const firstContract = normalizeAuxiliarySectionContracts(
      [{ ...canaryEntry.auxiliarySections[0], preservedTail: null }],
      canaryTarget.symbol,
      'shared auxiliary first fixture',
    );
    const secondContract = normalizeAuxiliarySectionContracts(
      [sharedSecondRaw],
      secondOwnerTarget.symbol,
      'shared auxiliary second fixture',
    );
    return [
      {
        ...canaryTarget,
        auxiliarySections: resolveAuxiliarySectionContracts(
          active.model,
          fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64')),
          canaryTarget,
          firstContract,
        ),
      },
      {
        ...secondOwnerTarget,
        auxiliarySections: resolveAuxiliarySectionContracts(
          active.model,
          fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64')),
          secondOwnerTarget,
          secondContract,
        ),
      },
    ];
  };
  const sharedAuxiliaryTargets = makeSharedAuxiliaryTargets();
  validateAuxiliaryOwnerGroups(sharedAuxiliaryTargets);
  if (sharedAuxiliaryTargets[0].auxiliarySections[0].ownerFragmentIndex !== 0
      || sharedAuxiliaryTargets[1].auxiliarySections[0].ownerFragmentIndex !== 1
      || sharedAuxiliaryTargets[1].auxiliarySections[0].ownerTailBytes !== 8) {
    throw new Error('shared auxiliary accepted-owner partition normalization drift');
  }
  const rejectedSharedAuxiliaryMutations = [
    ['linker order', (targets) => targets.reverse()],
    ['gap', (targets) => {
      targets[1].auxiliarySections[0].romStartNumber += 4;
      targets[1].auxiliarySections[0].vramStartNumber += 4;
      return targets;
    }],
    ['overlap', (targets) => {
      targets[1].auxiliarySections[0].romStartNumber -= 4;
      targets[1].auxiliarySections[0].vramStartNumber -= 4;
      return targets;
    }],
    ['duplicate tail', (targets) => {
      Object.assign(targets[0].auxiliarySections[0], {
        ownerTailSection: '.ob64.r5131.tail',
        ownerTailBytes: 32,
      });
      return targets;
    }],
    ['missing final tail', (targets) => {
      const auxiliary = targets[1].auxiliarySections[0];
      Object.assign(auxiliary, {
        ownerTailSection: null,
        ownerTailBytes: 0,
        ownerTailRomStartNumber: auxiliary.romEndNumber,
        ownerTailRomEndNumber: auxiliary.romEndNumber,
        ownerTailVramStartNumber: auxiliary.vramEndNumber,
        ownerTailVramEndNumber: auxiliary.vramEndNumber,
      });
      return targets;
    }],
    ['alignment', (targets) => {
      targets[1].auxiliarySections[0].alignment = 4;
      return targets;
    }],
    ['assembly chunk', (targets) => {
      targets[1].chunkIndex += 1;
      return targets;
    }],
    ['output section', (targets) => {
      targets[1].auxiliarySections[0].outputSection = '.ob64.r5130';
      return targets;
    }],
  ].map(([name, mutate]) => expectRejection(`shared auxiliary ${name}`, () => (
    validateAuxiliaryOwnerGroups(mutate(makeSharedAuxiliaryTargets()))
  )));
  const mutateCanaryAuxiliary = (mutate) => ({
    ...linkage,
    targets: linkage.targets.map((entry) => entry.symbol === canaryEntry.symbol ? {
      ...entry,
      auxiliarySections: [mutate({
        ...entry.auxiliarySections[0],
        preservedTail: { ...canonicalTailFixture },
      })],
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
    multiOwnerContract: { path: path.relative(ROOT, MULTI_OWNER_CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(MULTI_OWNER_CONFIG_PATH) },
    legacyContract: { path: path.relative(ROOT, LEGACY_CONFIG_PATH).replace(/\\/g, '/'), sha256: sha256File(LEGACY_CONFIG_PATH) },
    targetCount: active.targets.length,
    toolchain: active.toolchain.identity,
    rejectedToolchainMutations,
    rejectedLinkageMutations,
    rejectedCompilerTextMutations,
    rejectedFunctionPaddingMutations,
    rejectedMultiOwnerMutations,
    rejectedAuxiliaryMutations,
    rejectedLoadSlabAuxiliaryMutations,
    rejectedSharedAuxiliaryMutations,
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
