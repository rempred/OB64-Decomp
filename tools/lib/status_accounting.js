'use strict';

const { targetTextOwners } = require('./phase8_matching_c');
const { projectInterior } = require('./auxiliary_interior');

function fail(message) {
  throw new Error(`status ownership accounting failed: ${message}`);
}

function validateRow(row, seenRows) {
  if (!row || !Number.isInteger(row.index) || row.index < 0
      || !Number.isInteger(row.romStart) || !Number.isInteger(row.romEndExclusive)
      || !Number.isInteger(row.bytes) || row.bytes <= 0
      || row.romEndExclusive - row.romStart !== row.bytes
      || typeof row.inputKind !== 'string' || !Array.isArray(row.slices) || row.slices.length === 0) {
    fail('accepted row is malformed');
  }
  if (seenRows.has(row.index)) fail(`accepted row index is duplicated: ${row.index}`);
  seenRows.add(row.index);
}

function acceptedSlice(row, sectionName, label) {
  const slices = row.slices.filter((slice) => slice.sectionName === sectionName);
  if (slices.length !== 1) fail(`${label} section census drift: row ${row.index} ${sectionName}`);
  return slices[0];
}

function acceptedAssemblyProvenance(row, record, label) {
  if (row.inputKind !== 'tracked-assembly' || !row.part
      || record.primaryId !== row.primaryId
      || record.chunkIndex !== row.part.chunkIndex
      || record.originalAssembly !== row.part.file
      || record.originalAssemblySha256 !== row.part.sha256) {
    fail(`${label} provenance drift: row ${row.index}`);
  }
}

function subtractClaims(slice, claims) {
  const fragments = [];
  let cursor = slice.romStart;
  for (const claim of claims) {
    if (claim.romStart < cursor) fail(`replacement overlap: row ${slice.rowIndex}`);
    if (claim.romStart > cursor) {
      fragments.push({
        sectionName: slice.sectionName,
        romStart: cursor,
        romEndExclusive: claim.romStart,
        bytes: claim.romStart - cursor,
        executable: slice.executable,
      });
    }
    cursor = claim.romEndExclusive;
  }
  if (cursor < slice.romEndExclusive) {
    fragments.push({
      sectionName: slice.sectionName,
      romStart: cursor,
      romEndExclusive: slice.romEndExclusive,
      bytes: slice.romEndExclusive - cursor,
      executable: slice.executable,
    });
  }
  return fragments;
}

