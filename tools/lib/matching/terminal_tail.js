'use strict';

// Bounded representation preparation. No result here is linked acceptance.
const fs = require('fs');
const path = require('path');
const p7 = require('../phase7_conventional');
const text = require('../text_contract');
const active = require('../active_targets');
const logical = require('../logical_functions');
const { instructionInfo, compareMips } = require('./mips_analysis');
const inputs = require('./input_set');
const policy = require('../source_policy');
const fail = message => { throw new Error('terminal tail: ' + message); };
const CONFIGS = ['config/phase7/conventional-build.json', 'config/logical-functions.json', 'config/matching-c-linkage.json'];
const boundary = 'Provisional only: actual provider/REL, focused linked custody and full-owner bytes, complete-wave verification and applicable audit remain required.';

function terminalSuffix(original, bodyBytes) {
  const bytes = original.length - bodyBytes;
  if (!Number.isInteger(bodyBytes) || bodyBytes < 8 || bodyBytes % 4 || ![4, 8, 12].includes(bytes)) fail('original terminal suffix must be 4, 8 or 12 bytes');
  if (original.subarray(bodyBytes).some(b => b !== 0)) fail('nonzero original suffix');
  return bytes;
}

function addressHints(symbols, slice) {
  return Object.entries(symbols).filter(([, value]) => Number(value) > slice.vramStart && Number(value) < slice.vramEndExclusive)
    .map(([symbol, address]) => ({ symbol, address }));
}

function ordinaryInstructionEncoding(info) {
  // A bounded encoding whitelist, not the disassembler's mnemonic fallback.
  // Ordinary loads/arithmetic can still fault at runtime; this only excludes
  // explicit exception/trap, privileged, reserved and unsupported instructions.
  const { op, rs, rt, rd, sa, funct, word } = info;
  if (op === 0) {
    if ([0x00, 0x02, 0x03, 0x38, 0x3A, 0x3B, 0x3C, 0x3E, 0x3F].includes(funct)) return rs === 0; // immediate shifts
    if ([0x04, 0x06, 0x07, 0x14, 0x16, 0x17].includes(funct)) return sa === 0; // variable shifts
    if (funct === 0x08) return rt === 0 && rd === 0 && sa === 0; // JR, further restricted below
    if (funct === 0x09) return rt === 0 && sa === 0; // JALR, link register checked below
    if ([0x10, 0x12].includes(funct)) return rs === 0 && rt === 0 && sa === 0; // MFHI/MFLO
    if ([0x11, 0x13].includes(funct)) return rt === 0 && rd === 0 && sa === 0; // MTHI/MTLO
    if (funct >= 0x18 && funct <= 0x1F) return rd === 0 && sa === 0; // multiply/divide
    if ([0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F].includes(funct)) return sa === 0;
    return false; // includes the complete trap family, SYSCALL/BREAK and reserved SPECIAL
  }
  if (op === 1) return [0, 1, 2, 3].includes(rt); // only non-link REGIMM branches
  if ([2, 3, 4, 5, 20, 21].includes(op)) return true;
  if ([6, 7, 22, 23].includes(op)) return rt === 0;
  if (op >= 8 && op <= 14 || op === 24 || op === 25) return true; // integer immediates
  if (op === 15) return rs === 0; // LUI
  if (op === 17) {
    if ([0, 1, 4, 5].includes(rs)) return (word & 0x7FF) === 0; // GPR/FPR transfers
    if (rs === 2) return [0, 31].includes(rd) && (word & 0x7FF) === 0; // CFC1
    if (rs === 6) return rd === 31 && (word & 0x7FF) === 0; // CTC1 FCSR
    if (rs === 8) return rt <= 3; // MIPS III FCC0 branch/likely, no extra condition fields
    if ([16, 17].includes(rs)) { // single/double ordinary FP operations
      if (funct <= 3) return true;
      if (funct >= 4 && funct <= 15) return rt === 0;
      if (funct === 32) return rs === 17 && rt === 0;
      if (funct === 33) return rs === 16 && rt === 0;
      if ([36, 37].includes(funct)) return rt === 0;
      if (funct >= 48 && funct <= 63) return sa === 0;
      return false;
    }
    if ([20, 21].includes(rs)) return [32, 33].includes(funct) && rt === 0; // integer-to-FP conversions
    return false;
  }
  // Integer and COP1 memory operations only. CACHE, atomics, COP0/2/3,
  // coprocessor-2 memory and all reserved primary opcodes remain unsupported.
  return [0x1A, 0x1B, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
    0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x31, 0x35, 0x37, 0x39, 0x3D, 0x3F].includes(op);
}

