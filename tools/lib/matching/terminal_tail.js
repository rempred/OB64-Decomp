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
const diagnosticContext = require('./diagnostic_context');
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

// Derive coverage-only successors from actual ELF bytes. A supplied map, display
// symbol name, or masked byte comparison is never local-control authority.
function localJumpEvidence(bytes, start, actualRelocations, object) {
  if (!object || Object.keys(object).some(k => !['buffer', 'sectionName', 'symbol', 'original', 'assigned'].includes(k))
      || !Buffer.isBuffer(object.buffer) || !Buffer.isBuffer(object.original) || typeof object.assigned !== 'boolean') fail('local jump object evidence required');
  const elf = p7.parseElf32BigEndian(object.buffer);
  const { section, fn, bytes: payload } = census(elf, object.sectionName, object.symbol, object.assigned);
  if (elf.header.type !== 1 || bytes.length !== fn.size || !payload.subarray(0, fn.size).equals(bytes)
      || object.original.length < fn.size || !Number.isSafeInteger(start) || start < 0
      || start + fn.size > 0x100000000) fail('local jump object/body binding');
  const expected = require('../phase8_matching_c').relocationRecords(elf, { symbol: object.symbol, bytes: fn.size, sectionName: section.name });
  if (!text.same(expected, actualRelocations)) fail('local jump relocation list disagreement');
  const edges = [], offsets = new Set();
  const relSections = elf.sections.filter(s => s.type === 9 || s.type === 4);
  if (relSections.length > 1) fail('local jump relocation section census');
  for (const rel of relSections) {
    const table = elf.sections[rel.link], strings = table && elf.sections[table.link];
    if (rel.type !== 9 || rel.name !== '.rel' + section.name || rel.info !== section.index || rel.link !== fn.symbolTableIndex
        || rel.entrySize !== 8 || rel.size % 8 || rel.offset + rel.size > elf.buffer.length
        || rel.flags !== 0 || rel.address !== 0 || rel.alignment !== 4
        || table?.type !== 2 || table.entrySize !== 16 || table.size % 16 || table.offset + table.size > elf.buffer.length
        || strings?.type !== 3 || strings.offset + strings.size > elf.buffer.length) fail('local jump REL/table authority');
    for (let i = 0; i < rel.size; i += 8) {
      const offset = elf.buffer.readUInt32BE(rel.offset + i), info = elf.buffer.readUInt32BE(rel.offset + i + 4), type = info & 255;
      if (offset % 4 || offset + 4 > fn.size || offsets.has(offset)) fail('local jump duplicate or invalid REL site');
      offsets.add(offset);
      const symbols = elf.symbols.filter(s => s.symbolTableIndex === rel.link && s.symbolIndex === (info >>> 8));
      if (symbols.length !== 1) fail('local jump symbol authority');
      const symbol = symbols[0], word = bytes.readUInt32BE(offset), decoded = instructionInfo(word, start + offset);
      if (decoded.control && !decoded.call) {
        const symbolIndex = info >>> 8, symbolOffset = table.offset + symbolIndex * 16;
        // The shared parser renders an invalid string offset as an empty name.
        // This narrow unnamed form requires the literal ELF st_name zero.
        if (symbolIndex >= table.size / 16 || symbolOffset + 16 > table.offset + table.size
            || symbolOffset + 16 > elf.buffer.length || elf.buffer.readUInt32BE(symbolOffset) !== 0) fail('local jump raw symbol name/bounds authority');
        if (word >>> 26 !== 2 || type !== 4 || symbol.name !== '' || symbol.binding !== 0 || symbol.symbolType !== 3
            || symbol.visibility !== 0 || symbol.value !== 0 || symbol.size !== 0 || symbol.sectionIndex !== section.index) fail('unsupported relocated noncall identity');
        const addend = (word & 0x03FFFFFF) * 4, targetOffset = symbol.value + addend, destination = start + targetOffset;
        const originalWord = object.original.readUInt32BE(offset), originalTarget = instructionInfo(originalWord, start + offset).target;
        if (!Number.isSafeInteger(destination) || destination > 0xFFFFFFFF || targetOffset < 0 || targetOffset % 4 || targetOffset >= fn.size
            || start + offset + 4 > 0xFFFFFFFF || Math.floor(destination / 0x10000000) !== Math.floor((start + offset + 4) / 0x10000000)
            || originalWord >>> 26 !== 2 || originalTarget !== destination
            || originalWord !== ((word & 0xFC000000) | ((destination >>> 2) & 0x03FFFFFF)) >>> 0) fail('local jump original destination disagreement');
        // Numeric section/symbol indices can differ between objects; both have
        // independently proved the same strict own-section symbol form above.
        edges.push({ offset, type, word, addend, targetOffset, originalWord });
      } else if (!object.assigned && section.size === fn.size && symbol.sectionIndex !== 0) {
        fail('aligned producer with unproven local relocation');
      }
    }
  }
  return edges.sort((a, b) => a.offset - b.offset);
}


