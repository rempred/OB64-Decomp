#!/usr/bin/env node
'use strict';
// Optional source-bound regression: depends on ignored W8 evidence. It neither
// registers nor activates the producer. Routine coverage lives in the independent
// fixture, tests/atomic_owner_union.js.
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const p7 = require('../tools/lib/phase7_conventional'), p8 = require('../tools/lib/phase8_matching_c');
const active = require('../tools/lib/active_targets'), atomic = require('../tools/lib/atomic_owner_union');
const logical = require('../tools/lib/logical_functions'), aux = require('../tools/lib/auxiliary_projection');
const policy = require('../tools/lib/source_policy'), groups = require('../tools/lib/compilation_groups');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { ROOT, hex, sha256Buffer: hash } = p7;
const context = active.loadActiveTargetModel(), tools = assertToolchainAvailable(loadToolchainConfig());
const local = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json')));
p8.verifyCompiler(context, local.compiler);
const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/atomic-owner-real-'));
const bodyFile = path.join(ROOT, 'build/audit/atomic-owner-union-20261010/suggested-logical-body.json');
const body = JSON.parse(fs.readFileSync(bodyFile));
assert.equal(body.symbol, 'func_0021EBBC');
assert.equal(body.expectedBytesSha256, 'FB00F50A286089C39EFDD6777416CCD2C9E47B974503554059EAF98A1A0D7A87');
assert.equal(body.evidence.status, 'independent-entry-supported');
const rows = [4062, 4063].map(index => context.model.rows.find(row => row.index === index));
const data = [4160, 4161].map(index => context.model.rows.find(row => row.index === index));
const registry = logical.loadRegistry(context.model, rom, { schemaVersion: 1, profile: context.model.config.profile,
  bodies: [body], padding: [], unavailableBodies: [], preservedProductionEnvelopes: [] });
const start = body.romStart, base = rows[0].slices[0].vramStart, bytes = body.romEndExclusive - start;
const owners = rows.map((row, ownerIndex) => ({ ownerIndex, sectionName: row.slices[0].sectionName,
  symbol: row.part.name, rowIndex: row.index, primaryId: row.primaryId, chunkIndex: row.part.chunkIndex,
  logicalOffset: row.romStart - start, logicalEnd: row.romEndExclusive - start, bytes: row.bytes,
  romStartNumber: row.romStart, romEndNumber: row.romEndExclusive, vramStartNumber: row.slices[0].vramStart,
  vramEndNumber: row.slices[0].vramEndExclusive, expectedTextSha256: hash(rom.subarray(row.romStart, row.romEndExclusive)),
  originalAssembly: row.part.file, originalAssemblySha256: row.part.sha256, row }));