function coverage(bytes, start, actualRelocations = [], ownerBytes = bytes.length) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 8 || bytes.length % 4
      || bytes.readUInt32BE(bytes.length - 8) !== 0x03E00008) fail('complete return and delay slot required');
  const instructions = [], delaySlots = new Set();
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const info = instructionInfo(bytes.readUInt32BE(offset), start + offset);
    if (!ordinaryInstructionEncoding(info)) fail('unsupported instruction encoding');
    instructions.push(info);
    if (!info.control) continue;
    if (offset + 8 > bytes.length || instructionInfo(bytes.readUInt32BE(offset + 4), start + offset + 4).control) fail('incomplete or control delay slot');
    delaySlots.add(offset / 4 + 1);
    // instructionInfo intentionally groups JALR encodings. This narrow rule
    // supports only the ordinary ra-linking call; rd=zero is a computed jump.
    if (info.indirect && info.call && (info.rd !== 31 || info.rt !== 0 || info.sa !== 0)) fail('unsupported indirect call encoding');
    if (info.indirect && !info.returnInstruction && !info.call) fail('unsupported indirect jump');
    if (info.returnInstruction && info.word !== 0x03E00008) fail('unsupported return encoding');
    // Conditional link branches and traps are not routine returning calls.
    if (info.op === 1 && ![0, 1, 2, 3].includes(info.rt)) fail('unsupported REGIMM control');
    info.branchTaken = null;
    if ([4, 20].includes(info.op) && info.rs === info.rt) info.branchTaken = true;
    if ([5, 21].includes(info.op) && info.rs === info.rt) info.branchTaken = false;
    if ([6, 22].includes(info.op) && info.rs === 0) info.branchTaken = true;
    if ([7, 23].includes(info.op) && info.rs === 0) info.branchTaken = false;
    if (info.op === 1 && info.rs === 0) info.branchTaken = [1, 3].includes(info.rt);
    info.likely = [20, 21, 22, 23].includes(info.op) || info.op === 1 && [2, 3].includes(info.rt)
      || info.op === 17 && info.rs === 8 && (info.rt & 2) !== 0;
    const relocated = actualRelocations.some(r => Number(r.offset) === offset);
    if (relocated && !info.call) fail('relocated noncall control');
    if (!relocated && info.target >= start + bytes.length && info.target < start + ownerBytes) fail('control targets suffix');
    if (!info.call && !info.indirect && (info.target < start || info.target >= start + bytes.length)) fail('control escapes complete body');
  }
  for (const [index, info] of instructions.entries()) {
    const relocated = actualRelocations.some(r => Number(r.offset) === index * 4);
    if (info.control && !info.indirect && !relocated && info.target >= start && info.target < start + bytes.length
        && delaySlots.has((info.target - start) / 4)) fail('alternate entry into control delay slot');
  }
  // All body words must belong to a reachable instruction or delay slot. This
  // deliberately rejects post-return data/secondary bodies rather than guessing.
  const entered = new Set(), seen = new Set(), pending = [0];
  while (pending.length) {
    const index = pending.pop();
    if (!Number.isInteger(index) || index < 0 || index >= instructions.length) fail('terminal fall-through or invalid successor');
    if (delaySlots.has(index)) fail('alternate entry into control delay slot');
    if (entered.has(index)) continue;
    entered.add(index);
    seen.add(index);
    const info = instructions[index];
    if (!info.control) { pending.push(index + 1); continue; }
    if (!info.likely || info.branchTaken !== false) seen.add(index + 1);
    if (info.call || info.conditional && info.branchTaken !== true) pending.push(index + 2);
    if (!info.call && !info.indirect && info.branchTaken !== false) pending.push((info.target - start) / 4);
  }
  if (seen.size !== instructions.length) fail('uncovered body instructions or secondary entry');
}

