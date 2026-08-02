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
  const cObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'objects', 'c', `${phase8.target.symbol}.o`)));
  const fallbackObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'comparison', 'original', `chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`)));
  const linkedElf = parseElf32BigEndian(elfBytes);
  verifyElfAgainstModel(phase8.model, linkedElf);
  verifyRom(phase8.model, romBytes);
  verifyMap(phase8.model, mapText);
  verifyTargetMapOwner(phase8, mapText);

  const linkedText = sectionBytes(linkedElf, phase8.target.sectionName);
  const cText = sectionBytes(cObject, phase8.target.sectionName);
  const fallbackText = sectionBytes(fallbackObject, phase8.target.sectionName);
  if (!linkedText.equals(cText) || !linkedText.equals(fallbackText)) fail('baseline target comparison is not exact');

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
  mutations.push(expectRejection('target map owner', /sole matching C object/, () => {
    verifyTargetMapOwner(phase8, mapText.split(expectedOwner).join(wrongOwner));
  }));

  console.log(JSON.stringify({
    status: 'pass',
    baseline: {
      symbol: phase8.target.symbol,
      bytes: linkedText.length,
      cMatchesLinked: true,
      fallbackMatchesLinked: true,
    },
    mutations,
  }, null, 2));
}

main();