const sources = [
  ['best', 'docs/archive/matching-c-candidates/2026-10-10-func_0021EBBC-d8da8636e3.c', 'ECB647EA7B9AB95107F77C9AE672C2BBDC479CFAA49D4C944370EF6079712DE5'],
  ['nonmatch', 'build/matching/terminal-w8-261009/21ebbc-case4-no-step-loop.c', '3A72860842E68DA5C06186C267F9226E4884B58D8F780F55906763A95EBAE395'],
];
const addresses = new Map(), results = [];
for (const [name, source, expectedHash] of sources) {
  const dir = path.join(root, name); fs.mkdirSync(dir);
  assert.equal(p7.sha256File(path.join(ROOT, source)), expectedHash);
  const classification = policy.classifyTargetSources([{ symbol: body.symbol, source, bytes }]).targets[0];
  assert.equal(classification.class, 'PURE_C');
  const input = path.join(dir, 'input.c'), compilerFile = path.join(dir, 'compiler.s');
  fs.writeFileSync(input, policy.compilationInputBytes(classification));
  p7.run(local.compiler, [...context.config.compiler.compileFlags, '-o', compilerFile, input]);
  const compiler = fs.readFileSync(compilerFile), assemblerFile = path.join(dir, 'assigned.s'), objectFile = path.join(dir, 'assigned.o');
  fs.writeFileSync(assemblerFile, p8.adjustSectionAssembly(compiler, owners[0].sectionName, { allowAuxiliaryReadOnlySections: true }));
  runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', objectFile, assemblerFile]);
  const elf = p7.parseElfFile(objectFile), text = elf.sections.find(s => s.name === owners[0].sectionName), ro = elf.sections.find(s => s.name === '.rodata');
  assert.equal(text.size, bytes); assert.equal(ro.size, 456); assert.equal(ro.alignment, 8);
  const rawRo = p7.elfSectionBytes(elf, ro), rels = groups.relocations(elf), textRels = rels.filter(r => r.owner.index === text.index);
  let maskedDifferences = 0; const masks = new Map(textRels.map(r => [r.place, r.type === 4 ? 0xfc000000 : 0xffff0000]));
  for (let offset = 0; offset < bytes; offset += 4) {
    const mask = masks.get(offset) ?? 0xffffffff;
    if ((elf.buffer.readUInt32BE(text.offset + offset) & mask) !== (rom.readUInt32BE(start + offset) & mask)) maskedDifferences++;
  }
  assert.equal(maskedDifferences, name === 'best' ? 0 : 33);
  if (name === 'best') {
    const pending = new Map();
    for (const r of textRels.filter(r => r.symbol.sectionIndex === 0)) {
      const raw = elf.buffer.readUInt32BE(text.offset + r.place), retail = rom.readUInt32BE(start + r.place), key = r.symbol.name;
      function assign(value) { value >>>= 0; if (addresses.has(key)) assert.equal(addresses.get(key), value, key); addresses.set(key, value); }
      if (r.type === 4) assign((((base + r.place + 4) & 0xf0000000) | ((retail & 0x03ffffff) * 4)) - (raw & 0x03ffffff) * 4);
      else if (r.type === 5) { if (!pending.has(key)) pending.set(key, []); pending.get(key).push({ raw, retail }); }
      else if (r.type === 6) {
        assert(pending.get(key)?.length);
        for (const high of pending.get(key)) assign(((high.retail & 65535) << 16) + ((retail << 16) >> 16) - (((high.raw & 65535) << 16) + ((raw << 16) >> 16)));
        pending.delete(key);
      } else assert.fail('unexpected external relocation');
    }
    assert.equal(pending.size, 0);
  }
  const occurrences = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)].map(m => ({
    label: /(\.L\d+):/.exec(m[1])[1], bytes: [...m[1].matchAll(/\.word/g)].length * 4,
    alignmentDirectives: [...m[1].matchAll(/\.align\s+(\d+)/g)].map(m => Number(m[1])) }));
  assert.deepEqual(occurrences.map(o => o.bytes), [176, 252, 20]);
  let cursor = 0; for (const o of occurrences) { cursor = Math.ceil(cursor / 8) * 8; o.offset = cursor; cursor += o.bytes; }
  const sections = data.map((row, i) => { const offset = i ? 432 : 0, entries = i ? 5 : 107, slice = row.slices[0];
    return { kind: 'switch-table', compilerSection: '.rodata', outputSection: slice.sectionName,
      sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 8,
      romStart: hex(row.romStart), romEndExclusive: hex(row.romEndExclusive), vramStart: hex(slice.vramStart), vramEndExclusive: hex(slice.vramEndExclusive),
      bytes: row.bytes, entries, expectedObjectSha256: hash(rawRo.subarray(offset, offset + row.bytes)),
      expectedLinkedSha256: hash(rom.subarray(row.romStart, row.romEndExclusive)), preservedTail: null,
      trailingPaddingBytes: 4, expectedTrailingPaddingSha256: hash(Buffer.alloc(4)),
      expectedRelocations: Array.from({ length: entries }, (_, j) => ({ offset: hex(j * 4), type: 'R_MIPS_32', symbol: '.text',
        addend: hex(rawRo.readUInt32BE(offset + j * 4)), section: '.rel.rodata' })) };
  });
  const projection = { schemaVersion: 4, mode: 'fixed-row-readonly-projection', compilerSection: '.rodata', bytes: 456, alignment: 8,
    expectedObjectSha256: hash(rawRo), segments: data.map((row, i) => ({ kind: 'payload', offset: i ? 432 : 0, bytes: row.bytes,
      outputSection: row.slices[0].sectionName, occurrences: i ? [occurrences[2]] : occurrences.slice(0, 2) })) };
  const target = { ...owners[0], symbol: body.symbol, source, sourceSha256: expectedHash, bytes,
    romEndNumber: body.romEndExclusive, vramEndNumber: base + bytes, expectedTextSha256: body.expectedBytesSha256,
    rows, row: rows[0], textOwners: owners, multiOwner: true, model: context.model,
    atomicText: { schemaVersion: 1, mode: atomic.MODE, alignment: 4 }, auxiliaryProjection: projection,
    auxiliarySections: [], compilerTextFunctions: [{ symbol: body.symbol, offset: hex(0), offsetNumber: 0, bytes, binding: 'GLOBAL', entryEvidence: 'owner' }],
    compilerTextFunctionsExplicit: false, legacyAncillaryRelocations: [], expectedRelocations: [], descriptorRawSha256: null, overlayDescriptorId: null };
  atomic.bind(target, registry);
  target.auxiliarySections = active.resolveAuxiliarySectionContracts(context.model, rom, target, active.normalizeAuxiliarySectionContracts(sections, target.symbol, 'real fixture', projection));
  target.auxiliaryProjectionRetained = aux.retainedBindings(target, context.model, rom);
  fs.writeFileSync(assemblerFile, aux.assembly(compiler, target, p8.adjustSectionAssembly));
  runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', objectFile, assemblerFile]);
  target.expectedRelocations = p8.relocationRecords(p7.parseElf32BigEndian(atomic.project(fs.readFileSync(objectFile), target).buffer), target);
  const output = path.join(dir, 'compiled'); fs.mkdirSync(output);
  p8.compileTarget({ ...context, targets: [target] }, target, output, local.compiler, tools.assemblerAbs, tools.objcopyAbs, { classification });
  const linkSlices = [{ ...rows[0].slices[0], bytes, romEndExclusive: body.romEndExclusive, vramEndExclusive: base + bytes }, ...data.map(row => row.slices[0])];
  const ld = 'OUTPUT_ARCH(mips)\nSECTIONS {\n' + linkSlices.map(s => `${s.sectionName} ${hex(s.vramStart)} : AT(${hex(s.romStart)}) { *(${s.sectionName}) }`).join('\n') +
    '\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n' + [...addresses].map(([symbol, value]) => `${symbol} = ${hex(value)};`).join('\n') + '\n' +
    target.auxiliarySections.map(section => `${section.ownerSymbol} = ${hex(section.ownerSymbolVram)};`).join('\n');
  fs.writeFileSync(path.join(output, 'fixture.ld'), ld);
  runTool(tools.toolsAbs.linker, ['-T', 'fixture.ld', '-Map', 'phase8.map', '-o', 'phase8.elf', 'objects/c/' + body.symbol + '.o'], { cwd: output });
  const linked = p7.parseElfFile(path.join(output, 'phase8.elf')), comparison = p8.compareLinkedTargetBytes(target, linked, rom);
  assert.equal(comparison.rawBytesExact, name === 'best');
  assert.equal(comparison.differingInstructionWordCount, name === 'best' ? 0 : 33);
  const proof = p8.deriveSourceObjectProof(context, target, output, classification, linked, rom);
  p8.validateSourceObjectProofBytes(proof.proofBytes, proof.proofBytes);
  assert.equal(proof.proof.linkEvidence.fullOwnerExact, name === 'best');
  results.push({ name, source, sourceSha256: expectedHash, maskedDifferences, differingInstructionWordCount: comparison.differingInstructionWordCount,
    rawBytesExact: comparison.rawBytesExact, proofSha256: hash(proof.proofBytes) });
}
const report = { status: 'pass', scope: 'private source-bound diagnostic; no canonical activation or acceptance', root,
  originalBodyReview: { path: path.relative(ROOT, bodyFile), sha256: p7.sha256File(bodyFile) }, results };
fs.writeFileSync(path.join(root, 'report.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