function census(elf, sectionName, symbol, assigned = false) {
  const sections = elf.sections.filter(s => s.name === sectionName);
  const functions = elf.symbols.filter(s => s.symbolType === 2);
  if (sections.length !== 1 || functions.length !== 1) fail('single section/function census');
  const section = sections[0], fn = functions[0];
  if (section.type !== 1 || section.flags !== 6 || section.address !== 0
      || fn.name !== symbol || fn.sectionIndex !== section.index || fn.binding !== 1 || fn.visibility !== 0
      || fn.value !== 0 || fn.size < 8 || fn.size % 4 || fn.size > section.size
      || (assigned && section.size !== fn.size)) fail('actual function/section extent');
  // Same native allocation validator, with the assigned text named only in the
  // in-memory census view. No object bytes or producer metadata are changed.
  text.nativeObjectAllocationEvidence({ ...elf, sections: elf.sections.map(s => s === section ? { ...s, name: '.text' } : s) });
  let markers = 0;
  for (const s of elf.symbols.filter(s => s.sectionIndex !== 0 && s !== fn && s.symbolType !== 4)) {
    const markerSection = elf.sections[s.sectionIndex];
    if (s.name === 'gcc2_compiled.' && s.symbolType === 1 && s.binding === 0 && s.value === 0 && s.size === 0 && s.visibility === 0
        && (s.sectionIndex === section.index || assigned && markerSection?.name === '.text' && markerSection.size === 0)) { markers++; continue; }
    if (s.symbolType !== 3 || s.name !== '' || s.binding || s.value || s.size || s.visibility) fail('extra text entry or data label');
  }
  if (markers !== 1) fail('compiler marker census');
  const bytes = Buffer.from(p7.elfSectionBytes(elf, section));
  const tail = bytes.subarray(fn.size);
  if (tail.length > 12 || tail.length % 4 || tail.some(b => b !== 0)) fail('native tail extent/bytes');
  return { section, fn, bytes };
}

function originalOwner(session, target, bodyBytes) {
  const model = session.context.phase8.model;
  const matches = model.rows.filter(r => r.part?.name === target.symbol);
  if (matches.length !== 1) fail('unique original-name owner required');
  const row = matches[0], slice = row.slices[0];
  if (row.primaryClass !== 'code' || row.processorClass === 'rsp' || row.ambiguous !== false
      || row.retainedPadding || row.slices.length !== 1 || !slice.executable || slice.placementKind === 'rom-only'
      || slice.executableRangeId !== null || slice.nonExecutableRangeId !== null || row.part.symbolByteOffset !== 0) fail('unsupported physical owner');
  const tailBytes = row.bytes - bodyBytes;
  if (![4, 8, 12].includes(tailBytes)) fail('original terminal suffix must be 4, 8 or 12 bytes');
  // Equal RAM addresses can belong to different overlays. These unscoped
  // aliases neither grant an entry nor prove its absence in this owner.
  const unscopedAddressBindings = addressHints(session.context.phase8.linkSymbols || {}, slice);
  for (const producer of session.context.phase8.targets.filter(t => t.romStartNumber < row.romEndExclusive && t.romEndNumber > row.romStart)) {
    if (producer.symbol !== target.symbol || producer.compilationGroup || producer.atomicText || producer.nativeTextTail
        || producer.auxiliaryProjection || producer.retainedLiteralReferences || producer.multiOwnerContract
        || producer.physicalInterface || producer.auxiliarySections?.length || producer.compilerTextFunctions?.length > 1) fail('unsupported producer');
  }
  const selected = inputs.context(session.context);
  const source = fs.readFileSync(inputs.resolve(selected, path.join(p7.ROOT, row.part.file)));
  if (p7.sha256Buffer(source) !== row.part.sha256) fail('original assembly identity drift');
  if (!text.same(active.assemblySymbolNames(source.toString()), [target.symbol])) fail('extra original entry or label');
  const words = [...source.toString().matchAll(/\.word\s+(0x[0-9a-f]+)/ig)].map(m => Number(m[1]));
  if (words.length * 4 !== row.bytes) fail('complete original word census');
  const original = Buffer.alloc(row.bytes); words.forEach((w, i) => original.writeUInt32BE(w >>> 0, i * 4));
  const rom = fs.readFileSync(inputs.resolve(selected, session.context.baserom.path));
  p7.verifyRom(model, rom);
  if (!original.equals(rom.subarray(row.romStart, row.romEndExclusive))) fail('original full owner differs from ROM');
  terminalSuffix(original, bodyBytes);
  const config = p7.readJson(path.join(p7.ROOT, CONFIGS[1]), selected);
  logical.loadRegistry(model, rom, config);
  const overlaps = value => value.romStart < row.romEndExclusive && value.romEndExclusive > row.romStart;
  if (config.bodies.some(overlaps) || config.padding.some(overlaps) || config.unavailableBodies.some(overlaps)
      || config.preservedProductionEnvelopes.some(e => e.fragments.some(overlaps))) fail('existing logical coverage requires separate handling');
  coverage(original.subarray(0, bodyBytes), slice.vramStart, [], row.bytes);
  return { row, original, bodyBytes, tailBytes, unscopedAddressBindings };
}

