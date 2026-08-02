#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  fail,
  loadAcceptedModel,
  parseElf32BigEndian,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');

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

function main() {
  const output = value('--output');
  const model = loadAcceptedModel();
  const elfBytes = fs.readFileSync(path.join(output, 'phase7.elf'));
  const romBytes = fs.readFileSync(path.join(output, 'phase7.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase7.map'), 'utf8');
  const baselineElf = parseElf32BigEndian(elfBytes);
  verifyElfAgainstModel(model, baselineElf);
  verifyRom(model, romBytes);
  verifyMap(model, mapText);

  const results = [];
  results.push(expectRejection('ROM padding', /linked ROM size drift/, () => {
    verifyRom(model, Buffer.concat([romBytes, Buffer.from([0])]));
  }));

  const representative = model.config.representativeSymbols[0];
  const representativeSlice = model.rows[representative.rowIndex].slices[0];
  const section = baselineElf.sections.find((candidate) => candidate.name === representativeSlice.sectionName);
  if (!section) fail(`baseline test section is missing: ${representativeSlice.sectionName}`);
  const sizeDrift = Buffer.from(elfBytes);
  sizeDrift.writeUInt32BE(section.size + 4, section.headerOffset + 20);
  results.push(expectRejection('ELF section size', /ELF section size drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(sizeDrift));
  }));

  const loadHeader = baselineElf.programHeaders.find((candidate) => (
    candidate.type === 1
    && candidate.vaddr === representativeSlice.vramStart
    && candidate.paddr === representativeSlice.romStart
    && candidate.fileSize === representativeSlice.bytes
  ));
  if (!loadHeader) fail(`baseline test load header is missing: ${representativeSlice.sectionName}`);
  const placementDrift = Buffer.from(elfBytes);
  const programHeaderOffset = baselineElf.header.phoff + loadHeader.index * baselineElf.header.phentsize;
  placementDrift.writeUInt32BE(loadHeader.paddr + 4, programHeaderOffset + 12);
  results.push(expectRejection('ELF load placement', /ELF load address drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(placementDrift));
  }));

  console.log(JSON.stringify({ status: 'pass', baseline: 'verified', mutations: results }, null, 2));
}

main();
