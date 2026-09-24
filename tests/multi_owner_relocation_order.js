#!/usr/bin/env node
'use strict';
// Bounded splitter regression: preserve native relocation order, including descents.
const fs = require('fs'), path = require('path'), assert = require('assert');
const value = flag => { const i = process.argv.indexOf(flag); return i < 0 ? null : process.argv[i + 1]; };
const repo = path.resolve(value('--repo') || path.join(__dirname, '..'));
const { parseElfFile, elfSectionBytes, sha256Buffer } = require(path.join(repo, 'tools/lib/phase7_conventional'));
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require(path.join(repo, 'tools/lib/real_mips_toolchain'));
const { splitRelocatableTextSection } = require(path.resolve(value('--splitter') || path.join(repo, 'tools/lib/elf_text_split.js')));
const root = path.resolve(value('--output') || path.join(repo, 'build/multi-owner-relocation-order-test'));
fs.mkdirSync(root, { recursive: true });
const toolchain = assertToolchainAvailable(loadToolchainConfig());
const hex = n => '0x' + n.toString(16);
const report = { schemaVersion: 1, fixtures: [], rejected: [] };
function relocs(elf, section) {
  assert(section && section.type === 9 && section.entrySize === 8);
  const records = [];
  for (let i = 0; i < section.size; i += 8) records.push({ offset: elf.buffer.readUInt32BE(section.offset + i), info: elf.buffer.readUInt32BE(section.offset + i + 4) });
  return records;
}
function rejection(label, pattern, fn) {
  assert.throws(fn, pattern, label); report.rejected.push(label);
}
function exercise(name, object, sourceName, owners, functions, definitions, base, expectedFile) {
  const dir = path.join(root, name); fs.mkdirSync(dir, { recursive: true });
  const input = fs.readFileSync(object), raw = parseElfFile(object);
  const section = raw.sections.find(s => s.name === sourceName), relocation = raw.sections.find(s => s.name === '.rel' + sourceName);
  const records = relocs(raw, relocation);
  const descents = records.flatMap((r, i) => i && r.offset < records[i - 1].offset ? [[records[i - 1].offset, r.offset]] : []);
  assert(descents.length > 0, 'fixture must contain native relocation-order descent');
  const original = Buffer.from(input);
  const split = splitRelocatableTextSection(input, sourceName, owners, functions);
  assert.deepStrictEqual(input, original, 'splitter mutated input');
  const projectedFile = path.join(dir, 'projected.o'); fs.writeFileSync(projectedFile, split.buffer);
  const projected = parseElfFile(projectedFile);
  assert.deepStrictEqual(Buffer.concat(owners.map(o => elfSectionBytes(projected, projected.sections.find(s => s.name === o.sectionName)))), elfSectionBytes(raw, section));
  let cursor = 0;
  for (const owner of owners) {
    const actual = relocs(projected, projected.sections.find(s => s.name === '.rel' + owner.sectionName));
    const expected = records.filter(r => r.offset >= cursor && r.offset < cursor + owner.bytes)
      .map(r => ({ offset: r.offset - cursor, info: r.info }));
    assert.deepStrictEqual(actual, expected, 'native owner subsequence changed');
    cursor += owner.bytes;
  }
  // The original section-symbol index/value remains anchored to the first owner.
  for (const record of records) {
    const index = record.info >>> 8;
    const oldSymbol = raw.symbols.find(s => s.symbolIndex === index && s.symbolTableIndex === relocation.link);
    assert(oldSymbol, 'relocation symbol missing');
    if (oldSymbol.symbolType === 3 && oldSymbol.sectionIndex === section.index) {
      const firstRel = projected.sections.find(s => s.name === '.rel' + owners[0].sectionName);
      const newSymbol = projected.symbols.find(s => s.symbolIndex === index && s.symbolTableIndex === firstRel.link);
      assert.strictEqual(newSymbol.value, oldSymbol.value);
      assert.strictEqual(projected.sections[newSymbol.sectionIndex].name, owners[0].sectionName);
    }
  }
  const links = [];
  for (const vma of [base, base + 0x200000]) {
    const rawScript = path.join(dir, 'raw-' + hex(vma) + '.ld'), projectedScript = path.join(dir, 'projected-' + hex(vma) + '.ld');
    const rawElfFile = path.join(dir, 'raw-' + hex(vma) + '.elf'), projectedElfFile = path.join(dir, 'projected-' + hex(vma) + '.elf');
    const discard = ' /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) }\n';
    fs.writeFileSync(rawScript, definitions + '\nSECTIONS {\n ' + sourceName + ' ' + hex(vma) + ' : { *(' + sourceName + ') }\n' + discard + '}\n');
    let at = vma;
    const lines = owners.map(owner => { const line = ' ' + owner.sectionName + ' ' + hex(at) + ' : { *(' + owner.sectionName + ') }'; at += owner.bytes; return line; });
    fs.writeFileSync(projectedScript, definitions + '\nSECTIONS {\n' + lines.join('\n') + '\n' + discard + '}\n');
    runTool(toolchain.toolsAbs.linker, ['-T', rawScript, '-o', rawElfFile, object]);
    runTool(toolchain.toolsAbs.linker, ['-T', projectedScript, '-o', projectedElfFile, projectedFile]);
    const a = parseElfFile(rawElfFile), b = parseElfFile(projectedElfFile);
    const rawBytes = elfSectionBytes(a, a.sections.find(s => s.name === sourceName));
    const projectedBytes = Buffer.concat(owners.map(owner => elfSectionBytes(b, b.sections.find(s => s.name === owner.sectionName))));
    assert.deepStrictEqual(projectedBytes, rawBytes, 'native-order projection changed linked bytes');
    if (name === 'synthetic') {
      assert.strictEqual(projectedBytes.readUInt32BE(36), 0x80123456, 'absolute R_MIPS_32 value drift');
      assert.strictEqual(projectedBytes.readUInt32BE(40), vma + 16, 'section-relative R_MIPS_32 value drift');
    }
    if (expectedFile && vma === base) assert.deepStrictEqual(projectedBytes, fs.readFileSync(expectedFile));
    links.push({ vma: hex(vma), bytes: rawBytes.length, sha256: sha256Buffer(rawBytes), splitEqualsRaw: true });
  }
  report.fixtures.push({ name, inputSha256: sha256Buffer(input), sectionAlignment: section.alignment, relocations: records.length, relocationTypeCounts: records.reduce((counts, record) => { const type = record.info & 255; counts[type] = (counts[type] || 0) + 1; return counts; }, {}), descents, links });
  return { input, raw, relocation, section, records };
}
const assemblyFile = path.join(root, 'synthetic.s'), objectFile = path.join(root, 'synthetic.o');
fs.writeFileSync(assemblyFile, [
 '.set at', '.set reorder', '.section .ob64.r0001,"ax",@progbits', '.globl fixture', '.type fixture,@function', '.ent fixture', 'fixture:',
 ' sb $2,external_data', ' j .Lfixture_tail', ' nop',
 '.Lfixture_tail:', ' sb $3,other_data', ' j .Lfixture_tail', '.set noreorder', ' jr $31', ' nop',
 ' .word external_data', ' .word .Lfixture_tail',
 '.size fixture,.-fixture', '.end fixture', ''
].join('\n'));
runTool(toolchain.assemblerAbs, [...toolchain.compilerAssemblerFlags, '-o', objectFile, assemblyFile]);
const owners = [{ sectionName: '.ob64.r0001', bytes: 16, symbol: 'fixture', symbolSize: 44 },
 { sectionName: '.ob64.r0002', bytes: 28, symbol: 'physical_tail', symbolSize: 0 }];