function descriptor(row, bodyBytes, native) {
  if (bodyBytes !== native.fn.size) fail('descriptor function extent');
  const shape = { type: native.section.type, flags: native.section.flags, alignment: native.section.alignment, bytes: native.section.size };
  return text.normalizeNativeTextTail({ schemaVersion: 2, ownerRowIndex: row.index, inputSection: '.text', outputSection: row.slices[0].sectionName,
    inputShape: shape, outputShape: { ...shape }, functionBytes: bodyBytes,
    tail: { ownerRowIndex: row.index, offset: bodyBytes, bytes: native.bytes.length - bodyBytes, fillByte: 0,
      sha256: p7.sha256Buffer(native.bytes.subarray(bodyBytes)), origin: 'native-assembler-section-alignment' } }, row.part.name);
}

function inspect({ session, target, classification, artifactDir }) {
  if (classification.class !== 'PURE_C') fail('PURE_C required');
  policy.verifyClassificationInputs(classification);
  const p8 = require('../phase8_matching_c');
  const assigned = census(p7.parseElfFile(path.join(artifactDir, 'candidate.o')), target.sectionName, target.symbol, true);
  const owner = originalOwner(session, target, assigned.fn.size);
  const relocations = p8.relocationRecords(p7.parseElfFile(path.join(artifactDir, 'candidate.o')), { symbol: target.symbol, bytes: assigned.fn.size, sectionName: target.sectionName });
  if (relocations.some(r => !['R_MIPS_26', 'R_MIPS_HI16', 'R_MIPS_LO16'].includes(r.type)
      || Number(r.offset) % 4 || Number(r.offset) < 0 || Number(r.offset) + 4 > assigned.fn.size)) fail('unsupported actual relocation');
  const comparison = compareMips(owner.original.subarray(0, assigned.fn.size), assigned.bytes, {
    start: owner.row.slices[0].vramStart, actualRelocations: relocations, expectedRelocationsAvailable: false,
  });
  if (!comparison.relocationMaskedExact) fail('ordinary body mismatch');
  coverage(assigned.bytes, owner.row.slices[0].vramStart, relocations, owner.row.bytes);
  const assemblyFile = path.join(artifactDir, 'candidate.compiler.s');
  const assembly = fs.readFileSync(assemblyFile);
  // Validate production grammar, but assemble the unmodified compiler bytes.
  p8.adjustSectionAssembly(assembly, target.sectionName, {});
  // Each observation has its own artifact; never overwrite an older diagnostic.
  const nativeFile = path.join(artifactDir, 'tn-' + require('crypto').randomBytes(6).toString('hex') + '.o');
  p7.run(session.runtime.tools['mips-kmc-elf-as.exe'].path,
    [...session.context.phase8.model.config.binutils.compilerAssemblerFlags, '-o', nativeFile, assemblyFile], { cwd: artifactDir });
  const elf = p7.parseElfFile(nativeFile), native = census(elf, '.text', target.symbol);
  const nativeRelocations = p8.relocationRecords(elf, { symbol: target.symbol, bytes: assigned.fn.size, sectionName: '.text' });
  const allNativeRelocations = p8.rawRelocationRecords(elf);
  if (allNativeRelocations.some(r => r.section !== '.rel.text')) fail('unsupported nontext relocation');
  if (native.fn.size !== assigned.fn.size || !native.bytes.subarray(0, native.fn.size).equals(assigned.bytes)
      || !text.same(nativeRelocations, relocations)) fail('native/assigned body or REL disagreement');
  // The existing schema2 census also checks native references and branch bounds.
  const nativeShape = { ...owner.row, slices: owner.row.slices };
  let nativeTextTail = null;
  if (native.bytes.length === owner.row.bytes && owner.row.slices[0].vramStart % native.section.alignment === 0) {
    nativeTextTail = descriptor(nativeShape, assigned.fn.size, native);
    text.nativeSingleOwnerCensus(elf, { symbol: target.symbol, nativeTextTail });
  }
  // Even when the original suffix differs, native FUNC/reference census uses its
  // own actual extent, never the original suffix length. Aligned functions may
  // have zero native tail; their shared census above still applies.
  if (native.bytes.length > native.fn.size && !nativeTextTail) {
    const nativeRow = { ...owner.row, slices: owner.row.slices };
    const d = descriptor(nativeRow, native.fn.size, native);
    text.nativeSingleOwnerCensus(elf, { symbol: target.symbol, nativeTextTail: d });
  }
  if (native.bytes.length === native.fn.size && allNativeRelocations.some(r => r.symbolSectionIndex !== 0)) fail('aligned producer with local relocation needs separate handling');
  policy.verifyClassificationInputs(classification);
  const artifact = file => ({ path: path.relative(p7.ROOT, file).replace(/\\/g, '/'), sha256: p7.sha256File(file), bytes: fs.statSync(file).size });
  return { ...owner, symbol: target.symbol, nativeTextTail, relocations,
    diagnostic: { status: 'suggested', representation: nativeTextTail ? 'nativeTextTail' : 'retained-original-ASM',
      bodyBytes: assigned.fn.size, originalSuffixBytes: owner.tailBytes, nativeTextBytes: native.bytes.length,
      nativeSuffixBytes: native.bytes.length - native.fn.size, rawBodyExact: comparison.exactBytes,
      relocationMaskedBodyExact: comparison.relocationMaskedExact, linkedQualified: false,
      unscopedAddressBindings: owner.unscopedAddressBindings,
      sourceSha256: classification.sourceSha256, originalAssemblySha256: owner.row.part.sha256,
      ownerSha256: p7.sha256Buffer(owner.original), actualRelocations: relocations,
      compilerAssembly: artifact(assemblyFile), assignedObject: artifact(path.join(artifactDir, 'candidate.o')), nativeObject: artifact(nativeFile),
      acceptanceBoundary: boundary } };
}

