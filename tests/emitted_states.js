#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { census, parseArguments } = require('../tools/matching_studies/emitted_states');

function objectFixture(word = 0x0c000000, symbolIndex = 1, extraExecutable = false, relocationOrder = null) {
  const names = Buffer.from('\0.text\0.shstrtab\0.strtab\0.symtab\0.rel.text\0.other\0');
  const symbols = Buffer.from('\0callee\0other\0');
  const sections = [
    { name: '', type: 0, bytes: Buffer.alloc(0) },
    { name: '.text', type: 1, flags: 6, bytes: Buffer.alloc(8) },
    { name: '.shstrtab', type: 3, bytes: names },
    { name: '.strtab', type: 3, bytes: symbols },
    { name: '.symtab', type: 2, bytes: Buffer.alloc(80), link: 3, entrySize: 16 },
    { name: '.rel.text', type: 9, bytes: Buffer.alloc(relocationOrder ? 16 : 8), link: 4, info: 1, entrySize: 8 },
    { name: '.other', type: 1, flags: extraExecutable ? 6 : 2, bytes: Buffer.alloc(4) },
  ];
  sections[1].bytes.writeUInt32BE(word, 0);
  sections[4].bytes.writeUInt32BE(1, 16);
  sections[4].bytes.writeUInt32BE(8, 32);
  sections[4].bytes[60] = 3;
  sections[4].bytes.writeUInt16BE(1, 62);
  sections[4].bytes[76] = 3;
  sections[4].bytes.writeUInt16BE(6, 78);
  sections[5].bytes.writeUInt32BE((symbolIndex << 8) | 4, 4);
  if (relocationOrder) {
    sections[1].bytes.writeUInt32BE(0x3c010000, 0);
    sections[1].bytes.writeUInt32BE(0x24210000, 4);
    relocationOrder.forEach((type, index) => {
      sections[5].bytes.writeUInt32BE(type === 5 ? 0 : 4, index * 8);
      sections[5].bytes.writeUInt32BE((symbolIndex << 8) | type, index * 8 + 4);
    });
  }
  let cursor = 52;
  for (const section of sections) {
    section.offset = cursor;
    cursor += section.bytes.length;
  }
  const tableOffset = cursor;
  const buffer = Buffer.alloc(cursor + sections.length * 40);
  Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 2, 1]).copy(buffer);
  buffer.writeUInt16BE(1, 16);
  buffer.writeUInt16BE(8, 18);
  buffer.writeUInt32BE(1, 20);
  buffer.writeUInt32BE(tableOffset, 32);
  buffer.writeUInt16BE(52, 40);
  buffer.writeUInt16BE(40, 46);
  buffer.writeUInt16BE(sections.length, 48);
  buffer.writeUInt16BE(2, 50);
  sections.forEach((section, index) => {
    section.bytes.copy(buffer, section.offset);
    const offset = tableOffset + index * 40;
    buffer.writeUInt32BE(section.name ? names.indexOf(Buffer.from(section.name + '\0')) : 0, offset);
    buffer.writeUInt32BE(section.type, offset + 4);
    buffer.writeUInt32BE(section.flags || 0, offset + 8);
    buffer.writeUInt32BE(section.offset, offset + 16);
    buffer.writeUInt32BE(section.bytes.length, offset + 20);
    buffer.writeUInt32BE(section.link || 0, offset + 24);
    buffer.writeUInt32BE(section.info || 0, offset + 28);
    buffer.writeUInt32BE(section.entrySize || 0, offset + 36);
  });
  return buffer;
}

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-emitted-states-'));
const selectedRoot = path.join(temporaryRoot, 'selected');
const ancestorLink = path.join(temporaryRoot, 'ancestor-link');
const command = path.resolve(__dirname, '../tools/matching_studies/emitted_states.js');
fs.mkdirSync(selectedRoot);

