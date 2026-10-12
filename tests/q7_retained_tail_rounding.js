#!/usr/bin/env node
'use strict';
// Structural assembler fixture only. No C source, matching claim or activation.
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const { adjustSectionAssembly } = require('../tools/lib/phase8_matching_c');
const { assemblerInput } = require('../tools/lib/text_contract');
const { transformTrackedPart } = require('../tools/build_phase7_conventional');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { CASES } = require('./q7_retained_tails');

function main() {
  const model = p7.loadAcceptedModel(), tc = assertToolchainAvailable(loadToolchainConfig());
  const rom = fs.readFileSync(path.join(p7.ROOT, 'build/baserom.us_rev0.z64'));
  p7.verifyRom(model, rom);
  const parent = path.join(p7.ROOT, 'build/tests'); fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'q7-tail-rounding-'));
  const reports = [];
  for (const c of CASES) {
    const dir = path.join(root, String(c.row)); fs.mkdirSync(dir);
    const row = model.rows[c.row], next = model.rows[c.row + 1], bytes = c.tail - c.start;
    const section = `.ob64.r${c.row}.s0`, tailSection = `.ob64.r${c.row}.s1`;
    assert.equal(row.slices.length, 2); assert.equal(row.slices[0].bytes, bytes);
    assert.equal(row.slices[1].bytes, 8); assert.equal(row.slices[1].executable, false);
    // Deliberately artificial body: use identical complete input except .text assignment.
    // Its explicit size and nonzero words make accidental fill/truncation observable.
    const raw = Buffer.from('.set noreorder\n.text\n.align 2\n.globl q7_rounding_probe\n.ent q7_rounding_probe\nq7_rounding_probe:\n'
      + Array(bytes / 4).fill('.word 0x24020001').join('\n')
      + '\n.end q7_rounding_probe\n.size q7_rounding_probe,.-q7_rounding_probe\n');
    const assigned = assemblerInput(raw, { sectionName: section }, adjustSectionAssembly);
    assert.equal(assigned.toString(), raw.toString().replace('.text\n', `.section ${section},"ax",@progbits\n`));
    for (const [name, input] of [['raw', raw], ['assigned', assigned]]) {
      fs.writeFileSync(path.join(dir, name + '.s'), input);
      runTool(tc.assemblerAbs, [...tc.compilerAssemblerFlags, '-o', name === 'assigned' ? 'assigned.raw.o' : name + '.o', name + '.s'], { cwd: dir });
    }
    // Keep the assigned text untouched; remove only ordinary ancillary metadata before linking.
    runTool(tc.toolsAbs.objcopy, ['--remove-section=.reginfo', '--remove-section=.pdr',
      '--remove-section=.comment', '--remove-section=.note', 'assigned.raw.o', 'assigned.o'], { cwd: dir });
    const assignedRaw = p7.parseElfFile(path.join(dir, 'assigned.raw.o'));
    const native = p7.parseElfFile(path.join(dir, 'raw.o')), exact = p7.parseElfFile(path.join(dir, 'assigned.o'));
    const ns = native.sections.find(s => s.name === '.text'), es = exact.sections.find(s => s.name === section);
    assert.equal(ns.size, bytes + 12); assert.equal(ns.alignment, 16);
    assert.equal(es.size, bytes); assert.equal(es.alignment, 4); assert.equal(es.flags, 6);
    assert.ok(p7.elfSectionBytes(assignedRaw, assignedRaw.sections.find(s => s.name === section))
      .equals(p7.elfSectionBytes(exact, es)), 'ancillary removal changed assigned text');
    assert.ok(p7.elfSectionBytes(native, ns).subarray(0, bytes).equals(p7.elfSectionBytes(exact, es)));
    assert.ok(p7.elfSectionBytes(native, ns).subarray(bytes).equals(Buffer.alloc(12)));
    assert.equal(exact.sections.filter(s => s.name === tailSection).length, 0);
    assert.equal(exact.symbols.find(s => s.name === 'q7_rounding_probe').size, bytes);
    // Production transformation authenticates each complete original source part.
    // Only the named tail and complete successor are selected at link time.
    fs.writeFileSync(path.join(dir, 'original.s'), transformTrackedPart(row) + '\n' + transformTrackedPart(next));
    runTool(tc.assemblerAbs, [...tc.assemblerFlags, '-o', 'original.raw.o', 'original.s'], { cwd: dir });
    // The production tracked-ASM path assigns execution flags with pinned objcopy.
    const executableFlags = [row, next].flatMap(r => r.slices.filter(s => s.executable).flatMap(s => [
      '--set-section-flags', s.sectionName + '=alloc,load,code,readonly,data,contents',
    ]));
    runTool(tc.toolsAbs.objcopy, ['--remove-section=.reginfo', '--remove-section=.pdr',
      '--remove-section=.comment', '--remove-section=.note', '--remove-section=' + section, ...executableFlags,
      'original.raw.o', 'original.o'], { cwd: dir });
    const originalRaw = p7.parseElfFile(path.join(dir, 'original.raw.o'));
    const original = p7.parseElfFile(path.join(dir, 'original.o'));
    for (const s of [...row.slices, ...next.slices]) {
      const rawSection = originalRaw.sections.find(v => v.name === s.sectionName);
      const normalizedSection = original.sections.find(v => v.name === s.sectionName);
      assert.ok(p7.elfSectionBytes(originalRaw, rawSection).equals(rom.subarray(s.romStart, s.romEndExclusive)),
        'complete original ASM bytes changed');
      if (s.sectionName === section) { assert.equal(normalizedSection, undefined, 'original replaced prefix retained'); continue; }
      assert.equal(normalizedSection.flags, s.executable ? 6 : 2);
      assert.ok(p7.elfSectionBytes(originalRaw, rawSection).equals(p7.elfSectionBytes(original, normalizedSection)),
        'tracked ASM normalization changed bytes');
    }
    const os = original.sections.find(s => s.name === tailSection);
    assert.equal(os.size, 8); assert.equal(os.flags, 2);
    assert.ok(p7.elfSectionBytes(original, os).equals(rom.subarray(c.tail, c.end)));
    const slices = [...row.slices, ...next.slices];
    const script = 'OUTPUT_FORMAT("elf32-bigmips")\nOUTPUT_ARCH(mips)\nENTRY(q7_rounding_probe)\nSECTIONS {\n'
      + slices.map(s => `${s.sectionName} ${p7.hex(s.vramStart)} : AT(${p7.hex(s.romStart)}) { ${s.sectionName === section ? 'assigned.o' : 'original.o'}(${s.sectionName}) }`).join('\n')
      + '\n}\n';
    fs.writeFileSync(path.join(dir, 'fixture.ld'), script);
    runTool(tc.toolsAbs.linker, [...tc.linkerFlags, '-T', 'fixture.ld', '-Map', 'fixture.map', '-o', 'fixture.elf', 'assigned.o', 'original.o'], { cwd: dir });
    const linked = p7.parseElfFile(path.join(dir, 'fixture.elf'));
    const fixtureModel = { config: { rom: { bytes: slices.reduce((n, s) => n + s.bytes, 0) },
      representativeSymbols: [{ name: 'q7_rounding_probe', vramStart: c.vma }] }, slices, rows: [], overlays: [] };
    p7.verifyElfAgainstModel(fixtureModel, linked);
    const map = fs.readFileSync(path.join(dir, 'fixture.map'), 'utf8');
    const checkFill = text => assert.ok(!text.includes('*fill*'), 'fixture linker fill');
    checkFill(map);
    assert.throws(() => checkFill(map + '\n *fill* 0x00000008\n'), /fixture linker fill/);
    for (const s of slices) {
      const linkedSection = linked.sections.find(v => v.name === s.sectionName);
      const expected = s.sectionName === section ? p7.elfSectionBytes(exact, es) : rom.subarray(s.romStart, s.romEndExclusive);
      assert.ok(p7.elfSectionBytes(linked, linkedSection).equals(expected), 'fixture bytes/extent drift');
      const checkOwner = text => {
        const line = text.split(/\r?\n/).filter(line => line.trim().split(/\s+/)[0] === s.sectionName && /(?:assigned|original)\.o/.test(line));
        assert.equal(line.length, 1, 'sole fixture section contribution');
        assert.ok(line[0].includes(s.sectionName === section ? 'assigned.o' : 'original.o'), 'fixture provenance drift');
      };
      checkOwner(map);
      assert.throws(() => checkOwner(s.sectionName === section ? map.replaceAll('assigned.o', 'original.o') : map.replaceAll('original.o', 'assigned.o')), /fixture provenance drift/);
    }
    // A post-assembly rename would retain all twelve bytes; never admit it.
    const oversized = { ...linked, sections: linked.sections.map(s => s.name === section ? { ...s, size: bytes + 12 } : s) };
    assert.throws(() => p7.verifyElfAgainstModel(fixtureModel, oversized), /section size drift/);
    const overlapping = { ...linked, sections: linked.sections.map(s => s.name === tailSection ? { ...s, address: s.address + 4 } : s) };
    assert.throws(() => p7.verifyElfAgainstModel(fixtureModel, overlapping), /VRAM placement drift/);
    reports.push({ row: c.row, standaloneBytes: ns.size, assignedBytes: es.size, retainedOriginalAssemblyBytes: 8,
      successorBytes: next.bytes, linkedPrefixEnd: c.tail, retainedEnd: c.end, zeroNativePaddingLinked: true,
      rawInputSha256: p7.sha256Buffer(raw), assignedInputSha256: p7.sha256Buffer(assigned),
      linkedElfSha256: p7.sha256File(path.join(dir, 'fixture.elf')), matchingAcceptance: false });
  }
  fs.writeFileSync(path.join(root, 'report.json'), JSON.stringify({ status: 'pass', purpose: 'synthetic section-assignment plumbing only', reports }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'pass', root, reports }, null, 2));
}
if (require.main === module) main();
