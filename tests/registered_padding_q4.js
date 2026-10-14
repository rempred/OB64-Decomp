'use strict';
// Q4's real PURE_C producer through existing production machinery in an isolated
// two-slice link. Full-ROM audit and complete-wave acceptance remain separate.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
const native = require('../tools/lib/real_mips_toolchain');

function main() {
  const whole = p8.loadPhase8Model();
  const target = whole.targets.find(t => t.symbol === 'func_0011B344');
  const row = target.row;
  const edge = p7.retainedPaddingSlices(row);
  assert.deepEqual([row.index, row.bytes, target.bytes, edge.retained.bytes], [2327, 236, 224, 12]);
  assert.deepEqual(row.slices.map(s => [s.romStart, s.romEndExclusive, s.vramStart, s.vramEndExclusive]), [
    [0x11B344, 0x11B424, 0x801C6C04, 0x801C6CE4],
    [0x11B424, 0x11B430, 0x801C6CE4, 0x801C6CF0],
  ]);
  assert(row.slices.every(s => s.executable && s.nonExecutableRangeId === null && s.overlayDescriptorId === 7));
  assert(!p8.physicalInterface(target));
  const tc = native.assertToolchainAvailable(native.loadToolchainConfig());
  const local = JSON.parse(fs.readFileSync(path.join(p7.ROOT, 'config/local-tools.json')));
  p8.verifyCompiler(whole, local.compiler);
  const classification = require('../tools/lib/source_policy').classifyTargetSources([target]).targets[0];
  assert.equal(classification.class, 'PURE_C');
  const out = fs.mkdtempSync(path.join(p7.ROOT, 'build/q4-edge-'));
  const write = (name, bytes) => { const file = path.join(out, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); };
  const run = (exe, args) => native.runTool(exe, args, { cwd: out });
  const strip = ['--remove-section=.reginfo', '--remove-section=.pdr', '--remove-section=.comment', '--remove-section=.note'];
  write('original.s', require('../tools/build_phase7_conventional').transformTrackedPartSource(row, fs.readFileSync(path.join(p7.ROOT, row.part.file))));
  run(tc.assemblerAbs, [...tc.assemblerFlags, '-o', 'original.raw.o', 'original.s']);
  fs.mkdirSync(path.join(out, 'phase7/objects/assembly'), { recursive: true });
  const chunk = 'chunk_017.o';
  run(tc.objcopyAbs, [...strip, ...row.slices.flatMap(s => ['--set-section-flags', s.sectionName + '=alloc,load,code,readonly,data,contents']), 'original.raw.o', 'phase7/objects/assembly/' + chunk]);
  const original = path.join(out, 'phase7/objects/assembly', chunk);
  const minimal = { ...whole, targets: [target], model: { ...whole.model, rows: [row], slices: row.slices, overlays: [], nonDescriptorLoadSlabs: [] } };
  const phase7 = { files: { objectManifest: path.join(out, 'phase7/objects/manifest.json') }, objectManifest: { objects: [{ path: 'objects/assembly/' + chunk, bytes: fs.statSync(original).size, sha256: p7.sha256File(original) }] } };
  p8.copyPhase7Objects(minimal, phase7, out, tc.objcopyAbs);
  p8.compileTarget(whole, target, out, local.compiler, tc.assemblerAbs, tc.objcopyAbs, { classification });
  const cPath = path.join(out, 'objects/c/' + target.symbol + '.o');
  const rawPath = path.join(out, 'objects/c/' + target.symbol + '.source-object.o');
  const c = p7.parseElfFile(cPath), raw = p7.parseElfFile(rawPath);
  const body = c.sections.find(s => s.name === target.sectionName);
  assert.deepEqual([body.size, body.alignment], [224, 4]);
  const functions = raw.symbols.filter(s => s.symbolType === 2 && s.sectionIndex !== 0);
  assert.deepEqual(functions.map(s => [s.name, s.value, s.size, s.binding, s.visibility]), [['func_0011B344', 0, 224, 1, 0]]);
  const rel = p8.relocationRecords(raw, target);
  assert.deepEqual(rel, target.expectedRelocations);
  assert.deepEqual(rel.map(r => [r.offset, r.type, r.symbol]), [0x28, 0x48, 0x68, 0x88, 0xA8, 0xC4].map(n => [p7.hex(n), 'R_MIPS_26', 'func_000016C4']));
  // Independently assemble untouched compiler text: section alignment is native
  // evidence, not authority to add or remove bytes from either original slice.
  run(tc.assemblerAbs, [...tc.compilerAssemblerFlags, '-o', 'untouched.o', 'generated/c/' + target.symbol + '.compiler.s']);
  const untouched = p7.parseElfFile(path.join(out, 'untouched.o'));
  const text = untouched.sections.find(s => s.name === '.text');
  assert.deepEqual([text.size, text.alignment], [224, 16]);
  assert(Buffer.from(p7.elfSectionBytes(untouched, text)).equals(Buffer.from(p7.elfSectionBytes(raw, raw.sections.find(s => s.name === target.sectionName)))));
  // A later fixture caller supplies a normal map-section boundary (the generic
  // map verifier expects another owner after this nonterminal retail row) and
  // checks the preserved public entry through a real JAL relocation.
  write('caller.s', '.set noat\n.set noreorder\n.section .ob64.r9000,"ax",@progbits\n.align 2\n.globl fixture_caller\nfixture_caller:\njal func_0011B344\nnop\njr $31\nnop\n');
  run(tc.assemblerAbs, [...tc.compilerAssemblerFlags, '-o', 'caller.raw.o', 'caller.s']);
  run(tc.objcopyAbs, [...strip, 'caller.raw.o', 'objects/assembly/caller.o']);
  const callerSlice = { ordinal: 9000, rowIndex: 9000, sectionName: '.ob64.r9000', phdrName: 'p9000', sliceIndex: 0, sliceCount: 1, romStart: 0x120000, romEndExclusive: 0x120010, bytes: 16, vramStart: 0x801C7000, vramEndExclusive: 0x801C7010, executable: true };
  minimal.model.slices = [...row.slices, callerSlice];
  write('linker/phase8.ld', p8.renderPhase8LinkerScript(minimal, { linkedObjects: [] }));
  run(tc.toolsAbs.linker, [...tc.linkerFlags, '-T', 'linker/phase8.ld', '-Map=phase8.map', '-o', 'phase8.elf', 'objects/assembly/' + chunk, 'objects/assembly/caller.o', 'objects/c/' + target.symbol + '.o']);
  const linkedPath = path.join(out, 'phase8.elf');
  const linked = p7.parseElfFile(linkedPath);
  const call = p7.elfSectionBytes(linked, linked.sections.find(s => s.name === callerSlice.sectionName)).readUInt32BE(0);
  assert.equal(((callerSlice.vramStart & 0xF0000000) | ((call & 0x03FFFFFF) << 2)) >>> 0, 0x801C6C04);
  const rom = fs.readFileSync(path.join(p7.ROOT, 'build/baserom.us_rev0.z64'));
  const fallback = p7.parseElfFile(path.join(out, 'comparison/original', chunk));
  const prunedPath = path.join(out, 'objects/assembly', chunk);
  const proof = p8.verifyEdgePhysicalOwner(target, fallback, p7.parseElfFile(prunedPath), c, linked, rom);
  assert.deepEqual(proof.omittedLocalSymbols, []);
  assert.equal(proof.bytes, 236);
  assert.equal(proof.sha256, 'D32E5D60DA2783A0C0724A59B7D1DF54E3E09C4C544DD587C85835BA722E131E');
  p8.verifyEdgeMap(target, fs.readFileSync(path.join(out, 'phase8.map'), 'utf8'));
  const verification = { targets: [{ symbol: target.symbol, physicalOwnerEvidence: proof }] };
  p8.verifyRecordedEdgePadding(minimal, out, verification, { baserom: rom });
  p8.verifyRecordedEdgePadding(minimal, out, verification, { elf: linked, baserom: rom });
  const sourceProof = p8.deriveSourceObjectProof(minimal, target, out, classification, linked, rom);
  write('source-object-proof.json', sourceProof.proofBytes);
  const accounting = require('../tools/lib/status_accounting').summarizeAcceptedOwnership(minimal.model, [target]);
  assert.equal(accounting.replacements.bytes, 224);
  assert.equal(accounting.assembly.rows.find(r => r.rowIndex === 2327).bytes, 12);
  let controls = 0;
  const reject = fn => { assert.throws(fn); controls++; };
  reject(() => p8.verifyRecordedEdgePadding(minimal, out, { targets: [{ symbol: target.symbol }] }, { baserom: rom }));
  const partial = structuredClone(verification); partial.targets[0].physicalOwnerEvidence.bytes = 224;
  reject(() => p8.verifyRecordedEdgePadding(minimal, out, partial, { baserom: rom }));
  const withoutTail = p7.parseElfFile(linkedPath); withoutTail.sections = withoutTail.sections.filter(s => s.name !== edge.retained.sectionName);
  reject(() => p8.verifyEdgePhysicalOwner(target, fallback, p7.parseElfFile(prunedPath), c, withoutTail, rom));
  const saved = fs.readFileSync(prunedPath), bad = Buffer.from(saved);
  const retained = p7.parseElfFile(prunedPath).sections.find(s => s.name === edge.retained.sectionName);
  bad[retained.offset] = 1; fs.writeFileSync(prunedPath, bad);
  try {
    reject(() => p8.verifyRecordedEdgePadding(minimal, out, verification, { baserom: rom }));
    reject(() => p8.verifyRecordedEdgePadding(minimal, out, verification, { elf: linked, baserom: rom }));
  } finally { fs.writeFileSync(prunedPath, saved); }
  const wrong = structuredClone(row); wrong.slices[1].executable = false;
  reject(() => p7.retainedPaddingSlices(wrong));
  p8.verifyRecordedEdgePadding(minimal, out, verification, { baserom: rom });
  const report = { status: 'pass', acceptance: false, out, controls, sourceClass: classification.class, nativeBytes: text.size, nativeAlignment: text.alignment, bodyBytes: 224, retainedAsmBytes: 12, fullOwnerBytes: proof.bytes, relocations: rel, proof };
  write('test-result.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  return report;
}
if (require.main === module) main();
module.exports = { main };
