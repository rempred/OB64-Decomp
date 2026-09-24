'use strict';

const assert = require('assert');
const { loadAcceptedModel, sha256Buffer } = require('../tools/lib/phase7_conventional');
const { transformTrackedPart, transformTrackedPartSource } = require('../tools/build_phase7_conventional');

function fixture(gap = '') {
  const source = Buffer.from(`.set noreorder\n.text\nowner:\n/* 0x00001000 0x80001000 0x00000000 */ .word 0\n${gap}\n/* 0x00001004 0x80001004 0x03E00008 */ .word 0x03E00008\n/* 0x00001008 0x80001008 0x00000000 */ .word 0\n`);
  const row = {
    index: 7, bytes: 12, romStart: 0x1000,
    part: { name: 'owner', file: 'fixture.s', textBytes: source.length, sha256: sha256Buffer(source) },
    slices: [
      { sliceIndex: 0, romStart: 0x1000, sectionName: '.first', executable: true },
      { sliceIndex: 1, romStart: 0x1004, sectionName: '.second', executable: true },
    ],
  };
  return { row, source };
}

function labelSections(source) {
  let section;
  const labels = new Map();
  for (const line of source.split('\n')) {
    const directive = /^\.section ([^,]+)/.exec(line);
    if (directive) section = directive[1];
    const label = /^([A-Za-z_.$][A-Za-z0-9_.$]*|[0-9]+):\s*(?:#.*)?$/.exec(line);
    if (label) labels.set(label[1], section);
  }
  return labels;
}

function runTests(model = loadAcceptedModel()) {
  for (const gap of ['', 'entry:', '/* Entry at the next byte. */\nentry:\n# Alias\nalias:\n1:', '/* multi-line\n comment */\nentry: # inline comment']) {
    const { row, source } = fixture(gap);
    const result = transformTrackedPartSource(row, source);
    const labels = labelSections(result);
    assert.strictEqual(labels.get('owner'), '.first');
    assert.strictEqual(labels.get('__ob64_row_0007_slice_1'), '.second');
    for (const name of ['entry', 'alias', '1']) if (labels.has(name)) assert.strictEqual(labels.get(name), '.second');
    assert.strictEqual((result.match(/\.word /g) || []).length, 3);
  }
  const noCut = fixture('entry:');
  noCut.row.slices.length = 1;
  assert.strictEqual(labelSections(transformTrackedPartSource(noCut.row, noCut.source)).get('entry'), '.first');
  const noOwner = fixture('entry:');
  noOwner.source = Buffer.from(noOwner.source.toString().replace('owner:\n', ''));
  noOwner.row.part.textBytes = noOwner.source.length;
  noOwner.row.part.sha256 = sha256Buffer(noOwner.source);
  assert.strictEqual(labelSections(transformTrackedPartSource(noOwner.row, noOwner.source)).get('owner'), '.first');

  for (const gap of ['.balign 16\nentry:', '.size owner, .-owner\nentry:', 'entry: .word 0', '.byte 0', '/* unterminated comment', '# /*\n.balign 16\n# */\nentry:']) {
    const { row, source } = fixture(gap);
    assert.throws(() => transformTrackedPartSource(row, source), /unsupported tracked assembly at link cut/);
  }
  const badHash = fixture();
  badHash.row.part.sha256 = '0'.repeat(64);
  assert.throws(() => transformTrackedPartSource(badHash.row, badHash.source), /source drift/);
  const badSize = fixture();
  badSize.row.bytes += 4;
  assert.throws(() => transformTrackedPartSource(badSize.row, badSize.source), /word count drift/);
  const badCut = fixture();
  badCut.row.slices[1].romStart += 1;
  assert.throws(() => transformTrackedPartSource(badCut.row, badCut.source), /unaligned.*link cut/);
  const badGrammar = fixture('.section .other');
  assert.throws(() => transformTrackedPartSource(badGrammar.row, badGrammar.source), /section grammar drift/);

  // All accepted split sources still satisfy the constrained insertion grammar.
  for (const row of model.rows.filter(row => row.inputKind === 'tracked-assembly' && row.slices.length > 1)) transformTrackedPart(row);
  const crossing = model.rows.find(row => row.part && row.part.name === 'func_001C904C');
  const labels = labelSections(transformTrackedPart(crossing));
  assert.strictEqual(labels.get('func_001C904C'), crossing.slices[0].sectionName);
  assert.strictEqual(labels.get('func_001C9050'), crossing.slices[1].sectionName);
  return { status: 'pass', negativeControls: 10 };
}

if (require.main === module) console.log(JSON.stringify(runTests()));
module.exports = { runTests };