function coverage(bytes, start, actualRelocations = [], ownerBytes = bytes.length, object = null) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 8 || bytes.length % 4
      || bytes.readUInt32BE(bytes.length - 8) !== 0x03E00008) fail('complete return and delay slot required');
  const edges = object === null ? [] : localJumpEvidence(bytes, start, actualRelocations, object);
  const proven = new Map(edges.map(edge => [edge.offset, start + edge.targetOffset]));
  const instructions = [], delaySlots = new Set();
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const info = instructionInfo(bytes.readUInt32BE(offset), start + offset);
    if (!ordinaryInstructionEncoding(info)) fail('unsupported instruction encoding');
    if (proven.has(offset)) info.target = proven.get(offset);
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
    if (relocated && !info.call && !proven.has(offset)) fail('relocated noncall control');
    if ((!relocated || proven.has(offset)) && info.target >= start + bytes.length && info.target < start + ownerBytes) fail('control targets suffix');
    if (!info.call && !info.indirect && (info.target < start || info.target >= start + bytes.length)) fail('control escapes complete body');
  }
  for (const [index, info] of instructions.entries()) {
    const relocated = actualRelocations.some(r => Number(r.offset) === index * 4);
    if (info.control && !info.indirect && (!relocated || proven.has(index * 4)) && info.target >= start && info.target < start + bytes.length
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
  return edges;
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

// This fallback is restricted to ROM-address names; it neither selects a row
// nor creates an alias/provider. Exact-name owners avoid the source-wide scan.
function originalEntryCode(source) {
  const code = source.replace(/\/\*[\s\S]*?\*\/|#[^\r\n]*|\/\/[^\r\n]*/g,
    comment => comment.replace(/[^\r\n]/g, ' '));
  if (code.includes('/*') || code.includes('*/')) fail('unclosed original entry comment');
  return code;
}

// Interior names are ROM identities, never unscoped runtime addresses.
function interiorIdentity(names, name) {
  if (typeof name !== 'string') return false;
  const match = /^func_([0-9a-fA-F]{8})$/.exec(name);
  return names.some(entry => name === entry.name || match && Number.parseInt(match[1], 16) === entry.rom);
}

function rejectInteriorNames(names, claims, context) {
  if (claims.some(name => interiorIdentity(names, name))) fail('interior entry ' + context + ' collision');
}

// Project only supported interface fields. Active targets retain model/row/rows
// graphs; evidence prose and those graphs are neither names nor extra authority.
const symbolClaims = records => (records || []).map(record => record.symbol);
function producerNameClaims(target) {
  return [target.symbol, target.physicalInterface?.symbol, target.physicalInterface?.primary,
    ...symbolClaims(target.compilerTextFunctions), ...symbolClaims(target.expectedRelocations),
    ...symbolClaims(target.legacyAncillaryRelocations), ...symbolClaims(target.fixedBindings),
    ...(target.auxiliarySections || []).flatMap(section => [section.compilerLabel, section.memberSymbol,
      ...symbolClaims(section.expectedRelocations)])];
}
function groupNameClaims(group) {
  return [group.symbol, ...symbolClaims(group.functions), ...symbolClaims(group.compilerTextFunctions),
    ...symbolClaims(group.fixedBindings), ...symbolClaims(group.relocations), ...symbolClaims(group.expectedRelocations),
    ...symbolClaims(group.owners), ...(group.members || []).flatMap(member => [member.symbol, ...(member.functionSymbols || []),
      ...symbolClaims(member.expectedRelocations)]),
    ...(group.auxiliary?.sections || []).flatMap(section => [section.compilerLabel, section.memberSymbol,
      ...symbolClaims(section.expectedRelocations)])];
}
function registryNameClaims(config) {
  return [...config.bodies, ...config.unavailableBodies].flatMap(body => [body.symbol, ...(body.aliases || [])])
    .concat(config.preservedProductionEnvelopes.flatMap(entry => [entry.symbol, ...symbolClaims(entry.compilerTextFunctions)]));
}

function rejectInteriorObjectClaims(names, elf, relocations) {
  // Include undefined, ABS and FILE symbols, even when no relocation uses them.
  if (elf.symbols.some(symbol => interiorIdentity(names, symbol.name))
      || relocations.some(rel => interiorIdentity(names, rel.symbol))) fail('interior entry actual object symbol or REL collision');
}

function originalEntryFallback(session, target, row, source, original, selected, bodyBytes) {
  if (diagnosticContext.isDiagnosticContext(session.context)) fail('original-entry fallback unavailable in candidate diagnostic scope: full original-source collision census belongs to canonical admission');
  const address = name => /^func_([0-9a-fA-F]{8})$/.exec(name || '');
  const expected = address(target.symbol);
  if (!expected || Number.parseInt(expected[1], 16) !== row.romStart) fail('original entry is not owner ROM-address identity');
  const labels = [], globals = [], parsed = [];
  let textDirectives = 0;
  for (const line of originalEntryCode(source).split(/\r?\n/).map(s => s.trim()).filter(Boolean)) {
    let match;
    if (line === '.text' && !labels.length && !parsed.length && !textDirectives++) continue;
    if (/^\.set\s+(?:noat|noreorder)$/.test(line) && !labels.length && !parsed.length) continue;
    if ((match = /^\.globl\s+([A-Za-z_.$][A-Za-z0-9_.$]*)$/.exec(line)) && !parsed.length) { globals.push(match[1]); continue; }
    if ((match = /^([A-Za-z_.$][A-Za-z0-9_.$]*):$/.exec(line))) { labels.push({ name: match[1], offset: parsed.length * 4 }); continue; }
    if ((match = /^\.word\s+(0x[0-9a-fA-F]{1,8})$/.exec(line))) { parsed.push(Number(match[1])); continue; }
    fail('unsupported original entry grammar');
  }
  const label = labels[0], spelling = address(label?.name);
  const interiors = labels.filter(entry => entry.offset > 0);
  if (interiors.length) {
    const primaries = labels.filter(entry => entry.offset === 0), primary = primaries[0];
    const identities = labels.map(entry => address(entry.name));
    if (textDirectives !== 1 || primaries.length > 1 || row.part.name !== target.symbol
        || row.part.symbolByteOffset !== 0 || Buffer.byteLength(source) !== row.part.textBytes
        || row.part.hasOwnerLabel !== Boolean(primary && primary.name === row.part.name)
        || !Number.isInteger(bodyBytes) || bodyBytes < 8 || bodyBytes % 4
        || labels.some((entry, i) => !identities[i] || Number.parseInt(identities[i][1], 16) !== row.romStart + entry.offset
          || entry.offset % 4 || entry.offset >= bodyBytes)
        || new Set(labels.map(entry => entry.offset)).size !== labels.length
        || globals.length > (primary ? 1 : 0) || globals.some(name => name !== primary?.name)) fail('unsupported interior original entry');
  } else if (labels.length === 0) {
    // Entry authority comes from the already selected accepted owner, never
    // from absence of labels alone. This word-only representation creates no
    // alias or provider and still runs the complete census/collision checks.
    if (textDirectives !== 1 || globals.length !== 0 || row.part.hasOwnerLabel !== false
        || row.part.symbolByteOffset !== 0 || row.part.name !== target.symbol
        || Buffer.byteLength(source) !== row.part.textBytes) fail('unsupported unlabeled original entry');
  } else if (textDirectives !== 1 || labels.length !== 1 || label.offset !== 0 || !spelling
      || label.name === target.symbol || spelling[1].toLowerCase() !== expected[1].toLowerCase()
      || globals.length > 1 || globals.some(name => name !== label.name)) fail('extra or nonprimary original entry');
  const bytes = Buffer.alloc(parsed.length * 4); parsed.forEach((word, i) => bytes.writeUInt32BE(word, i * 4));
  if (!bytes.equals(original) || !require('../word_asm').assembleWordAsmText(source).bytes.equals(original)) fail('original entry word census');
  const sameAddressName = name => { const match = address(name); return match && match[1].toLowerCase() === expected[1].toLowerCase(); };
  const interiorNames = interiors.map(entry => ({ ...entry, rom: row.romStart + entry.offset }));
  const phase8 = diagnosticContext.producerModel(session.context);
  if (interiorNames.length) {
    if (!Array.isArray(phase8.model?.rows) || !Array.isArray(phase8.targets) || !Array.isArray(phase8.compilationGroups)
        || !phase8.linkSymbols || typeof phase8.linkSymbols !== 'object' || Array.isArray(phase8.linkSymbols)
        || !Array.isArray(phase8.linkageConfig?.symbols) || !Array.isArray(phase8.linkageConfig?.targets)) fail('interior entry canonical views required');
    if (Object.keys(phase8.linkSymbols).some(name => interiorIdentity(interiorNames, name))) fail('interior entry fixed binding collision');
    for (const producer of phase8.targets) rejectInteriorNames(interiorNames, producerNameClaims(producer), 'producer');
    for (const group of phase8.compilationGroups) rejectInteriorNames(interiorNames, groupNameClaims(group), 'group');
    rejectInteriorNames(interiorNames, phase8.linkageConfig.symbols.map(record => record.name), 'linkage');
    for (const contract of phase8.linkageConfig.targets) rejectInteriorNames(interiorNames, producerNameClaims(contract), 'linkage');
  }
  for (const other of phase8.model.rows) {
    if (other === row) continue;
    if (other.romStart === row.romStart || sameAddressName(other.part?.name)) fail('original entry owner collision');
    if (interiorNames.length && (interiorIdentity(interiorNames, other.part?.name)
        || other.romStart < row.romEndExclusive && other.romEndExclusive > row.romStart)) fail('interior entry owner collision');
    if (!other.part) continue;
    // Read only the accepted model's source census, using this invocation's
    // selected-input reader. Never discover files or trust another overlay's RAM.
    const buffer = fs.readFileSync(inputs.resolve(selected, path.join(p7.ROOT, other.part.file)));
    if (buffer.length !== other.part.textBytes || p7.sha256Buffer(buffer) !== other.part.sha256) fail('original entry collision source drift');
    const code = originalEntryCode(buffer.toString());
    // Conservatively reject any un-commented occurrence, including aliases or
    // comma-separated globals. The fallback does not interpret other owners'
    // assembler expressions to distinguish a definition from a reference.
    const names = code.match(/[A-Za-z_.$][A-Za-z0-9_.$]*/g) || [];
    if (names.some(name => sameAddressName(name) || interiorIdentity(interiorNames, name))) fail('original entry source collision or reference');
  }
  // A private candidate may have no active C replacement yet; actual candidate
  // FUNC census is separate. Canonical acceptance still requires sole custody.
  let intendedProviders = 0;
  for (const producer of phase8.targets) {
    const intended = producer.symbol === target.symbol && producer.romStartNumber === row.romStart && producer.romEndNumber === row.romEndExclusive;
    if (intended && ++intendedProviders > 1) fail('original entry duplicate provider');
    if (sameAddressName(producer.symbol) && !intended
        || (producer.compilerTextFunctions || []).some(fn => sameAddressName(fn.symbol) && (!intended || fn.symbol !== target.symbol))) fail('original entry producer collision');
  }
  for (const group of phase8.compilationGroups || []) {
    if ((group.fixedBindings || []).some(binding => sameAddressName(binding.symbol))) fail('original entry group collision');
  }
  return interiorNames;
}


function originalOwner(session, target, bodyBytes) {
  const model = diagnosticContext.producerModel(session.context).model;
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
  const unscopedAddressBindings = addressHints(diagnosticContext.producerModel(session.context).linkSymbols || {}, slice);
  for (const producer of diagnosticContext.producerModel(session.context).targets.filter(t => t.romStartNumber < row.romEndExclusive && t.romEndNumber > row.romStart)) {
    if (producer.symbol !== target.symbol || producer.compilationGroup || producer.atomicText || producer.nativeTextTail
        || producer.auxiliaryProjection || producer.retainedLiteralReferences || producer.multiOwnerContract
        || producer.physicalInterface || producer.auxiliarySections?.length || producer.compilerTextFunctions?.length > 1) fail('unsupported producer');
  }
  const selected = inputs.context(session.context);
  const source = fs.readFileSync(inputs.resolve(selected, path.join(p7.ROOT, row.part.file)));
  if (p7.sha256Buffer(source) !== row.part.sha256) fail('original assembly identity drift');
  const exactEntry = text.same(active.assemblySymbolNames(source.toString()), [target.symbol]);
  const words = [...source.toString().matchAll(/\.word\s+(0x[0-9a-f]+)/ig)].map(m => Number(m[1]));
  if (words.length * 4 !== row.bytes) fail('complete original word census');
  const original = Buffer.alloc(row.bytes); words.forEach((w, i) => original.writeUInt32BE(w >>> 0, i * 4));
  const rom = fs.readFileSync(inputs.resolve(selected, session.context.baserom.path));
  p7.verifyRom(model, rom);
  if (!original.equals(rom.subarray(row.romStart, row.romEndExclusive))) fail('original full owner differs from ROM');
  const interiorNames = exactEntry ? [] : originalEntryFallback(session, target, row, source.toString(), original, selected, bodyBytes);
  terminalSuffix(original, bodyBytes);
  const config = p7.readJson(path.join(p7.ROOT, CONFIGS[1]), selected);
  if (!diagnosticContext.isDiagnosticContext(session.context)) logical.loadRegistry(model, rom, config);
  const overlaps = value => value.romStart < row.romEndExclusive && value.romEndExclusive > row.romStart;
  if (config.bodies.some(overlaps) || config.padding.some(overlaps) || config.unavailableBodies.some(overlaps)
      || config.preservedProductionEnvelopes.some(e => e.fragments.some(overlaps))) fail('existing logical coverage requires separate handling');
  if (interiorNames.length) rejectInteriorNames(interiorNames, registryNameClaims(config), 'logical registry');
  coverage(original.subarray(0, bodyBytes), slice.vramStart, [], row.bytes);
  return { row, original, bodyBytes, tailBytes, unscopedAddressBindings, interiorNames };
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
  const assignedElf = p7.parseElfFile(path.join(artifactDir, 'candidate.o'));
  const assigned = census(assignedElf, target.sectionName, target.symbol, true);
  const owner = originalOwner(session, target, assigned.fn.size);
  if (owner.interiorNames.length) rejectInteriorObjectClaims(owner.interiorNames, assignedElf, p8.rawRelocationRecords(assignedElf));
  const relocations = p8.relocationRecords(assignedElf, { symbol: target.symbol, bytes: assigned.fn.size, sectionName: target.sectionName });
  if (relocations.some(r => !['R_MIPS_26', 'R_MIPS_HI16', 'R_MIPS_LO16'].includes(r.type)
      || Number(r.offset) % 4 || Number(r.offset) < 0 || Number(r.offset) + 4 > assigned.fn.size)) fail('unsupported actual relocation');
  const comparison = compareMips(owner.original.subarray(0, assigned.fn.size), assigned.bytes, {
    start: owner.row.slices[0].vramStart, actualRelocations: relocations, expectedRelocationsAvailable: false,
  });
  if (!comparison.relocationMaskedExact) fail('ordinary body mismatch');
  const localJumps = coverage(assigned.bytes, owner.row.slices[0].vramStart, relocations, owner.row.bytes,
    { buffer: assignedElf.buffer, sectionName: target.sectionName, symbol: target.symbol, original: owner.original, assigned: true });
  const assemblyFile = path.join(artifactDir, 'candidate.compiler.s');
  const assembly = fs.readFileSync(assemblyFile);
  // Validate production grammar, but assemble the unmodified compiler bytes.
  p8.adjustSectionAssembly(assembly, target.sectionName, {});
  // Each observation has its own artifact; never overwrite an older diagnostic.
  const nativeFile = path.join(artifactDir, 'tn-' + require('crypto').randomBytes(6).toString('hex') + '.o');
  p7.run(session.runtime.tools['mips-kmc-elf-as.exe'].path,
    [...diagnosticContext.producerModel(session.context).model.config.binutils.compilerAssemblerFlags, '-o', nativeFile, assemblyFile], { cwd: artifactDir });
  const elf = p7.parseElfFile(nativeFile), native = census(elf, '.text', target.symbol);
  const nativeRelocations = p8.relocationRecords(elf, { symbol: target.symbol, bytes: assigned.fn.size, sectionName: '.text' });
  const allNativeRelocations = p8.rawRelocationRecords(elf);
  if (owner.interiorNames.length) rejectInteriorObjectClaims(owner.interiorNames, elf, allNativeRelocations);
  if (allNativeRelocations.some(r => r.section !== '.rel.text')) fail('unsupported nontext relocation');
  if (native.fn.size !== assigned.fn.size || !native.bytes.subarray(0, native.fn.size).equals(assigned.bytes)
      || !text.same(nativeRelocations, relocations)) fail('native/assigned body or REL disagreement');
  const nativeLocalJumps = coverage(native.bytes.subarray(0, native.fn.size), owner.row.slices[0].vramStart, nativeRelocations, owner.row.bytes,
    { buffer: elf.buffer, sectionName: '.text', symbol: target.symbol, original: owner.original, assigned: false });
  if (!text.same(nativeLocalJumps, localJumps)) fail('native/assigned local jump disagreement');
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
  // Zero-native-tail defined references were individually checked above; only
  // the independently reproved own-section J records can satisfy that census.
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

module.exports = { rejectInteriorObjectClaims, terminalSuffix, addressHints, coverage, census, originalOwner, descriptor, inspect, diagnose, compose, writeBatch, admit };
