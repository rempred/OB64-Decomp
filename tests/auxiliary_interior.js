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
  validateAuxiliaryTailObject, verifySharedAuxiliaryScript, verifyRecordedSharedAuxiliaryScript } = require('../tools/lib/phase8_matching_c');
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
  validateAuxiliaryOwnerGroups([b06, ef], active.model);
  return { b06, ef, bRaw, efRaw, original, resolve };
}

function main() {
  const active = loadActiveTargetModel();
  const canonicalModelBefore = structuredClone({ targets: active.targets, model: active.model });
  const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  assert.equal(sha256Buffer(rom), active.model.config.rom.sha256);
  const { b06, ef, bRaw, efRaw, original, resolve } = fixtureContracts(active, rom);
  const aux = ef.auxiliarySections[0];
  const row = active.model.rows.find((item) => item.index === 4248);
  // Fixture targets are independent of current D14C production activation.
  // Verify below that canonical targets and their accepted model remain unchanged.
  assert(active.targets.some((target) => target.symbol === 'func_0022EF50'));
  assert.equal(resolve(b06, original)[0].ownerTailBytes, 1208);
  const tc = assertToolchainAvailable(loadToolchainConfig());
  const testRoot = process.env.OB64_INTERIOR_TEST_ROOT || path.join(ROOT, 'build/tests');
  fs.mkdirSync(testRoot, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(testRoot, 'interior-asm-'));
  const write = (name, bytes) => { const file = path.join(scratch, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); return file; };
  const mutations = [];
  const reject = (name, callback) => { assert.throws(callback, undefined, name); mutations.push(name); };
  const editContract = (name, edit) => { const raw = structuredClone(efRaw); edit(raw);
    reject(name, () => validateAuxiliaryOwnerGroups([{ ...b06, auxiliarySections: resolve(b06, bRaw) }, { ...ef, auxiliarySections: resolve(ef, raw) }], active.model)); };
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
  reject('duplicate interval owner', () => validateAuxiliaryOwnerGroups([b06, ef, ef], active.model));
  reject('reordered C owners', () => validateAuxiliaryOwnerGroups([ef, b06], active.model));
  reject('interior on first owner', () => validateAuxiliaryOwnerGroups([ef], active.model));
  reject('old tail overlaps new interior', () => validateAuxiliaryOwnerGroups([
    { ...b06, auxiliarySections: resolve(b06, original) }, ef], active.model));
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
  validateAuxiliaryOwnerGroups(contiguous, active.model);
  const contiguousAccounting = summarizeAcceptedOwnership(active.model, contiguous);
  assert.equal(contiguousAccounting.retainedAuxiliary.bytes, 1112);
  reject('D14C C claim overlaps retained interior', () => validateAuxiliaryOwnerGroups([b06, d14, ef], active.model));
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
    ...[b06, ef].map((target) => ({ path: `objects/c/${target.symbol}.o`, ownerKind: 'matching-c-target', targetSymbol: target.symbol })),
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

  // A genuine second archive chunk, retaining all intervening retail data as ASM.
  // These symbolic assembly proxies establish tooling only, never C acceptance.
  const laterOwners = resolveAcceptedRows(active.model, 'func_00232458');
  const laterOwner = laterOwners.owners[0];
  const later = { symbol: 'func_00232458', sectionName: laterOwner.sectionName, bytes: laterOwner.bytes,
    vramStartNumber: laterOwner.vramStartNumber, chunkIndex: laterOwner.chunkIndex,
    row: laterOwners.rows[0], textOwners: laterOwners.owners };
  assert.notEqual(later.chunkIndex, b06.chunkIndex);
  const laterObject = Buffer.alloc(40);
  const laterRelocations = Array.from({ length: 10 }, (_, index) => {
    const addend = rom.readUInt32BE(0x239F78 + index * 4) - later.vramStartNumber;
    assert(addend >= 0 && addend < later.bytes && addend % 4 === 0);
    laterObject.writeUInt32BE(addend, index * 4);
    return { offset: hex(index * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
  });
  const interval = (start, end, kind) => ({ ...original.preservedTail,
    inputSection: `.ob64.r4248.${kind}`, romStart: hex(start), romEndExclusive: hex(end),
    vramStart: hex(row.slices[0].vramStart + start - row.romStart),
    vramEndExclusive: hex(row.slices[0].vramStart + end - row.romStart),
    bytes: end - start, expectedSha256: sha256Buffer(rom.subarray(start, end)) });
  const laterRaw = { ...bRaw, romStart: hex(0x239F78), romEndExclusive: hex(0x239FA0),
    vramStart: hex(0x801F6CA8), vramEndExclusive: hex(0x801F6CD0), bytes: 40, entries: 10,
    expectedObjectSha256: sha256Buffer(laterObject), expectedLinkedSha256: sha256Buffer(rom.subarray(0x239F78, 0x239FA0)),
    expectedRelocations: laterRelocations,
    preservedInteriorBefore: { ...interval(0x239EE8, 0x239F78, 'interior_00239EE8'), expectedRelocations: [] },
    preservedTail: interval(0x239FA0, 0x23A3A0, 'tail') };
  later.auxiliarySections = resolve(later, laterRaw);
  const crossChunkTargets = [b06, later];
  validateAuxiliaryOwnerGroups(crossChunkTargets, active.model);

  function reversedLinkProbe(name, targets) {
    validateAuxiliaryOwnerGroups(targets, active.model);
    const probe = path.join(scratch, name);
    fs.mkdirSync(path.join(probe, 'comparison/original'), { recursive: true });
    fs.mkdirSync(path.join(probe, 'objects/c'), { recursive: true });
    fs.mkdirSync(path.join(probe, 'objects/assembly/auxiliary'), { recursive: true });
    const probeFallback = path.join(probe, 'comparison/original/chunk_035.o');
    fs.copyFileSync(fallback, probeFallback);
    const objects = [], aliases = { boot_entry_clear_bss_and_jump: hex(row.slices[0].vramStart) };
    for (const target of targets) {
      const a = target.auxiliarySections[0];
      if (a.ownerPrefixBytes > 0) {
        const prefixPath = tailRelative.replace('_tail.o', '_prefix.o');
        fs.writeFileSync(path.join(probe, 'prefix.bin'), rom.subarray(a.ownerPrefixRomStartNumber, a.ownerPrefixRomEndNumber));
        fs.copyFileSync(path.join(scratch, record.objectRelative), path.join(probe, prefixPath));
        runTool(tc.objcopyAbs, [`--remove-section=${record.inputSection}`, `--add-section=${a.ownerPrefixSection}=prefix.bin`,
          `--set-section-flags=${a.ownerPrefixSection}=alloc,load,readonly,data,contents`, prefixPath], { cwd: probe });
        objects.push({ path: prefixPath, ownerKind: 'accepted-assembly-auxiliary-prefix', targetSymbol: target.symbol,
          outputSection: a.outputSection, inputSection: a.ownerPrefixSection, sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'] });
      }
      const alias = `fixture_${target.symbol}_text`; aliases[alias] = hex(target.vramStartNumber);
      const relocations = new Map(a.expectedRelocations.map(r => [parseInt(r.offset, 16), r.addend]));
      const source = `.section ${a.outputSection},"a"\n.align 3\n` + Array.from({ length: a.bytes / 4 }, (_, i) =>
        relocations.has(i * 4) ? `.word ${alias}+${relocations.get(i * 4)}` : '.word 0').join('\n') + '\n';
      fs.writeFileSync(path.join(probe, target.symbol + '.s'), source);
      const objectPath = `objects/c/${target.symbol}.o`;
      runTool(tc.assemblerAbs, [...tc.compilerAssemblerFlags, '-o', path.join(probe, objectPath), path.join(probe, target.symbol + '.s')]);
      objects.push({ path: objectPath, ownerKind: 'matching-c-target', targetSymbol: target.symbol });
      if (a.preservedInteriorBefore) {
        const r = buildInteriorObject(target, a, probe, probeFallback, tc.objcopyAbs, rom);
        objects.push({ path: r.objectRelative, ownerKind: 'accepted-assembly-auxiliary-interior', targetSymbol: target.symbol, retainedInterior: r });
      }
    }
    const last = targets.at(-1), lastAux = last.auxiliarySections[0];
    fs.writeFileSync(path.join(probe, 'tail.bin'), rom.subarray(lastAux.ownerTailRomStartNumber, lastAux.ownerTailRomEndNumber));
    fs.copyFileSync(path.join(scratch, record.objectRelative), path.join(probe, tailRelative));
    runTool(tc.objcopyAbs, [`--remove-section=${record.inputSection}`, `--add-section=${lastAux.ownerTailSection}=tail.bin`,
      `--set-section-flags=${lastAux.ownerTailSection}=alloc,load,readonly,data,contents`, tailRelative], { cwd: probe });
    objects.push({ path: tailRelative, ownerKind: 'accepted-assembly-auxiliary-tail', targetSymbol: last.symbol,
      outputSection: lastAux.outputSection, inputSection: lastAux.ownerTailSection, sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'] });
    const context = { ...active, targets, model: { ...active.model, overlays: [], slices: row.slices }, linkSymbols: aliases };
    const forward = { linkedObjects: objects }, reverse = { linkedObjects: [...objects].reverse() };
    const script = renderPhase8LinkerScript(context, reverse);
    assert.equal(script, renderPhase8LinkerScript(context, forward), 'object manifest order cannot choose row order');
    verifySharedAuxiliaryScript(context, script);
    assert(!script.includes(`*(${lastAux.outputSection})`));
    fs.writeFileSync(path.join(probe, 'fixture.ld'), script);
    runTool(tc.toolsAbs.linker, [...active.model.config.binutils.linkerFlags, '-Map=fixture.map', '-T', 'fixture.ld', '-o', 'fixture.elf',
      ...reverse.linkedObjects.map(item => item.path)], { cwd: probe });
    const actualMap = fs.readFileSync(path.join(probe, 'fixture.map'), 'utf8');
    verifyInteriorGroupMapOwners(context, actualMap);
    const actualElf = parseElfFile(path.join(probe, 'fixture.elf'));
    assert(Buffer.from(elfSectionBytes(actualElf, actualElf.sections.find(s => s.name === lastAux.outputSection)))
      .equals(rom.subarray(row.romStart, row.romEndExclusive)));
    const cLines = actualMap.split(/\r?\n/).filter(line => line.trim().startsWith(lastAux.outputSection + ' ')
      && line.includes('objects/c/'));
    assert.equal(cLines.length, targets.length);
    for (const [label, changed] of [
      ['missing', actualMap.replace(cLines[0], '')], ['duplicate', actualMap.replace(cLines[0], cLines[0] + '\n' + cLines[0])],
      ['swapped', actualMap.replace(cLines[0], 'SWAP').replace(cLines[1], cLines[0]).replace('SWAP', cLines[1])],
      ['foreign', actualMap.replace(cLines[0], cLines[0].replace(`objects/c/${targets[0].symbol}.o`, 'objects/c/foreign.o'))],
      ['address', actualMap.replace(cLines[0], cLines[0].replace(/^(\s+\S+\s+)([0-9a-f]+)/i,
        (_all, prefix, value) => prefix + (parseInt(value, 16) + 4).toString(16)))],
      ['size', actualMap.replace(cLines[0], cLines[0].replace(/^(\s+\S+\s+[0-9a-f]+\s+)([0-9a-f]+)/i,
        (_all, prefix, value) => prefix + (parseInt(value, 16) + 4).toString(16)))],
    ]) reject(`${name} map ${label}`, () => verifyInteriorGroupMapOwners(context, changed));
    const firstSelector = `objects/c/${targets[0].symbol}.o(${lastAux.outputSection})`;
    reject(`${name} wildcard despite correct map`, () => verifySharedAuxiliaryScript(context, script.replace(firstSelector, `*(${lastAux.outputSection})`)));
    reject(`${name} extra wildcard outside row`, () => verifySharedAuxiliaryScript(context, script + `\n*(${lastAux.outputSection})\n`));
    const residualSelectors = [
      `*( ${lastAux.outputSection} )`, `* \n (\t${lastAux.outputSection}\n)`,
      '*(.ob64.r*)', '*(.ob64.r????)', '*(.ob64.r[0-9][0-9][0-9][0-9])',
      `*( .text ${lastAux.outputSection} )`, `*( .text, ${lastAux.outputSection} )`,
      `* /* separator */ ( /* list */ ${lastAux.outputSection} )`,
      `*("${lastAux.outputSection}")`, '*(SORT(.ob64.r*))',
      `*(EXCLUDE_FILE(absent.o) ${lastAux.outputSection})`,
      '*(.ob64.r[!a-z]*)',
      '*(.ob64.r424[]8])', `*('${lastAux.outputSection}')`,
    ];
    verifySharedAuxiliaryScript(context, script + `\n/* *( ${lastAux.outputSection} ) */\n`);
    reject(`${name} unsupported unrelated wildcard body`, () => verifySharedAuxiliaryScript(context, script.replace('  /DISCARD/ :', '  .unused 0 : { *(.unrelated*) }\n  /DISCARD/ :')));
    for (const body of [`objects/c/${targets[0].symbol}.o`, `"objects/c/${targets[0].symbol}.o"`, '*', 'INPUT(absent.o)', 'GROUP(absent.o)', 'INCLUDE absent.ld']) {
      verifySharedAuxiliaryScript(context, script);
      reject(`${name} implicit input ${body}`, () => verifySharedAuxiliaryScript(context, script.replace('  /DISCARD/ :', `  .unused 0x00000000 : AT(0x00000000)\n  {\n    ${body}\n  }\n  /DISCARD/ :`)));
    }
    for (const selector of residualSelectors) {
      verifySharedAuxiliaryScript(context, script);
      reject(`${name} residual selector ${selector}`, () => verifySharedAuxiliaryScript(context,
        script.replace('  /DISCARD/ :', `  .unused 0 : { ${selector} }\n  /DISCARD/ :`)));
    }
    for (const [index, selector] of [`*( ${lastAux.outputSection} )`, `*( "${lastAux.outputSection}" )`, `objects/c/${targets[0].symbol}.o`].entries()) {
      verifySharedAuxiliaryScript(context, script);
      const changedScript = script.replace('  /DISCARD/ :', `  .unused 0 : { ${selector} }\n  /DISCARD/ :`);
      fs.writeFileSync(path.join(probe, `residual-${index}.ld`), changedScript);
      runTool(tc.toolsAbs.linker, [...active.model.config.binutils.linkerFlags, `-Map=residual-${index}.map`,
        '-T', `residual-${index}.ld`, '-o', `residual-${index}.elf`, ...reverse.linkedObjects.map(item => item.path)], { cwd: probe });
      verifyInteriorGroupMapOwners(context, fs.readFileSync(path.join(probe, `residual-${index}.map`), 'utf8'));
      const residualElf = parseElfFile(path.join(probe, `residual-${index}.elf`));
      assert(Buffer.from(elfSectionBytes(residualElf, residualElf.sections.find(s => s.name === lastAux.outputSection)))
        .equals(rom.subarray(row.romStart, row.romEndExclusive)));
      reject(`${name} linker-accepted residual ${selector}`, () => verifySharedAuxiliaryScript(context, changedScript));
    }
    reject(`${name} duplicate selector`, () => verifySharedAuxiliaryScript(context, script.replace(firstSelector, firstSelector + '\n    ' + firstSelector)));
    reject(`${name} selector placement`, () => verifySharedAuxiliaryScript(context, script.replace(hex(row.slices[0].vramStart) + ' : AT', hex(row.slices[0].vramStart + 4) + ' : AT')));
    fs.mkdirSync(path.join(probe, 'linker'), { recursive: true });
    reject(`${name} missing recorded script`, () => verifyRecordedSharedAuxiliaryScript(context, probe));
    fs.writeFileSync(path.join(probe, 'linker/phase8.ld'), script.replace(firstSelector, `*(${lastAux.outputSection})`));
    reject(`${name} stale recorded wildcard`, () => verifyRecordedSharedAuxiliaryScript(context, probe));
    fs.writeFileSync(path.join(probe, 'linker/phase8.ld'), script);
    verifyRecordedSharedAuxiliaryScript(context, probe);
    fs.writeFileSync(path.join(probe, 'linker/phase8.ld'), script.replace('  /DISCARD/ :', `  .unused 0 : { objects/c/${targets[0].symbol}.o }\n  /DISCARD/ :`));
    reject(`${name} recorded bare-file input`, () => verifyRecordedSharedAuxiliaryScript(context, probe));
    fs.writeFileSync(path.join(probe, 'linker/phase8.ld'), script);
    for (const [label, linkedObjects] of [
      ['missing', objects.filter(o => o.path !== `objects/c/${targets[0].symbol}.o`)],
      ['duplicate', [...objects, objects.find(o => o.ownerKind === 'matching-c-target')]],
      ['wrong path', objects.map(o => o.path === `objects/c/${targets[0].symbol}.o` ? { ...o, path: 'objects/c/foreign.o' } : o)],
      ['missing tail', objects.filter(o => o.ownerKind !== 'accepted-assembly-auxiliary-tail')],
    ]) reject(`${name} manifest ${label}`, () => renderPhase8LinkerScript(context, { linkedObjects }));
    return { name, objectOrder: reverse.linkedObjects.map(o => o.path), scriptSha256: sha256Buffer(Buffer.from(script)),
      mapSha256: sha256Buffer(Buffer.from(actualMap)), rowExact: true };
  }
  const prefixD14 = { ...d14, auxiliarySections: resolve(d14, { ...dRaw,
    preservedPrefix: interval(row.romStart, 0x239EE8, 'prefix') }) };
  const noInterior = [prefixD14, contiguous[2]];
  const orderingProbes = [reversedLinkProbe('cross-chunk-interior', crossChunkTargets),
    reversedLinkProbe('same-chunk-no-interior', noInterior)];
  assert.deepStrictEqual({ targets: active.targets, model: active.model }, canonicalModelBefore);
  const result = { scope: 'isolated original-row tooling fixture, not production activation', status: 'pass',
    output: scratch, originalAssemblySha256: row.part.sha256, rowSha256: sha256Buffer(linkedBytes),
    retainedInterior: projectInterior(aux), proof, accounting, contiguousAccounting, orderingProbes, mutations };
  fs.writeFileSync(path.join(scratch, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(`PASS: retained interior assembly; ${mutations.length} negative controls; ${scratch}`);
  return result;
}

if (require.main === module) main();
module.exports = { fixtureContracts, main };
