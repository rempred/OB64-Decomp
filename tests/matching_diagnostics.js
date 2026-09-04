#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  bufferFromWords,
  compareMips,
} = require('../tools/lib/matching/mips_analysis');
const {
  acceptedControlArtifacts,
  acceptedSymbolIndex,
  assertSupportedRelocations,
  comparisonAlgorithmIdentity,
  comparisonAlgorithmManifest,
  comparisonIsCurrent,
  compareCandidateDiagnostic,
  createDiagnosticAttemptDirectory,
  diagnosticAttemptIdentity,
  ensurePlainDiagnosticDirectory,
  environmentIdentity,
  linkerDefinitions,
  MAX_DIAGNOSTIC_TOOL_PATH,
  prepareTargetDiagnostic,
  relocationOperandIdentityMismatch,
  relocationPlacementIdentityMismatch,
  resolvedDiagnosticComparison,
  validateDiagnosticObjectStructure,
} = require('../tools/lib/matching/diagnostic_link');
const {
  authenticateFreshRunArtifactDirectory,
  cachedCandidateArtifact,
  candidateRecord,
  compileArtifactDirectory,
  compileAttemptIdentity,
  compileCandidate,
  resolveRunArtifactDirectory,
  sourceSnapshot,
} = require('../tools/lib/matching/compiler');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { digest } = require('../tools/lib/matching/target_model');

