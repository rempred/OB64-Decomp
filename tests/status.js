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

function auxiliaryFragment(row, offset, bytes, ownerFragmentIndex, ownerFragmentCount, tailBytes) {
  const slice = row.slices[0];
  const romStartNumber = row.romStart + offset;
  const romEndNumber = romStartNumber + bytes;
  return {
    outputSection: slice.sectionName,
    bytes,
    romStartNumber,
    romEndNumber,
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
    ownerTailBytes: tailBytes,
    ownerTailRomStartNumber: romEndNumber,
    ownerTailRomEndNumber: romEndNumber + tailBytes,
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
      auxiliaryFragment(rows[6], 0, 12, 0, 1, 4),
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
    && remainingByRow.get(6).fragments[0].romStart === rows[6].romEndExclusive - 4,
    'single auxiliary-prefix retained tail disappeared');
  assert(!remainingByRow.has(8), 'fully replaced auxiliary owner remained in assembly accounting');

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

  console.log(JSON.stringify({
    status: 'pass',
    legacyPrimaryRowAccounting: { owners: legacyAssembly.length, bytes: legacyBytes },
    acceptedOwnershipAccounting: {
      owners: result.assembly.owners,
      bytes: result.assembly.bytes,
      retainedRows: [...remainingByRow.keys()],
      textOwnersConsumed: result.replacements.textOwners,
      auxiliaryFragmentsConsumed: result.replacements.auxiliaryFragments,
    },
    otherData: result.otherData,
    failClosedMutations: rejectedMutations,
  }, null, 2));
}

main();
