'use strict';

const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const {
  ROOT, fail, elfSectionBytes, parseElfFile, sha256Buffer, sha256File, run,
} = require('./phase7_conventional');

const HEX = /^0x[0-9A-F]{8}$/;
const SHA = /^[0-9A-F]{64}$/;

function normalizeInterior(raw, auxiliary) {
  const keys = ['inputSection', 'sectionType', 'sectionFlags', 'alignment', 'romStart',
    'romEndExclusive', 'vramStart', 'vramEndExclusive', 'bytes', 'expectedSha256',
    'ownerOriginalAssembly', 'ownerOriginalAssemblySha256', 'expectedRelocations'];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)
      || !isDeepStrictEqual(Object.keys(raw).sort(), keys.sort())
      || !['romStart', 'romEndExclusive', 'vramStart', 'vramEndExclusive'].every((key) => HEX.test(raw[key]))
      || raw.inputSection !== `${auxiliary.outputSection}.interior_${raw.romStart.slice(2)}`
      || raw.sectionType !== 'SHT_PROGBITS'
      || !isDeepStrictEqual(raw.sectionFlags, ['SHF_ALLOC']) || raw.alignment !== 1
      || !Number.isInteger(raw.bytes) || raw.bytes <= 0
      || !SHA.test(raw.expectedSha256) || !SHA.test(raw.ownerOriginalAssemblySha256)
      || typeof raw.ownerOriginalAssembly !== 'string'
      || !raw.ownerOriginalAssembly.startsWith('asm/original/')
      || raw.ownerOriginalAssembly.includes('\\') || raw.ownerOriginalAssembly.split('/').includes('..')
      || !isDeepStrictEqual(raw.expectedRelocations, [])) {
    fail('retained interior assembly contract is malformed');
  }
  const result = { ...raw, romStartNumber: Number(raw.romStart), romEndNumber: Number(raw.romEndExclusive),
    vramStartNumber: Number(raw.vramStart), vramEndNumber: Number(raw.vramEndExclusive) };
  if (result.romEndNumber - result.romStartNumber !== raw.bytes
      || result.vramEndNumber - result.vramStartNumber !== raw.bytes
      || raw.romEndExclusive !== auxiliary.romStart || raw.vramEndExclusive !== auxiliary.vramStart) {
    fail('retained interior assembly placement is malformed');
  }
  return result;
}

function resolveInterior(interior, row, slice, baserom) {
  if (interior.romStartNumber <= row.romStart || interior.romEndNumber >= row.romEndExclusive
      || interior.vramStartNumber - slice.vramStart !== interior.romStartNumber - row.romStart
      || interior.vramEndNumber - slice.vramStart !== interior.romEndNumber - row.romStart
      || interior.ownerOriginalAssembly !== row.part.file
      || interior.ownerOriginalAssemblySha256 !== row.part.sha256
      || sha256Buffer(baserom.subarray(interior.romStartNumber, interior.romEndNumber)) !== interior.expectedSha256) {
    fail('retained interior assembly accepted identity or bytes drift');
  }
}

function projectInterior(auxiliary) {
  const interval = auxiliary.preservedInteriorBefore;
  if (!interval) return null;
  return {
    schemaVersion: 1, kind: 'retained-original-assembly',
    inputSection: interval.inputSection, sectionType: interval.sectionType, sectionFlags: interval.sectionFlags,
    alignment: interval.alignment, bytes: interval.bytes, sha256: interval.expectedSha256,
    romStart: interval.romStartNumber, romEndExclusive: interval.romEndNumber,
    vramStart: interval.vramStartNumber, vramEndExclusive: interval.vramEndNumber,
    ownerOriginalAssembly: interval.ownerOriginalAssembly,
    ownerOriginalAssemblySha256: interval.ownerOriginalAssemblySha256,
    expectedRelocations: interval.expectedRelocations,
  };
}

function interiorRecord(target, auxiliary) {
  const interval = projectInterior(auxiliary);
  if (!interval) return null;
  const stem = `objects/assembly/auxiliary/chunk_${String(auxiliary.ownerChunkIndex).padStart(3, '0')}_`
    + interval.inputSection.replace(/^\.ob64\./, '').replace(/\./g, '_');
  return { symbol: target.symbol, outputSection: auxiliary.outputSection, ...interval,
    binaryRelative: `${stem}.bin`, objectRelative: `${stem}.o` };
}

function interiorRecords(targets) {
  return targets.flatMap((target) => (target.auxiliarySections || [])
    .map((auxiliary) => interiorRecord(target, auxiliary)).filter(Boolean));
}