function fail(message) {
  throw new Error(`matching diagnostics test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function expectError(pattern, callback) {
  try { callback(); } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return;
  }
  fail(`expected error was not raised: ${pattern}`);
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

function symbolicControlFlowTests() {
  const start = 0x801D0000;
  const jrRa = rType(31, 0, 0, 0x08);
  const internalRelocation = [{
    offset: 0, type: 'R_MIPS_26', symbol: '.text', section: '.rel.text',
  }];
  for (const opcode of [0x02, 0x03]) {
    const expected = bufferFromWords([jType(opcode, start + 8), 0, jrRa, 0]);
    const rawObject = bufferFromWords([jType(opcode, 8), 0, jrRa, 0]);
    const raw = compareMips(expected, rawObject, {
      start, expectedRelocations: internalRelocation, actualRelocations: internalRelocation,
    });
    const symbolic = compareMips(expected, rawObject, {
      start,
      expectedRelocations: internalRelocation,
      actualRelocations: internalRelocation,
      symbolicControlFlow: true,
    });
    assert(raw.cfgExact === false && symbolic.cfgExact === true
      && symbolic.controlFlowEvidence.actual.resolvedInternalCount === 1
      && symbolic.primaryClass !== 'cfg-mismatch',
    `section-relative internal ${opcode === 0x02 ? 'J' : 'JAL'} was diagnosed as a CFG reconstruction failure`);
  }

  const expectedExternal = bufferFromWords([jType(0x03, 0x80200000), 0, jrRa, 0]);
  const spuriouslyInternal = bufferFromWords([jType(0x03, start + 8), 0, jrRa, 0]);
  const unresolvedRelocation = [{
    offset: 0, type: 'R_MIPS_26', symbol: 'unresolved_external', section: '.rel.text',
  }];
  const unresolved = compareMips(expectedExternal, spuriouslyInternal, {
    start,
    actualRelocations: unresolvedRelocation,
    expectedRelocationsAvailable: false,
    expectedRelocationsUnavailableReason: 'synthetic missing accepted contract',
    symbolicControlFlow: true,
  });
  assert(unresolved.rawCfgExact === false && unresolved.cfgExact === null
      && unresolved.primaryClass === 'control-flow-address-unresolved'
      && unresolved.labels[0].category === 'control-flow-address-unresolved',
  'unresolved R_MIPS_26 target was treated as proven CFG equality or mismatch');

  const missingRelocationsOnBothSides = compareMips(
    expectedExternal,
    spuriouslyInternal,
    {
      start,
      expectedRelocationsAvailable: false,
      expectedRelocationsUnavailableReason: 'synthetic legacy row',
      actualRelocationsAvailable: false,
      actualRelocationsUnavailableReason: 'synthetic legacy row',
      symbolicControlFlow: true,
      symbolicExpectedControlFlow: true,
    },
  );
  assert(missingRelocationsOnBothSides.cfgExact === null
      && missingRelocationsOnBothSides.primaryClass === 'control-flow-address-unresolved'
      && missingRelocationsOnBothSides.controlFlowEvidence.unresolvedCount === 2,
  'missing relocation evidence produced an address-dependent candidate CFG classification');

  const identicalUnresolvedExternal = compareMips(expectedExternal, Buffer.from(expectedExternal), {
    start,
    actualRelocations: unresolvedRelocation,
    expectedRelocationsAvailable: false,
    expectedRelocationsUnavailableReason: 'synthetic missing accepted contract',
    symbolicControlFlow: true,
  });
  assert(identicalUnresolvedExternal.exactBytes === true
      && identicalUnresolvedExternal.cfgExact === null
      && identicalUnresolvedExternal.primaryClass === 'control-flow-address-unresolved',
  'identical raw bytes overrode an unresolved external control address');

  const branch = bufferFromWords([iType(0x04, 4, 0, 1), 0, jrRa, 0]);
  const invertedBranch = bufferFromWords([iType(0x05, 4, 0, 1), 0, jrRa, 0]);
  const inversion = compareMips(branch, invertedBranch, { start, symbolicControlFlow: true });
  assert(inversion.primaryClass === 'cfg-mismatch'
      && inversion.labels.some((label) => label.category === 'branch-polarity'),
  'actual branch inversion was hidden by symbolic control-flow handling');

  const shorter = compareMips(branch, branch.subarray(0, branch.length - 4), {
    start, symbolicControlFlow: true,
  });
  assert(shorter.primaryClass === 'length-mismatch' && shorter.differingInstructions === 1,
    'changed function length was hidden by diagnostic control-flow handling');
}

function relocationIdentityTests() {
  const start = 0x801D0000;
  const expected = bufferFromWords([
    iType(0x0F, 0, 2, 0x801D),
    iType(0x09, 2, 2, 0x1234),
    rType(31, 0, 0, 0x08),
    0,
  ]);
  const rawObject = bufferFromWords([
    iType(0x0F, 0, 2, 0),
    iType(0x09, 2, 2, 4),
    rType(31, 0, 0, 0x08),
    0,
  ]);
  const acceptedRelocations = [
    { offset: 0, type: 'R_MIPS_HI16', symbol: 'accepted_data', section: '.rel.text', addend: 4 },
    { offset: 4, type: 'R_MIPS_LO16', symbol: 'accepted_data', section: '.rel.text', addend: 4 },
  ];
  const normalizedEquivalent = acceptedRelocations.map((record) => ({
    ...record,
    offset: `0x${record.offset.toString(16).padStart(8, '0')}`,
    addend: '0x00000004',
  }));
  assert(!relocationOperandIdentityMismatch(
    { available: true, records: normalizedEquivalent }, acceptedRelocations,
  ), 'equivalent numeric HI16/LO16 addends were treated as different identities');
  const compensatingAddend = acceptedRelocations.map((record) => ({ ...record, addend: 8 }));
  assert(relocationOperandIdentityMismatch(
    { available: true, records: acceptedRelocations }, compensatingAddend,
  ), 'wrong HI16/LO16 addends were not detected');
  const shiftedPlacement = acceptedRelocations.map((record) => ({ ...record, offset: record.offset + 4 }));
  assert(!relocationOperandIdentityMismatch(
    { available: true, records: acceptedRelocations }, shiftedPlacement,
  ) && relocationPlacementIdentityMismatch(
    { available: true, records: acceptedRelocations }, shiftedPlacement,
  ), 'relocation operand and placement identity were not kept as separate evidence');

  const rawComparison = compareMips(expected, rawObject, {
    start,
    expectedRelocations: acceptedRelocations,
    actualRelocations: compensatingAddend,
  });
  const target = {
    symbol: 'fixture', targetId: 'TARGET', vramStart: start,
    expectedBytes: expected, expectedBytesSha256: 'EXPECTED',
  };
  const resolvedAlias = resolvedDiagnosticComparison({
    target,
    linkedBytes: Buffer.from(expected),
    comparisonOptions: {
      expectedRelocations: acceptedRelocations,
      expectedRelocationsAvailable: true,
      actualRelocations: compensatingAddend.map((record) => ({ ...record, symbol: 'alias_data' })),
      actualRelocationsAvailable: true,
    },
    rawComparison,
    prepared: { inputId: 'INPUT' },
    controlEvidence: { linkedBytesSha256: 'CONTROL' },
    candidateEvidence: { linkedBytesSha256: 'CANDIDATE' },
    expectedRelocationEvidence: { available: true, records: acceptedRelocations },
    actualRelocations: compensatingAddend.map((record) => ({ ...record, symbol: 'alias_data' })),
  });
  assert(resolvedAlias.diagnosticExactBytes === true && resolvedAlias.exactBytes === rawComparison.exactBytes
      && resolvedAlias.rawExactBytes === rawComparison.exactBytes
      && resolvedAlias.primaryClass === 'relocation-operand-identity-mismatch'
      && resolvedAlias.relocationOperandIdentityExact === false
      && resolvedAlias.acceptanceEligible === false,
  'identical diagnostic linked bytes hid wrong alias/addend identity or became raw/acceptance evidence');

  const resolvedPlacement = resolvedDiagnosticComparison({
    target,
    linkedBytes: Buffer.from(expected),
    rawComparison: compareMips(expected, rawObject, {
      start,
      expectedRelocations: acceptedRelocations,
      actualRelocations: shiftedPlacement,
    }),
    prepared: { inputId: 'INPUT' },
    controlEvidence: {},
    candidateEvidence: {},
    expectedRelocationEvidence: { available: true, records: acceptedRelocations },
    actualRelocations: shiftedPlacement,
  });
  assert(resolvedPlacement.diagnosticExactBytes === true
      && resolvedPlacement.primaryClass === 'relocation-placement-identity-mismatch'
      && resolvedPlacement.relocationOperandIdentityExact === false
      && resolvedPlacement.relocationOperandMultisetExact === true
      && resolvedPlacement.relocationPlacementIdentityExact === false,
  'identical linked bytes with wrong relocation placement became an exact diagnostic lead');

  const wrongAddressBytes = Buffer.from(expected);
  wrongAddressBytes.writeUInt32BE((expected.readUInt32BE(0) + 1) >>> 0, 0);
  const resolvedWrongAddress = resolvedDiagnosticComparison({
    target,
    linkedBytes: wrongAddressBytes,
    comparisonOptions: {
      expectedRelocations: acceptedRelocations,
      expectedRelocationsAvailable: true,
      actualRelocations: compensatingAddend,
      actualRelocationsAvailable: true,
    },
    rawComparison,
    prepared: { inputId: 'INPUT' },
    controlEvidence: {},
    candidateEvidence: {},
    expectedRelocationEvidence: { available: true, records: acceptedRelocations },
    actualRelocations: compensatingAddend,
  });
  assert(!resolvedWrongAddress.diagnosticExactBytes
      && resolvedWrongAddress.primaryClass === 'relocation-operand-identity-mismatch',
  'real wrong resolved address was hidden by relocation normalization');

  const resolvedWrongAddressWithAcceptedIdentity = resolvedDiagnosticComparison({
    target,
    linkedBytes: wrongAddressBytes,
    rawComparison,
    prepared: { inputId: 'INPUT' },
    controlEvidence: {},
    candidateEvidence: {},
    expectedRelocationEvidence: { available: true, records: acceptedRelocations },
    actualRelocations: acceptedRelocations,
  });
  assert(!resolvedWrongAddressWithAcceptedIdentity.diagnosticExactBytes
      && resolvedWrongAddressWithAcceptedIdentity.relocationOperandIdentityExact
      && resolvedWrongAddressWithAcceptedIdentity.primaryClass !== 'relocation-identity-proven'
      && resolvedWrongAddressWithAcceptedIdentity.differingBytes > 0,
  'relocation masks hid a wrong address after isolated linking');
}

function ownershipAndRelocationRejectionTests() {
  const target = { symbol: 'fixture', sectionName: '.fixture' };
  const text = { index: 1, name: '.fixture', type: 1, flags: 6, alignment: 4, size: 8 };
  const owner = {
    name: 'fixture', sectionIndex: 1, symbolType: 2, value: 0, binding: 1, visibility: 0, size: 8,
  };
  const base = { header: { type: 1, machine: 8 }, sections: [text], symbols: [owner] };
  validateDiagnosticObjectStructure(base, target);
  expectError(/auxiliary allocated ownership/, () => validateDiagnosticObjectStructure({
    ...base,
    sections: [text, { index: 2, name: '.rodata', type: 1, flags: 2, alignment: 4, size: 4 }],
  }, target));
  expectError(/multi-owner/, () => validateDiagnosticObjectStructure({
    ...base,
    symbols: [owner, { ...owner, name: 'helper', value: 4, size: 4 }],
  }, target));
  expectError(/unsupported text relocation R_MIPS_GPREL16/, () => assertSupportedRelocations([
    { offset: 0, type: 'R_MIPS_GPREL16', symbol: 'data', section: '.rel.text' },
  ]));
}

function provenanceTests() {
  const target = {
    symbol: 'fixture', targetId: 'TARGET', expectedBytes: Buffer.alloc(4),
    expectedBytesSha256: 'EXPECTED', symbolByteOffset: 0, placementKind: 'overlay',
    bytes: 4, romStart: 0x1000, vramStart: 0x80100000,
  };
  const active = { symbol: target.symbol, bytes: 4, romStartNumber: target.romStart, vramStartNumber: target.vramStart };
  const nonactive = prepareTargetDiagnostic(
    { context: { currentFingerprint: 'CURRENT', phase8: { targets: [] } } },
    target,
    { available: false, reason: 'not accepted' },
  );
  assert(nonactive.code === 'nonactive-asm-owner', 'nonactive ASM-owned target was not explicit');
  const missingContract = prepareTargetDiagnostic(
    { context: { currentFingerprint: 'CURRENT', phase8: { targets: [active] } } },
    target,
    { available: false, reason: 'synthetic missing contract' },
  );
  assert(missingContract.code === 'missing-accepted-relocation-contract', 'missing relocation contract was guessed');
  const romOnly = prepareTargetDiagnostic(
    { context: { currentFingerprint: 'CURRENT', phase8: { targets: [active] } } },
    { ...target, placementKind: 'rom-only' },
    { available: true, records: [] },
  );
  assert(romOnly.code === 'rom-only-placement', 'ROM-only target was assigned a diagnostic runtime address');
  const ambiguousOwner = prepareTargetDiagnostic(
    { context: { currentFingerprint: 'CURRENT', phase8: { targets: [active, { ...active }] } } },
    target,
    { available: true, records: [] },
  );
  assert(ambiguousOwner.code === 'ambiguous-active-owner', 'ambiguous active ownership was guessed');
  const stale = prepareTargetDiagnostic(
    { context: { currentFingerprint: 'CURRENT', phase8: { targets: [active] } } },
    target,
    { available: true, records: [] },
    { environment: { available: false, code: 'stale-current-build', reason: 'synthetic stale state', details: {}, identity: 'ENV' } },
  );
  assert(stale.code === 'stale-current-build' && stale.details.environmentIdentity === 'ENV',
    'stale resolver/build provenance was not explicit');

  const undefinedObject = { elf: { symbols: [{ name: 'external', sectionIndex: 0 }] } };
  expectError(/unresolved accepted symbol/, () => linkerDefinitions(undefinedObject, { symbols: new Map() }));
  expectError(/ambiguous accepted symbol/, () => linkerDefinitions(undefinedObject, {
    symbols: new Map([['external', [{ value: 1 }, { value: 2 }]]]),
  }));
  const definitions = linkerDefinitions(undefinedObject, {
    symbols: new Map([['external', [{ value: 0x80123456 }]]]),
  });
  assert(definitions.definitions[0] === 'external = 0x80123456;', 'exact accepted symbol address was not preserved');

  const indexed = acceptedSymbolIndex({
    sections: [{ name: '' }, { name: '.text' }],
    symbols: [
      { name: 'local', sectionIndex: 1, binding: 0, value: 1, size: 0, visibility: 0, symbolType: 0 },
      { name: 'global', sectionIndex: 1, binding: 1, value: 2, size: 0, visibility: 0, symbolType: 0 },
      { name: 'absolute', sectionIndex: 0xFFF1, binding: 1, value: 3, size: 0, visibility: 0, symbolType: 0 },
      { name: 'common', sectionIndex: 0xFFF2, binding: 1, value: 4, size: 0, visibility: 0, symbolType: 0 },
    ],
  });
  assert(!indexed.has('local') && !indexed.has('common')
      && indexed.get('global')[0].value === 2 && indexed.get('absolute')[0].value === 3,
  'accepted symbol resolver admitted local/common guessing or lost a defined global/absolute symbol');
}

function diagnosticEnvironmentIdentityTests() {
  const testsRoot = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(testsRoot, { recursive: true });
  const output = fs.mkdtempSync(path.join(testsRoot, 'matching-control-environment-'));
  const objects = path.join(output, 'objects');
  const objectFile = path.join(objects, 'control.o');
  fs.mkdirSync(objects);
  try {
    fs.writeFileSync(objectFile, 'accepted-control');
    const buildReport = {
      targetReplacements: [{
        symbol: 'fixture',
        sourceObject: 'objects/control.o',
        sourceObjectSha256: sha256File(objectFile),
      }],
    };
    const accepted = acceptedControlArtifacts(output, buildReport);
    assert(accepted.available && accepted.count === 1,
      'authenticated accepted control object was rejected');
    fs.writeFileSync(objectFile, 'drifted-control');
    const drifted = acceptedControlArtifacts(output, buildReport);
    assert(!drifted.available && drifted.identity !== accepted.identity,
      'accepted control object content drift was absent from diagnostic environment identity');
    fs.unlinkSync(objectFile);
    const missing = acceptedControlArtifacts(output, buildReport);
    assert(!missing.available && missing.identity !== drifted.identity,
      'missing accepted control object was absent from diagnostic environment identity');

    const base = {
      currentFingerprint: 'CURRENT', available: true, acceptedElfSha256: 'ELF',
      acceptedControlsId: accepted.identity, buildReportSha256: 'REPORT', verificationSha256: 'VERIFY',
    };
    assert(environmentIdentity(base) !== environmentIdentity({ ...base, acceptedControlsId: drifted.identity })
      && environmentIdentity(base) !== environmentIdentity({ ...base, buildReportSha256: 'OTHER-REPORT' }),
    'control/build-report provenance was omitted from diagnostic environment identity');
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
}

function symbolicFallbackExactnessTests() {
  const target = {
    symbol: 'fixture', targetId: 'TARGET', vramStart: 0x80100000,
    expectedBytes: bufferFromWords([0]), expectedBytesSha256: 'EXPECTED',
  };
  const prepared = {
    available: false,
    code: 'stale-current-build',
    reason: 'synthetic unavailable link',
    details: {},
    inputId: 'INPUT',
    comparisonAlgorithmId: 'ALGORITHM',
    currentFingerprint: 'CURRENT',
  };
  const missingAcceptedContract = compareCandidateDiagnostic({
    session: null,
    target,
    objectText: Buffer.from(target.expectedBytes),
    actualRelocations: [],
    expectedRelocationEvidence: { available: false, reason: 'synthetic missing contract' },
    candidateArtifact: null,
    artifactDir: null,
    prepared,
  });
  assert(missingAcceptedContract.exactBytes === true
      && missingAcceptedContract.diagnosticExactBytes === null
      && missingAcceptedContract.primaryClass === 'relocation-address-unresolved',
  'missing accepted relocation evidence became an exact symbolic diagnostic');

  const acceptedEmptyContract = compareCandidateDiagnostic({
    session: null,
    target,
    objectText: Buffer.from(target.expectedBytes),
    actualRelocations: [],
    expectedRelocationEvidence: { available: true, records: [], reason: null },
    candidateArtifact: null,
    artifactDir: null,
    prepared,
  });
  assert(acceptedEmptyContract.diagnosticExactBytes === true
      && acceptedEmptyContract.primaryClass === 'exact-bytes',
  'an accepted empty relocation contract lost exact relocation-free fallback evidence');

  const unresolvedCallTarget = {
    ...target,
    expectedBytes: bufferFromWords([jType(0x03, 0x80200000), 0]),
  };
  const unresolvedCall = compareCandidateDiagnostic({
    session: null,
    target: unresolvedCallTarget,
    objectText: Buffer.from(unresolvedCallTarget.expectedBytes),
    actualRelocations: [{
      offset: 0, type: 'R_MIPS_26', symbol: 'external', section: '.rel.text',
    }],
    expectedRelocationEvidence: { available: false, reason: 'synthetic missing contract' },
    candidateArtifact: null,
    artifactDir: null,
    prepared,
  });
  assert(unresolvedCall.exactBytes === true
      && unresolvedCall.cfgExact === null
      && unresolvedCall.diagnosticExactBytes === null
      && unresolvedCall.primaryClass === 'control-flow-address-unresolved',
  'identical raw external-call bytes became an exact symbolic fallback diagnostic');
}

function comparisonInvalidationTests() {
  const prepared = {
    inputId: 'INPUT-A', comparisonAlgorithmId: 'ALGORITHM-A', currentFingerprint: 'CURRENT-A',
  };
  const current = {
    details: {
      schemaVersion: 3,
      comparisonContract: 1,
      comparisonAlgorithmId: 'ALGORITHM-A',
      diagnosticCurrentFingerprint: 'CURRENT-A',
      acceptanceEligible: false,
      diagnosticInputId: 'INPUT-A',
      rawObjectComparison: { exactBytes: false },
    },
  };
  assert(comparisonIsCurrent(current, prepared), 'current diagnostic comparison was invalidated');
  assert(!comparisonIsCurrent({ details: { ...current.details, schemaVersion: 2 } }, prepared),
    'legacy comparison schema remained cache-valid');
  assert(!comparisonIsCurrent(current, { inputId: 'INPUT-B' }),
    'changed resolver/object diagnostic provenance remained cache-valid');
  assert(!comparisonIsCurrent(current, { ...prepared, comparisonAlgorithmId: 'ALGORITHM-B' }),
    'changed comparison algorithm identity remained cache-valid');
  assert(!comparisonIsCurrent(current, { ...prepared, currentFingerprint: 'CURRENT-B' }),
    'changed CURRENT fingerprint remained cache-valid');
  assert(!comparisonIsCurrent({ details: { ...current.details, rawObjectComparison: null } }, prepared),
    'comparison without preserved raw evidence remained cache-valid');

  const manifest = comparisonAlgorithmManifest();
  const sealedPaths = new Set(manifest.files.map((file) => file.path));
  assert(['tools/lib/matching/diagnostic_link.js', 'tools/lib/matching/mips_analysis.js',
    'tools/lib/matching/compiler.js', 'tools/lib/current_workflow.js',
    'tools/lib/phase7_conventional.js', 'tools/lib/phase8_matching_c.js',
    'tools/matching_workbench/store.py'].every((file) => sealedPaths.has(file)),
  'comparison-producing implementation is missing from the algorithm seal');
  assert(digest(manifest) === comparisonAlgorithmIdentity(),
    'comparison algorithm identity does not derive from its implementation manifest');
  const changedManifest = JSON.parse(JSON.stringify(manifest));
  changedManifest.files.find((file) => file.path === 'tools/lib/matching/compiler.js').sha256 = '0'.repeat(64);
  const changedImplementationId = digest(changedManifest);
  assert(changedImplementationId !== comparisonAlgorithmIdentity()
      && !comparisonIsCurrent(current, { ...prepared, comparisonAlgorithmId: changedImplementationId }),
  'changed compiler comparison wiring did not invalidate stored comparison reuse');
}

function cachedArtifactSecurityTests() {
  const testsRoot = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(testsRoot, { recursive: true });
  const directory = fs.mkdtempSync(path.join(testsRoot, 'matching-diagnostic-security-'));
  const outsideAncestor = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-matching-ancestor-'));
  const matchingRoot = path.join(directory, 'matching');
  const runId = 'A'.repeat(64);
  const runDirectory = compileArtifactDirectory(runId, matchingRoot);
  fs.mkdirSync(runDirectory, { recursive: true });
  const run = {
    run_id: runId,
    cache_key: 'CACHE',
    artifact_dir: path.relative(ROOT, runDirectory),
  };
  try {
    assert(resolveRunArtifactDirectory(run, matchingRoot) === runDirectory,
      'authenticated cached run directory did not resolve');
    expectError(/not the authenticated run directory/, () => resolveRunArtifactDirectory({
      ...run,
      artifact_dir: path.relative(ROOT, path.join(matchingRoot, 'runs', 'B'.repeat(64))),
    }, matchingRoot));

    const escapeDirectory = path.join(directory, 'escape');
    fs.mkdirSync(escapeDirectory);
    fs.symlinkSync(escapeDirectory, path.join(runDirectory, 'diagnostic-link'), 'junction');
    expectError(/escapes its real run directory/, () => ensurePlainDiagnosticDirectory(
      path.join(runDirectory, 'diagnostic-link'),
    ));

    const secondRunId = 'C'.repeat(64);
    const linkedRunDirectory = compileArtifactDirectory(secondRunId, matchingRoot);
    fs.symlinkSync(escapeDirectory, linkedRunDirectory, 'junction');
    expectError(/not a plain directory|escapes its real matching root/, () => resolveRunArtifactDirectory({
      run_id: secondRunId,
      artifact_dir: path.relative(ROOT, linkedRunDirectory),
    }, matchingRoot));

    const freshRoot = path.join(directory, 'fresh-matching');
    const freshEscape = path.join(directory, 'fresh-escape');
    fs.mkdirSync(freshRoot);
    fs.mkdirSync(freshEscape);
    fs.symlinkSync(freshEscape, path.join(freshRoot, 'runs'), 'junction');
    const escapedRun = path.join(freshEscape, 'D'.repeat(64));
    expectError(/matching runs directory is not a plain directory/, () => (
      authenticateFreshRunArtifactDirectory('D'.repeat(64), freshRoot)
    ));
    assert(!fs.existsSync(escapedRun),
      'fresh run directory was created through a junction before authentication');

    const sameClock = '2026-09-04T00:00:00.000Z';
    const firstAttempt = compileAttemptIdentity('CACHE', sameClock, 'NONCE-A');
    const secondAttempt = compileAttemptIdentity('CACHE', sameClock, 'NONCE-B');
    assert(firstAttempt !== secondAttempt,
      'same-clock compile attempts did not receive collision-resistant identities');
    const exclusiveRoot = path.join(directory, 'exclusive-matching');
    fs.mkdirSync(exclusiveRoot);
    const exclusiveRun = authenticateFreshRunArtifactDirectory(firstAttempt, exclusiveRoot);
    expectError(/fresh compilation artifact directory already exists/, () => (
      authenticateFreshRunArtifactDirectory(firstAttempt, exclusiveRoot)
    ));
    const diagnosticInputId = '9'.repeat(64);
    const firstDiagnostic = createDiagnosticAttemptDirectory(
      exclusiveRun, diagnosticInputId, { nonce: 'ATTEMPT-A' },
    );
    const secondDiagnostic = createDiagnosticAttemptDirectory(
      exclusiveRun, diagnosticInputId, { nonce: 'ATTEMPT-B' },
    );
    assert(firstDiagnostic.attemptId === diagnosticAttemptIdentity(diagnosticInputId, 'ATTEMPT-A')
      && firstDiagnostic.directory !== secondDiagnostic.directory,
    'concurrent diagnostic refreshes shared one output directory');
    assert(firstDiagnostic.manifestSha256 === sha256File(firstDiagnostic.manifestFile),
      'short diagnostic attempt directory lost its full input/nonce manifest binding');
    const diagnosticToolPaths = ['accepted-control.ld', 'accepted-control.input.o', 'accepted-control.elf',
      'candidate.ld', 'candidate.input.o', 'candidate.elf']
      .map((name) => path.join(firstDiagnostic.directory, name));
    assert(Math.max(...diagnosticToolPaths.map((file) => file.length)) < MAX_DIAGNOSTIC_TOOL_PATH,
      'collision-safe diagnostic attempt path exceeds the Windows legacy-tool budget');
    fs.writeFileSync(path.join(firstDiagnostic.directory, 'interleave.txt'), 'first');
    fs.writeFileSync(path.join(secondDiagnostic.directory, 'interleave.txt'), 'second');
    assert(fs.readFileSync(path.join(firstDiagnostic.directory, 'interleave.txt'), 'utf8') === 'first'
      && fs.readFileSync(path.join(secondDiagnostic.directory, 'interleave.txt'), 'utf8') === 'second',
    'one diagnostic attempt consumed another attempt output');

    const snapshotRoot = path.join(directory, 'snapshot-matching');
    const snapshotEscape = path.join(directory, 'snapshot-escape');
    fs.mkdirSync(snapshotRoot);
    fs.mkdirSync(snapshotEscape);
    fs.symlinkSync(snapshotEscape, path.join(snapshotRoot, 'targets'), 'junction');
    expectError(/matching targets directory is not a plain directory/, () => sourceSnapshot(
      { symbol: 'fixture' }, 'void fixture(void) {}\n', 'F'.repeat(64), snapshotRoot,
    ));
    assert(!fs.existsSync(path.join(snapshotEscape, 'fixture')),
      'candidate snapshot was written through a targets junction before authentication');

    const outsidePlainParent = path.join(outsideAncestor, 'plain-parent');
    fs.mkdirSync(outsidePlainParent);
    const ancestorLink = path.join(directory, 'ancestor-link');
    fs.symlinkSync(outsideAncestor, ancestorLink, 'junction');
    const escapedMatchingRoot = path.join(ancestorLink, 'plain-parent', 'matching');
    expectError(/matching artifact parent escapes the real repository root/, () => sourceSnapshot(
      { symbol: 'fixture' }, 'void fixture(void) {}\n', 'F'.repeat(64), escapedMatchingRoot,
    ));
    assert(!fs.existsSync(path.join(outsidePlainParent, 'matching')),
      'candidate snapshot root was created through an ancestor junction before authentication');

    const outsideObject = path.join(directory, 'outside.o');
    fs.writeFileSync(outsideObject, 'object');
    const objectFile = path.join(runDirectory, 'candidate.o');
    let fileSymlinkAvailable = true;
    try {
      fs.symlinkSync(outsideObject, objectFile, 'file');
    } catch (error) {
      if (!['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) throw error;
      fileSymlinkAvailable = false;
    }
    if (fileSymlinkAvailable) {
      const candidate = { candidateId: 'CANDIDATE' };
      const target = { targetId: 'TARGET' };
      fs.writeFileSync(path.join(runDirectory, 'workbench-report.json'), JSON.stringify({
        schemaVersion: 1,
        target: { targetId: target.targetId },
        candidate: { candidateId: candidate.candidateId },
        compile: { runId, cacheKey: run.cache_key, status: 'compiled' },
        scratchContract: {
          artifacts: {
            object: path.relative(ROOT, objectFile).replace(/\\/g, '/'),
            objectSha256: sha256File(outsideObject),
          },
        },
      }));
      expectError(/cached object artifact escapes its real run directory/, () => cachedCandidateArtifact(
        run, candidate, target, matchingRoot,
      ));
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
    fs.rmSync(outsideAncestor, { recursive: true, force: true });
  }
}

function compileCandidateCacheRejectionTests() {
  const testsRoot = path.join(ROOT, 'build', 'tests');
  fs.mkdirSync(testsRoot, { recursive: true });
  const directory = fs.mkdtempSync(path.join(testsRoot, 'matching-cache-auth-'));
  const matchingRoot = path.join(directory, 'matching');
  const runId = 'E'.repeat(64);
  const runDirectory = compileArtifactDirectory(runId, matchingRoot);
  fs.mkdirSync(runDirectory, { recursive: true });
  const target = {
    symbol: 'fixture', targetId: 'TARGET', expectedBytes: bufferFromWords([0]),
    expectedBytesSha256: 'EXPECTED', symbolByteOffset: 0, placementKind: 'overlay',
    bytes: 4, romStart: 0x1000, vramStart: 0x80100000, sectionName: '.fixture',
  };
  const sourceText = 'void fixture(void) {}\n';
  const candidate = candidateRecord(target, sourceText);
  const objectText = target.expectedBytes.toString('base64');
  const tool = {};
  const session = {
    tool,
    toolId: 'TOOL',
    context: { currentFingerprint: 'CURRENT', phase8: { targets: [] } },
  };
  const expectedRelocationEvidence = {
    available: false,
    records: null,
    reason: 'target is not an accepted phase8 C target',
  };
  const cacheKey = digest({
    schemaVersion: 2,
    candidateId: candidate.candidateId,
    targetId: target.targetId,
    toolId: session.toolId,
    expectedRelocationEvidence,
  });
  const cached = {
    run_id: runId,
    candidate_id: candidate.candidateId,
    cache_key: cacheKey,
    status: 'compiled',
    object_text: objectText,
    relocations: [],
    artifact_dir: path.relative(ROOT, runDirectory).replace(/\\/g, '/'),
    tool,
  };
  const storedComparison = {
    details: { schemaVersion: 2, exactBytes: true },
  };
  const storeRequest = (request) => {
    if (request.action === 'put_candidate') return {};
    if (request.action === 'query' && request.name === 'compile_by_cache') return cached;
    if (request.action === 'query' && request.name === 'comparison_for_run') return storedComparison;
    throw new Error(`unexpected synthetic store request: ${request.action}/${request.name || ''}`);
  };
  const compile = (root = matchingRoot) => compileCandidate({}, target, sourceText, {
    matchingRoot: root,
    session,
    storeRequest,
    syncTargets: false,
  });
  const objectFile = path.join(runDirectory, 'candidate.o');
  const reportFile = path.join(runDirectory, 'workbench-report.json');
  const objectBytes = Buffer.from('authenticated-object');
  const report = {
    schemaVersion: 1,
    target: { targetId: target.targetId },
    candidate: { candidateId: candidate.candidateId },
    compile: {
      runId, candidateId: candidate.candidateId, cacheKey, status: 'compiled',
      objectText, relocations: [], tool,
    },
    scratchContract: {
      artifacts: {
        object: path.relative(ROOT, objectFile).replace(/\\/g, '/'),
        objectSha256: null,
      },
    },
  };
  try {
    fs.writeFileSync(objectFile, objectBytes);
    report.scratchContract.artifacts.objectSha256 = sha256File(objectFile);
    fs.writeFileSync(reportFile, JSON.stringify(report));

    fs.unlinkSync(objectFile);
    expectError(/cached object artifact is missing/, compile);
    fs.writeFileSync(objectFile, Buffer.from('drifted-object'));
    expectError(/cached object artifact identity drift/, compile);
    fs.writeFileSync(objectFile, objectBytes);

    fs.unlinkSync(reportFile);
    expectError(/cached compilation report is missing/, compile);
    fs.writeFileSync(reportFile, JSON.stringify({
      ...report,
      candidate: { candidateId: 'WRONG-CANDIDATE' },
    }));
    expectError(/report provenance is stale or malformed/, compile);
    fs.writeFileSync(reportFile, JSON.stringify(report));

    const outsideObject = path.join(directory, 'outside-cache-object.o');
    fs.writeFileSync(outsideObject, objectBytes);
    fs.unlinkSync(objectFile);
    let objectSymlinkAvailable = true;
    try {
      fs.symlinkSync(outsideObject, objectFile, 'file');
    } catch (error) {
      if (!['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) throw error;
      objectSymlinkAvailable = false;
    }
    if (objectSymlinkAvailable) {
      expectError(/cached object artifact escapes its real run directory/, compile);
      fs.unlinkSync(objectFile);
    }

    const junctionRoot = path.join(directory, 'junction-matching');
    const junctionEscape = path.join(directory, 'junction-escape');
    fs.mkdirSync(path.join(junctionRoot, 'targets'), { recursive: true });
    fs.mkdirSync(junctionEscape);
    fs.symlinkSync(junctionEscape, path.join(junctionRoot, 'runs'), 'junction');
    cached.artifact_dir = path.relative(
      ROOT,
      compileArtifactDirectory(runId, junctionRoot),
    ).replace(/\\/g, '/');
    expectError(/matching runs directory is not a plain directory/, () => compile(junctionRoot));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function main() {
  symbolicControlFlowTests();
  relocationIdentityTests();
  ownershipAndRelocationRejectionTests();
  provenanceTests();
  diagnosticEnvironmentIdentityTests();
  symbolicFallbackExactnessTests();
  comparisonInvalidationTests();
  cachedArtifactSecurityTests();
  compileCandidateCacheRejectionTests();
  console.log('Matching diagnostics regression tests passed.');
}

if (require.main === module) main();

module.exports = { main };
