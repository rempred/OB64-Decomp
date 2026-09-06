#!/usr/bin/env node
'use strict';

const { summarizeAcceptedOwnership } = require('../tools/lib/status_accounting');

function fail(message) {
  throw new Error(`status test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, message: error.message };
  }
  fail(`${name} was accepted`);
}

function makeRow(index, romStart, segments, inputKind = 'tracked-assembly') {
  const bytes = segments.reduce((sum, segment) => sum + segment.bytes, 0);
  const primaryId = `primary:${index}`;
  const part = inputKind === 'tracked-assembly' ? {
    chunkIndex: index,
    file: `asm/row_${index}.s`,
    sha256: `SHA256-${index}`,
  } : null;
  let cursor = romStart;
  const slices = segments.map((segment, sliceIndex) => {
    const slice = {
      rowIndex: index,
      sliceIndex,
      sliceCount: segments.length,
      sectionName: `.ob64.r${index}.s${sliceIndex}`,
      romStart: cursor,
      romEndExclusive: cursor + segment.bytes,
      vramStart: 0x80000000 + cursor,
      vramEndExclusive: 0x80000000 + cursor + segment.bytes,
      bytes: segment.bytes,
      executable: segment.executable,
      inputKind,
      primaryId,
    };
    cursor = slice.romEndExclusive;
    return slice;
  });
  return {
    index,
    primaryId,
    romStart,
    romEndExclusive: romStart + bytes,
    bytes,
    inputKind,
    part,
    slices,
  };
}

function textOwner(row, sliceIndex, ownerIndex, logicalOffset) {
  const slice = row.slices[sliceIndex];
  return {
    ownerIndex,
    logicalOffset,
    logicalEnd: logicalOffset + slice.bytes,
    primaryId: row.primaryId,
    rowIndex: row.index,
    chunkIndex: row.part.chunkIndex,
    sectionName: slice.sectionName,
    originalAssembly: row.part.file,
    originalAssemblySha256: row.part.sha256,
    romStartNumber: slice.romStart,
    romEndNumber: slice.romEndExclusive,
    bytes: slice.bytes,
  };
}

function auxiliaryFragment(row, offset, bytes, ownerFragmentIndex, ownerFragmentCount, tailBytes, prefixBytes = 0) {
  const slice = row.slices[0];
  const romStartNumber = row.romStart + offset;
  const romEndNumber = romStartNumber + bytes;
  const vramStartNumber = 0x80000000 + romStartNumber;
  const vramEndNumber = vramStartNumber + bytes;
  return {
    outputSection: slice.sectionName,
    bytes,
    romStartNumber,
    romEndNumber,
    vramStartNumber,
    vramEndNumber,
    ownerRowIndex: row.index,
    ownerPrimaryId: row.primaryId,
    ownerChunkIndex: row.part.chunkIndex,
    ownerSectionBytes: row.bytes,
    ownerRomStartNumber: row.romStart,
    ownerRomEndNumber: row.romEndExclusive,
    ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256,
    ownerFragmentIndex,
    ownerFragmentCount,
    ownerPrefixSection: prefixBytes > 0 ? `${slice.sectionName}.prefix` : null,
    ownerPrefixAlignment: 1,
    ownerPrefixBytes: prefixBytes,
    ownerPrefixSha256: prefixBytes > 0 ? `PREFIX-${row.index}` : null,
    ownerPrefixRomStartNumber: romStartNumber - prefixBytes,
    ownerPrefixRomEndNumber: romStartNumber,
    ownerPrefixVramStartNumber: vramStartNumber - prefixBytes,
    ownerPrefixVramEndNumber: vramStartNumber,
    ownerTailSection: tailBytes > 0 ? `${slice.sectionName}.tail` : null,
    ownerTailAlignment: 1,
    ownerTailBytes: tailBytes,
    ownerTailSha256: tailBytes > 0 ? `TAIL-${row.index}` : null,
    ownerTailRomStartNumber: romEndNumber,
    ownerTailRomEndNumber: romEndNumber + tailBytes,
    ownerTailVramStartNumber: vramEndNumber,
    ownerTailVramEndNumber: vramEndNumber + tailBytes,
  };
}

function makeTarget(symbol, owners, auxiliarySections = []) {
  return {
    symbol,
    rowIndex: owners[0].rowIndex,
    bytes: owners.reduce((sum, owner) => sum + owner.bytes, 0),
    textOwners: owners,
    auxiliarySections,
  };
}

function main() {
  const rows = [
    makeRow(0, 0x1000, [{ bytes: 16, executable: true }]),
    makeRow(1, 0x1010, [{ bytes: 8, executable: true }]),
    makeRow(2, 0x1018, [{ bytes: 4, executable: true }]),
    makeRow(3, 0x101C, [{ bytes: 12, executable: true }]),
    makeRow(4, 0x1028, [{ bytes: 12, executable: true }, { bytes: 4, executable: false }]),
    makeRow(5, 0x1038, [{ bytes: 20, executable: false }]),
    makeRow(6, 0x104C, [{ bytes: 16, executable: false }]),
    makeRow(7, 0x105C, [{ bytes: 32, executable: false }], 'splat-data'),
    makeRow(8, 0x107C, [{ bytes: 16, executable: false }]),
  ];

  const singleOwner = textOwner(rows[1], 0, 0, 0);
  const multiOwnerFirst = textOwner(rows[2], 0, 0, 0);
  const multiOwnerSecond = textOwner(rows[3], 0, 1, multiOwnerFirst.bytes);
  const splitOwner = textOwner(rows[4], 0, 0, 0);
  const targets = [
    makeTarget('single_target', [singleOwner], [auxiliaryFragment(rows[5], 0, 8, 0, 2, 0)]),
    makeTarget('multi_target', [multiOwnerFirst, multiOwnerSecond], [auxiliaryFragment(rows[5], 8, 4, 1, 2, 8)]),
    makeTarget('split_target', [splitOwner], [
      auxiliaryFragment(rows[6], 4, 12, 0, 1, 0, 4),
      auxiliaryFragment(rows[8], 0, 16, 0, 1, 0),
    ]),
  ];

  const result = summarizeAcceptedOwnership({ rows }, targets);
  assert(result.assembly.owners === 4, 'remaining assembly owner count drift');
  assert(result.assembly.bytes === 32, 'remaining assembly byte count drift');
  assert(result.otherData.owners === 1 && result.otherData.bytes === 32, 'other/data accounting drift');
  assert(result.replacements.textOwners === 4, 'multi-owner text census collapsed to target count');
  assert(result.replacements.auxiliaryFragments === 4, 'auxiliary fragment census drift');
  assert(result.replacements.bytes === 76, 'replacement byte census drift');
  assert(result.retainedAuxiliary.fragments === 2 && result.retainedAuxiliary.bytes === 12,
    'retained auxiliary fragment accounting drift');

  const remainingByRow = new Map(result.assembly.rows.map((row) => [row.rowIndex, row]));
  assert(remainingByRow.get(0).bytes === 16, 'unreplaced assembly owner disappeared');
  assert(!remainingByRow.has(1) && !remainingByRow.has(2) && !remainingByRow.has(3),
    'consumed text owner remained in assembly accounting');
  assert(remainingByRow.get(4).bytes === 4
    && remainingByRow.get(4).fragments[0].sectionName === rows[4].slices[1].sectionName,
    'retained split-row assembly fragment disappeared');
  assert(remainingByRow.get(5).bytes === 8
    && remainingByRow.get(5).fragments[0].romStart === rows[5].romEndExclusive - 8,
    'retained auxiliary tail disappeared');
  assert(remainingByRow.get(6).bytes === 4
    && remainingByRow.get(6).fragments[0].romStart === rows[6].romStart,
    'single auxiliary retained prefix disappeared');
  assert(!remainingByRow.has(8), 'fully replaced auxiliary owner remained in assembly accounting');

  const alignedTextRow = makeRow(9, 0x108C, [{ bytes: 8, executable: true }]);
  const alignedDataRow = makeRow(10, 0x1094, [{ bytes: 48, executable: false }]);
  const alignedAuxiliary = auxiliaryFragment(alignedDataRow, 0, 44, 0, 1, 4);
  alignedAuxiliary.expectedObjectSha256 = 'OBJECT-PREFIX-10';
  alignedAuxiliary.sourceObjectPrefix = {
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 8,
    bytes: 48,
    expectedSha256: 'WHOLE-SOURCE-OBJECT-10',
    prefixOffset: '0x00000000',
    prefixOffsetNumber: 0,
    prefixBytes: 44,
    expectedPrefixSha256: alignedAuxiliary.expectedObjectSha256,
    trailingPaddingOffset: '0x0000002C',
    trailingPaddingOffsetNumber: 44,
    trailingPaddingBytes: 4,
    expectedTrailingPaddingSha256: alignedAuxiliary.ownerTailSha256,
  };
  const alignedTargets = [makeTarget(
    'aligned_prefix_target',
    [textOwner(alignedTextRow, 0, 0, 0)],
    [alignedAuxiliary],
  )];
  const alignedResult = summarizeAcceptedOwnership(
    { rows: [alignedTextRow, alignedDataRow] },
    alignedTargets,
  );
  assert(alignedResult.replacements.textOwners === 1
      && alignedResult.replacements.auxiliaryFragments === 1
      && alignedResult.replacements.bytes === 52,
  'aligned source-object prefix inflated replacement accounting');
  assert(alignedResult.retainedAuxiliary.fragments === 1
      && alignedResult.retainedAuxiliary.bytes === 4
      && alignedResult.assembly.owners === 1
      && alignedResult.assembly.bytes === 4,
  'aligned source-object prefix did not preserve the assembly tail accounting');

  const legacyPrimaryRows = new Set(targets.map((target) => target.rowIndex));
  const legacyAssembly = rows.filter((row) => (
    row.inputKind === 'tracked-assembly' && !legacyPrimaryRows.has(row.index)
  ));
  const legacyBytes = legacyAssembly.reduce((sum, row) => sum + row.bytes, 0);
  assert(legacyBytes === 80 && legacyAssembly.length === 5, 'legacy regression fixture drift');

  const rejectedMutations = [];
  const wrongProvenance = JSON.parse(JSON.stringify(targets));
  wrongProvenance[1].textOwners[1].primaryId = 'primary:wrong';
  rejectedMutations.push(expectRejection('wrong text owner provenance', /target text owner multi_target provenance drift/, () => {
    summarizeAcceptedOwnership({ rows }, wrongProvenance);
  }));

  for (const [field, value] of [
    ['chunkIndex', 999],
    ['originalAssembly', 'asm/wrong.s'],
    ['originalAssemblySha256', 'WRONG'],
  ]) {
    const wrongTextSource = JSON.parse(JSON.stringify(targets));
    wrongTextSource[1].textOwners[1][field] = value;
    rejectedMutations.push(expectRejection(`wrong text owner ${field}`, /target text owner multi_target provenance drift/, () => {
      summarizeAcceptedOwnership({ rows }, wrongTextSource);
    }));
  }

  const missingPrefix = JSON.parse(JSON.stringify(targets));
  Object.assign(missingPrefix[2].auxiliarySections[0], {
    ownerPrefixSection: null,
    ownerPrefixBytes: 0,
  });
  rejectedMutations.push(expectRejection('missing retained auxiliary prefix', /retained auxiliary coverage drift/, () => {
    summarizeAcceptedOwnership({ rows }, missingPrefix);
  }));

  const gappedPrefix = JSON.parse(JSON.stringify(targets));
  gappedPrefix[2].auxiliarySections[0].ownerPrefixRomStartNumber += 1;
  gappedPrefix[2].auxiliarySections[0].ownerPrefixVramStartNumber += 1;
  rejectedMutations.push(expectRejection('gapped retained auxiliary prefix', /retained auxiliary prefix extent drift/, () => {
    summarizeAcceptedOwnership({ rows }, gappedPrefix);
  }));

  const misplacedPrefixVram = JSON.parse(JSON.stringify(targets));
  misplacedPrefixVram[2].auxiliarySections[0].ownerPrefixVramStartNumber += 4;
  misplacedPrefixVram[2].auxiliarySections[0].ownerPrefixVramEndNumber += 4;
  rejectedMutations.push(expectRejection('misplaced retained auxiliary prefix VMA', /retained auxiliary prefix extent drift/, () => {
    summarizeAcceptedOwnership({ rows }, misplacedPrefixVram);
  }));

  const duplicatedRetainedFragment = JSON.parse(JSON.stringify(targets));
  const duplicated = duplicatedRetainedFragment[2].auxiliarySections[0];
  Object.assign(duplicated, {
    ownerTailSection: `${duplicated.outputSection}.tail`,
    ownerTailBytes: 4,
    ownerTailSha256: 'DUPLICATE',
    ownerTailRomStartNumber: duplicated.romStartNumber,
    ownerTailRomEndNumber: duplicated.romStartNumber + 4,
    ownerTailVramStartNumber: duplicated.vramStartNumber,
    ownerTailVramEndNumber: duplicated.vramStartNumber + 4,
  });
  rejectedMutations.push(expectRejection('overlapping retained auxiliary fragments', /retained auxiliary tail extent drift|retained auxiliary overlap/, () => {
    summarizeAcceptedOwnership({ rows }, duplicatedRetainedFragment);
  }));

  const missingAssemblyPart = JSON.parse(JSON.stringify(rows));
  missingAssemblyPart[1].part = null;
  rejectedMutations.push(expectRejection('missing accepted assembly part', /target text owner single_target provenance drift/, () => {
    summarizeAcceptedOwnership({ rows: missingAssemblyPart }, targets);
  }));

  const overlappingOwner = JSON.parse(JSON.stringify(targets));
  overlappingOwner.push(makeTarget('duplicate_owner_target', [{ ...singleOwner, ownerIndex: 0 }]));
  rejectedMutations.push(expectRejection('duplicate consumed owner', /replacement overlap: row 1/, () => {
    summarizeAcceptedOwnership({ rows }, overlappingOwner);
  }));

  const wrongAuxiliaryOwner = JSON.parse(JSON.stringify(targets));
  wrongAuxiliaryOwner[0].auxiliarySections[0].ownerRowIndex = 7;
  rejectedMutations.push(expectRejection('non-assembly auxiliary owner', /target auxiliary owner single_target provenance drift/, () => {
    summarizeAcceptedOwnership({ rows }, wrongAuxiliaryOwner);
  }));

  for (const [field, value] of [
    ['ownerChunkIndex', 999],
    ['ownerOriginalAssembly', 'asm/wrong.s'],
    ['ownerOriginalAssemblySha256', 'WRONG'],
  ]) {
    const wrongAuxiliarySource = JSON.parse(JSON.stringify(targets));
    wrongAuxiliarySource[0].auxiliarySections[0][field] = value;
    rejectedMutations.push(expectRejection(`wrong auxiliary owner ${field}`, /target auxiliary owner single_target provenance drift/, () => {
      summarizeAcceptedOwnership({ rows }, wrongAuxiliarySource);
    }));
  }

  for (const [name, mutate] of [
    ['prefix offset', (selection) => { selection.prefixOffsetNumber = 4; }],
    ['prefix bytes', (selection) => { selection.prefixBytes = 40; }],
    ['trailing offset', (selection) => { selection.trailingPaddingOffsetNumber = 40; }],
    ['trailing bytes', (selection) => { selection.trailingPaddingBytes = 8; }],
    ['whole bytes', (selection) => { selection.bytes = 52; }],
    ['prefix identity', (selection) => { selection.expectedPrefixSha256 = 'WRONG'; }],
    ['tail identity', (selection) => { selection.expectedTrailingPaddingSha256 = 'WRONG'; }],
  ]) {
    const changed = JSON.parse(JSON.stringify(alignedTargets));
    mutate(changed[0].auxiliarySections[0].sourceObjectPrefix);
    rejectedMutations.push(expectRejection(
      `aligned source-object ${name}`,
      /source-object prefix accounting drift/,
      () => summarizeAcceptedOwnership({ rows: [alignedTextRow, alignedDataRow] }, changed),
    ));
  }

  console.log(JSON.stringify({
    status: 'pass',
    legacyPrimaryRowAccounting: { owners: legacyAssembly.length, bytes: legacyBytes },
    acceptedOwnershipAccounting: {
      owners: result.assembly.owners,
      bytes: result.assembly.bytes,
      retainedRows: [...remainingByRow.keys()],
      textOwnersConsumed: result.replacements.textOwners,
      auxiliaryFragmentsConsumed: result.replacements.auxiliaryFragments,
      retainedAuxiliaryFragments: result.retainedAuxiliary.fragments,
      retainedAuxiliaryBytes: result.retainedAuxiliary.bytes,
    },
    alignedSourceObjectPrefixAccounting: {
      replacementBytes: alignedResult.replacements.bytes,
      retainedAssemblyBytes: alignedResult.assembly.bytes,
      retainedAuxiliaryBytes: alignedResult.retainedAuxiliary.bytes,
    },
    otherData: result.otherData,
    failClosedMutations: rejectedMutations,
  }, null, 2));
}

main();