function diagnose(args) {
  // Ordinary matches and code-length experiments need no extra assembler call.
  const expected = args.target.bytes;
  const file = path.join(args.artifactDir, 'candidate.o');
  if (!fs.existsSync(file)) return null;
  const elf = p7.parseElfFile(file), fn = elf.symbols.find(s => s.symbolType === 2 && s.name === args.target.symbol);
  if (!fn || ![4, 8, 12].includes(expected - fn.size)) return null;
  try { return inspect(args).diagnostic; }
  catch (error) { inputs.rethrow(error); return { status: 'not-routine', reason: error.message, linkedQualified: false, acceptanceBoundary: boundary }; }
}

function compose(model, rom, configs, proposals) {
  const [conventional, registry, linkage] = structuredClone(configs);
  if (!proposals.length || new Set(proposals.map(p => p.symbol)).size !== proposals.length) fail('empty or duplicate batch');
  active.validateLinkageConfig(linkage, model.config.profile);
  const proposed = structuredClone(model);
  for (const p of proposals) {
    const row = proposed.rows.find(r => r.index === p.row.index);
    if (!text.same(row, p.row) || row.retainedPadding || row.slices.length !== 1) fail('stale owner or cut conflict');
    const existing = linkage.targets.filter(t => t.symbol.toLowerCase() === p.symbol.toLowerCase());
    if (existing.length > 1 || existing.some(t => Object.keys(t).some(k => !['symbol', 'expectedRelocations'].includes(k)))) fail('conflicting linkage contract');
    if (existing.length && !text.same(existing[0].expectedRelocations, p.relocations)) fail('existing relocation contract differs');
    const record = existing[0] || { symbol: p.symbol, expectedRelocations: p.relocations };
    if (!existing.length) linkage.targets.push(record);
    if (p.nativeTextTail) { record.nativeTextTail = p.nativeTextTail; continue; }
    const start = row.romStart + p.bodyBytes, id = `routine-row${row.index}-terminal`;
    if (conventional.retainedPaddingCuts.some(c => c.id === id || c.rowIndex === row.index)) fail('cut collision');
    const overlap = x => x.romStart < row.romEndExclusive && x.romEndExclusive > row.romStart;
    if (registry.bodies.some(overlap) || registry.padding.some(overlap) || registry.unavailableBodies.some(overlap)) fail('logical coverage collision');
    const cut = { id, rowIndex: row.index, romStart: start, romEndExclusive: row.romEndExclusive, edge: 'terminal',
      sourceSha256: row.part.sha256, expectedSha256: p7.sha256Buffer(p.original.subarray(p.bodyBytes)),
      compilerFunctions: [{ symbol: p.symbol, binding: 'GLOBAL', entryEvidence: 'owner' }] };
    conventional.retainedPaddingCuts.push(cut);
    conventional.expected.retainedPaddingCuts++;
    conventional.expected.linkSlices++;
    conventional.expected.splitOwners++;
    const slice = row.slices[0];
    row.retainedPadding = cut;
    row.slices = [0, 1].map(i => { const a = i ? start : row.romStart, b = i ? row.romEndExclusive : start;
      return { ...slice, sliceIndex: i, sliceCount: 2, sectionName: slice.sectionName + '.s' + i,
        romStart: a, romEndExclusive: b, bytes: b - a, vramStart: slice.vramStart + a - row.romStart,
        vramEndExclusive: slice.vramStart + b - row.romStart, ...(i ? { retainedPaddingId: id } : {}) }; });
    p7.retainedPaddingSlices(row);
    const evidence = `Complete original return and delay slot end at ROM 0x${start.toString(16).toUpperCase()}; ${p.tailBytes} following zero bytes remain executable original ASM. No historical padding origin or numeric/runtime reference absence is claimed.`;
    registry.padding.push({ romStart: start, romEndExclusive: row.romEndExclusive, expectedBytesSha256: cut.expectedSha256, evidence });
    registry.bodies.push({ romStart: row.romStart, romEndExclusive: start, symbol: p.symbol, aliases: [],
      expectedBytesSha256: p7.sha256Buffer(p.original.subarray(0, p.bodyBytes)), evidence: { caseId: id, status: 'known-entry-or-ownership', rationale: evidence },
      fragments: [{ rowIndex: row.index, romStart: row.romStart, romEndExclusive: start, ownerOffset: 0, bytes: p.bodyBytes,
        vramStart: slice.vramStart, sectionName: row.slices[0].sectionName, placementKind: slice.placementKind,
        overlayDescriptorId: slice.overlayDescriptorId, loadSlabId: slice.loadSlabId, file: row.part.file, sha256: row.part.sha256 }] });
  }
  registry.bodies.sort((a, b) => a.romStart - b.romStart); registry.padding.sort((a, b) => a.romStart - b.romStart);
  proposed.config = conventional;
  p7.validateRetainedPaddingCuts(conventional, proposed.rows, proposed.rows.filter(r => r.part).map(r => r.part));
  // Check-only proposed values. loadRegistry's disk identity describes the
  // current file, not this proposal: never export or use its authority in a link.
  logical.loadRegistry(proposed, rom, registry);
  active.validateLinkageConfig(linkage, model.config.profile);
  return [conventional, registry, linkage];
}