function summarizeAcceptedOwnership(model, targets) {
  if (!model || !Array.isArray(model.rows) || !Array.isArray(targets)) {
    fail('accepted model or active target census is malformed');
  }

  const seenRows = new Set();
  const rowsByIndex = new Map();
  for (const row of model.rows) {
    validateRow(row, seenRows);
    rowsByIndex.set(row.index, row);
  }

  const claimsByRow = new Map();
  const retainedAuxiliaryByRow = new Map();
  const symbols = new Set();
  let textOwnerCount = 0;
  let auxiliaryFragmentCount = 0;

  function addClaim(row, slice, claim) {
    if (claim.romStart < slice.romStart || claim.romEndExclusive > slice.romEndExclusive
        || claim.romEndExclusive - claim.romStart !== claim.bytes || claim.bytes <= 0) {
      fail(`${claim.kind} replacement extent drift: ${claim.symbol} ${slice.sectionName}`);
    }
    if (!claimsByRow.has(row.index)) claimsByRow.set(row.index, []);
    claimsByRow.get(row.index).push(claim);
  }

  function addRetainedAuxiliary(row, slice, auxiliary, kind, targetSymbol) {
    const capitalized = kind[0].toUpperCase() + kind.slice(1);
    const bytes = auxiliary[`owner${capitalized}Bytes`] || 0;
    if (bytes === 0) return;
    const record = {
      kind,
      symbol: targetSymbol,
      sectionName: auxiliary.outputSection,
      inputSection: auxiliary[`owner${capitalized}Section`],
      alignment: auxiliary[`owner${capitalized}Alignment`],
      sha256: auxiliary[`owner${capitalized}Sha256`],
      romStart: auxiliary[`owner${capitalized}RomStartNumber`],
      romEndExclusive: auxiliary[`owner${capitalized}RomEndNumber`],
      vramStart: auxiliary[`owner${capitalized}VramStartNumber`],
      vramEndExclusive: auxiliary[`owner${capitalized}VramEndNumber`],
      bytes,
      originalAssembly: auxiliary.ownerOriginalAssembly,
      originalAssemblySha256: auxiliary.ownerOriginalAssemblySha256,
    };
    const expectedBoundaryStart = kind === 'prefix' ? slice.romStart : auxiliary.romEndNumber;
    const expectedBoundaryEnd = kind === 'prefix' ? auxiliary.romStartNumber : slice.romEndExclusive;
    const expectedVramStart = kind === 'prefix' ? slice.vramStart : auxiliary.vramEndNumber;
    const expectedVramEnd = kind === 'prefix' ? auxiliary.vramStartNumber : slice.vramEndExclusive;
    if (record.inputSection !== `${auxiliary.outputSection}.${kind}`
        || !Number.isInteger(record.alignment) || record.alignment < 1
        || (record.alignment & (record.alignment - 1)) !== 0
        || typeof record.sha256 !== 'string' || record.sha256.length === 0
        || !Number.isInteger(record.romStart) || !Number.isInteger(record.romEndExclusive)
        || record.romStart !== expectedBoundaryStart || record.romEndExclusive !== expectedBoundaryEnd
        || record.romEndExclusive - record.romStart !== bytes
        || !Number.isInteger(record.vramStart) || !Number.isInteger(record.vramEndExclusive)
        || record.vramStart !== expectedVramStart || record.vramEndExclusive !== expectedVramEnd
        || record.vramEndExclusive - record.vramStart !== bytes) {
      fail(`retained auxiliary ${kind} extent drift: ${targetSymbol} ${auxiliary.outputSection}`);
    }
    addRetainedRecord(row, record);
  }

  function addRetainedRecord(row, record) {
    if (!retainedAuxiliaryByRow.has(row.index)) retainedAuxiliaryByRow.set(row.index, []);
    const retained = retainedAuxiliaryByRow.get(row.index);
    if (retained.some((candidate) => (
      candidate.sectionName === record.sectionName
      && candidate.romStart < record.romEndExclusive
      && candidate.romEndExclusive > record.romStart
    ))) {
      fail(`retained auxiliary overlap: row ${row.index}`);
    }
    retained.push(record);
  }

  for (const target of targets) {
    if (!target || typeof target.symbol !== 'string' || target.symbol.length === 0
        || symbols.has(target.symbol)) {
      fail('active target symbol census is malformed');
    }
    symbols.add(target.symbol);

    const owners = targetTextOwners(target);
    if (owners.length === 0 || !Number.isInteger(target.bytes) || target.bytes <= 0
        || owners.reduce((sum, owner) => sum + owner.bytes, 0) !== target.bytes) {
      fail(`target text owner census drift: ${target.symbol}`);
    }
    let logicalCursor = 0;
    for (const [ownerIndex, owner] of owners.entries()) {
      const row = rowsByIndex.get(owner.rowIndex);
      if (!row || owner.ownerIndex !== ownerIndex || owner.logicalOffset !== logicalCursor
          || owner.logicalEnd - owner.logicalOffset !== owner.bytes) {
        fail(`target text owner census drift: ${target.symbol}`);
      }
      acceptedAssemblyProvenance(row, owner, `target text owner ${target.symbol}`);
      const slice = acceptedSlice(row, owner.sectionName, `target text owner ${target.symbol}`);
      if (slice.executable !== true || owner.romStartNumber !== slice.romStart
          || owner.romEndNumber !== slice.romEndExclusive || owner.bytes !== slice.bytes) {
        fail(`target text owner extent drift: ${target.symbol} ${owner.sectionName}`);
      }
      addClaim(row, slice, {
        kind: 'text',
        symbol: target.symbol,
        sectionName: owner.sectionName,
        romStart: owner.romStartNumber,
        romEndExclusive: owner.romEndNumber,
        bytes: owner.bytes,
      });
      logicalCursor = owner.logicalEnd;
      textOwnerCount += 1;
    }
    if (logicalCursor !== target.bytes) fail(`target text owner coverage drift: ${target.symbol}`);

    if (!Array.isArray(target.auxiliarySections)) {
      fail(`target auxiliary owner census drift: ${target.symbol}`);
    }
    for (const auxiliary of target.auxiliarySections) {
      const row = auxiliary && rowsByIndex.get(auxiliary.ownerRowIndex);
      if (!row) fail(`target auxiliary owner row is missing: ${target.symbol}`);
      acceptedAssemblyProvenance(row, {
        primaryId: auxiliary.ownerPrimaryId,
        chunkIndex: auxiliary.ownerChunkIndex,
        originalAssembly: auxiliary.ownerOriginalAssembly,
        originalAssemblySha256: auxiliary.ownerOriginalAssemblySha256,
      }, `target auxiliary owner ${target.symbol}`);
      const slice = acceptedSlice(row, auxiliary.outputSection, `target auxiliary owner ${target.symbol}`);
      if (slice.executable !== false || auxiliary.ownerSectionBytes !== row.bytes
          || auxiliary.ownerRomStartNumber !== row.romStart
          || auxiliary.ownerRomEndNumber !== row.romEndExclusive
          || auxiliary.romEndNumber - auxiliary.romStartNumber !== auxiliary.bytes) {
        fail(`target auxiliary owner extent drift: ${target.symbol} ${auxiliary.outputSection}`);
      }
      if (auxiliary.sourceObjectPrefix) {
        const selection = auxiliary.sourceObjectPrefix;
        if (selection.prefixOffsetNumber !== 0
            || selection.prefixBytes !== auxiliary.bytes
            || selection.trailingPaddingOffsetNumber !== auxiliary.bytes
            || selection.bytes !== selection.prefixBytes + selection.trailingPaddingBytes
            || selection.trailingPaddingBytes !== auxiliary.ownerTailBytes
            || selection.expectedPrefixSha256 !== auxiliary.expectedObjectSha256
            || selection.expectedTrailingPaddingSha256 !== auxiliary.ownerTailSha256) {
          fail(`target auxiliary source-object prefix accounting drift: ${target.symbol} ${auxiliary.outputSection}`);
        }
      }
      addRetainedAuxiliary(row, slice, auxiliary, 'prefix', target.symbol);
      addRetainedAuxiliary(row, slice, auxiliary, 'tail', target.symbol);
      const interior = projectInterior(auxiliary);
      if (interior) {
        if (interior.inputSection !== `${auxiliary.outputSection}.interior_${interior.romStart.toString(16).toUpperCase().padStart(8, '0')}`
            || interior.sectionType !== 'SHT_PROGBITS'
            || JSON.stringify(interior.sectionFlags) !== JSON.stringify(['SHF_ALLOC'])
            || interior.alignment !== 1 || !/^[0-9A-F]{64}$/.test(interior.sha256)
            || !Number.isInteger(interior.bytes) || interior.bytes <= 0
            || ![interior.romStart, interior.romEndExclusive, interior.vramStart, interior.vramEndExclusive].every(Number.isInteger)
            || interior.romStart <= slice.romStart || interior.romEndExclusive !== auxiliary.romStartNumber
            || interior.romEndExclusive - interior.romStart !== interior.bytes
            || interior.vramEndExclusive !== auxiliary.vramStartNumber
            || interior.vramStart - slice.vramStart !== interior.romStart - slice.romStart
            || interior.vramEndExclusive - interior.vramStart !== interior.bytes
            || interior.ownerOriginalAssembly !== row.part.file
            || interior.ownerOriginalAssemblySha256 !== row.part.sha256
            || JSON.stringify(interior.expectedRelocations) !== '[]') {
          fail(`retained auxiliary interior identity or extent drift: ${target.symbol}`);
        }
        addRetainedRecord(row, { ...interior, kind: 'interior', symbol: target.symbol,
          sectionName: auxiliary.outputSection, originalAssembly: interior.ownerOriginalAssembly,
          originalAssemblySha256: interior.ownerOriginalAssemblySha256 });
      }
      addClaim(row, slice, {
        kind: 'auxiliary',
        symbol: target.symbol,
        sectionName: auxiliary.outputSection,
        romStart: auxiliary.romStartNumber,
        romEndExclusive: auxiliary.romEndNumber,
        bytes: auxiliary.bytes,
      });
      auxiliaryFragmentCount += 1;
    }
  }

  let replacementBytes = 0;
  for (const [rowIndex, claims] of claimsByRow) {
    claims.sort((left, right) => left.romStart - right.romStart || left.romEndExclusive - right.romEndExclusive);
    let previousEnd = null;
    for (const claim of claims) {
      if (previousEnd !== null && claim.romStart < previousEnd) fail(`replacement overlap: row ${rowIndex}`);
      replacementBytes += claim.bytes;
      previousEnd = claim.romEndExclusive;
    }
  }

  const assemblyRows = [];
  const otherRows = [];
  for (const row of model.rows) {
    const claims = claimsByRow.get(row.index) || [];
    if (row.inputKind !== 'tracked-assembly') {
      if (claims.length !== 0) fail(`non-assembly row has a source replacement: ${row.index}`);
      otherRows.push({ rowIndex: row.index, bytes: row.bytes });
      continue;
    }

    const fragments = row.slices.flatMap((slice) => subtractClaims(
      slice,
      claims.filter((claim) => claim.sectionName === slice.sectionName),
    ));
    const retainedAuxiliary = (retainedAuxiliaryByRow.get(row.index) || [])
      .sort((left, right) => left.romStart - right.romStart);
    const auxiliaryClaimSections = new Set(claims
      .filter((claim) => claim.kind === 'auxiliary')
      .map((claim) => claim.sectionName));
    const auxiliaryFragments = fragments.filter((fragment) => auxiliaryClaimSections.has(fragment.sectionName));
    if (JSON.stringify(auxiliaryFragments.map((fragment) => ({
      sectionName: fragment.sectionName,
      romStart: fragment.romStart,
      romEndExclusive: fragment.romEndExclusive,
      bytes: fragment.bytes,
    }))) !== JSON.stringify(retainedAuxiliary.map((fragment) => ({
      sectionName: fragment.sectionName,
      romStart: fragment.romStart,
      romEndExclusive: fragment.romEndExclusive,
      bytes: fragment.bytes,
    })))) {
      fail(`retained auxiliary coverage drift: row ${row.index}`);
    }
    const bytes = fragments.reduce((sum, fragment) => sum + fragment.bytes, 0);
    const claimedBytes = claims.reduce((sum, claim) => sum + claim.bytes, 0);
    if (bytes + claimedBytes !== row.bytes) fail(`replacement byte accounting drift: row ${row.index}`);
    if (bytes > 0) assemblyRows.push({ rowIndex: row.index, bytes, fragments });
  }

  return {
    assembly: {
      owners: assemblyRows.length,
      bytes: assemblyRows.reduce((sum, row) => sum + row.bytes, 0),
      rows: assemblyRows,
    },
    otherData: {
      owners: otherRows.length,
      bytes: otherRows.reduce((sum, row) => sum + row.bytes, 0),
      rows: otherRows,
    },
    replacements: {
      textOwners: textOwnerCount,
      auxiliaryFragments: auxiliaryFragmentCount,
      bytes: replacementBytes,
    },
    retainedAuxiliary: {
      fragments: [...retainedAuxiliaryByRow.values()].reduce((sum, records) => sum + records.length, 0),
      bytes: [...retainedAuxiliaryByRow.values()].flat()
        .reduce((sum, record) => sum + record.bytes, 0),
      records: [...retainedAuxiliaryByRow.values()].flat()
        .sort((left, right) => left.romStart - right.romStart),
    },
  };
}

module.exports = { summarizeAcceptedOwnership };
