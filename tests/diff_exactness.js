#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseElf32BigEndian } = require('../tools/lib/phase7_conventional');
const {
  compareLinkedTargetBytes,
  summarizeTargetComparison,
} = require('../tools/lib/phase8_matching_c');
const { comparisonLabel } = require('../tools/diff');

function fail(message) {
  throw new Error(`diff exactness test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function align4(value) {
  return (value + 3) & ~3;
}

function makeElf(sectionName, vramStart, sectionBuffers, options = {}) {
  const names = Buffer.from(`\0${sectionName}\0.shstrtab\0`, 'utf8');
  const nameOffset = 1;
  const shstrNameOffset = 1 + Buffer.byteLength(sectionName, 'utf8') + 1;
  const programTableOffset = 52;
  let cursor = programTableOffset + sectionBuffers.length * 32;
  const records = sectionBuffers.map((bytes) => {
    const record = { bytes, offset: cursor };
    cursor += bytes.length;
    return record;
  });
  const namesOffset = cursor;
  cursor += names.length;
  const sectionTableOffset = align4(cursor);
  const sectionCount = 2 + records.length;
  const buffer = Buffer.alloc(sectionTableOffset + sectionCount * 40);
  buffer.writeUInt32BE(0x7F454C46, 0);
  buffer[4] = 1;
  buffer[5] = 2;
  buffer[6] = 1;
  buffer.writeUInt16BE(2, 16);
  buffer.writeUInt16BE(8, 18);
  buffer.writeUInt32BE(1, 20);
  buffer.writeUInt32BE(vramStart >>> 0, 24);
  buffer.writeUInt32BE(programTableOffset, 28);
  buffer.writeUInt32BE(sectionTableOffset, 32);
  buffer.writeUInt16BE(52, 40);
  buffer.writeUInt16BE(32, 42);
  buffer.writeUInt16BE(records.length, 44);
  buffer.writeUInt16BE(40, 46);
  buffer.writeUInt16BE(sectionCount, 48);
  buffer.writeUInt16BE(sectionCount - 1, 50);

  records.forEach((record, index) => {
    record.bytes.copy(buffer, record.offset);
    const programHeader = programTableOffset + index * 32;
    buffer.writeUInt32BE(1, programHeader);
    buffer.writeUInt32BE(options.loadOffset === undefined ? record.offset : options.loadOffset, programHeader + 4);
    buffer.writeUInt32BE((options.loadVaddr === undefined ? vramStart : options.loadVaddr) >>> 0, programHeader + 8);
    buffer.writeUInt32BE((options.paddr === undefined ? 0 : options.paddr) >>> 0, programHeader + 12);
    buffer.writeUInt32BE(options.loadFileSize === undefined ? record.bytes.length : options.loadFileSize, programHeader + 16);
    buffer.writeUInt32BE(options.loadMemorySize === undefined ? record.bytes.length : options.loadMemorySize, programHeader + 20);
    buffer.writeUInt32BE(options.loadFlags === undefined ? 5 : options.loadFlags, programHeader + 24);
    buffer.writeUInt32BE(0x1000, programHeader + 28);
    const header = sectionTableOffset + (index + 1) * 40;
    buffer.writeUInt32BE(nameOffset, header);
    buffer.writeUInt32BE(options.type === undefined ? 1 : options.type, header + 4);
    buffer.writeUInt32BE(options.flags === undefined ? 6 : options.flags, header + 8);
    buffer.writeUInt32BE((options.address === undefined ? vramStart : options.address) >>> 0, header + 12);
    buffer.writeUInt32BE(record.offset, header + 16);
    buffer.writeUInt32BE(record.bytes.length, header + 20);
    buffer.writeUInt32BE(4, header + 32);
  });
  names.copy(buffer, namesOffset);
  const shstr = sectionTableOffset + (sectionCount - 1) * 40;
  buffer.writeUInt32BE(shstrNameOffset, shstr);
  buffer.writeUInt32BE(3, shstr + 4);
  buffer.writeUInt32BE(namesOffset, shstr + 16);
  buffer.writeUInt32BE(names.length, shstr + 20);
  buffer.writeUInt32BE(1, shstr + 32);
  return parseElf32BigEndian(buffer);
}

function targetFor(fixture, expectedBytes, symbol = fixture.symbol) {
  return {
    symbol,
    sectionName: fixture.sectionName,
    bytes: expectedBytes.length,
    romStartNumber: 0,
    romEndNumber: expectedBytes.length,
    vramStartNumber: Number.parseInt(fixture.vramStart, 16),
    expectedTextSha256: sha256(expectedBytes),
  };
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

function main() {
  const fixturePath = path.join(__dirname, 'fixtures', 'diff-exactness', 'move-alias.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  if (fixture.schemaVersion !== 1) fail('fixture schema drift');
  const expected = Buffer.from(fixture.retailAdduHex, 'hex');
  const aliasEquivalent = Buffer.from(fixture.gnuOrHex, 'hex');
  const target = targetFor(fixture, expected);
  const expectedElf = makeElf(target.sectionName, target.vramStartNumber, [expected]);
  const aliasElf = makeElf(target.sectionName, target.vramStartNumber, [aliasEquivalent]);
  const exactRaw = compareLinkedTargetBytes(target, expectedElf, expected);
  const aliasRaw = compareLinkedTargetBytes(target, aliasElf, expected);
  assert(exactRaw.rawBytesExact, 'equal linked bytes were not exact');
  assert(!aliasRaw.rawBytesExact, 'alias-equivalent unequal linked bytes were exact');
  assert(aliasRaw.differingByteCount === 1, 'alias mismatch byte count drift');
  assert(aliasRaw.differingInstructionWordCount === 1, 'alias mismatch word count drift');
  assert(aliasRaw.firstDifferenceOffset === 3, 'alias mismatch first offset drift');

  const exactRow = {
    base: { mnemonic: 'move', line: 0, text: [{ text: '0: move v0,a0' }] },
    current: { mnemonic: 'move', line: 0, text: [{ text: ' 0:  move   v0,a0' }] },
  };
  const zeroScore = { rows: [exactRow], max_score: 100, current_score: 0 };
  const exactSummary = summarizeTargetComparison(zeroScore, exactRaw, 'exact fixture');
  const aliasSummary = summarizeTargetComparison(zeroScore, aliasRaw, 'alias fixture');
  assert(exactSummary.asmDifferPairwiseExact && exactSummary.rawBytesExact && exactSummary.exact, 'equal raw bytes and decoded rows were not exact');
  assert(aliasSummary.asmDifferScoreZero && !aliasSummary.rawBytesExact && !aliasSummary.exact, 'zero score hid unequal raw bytes');
  assert(comparisonLabel(exactSummary) === 'EXACT', 'exact display label drift');
  assert(comparisonLabel(aliasSummary) === 'RAW BYTES DIFFER', 'raw mismatch display label drift');
  const scoredEquivalent = summarizeTargetComparison({ ...zeroScore, current_score: 1 }, exactRaw, 'score fixture');
  assert(scoredEquivalent.exact && comparisonLabel(scoredEquivalent) === 'EXACT', 'GNU 2.6 raw-word score overrode exact decoded rows and linked bytes');
  const decodedDifference = summarizeTargetComparison({
    ...zeroScore,
    rows: [{ ...exactRow, current: { ...exactRow.current, mnemonic: 'or', text: [{ text: '0: or v0,a0,zero' }] } }],
  }, exactRaw, 'decoded fixture');
  assert(!decodedDifference.exact && comparisonLabel(decodedDifference) === 'DIFFERS', 'different decoded instructions were exact');

  const relocatedExpected = Buffer.from(fixture.relocated.expectedLinkedHex, 'hex');
  const unresolvedObject = Buffer.from(fixture.relocated.unresolvedObjectHex, 'hex');
  const relocatedTarget = targetFor(fixture, relocatedExpected, 'fixture_relocated_target');
  const finalLinkedElf = makeElf(relocatedTarget.sectionName, relocatedTarget.vramStartNumber, [relocatedExpected]);
  const relocatableObjectElf = makeElf(relocatedTarget.sectionName, relocatedTarget.vramStartNumber, [unresolvedObject]);
  assert(compareLinkedTargetBytes(relocatedTarget, finalLinkedElf, relocatedExpected).rawBytesExact, 'final relocated linked bytes were not exact');
  assert(!compareLinkedTargetBytes(relocatedTarget, relocatableObjectElf, relocatedExpected).rawBytesExact, 'unresolved relocatable object substituted for linked bytes');

  const rejections = [];
  rejections.push(expectRejection('missing section', /section count drift/, () => {
    compareLinkedTargetBytes(target, makeElf('.ob64.other', target.vramStartNumber, [expected]), expected);
  }));
  rejections.push(expectRejection('duplicate section', /section count drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected, expected]), expected);
  }));
  rejections.push(expectRejection('wrong-sized section', /section shape drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [Buffer.concat([expected, expected])]), expected);
  }));
  rejections.push(expectRejection('wrong section type', /section shape drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected], { type: 8 }), expected);
  }));
  rejections.push(expectRejection('non-executable section', /section shape drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected], { flags: 2 }), expected);
  }));
  rejections.push(expectRejection('wrong linked address', /section shape drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected], { address: target.vramStartNumber + 4 }), expected);
  }));
  rejections.push(expectRejection('wrong load ROM placement', /load placement drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected], { paddr: 4 }), expected);
  }));
  rejections.push(expectRejection('wrong load file size', /load placement drift/, () => {
    compareLinkedTargetBytes(target, makeElf(target.sectionName, target.vramStartNumber, [expected], { loadFileSize: 8 }), expected);
  }));
  rejections.push(expectRejection('malformed ELF object', /ELF is malformed/, () => {
    compareLinkedTargetBytes(target, {}, expected);
  }));
  const badRangeElf = makeElf(target.sectionName, target.vramStartNumber, [expected]);
  const badRangeSection = badRangeElf.sections.find((section) => section.name === target.sectionName);
  const badRangeLoad = badRangeElf.programHeaders.find((header) => header.offset === badRangeSection.offset);
  badRangeSection.offset = badRangeElf.buffer.length;
  badRangeLoad.offset = badRangeElf.buffer.length;
  rejections.push(expectRejection('malformed section range', /section bytes exceed file/, () => {
    compareLinkedTargetBytes(target, badRangeElf, expected);
  }));
  rejections.push(expectRejection('wrong expected identity', /expected identity drift/, () => {
    compareLinkedTargetBytes(target, expectedElf, aliasEquivalent);
  }));
  rejections.push(expectRejection('malformed asm-differ result', /valid nonempty asm-differ score/, () => {
    summarizeTargetComparison({ rows: [], max_score: 0, current_score: 0 }, exactRaw, 'malformed fixture');
  }));
  rejections.push(expectRejection('out-of-range asm-differ score', /valid nonempty asm-differ score/, () => {
    summarizeTargetComparison({ rows: [{}], max_score: 100, current_score: 101 }, exactRaw, 'out-of-range fixture');
  }));
  rejections.push(expectRejection('fractional asm-differ score', /valid nonempty asm-differ score/, () => {
    summarizeTargetComparison({ rows: [{}], max_score: 100, current_score: 0.5 }, exactRaw, 'fractional fixture');
  }));
  rejections.push(expectRejection('malformed asm-differ row', /valid nonempty asm-differ score/, () => {
    summarizeTargetComparison({ rows: [null], max_score: 100, current_score: 0 }, exactRaw, 'row fixture');
  }));

  console.log(JSON.stringify({
    status: 'pass',
    fixture: path.relative(path.resolve(__dirname, '..'), fixturePath).replace(/\\/g, '/'),
    aliasEquivalentRawMismatch: {
      asmDifferScoreZero: aliasSummary.asmDifferScoreZero,
      asmDifferPairwiseExact: aliasSummary.asmDifferPairwiseExact,
      rawBytesExact: aliasSummary.rawBytesExact,
      exact: aliasSummary.exact,
      differingByteCount: aliasSummary.differingByteCount,
      differingInstructionWordCount: aliasSummary.differingInstructionWordCount,
      firstDifferenceOffset: aliasSummary.firstDifferenceOffset,
      label: comparisonLabel(aliasSummary),
    },
    equalBytes: {
      exact: exactSummary.exact,
      label: comparisonLabel(exactSummary),
    },
    relocatedFinalLinkedBytes: true,
    failClosedMutations: rejections,
  }, null, 2));
}

main();
