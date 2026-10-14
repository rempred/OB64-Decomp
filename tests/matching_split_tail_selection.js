'use strict';

const assert = require('assert');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const v8 = require('v8');
const { ROOT, sha256Buffer } = require('../tools/lib/phase7_conventional');
const { loadActiveTargetModel, resolveAcceptedRows } = require('../tools/lib/active_targets');
const {
  loadWorkbenchModel, resolveTarget, targetRecord, publicTarget, executablePrefixSelection,
  assertExecutablePrefixSelection, executablePrefixComparisonScope, originalOwnerComparison, assertScratchCapability,
  assertExecutablePrefixReportScope,
} = require('../tools/lib/matching/target_model');
const { emitM2cAssembly } = require('../tools/lib/matching/assembly');
const { targetInstructions } = require('../tools/lib/matching/context');
const { compareMips } = require('../tools/lib/matching/mips_analysis');
const { recordCandidate, compileCandidate, compileScratchCandidate, cachedCandidateArtifact } = require('../tools/lib/matching/compiler');
const { runProbe } = require('../tools/lib/matching/probe');
const { runM2c, prepareAndCompile } = require('../tools/lib/matching/m2c');
const { importResearch } = require('../tools/lib/matching/research');
const { prepareTargetDiagnostic, compareCandidateDiagnostic, comparisonIsCurrent,
  validateDiagnosticObjectStructure } = require('../tools/lib/matching/diagnostic_link');

