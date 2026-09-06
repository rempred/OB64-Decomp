#!/usr/bin/env node
'use strict';

// Isolated original-row ownership fixture. Table proxies are assembly test inputs,
// not new C implementations or production ownership. Real C proof is a separate probe.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, hex, parseElfFile, elfSectionBytes, sha256Buffer, sha256File } = require('../tools/lib/phase7_conventional');
const { loadActiveTargetModel, normalizeAuxiliarySectionContracts, resolveAuxiliarySectionContracts,
  validateAuxiliaryOwnerGroups, resolveAcceptedRows } = require('../tools/lib/active_targets');
const { summarizeAcceptedOwnership } = require('../tools/lib/status_accounting');
const { buildInteriorObject, originalInteriorBytes, validateInteriorObject, verifyInteriorArtifacts,
  projectInterior, interiorRecord } = require('../tools/lib/auxiliary_interior');
const { renderPhase8LinkerScript, verifyInteriorGroupMapOwners, compareLinkedAuxiliaryBytes,
  validateAuxiliaryTailObject } = require('../tools/lib/phase8_matching_c');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');

function fixtureContracts(active, rom) {
  // Contract from accepted structural commit 850aa8f, reviewed at 4096dc7.
  // Resolve the unchanged ASM owner without requiring provisional C activation.
  const bOwners = resolveAcceptedRows(active.model, 'func_0022B06C');
  const bOwner = bOwners.owners[0];
  const b06 = { symbol: 'func_0022B06C', sectionName: bOwner.sectionName,
    bytes: bOwner.bytes, vramStartNumber: bOwner.vramStartNumber, chunkIndex: bOwner.chunkIndex,
    row: bOwners.rows[0], textOwners: bOwners.owners };
  const original = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'auxiliary_b06c_contract.json')));
  const row = active.model.rows.find((item) => item.index === 4179);
  const ef = { symbol: 'func_0022EF50', sectionName: '.ob64.r4179', bytes: 876,
    vramStartNumber: 0x801EBC80, row, chunkIndex: b06.chunkIndex,
    textOwners: resolveAcceptedRows(active.model, 'func_0022EF50').owners };
  const retained = (start, end, suffix) => ({ ...original.preservedTail,
    inputSection: `.ob64.r4248.${suffix}`, romStart: hex(start), romEndExclusive: hex(end),
    vramStart: hex(0x801F6BF0 + start - 0x239EC0), vramEndExclusive: hex(0x801F6BF0 + end - 0x239EC0),
    bytes: end - start, expectedSha256: sha256Buffer(rom.subarray(start, end)) });
  const raw = Buffer.alloc(32);
  const addends = [0x2D0, 0x2A0, 0x2A8, 0x2B0, 0x2B8, 0x2C0, 0x2C8];
  addends.forEach((value, index) => raw.writeUInt32BE(value, index * 4));
  const efRaw = { ...original, romStart: hex(0x239F28), romEndExclusive: hex(0x239F48),
    vramStart: hex(0x801F6C58), vramEndExclusive: hex(0x801F6C78), bytes: 32, entries: 7,
    trailingPaddingBytes: 4, expectedTrailingPaddingSha256: sha256Buffer(Buffer.alloc(4)),
    expectedObjectSha256: sha256Buffer(raw), expectedLinkedSha256: sha256Buffer(rom.subarray(0x239F28, 0x239F48)),
    preservedInteriorBefore: { ...retained(0x239EE8, 0x239F28, 'interior_00239EE8'), expectedRelocations: [] },
    preservedTail: retained(0x239F48, 0x23A3A0, 'tail'),
    expectedRelocations: addends.map((value, index) => ({ offset: hex(index * 4), type: 'R_MIPS_32',
      symbol: '.text', addend: hex(value), section: '.rel.rodata' })) };
  const bRaw = { ...original, preservedTail: null };
  const resolve = (target, value) => resolveAuxiliarySectionContracts(active.model, rom, target,
    normalizeAuxiliarySectionContracts([value], target.symbol, 'interior fixture'));
  b06.auxiliarySections = resolve(b06, bRaw); ef.auxiliarySections = resolve(ef, efRaw);
  validateAuxiliaryOwnerGroups([b06, ef]);
  return { b06, ef, bRaw, efRaw, original, resolve };
}