function originalInteriorBytes(elf, auxiliary, baserom) {
  const interval = projectInterior(auxiliary);
  if (!interval) fail('retained interior assembly contract is missing');
  const originalFile = path.join(ROOT, interval.ownerOriginalAssembly);
  if (!fs.existsSync(originalFile) || sha256File(originalFile) !== interval.ownerOriginalAssemblySha256) {
    fail('retained interior original assembly identity drift');
  }
  const sections = elf.sections.filter((section) => section.name === auxiliary.outputSection);
  if (sections.length !== 1 || sections[0].type !== 1 || sections[0].flags !== 2
      || sections[0].size !== auxiliary.ownerSectionBytes) {
    fail('retained interior original section shape drift');
  }
  // The supported original producer is a literal, relocation-free data row.
  // Check real relocation sections before extracting bytes; never strip a live relocation.
  if (elf.sections.some((section) => [4, 9].includes(section.type)
      && section.info === sections[0].index && section.size !== 0)) {
    fail('retained interior original row has unsupported actual relocations');
  }
  const ownerBytes = Buffer.from(elfSectionBytes(elf, sections[0]));
  if (!ownerBytes.equals(baserom.subarray(auxiliary.ownerRomStartNumber, auxiliary.ownerRomEndNumber))) {
    fail('retained interior original row differs from canonical bytes');
  }
  const offset = interval.romStart - auxiliary.ownerRomStartNumber;
  const bytes = Buffer.from(ownerBytes.subarray(offset, offset + interval.bytes));
  if (bytes.length !== interval.bytes || sha256Buffer(bytes) !== interval.sha256) {
    fail('retained interior original bytes drift');
  }
  return bytes;
}

function validateInteriorObject(elf, auxiliary, expectedBytes) {
  const interval = projectInterior(auxiliary);
  const sections = elf.sections.filter((section) => section.name === interval.inputSection);
  if (sections.length !== 1 || sections[0].type !== 1 || sections[0].flags !== 2
      || sections[0].alignment !== interval.alignment || sections[0].size !== interval.bytes
      || elf.sections.some((section) => ['.data', '.bss', '.text', '.rodata'].includes(section.name)
        || ([4, 9].includes(section.type) && section.size !== 0)
        || (section.size > 0 && (section.flags & 2) !== 0 && section !== sections[0]))
      || elf.symbols.some((symbol) => symbol.name && symbol.symbolType !== 3)) {
    fail('retained interior object shape or actual relocation drift');
  }
  const bytes = Buffer.from(elfSectionBytes(elf, sections[0]));
  if (!Buffer.isBuffer(expectedBytes) || !bytes.equals(expectedBytes)
      || sha256Buffer(bytes) !== interval.sha256) fail('retained interior object bytes drift');
  return { actualRelocations: [], bytes: bytes.length, sha256: sha256Buffer(bytes) };
}

function buildInteriorObject(target, auxiliary, output, fallbackFile, objcopy, baserom) {
  const record = interiorRecord(target, auxiliary);
  const original = parseElfFile(fallbackFile);
  const bytes = originalInteriorBytes(original, auxiliary, baserom);
  const binary = path.join(output, record.binaryRelative), object = path.join(output, record.objectRelative);
  fs.mkdirSync(path.dirname(binary), { recursive: true });
  fs.writeFileSync(binary, bytes);
  fs.copyFileSync(fallbackFile, object);
  const metadata = new Set(['.symtab', '.strtab', '.shstrtab']);
  run(objcopy, ['--strip-all', ...original.sections.filter((section) => section.name && !metadata.has(section.name))
    .map((section) => `--remove-section=${section.name}`), record.objectRelative], { cwd: output });
  run(objcopy, [`--add-section=${record.inputSection}=${record.binaryRelative}`,
    `--set-section-flags=${record.inputSection}=alloc,load,readonly,data,contents`, record.objectRelative], { cwd: output });
  validateInteriorObject(parseElfFile(object), auxiliary, bytes);
  return { ...record, binarySha256: sha256File(binary), objectSha256: sha256File(object) };
}

function verifyInteriorArtifacts(target, auxiliary, output, baserom, linkedElf = null) {
  const record = interiorRecord(target, auxiliary);
  if (!record) return null;
  const fallbackRelative = `comparison/original/chunk_${String(auxiliary.ownerChunkIndex).padStart(3, '0')}.o`;
  const original = parseElfFile(path.join(output, fallbackRelative));
  const expectedBytes = originalInteriorBytes(original, auxiliary, baserom);
  const binary = path.join(output, record.binaryRelative), object = path.join(output, record.objectRelative);
  if (!fs.existsSync(binary) || !fs.existsSync(object) || !fs.readFileSync(binary).equals(expectedBytes)) {
    fail('retained interior artifact is missing or stale');
  }
  validateInteriorObject(parseElfFile(object), auxiliary, expectedBytes);
  if (linkedElf) {
    const sections = linkedElf.sections.filter((section) => section.name === auxiliary.outputSection);
    if (sections.length !== 1 || sections[0].address !== auxiliary.ownerVramStartNumber
        || sections[0].size !== auxiliary.ownerSectionBytes || sections[0].type !== 1 || sections[0].flags !== 2) {
      fail('retained interior linked placement or shape drift');
    }
    const offset = record.romStart - auxiliary.ownerRomStartNumber;
    if (!Buffer.from(elfSectionBytes(linkedElf, sections[0])).subarray(offset, offset + record.bytes).equals(expectedBytes)) {
      fail('retained interior linked bytes drift');
    }
  }
  return { ...record, binarySha256: sha256File(binary), objectSha256: sha256File(object),
    originalFallback: fallbackRelative, originalFallbackSha256: sha256Buffer(original.buffer),
    actualOriginalRelocations: [], actualRetainedRelocations: [], rawBytesExact: true };
}

module.exports = { normalizeInterior, resolveInterior, projectInterior, interiorRecord, interiorRecords,
  originalInteriorBytes, validateInteriorObject, buildInteriorObject, verifyInteriorArtifacts };
