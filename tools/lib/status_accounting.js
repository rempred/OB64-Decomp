'use strict';

const { targetTextOwners } = require('./phase8_matching_c');

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
  };
}

module.exports = { summarizeAcceptedOwnership };
