#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  elfSectionBytes,
  parseElf32BigEndian,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');
const {
  fail,
  loadPhase8Model,
  verifyTargetMapOwner,
} = require('../tools/lib/phase8_matching_c');
const {
  SOURCE_CLASSES,
  classifySource,
  resolvePreprocessor,
} = require('../tools/lib/source_policy');

function usage() {
  console.log('Usage: node tests/phase8_matching_c.js --output <phase8-output>');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, status: 'rejected', message: error.message };
  }
  fail(`${name} mutation was accepted`);
}

function sectionBytes(elf, name) {
  const section = elf.sections.find((candidate) => candidate.name === name);
  if (!section) fail(`test section is missing: ${name}`);
  return Buffer.from(elfSectionBytes(elf, section));
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  const output = value('--output');
  const phase8 = loadPhase8Model();
  const elfBytes = fs.readFileSync(path.join(output, 'phase8.elf'));
  const romBytes = fs.readFileSync(path.join(output, 'phase8.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase8.map'), 'utf8');
  const linkedElf = parseElf32BigEndian(elfBytes);
  const replacedRows = new Set(phase8.targets.map((target) => target.rowIndex));
  const verificationModel = {
    ...phase8.model,
    rows: phase8.model.rows.map((row) => replacedRows.has(row.index) ? { ...row, inputKind: 'matching-c' } : row),
  };
  verifyElfAgainstModel(verificationModel, linkedElf);
  verifyRom(phase8.model, romBytes);
  verifyMap(phase8.model, mapText);
  const targetProofs = [];
  for (const target of phase8.targets) {
    verifyTargetMapOwner(target, mapText);
    const cObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'objects', 'c', `${target.symbol}.o`)));
    const fallbackObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'comparison', 'original', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`)));
    const prunedObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'objects', 'assembly', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`)));
    const linkedText = sectionBytes(linkedElf, target.sectionName);
    const cText = sectionBytes(cObject, target.sectionName);
    const fallbackText = sectionBytes(fallbackObject, target.sectionName);
    if (!linkedText.equals(fallbackText)) fail(`linked/original target comparison is not exact: ${target.symbol}`);
    if (cText.length !== target.bytes) fail(`C object target size drift: ${target.symbol}`);
    if (prunedObject.sections.some((section) => section.name === target.sectionName)) fail(`original assembly target remains linked: ${target.symbol}`);
    targetProofs.push({ symbol: target.symbol, bytes: linkedText.length, originalExcluded: true, soleCOwner: true });
  }

  const mutations = [];
  mutations.push(expectRejection('ROM padding', /linked ROM size drift/, () => {
    verifyRom(phase8.model, Buffer.concat([romBytes, Buffer.from([0])]));
  }));

  const linkedSection = linkedElf.sections.find((section) => section.name === phase8.target.sectionName);
  const sizeDrift = Buffer.from(elfBytes);
  sizeDrift.writeUInt32BE(linkedSection.size + 4, linkedSection.headerOffset + 20);
  mutations.push(expectRejection('target ELF section size', /ELF section size drift/, () => {
    verifyElfAgainstModel(phase8.model, parseElf32BigEndian(sizeDrift));
  }));

  const expectedOwner = `objects/c/${phase8.target.symbol}.o`;
  const wrongOwner = `objects/assembly/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  const fakeSource = classifySource(path.join(__dirname, 'fixtures', 'source-policy', 'ordinary.c'), { preprocessor: resolvePreprocessor() });
  if (fakeSource.class !== SOURCE_CLASSES.PURE_C) fail('ownership falsifier source fixture is not PURE_C');
  verifyRom(phase8.model, romBytes);
  mutations.push(expectRejection('target map owner', /sole matching C object/, () => {
    verifyTargetMapOwner(phase8.target, mapText.split(expectedOwner).join(wrongOwner));
  }));

  console.log(JSON.stringify({
    status: 'pass',
    baseline: { targets: targetProofs.length, targetProofs },
    ownershipFalsifier: {
      fakeSourceClass: fakeSource.class,
      romRemainedExact: true,
      wrongOwnerRejected: true,
    },
    mutations,
  }, null, 2));
}

main();