function writeBatch(files, before, after, recheck) {
  recheck();
  files.forEach((file, i) => { inputs.regular(file); if (!fs.readFileSync(file).equals(before[i])) fail('stale configuration base'); });
  const written = [];
  try {
    files.forEach((file, i) => {
      if (before[i].equals(after[i])) return;
      // Exclusive creation and adjacent rename prevent partially written JSON.
      const temporary = file + '.terminal-tail-' + require('crypto').randomUUID() + '.tmp';
      fs.writeFileSync(temporary, after[i], { flag: 'wx' });
      if (!fs.readFileSync(file).equals(before[i])) fail('configuration changed before replacement');
      fs.renameSync(temporary, file); written.push(i);
    });
  } catch (error) {
    // Never overwrite another writer's later changes during recovery.
    for (const i of written.reverse()) if (fs.readFileSync(files[i]).equals(after[i])) fs.writeFileSync(files[i], before[i]);
    throw error;
  }
}

function admit(symbols, options = {}) {
  if (!symbols.length || symbols.some(s => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(s))
      || new Set(symbols.map(s => s.toLowerCase())).size !== symbols.length) fail('unique symbols required');
  if (Object.keys(options).some(k => !['apply', 'json'].includes(k))) fail('tail-admit supports only --apply and --json');
  const seal = require('./private_inputs').capturePrivateInputs();
  const context = require('../current_workflow').prepareContext({ readOnly: true, allowMissingRelocationContracts: symbols });
  const compiler = require('./compiler'), session = compiler.prepareCompilerSession({ context });
  const files = CONFIGS.map(f => path.join(p7.ROOT, f)), before = files.map(f => fs.readFileSync(f));
  const root = path.join(p7.ROOT, 'build', 'matching');
  inputs.regular(root, true);
  const output = fs.mkdtempSync(path.join(root, 'tail-'));
  const proposals = symbols.map((symbol, i) => {
    const matches = context.phase8.targets.filter(t => t.symbol === symbol);
    if (matches.length !== 1) fail('stage exactly one current active source for ' + symbol);
    const target = matches[0], sourceFile = path.join(p7.ROOT, target.source);
    const classification = policy.classifySource(target.source, { preprocessor: session.preprocessor });
    if (classification.class !== 'PURE_C') fail('PURE_C required');
    const artifactDir = path.join(output, String(i)); fs.mkdirSync(artifactDir);
    compiler.compileScratchCandidate({ session, target, sourceFile, artifactDir, classification });
    return inspect({ session, target, classification, artifactDir });
  });
  const configs = compose(context.phase8.model, fs.readFileSync(context.baserom.path), before.map(b => JSON.parse(b)), proposals);
  const after = configs.map((c, i) => Buffer.from((JSON.stringify(c, null, 2) + '\n').replace(/\n/g, before[i].includes(Buffer.from('\r\n')) ? '\r\n' : '\n')));
  before.forEach((b, i) => fs.writeFileSync(path.join(output, 'base-' + i + '.json'), b));
  after.forEach((b, i) => fs.writeFileSync(path.join(output, 'proposed-' + i + '.json'), b));
  seal.assertUnchanged();
  if (options.apply) writeBatch(files, before, after, () => {
    seal.assertUnchanged();
    for (const p of proposals) if (p7.sha256File(path.join(p7.ROOT, p.row.part.file)) !== p.row.part.sha256) fail('original source changed before apply');
  });
  const result = { status: options.apply ? 'configuration-staged' : 'configuration-proposed', output,
    targets: proposals.map(p => ({ symbol: p.symbol, ...p.diagnostic })),
    changes: files.map((file, i) => ({ file, beforeSha256: p7.sha256Buffer(before[i]), afterSha256: p7.sha256Buffer(after[i]) })), acceptanceBoundary: boundary };
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}

module.exports = { terminalSuffix, addressHints, coverage, census, originalOwner, descriptor, inspect, diagnose, compose, writeBatch, admit };