function runCli(args) {
  const result = spawnSync(process.execPath, [command, ...args], { encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}

function writeCase(number, options = {}) {
  const name = `direct-${String(number).padStart(2, '0')}.json`;
  const artifact = path.join(options.outside ? temporaryRoot : selectedRoot, `run-${number}`);
  fs.mkdirSync(artifact);
  const report = {
    status: 'compiled', candidateId: `candidate-${number}`, sourceClass: 'PURE_C', inputSetId: 'input-set',
    artifactDir: artifact,
    actualRelocations: [{ offset: '0x00000000', type: 'R_MIPS_26', symbol: options.symbol || 'callee' }],
    timings: { childProcessElapsedMs: number * 10 },
    ...options.report,
  };
  const symbolIndex = options.symbol === '.other' ? 4 : options.symbol === '.text' ? 3 : options.symbol === 'other' ? 2 : 1;
  const relocationOrder = options.hiLo ? (options.reverse ? [6, 5] : [5, 6]) : null;
  if (relocationOrder) report.actualRelocations = relocationOrder.map(type => ({
    offset: type === 5 ? '0x00000000' : '0x00000004',
    type: type === 5 ? 'R_MIPS_HI16' : 'R_MIPS_LO16', symbol: 'callee',
  }));
  fs.writeFileSync(path.join(artifact, 'candidate.o'), objectFixture(options.word, symbolIndex, options.extraExecutable, relocationOrder));
  fs.writeFileSync(path.join(artifact, 'workbench-report.json'), JSON.stringify({
    target: { symbol: options.target || 'func_test' }, candidate: { candidateId: report.candidateId },
  }));
  fs.writeFileSync(path.join(selectedRoot, name), JSON.stringify(report));
  return { artifact, report };
}

try {
  writeCase(1);
  writeCase(2); // Different candidate identity, same bytes and relocation.
  writeCase(3, { symbol: 'other' }); // Same bytes, different relocation target.
  writeCase(4, { word: 0x08000000 });
  writeCase(5, { target: 'func_other' });
  writeCase(6, { report: { sourceClass: 'HYBRID_C' } });
  writeCase(7, { report: { inputSetId: 'other-input' } });
  writeCase(8, { report: { status: 'failed' } });
  writeCase(9, { extraExecutable: true });
  writeCase(10, { outside: true });
  writeCase(11, { report: { actualRelocations: [] } });
  fs.writeFileSync(path.join(selectedRoot, 'direct-12.json'), '{partial');
  writeCase(14, { symbol: '.text' });
  writeCase(15, { symbol: '.other' });
  writeCase(16, { report: { candidateId: '' } });
  writeCase(17, { report: { status: undefined } });
  writeCase(18, { hiLo: true });
  writeCase(19, { hiLo: true, reverse: true });
  const before = fs.readdirSync(selectedRoot);
  const report = census({ root: selectedRoot, first: 1, last: 15 });
  assert.deepEqual(report.counts, {
    reportsFound: 14, includedObjects: 9, excludedReports: 6,
    distinctEmittedStates: 8, repeatObservations: 1, repeatFraction: 1 / 9,
  });
  assert.deepEqual(report.sameStateGroups, [['direct-01.json', 'direct-02.json']]);
  assert.equal(report.observations[1].sameStateAs, 'direct-01.json');
  assert.notEqual(report.observations[0].emittedStateSha256, report.observations[2].emittedStateSha256);
  assert.notEqual(report.observations[0].emittedStateSha256, report.observations[3].emittedStateSha256);
  assert.equal(report.timings.includedTimedObjects, 9);
  assert.equal(report.timings.summedChildProcess, 570);
  assert.equal(report.timings.summedRepeatedChildProcess, 20);
  assert.equal(report.exclusions[0].status, 'failed');
  assert.match(report.exclusions[1].detail, /one nonempty executable/);
  assert.match(report.exclusions[2].detail, /escapes/);
  assert.match(report.exclusions[3].detail, /relocations differ/);
  assert.equal(report.exclusions[5].reason, 'missing-report');
  assert.deepEqual(fs.readdirSync(selectedRoot), before);
  assert.match(census({ root: selectedRoot, first: 16, last: 16 }).exclusions[0].detail, /candidate identity/);
  const ordered = census({ root: selectedRoot, first: 18, last: 19 });
  assert.equal(ordered.counts.includedObjects, 2);
  assert.equal(ordered.counts.distinctEmittedStates, 2);
  assert.equal(ordered.observations[0].objectTextSha256, ordered.observations[1].objectTextSha256);
  assert.notEqual(ordered.observations[0].orderedRelocationSha256, ordered.observations[1].orderedRelocationSha256);
  assert.throws(() => census({ root: selectedRoot, first: 1, last: 100001 }), /bounded/);
  assert.throws(() => parseArguments(['--root', selectedRoot]), /--last/);
  assert.throws(() => parseArguments(['--root', selectedRoot, '--last', '13', '--unknown', 'x']), /usage/);
  assert.throws(() => parseArguments(['--root', selectedRoot, '--first', '1', '--first', '2', '--last', '13']), /repeated/);
  const success = runCli(['--root', selectedRoot, '--first', '1', '--last', '7']);
  assert.equal(success.status, 0, success.stderr);
  assert.equal(success.stderr, '');
  assert.deepEqual(JSON.parse(success.stdout).sameStateGroups, [['direct-01.json', 'direct-02.json']]);
  const rejectedArguments = runCli(['--root', selectedRoot, '--last', '7', '--last', '8']);
  assert.equal(rejectedArguments.status, 1);
  assert.equal(rejectedArguments.stdout, '');
  assert.match(rejectedArguments.stderr, /repeated option --last/);
  const incomplete = runCli(['--root', selectedRoot, '--first', '1', '--last', '15']);
  assert.equal(incomplete.status, 1);
  assert.deepEqual(JSON.parse(incomplete.stdout).counts, report.counts);
  const missingStatus = runCli(['--root', selectedRoot, '--first', '17', '--last', '17']);
  assert.equal(missingStatus.status, 1);
  assert.equal(JSON.parse(missingStatus.stdout).counts.includedObjects, 0);
  assert.match(JSON.parse(missingStatus.stdout).exclusions[0].detail, /status is missing or unsupported/);
  fs.symlinkSync(temporaryRoot, ancestorLink, process.platform === 'win32' ? 'junction' : 'dir');
  const aliasedRoot = path.join(ancestorLink, 'selected');
  const originalRead = fs.readFileSync;
  let readAttempts = 0;
  try {
    fs.readFileSync = (...args) => {
      readAttempts += 1;
      return originalRead(...args);
    };
    assert.throws(() => census({ root: aliasedRoot, first: 1, last: 7 }), /linked\/reparse path|aliased path/);
  } finally {
    fs.readFileSync = originalRead;
  }
  assert.equal(readAttempts, 0);
  const rejectedAlias = runCli(['--root', aliasedRoot, '--first', '1', '--last', '7']);
  assert.equal(rejectedAlias.status, 1);
  assert.equal(rejectedAlias.stdout, '');
  assert.match(rejectedAlias.stderr, /linked\/reparse path|aliased path/);
  console.log(JSON.stringify({ status: 'pass', cases: 19, cliCases: 5, ancestorJunction: 'rejected-before-read', relocationOrder: 'preserved', includedObjects: 9, distinctEmittedStates: 8, repeatObservations: 1 }));
} finally {
  // Detach the test junction itself before recursively removing owned fixtures.
  if (fs.existsSync(ancestorLink)) {
    assert.ok(fs.lstatSync(ancestorLink).isSymbolicLink());
    fs.unlinkSync(ancestorLink);
  }
  fs.rmSync(temporaryRoot, { recursive: true });
}