async function run(workbench = loadWorkbenchModel()) {
  const authority = loadActiveTargetModel();
  const shapes = [['func_00119454', 4324, 8], ['func_00127154', 1748, 8],
    ['func_002013D0', 84, 12], ['func_0020FC7C', 320, 4], ['func_0021C8DC', 140, 8]];
  assert.equal(workbench.modelManifest.targetModelContract, 7);
  assert.deepEqual(workbench.modelManifest.multiOwnerConfig, authority.multiOwnerConfigIdentity);
  const selected = workbench.targets.filter(target => target.selectionKind === 'executable-prefix');
  assert.deepEqual(selected.map(target => target.symbol).sort(), shapes.map(([symbol]) => symbol).sort());
  for (const [symbol, bytes, retained] of shapes) {
    const target = resolveTarget(workbench, symbol);
    assert.equal(target.bytes, bytes);
    assert.equal(target.originalOwner.bytes, bytes + retained);
    assert.equal(target.originalOwner.slices[1].bytes, retained);
    assert.equal(target.originalOwner.slices[1].comparisonRole, 'retained-original-assembly');
    const owner = resolveAcceptedRows(authority.model, symbol, authority.multiOwnerContracts).owners[0];
    assert.equal(target.sectionName, owner.sectionName);
    assert.equal(target.romEndExclusive, owner.romEndNumber);
    assert.equal(target.expectedBytes.length, bytes);
    assert.equal(target.expectedBytesSha256, sha256Buffer(workbench.baserom.subarray(target.romStart, target.romEndExclusive)));
    assert.equal(target.originalOwner.expectedBytesSha256,
      sha256Buffer(workbench.baserom.subarray(target.originalOwner.romStart, target.originalOwner.romEndExclusive)));
    assertExecutablePrefixSelection(workbench, target);
    assertExecutablePrefixSelection(authority, target);
    assertScratchCapability(workbench, target);
    assert.deepEqual(publicTarget(target).originalOwner, targetRecord(target).metadata.originalOwner);
    assert.equal(targetInstructions(target).length, bytes / 4);
    const asm = emitM2cAssembly(target, workbench);
    const last = (target.romEndExclusive - 4).toString(16).toUpperCase().padStart(8, '0');
    const tail = target.romEndExclusive.toString(16).toUpperCase().padStart(8, '0');
    assert(asm.includes('/* ' + last + ' '));
    assert(!asm.includes('/* ' + tail + ' '), 'retained ASM entered generated instruction coverage');
    const scope = executablePrefixComparisonScope(target);
    assert.equal(scope.fullOriginalOwnerCompared, false);
    assert.equal(originalOwnerComparison(target).available, false);
    // Real emitted function-size semantics: terminal instructions are not padding.
    const oversized = compareMips(target.expectedBytes, Buffer.concat([target.expectedBytes, Buffer.alloc(8)]), { start: target.vramStart });
    assert.equal(oversized.exactBytes, false);
    assert.equal(oversized.actualBytes, bytes + 8);
    assert.equal(oversized.primaryClass, 'length-mismatch');
  }
  assert(!workbench.bySymbol.has('func_001c904c'));
  assert.equal(executablePrefixSelection(authority, authority.model.rows[3413], workbench.baserom), null);
  const target = resolveTarget(workbench, shapes[0][0]);
  const splitLogical = resolveTarget(workbench, 'func_00040E80');
  const siblingLogical = resolveTarget(workbench, 'func_00040E88');
  assert.equal(siblingLogical.bytes, 8);
  assert.equal(siblingLogical.logicalFragments[0].ownerOffset, 2128);
  assertScratchCapability(workbench, siblingLogical);
  assertExecutablePrefixSelection(authority, siblingLogical);
  assert.throws(() => compileScratchCandidate({ session: { context: { phase8: authority } },
    target: siblingLogical, sourceFile: null, artifactDir: null }), /compiler inputs are malformed/);
  assert.equal(prepareTargetDiagnostic({ context: { phase8: authority } }, siblingLogical,
    { available: false, reason: 'sibling logical control' }).available, false);
  assert.equal(splitLogical.selectionKind, 'logical-body');
  assert.equal(splitLogical.bytes, 8);
  assert.equal(splitLogical.logicalFragments[0].ownerOffset, 2120);
  assertScratchCapability(workbench, splitLogical);
  assertExecutablePrefixSelection(authority, splitLogical);
  assert.throws(() => compileScratchCandidate({ session: { context: { phase8: authority } },
    target: splitLogical, sourceFile: null, artifactDir: null }), /compiler inputs are malformed/);
  assert.equal(prepareTargetDiagnostic({ context: { phase8: authority } }, splitLogical,
    { available: false, reason: 'logical control' }).available, false);
  for (const fakeLogical of [
    { ...target, selectionKind: 'logical-body', originalOwner: undefined, entryEvidence: undefined },
    { ...target, selectionKind: 'logical-body', originalOwner: undefined, entryEvidence: undefined,
      logicalFragments: splitLogical.logicalFragments, logicalFunctions: splitLogical.logicalFunctions,
      logicalCoverage: splitLogical.logicalCoverage, logicalCoverageComplete: true },
    { ...splitLogical, romEndExclusive: splitLogical.romEndExclusive + 4 },
    { ...splitLogical, originalAssemblySha256: '0'.repeat(64) },
  ]) {
    assert.throws(() => assertExecutablePrefixSelection(workbench, fakeLogical), /executable-prefix/);
    assert.throws(() => assertExecutablePrefixSelection(authority, fakeLogical), /executable-prefix/);
    assert.throws(() => compileScratchCandidate({ session: { context: { phase8: authority } },
      target: fakeLogical, sourceFile: null, artifactDir: null }), /executable-prefix/);
    assert.throws(() => prepareTargetDiagnostic({ context: { phase8: authority } }, fakeLogical,
      { available: false, reason: 'forgery' }), /executable-prefix/);
  }
  const row = authority.model.rows[target.rowIndex];
  assert.equal(executablePrefixSelection(authority, row).originalOwner.expectedBytesSha256, null);
  assert(executablePrefixSelection(authority, row).originalOwner.slices.every(slice => slice.expectedBytesSha256 === null));
  assert.throws(() => executablePrefixSelection({ model: authority.model }, row), /owner membership/);
  const clone = value => JSON.parse(JSON.stringify(value));
  const mutations = [
    r => { r.ambiguous = true; }, r => { r.part.hasOwnerLabel = undefined; }, r => { r.part.symbolByteOffset = 4; },
    r => { r.slices[1].executable = true; }, r => { r.slices.reverse(); },
    r => { r.slices[1].romStart += 4; }, r => { r.slices[1].romStart -= 4; },
    r => { r.slices[0].romStart += 4; }, r => { r.slices[1].bytes += 4; },
    r => { r.slices[1].sliceIndex = 0; }, r => { r.slices[0].sliceCount = 3; },
    r => { r.slices[1].primaryId = 'forged'; }, r => { r.slices[0].rowIndex++; },
    r => { r.slices[1].sectionName = r.slices[0].sectionName; },
    r => { r.slices[1].vramStart += 4; }, r => { r.slices[1].overlayDescriptorId++; },
    r => { r.slices[1].placementKind = 'rom-only'; }, r => { r.slices[1].loadSlabId = 'forged'; },
    r => { r.slices[1].nonExecutableRangeId = null; }, r => { r.part.bytes += 4; },
    r => { r.slices[1].ordinal = r.slices[0].ordinal; },
    r => { r.slices[1].romEndExclusive -= 4; },
    r => { r.slices[0].nonExecutableRangeId = 'forged-treatment'; },
  ];
  for (const mutate of mutations) {
    const changed = clone(row); mutate(changed);
    const model = { ...authority.model, rows: authority.model.rows.map(r => r.index === row.index ? changed : r),
      slices: authority.model.slices.flatMap(s => s.rowIndex === row.index ? [] : [s]).concat(changed.slices) };
    assert.equal(executablePrefixSelection({ ...authority, model }, changed, workbench.baserom), null);
  }
  for (const primary of [target.symbol.toLowerCase(), 'func_00000000']) {
    const memberAuthority = { ...authority, multiOwnerContracts: new Map(authority.multiOwnerContracts) };
    memberAuthority.multiOwnerContracts.set(primary, { rows: [row], owners: [], symbol: primary });
    assert.equal(executablePrefixSelection(memberAuthority, row, workbench.baserom), null);
    assert.throws(() => assertExecutablePrefixSelection(memberAuthority, target), /owner membership/);
  }
  const duplicateModel = { ...authority.model, rows: [...authority.model.rows, row] };
  assert.equal(executablePrefixSelection({ ...authority, model: duplicateModel }, row, workbench.baserom), null);
  assert.throws(() => assertExecutablePrefixSelection({ ...authority,
    model: { ...authority.model, config: { ...authority.model.config, changedEvidence: true } } }, target), /originalOwner/);
  const forged = [
    { ...target, bytes: target.bytes + 8 }, { ...target, originalOwner: undefined },
    { ...target, selectionKind: undefined, originalOwner: undefined },
    { ...target, originalAssemblySha256: '0'.repeat(64) },
    { ...target, expectedBytes: Buffer.alloc(target.bytes) }, { ...target, modelId: '0'.repeat(64) },
    { ...target, targetId: '0'.repeat(64) }, { ...target, nativeTextTail: {} },
    { ...target, originalOwner: { ...target.originalOwner, chunkIndex: -1 } },
    { ...target, originalOwner: { ...target.originalOwner, slices: [] } },
    { ...target, entryEvidence: undefined }, { ...target, entryEvidence: 'accepted-owner-metadata' },
  ];
  for (const value of forged) assert.throws(() => assertExecutablePrefixSelection(workbench, value), /executable-prefix/);
  assert.throws(() => assertExecutablePrefixSelection({}, target), /live model/);
  const metadataTarget = resolveTarget(workbench, 'func_0021C8DC');
  const metadataRow = authority.model.rows[metadataTarget.rowIndex];
  assert.equal(metadataTarget.entryEvidence, 'accepted-owner-metadata');
  assert.equal(target.entryEvidence, 'actual-label');
  assertExecutablePrefixSelection(workbench, resolveTarget(workbench, 'func_0021c8dc'));
  assert.equal(executablePrefixSelection(authority, metadataRow, workbench.baserom, 'func_0021C8E0'), null);
  assert.equal(executablePrefixSelection(authority, metadataRow, workbench.baserom, 'foreign_name'), null);
  for (const value of [{ ...metadataTarget, symbol: 'func_0021C8E0' }, { ...metadataTarget, symbol: 'foreign_name' },
    { ...metadataTarget, symbolByteOffset: 4 }, { ...metadataTarget, entryEvidence: 'actual-label' },
    { ...metadataTarget, requestedSymbol: 'foreign_name' }]) {
    assert.throws(() => assertExecutablePrefixSelection(workbench, value), /executable-prefix/);
  }

  // Synthetic inactive ASM stays symbolic even for byte-identical object input.
  // Keep real active membership and unavailable relocation evidence distinct.
  const session = { context: { phase8: authority }, toolId: 'pure-js-selection-test' };
  const matchesTarget = candidate => candidate.symbol === target.symbol && candidate.bytes === target.bytes
    && candidate.romStartNumber === target.romStart && candidate.vramStartNumber === target.vramStart;
  assert.equal(authority.targets.filter(matchesTarget).length, 1, 'real fixture must have one exact active owner');
  const snapshot = v8.deserialize(v8.serialize({ authority, target }));
  assert.deepStrictEqual(snapshot, { authority, target }, 'snapshot must preserve authority and target data types');
  const canonicalTargets = authority.targets;
  const removedIndex = authority.targets.findIndex(matchesTarget);
  const removedTarget = authority.targets[removedIndex];
  const inactiveAuthority = { ...authority, targets: authority.targets.filter(candidate => !matchesTarget(candidate)) };
  assert.equal(inactiveAuthority.targets.length, authority.targets.length - 1);
  assert.equal(inactiveAuthority.targets.filter(matchesTarget).length, 0);
  assert.strictEqual(inactiveAuthority.model, authority.model);
  const restoredTargets = [...inactiveAuthority.targets];
  restoredTargets.splice(removedIndex, 0, removedTarget);
  assert.deepStrictEqual({ ...inactiveAuthority, targets: restoredTargets }, snapshot.authority);
  const inactiveSession = { ...session, context: { ...session.context, phase8: inactiveAuthority } };
  assert.equal(prepareTargetDiagnostic(session, target,
    { available: false, reason: 'active fixture missing relocation evidence' }).code, 'missing-accepted-relocation-contract');
  const expectedRelocationEvidence = { available: false, reason: 'synthetic inactive fixture' };
  const prepared = prepareTargetDiagnostic(inactiveSession, target, expectedRelocationEvidence);
  assert.equal(prepared.code, 'nonactive-asm-owner');
  const comparison = compareCandidateDiagnostic({ session: inactiveSession, target, objectText: target.expectedBytes,
    actualRelocations: [], expectedRelocationEvidence, prepared });
  assert.equal(comparison.acceptanceEligible, false);
  assert.equal(comparison.evidenceMode, 'symbolic-object');
  assert.equal(comparison.comparisonScope.bytes, target.bytes);
  assert.equal(comparison.originalOwnerComparison.available, false);
  assertExecutablePrefixReportScope(target, comparison);
  for (const changed of [undefined, { ...comparison, comparisonScope: undefined },
    { ...comparison, comparisonScope: { ...comparison.comparisonScope, entryEvidence: 'accepted-owner-metadata' } },
    { ...comparison, comparisonScope: { ...comparison.comparisonScope, fullOriginalOwnerCompared: true } }])
    assert.throws(() => assertExecutablePrefixReportScope(target, changed), /comparison scope drift/);
  assert(comparisonIsCurrent({ details: comparison }, prepared));
  assert(!comparisonIsCurrent({ details: { ...comparison, comparisonScope: { ...comparison.comparisonScope, fullOriginalOwnerCompared: true } } }, prepared));
  assert(!comparisonIsCurrent({ details: { ...comparison, originalOwnerComparison: { available: true } } }, prepared));
  assert.strictEqual(authority.targets, canonicalTargets);
  assert.deepStrictEqual(authority, snapshot.authority, 'synthetic diagnostic mutated real authority');
  assert.deepStrictEqual(authority.targets, snapshot.authority.targets, 'synthetic diagnostic mutated active targets');
  assert.deepStrictEqual(target, snapshot.target, 'synthetic diagnostic mutated target bytes or metadata');

  // 013D0 has coincidentally equal 12-byte native rounding and retained ASM.
  const equalTail = resolveTarget(workbench, 'func_002013D0');
  assert.equal((16 - equalTail.bytes % 16) % 16, equalTail.originalOwner.slices[1].bytes);
  assert.equal(executablePrefixComparisonScope(equalTail).bytes, 84);
  assert.equal(executablePrefixComparisonScope(equalTail).fullOriginalOwnerCompared, false);
  // Feed the actual ELF function census API independent section/function sizes.
  // Equal section rounding and retained-ASM lengths do not merge their roles.
  const elf = { header: { type: 1, machine: 8 }, sections: [{ index: 1, name: equalTail.sectionName,
    type: 1, flags: 6, alignment: 16, size: 96 }], symbols: [{ name: equalTail.symbol, sectionIndex: 1,
    symbolType: 2, value: 0, size: 84, binding: 1, visibility: 0 }] };
  assert.equal(validateDiagnosticObjectStructure(elf, equalTail).owner.size, 84);
  const extraInstructions = clone(elf); extraInstructions.symbols[0].size = 92;
  assert.equal(validateDiagnosticObjectStructure(extraInstructions, equalTail).owner.size, 92);
  assert.equal(compareMips(equalTail.expectedBytes, Buffer.concat([equalTail.expectedBytes, Buffer.alloc(8)]),
    { start: equalTail.vramStart }).primaryClass, 'length-mismatch');
  for (const flags of [2, 7, 3]) {
    const wrongFlags = clone(elf); wrongFlags.sections[0].flags = flags;
    assert.throws(() => validateDiagnosticObjectStructure(wrongFlags, equalTail), /read-only PROGBITS/);
  }

  let sideEffects = 0;
  const saved = [fs.writeFileSync, fs.mkdirSync, cp.spawnSync];
  const forbidden = () => { sideEffects++; throw new Error('unexpected side effect'); };
  fs.writeFileSync = fs.mkdirSync = cp.spawnSync = forbidden;
  try {
    const bad = { ...target, selectionKind: undefined, originalOwner: undefined };
    for (const operation of [
      () => recordCandidate(workbench, bad, 'irrelevant'),
      () => compileCandidate(workbench, bad, 'irrelevant'),
      () => compileScratchCandidate({ session, target: bad, sourceFile: 'not-read.c', artifactDir: 'not-created' }),
      () => cachedCandidateArtifact({}, {}, bad, 'not-read', workbench),
      () => cachedCandidateArtifact({}, {}, target, 'not-read'),
      () => prepareTargetDiagnostic(session, bad, expectedRelocationEvidence),
      () => runProbe(workbench, bad, 'irrelevant'),
      () => runM2c(workbench, bad), () => prepareAndCompile(workbench, bad, { compile: false }),
      () => importResearch(workbench, bad, 'not-read.c', {}),
    ]) assert.throws(operation, /executable-prefix/);
  } finally { [fs.writeFileSync, fs.mkdirSync, cp.spawnSync] = saved; }
  assert.equal(sideEffects, 0);
  return { selected: selected.length, shapeMutations: mutations.length, forgedTargets: forged.length, sideEffects };
}

if (require.main === module) run().then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