function main() {
  const active = loadActiveTargetModel();
  const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  assert.equal(sha256Buffer(rom), active.model.config.rom.sha256);
  const { b06, ef, bRaw, efRaw, original, resolve } = fixtureContracts(active, rom);
  const aux = ef.auxiliarySections[0];
  const row = active.model.rows.find((item) => item.index === 4248);
  assert(!active.targets.some((target) => ['func_0022D14C', 'func_0022EF50'].includes(target.symbol)));
  assert.equal(resolve(b06, original)[0].ownerTailBytes, 1208);
  const tc = assertToolchainAvailable(loadToolchainConfig());
  const testRoot = process.env.OB64_INTERIOR_TEST_ROOT || path.join(ROOT, 'build/tests');
  fs.mkdirSync(testRoot, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(testRoot, 'interior-asm-'));
  const write = (name, bytes) => { const file = path.join(scratch, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); return file; };
  const mutations = [];
  const reject = (name, callback) => { assert.throws(callback, undefined, name); mutations.push(name); };
  const editContract = (name, edit) => { const raw = structuredClone(efRaw); edit(raw);
    reject(name, () => validateAuxiliaryOwnerGroups([{ ...b06, auxiliarySections: resolve(b06, bRaw) }, { ...ef, auxiliarySections: resolve(ef, raw) }])); };
  for (const [name, edit] of [
    ['missing interior', (c) => { delete c.preservedInteriorBefore; }],
    ['null interior', (c) => { c.preservedInteriorBefore = null; }],
    ['wrong original hash', (c) => { c.preservedInteriorBefore.ownerOriginalAssemblySha256 = '0'.repeat(64); }],
    ['wrong original source', (c) => { c.preservedInteriorBefore.ownerOriginalAssembly = 'asm/original/rev0/lib/func_0022EF50.s'; }],
    ['wrong interval hash', (c) => { c.preservedInteriorBefore.expectedSha256 = '0'.repeat(64); }],
    ['uncovered gap', (c) => { c.preservedInteriorBefore.romStart = hex(0x239EEC); }],
    ['wrong RAM placement', (c) => { c.preservedInteriorBefore.vramStart = hex(0x801F6C1C); }],
    ['wrong size', (c) => { c.preservedInteriorBefore.bytes = 60; }],
    ['wrong section', (c) => { c.preservedInteriorBefore.inputSection = '.data'; }],
    ['writable interval', (c) => { c.preservedInteriorBefore.sectionFlags.push('SHF_WRITE'); }],
    ['executable interval', (c) => { c.preservedInteriorBefore.sectionFlags.push('SHF_EXECINSTR'); }],
    ['unsupported alignment', (c) => { c.preservedInteriorBefore.alignment = 8; }],
    ['missing actual census', (c) => { delete c.preservedInteriorBefore.expectedRelocations; }],
    ['fabricated relocation', (c) => { c.preservedInteriorBefore.expectedRelocations.push({ offset: hex(0), type: 'R_MIPS_32' }); }],
    ['invented padding entry', (c) => { c.preservedInteriorBefore.entries = 16; }],
    ['contradictory prefix', (c) => { c.preservedPrefix = { ...original.preservedTail, inputSection: '.ob64.r4248.prefix' }; }],
  ]) editContract(name, edit);
  reject('duplicate interval owner', () => validateAuxiliaryOwnerGroups([b06, ef, ef]));
  reject('reordered C owners', () => validateAuxiliaryOwnerGroups([ef, b06]));
  reject('interior on first owner', () => validateAuxiliaryOwnerGroups([ef]));
  reject('old tail overlaps new interior', () => validateAuxiliaryOwnerGroups([
    { ...b06, auxiliarySections: resolve(b06, original) }, ef]));
  const accounting = summarizeAcceptedOwnership(active.model, [b06, ef]);
  assert.equal(accounting.retainedAuxiliary.bytes, 1176);
  assert.equal(accounting.retainedAuxiliary.fragments, 2);
  assert.equal(accounting.replacements.bytes, 392 + 876 + 40 + 32);
  // A separate placement-only probe covers D14C's two compiler occurrences.
  // This neither compiles D14C nor establishes its source or ownership acceptance.
  const dOwners = resolveAcceptedRows(active.model, 'func_0022D14C');
  const dOwner = dOwners.owners[0];
  const d14 = { symbol: 'func_0022D14C', sectionName: dOwner.sectionName,
    bytes: dOwner.bytes, vramStartNumber: dOwner.vramStartNumber, chunkIndex: dOwner.chunkIndex,
    row: dOwners.rows[0], textOwners: dOwners.owners };
  const dBytes = Buffer.alloc(64);
  const dOffsets = [0, 4, 8, 12, 16, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];
  const dRelocations = dOffsets.map((offset) => {
    const addend = rom.readUInt32BE(0x239EE8 + offset) - dOwner.vramStartNumber;
    assert(addend >= 0 && addend < dOwner.bytes && addend % 4 === 0);
    dBytes.writeUInt32BE(addend, offset);
    return { offset: hex(offset), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  assert(rom.subarray(0x239EFC, 0x239F00).equals(Buffer.alloc(4)));
  const dRaw = { ...bRaw, romStart: hex(0x239EE8), romEndExclusive: hex(0x239F28),
    vramStart: hex(0x801F6C18), vramEndExclusive: hex(0x801F6C58), bytes: 64, entries: 15,
    expectedObjectSha256: sha256Buffer(dBytes), expectedLinkedSha256: sha256Buffer(rom.subarray(0x239EE8, 0x239F28)),
    expectedRelocations: dRelocations,
    compilerOccurrences: [[0, 20, '.L10'], [24, 40, '.L113']].map(([offset, bytes, label]) => ({
      label, offset: hex(offset), bytes, entries: bytes / 4, alignment: 8, alignmentDirectives: [3, 2],
      expectedObjectSha256: sha256Buffer(dBytes.subarray(offset, offset + bytes)),
      expectedLinkedSha256: sha256Buffer(rom.subarray(0x239EE8 + offset, 0x239EE8 + offset + bytes)),
      ...(offset ? { paddingBefore: { offset: hex(20), bytes: 4, expectedSha256: sha256Buffer(Buffer.alloc(4)) } } : {}),
    })) };
  d14.auxiliarySections = resolve(d14, dRaw);
  const contiguousEfRaw = structuredClone(efRaw); delete contiguousEfRaw.preservedInteriorBefore;
  const contiguous = [b06, d14, { ...ef, auxiliarySections: resolve(ef, contiguousEfRaw) }];
  validateAuxiliaryOwnerGroups(contiguous);
  const contiguousAccounting = summarizeAcceptedOwnership(active.model, contiguous);
  assert.equal(contiguousAccounting.retainedAuxiliary.bytes, 1112);
  reject('D14C C claim overlaps retained interior', () => validateAuxiliaryOwnerGroups([b06, d14, ef]));
  for (const [name, edit] of [
    ['status missing interior', (a) => { delete a.preservedInteriorBefore; }],
    ['status wrong interior owner', (a) => { a.preservedInteriorBefore.ownerOriginalAssemblySha256 = '0'.repeat(64); }],
    ['status interior gap', (a) => { a.preservedInteriorBefore.romStartNumber += 4; }],
    ['status interior relocation', (a) => { a.preservedInteriorBefore.expectedRelocations = [{}]; }],
  ]) {
    const changed = structuredClone(aux); edit(changed);
    reject(name, () => summarizeAcceptedOwnership(active.model, [b06, { ...ef, auxiliarySections: [changed] }]));
  }

  const source = fs.readFileSync(path.join(ROOT, row.part.file), 'utf8');
  assert.equal(sha256File(path.join(ROOT, row.part.file)), row.part.sha256);
  const assembly = source.replace(/^\.text\s*$/m, '.section .ob64.r4248,"a"');
  write('original.s', assembly);
  const fallback = write('comparison/original/chunk_035.o', Buffer.alloc(0));
  runTool(tc.assemblerAbs, [...tc.assemblerFlags, '-o', fallback, path.join(scratch, 'original.s')]);
  const originalElf = parseElfFile(fallback);
  const bytes = originalInteriorBytes(originalElf, aux, rom);
  assert.equal(bytes.length, 64);
  assert.equal(sha256Buffer(bytes), 'C06E0C3DE2F47A65DDC68064F08498FC85592F18F24859DB20259D14681F8411');
  const record = buildInteriorObject(ef, aux, scratch, fallback, tc.objcopyAbs, rom);
  const retainedElf = parseElfFile(path.join(scratch, record.objectRelative));
  validateInteriorObject(retainedElf, aux, bytes);
  const badOriginal = structuredClone(originalElf);
  badOriginal.sections.push({ type: 9, info: originalElf.sections.find((section) => section.name === aux.outputSection).index, size: 8 });
  reject('actual original relocation cannot be stripped', () => originalInteriorBytes(badOriginal, aux, rom));
  for (const [name, edit] of [
    ['retained relocation', (elf) => { elf.sections.push({ name: '.rel.interior', type: 9, size: 8 }); }],
    ['duplicate section', (elf) => { elf.sections.push({ ...elf.sections.find((s) => s.name === record.inputSection) }); }],
    ['wrong retained alignment', (elf) => { elf.sections.find((s) => s.name === record.inputSection).alignment = 8; }],
    ['wrong retained flags', (elf) => { elf.sections.find((s) => s.name === record.inputSection).flags = 3; }],
    ['extra allocated owner', (elf) => { elf.sections.push({ name: '.other', flags: 2, size: 4 }); }],
  ]) { const copy = structuredClone(retainedElf); edit(copy); reject(name, () => validateInteriorObject(copy, aux, bytes)); }

  // Symbolic table proxies exercise real relocation and linker ordering, not C classification.
  for (const [target, base] of [[b06, 'fixture_b06_text'], [ef, 'fixture_ef_text']]) {
    const contract = target.auxiliarySections[0];
    write(`${target.symbol}.s`, `.section ${contract.outputSection},"a"\n.align 3\n`
      + contract.expectedRelocations.map((rel) => `.word ${base}+${rel.addend}`).join('\n')
      + (contract.trailingPaddingBytes ? '\n.align 3' : '') + '\n');
    const file = write(`objects/c/${target.symbol}.o`, Buffer.alloc(0));
    runTool(tc.assemblerAbs, [...tc.compilerAssemblerFlags, '-o', file, path.join(scratch, `${target.symbol}.s`)]);
  }
  const tailRelative = 'objects/assembly/auxiliary/chunk_035_r4248_tail.o';
  write('tail.bin', rom.subarray(0x239F48, 0x23A3A0));
  fs.copyFileSync(path.join(scratch, record.objectRelative), write(tailRelative, Buffer.alloc(0)));
  runTool(tc.objcopyAbs, [`--remove-section=${record.inputSection}`, `--add-section=.ob64.r4248.tail=tail.bin`,
    '--set-section-flags=.ob64.r4248.tail=alloc,load,readonly,data,contents', tailRelative], { cwd: scratch });
  validateAuxiliaryTailObject(parseElfFile(path.join(scratch, tailRelative)), aux, rom.subarray(0x239F48, 0x23A3A0));
  const phase8 = { ...active, targets: [b06, ef], model: { ...active.model, overlays: [], slices: row.slices },
    linkSymbols: { fixture_b06_text: hex(b06.vramStartNumber), fixture_ef_text: hex(ef.vramStartNumber), boot_entry_clear_bss_and_jump: hex(row.slices[0].vramStart) } };
  const manifest = { linkedObjects: [
    ...[b06, ef].map((target) => ({ path: `objects/c/${target.symbol}.o`, ownerKind: 'matching-c-target' })),
    { path: record.objectRelative, ownerKind: 'accepted-assembly-auxiliary-interior', targetSymbol: ef.symbol, retainedInterior: record },
    { path: tailRelative, ownerKind: 'accepted-assembly-auxiliary-tail', targetSymbol: ef.symbol, outputSection: aux.outputSection,
      inputSection: aux.ownerTailSection, sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'] },
  ] };
  write('fixture.ld', renderPhase8LinkerScript(phase8, manifest));
  runTool(tc.toolsAbs.linker, [...active.model.config.binutils.linkerFlags, '-Map=fixture.map', '-T', 'fixture.ld', '-o', 'fixture.elf',
    ...manifest.linkedObjects.map((item) => item.path)], { cwd: scratch });
  const linked = parseElfFile(path.join(scratch, 'fixture.elf'));
  const map = fs.readFileSync(path.join(scratch, 'fixture.map'), 'utf8');
  verifyInteriorGroupMapOwners(phase8, map);
  assert(compareLinkedAuxiliaryBytes(b06, b06.auxiliarySections[0], linked, rom).rawBytesExact);
  assert(compareLinkedAuxiliaryBytes(ef, aux, linked, rom).rawBytesExact);
  const proof = verifyInteriorArtifacts(ef, aux, scratch, rom, linked);
  assert.deepEqual(proof.actualOriginalRelocations, []); assert.deepEqual(proof.actualRetainedRelocations, []);
  const linkedBytes = Buffer.from(elfSectionBytes(linked, linked.sections.find((section) => section.name === aux.outputSection)));
  assert(linkedBytes.equals(rom.subarray(0x239EC0, 0x23A3A0)));
  const interiorLine = map.split(/\r?\n/).find((line) => line.trim().startsWith(record.inputSection) && line.includes(record.objectRelative));
  assert(interiorLine);
  reject('map missing owner', () => verifyInteriorGroupMapOwners(phase8, map.replace(interiorLine, '')));
  reject('map duplicate owner', () => verifyInteriorGroupMapOwners(phase8, map.replace(interiorLine, `${interiorLine}\n${interiorLine}`)));
  reject('map wrong sole owner', () => verifyInteriorGroupMapOwners(phase8, map.replace(interiorLine, interiorLine.replace(record.objectRelative, 'objects/wrong.o'))));
  reject('map foreign extra owner', () => verifyInteriorGroupMapOwners(phase8, map.replace(interiorLine,
    `${interiorLine}\n${interiorLine.replace(record.objectRelative, 'foreign.o')}`)));
  const wrongLinked = { ...linked, buffer: Buffer.from(linked.buffer) };
  wrongLinked.buffer[linked.sections.find((section) => section.name === aux.outputSection).offset + 40] ^= 1;
  reject('changed linked retained byte', () => verifyInteriorArtifacts(ef, aux, scratch, rom, wrongLinked));
  const binaryFile = path.join(scratch, record.binaryRelative);
  const saved = fs.readFileSync(binaryFile); const altered = Buffer.from(saved); altered[0] ^= 1; fs.writeFileSync(binaryFile, altered);
  reject('stale retained binary', () => verifyInteriorArtifacts(ef, aux, scratch, rom, linked)); fs.writeFileSync(binaryFile, saved);
  const result = { scope: 'isolated original-row tooling fixture, not production activation', status: 'pass',
    output: scratch, originalAssemblySha256: row.part.sha256, rowSha256: sha256Buffer(linkedBytes),
    retainedInterior: projectInterior(aux), proof, accounting, contiguousAccounting, mutations };
  fs.writeFileSync(path.join(scratch, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(`PASS: retained interior assembly; ${mutations.length} negative controls; ${scratch}`);
  return result;
}

if (require.main === module) main();
module.exports = { fixtureContracts, main };
