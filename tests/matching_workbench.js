#!/usr/bin/env node
'use strict';

const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const path = require('path');
const { EventEmitter } = require('events');
const {
  bufferFromWords,
  compareMips,
  targetMetrics,
} = require('../tools/lib/matching/mips_analysis');
const {
  assertCandidateComparisonInputs,
  assertCandidateComparisonResult,
  compareCaseCfg,
  mapCommandEntries,
  resolveCandidateComparisonContract,
  resolveCommandEntry,
} = require('../tools/lib/matching/case_cfg');
const {
  digest,
  loadWorkbenchModel,
  resolveTarget,
  targetRecord,
} = require('../tools/lib/matching/target_model');
const { collisionSafeGroups } = require('../tools/lib/matching/family');
const { buildTargetContext, targetInstructions } = require('../tools/lib/matching/context');
const { discoverOverlayJumpTables, emitM2cAssembly } = require('../tools/lib/matching/assembly');
const {
  applyGenerationTransforms,
  compilableM2cSource,
  directConditionalReturns,
  explicitByteCursorSteps,
  groupGenerationVariants,
  materializeMaskedComparison,
  m2cDiagnostics,
  m2cFailure,
  portableM2cArguments,
  preloadByteBeforeZeroStore,
  preserveGprArgumentGaps,
  widenNarrowReturns,
} = require('../tools/lib/matching/m2c');
const {
  CONFIG_PATH: PHASE7_CONFIG_PATH,
  ROOT,
  sha256File,
} = require('../tools/lib/phase7_conventional');
const { requestStore } = require('../tools/lib/matching/store');
const {
  MATCHING_ROOT,
  candidateRecord,
  compileArtifactDirectory,
} = require('../tools/lib/matching/compiler');
const { compareProbes } = require('../tools/lib/matching/probe');
const {
  adjustSectionAssembly,
  legalizeCop1BinaryAssembly,
  verifyAuxiliaryPaddingBytes,
} = require('../tools/lib/phase8_matching_c');
const {
  addTargetSummary,
  buildSweepIdentity,
  normalizeSweepJobs,
  runParallelTargets,
  selectSweepVariants,
  summarizeEnsemble,
} = require('../tools/lib/matching/sweep');
const { boundedSweepResult, compactComparison, parseArgs } = require('../tools/match');