const test = exercise('synthetic', objectFile, '.ob64.r0001', owners, null,
 'OUTPUT_ARCH(mips)\nexternal_data = 0x80123456;\nother_data = 0x8030F234;\nexternal_function = 0x80001234;', 0x80230000);
function mutate(label, pattern, change) { const bytes = Buffer.from(test.input); change(bytes); rejection(label, pattern, () => splitRelocatableTextSection(bytes, '.ob64.r0001', owners)); }
assert.strictEqual(test.records.filter(record => (record.info & 255) === 2).length, 2, 'absolute and section-relative R_MIPS_32 fixture census');
const r = test.relocation, lo = test.records.findIndex(record => (record.info & 255) === 6), hi = test.records.findIndex(record => (record.info & 255) === 5);
const type = (b, i, kind) => b.writeUInt32BE((test.records[i].info & 0xffffff00) + kind, r.offset + i * 8 + 4);
mutate('LO16 serialized before matching HI16', /pairing crosses/, b => {
 const high = Buffer.from(b.subarray(r.offset + hi * 8, r.offset + hi * 8 + 8));
 const low = Buffer.from(b.subarray(r.offset + lo * 8, r.offset + lo * 8 + 8));
 low.copy(b, r.offset + hi * 8); high.copy(b, r.offset + lo * 8);
});
mutate('unmatched HI16', /unpaired R_MIPS_HI16/, b => type(b, lo, 4));
mutate('unmatched LO16', /pairing crosses/, b => type(b, hi, 4));
mutate('cross-owner pair', /pairing crosses/, b => b.writeUInt32BE(32, r.offset + lo * 8));
mutate('unsupported relocation', /unsupported text relocation/, b => type(b, hi, 255));
mutate('unaligned place', /unaligned/, b => b.writeUInt32BE(1, r.offset));
mutate('duplicate place', /duplicated/, b => b.writeUInt32BE(test.records[hi].offset, r.offset + lo * 8));
mutate('out-of-range place', /outside the owner census/, b => b.writeUInt32BE(test.section.size, r.offset));
mutate('truncated record size', /section size is malformed/, b => b.writeUInt32BE(r.size - 1, r.headerOffset + 20));
const real = value('--real-object');
if (real) {
 const object = path.resolve(real), e = parseElfFile(object), source = e.sections.find(s => s.name === '.ob64.r0125');
 assert(source && source.size === 1704 && source.alignment === 4);
 const fsymbols = e.symbols.filter(s => s.symbolType === 2 && s.sectionIndex === source.index).sort((a,b) => a.value - b.value);
 assert.deepStrictEqual(fsymbols.map(s => [s.value,s.size,s.binding]), [[0,776,1],[776,928,0]]);
 const functions = fsymbols.map((s,i) => ({ symbol:s.name,offset:'0x'+s.value.toString(16).toUpperCase().padStart(8,'0'),offsetNumber:s.value,bytes:s.size,binding:i?'LOCAL':'GLOBAL',entryEvidence:i?'fixed-address-call':'owner' }));
 const definitions = fs.readFileSync(path.resolve(value('--definitions')), 'utf8').split('SECTIONS')[0];
 exercise('actual-decoder', object, source.name, [{sectionName:source.name,bytes:792,symbol:fsymbols[0].name,symbolSize:776},
 {sectionName:'.ob64.r0126',bytes:912,symbol:'func_0000E708',symbolSize:0}], functions, definitions, 0x8007dff0, value('--expected') && path.resolve(value('--expected')));
}
report.status='pass';fs.writeFileSync(path.join(root,'report.json'),JSON.stringify(report,null,2)+'\n');process.stdout.write(JSON.stringify(report,null,2)+'\n');