function fail(message) {
  throw new Error(`matching workbench test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rType(rs, rt, rd, funct) {
  return ((rs << 21) | (rt << 16) | (rd << 11) | funct) >>> 0;
}

function iType(op, rs, rt, immediate) {
  return ((op << 26) | (rs << 21) | (rt << 16) | (immediate & 0xFFFF)) >>> 0;
}

function jType(op, address) {
  return ((op << 26) | ((address >>> 2) & 0x03FFFFFF)) >>> 0;
}

function expectError(pattern, callback) {
  try { callback(); } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return;
  }
  fail(`expected error was not raised: ${pattern}`);
}

async function expectAsyncError(pattern, callback) {
  try { await callback(); } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return;
  }
  fail(`expected async error was not raised: ${pattern}`);
}

function classifierTests() {
  const jrRa = rType(31, 0, 0, 0x08);
  const nop = 0;
  const exact = bufferFromWords([rType(4, 5, 2, 0x21), jrRa, nop]);
  const exactComparison = compareMips(exact, Buffer.from(exact), { start: 0x80000000 });
  assert(exactComparison.schemaVersion === 2 && exactComparison.primaryClass === 'exact-bytes', 'exact bytes were not schema-v2 exact');
  assert(exactComparison.differingInstructions === 0 && exactComparison.differingBytes === 0, 'exact mismatch counts were nonzero');
  assert(exactComparison.relocationMaskedExact, 'exact bytes lost relocation-masked compatibility');
  assert(exactComparison.labels[0].category === 'exact', 'exact evidence label was missing');

  const renamed = bufferFromWords([rType(4, 5, 3, 0x21), jrRa, nop]);
  const renamedComparison = compareMips(exact, renamed, { start: 0x80000000 });
  assert(renamedComparison.primaryClass === 'register-allocation-only', 'register-only difference was misclassified');
  assert(!renamedComparison.labels.some((label) => label.category === 'scheduling-or-block-order'),
    'register-only difference received false scheduling guidance');

  const immediateA = bufferFromWords([iType(0x09, 4, 2, 1), jrRa, nop]);
  const immediateB = bufferFromWords([iType(0x09, 4, 2, 2), jrRa, nop]);
  const immediateComparison = compareMips(immediateA, immediateB, { start: 0x80000000 });
  assert(immediateComparison.primaryClass === 'immediate-or-signedness', 'immediate difference was misclassified');
  assert(!immediateComparison.labels.some((label) => label.category === 'scheduling-or-block-order'),
    'immediate-only difference received false scheduling guidance');
  const unknownRelocation = { offset: 0, type: 'R_MIPS_UNKNOWN', symbol: 'unknown_target', section: '.rel.text' };
  const unknownComparison = compareMips(immediateA, immediateB, {
    start: 0x80000000,
    actualRelocations: [unknownRelocation],
    expectedRelocations: [unknownRelocation],
  });
  assert(!unknownComparison.primaryClass.startsWith('relocation-') && !unknownComparison.relocationMaskedExact,
    'unknown relocation suppressed a real difference');
  assert(unknownComparison.relocationEvidence.actual.unknownKinds.includes('R_MIPS_UNKNOWN'),
    'unknown relocation kind was not exposed as evidence');

  const jumpA = bufferFromWords([0x0C000001, nop]);
  const jumpB = bufferFromWords([0x0C000002, nop]);
  const expectedJumpRelocation = {
    offset: '0x00000000', type: 'R_MIPS_26', symbol: 'expected_target', section: '.rel.text', addend: '0x00000004',
  };
  const normalizedActualJumpRelocation = { ...expectedJumpRelocation, offset: 0, addend: 4 };
  const identicalRelocations = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    actualRelocations: [normalizedActualJumpRelocation],
    expectedRelocations: [expectedJumpRelocation],
  });
  assert(identicalRelocations.primaryClass === 'relocation-identity-proven'
      && identicalRelocations.relocationEvidence.recordsExact === true
      && identicalRelocations.relocationEvidence.addendIdentity.proven,
  'identical normalized relocation records were not distinguished');
  assert(identicalRelocations.labels.some((label) => label.category === 'relocation-records-identical'),
    'identical relocation evidence label was missing');
  const wrongSymbolRelocations = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    expectedRelocations: [expectedJumpRelocation],
    actualRelocations: [{ ...normalizedActualJumpRelocation, symbol: 'wrong_target' }],
  });
  assert(wrongSymbolRelocations.primaryClass === 'relocation-mask-compatible'
      && wrongSymbolRelocations.relocationEvidence.recordsExact === false,
  'wrong-symbol relocation mask match was overstated');
  assert(wrongSymbolRelocations.relocationEvidence.mismatch.identityMismatchCount === 1,
    'wrong-symbol relocation mismatch evidence was missing');
  const unavailableExpectedRelocations = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    actualRelocations: [normalizedActualJumpRelocation],
    expectedRelocationsAvailable: false,
    expectedRelocationsUnavailableReason: 'synthetic unavailable contract',
  });
  assert(unavailableExpectedRelocations.primaryClass === 'relocation-mask-compatible'
      && unavailableExpectedRelocations.relocationEvidence.recordsExact === null
      && unavailableExpectedRelocations.relocationEvidence.expected.unavailableReason === 'synthetic unavailable contract',
  'unavailable expected relocation evidence was treated as an empty contract');
  const implicitJumpRelocation = {
    offset: 0, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text',
  };
  const implicitJumpAddends = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    actualRelocations: [implicitJumpRelocation],
    expectedRelocations: [implicitJumpRelocation],
  });
  assert(implicitJumpAddends.primaryClass === 'relocation-mask-compatible'
      && implicitJumpAddends.relocationEvidence.recordsExact === true
      && !implicitJumpAddends.relocationEvidence.addendIdentity.proven,
  'implicit R_MIPS_26 addends were overstated as relocation identity');
  const implicitPair = [
    { offset: 0, type: 'R_MIPS_HI16', symbol: 'pair_target', section: '.rel.text' },
    { offset: 4, type: 'R_MIPS_LO16', symbol: 'pair_target', section: '.rel.text' },
  ];
  const pairA = bufferFromWords([iType(0x0F, 0, 2, 0), iType(0x09, 2, 2, 4)]);
  const pairB = bufferFromWords([iType(0x0F, 0, 2, 1), iType(0x09, 2, 2, 8)]);
  const implicitPairComparison = compareMips(pairA, pairB, {
    start: 0x80000000,
    actualRelocations: implicitPair,
    expectedRelocations: implicitPair,
  });
  assert(implicitPairComparison.primaryClass === 'relocation-mask-compatible'
      && !implicitPairComparison.relocationEvidence.addendIdentity.proven,
  'implicit HI16/LO16 addends were overstated as relocation identity');
  const partiallyExplicitPair = implicitPair.map((record, index) => (
    index === 0 ? { ...record, addend: 4 } : record
  ));
  assert(compareMips(pairA, pairB, {
    start: 0x80000000,
    actualRelocations: partiallyExplicitPair,
    expectedRelocations: partiallyExplicitPair,
  }).primaryClass === 'relocation-mask-compatible',
  'partially explicit HI16/LO16 addends overstated the complete pair');
  const unequalAddendRelocations = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    expectedRelocations: [expectedJumpRelocation],
    actualRelocations: [{ ...normalizedActualJumpRelocation, addend: 8 }],
  });
  assert(unequalAddendRelocations.primaryClass === 'relocation-mask-compatible'
      && unequalAddendRelocations.relocationEvidence.recordsExact === false,
  'unequal explicit relocation addends were overstated');
  const missingActualAddend = compareMips(jumpA, jumpB, {
    start: 0x80000000,
    expectedRelocations: [expectedJumpRelocation],
    actualRelocations: [implicitJumpRelocation],
  });
  assert(missingActualAddend.primaryClass === 'relocation-mask-compatible'
      && missingActualAddend.relocationEvidence.recordsExact === false,
  'one-sided relocation addend evidence was overstated');

  const branchA = bufferFromWords([iType(0x04, 4, 0, 1), nop, jrRa, nop]);
  const branchB = bufferFromWords([iType(0x04, 4, 0, 2), nop, jrRa, nop]);
  assert(compareMips(branchA, branchB, { start: 0x80000000 }).primaryClass === 'cfg-mismatch', 'CFG difference was misclassified');
  const inverseBranch = bufferFromWords([iType(0x05, 4, 0, 1), nop, jrRa, nop]);
  const branchPolarity = compareMips(branchA, inverseBranch, { start: 0x80000000 });
  assert(branchPolarity.primaryClass === 'cfg-mismatch'
      && branchPolarity.labels.some((label) => label.category === 'branch-polarity'),
  'branch-polarity evidence was not classified');
  const bc1f = bufferFromWords([iType(0x11, 0x08, 0, 1), nop, jrRa, nop]);
  const bc1t = bufferFromWords([iType(0x11, 0x08, 1, 1), nop, jrRa, nop]);
  const bc1Polarity = compareMips(bc1f, bc1t, { start: 0x80000000 });
  assert(bc1Polarity.labels.some((label) => label.category === 'branch-polarity')
      && !bc1Polarity.labels.some((label) => label.category === 'register-allocation'),
  'BC1F/BC1T polarity was not classified');
  const delaySlotShapeA = bufferFromWords([
    iType(0x04, 4, 0, 1), 0x08000003, iType(0x09, 2, 2, 1), jrRa, nop,
  ]);
  const delaySlotShapeB = bufferFromWords([
    iType(0x04, 4, 0, 1), 0x08000003, iType(0x09, 2, 2, 2), jrRa, nop,
  ]);
  assert(compareMips(delaySlotShapeA, delaySlotShapeB, { start: 0x80000000 }).labels
    .some((label) => label.category === 'secondary-entry-or-delay-slot-uncertainty'),
  'delay-slot-shaped structural uncertainty was not surfaced');

  const scheduleA = bufferFromWords([iType(0x09, 4, 2, 1), iType(0x09, 5, 3, 2), jrRa, nop]);
  const scheduleB = bufferFromWords([iType(0x09, 5, 3, 2), iType(0x09, 4, 2, 1), jrRa, nop]);
  assert(compareMips(scheduleA, scheduleB, { start: 0x80000000 }).primaryClass === 'scheduling-or-block-order', 'scheduling difference was misclassified');

  const stackA = bufferFromWords([iType(0x09, 29, 29, -16), iType(0x2B, 29, 31, 12), jrRa, iType(0x09, 29, 29, 16)]);
  const stackB = bufferFromWords([iType(0x09, 29, 29, -24), iType(0x2B, 29, 31, 20), jrRa, iType(0x09, 29, 29, 24)]);
  const stackComparison = compareMips(stackA, stackB, { start: 0x80000000 });
  assert(stackComparison.primaryClass === 'stack-layout', 'stack-layout difference was misclassified');
  assert(stackComparison.labels.some((label) => label.category === 'stack-layout-or-offset-family')
      && stackComparison.labels.some((label) => label.category === 'constant-or-immediate-construction'),
  'multi-label stack/immediate evidence was not retained');
  const stackLabel = stackComparison.labels.find((label) => label.category === 'stack-layout-or-offset-family');
  assert(stackLabel.searchFamilies.length > 0 && stackLabel.avoidUntilResolved.length > 0
      && ['high', 'moderate', 'low'].includes(stackLabel.likelihood),
  'mismatch label omitted bounded likelihood/search/exclusion guidance');

  const signedLoad = bufferFromWords([iType(0x20, 4, 2, 0), jrRa, nop]);
  const unsignedLoad = bufferFromWords([iType(0x24, 4, 2, 0), jrRa, nop]);
  const widthComparison = compareMips(signedLoad, unsignedLoad, { start: 0x80000000 });
  assert(widthComparison.primaryClass === 'load-store-width-or-signedness'
      && widthComparison.labels.some((label) => label.category === 'load-store-width-or-signedness'),
  'load signedness mismatch was not classified');

  const expressionA = bufferFromWords([iType(0x09, 4, 2, 1), jrRa, nop]);
  const expressionB = bufferFromWords([iType(0x0D, 4, 2, 1), jrRa, nop]);
  assert(compareMips(expressionA, expressionB, { start: 0x80000000 }).primaryClass === 'opcode-or-expression', 'opcode/expression difference was misclassified');

  const lengthComparison = compareMips(exact, exact.subarray(0, 8), { start: 0x80000000 });
  assert(lengthComparison.primaryClass === 'length-mismatch', 'length difference was misclassified');
  assert(lengthComparison.differingInstructions === 1 && lengthComparison.differingBytes === 4,
    'length excess was omitted from exact mismatch counts');
  const compact = compactComparison(wrongSymbolRelocations);
  assert(compact.topLabels.length <= 3 && compact.labelsOmitted >= 0
      && compact.relocationEvidence.expected.records === undefined
      && compact.relocationEvidence.addendIdentity.proven === false,
  'public classifier summary was unbounded');
  assert(targetMetrics(exact, 0x80000000).leaf, 'simple return fixture was not a leaf');
}

function caseCfgTests() {
  const start = 0x80200000;
  const nop = 0;
  const jrRa = rType(31, 0, 0, 0x08);
  const expected = bufferFromWords([
    iType(0x09, 0, 8, 0),
    iType(0x04, 3, 8, 6),
    nop,
    iType(0x09, 0, 8, 1),
    iType(0x04, 3, 8, 7),
    nop,
    jType(0x02, start + 0x48),
    nop,
    jType(0x03, 0x80301000),
    iType(0x09, 5, 5, 1),
    jType(0x02, start + 0x48),
    nop,
    iType(0x09, 5, 5, 1),
    jType(0x03, 0x80302000),
    nop,
    jType(0x02, start + 0x48),
    nop,
    nop,
    jrRa,
    nop,
  ]);
  const actual = bufferFromWords([
    iType(0x09, 0, 9, 0),
    iType(0x04, 3, 9, 6),
    nop,
    iType(0x09, 0, 9, 1),
    iType(0x04, 3, 9, 7),
    nop,
    jType(0x02, 0x50),
    nop,
    jType(0x03, 0),
    iType(0x09, 6, 6, 1),
    jType(0x02, 0x50),
    nop,
    iType(0x09, 6, 6, 1),
    jType(0x03, 0),
    nop,
    jType(0x02, 0x48),
    nop,
    nop,
    jType(0x02, 0x50),
    nop,
    jrRa,
    nop,
  ]);
  const expectedDispatch = {
    dispatchOffset: 0,
    bodyOffset: 0x20,
    valueRegister: 3,
    localJumpMode: 'absolute',
  };
  const actualDispatch = {
    dispatchOffset: 0,
    bodyOffset: 0x20,
    valueRegister: 3,
    localJumpMode: 'section-relative',
  };
  const commands = [{ value: 0 }, { value: 1 }];
  const expectedEntries = mapCommandEntries(expected, start, expectedDispatch, commands, 'fixture expected');
  assert(expectedEntries.map((entry) => entry.entryOffset).join(',') === '32,48', 'case dispatch entries were not mapped by value');
  const actualRelocations = [
    { offset: 0x18, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text' },
    { offset: 0x20, type: 'R_MIPS_26', symbol: 'callee_a', section: '.rel.text' },
    { offset: 0x28, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text' },
    { offset: 0x34, type: 'R_MIPS_26', symbol: 'callee_b', section: '.rel.text' },
    { offset: 0x3C, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text' },
    { offset: 0x48, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text' },
  ];
  const candidate = {
    candidateId: 'A'.repeat(64),
    runId: 'B'.repeat(64),
    sourceClass: 'PURE_C',
  };
  const comparisonOptions = {
    start,
    symbol: 'fixture',
    commands,
    expectedDispatch,
    actualDispatch,
    expectedTails: [{ name: 'post-command', offset: 0x48 }],
    actualTails: [{ name: 'post-command', offset: 0x50 }],
    actualRelocations,
    symbolForAddress: (address) => ({ 0x80301000: 'callee_a', 0x80302000: 'callee_b' }[address] || `target_${address.toString(16)}`),
    candidate,
  };
  const report = compareCaseCfg(expected, actual, comparisonOptions);
  assert(report.commandCount === 2 && report.summary.mappedCommands === 2, 'case report lost a mapped command');
  assert(report.summary.callParity === 2 && report.summary.sharedTailConvergence === 2, 'case report failed relocation-normalized calls or shared tails');
  assert(report.summary.blockCountParity === 1 && report.commands[1].actual.blockCount === report.commands[1].expected.blockCount + 1,
    'case report did not localize an extra actual block');
  assert(report.commands[0].parity.normalizedBlocks && !report.commands[1].parity.normalizedBlocks,
    'case block normalization did not ignore register names or expose the extra block');
  assert(report.schemaVersion === 2
    && report.candidate.candidateId === candidate.candidateId
    && report.candidate.runId === candidate.runId,
  'case report did not serialize candidate and run identity');
  assert(report.comparisonContract.expected.dispatch.dispatchOffset === '0x0000'
    && report.comparisonContract.expected.commandBodyOffset === '0x0020'
    && report.comparisonContract.expected.sharedTails[0].offsets[0] === '0x0048'
    && report.comparisonContract.actual.dispatch.dispatchOffset === '0x0000'
    && report.comparisonContract.actual.commandBodyOffset === '0x0020'
    && report.comparisonContract.actual.sharedTails[0].offsets[0] === '0x0050'
    && report.comparisonContract.actualInputs.dispatchOffset === '0x0000'
    && report.comparisonContract.actualInputs.commandBodyOffset === '0x0020'
    && report.comparisonContract.actualInputs.sharedTails[0] === 'post-command=0x0050',
  'case report omitted or changed the expected/actual comparison contract');
  const repeatedReport = compareCaseCfg(expected, actual, comparisonOptions);
  assert(JSON.stringify(repeatedReport) === JSON.stringify(report),
    'identical case-CFG inputs did not reproduce the same report');
  const resultContract = {
    candidateId: candidate.candidateId,
    expectedSummary: report.summary,
    expectedResultDigest: report.resultDigest,
  };
  assertCandidateComparisonResult(resultContract, repeatedReport);
  expectError(/result summary differs/, () => assertCandidateComparisonResult({
    ...resultContract,
    expectedSummary: { ...report.summary, mappedCommands: report.summary.mappedCommands + 1 },
  }, repeatedReport));
  expectError(/result digest differs/, () => assertCandidateComparisonResult({
    ...resultContract,
    expectedResultDigest: 'C'.repeat(64),
  }, repeatedReport));
  expectError(/actual dispatch spec is missing/, () => compareCaseCfg(expected, actual, {
    ...comparisonOptions, actualDispatch: undefined,
  }));
  expectError(/actual body offset must be a nonnegative integer/, () => compareCaseCfg(expected, actual, {
    ...comparisonOptions, actualDispatch: { ...actualDispatch, bodyOffset: undefined },
  }));
  expectError(/actual shared-tail map is empty/, () => compareCaseCfg(expected, actual, {
    ...comparisonOptions, actualTails: undefined,
  }));
  expectError(/actual shared-tail name is duplicated/, () => compareCaseCfg(expected, actual, {
    ...comparisonOptions,
    actualTails: [
      { name: 'post-command', offset: 0x50 },
      { name: 'post-command', offset: 0x54 },
    ],
  }));
  expectError(/candidate comparison identity is missing/, () => compareCaseCfg(expected, actual, {
    ...comparisonOptions, candidate: undefined,
  }));
  const candidateContract = {
    candidateId: candidate.candidateId,
    actualDispatch,
    actualTails: comparisonOptions.actualTails,
  };
  const contractMap = { schemaVersion: 2, candidateContracts: [candidateContract] };
  const resolvedContract = resolveCandidateComparisonContract(contractMap, candidate.candidateId);
  assertCandidateComparisonInputs(resolvedContract, actualDispatch, comparisonOptions.actualTails, actual.length);
  expectError(/does not resolve uniquely/, () => resolveCandidateComparisonContract({
    ...contractMap, candidateContracts: [candidateContract, { ...candidateContract }],
  }, candidate.candidateId));
  expectError(/differ from tracked candidate contract/, () => assertCandidateComparisonInputs(
    resolvedContract, { ...actualDispatch, bodyOffset: 0x24 }, comparisonOptions.actualTails, actual.length));
  expectError(/differ from tracked candidate contract/, () => assertCandidateComparisonInputs(
    resolvedContract, actualDispatch, [{ name: 'post-command', offset: 0x54 }], actual.length));
  const immediateActual = Buffer.from(actual);
  immediateActual.writeUInt32BE(iType(0x09, 6, 6, 2), 9 * 4);
  const immediateReport = compareCaseCfg(expected, immediateActual, {
    ...comparisonOptions,
    symbol: 'fixture-immediate',
  });
  assert(!immediateReport.commands[0].parity.normalizedBlocks,
    'case block normalization hid a non-relocation immediate difference');
  expectError(/duplicate value/, () => mapCommandEntries(expected, start, expectedDispatch, [0, 0], 'duplicate fixture'));
  const unknownDispatch = { ...expectedDispatch, dispatchOffset: 4 };
  expectError(/reads unknown register/, () => resolveCommandEntry(expected, start, unknownDispatch, 0, 'unknown fixture'));
}

function scratchAuxiliarySectionTests() {
  const sectionName = '.ob64.r4074';
  const switchAssembly = Buffer.from([
    '\t.text',
    'fixture:',
    '\tj\t$2',
    '\t.section\t.rodata',
    '.Ltable:',
    '\t.word\t.Lcase',
    '\t.text',
    '.Lcase:',
    '\tj\t$31',
    '',
  ].join('\n'));
  expectError(/section grammar drift/, () => adjustSectionAssembly(switchAssembly, sectionName));
  const adjusted = adjustSectionAssembly(switchAssembly, sectionName, {
    allowAuxiliaryReadOnlySections: true,
  }).toString('utf8');
  assert((adjusted.match(/\.section \.ob64\.r4074,"ax",@progbits/g) || []).length === 2,
    'scratch switch text fragments were not assigned to the target section');
  assert(adjusted.includes('\t.section\t.rodata'), 'scratch switch jump table was discarded');
  const writableAssembly = Buffer.from('\t.text\nfixture:\n\tj\t$31\n\t.section\t.data\n\t.word\t0\n');
  expectError(/non-read-only auxiliary section/, () => adjustSectionAssembly(writableAssembly, sectionName, {
    allowAuxiliaryReadOnlySections: true,
  }));
  const cop1Assembly = [
    '\tmul.s\t$f0,$f0,$f22',
    '\tadd.s $f6, $f4, $f2',
    '\t.word\t0xDEADBEEF',
    '',
  ].join('\r\n');
  const legalized = legalizeCop1BinaryAssembly(cop1Assembly);
  assert(legalized.includes('\t.word\t0x46160002\r\n'), 'scratch COP1 multiply was not encoded exactly');
  assert(legalized.includes('\t.word\t0x46022180\r\n'), 'scratch COP1 add was not encoded exactly');
  assert(legalized.includes('\t.word\t0xDEADBEEF\r\n'), 'existing raw word changed during COP1 legalization');
  const adjustedCop1 = adjustSectionAssembly(Buffer.from(`\t.text\r\nfixture:\r\n${cop1Assembly}`), sectionName, {
    allowAuxiliaryReadOnlySections: true,
    legalizeCop1BinaryInstructions: true,
  }).toString('utf8');
  assert(adjustedCop1.includes('\t.word\t0x46160002\r\n'), 'scratch section adjustment omitted COP1 legalization');
}

function canonicalAuxiliarySectionTests() {
  const sectionName = '.ob64.r5108';
  const auxiliarySections = [{ compilerSection: '.rodata', outputSection: '.ob64.r5131' }];
  const switchAssembly = Buffer.from([
    '\t.text',
    'fixture:',
    '\tjr\t$2',
    '\t.section\t.rodata',
    '\t.align\t3',
    '.Ltable:',
    '\t.word\t.Lcase',
    '\t.text',
    '.Lcase:',
    '\tjr\t$31',
    '',
  ].join('\n'));
  const adjusted = adjustSectionAssembly(switchAssembly, sectionName, { auxiliarySections }).toString('utf8');
  assert((adjusted.match(/\.section \.ob64\.r5108,"ax",@progbits/g) || []).length === 2,
    'canonical switch text regions were not assigned exactly');
  assert((adjusted.match(/\.section \.ob64\.r5131,"a",@progbits/g) || []).length === 1,
    'canonical switch table was not assigned exactly');
  const removeSectionDirectives = (value) => value.split(/\r?\n/)
    .filter((line) => !/^\s*\.(?:text|section)\b/.test(line))
    .join('\n');
  assert(removeSectionDirectives(adjusted) === removeSectionDirectives(switchAssembly.toString('utf8')),
    'canonical auxiliary assignment changed a non-section compiler-assembly line');

  const mutation = (lines) => Buffer.from(lines.join('\n'));
  const rejected = [
    ['writable .data', mutation(['\t.text', 'fixture:', '\t.section\t.data', '\t.word\t0', '\t.text', ''])],
    ['.bss', mutation(['\t.text', 'fixture:', '\t.section\t.bss', '\t.word\t0', '\t.text', ''])],
    ['unknown section', mutation(['\t.text', 'fixture:', '\t.section\t.mystery', '\t.word\t0', '\t.text', ''])],
    ['compiler flags', mutation(['\t.text', 'fixture:', '\t.section\t.rodata,"aw"', '\t.word\t0', '\t.text', ''])],
    ['repeated table', mutation(['\t.text', 'fixture:', '\t.section\t.rodata', '\t.word\t0', '\t.section\t.rodata', '\t.word\t0', '\t.text', ''])],
    ['missing text resume', mutation(['\t.text', 'fixture:', '\t.section\t.rodata', '\t.word\t0', ''])],
    ['repeated text region', mutation(['\t.text', 'fixture:', '\t.text', '\t.section\t.rodata', '\t.word\t0', '\t.text', ''])],
  ];
  for (const [name, assembly] of rejected) {
    expectError(/auxiliary-section grammar drift/, () => adjustSectionAssembly(assembly, sectionName, { auxiliarySections }));
    assert(name.length > 0, 'canonical auxiliary rejection name drift');
  }
  expectError(/auxiliary-section grammar drift/, () => adjustSectionAssembly(switchAssembly, sectionName, {
    auxiliarySections: [{ compilerSection: '.rodata', outputSection: sectionName }],
  }));
  expectError(/policies cannot be combined/, () => adjustSectionAssembly(switchAssembly, sectionName, {
    auxiliarySections,
    allowAuxiliaryReadOnlySections: true,
  }));

  const paddingContract = {
    bytes: 40,
    entryBytes: 36,
    trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: 'DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119',
  };
  const paddingEvidence = verifyAuxiliaryPaddingBytes(
    Buffer.alloc(40),
    paddingContract,
    'canonical auxiliary padding fixture',
  );
  assert(paddingEvidence.entryBytes === 36
      && paddingEvidence.trailingPaddingBytes === 4
      && paddingEvidence.trailingPaddingSha256 === paddingContract.expectedTrailingPaddingSha256,
  'canonical auxiliary padding evidence drift');
  const nonzeroPadding = Buffer.alloc(40);
  nonzeroPadding[39] = 1;
  expectError(/trailing-padding bytes drift/, () => verifyAuxiliaryPaddingBytes(
    nonzeroPadding,
    paddingContract,
    'nonzero auxiliary padding fixture',
  ));
  expectError(/trailing-padding metadata is malformed/, () => verifyAuxiliaryPaddingBytes(
    Buffer.alloc(40),
    { ...paddingContract, entryBytes: 40 },
    'misbounded auxiliary padding fixture',
  ));
}

function familyTests() {
  const items = [
    { targetId: 'A', symbol: 'a', romStart: 0, bytes: 4, value: 'same' },
    { targetId: 'B', symbol: 'b', romStart: 4, bytes: 4, value: 'same' },
    { targetId: 'C', symbol: 'c', romStart: 8, bytes: 4, value: 'different' },
    { targetId: 'D', symbol: 'd', romStart: 12, bytes: 4, value: 'different' },
  ];
  const groups = collisionSafeGroups(items, 'fixture', (item) => item.value, () => 'FORCED-COLLISION');
  assert(groups.length === 2, 'forced index collision merged unequal exact representations');
  assert(groups.every((group) => group.members.length === 2), 'collision-safe groups lost exact peers');
}

function m2cAdapterTests() {
  const source = compilableM2cSource([
    'Warning: missing "jr $ra" in final block',
    'M2C_UNK callee(void); /* extern */',
    'struct fixture_stack {',
    '    /* 0x00 */ char pad[4];',
    '}; /* size = 0x4 */',
    'f32 fixture(void) {',
    '    const char *literal = "/* retained literal */";',
    '    char slash = \'/\'; // generated line comment',
    '    void *pointer_word = *(void *)0x80000000;',
    '    *(void *)0x80000004 = pointer_word;',
    '    callee();',
    '    return M2C_BITWISE(f32, 0x3F800000U);',
    '}',
    '',
  ].join('\n'));
  assert(source.includes('typedef float f32;'), 'm2c adapter omitted the floating-point type prelude');
  assert(!source.includes('Warning:'), 'm2c warning leaked into direct cc1 input');
  assert(!source.includes('/* extern */') && !source.includes('/* 0x00 */') && !source.includes('/* size = 0x4 */'), 'm2c block comment leaked into direct cc1 input');
  assert(!source.includes('// generated line comment'), 'm2c line comment leaked into direct cc1 input');
  assert(source.includes('"/* retained literal */"') && source.includes("'/'"), 'm2c comment stripping damaged a string or character literal');
  assert(!source.includes('M2C_BITWISE'), 'm2c valid-syntax macro was not expanded');
  assert(!source.includes('*(void *)') && source.match(/\*\(void \*\*\)/g)?.length === 2, 'invalid m2c void dereferences were not converted to pointer-word lvalues');
  const nestedField = compilableM2cSource('s32 fixture(s32 **arg0) { return M2C_FIELD(M2C_FIELD(arg0, s32 **, 0), s32 *, 4); }');
  assert(!nestedField.includes('M2C_FIELD') && nestedField.includes('s32 *'), 'nested m2c valid-syntax fields were not expanded recursively');
  assert(!compilableM2cSource('s32 fixture(void) { return NULL; }').includes('NULL'), 'm2c NULL token was not lowered for direct cc1 input');
  const diagnostics = m2cDiagnostics('Warning: missing return\nvoid fixture(void) {}\n');
  assert(diagnostics.length === 1 && diagnostics[0].message === 'missing return', 'm2c warning was not retained as a diagnostic');
  assert(m2cFailure('/*\nDecompilation failure in function fixture:\n\nCannot find branch target\n*/')?.includes('Cannot find branch target'), 'm2c generation failure detail was discarded');
  const portable = portableM2cArguments([path.join(ROOT, 'build', 'matching', 'fixture.s')], { root: path.resolve(ROOT, '..', 'tools', 'm2c') });
  assert(portable[0] === '<repo>/build/matching/fixture.s', 'm2c candidate provenance retained a machine-local repository path');
  const generationGroups = groupGenerationVariants([
    { name: 'base', arguments: ['--valid-syntax'] },
    { name: 'local-rule', arguments: ['--valid-syntax'], transforms: ['fixture'] },
    { name: 'gotos', arguments: ['--valid-syntax', '--gotos-only'] },
  ]);
  assert(generationGroups.length === 2 && generationGroups[0].variants.map((row) => row.name).join(',') === 'base,local-rule', 'identical m2c invocations were not grouped across local rulesets');

  const oneGap = preserveGprArgumentGaps('s32 fixture(s32 arg1) { return arg1 + 2; }', 'fixture');
  assert(oneGap.applied && oneGap.source.includes('s32 m2c_unused_arg0, s32 arg1'), 'missing first GPR argument was not preserved');
  const middleGap = preserveGprArgumentGaps('void fixture(s32 arg0, s8 arg2) { use(arg2); }', 'fixture');
  assert(middleGap.applied && middleGap.source.includes('s32 arg0, s32 m2c_unused_arg1, s8 arg2'), 'missing middle GPR argument was not preserved');
  assert(!preserveGprArgumentGaps('void fixture(s32 arg0, s8 arg1) {}', 'fixture').applied, 'contiguous GPR arguments were rewritten');
  assert(!preserveGprArgumentGaps('void fixture(f32 arg1) {}', 'fixture').applied, 'floating-point ABI gap was guessed as a GPR');
  assert(!preserveGprArgumentGaps('void fixture(s32 value) {}', 'fixture').applied, 'non-m2c parameter names were rewritten');

  const loadFirstInput = [
    'void *fixture(void *arg0, u8 *arg1) {',
    '    (*(s16 *)((s8 *)(arg0) + (0xB2))) = 0;',
    '    (*(s16 *)((s8 *)(arg0) + (0xB4))) = (s16) *arg1;',
    '    return arg1 + 1;',
    '}',
  ].join('\n');
  const loadFirst = preloadByteBeforeZeroStore(loadFirstInput, 'fixture');
  assert(loadFirst.applied, 'bounded source-byte preload pattern was not recognized');
  assert(loadFirst.source.indexOf('u8 m2c_loaded_byte = *arg1;') < loadFirst.source.indexOf('= 0;'), 'source byte was not loaded before the zero store');
  assert(loadFirst.source.includes('= (s16) m2c_loaded_byte;'), 'preloaded byte did not replace the later dereference');
  assert(!preloadByteBeforeZeroStore(loadFirstInput.replace('return arg1 + 1;', 'side_effect();\n    return arg1 + 1;'), 'fixture').applied, 'multi-statement body received the narrow scheduling transform');
  assert(!preloadByteBeforeZeroStore(loadFirstInput.replace('(arg0) + (0xB2)', '(arg1) + (0xB2)'), 'fixture').applied, 'possibly aliasing zero-store address received the preload transform');
  const combined = applyGenerationTransforms('s32 fixture(s32 arg1) { return arg1 + 2; }', ['preserve-gpr-argument-gaps'], { symbol: 'fixture' });
  assert(combined.applied.length === 1 && combined.source.includes('m2c_unused_arg0'), 'configured transform did not record exact provenance');

  const directReturnInput = [
    's32 fixture(s32 arg0) {',
    '    s32 var_v0_9;',
    '',
    '    var_v0_9 = -1;',
    '    if (arg0 < 0x32) {',
    '        var_v0_9 = arg0;',
    '    }',
    '    return var_v0_9;',
    '}',
  ].join('\n');
  const directReturn = directConditionalReturns(directReturnInput, 'fixture');
  assert(directReturn.applied && directReturn.source.includes('if (!(arg0 < 0x32))'), 'conditional result temporary was not converted to direct returns');
  assert(!directReturn.source.includes('var_v0_9'), 'removed conditional result temporary survived');

  const widened = widenNarrowReturns(directReturnInput.replace(/^s32/, 's8').replace(/    s32 var_v0_9;/, '    s8 var_v0_9;'), 'fixture');
  assert(widened.applied && widened.source.startsWith('s32 fixture') && widened.source.includes('s32 var_v0_9;'), 'narrow return and result temporary were not widened together');

  const directCursorInput = [
    'void *fixture(void *arg0, u8 *arg1) {',
    '    u8 temp_v0_7;',
    '',
    '    temp_v0_7 = *arg1;',
    '    (*(u8 *)((s8 *)(arg0) + (0xB8))) = temp_v0_7;',
    '    if (temp_v0_7 != 0) {',
    '        use(temp_v0_7);',
    '    }',
    '    return arg1 + 1;',
    '}',
  ].join('\n');
  const directCursor = explicitByteCursorSteps(directCursorInput, 'fixture');
  assert(directCursor.applied && directCursor.source.indexOf('arg1 += 1;') < directCursor.source.indexOf('= temp_v0_7;'), 'direct cursor advance was not retained at the load');
  assert(directCursor.source.includes('return arg1;'), 'direct cursor return still hid the advance');

  const packedCursorInput = [
    'void *fixture(void *arg0, void *arg1) {',
    '    (*(s16 *)((s8 *)(arg0) + (0xB4))) = 0;',
    '    (*(s16 *)((s8 *)(arg0) + (0xB2))) = (s16) ((*(u8 *)((s8 *)(arg1) + (1))) | ((*(u8 *)((s8 *)(arg1) + (0))) << 8));',
    '    return arg1 + 1 + 1;',
    '}',
  ].join('\n');
  const packedCursor = explicitByteCursorSteps(packedCursorInput, 'fixture');
  assert(packedCursor.applied && packedCursor.details.pattern === 'packed-word', 'packed word cursor pattern was not recognized');
  assert(packedCursor.source.includes('m2c_high_byte = *arg1;') && packedCursor.source.includes('m2c_low_byte = *arg1;'), 'packed word loads were not made sequential');

  const maskedInput = [
    's32 fixture(void *arg0) {',
    '    s32 result;',
    '    result = 0;',
    '    if ((*(s32 *)arg0) == 1) {',
    '        result = ((*(s32 *)arg0) & 0x40) == 0;',
    '    }',
    '    return result;',
    '}',
  ].join('\n');
  const masked = materializeMaskedComparison(maskedInput, 'fixture');
  assert(masked.applied && masked.source.includes('m2c_masked_value = ((*(s32 *)arg0) & 0x40);'), 'masked comparison did not retain the intermediate value');
  expectError(/unknown m2c generation transform/, () => applyGenerationTransforms('void fixture(void) {}', ['unknown'], { symbol: 'fixture' }));
}

function compilerArtifactPathTests() {
  const runId = 'A'.repeat(64);
  const longSymbol = 'boot_display_list_vector_distance_and_transform_prefix';
  const artifactDir = compileArtifactDirectory(runId);
  const compilerOutput = path.join(artifactDir, 'generated', 'c', `${longSymbol}.compiler.s`);
  const legacyOutput = path.join(MATCHING_ROOT, 'targets', longSymbol, 'runs', runId, 'generated', 'c', `${longSymbol}.compiler.s`);
  assert(path.relative(MATCHING_ROOT, artifactDir) === path.join('runs', runId), 'compiler artifacts did not use the symbol-independent run root');
  assert(!artifactDir.includes(longSymbol), 'compiler artifact directory retained the target symbol');
  assert(compilerOutput.length < legacyOutput.length, 'compiler artifact path was not shortened for long symbols');
  assert(path.relative(ROOT, compilerOutput).length < 200, 'compiler artifact path exceeded the repository-relative legacy-tool budget');
}

function candidateIdentityTests() {
  const target = { targetId: 'TARGET-FIXTURE' };
  const first = candidateRecord(target, 'void fixture(void) {}\n', { origin: 'm2c', metadata: { pass: 1 } });
  const second = candidateRecord(target, 'void fixture(void) {}\n', { origin: 'manual', metadata: { pass: 2 } });
  assert(first.candidateId === second.candidateId, 'identical target and source were split by provenance');
  assert(first.observationId !== second.observationId, 'distinct candidate provenance observations were collapsed');
}

function probeComparisonTests() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-match-probe-'));
  const left = path.join(directory, 'left');
  const right = path.join(directory, 'right');
  fs.mkdirSync(left);
  fs.mkdirSync(right);
  try {
    const report = { schemaVersion: 1, probeId: 'PROBE', dumps: [{ name: 'fixture.rtl' }] };
    fs.writeFileSync(path.join(left, 'probe-report.json'), JSON.stringify({ ...report, probeId: 'LEFT' }));
    fs.writeFileSync(path.join(right, 'probe-report.json'), JSON.stringify({ ...report, probeId: 'RIGHT' }));
    fs.writeFileSync(path.join(left, 'fixture.rtl'), 'same\n');
    fs.writeFileSync(path.join(right, 'fixture.rtl'), 'same\n');
    assert(compareProbes(path.join(left, 'probe-report.json'), path.join(right, 'probe-report.json')).firstDivergentPass === null, 'equal compiler probes diverged');
    fs.writeFileSync(path.join(right, 'fixture.rtl'), 'different\n');
    assert(compareProbes(path.join(left, 'probe-report.json'), path.join(right, 'probe-report.json')).firstDivergentPass === 'rtl', 'first compiler probe divergence was not identified');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function ensembleSummaryTests() {
  const summary = summarizeEnsemble([
    {
      symbol: 'baseline_and_alt', variants: [
        { variant: 'structured', exactBytes: true, candidateId: 'BASE-A' },
        { variant: 'alternate', exactBytes: true, candidateId: 'ALT-A' },
      ],
    },
    {
      symbol: 'baseline_only', variants: [
        { variant: 'structured', exactBytes: true, candidateId: 'BASE-B' },
        { variant: 'alternate', exactBytes: false, candidateId: 'ALT-B' },
      ],
    },
    {
      symbol: 'alternate_only', variants: [
        { variant: 'structured', exactBytes: false, candidateId: 'BASE-C' },
        { variant: 'alternate', exactBytes: true, candidateId: 'ALT-C' },
      ],
    },
  ], ['structured', 'alternate']);
  assert(summary.exactTargetCount === 3, 'ensemble exact target count double-counted overlapping rulesets');
  const baseline = summary.ruleSets.find((row) => row.name === 'structured');
  const alternate = summary.ruleSets.find((row) => row.name === 'alternate');
  assert(baseline.exactCount === 2 && alternate.exactCount === 2, 'per-ruleset exact counts were not retained');
  assert(alternate.gainedVsBaseline[0].symbol === 'alternate_only', 'regressive ruleset gain was not recorded');
  assert(alternate.lostVsBaseline[0] === 'baseline_only', 'regressive ruleset loss was not recorded');
  assert(alternate.uniqueToRuleSet[0].candidateId === 'ALT-C', 'ruleset-unique exact candidate identity was lost');
  const shared = summary.functionMembership.find((row) => row.symbol === 'baseline_and_alt');
  assert(shared.matches.map((row) => row.ruleSet).join(',') === 'structured,alternate', 'function-to-ruleset membership was incomplete');
  assert(shared.matches.map((row) => row.candidateId).join(',') === 'BASE-A,ALT-A', 'function-to-candidate membership was incomplete');

  const bounded = boundedSweepResult({
    selector: { variants: ['structured', 'alternate'], symbols: ['fixture', 'second', 'third'] },
    summary: { targets: [{ symbol: 'fixture', variants: [] }], ensemble: summary },
  }, false, 1);
  assert(bounded.summary.targets === undefined && bounded.summary.targetsOmitted === 0, 'bounded sweep output retained full target rows');
  assert(bounded.selector.symbols === undefined
    && bounded.selector.symbolSamples[0] === 'fixture'
    && bounded.selector.symbolsOmitted === 2, 'bounded sweep output retained the complete selector symbol list');
  assert(bounded.summary.ensemble.functionMembership.samples.length === 1
    && bounded.summary.ensemble.functionMembership.omitted === 2, 'bounded sweep output did not bound ensemble membership');
  assert(bounded.summary.ensemble.ruleSets[0].matches.omitted === 1, 'bounded sweep output did not bound ruleset matches');
  const noisy = boundedSweepResult({
    selector: { variants: ['structured'] },
    summary: {
      targets: [{
        symbol: 'fixture', bytes: 4, variants: [{
          variant: 'structured', generated: true, status: 'failed', error: 'very long compiler output', exactBytes: false,
        }],
      }],
      ensemble: summary,
    },
  }, false, 5);
  assert(noisy.summary.targetSamples[0].variants[0].error === undefined
    && noisy.summary.targetSamples[0].variants[0].hasError, 'bounded sweep output retained verbose compiler errors');
  const complete = boundedSweepResult({
    selector: { variants: ['structured'], symbols: ['fixture', 'second'] },
    summary: { targets: [{ symbol: 'fixture', variants: [] }], ensemble: summary },
  }, true, 1);
  assert(complete.selector.symbols.length === 2 && complete.summary.targets.length === 1, 'include-targets did not retain complete sweep rows');
  const alreadyBounded = boundedSweepResult({
    selector: { variants: ['structured', 'alternate'] },
    summary: { targetSamples: [{ symbol: 'sample' }], targetsOmitted: 9, ensemble: summary },
  }, false, 1);
  assert(alreadyBounded.summary.targetSamples[0].symbol === 'sample' && alreadyBounded.summary.targetsOmitted === 9, 'stored bounded target samples were discarded');
}

function sweepParallelismTests() {
  assert(normalizeSweepJobs() === 1 && normalizeSweepJobs(8) === 8, 'valid sweep worker counts were not retained');
  expectError(/positive integer/, () => normalizeSweepJobs(0));
  expectError(/must not exceed 32/, () => normalizeSweepJobs(33));
  const parsed = parseArgs(['--jobs', '8', '--no-context']);
  assert(parsed.options.jobs === '8' && parsed.options['no-context'] === true, 'sweep jobs option was not parsed');

  const identityWorkbench = {
    modelId: 'MODEL',
    config: {
      m2c: {
        repository: 'https://example.invalid/m2c.git', commit: 'COMMIT', tree: 'TREE', target: 'mips-gcc-c',
        variants: [
          { name: 'structured-return-flow', arguments: ['--valid-syntax'], transforms: ['direct-conditional-returns'] },
          { name: 'structured-cursor-steps', arguments: ['--valid-syntax'], transforms: ['explicit-byte-cursor-steps'] },
        ],
      },
      limits: { maximumCapturedOutputBytes: 1024 },
    },
  };
  const identityTargets = [{ targetId: 'TARGET-1' }, { targetId: 'TARGET-2' }];
  const identityM2c = { commit: 'COMMIT', tree: 'TREE' };
  const identityOptions = { compile: true, generateContext: false, useContext: false, runtimeContext: false };
  const identityVariants = selectSweepVariants(identityWorkbench, ['structured-return-flow']);
  const oneJob = buildSweepIdentity(identityWorkbench, { maxSize: 256 }, identityTargets, identityVariants, { ...identityOptions, jobs: 1 }, identityM2c);
  const eightJobs = buildSweepIdentity(identityWorkbench, { maxSize: 256 }, identityTargets, identityVariants, { ...identityOptions, jobs: 8 }, identityM2c);
  assert(oneJob.sweepId === eightJobs.sweepId, 'worker count fragmented sweep identity');
  const runtime = buildSweepIdentity(identityWorkbench, { maxSize: 256 }, identityTargets, identityVariants, { ...identityOptions, runtimeContext: true }, identityM2c);
  assert(runtime.sweepId !== oneJob.sweepId, 'runtime context was omitted from sweep identity');
  const changedWorkbench = JSON.parse(JSON.stringify(identityWorkbench));
  changedWorkbench.config.m2c.variants[0].transforms.push('new-rule');
  const changedVariants = selectSweepVariants(changedWorkbench, ['structured-return-flow']);
  const changedRule = buildSweepIdentity(changedWorkbench, { maxSize: 256 }, identityTargets, changedVariants, identityOptions, identityM2c);
  assert(changedRule.sweepId !== oneJob.sweepId, 'complete ruleset definition was omitted from sweep identity');
  const changedTargets = buildSweepIdentity(identityWorkbench, { maxSize: 256 }, [{ targetId: 'TARGET-3' }, identityTargets[1]], identityVariants, identityOptions, identityM2c);
  assert(changedTargets.sweepId !== oneJob.sweepId, 'selected target membership was omitted from sweep identity');
  expectError(/unknown m2c variant/, () => selectSweepVariants(identityWorkbench, ['not-a-rule']));

  const variants = [{ name: 'structured-return-flow' }, { name: 'structured-cursor-steps' }];
  const summary = {
    processed: 0, generated: 0, compileSucceeded: 0, exactBytes: 0,
    relocationMaskedExact: 0, failed: 0, classifications: {}, targets: [],
  };
  const order = new Map([['first', 0], ['second', 1]]);
  addTargetSummary(summary, {
    symbol: 'second', bytes: 8, variants: [
      { variant: 'structured-return-flow', generated: true, status: 'compiled', primaryClass: 'opcode-mismatch' },
      { variant: 'structured-cursor-steps', generated: false, status: 'failed' },
    ],
  }, variants, order);
  addTargetSummary(summary, {
    symbol: 'first', bytes: 4, variants: [
      { variant: 'structured-return-flow', generated: true, status: 'compiled', primaryClass: 'exact', exactBytes: true, candidateId: 'C1' },
      { variant: 'structured-cursor-steps', generated: true, status: 'compiled', primaryClass: 'exact', exactBytes: true, candidateId: 'C1' },
    ],
  }, variants, order);
  assert(summary.targets.map((target) => target.symbol).join(',') === 'first,second', 'out-of-order worker results were not normalized');
  assert(summary.processed === 2 && summary.generated === 3 && summary.compileSucceeded === 3 && summary.failed === 1, 'parallel target accounting drifted');
  assert(summary.ensemble.exactTargetCount === 1, 'parallel target accounting lost deduplicated exact membership');
}

function fakeSweepWorker(index, behavior) {
  const worker = new EventEmitter();
  worker.terminate = () => Promise.resolve(0);
  worker.postMessage = (message) => behavior(worker, message, index);
  setImmediate(() => worker.emit('message', { type: 'ready' }));
  return worker;
}

async function sweepWorkerLifecycleTests() {
  const targets = [
    { targetId: 'TARGET-1', symbol: 'first' },
    { targetId: 'TARGET-2', symbol: 'second' },
  ];
  const arrivals = [];
  await runParallelTargets(targets, 2, {}, (target) => arrivals.push(target.symbol), {
    createWorker: (_, index) => fakeSweepWorker(index, (worker, message, workerIndex) => {
      if (message.type === 'target') {
        setTimeout(() => worker.emit('message', {
          type: 'result', target: { symbol: message.symbol, bytes: 4, variants: [] },
        }), workerIndex === 0 ? 15 : 0);
      } else if (message.type === 'shutdown') {
        setImmediate(() => {
          worker.emit('message', { type: 'shutdown-complete' });
          worker.emit('exit', 0);
        });
      }
    }),
  });
  assert(arrivals.join(',') === 'second,first', 'parallel sweep did not accept out-of-order worker completion');

  const oneTarget = [targets[0]];
  await expectAsyncError(/initialization failed: fixture fatal/, () => runParallelTargets(oneTarget, 1, {}, () => {}, {
    createWorker: () => {
      const worker = new EventEmitter();
      worker.terminate = () => Promise.resolve(0);
      worker.postMessage = () => {};
      setImmediate(() => worker.emit('message', { type: 'fatal', error: 'fixture fatal' }));
      return worker;
    },
  }));
  await expectAsyncError(/failed while processing first: fixture target error/, () => runParallelTargets(oneTarget, 1, {}, () => {}, {
    createWorker: (_, index) => fakeSweepWorker(index, (worker, message) => {
      if (message.type === 'target') setImmediate(() => worker.emit('message', { type: 'target-error', symbol: message.symbol, error: 'fixture target error' }));
    }),
  }));
  await expectAsyncError(/without a shutdown acknowledgement while processing first/, () => runParallelTargets(oneTarget, 1, {}, () => {}, {
    createWorker: (_, index) => fakeSweepWorker(index, (worker, message) => {
      if (message.type === 'target') setImmediate(() => worker.emit('exit', 0));
    }),
  }));
  await expectAsyncError(/exited with code 7/, () => runParallelTargets(oneTarget, 1, {}, () => {}, {
    createWorker: (_, index) => fakeSweepWorker(index, (worker, message) => {
      if (message.type === 'target') setImmediate(() => worker.emit('exit', 7));
    }),
  }));
}

function storeTests() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-match-store-'));
  const database = path.join(directory, 'workbench.sqlite');
  const options = { database, python: process.env.OB64_MATCH_PYTHON || 'python' };
  try {
    const target = {
      targetId: 'TARGET-A', modelId: 'MODEL-A', symbol: 'fixture',
      metadata: { romStart: 0, bytes: 4 }, expectedBytes: Buffer.from([0, 0, 0, 0]).toString('base64'),
      observedAt: '2026-08-22T00:00:00.000Z',
    };
    assert(requestStore({ action: 'init' }, options).schemaVersion === 2, 'store schema was not initialized');
    assert(requestStore({ action: 'upsert_targets', records: [target] }, options).inserted === 1, 'target was not inserted');
    assert(requestStore({ action: 'upsert_targets', records: [target] }, options).inserted === 0, 'identical target insertion was not idempotent');
    expectError(/conflicting target identity/, () => requestStore({ action: 'upsert_targets', records: [{ ...target, expectedBytes: Buffer.from([1, 0, 0, 0]).toString('base64') }] }, options));
    const status = requestStore({ action: 'query', name: 'status', args: { modelId: 'MODEL-A' } }, options);
    assert(status.targets === 1, 'conflicting target altered the persistent store');
    const synced = requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'fixture' }, targetCount: 1, records: [target],
    }, options);
    assert(!synced.skipped, 'first exact model sync did not validate target rows');
    const skippedSync = requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'fixture' }, targetCount: 1, records: [target],
    }, options);
    assert(skippedSync.skipped, 'unchanged exact model sync did not take the fast path');
    expectError(/conflicting exact target model identity/, () => requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'collision' }, targetCount: 1, records: [target],
    }, options));
    requestStore({ action: 'replace_families', modelId: 'MODEL-A', groups: [{ groupId: 'G1', tier: 'exact', representation: 'x', metadata: {}, members: ['TARGET-A'] }] }, options);
    expectError(/FOREIGN KEY constraint failed/, () => requestStore({ action: 'replace_families', modelId: 'MODEL-A', groups: [{ groupId: 'G2', tier: 'exact', representation: 'y', metadata: {}, members: ['MISSING'] }] }, options));
    const families = requestStore({ action: 'query', name: 'families_for_target', args: { targetId: 'TARGET-A', limit: 20 } }, options);
    assert(families.length === 1 && families[0].group_id === 'G1', 'failed family replacement partially altered the store');

    const sweep = {
      sweepId: 'SWEEP-A', modelId: 'MODEL-A', selector: { fixture: true }, status: 'invalid',
      summary: { processed: 1 }, startedAt: '2026-08-22T00:00:00.000Z', finishedAt: '2026-08-22T00:00:01.000Z',
    };
    requestStore({ action: 'put_sweep', record: sweep }, options);
    requestStore({ action: 'put_sweep', record: {
      ...sweep, status: 'running', summary: { processed: 0 },
      startedAt: '2026-08-22T01:00:00.000Z', finishedAt: null,
    } }, options);
    const restartedSweep = requestStore({ action: 'query', name: 'sweep_by_id', args: { sweepId: 'SWEEP-A' } }, options);
    assert(restartedSweep.started_at === '2026-08-22T01:00:00.000Z' && restartedSweep.finished_at === null,
      'restarted invalid sweep retained the prior attempt timing');

    const failedCompile = {
      runId: 'RUN-FAILED', candidateId: 'CANDIDATE-A', cacheKey: 'CACHE-A', status: 'failed',
      artifactDir: 'build/failure', durationMs: 1, tool: {}, createdAt: '2026-08-22T00:00:01.000Z',
    };
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-A', targetId: 'TARGET-A', sourceSha256: 'SOURCE-A', sourceText: 'void fixture(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:01.000Z',
    } }, options);
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-A2', targetId: 'TARGET-A', sourceSha256: 'SOURCE-A', sourceText: 'void fixture(void) {}',
      origin: 'second-path', metadata: { portable: true }, createdAt: '2026-08-22T00:00:01.500Z',
    } }, options);
    assert(requestStore({ action: 'query', name: 'candidate_observations', args: { candidateId: 'CANDIDATE-A', limit: 20 } }, options).length === 2, 'identical source did not retain distinct provenance observations');
    expectError(/conflicting candidate identity/, () => requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-COLLISION', targetId: 'TARGET-A', sourceSha256: 'SOURCE-COLLISION', sourceText: 'void different(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:01.750Z',
    } }, options));
    requestStore({ action: 'put_compile', record: failedCompile }, options);
    const successfulRetry = requestStore({ action: 'put_compile', record: {
      ...failedCompile, runId: 'RUN-PASS', status: 'compiled', objectText: Buffer.alloc(4).toString('base64'), createdAt: '2026-08-22T00:00:02.000Z',
    } }, options);
    assert(!successfulRetry.cached && successfulRetry.run.status === 'compiled', 'failed compile cache prevented a repaired retry');
    assert(requestStore({ action: 'query', name: 'candidate_runs', args: { candidateId: 'CANDIDATE-A', limit: 20 } }, options).length === 2, 'compile retry did not retain the failed attempt');
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-B', observationId: 'OBSERVATION-B', targetId: 'TARGET-A', sourceSha256: 'SOURCE-B', sourceText: 'void fixture(void) { int value; }',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:03.000Z',
    } }, options);
    expectError(/conflicting compile cache identity/, () => requestStore({ action: 'put_compile', record: {
      ...failedCompile, runId: 'RUN-COLLISION', candidateId: 'CANDIDATE-B', status: 'compiled',
      objectText: Buffer.alloc(4).toString('base64'), createdAt: '2026-08-22T00:00:04.000Z',
    } }, options));
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-C', observationId: 'OBSERVATION-C', targetId: 'TARGET-A', sourceSha256: 'SOURCE-C', sourceText: 'void atomic(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:05.000Z',
    } }, options);
    expectError(/record is missing required keys/, () => requestStore({
      action: 'put_compile_result',
      compile: {
        runId: 'RUN-ATOMIC', candidateId: 'CANDIDATE-C', cacheKey: 'CACHE-ATOMIC', status: 'compiled',
        objectText: Buffer.alloc(4).toString('base64'), artifactDir: 'build/atomic', durationMs: 1, tool: {}, createdAt: '2026-08-22T00:00:06.000Z',
      },
      comparison: { comparisonId: 'COMPARISON-ATOMIC', runId: 'RUN-ATOMIC' },
    }, options));
    assert(requestStore({ action: 'query', name: 'compile_by_cache', args: { cacheKey: 'CACHE-ATOMIC' } }, options) === null, 'invalid comparison partially committed its compile run');

    const staleTarget = { ...target, targetId: 'TARGET-OLD', modelId: 'MODEL-OLD', observedAt: '2026-08-21T00:00:00.000Z' };
    requestStore({ action: 'upsert_targets', records: [staleTarget] }, options);
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-OLD', observationId: 'OBSERVATION-OLD', targetId: 'TARGET-OLD', sourceSha256: 'SOURCE-OLD', sourceText: 'void fixture(void) { }',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-21T00:00:01.000Z',
    } }, options);
    requestStore({ action: 'put_compile', record: {
      runId: 'RUN-OLD', candidateId: 'CANDIDATE-OLD', cacheKey: 'CACHE-OLD', status: 'failed',
      artifactDir: 'build/old', durationMs: 1, tool: {}, createdAt: '2026-08-21T00:00:02.000Z',
    } }, options);
    const history = requestStore({ action: 'query', name: 'history', args: { modelId: 'MODEL-A', symbol: 'fixture', limit: 20 } }, options);
    assert(history.some((row) => row.model_id === 'MODEL-OLD' && row.is_stale === 1), 'stale model history was not retained or labeled');
    const best = requestStore({ action: 'query', name: 'best', args: { modelId: 'MODEL-A', symbol: 'fixture', limit: 20 } }, options);
    assert(best.every((row) => row.model_id === 'MODEL-A' && row.is_stale === 0), 'stale experiment influenced current best results');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function acceptedModelTests() {
  const workbench = loadWorkbenchModel();
  assert(workbench.modelManifest.targetModelContract === 4, 'target-model contract drift');
  assert(JSON.stringify(workbench.modelManifest.conventionalBuild) === JSON.stringify({
    path: 'config/phase7/conventional-build.json',
    sha256: sha256File(PHASE7_CONFIG_PATH),
  }), 'accepted placement configuration is missing from target-model identity');
  const changedPlacementManifest = JSON.parse(JSON.stringify(workbench.modelManifest));
  changedPlacementManifest.conventionalBuild.sha256 = '0'.repeat(64);
  assert(digest(changedPlacementManifest) !== workbench.modelId, 'placement configuration drift did not invalidate the target model');
  assert(workbench.targets.length === 4851, 'accepted function census drift');
  assert(workbench.targets.filter((target) => target.symbolByteOffset === 0).length === 4848, 'ordinary target census drift');
  const memcpy = resolveTarget(workbench, 'memcpy_bytewise');
  assert(memcpy.targetId === 'C4C13EF4BEF72C9F2C2B31A109F7E23760659FDFA0E7C39FA5C9E84F06AD71C7', 'target identity drifted outside an explicit target-model contract change');
  const context = buildTargetContext(workbench, memcpy);
  assert(context.summary.argumentRegistersReadBeforeWrite.join(',') === '$a0,$a1,$a2', 'memcpy argument context drift');
  assert(context.fields.some((field) => field.baseArgument === 0 && field.access === 'store' && field.width === 1), 'memcpy destination-byte fact missing');
  const targetSnapshot = targetRecord(memcpy, '2026-08-22T00:00:00.000Z');
  const promotedSnapshot = targetRecord({ ...memcpy, activeMatchingSource: 'src/changed.c' }, '2026-08-22T00:00:00.000Z');
  assert(targetSnapshot.targetId === promotedSnapshot.targetId && JSON.stringify(targetSnapshot.metadata) === JSON.stringify(promotedSnapshot.metadata), 'workflow promotion state changed exact machine target identity');
  const first = resolveTarget(workbench, 'func_000E5938');
  const second = resolveTarget(workbench, 'func_0013466C');
  assert(first.expectedBytes.equals(second.expectedBytes), 'known exact clone fixture drift');
  const straddler = resolveTarget(workbench, 'func_0021EBBC');
  assert(straddler.romStart === 0x0021EBBC && straddler.romEndExclusive === 0x002213DC && straddler.bytes === 10272, 'accepted straddler function range was truncated at a source-part boundary');
  assert(straddler.vramStart === 0x0021EBBC && straddler.vramEndExclusive === 0x002213DC, 'accepted straddler placement is not contiguous');
  assert(straddler.originalAssemblyParts?.length === 2
    && straddler.originalAssemblyParts[1].symbol === 'func_0021EBBC_chunk34tail', 'accepted straddler source-part provenance is missing');
  const straddlerAssembly = emitM2cAssembly(straddler, workbench);
  assert(/nop # m2c analysis guard:[^\n]+\n\.L_0021F808:/.test(straddlerAssembly), 'm2c likely-branch/call-delay guard is missing');
  const cutsceneParser = resolveTarget(workbench, 'func_00284288');
  const cutsceneEvidenceRoot = path.join(ROOT, 'docs', 'audit', 'evidence',
    '2026-08-31-func-00284288-preparatory');
  const cutsceneCaseMap = JSON.parse(fs.readFileSync(path.join(cutsceneEvidenceRoot, 'case-cfg-map.json'), 'utf8'));
  const archivedContract = resolveCandidateComparisonContract(
    cutsceneCaseMap, '9ED0FDEE460C920DC9A3906DE125591A33055CC4F0175249790959EFBB8FFD16');
  assert(archivedContract.actualDispatch.dispatchOffset === '0x80'
    && archivedContract.actualDispatch.bodyOffset === '0x8A0'
    && archivedContract.actualTails.length === 1
    && archivedContract.actualTails[0].name === 'post-command'
    && archivedContract.actualTails[0].offset === '0x1EC8',
  'func_00284288 tracked actual case-CFG inputs drifted');
  assert(archivedContract.expectedResultDigest
    === '164228EC18C985EBD8C9E03ACD53F6E1B515A00D12C26DF0418EA5A54EF256B7',
  'func_00284288 tracked case-CFG result digest drifted');
  const archivedSource = fs.readFileSync(path.resolve(ROOT, archivedContract.source), 'utf8');
  const archivedSha256 = crypto.createHash('sha256').update(archivedSource).digest('hex').toUpperCase();
  assert(archivedSha256 === archivedContract.sourceSha256,
    'func_00284288 archived successor source bytes changed without a new identity');
  assert(candidateRecord(cutsceneParser, archivedSource).candidateId === archivedContract.candidateId,
    'func_00284288 archived successor candidate ID no longer derives from its frozen bytes');
  const attributes = fs.readFileSync(path.join(ROOT, '.gitattributes'), 'utf8');
  assert(attributes.includes(`${archivedContract.source} whitespace=-blank-at-eol`),
    'func_00284288 archived successor lacks its exact-path whitespace policy');
  const predecessorPath = 'docs/archive/matching-c-candidates/2026-08-31-func_00284288-e8eb93fecb.c';
  const predecessorSha256 = crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(ROOT, predecessorPath))).digest('hex').toUpperCase();
  assert(predecessorSha256 === 'CC7F0E0DBF8C69C61DDFEE85947B3F13FBB736AC738CBF26BF0C345B8F04F24C'
    && attributes.includes(`${predecessorPath} whitespace=-blank-at-eol`),
  'func_00284288 archived predecessor identity or exact-path whitespace policy drifted');
  const cutsceneCoverage = JSON.parse(fs.readFileSync(path.join(cutsceneEvidenceRoot, 'coverage-summary.json'), 'utf8'));
  assert(cutsceneCoverage.schemaVersion === 2
    && cutsceneCoverage.caseComparison.candidate.candidateId === archivedContract.candidateId
    && cutsceneCoverage.caseComparison.actualInputs.dispatchOffset === '0x0080'
    && cutsceneCoverage.caseComparison.actualInputs.commandBodyOffset === '0x08A0'
    && cutsceneCoverage.caseComparison.actualInputs.sharedTails[0] === 'post-command=0x1EC8'
    && cutsceneCoverage.caseComparison.resultDigest === archivedContract.expectedResultDigest,
  'func_00284288 compact case-CFG evidence lost its reproducible comparison contract');
  const cutsceneResearchReport = fs.readFileSync(path.join(ROOT, 'docs', 'audit',
    '2026-08-31-func-00284288-preparatory-reconstruction.md'), 'utf8');
  assert(cutsceneResearchReport.includes('node tools/reproduce_func_00284288_case_cfg.js --actual-dispatch 0x80 --actual-body 0x8A0 --actual-tail post-command=0x1EC8'),
    'func_00284288 fresh-worktree case-CFG reproduction command is not documented');
  const cutsceneAssembly = emitM2cAssembly(cutsceneParser, workbench);
  const cutsceneGuards = [...cutsceneAssembly.matchAll(/nop # m2c analysis guard:[^\n]+\n(\.L_[0-9A-F]+):/g)]
    .map((match) => match[1]);
  const cutsceneFixture = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'matching',
    'func_00284288-m2c-delay-slot.json'), 'utf8'));
  assert(cutsceneFixture.schemaVersion === 1 && cutsceneFixture.symbol === cutsceneParser.symbol,
    'func_00284288 m2c delay-slot fixture is malformed');
  assert(cutsceneGuards.join(',') === cutsceneFixture.guardedLabels.join(','),
    `func_00284288 m2c delay-slot guards drifted: ${cutsceneGuards.join(',')}`);
  const cutsceneUnguarded = cutsceneAssembly.replace(
    /^nop # m2c analysis guard: keep an IDO likely-branch rewrite out of a call delay slot\r?\n/gm, '');
  const textSha256 = (text) => crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
  assert(textSha256(cutsceneAssembly) === cutsceneFixture.guardedAssemblySha256,
    'func_00284288 guarded m2c assembly fixture drifted');
  assert(textSha256(cutsceneUnguarded) === cutsceneFixture.unguardedAssemblySha256,
    'func_00284288 unguarded m2c assembly fixture drifted');
  const cutsceneFailure = m2cFailure(
    `Decompilation failure in function ${cutsceneParser.symbol}:\n\n${cutsceneFixture.unguardedExpectedFailure}`);
  assert(cutsceneFailure && cutsceneFailure.includes(cutsceneFixture.unguardedExpectedFailure),
    'func_00284288 label-before-delay-slot diagnostic no longer normalizes to the fixture');
  const largeDispatcher = resolveTarget(workbench, 'func_0010DDB4');
  const largeDispatcherTables = discoverOverlayJumpTables(largeDispatcher, workbench,
    targetInstructions(largeDispatcher));
  assert(largeDispatcherTables.length === 1
    && largeDispatcherTables[0].tableVram === 0x801EE210
    && largeDispatcherTables[0].tableRom === 0x00142950
    && largeDispatcherTables[0].entryCount === 52, '52-entry overlay jump table was not recovered exactly');
  const largeDispatcherAssembly = emitM2cAssembly(largeDispatcher, workbench);
  assert(/lui \$at, %hi\(jtbl_801EE210\)/.test(largeDispatcherAssembly)
    && /lw \$v0, %lo\(jtbl_801EE210\)\(\$at\)/.test(largeDispatcherAssembly)
    && /glabel jtbl_801EE210\n\.word \.L_801B9CB0/.test(largeDispatcherAssembly), 'm2c overlay jump-table annotations are incomplete');
  const twoSwitches = resolveTarget(workbench, 'func_001390F0');
  const twoSwitchTables = discoverOverlayJumpTables(twoSwitches, workbench,
    targetInstructions(twoSwitches));
  assert(twoSwitchTables.map((table) => `${table.tableVram.toString(16)}:${table.entryCount}`).join(',')
    === '801f0308:23,801f0368:7', 'multiple overlay jump tables were not recovered independently');
  expectError(/does not resolve uniquely/, () => resolveTarget(workbench, 'func_0021EBBC_chunk34tail'));
}

async function main() {
  classifierTests();
  caseCfgTests();
  scratchAuxiliarySectionTests();
  canonicalAuxiliarySectionTests();
  familyTests();
  m2cAdapterTests();
  compilerArtifactPathTests();
  candidateIdentityTests();
  probeComparisonTests();
  ensembleSummaryTests();
  sweepParallelismTests();
  await sweepWorkerLifecycleTests();
  storeTests();
  acceptedModelTests();
  console.log('Matching workbench tests: PASS');
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

module.exports = { main };
