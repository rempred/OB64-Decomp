'use strict';

const { disasmWord } = require('../mips');

const FIXED_REGISTERS = new Set([0, 28, 29, 31]);
const MEMORY_WIDTH = new Map([
  [0x20, { width: 1, signed: true, load: true }],
  [0x21, { width: 2, signed: true, load: true }],
  [0x23, { width: 4, signed: true, load: true }],
  [0x24, { width: 1, signed: false, load: true }],
  [0x25, { width: 2, signed: false, load: true }],
  [0x27, { width: 4, signed: false, load: true }],
  [0x28, { width: 1, signed: null, load: false }],
  [0x29, { width: 2, signed: null, load: false }],
  [0x2B, { width: 4, signed: null, load: false }],
  [0x31, { width: 4, signed: null, load: true, float: true }],
  [0x35, { width: 8, signed: null, load: true, float: true }],
  [0x39, { width: 4, signed: null, load: false, float: true }],
  [0x3D, { width: 8, signed: null, load: false, float: true }],
]);
const KNOWN_RELOCATION_TYPES = new Set([
  'R_MIPS_NONE', 'R_MIPS_16', 'R_MIPS_32', 'R_MIPS_REL32', 'R_MIPS_26',
  'R_MIPS_HI16', 'R_MIPS_LO16', 'R_MIPS_GPREL16', 'R_MIPS_LITERAL',
  'R_MIPS_GOT16', 'R_MIPS_PC16', 'R_MIPS_CALL16', 'R_MIPS_GPREL32',
]);
const EVIDENCE_SAMPLE_LIMIT = 6;

function sign16(value) {
  return value & 0x8000 ? value - 0x10000 : value;
}

function wordsFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length % 4 !== 0) throw new Error('MIPS text must be an aligned byte buffer');
  const words = [];
  for (let offset = 0; offset < buffer.length; offset += 4) words.push(buffer.readUInt32BE(offset));
  return words;
}

function bufferFromWords(words) {
  const buffer = Buffer.alloc(words.length * 4);
  words.forEach((word, index) => buffer.writeUInt32BE(word >>> 0, index * 4));
  return buffer;
}

function branchTarget(pc, word) {
  return (pc + 4 + (sign16(word & 0xFFFF) << 2)) >>> 0;
}

function jumpTarget(pc, word) {
  return ((((word & 0x03FFFFFF) << 2) >>> 0) | ((pc + 4) & 0xF0000000)) >>> 0;
}

function instructionInfo(word, pc) {
  const op = word >>> 26;
  const rs = (word >>> 21) & 0x1F;
  const rt = (word >>> 16) & 0x1F;
  const rd = (word >>> 11) & 0x1F;
  const sa = (word >>> 6) & 0x1F;
  const funct = word & 0x3F;
  const immediate = word & 0xFFFF;
  let control = null;
  let target = null;
  let conditional = false;
  let call = false;
  let indirect = false;
  if (op === 0x02 || op === 0x03) {
    control = 'jump';
    target = jumpTarget(pc, word);
    call = op === 0x03;
  } else if (op === 0x01 || (op >= 0x04 && op <= 0x07) || (op >= 0x14 && op <= 0x17)) {
    control = 'branch';
    target = branchTarget(pc, word);
    conditional = true;
    call = op === 0x01 && [0x10, 0x11, 0x12, 0x13].includes(rt);
  } else if (op === 0x00 && (funct === 0x08 || funct === 0x09)) {
    control = 'jump-register';
    call = funct === 0x09;
    indirect = true;
  } else if (op === 0x11 && rs === 0x08) {
    control = 'branch';
    target = branchTarget(pc, word);
    conditional = true;
  }
  return {
    word: word >>> 0,
    pc: pc >>> 0,
    op,
    rs,
    rt,
    rd,
    sa,
    funct,
    immediate,
    signedImmediate: sign16(immediate),
    control,
    target,
    conditional,
    call,
    indirect,
    returnInstruction: op === 0 && funct === 0x08 && rs === 31,
    memory: MEMORY_WIDTH.get(op) || null,
    text: disasmWord(word, pc),
  };
}

function registerFields(info) {
  const { op, funct } = info;
  if (op === 0x00) {
    if ([0x00, 0x02, 0x03, 0x38, 0x3A, 0x3B, 0x3C, 0x3E, 0x3F].includes(funct)) return ['rt', 'rd'];
    if ([0x08].includes(funct)) return ['rs'];
    if ([0x09].includes(funct)) return ['rs', 'rd'];
    if ([0x10, 0x12].includes(funct)) return ['rd'];
    if ([0x11, 0x13].includes(funct)) return ['rs'];
    return ['rs', 'rt', 'rd'];
  }
  if (op === 0x02 || op === 0x03) return [];
  if (op === 0x01 || (op >= 0x04 && op <= 0x07) || (op >= 0x14 && op <= 0x17)) return op === 0x04 || op === 0x05 || op === 0x14 || op === 0x15 ? ['rs', 'rt'] : ['rs'];
  if (op === 0x0F) return ['rt'];
  if (op === 0x10 || op === 0x11) return ['rt', 'rd'];
  if (op >= 0x20) return ['rs', 'rt'];
  return ['rs', 'rt'];
}

function registerUsage(info) {
  const reads = new Set();
  const writes = new Set();
  const addRead = (value) => { if (value !== 0) reads.add(value); };
  const addWrite = (value) => { if (value !== 0) writes.add(value); };
  if (info.op === 0x00) {
    if ([0x00, 0x02, 0x03, 0x38, 0x3A, 0x3B, 0x3C, 0x3E, 0x3F].includes(info.funct)) {
      addRead(info.rt); addWrite(info.rd);
    } else if ([0x08].includes(info.funct)) addRead(info.rs);
    else if ([0x09].includes(info.funct)) { addRead(info.rs); addWrite(info.rd); }
    else if ([0x10, 0x12].includes(info.funct)) addWrite(info.rd);
    else if ([0x11, 0x13].includes(info.funct)) addRead(info.rs);
    else { addRead(info.rs); addRead(info.rt); addWrite(info.rd); }
  } else if (info.op === 0x02) {
    // No GPR operand.
  } else if (info.op === 0x03) addWrite(31);
  else if (info.op === 0x01 || (info.op >= 0x04 && info.op <= 0x07) || (info.op >= 0x14 && info.op <= 0x17)) {
    addRead(info.rs);
    if ([0x04, 0x05, 0x14, 0x15].includes(info.op)) addRead(info.rt);
    if (info.call) addWrite(31);
  } else if (info.op === 0x0F) addWrite(info.rt);
  else if (info.op === 0x10 || info.op === 0x11) {
    if ([0x00, 0x01, 0x02].includes(info.rs)) addWrite(info.rt);
    else if ([0x04, 0x05, 0x06].includes(info.rs)) addRead(info.rt);
    else if (info.rs === 0x08) { /* floating-point condition branch */ }
  } else if (info.memory) {
    addRead(info.rs);
    if (info.memory.load) addWrite(info.rt); else addRead(info.rt);
  } else {
    addRead(info.rs);
    addWrite(info.rt);
  }
  return { reads: [...reads].sort((a, b) => a - b), writes: [...writes].sort((a, b) => a - b) };
}

function opcodeKey(info) {
  if (info.op === 0) return `S:${info.funct.toString(16)}:${info.sa}`;
  if (info.op === 1) return `R:${info.rt.toString(16)}`;
  if (info.op === 0x10 || info.op === 0x11) return `C:${info.op.toString(16)}:${info.rs.toString(16)}:${info.funct.toString(16)}`;
  return `O:${info.op.toString(16)}`;
}

function normalizedInstruction(info, state, options = {}) {
  function reg(number) {
    if (FIXED_REGISTERS.has(number)) return `r${number}`;
    if (!state.registers.has(number)) state.registers.set(number, `v${state.registers.size}`);
    return state.registers.get(number);
  }
  const fields = registerFields(info).map((field) => `${field}=${reg(info[field])}`).join(',');
  let operand = '';
  if (info.control && info.target !== null) {
    const internal = info.target >= options.start && info.target < options.end;
    operand = internal ? `target=${(info.target - options.start) >>> 0}` : `target=${options.ignoreExternalTargets ? 'external' : info.target}`;
  } else if (info.op !== 0 && info.op !== 0x02 && info.op !== 0x03 && info.op !== 0x10 && info.op !== 0x11) {
    operand = `imm=${options.ignoreImmediates ? '*' : info.signedImmediate}`;
  }
  return `${opcodeKey(info)}|${fields}|${operand}`;
}

function cfgForWords(words, start) {
  const end = start + words.length * 4;
  const infos = words.map((word, index) => instructionInfo(word, start + index * 4));
  const leaders = new Set([0]);
  infos.forEach((info, index) => {
    if (!info.control) return;
    if (info.target !== null && info.target >= start && info.target < end && (info.target - start) % 4 === 0) {
      leaders.add((info.target - start) / 4);
    }
    if (index + 2 < infos.length) leaders.add(index + 2);
  });
  const ordered = [...leaders].sort((left, right) => left - right);
  const blockForIndex = new Map();
  const blocks = ordered.map((leader, ordinal) => {
    const endIndex = ordinal + 1 < ordered.length ? ordered[ordinal + 1] : infos.length;
    const block = { ordinal, startIndex: leader, endIndex, words: infos.slice(leader, endIndex), edges: [] };
    for (let index = leader; index < endIndex; index += 1) blockForIndex.set(index, ordinal);
    return block;
  });
  for (const block of blocks) {
    let terminalIndex = -1;
    for (let index = block.endIndex - 1; index >= block.startIndex; index -= 1) {
      if (infos[index].control) {
        terminalIndex = index;
        break;
      }
    }
    if (terminalIndex < 0) {
      if (block.ordinal + 1 < blocks.length) block.edges.push({ kind: 'fallthrough', to: block.ordinal + 1 });
      continue;
    }
    const terminal = infos[terminalIndex];
    if (terminal.target !== null && terminal.target >= start && terminal.target < end) {
      const targetIndex = (terminal.target - start) / 4;
      block.edges.push({ kind: terminal.call ? 'call-internal' : 'taken', to: blockForIndex.get(targetIndex) });
    } else if (terminal.call) {
      block.edges.push({ kind: 'call-external', to: null });
    } else if (terminal.control === 'jump' || terminal.control === 'jump-register') {
      block.edges.push({ kind: terminal.returnInstruction ? 'return' : 'exit', to: null });
    }
    if (terminal.conditional || terminal.call) {
      const fallthroughIndex = terminalIndex + 2;
      if (fallthroughIndex < infos.length) block.edges.push({ kind: 'fallthrough', to: blockForIndex.get(fallthroughIndex) });
      else block.edges.push({ kind: 'fallthrough-exit', to: null });
    }
  }
  return { infos, blocks };
}

function cfgSignature(cfg) {
  return cfg.blocks.map((block) => ({
    words: block.endIndex - block.startIndex,
    edges: block.edges.map((edge) => `${edge.kind}:${edge.to === null || edge.to === undefined ? 'x' : edge.to}`).sort(),
  }));
}

function registerNormalizedRepresentation(buffer, start, options = {}) {
  const words = wordsFromBuffer(buffer);
  const state = { registers: new Map() };
  return words.map((word, index) => normalizedInstruction(instructionInfo(word, start + index * 4), state, {
    start,
    end: start + buffer.length,
    ignoreImmediates: options.ignoreImmediates === true,
    ignoreExternalTargets: options.ignoreExternalTargets === true,
  })).join('\n');
}

function structuralRepresentation(buffer, start) {
  const words = wordsFromBuffer(buffer);
  const cfg = cfgForWords(words, start);
  return JSON.stringify({
    cfg: cfgSignature(cfg),
    blocks: cfg.blocks.map((block) => block.words.map((info) => opcodeKey(info))),
  });
}

function relocationNormalizedRepresentation(buffer, start) {
  const words = wordsFromBuffer(buffer);
  const end = start + buffer.length;
  return words.map((word, index) => {
    const info = instructionInfo(word, start + index * 4);
    if ((info.op === 0x02 || info.op === 0x03) && (info.target < start || info.target >= end)) {
      return (word & 0xFC000000).toString(16).padStart(8, '0');
    }
    return word.toString(16).padStart(8, '0');
  }).join('');
}

function frameFacts(infos) {
  let frameSize = null;
  const stackOffsets = [];
  for (const info of infos) {
    if (info.op === 0x09 && info.rs === 29 && info.rt === 29 && info.signedImmediate < 0 && frameSize === null) frameSize = -info.signedImmediate;
    if (info.memory && info.rs === 29) stackOffsets.push({ offset: info.signedImmediate, width: info.memory.width, load: info.memory.load });
  }
  return { frameSize, stackOffsets };
}

function relocationMask(type) {
  if (type === 'R_MIPS_26') return 0xFC000000;
  if (type === 'R_MIPS_HI16' || type === 'R_MIPS_LO16') return 0xFFFF0000;
  return null;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function normalizedNumber(value, { allowNegative = false } = {}) {
  let number = null;
  if (Number.isSafeInteger(value)) number = value;
  else if (typeof value === 'string') {
    const text = value.trim();
    if (/^-?0x[0-9a-f]+$/i.test(text)) {
      const negative = text.startsWith('-');
      number = Number.parseInt(negative ? text.slice(3) : text.slice(2), 16);
      if (negative) number = -number;
    } else if (/^-?[0-9]+$/.test(text)) number = Number.parseInt(text, 10);
  }
  if (!Number.isSafeInteger(number) || (!allowNegative && number < 0)) return null;
  const magnitude = Math.abs(number).toString(16).toUpperCase().padStart(8, '0');
  return { number, text: `${number < 0 ? '-' : ''}0x${magnitude}` };
}

function normalizeRelocationRecord(source, index) {
  const issues = [];
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return { index, complete: false, issues: ['record-is-not-an-object'], record: null, offsetNumber: null };
  }
  const offset = normalizedNumber(source.offset);
  if (!offset || offset.number % 4 !== 0) issues.push('offset-is-not-an-aligned-nonnegative-integer');
  for (const field of ['type', 'symbol', 'section']) {
    if (typeof source[field] !== 'string' || source[field].length === 0) issues.push(`${field}-is-missing`);
  }
  const hasAddend = Object.prototype.hasOwnProperty.call(source, 'addend');
  const addend = hasAddend ? normalizedNumber(source.addend, { allowNegative: true }) : null;
  if (hasAddend && !addend) issues.push('addend-is-not-an-integer');
  const record = {
    offset: offset ? offset.text : String(source.offset),
    type: typeof source.type === 'string' ? source.type : String(source.type),
    symbol: typeof source.symbol === 'string' ? source.symbol : String(source.symbol),
    section: typeof source.section === 'string' ? source.section : String(source.section),
    ...(hasAddend ? { addend: addend ? addend.text : String(source.addend) } : {}),
  };
  return { index, complete: issues.length === 0, issues, record, offsetNumber: offset?.number ?? null };
}

function normalizeRelocationSet(records, available, unavailableReason) {
  if (!available) {
    return {
      evidence: {
        available: false,
        count: null,
        complete: false,
        records: [],
        unavailableReason: unavailableReason || 'not supplied',
      },
      entries: [],
    };
  }
  if (!Array.isArray(records)) {
    return {
      evidence: {
        available: true,
        count: null,
        complete: false,
        records: [],
        invalidRecords: [{ index: null, issues: ['records-are-not-an-array'] }],
      },
      entries: [],
    };
  }
  const entries = records.map(normalizeRelocationRecord);
  const ordered = entries.filter((entry) => entry.record).sort((left, right) => (
    (left.offsetNumber ?? Number.MAX_SAFE_INTEGER) - (right.offsetNumber ?? Number.MAX_SAFE_INTEGER)
      || left.record.type.localeCompare(right.record.type)
      || left.record.symbol.localeCompare(right.record.symbol)
      || left.record.section.localeCompare(right.record.section)
      || String(left.record.addend ?? '').localeCompare(String(right.record.addend ?? ''))
  ));
  const invalid = entries.filter((entry) => !entry.complete).map((entry) => ({
    index: entry.index,
    issues: entry.issues,
  }));
  const kinds = [...new Set(ordered.map((entry) => entry.record.type))].sort();
  return {
    evidence: {
      available: true,
      count: records.length,
      complete: invalid.length === 0,
      records: ordered.map((entry) => entry.record),
      invalidRecords: invalid.slice(0, EVIDENCE_SAMPLE_LIMIT),
      invalidRecordsOmitted: Math.max(0, invalid.length - EVIDENCE_SAMPLE_LIMIT),
      unknownKinds: kinds.filter((kind) => !KNOWN_RELOCATION_TYPES.has(kind)),
      unmaskableKnownKinds: kinds.filter((kind) => KNOWN_RELOCATION_TYPES.has(kind) && relocationMask(kind) === null),
    },
    entries: ordered,
  };
}

function recordMultisetDifference(left, right) {
  const counts = new Map();
  for (const record of right) {
    const key = JSON.stringify(record);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const difference = [];
  for (const record of left) {
    const key = JSON.stringify(record);
    const remaining = counts.get(key) || 0;
    if (remaining > 0) counts.set(key, remaining - 1);
    else difference.push(record);
  }
  return difference;
}

function relocationMismatchEvidence(expectedRecords, actualRecords) {
  const expectedOnly = recordMultisetDifference(expectedRecords, actualRecords);
  const actualOnly = recordMultisetDifference(actualRecords, expectedRecords);
  const actualBySlot = new Map();
  for (const record of actualRecords) {
    const key = `${record.offset}|${record.type}|${record.section}`;
    if (!actualBySlot.has(key)) actualBySlot.set(key, []);
    actualBySlot.get(key).push(record);
  }
  const identityMismatches = [];
  for (const expected of expectedRecords) {
    const key = `${expected.offset}|${expected.type}|${expected.section}`;
    const candidates = actualBySlot.get(key) || [];
    const actual = candidates.find((candidate) => candidate.symbol !== expected.symbol
      || (candidate.addend ?? null) !== (expected.addend ?? null));
    if (actual) identityMismatches.push({
      offset: expected.offset,
      type: expected.type,
      section: expected.section,
      expectedSymbol: expected.symbol,
      actualSymbol: actual.symbol,
      expectedAddend: expected.addend ?? null,
      actualAddend: actual.addend ?? null,
    });
  }
  return {
    expectedOnlyCount: expectedOnly.length,
    actualOnlyCount: actualOnly.length,
    identityMismatchCount: identityMismatches.length,
    expectedOnlySamples: expectedOnly.slice(0, EVIDENCE_SAMPLE_LIMIT),
    actualOnlySamples: actualOnly.slice(0, EVIDENCE_SAMPLE_LIMIT),
    identityMismatchSamples: identityMismatches.slice(0, EVIDENCE_SAMPLE_LIMIT),
  };
}

function relocationComparison(options, wordCount) {
  const has = (name) => Object.prototype.hasOwnProperty.call(options, name);
  const actualRecords = has('actualRelocations') ? options.actualRelocations : options.relocations;
  const actualAvailable = options.actualRelocationsAvailable === false
    ? false
    : has('actualRelocations') || has('relocations') || options.actualRelocationsAvailable === true;
  const expectedAvailable = options.expectedRelocationsAvailable === false
    ? false
    : has('expectedRelocations') || options.expectedRelocationsAvailable === true;
  const expected = normalizeRelocationSet(
    options.expectedRelocations,
    expectedAvailable,
    options.expectedRelocationsUnavailableReason,
  );
  const actual = normalizeRelocationSet(
    actualRecords,
    actualAvailable,
    options.actualRelocationsUnavailableReason,
  );
  const comparisonAvailable = expected.evidence.available && actual.evidence.available;
  const recordsExact = comparisonAvailable && expected.evidence.complete && actual.evidence.complete
    ? sameJson(expected.evidence.records, actual.evidence.records)
    : null;
  const masks = new Map();
  let appliedRecords = 0;
  let outOfRangeRecords = 0;
  for (const entry of actual.entries) {
    const mask = relocationMask(entry.record.type);
    if (mask === null || !Number.isInteger(entry.offsetNumber) || entry.offsetNumber % 4 !== 0) continue;
    const index = entry.offsetNumber / 4;
    if (index < 0 || index >= wordCount) {
      outOfRangeRecords += 1;
      continue;
    }
    masks.set(index, (masks.get(index) ?? 0xFFFFFFFF) & mask);
    appliedRecords += 1;
  }
  return {
    evidence: {
      expected: expected.evidence,
      actual: actual.evidence,
      comparisonAvailable,
      recordsExact,
      mismatch: comparisonAvailable && recordsExact === false
        ? relocationMismatchEvidence(expected.evidence.records, actual.evidence.records)
        : null,
      mask: {
        supportedActualRecords: actual.entries.filter((entry) => relocationMask(entry.record.type) !== null).length,
        appliedRecords,
        outOfRangeRecords,
        compatible: false,
      },
      addendIdentity: (() => {
        const expectedMaskBearing = expected.entries.filter((entry) => relocationMask(entry.record.type) !== null);
        const actualMaskBearing = actual.entries.filter((entry) => relocationMask(entry.record.type) !== null);
        const expectedExplicit = expectedMaskBearing.filter((entry) => (
          Object.prototype.hasOwnProperty.call(entry.record, 'addend')
        )).length;
        const actualExplicit = actualMaskBearing.filter((entry) => (
          Object.prototype.hasOwnProperty.call(entry.record, 'addend')
        )).length;
        return {
          expectedMaskBearingRecords: expectedMaskBearing.length,
          actualMaskBearingRecords: actualMaskBearing.length,
          expectedExplicitAddends: expectedExplicit,
          actualExplicitAddends: actualExplicit,
          proven: recordsExact === true
            && expectedMaskBearing.length > 0
            && expectedExplicit === expectedMaskBearing.length
            && actualExplicit === actualMaskBearing.length,
        };
      })(),
    },
    masks,
  };
}

function byteDifferenceCount(expected, actual) {
  let count = Math.abs(expected.length - actual.length);
  for (let index = 0; index < Math.min(expected.length, actual.length); index += 1) {
    if (expected[index] !== actual[index]) count += 1;
  }
  return count;
}

function sameRegisterFields(left, right) {
  const fields = [...new Set([...registerFields(left), ...registerFields(right)])];
  return fields.every((field) => left[field] === right[field]);
}

function branchPolarityPair(left, right) {
  if (left.control !== 'branch' || right.control !== 'branch' || left.target !== right.target) return false;
  const opPairs = new Set(['4:5', '5:4', '6:7', '7:6', '20:21', '21:20', '22:23', '23:22']);
  if (opPairs.has(`${left.op}:${right.op}`)) return sameRegisterFields(left, right);
  if (left.op === 0x01 && right.op === 0x01) {
    const rtPairs = new Set(['0:1', '1:0', '2:3', '3:2', '16:17', '17:16', '18:19', '19:18']);
    return left.rs === right.rs && rtPairs.has(`${left.rt}:${right.rt}`);
  }
  if (left.op === 0x11 && right.op === 0x11 && left.rs === 0x08 && right.rs === 0x08) {
    return (left.rt ^ right.rt) === 1;
  }
  return false;
}

function entryShapeFacts(cfg, start, bytes) {
  const delaySlots = new Set();
  cfg.infos.forEach((info, index) => { if (info.control && index + 1 < cfg.infos.length) delaySlots.add(index + 1); });
  const delaySlotTargets = new Set();
  const internalCallTargets = new Set();
  for (const info of cfg.infos) {
    if (info.target === null || info.target < start || info.target >= start + bytes || (info.target - start) % 4 !== 0) continue;
    const index = (info.target - start) / 4;
    if (delaySlots.has(index)) delaySlotTargets.add(index);
    if (info.call && index !== 0) internalCallTargets.add(index);
  }
  return {
    delaySlotTargetCount: delaySlotTargets.size,
    delaySlotTargetOffsets: [...delaySlotTargets].slice(0, EVIDENCE_SAMPLE_LIMIT).map((index) => index * 4),
    internalCallTargetCount: internalCallTargets.size,
    internalCallTargetOffsets: [...internalCallTargets].slice(0, EVIDENCE_SAMPLE_LIMIT).map((index) => index * 4),
  };
}

function mismatchLabel(category, likelihood, interpretation, evidence, searchFamilies, avoidUntilResolved) {
  return { category, likelihood, interpretation, evidence, searchFamilies, avoidUntilResolved };
}

function byteSimilarity(expected, actual) {
  const length = Math.max(expected.length, actual.length);
  if (length === 0) return 1;
  let equal = 0;
  for (let index = 0; index < Math.min(expected.length, actual.length); index += 1) if (expected[index] === actual[index]) equal += 1;
  return equal / length;
}

function compareMips(expected, actual, options = {}) {
  const start = options.start >>> 0;
  const exactBytes = expected.equals(actual);
  const expectedWords = wordsFromBuffer(expected);
  const actualWords = wordsFromBuffer(actual);
  const sameLength = expectedWords.length === actualWords.length;
  const expectedCfg = cfgForWords(expectedWords, start);
  const actualCfg = cfgForWords(actualWords, start);
  const cfgExact = sameLength && sameJson(cfgSignature(expectedCfg), cfgSignature(actualCfg));
  const aligned = Math.min(expectedWords.length, actualWords.length);
  let opcodeMatches = 0;
  let opcodeDifferences = 0;
  let registerFieldDifferences = 0;
  let immediateFieldDifferences = 0;
  let branchPolarityDifferences = 0;
  let controlFlowDifferences = 0;
  let memoryWidthOrSignednessDifferences = 0;
  let stackOffsetDifferences = 0;
  let differingAlignedInstructions = 0;
  const differenceSamples = [];
  let firstDifference = null;
  for (let index = 0; index < aligned; index += 1) {
    const expectedInfo = expectedCfg.infos[index];
    const actualInfo = actualCfg.infos[index];
    const opcodeExact = opcodeKey(expectedInfo) === opcodeKey(actualInfo);
    if (opcodeExact) opcodeMatches += 1;
    else opcodeDifferences += 1;
    if (expectedWords[index] !== actualWords[index]) {
      differingAlignedInstructions += 1;
      const inverseBranchPair = branchPolarityPair(expectedInfo, actualInfo);
      if (!sameRegisterFields(expectedInfo, actualInfo) && !inverseBranchPair) registerFieldDifferences += 1;
      if (opcodeExact && !expectedInfo.control && !actualInfo.control
          && expectedInfo.immediate !== actualInfo.immediate) immediateFieldDifferences += 1;
      if (expectedInfo.control || actualInfo.control) controlFlowDifferences += 1;
      if (inverseBranchPair) branchPolarityDifferences += 1;
      if (expectedInfo.memory && actualInfo.memory && (
        expectedInfo.memory.width !== actualInfo.memory.width
          || expectedInfo.memory.signed !== actualInfo.memory.signed
          || expectedInfo.memory.load !== actualInfo.memory.load
      )) memoryWidthOrSignednessDifferences += 1;
      if (expectedInfo.memory && actualInfo.memory && expectedInfo.rs === 29 && actualInfo.rs === 29
          && (expectedInfo.signedImmediate !== actualInfo.signedImmediate
            || expectedInfo.memory.width !== actualInfo.memory.width)) stackOffsetDifferences += 1;
      const sample = {
        index,
        offset: index * 4,
        pc: (start + index * 4) >>> 0,
        expectedWord: `0x${expectedWords[index].toString(16).toUpperCase().padStart(8, '0')}`,
        actualWord: `0x${actualWords[index].toString(16).toUpperCase().padStart(8, '0')}`,
        expected: expectedInfo.text,
        actual: actualInfo.text,
      };
      if (differenceSamples.length < EVIDENCE_SAMPLE_LIMIT) differenceSamples.push(sample);
      if (firstDifference === null) firstDifference = sample;
    }
  }
  if (firstDifference === null && !sameLength) firstDifference = { index: aligned, offset: aligned * 4, reason: 'length' };
  const differingInstructions = differingAlignedInstructions + Math.abs(expectedWords.length - actualWords.length);
  const differingBytes = byteDifferenceCount(expected, actual);
  const relocation = relocationComparison(options, actualWords.length);
  const masked = sameLength ? expectedWords.map((word, index) => {
    const mask = relocation.masks.get(index) ?? 0xFFFFFFFF;
    return [word & mask, actualWords[index] & mask];
  }) : [];
  const relocationMaskedExact = sameLength && masked.every(([left, right]) => left === right);
  const relocationMaskCompatible = !exactBytes && relocation.evidence.mask.appliedRecords > 0
    && relocationMaskedExact;
  relocation.evidence.mask.compatible = relocationMaskCompatible;
  const expectedReg = registerNormalizedRepresentation(expected, start);
  const actualReg = registerNormalizedRepresentation(actual, start);
  const registerNormalizedExact = sameLength && expectedReg === actualReg;
  const blockOpcodeMultisetsEqual = cfgExact && expectedCfg.blocks.every((block, index) => {
    const left = block.words.map(opcodeKey).sort();
    const right = actualCfg.blocks[index].words.map(opcodeKey).sort();
    return sameJson(left, right);
  });
  const blockWordMultisetsEqual = cfgExact && expectedCfg.blocks.every((block, index) => {
    const left = block.words.map((info) => info.word >>> 0).sort((a, b) => a - b);
    const right = actualCfg.blocks[index].words.map((info) => info.word >>> 0).sort((a, b) => a - b);
    return sameJson(left, right);
  });
  const blockOpcodeOrderExact = cfgExact && expectedCfg.blocks.every((block, index) => (
    sameJson(block.words.map(opcodeKey), actualCfg.blocks[index].words.map(opcodeKey))
  ));
  const blockWordOrderExact = cfgExact && expectedCfg.blocks.every((block, index) => (
    sameJson(
      block.words.map((info) => info.word >>> 0),
      actualCfg.blocks[index].words.map((info) => info.word >>> 0),
    )
  ));
  const blockOpcodeReordered = blockOpcodeMultisetsEqual && !blockOpcodeOrderExact;
  const blockWordReordered = blockWordMultisetsEqual && !blockWordOrderExact;
  const expectedFrame = frameFacts(expectedCfg.infos);
  const actualFrame = frameFacts(actualCfg.infos);
  const frameMismatch = expectedFrame.frameSize !== actualFrame.frameSize || !sameJson(expectedFrame.stackOffsets, actualFrame.stackOffsets);
  const expectedEntryShape = entryShapeFacts(expectedCfg, start, expected.length);
  const actualEntryShape = entryShapeFacts(actualCfg, start, actual.length);
  const secondaryEntryOrDelaySlotUncertainty = !exactBytes && (
    expectedEntryShape.delaySlotTargetCount > 0 || actualEntryShape.delaySlotTargetCount > 0
      || expectedEntryShape.internalCallTargetCount > 0 || actualEntryShape.internalCallTargetCount > 0
  );
  const widthOnly = memoryWidthOrSignednessDifferences > 0
    && opcodeDifferences === memoryWidthOrSignednessDifferences
    && differingAlignedInstructions === memoryWidthOrSignednessDifferences;
  let primaryClass = 'mixed-or-unknown';
  let recommendation = 'inspect the first divergent block and reconstruct its C behavior';
  if (exactBytes) {
    primaryClass = 'exact-bytes';
    recommendation = 'run canonical diff and verification before promotion';
  } else if (!sameLength) {
    primaryClass = 'length-mismatch';
    recommendation = 'correct the function shape, boundary assumptions, or emitted prologue/epilogue';
  } else if (relocationMaskCompatible) {
    primaryClass = relocation.evidence.addendIdentity.proven
      ? 'relocation-identity-proven'
      : 'relocation-mask-compatible';
    recommendation = relocation.evidence.addendIdentity.proven
      ? 'reproduce the accepted link and canonical ownership proof; normalized text relocation records and explicit addends are identical'
      : 'resolve and compare relocation symbols, sections, and addends before treating masked operands as exact';
  } else if (!cfgExact || branchPolarityDifferences > 0) {
    primaryClass = 'cfg-mismatch';
    recommendation = 'correct branches, loops, early returns, or block ordering before tuning registers';
  } else if (registerNormalizedExact) {
    primaryClass = 'register-allocation-only';
    recommendation = 'inspect variable lifetimes; a bounded permuter or compiler probe may now be appropriate';
  } else if (blockWordReordered) {
    primaryClass = 'scheduling-or-block-order';
    recommendation = 'inspect statement ordering and scheduler dumps';
  } else if (frameMismatch) {
    primaryClass = 'stack-layout';
    recommendation = 'inspect aggregate locals, declaration lifetimes, and stack offsets';
  } else if (widthOnly) {
    primaryClass = 'load-store-width-or-signedness';
    recommendation = 'inspect declared widths, signedness, field types, casts, and prototypes';
  } else if (opcodeMatches === aligned) {
    primaryClass = 'immediate-or-signedness';
    recommendation = 'inspect constants, signedness, field widths, and relocation operands';
  } else if (blockOpcodeReordered) {
    primaryClass = 'scheduling-or-block-order';
    recommendation = 'inspect statement ordering and scheduler dumps';
  } else {
    primaryClass = 'opcode-or-expression';
    recommendation = 'inspect types and expression form at the first opcode divergence';
  }
  const mismatchCounts = {
    instructions: differingInstructions,
    bytes: differingBytes,
    alignedInstructionDifferences: differingAlignedInstructions,
    expectedOnlyInstructions: Math.max(0, expectedWords.length - actualWords.length),
    actualOnlyInstructions: Math.max(0, actualWords.length - expectedWords.length),
    opcodeDifferences,
    registerFieldDifferences,
    immediateFieldDifferences,
    controlFlowDifferences,
    branchPolarityDifferences,
    memoryWidthOrSignednessDifferences,
    stackOffsetDifferences,
  };
  const labels = [];
  if (exactBytes) labels.push(mismatchLabel(
    'exact', 'high',
    'The two supplied byte buffers are identical; this does not establish canonical linker ownership or full-ROM identity.',
    { bytes: expected.length, instructions: expectedWords.length },
    ['canonical target diff', 'sole-owner verification', 'complete-ROM verification'],
    ['none for scratch-body bytes'],
  ));
  if (!sameLength) labels.push(mismatchLabel(
    'length', 'high',
    'The emitted instruction extents differ; source shape or accepted-boundary context should be resolved before fine-grained compiler tuning.',
    { expectedBytes: expected.length, actualBytes: actual.length, expectedInstructions: expectedWords.length, actualInstructions: actualWords.length },
    ['missing or extra behavior', 'early-return and loop form', 'prologue/epilogue shape', 'accepted boundary review when independently indicated'],
    ['register-allocation permutation', 'instruction scheduling search', 'relocation-only tuning'],
  ));
  if (relocationMaskCompatible) labels.push(mismatchLabel(
    'relocation-mask-compatible', relocation.evidence.addendIdentity.proven ? 'high' : 'moderate',
    relocation.evidence.addendIdentity.proven
      ? 'All raw differences lie in safely maskable relocation operands and complete normalized text relocation records, including explicit addends, are identical; canonical linking is still required.'
      : 'All raw differences lie in safely maskable relocation operands, but symbol/addend identity is unavailable or differs; this is compatibility, not relocation exactness.',
    {
      appliedRecords: relocation.evidence.mask.appliedRecords,
      recordsExact: relocation.evidence.recordsExact,
      addendIdentity: relocation.evidence.addendIdentity,
      mismatch: relocation.evidence.mismatch,
    },
    ['accepted symbol and section spelling', 'relocation-bearing address form', 'canonical link reproduction'],
    ['register-allocation search', 'CFG restructuring', 'claiming exactness from operand masks'],
  ));
  if (relocation.evidence.recordsExact === true
      && (relocation.evidence.expected.count || relocation.evidence.actual.count)) labels.push(mismatchLabel(
    'relocation-records-identical', relocation.evidence.addendIdentity.proven ? 'high' : 'moderate',
    relocation.evidence.addendIdentity.proven
      ? 'Complete normalized offset/type/symbol/section records and explicit addends are identical for the supplied expected and actual text relocation evidence.'
      : 'The supplied normalized relocation records are identical, but one or more mask-bearing REL records omit an explicit addend, so operand identity is not proven.',
    {
      expectedCount: relocation.evidence.expected.count,
      actualCount: relocation.evidence.actual.count,
      addendIdentity: relocation.evidence.addendIdentity,
    },
    ['explicit or independently reconstructed addend evidence', 'canonical linked-byte verification'],
    ['changing relocation symbols or addends without new evidence'],
  ));
  if (relocation.evidence.recordsExact === false) labels.push(mismatchLabel(
    'relocation-record-mismatch', 'high',
    'Complete expected and actual relocation evidence differs; operand-mask compatibility cannot establish symbol or addend identity.',
    relocation.evidence.mismatch,
    ['symbol identity', 'section identity', 'addend construction', 'accepted relocation contract'],
    ['claiming relocation-only exactness', 'allocator tuning before relocation identity'],
  ));
  if (!cfgExact && !exactBytes) labels.push(mismatchLabel(
    'cfg-shape', 'moderate',
    'The bounded CFG signatures differ; this is consistent with branch, loop, early-return, or block-shape differences but does not establish semantic inequivalence.',
    { expectedBlocks: expectedCfg.blocks.length, actualBlocks: actualCfg.blocks.length, controlFlowDifferences },
    ['branch inversion', 'early return versus nested if', 'goto versus structured flow', 'loop form', 'branch-likely shape'],
    ['register allocation', 'scheduler-only tuning', 'arbitrary function-boundary changes'],
  ));
  if (branchPolarityDifferences > 0) labels.push(mismatchLabel(
    'branch-polarity', 'moderate',
    'Aligned inverse branch forms with matching targets and register operands were observed; source condition polarity is a likely search family, not a semantic proof.',
    { differingPairs: branchPolarityDifferences, samples: differenceSamples.filter((sample) => {
      const index = sample.index;
      return index < aligned && branchPolarityPair(expectedCfg.infos[index], actualCfg.infos[index]);
    }).slice(0, EVIDENCE_SAMPLE_LIMIT) },
    ['inverted condition', 'early return versus fallthrough', 'branch-likely spelling'],
    ['register permutation', 'stack padding', 'function merging'],
  ));
  if (secondaryEntryOrDelaySlotUncertainty) labels.push(mismatchLabel(
    'secondary-entry-or-delay-slot-uncertainty', 'low',
    'Internal call targets or control-flow targets at delay-slot positions are present. This heuristic requests structural inspection and does not assert a secondary entry, shared tail, or merged function.',
    { expected: expectedEntryShape, actual: actualEntryShape },
    ['accepted entry/boundary evidence', 'delay-slot predecessor and incoming edges', 'internal-call target inspection'],
    ['automatic function merging', 'TU claims from adjacency', 'source permutation before structural review'],
  ));
  if (!exactBytes && (registerNormalizedExact || registerFieldDifferences > 0)) labels.push(mismatchLabel(
    'register-allocation', registerNormalizedExact ? 'high' : 'low',
    registerNormalizedExact
      ? 'Register-renamed instruction representations are identical; variable lifetime and allocation are the likely remaining source-level search family.'
      : 'Some aligned instructions use different register fields, but other mismatches remain and can be the cause; allocator tuning is premature.',
    { registerNormalizedExact, registerFieldDifferences },
    ['temporary lifetime and scope', 'declaration and evaluation order', 'temporary reuse versus separation', 'saved-register pressure'],
    registerNormalizedExact ? ['unbounded random permutation', 'fixed-register binding as PURE_C evidence'] : ['register tuning until length/CFG/opcode/stack prerequisites are fixed'],
  ));
  if ((blockWordReordered || blockOpcodeReordered) && !exactBytes) labels.push(mismatchLabel(
    'scheduling-or-block-order', blockWordReordered ? 'high' : 'moderate',
    'Corresponding CFG blocks retain matching word or opcode multisets while order differs; statement ordering or compiler scheduling is a plausible bounded search family.',
    { blockWordReordered, blockOpcodeReordered },
    ['statement order', 'split versus grouped expressions', 'temporary declaration point', 'compiler scheduling probe'],
    ['function-boundary changes', 'fixed-register binding before order is resolved'],
  ));
  if (memoryWidthOrSignednessDifferences > 0) labels.push(mismatchLabel(
    'load-store-width-or-signedness', 'moderate',
    'Aligned memory operations differ in width, signed-load behavior, or load/store role; type and field-width recovery is a likely prerequisite, not a semantic conclusion.',
    { differingOperations: memoryWidthOrSignednessDifferences, samples: differenceSamples.slice(0, EVIDENCE_SAMPLE_LIMIT) },
    ['signed versus unsigned pointee types', 'field width', 'explicit casts', 'prototype recovery'],
    ['scheduler tuning', 'register permutation before memory opcodes match'],
  ));
  if (frameMismatch) labels.push(mismatchLabel(
    'stack-layout-or-offset-family', 'moderate',
    'Frame size or stack-relative access facts differ; aggregate layout, local order, or lifetime is a likely prerequisite.',
    { expectedFrame, actualFrame, stackOffsetDifferences },
    ['fixed-layout aggregate locals', 'local declaration order', 'temporary lifetime', 'array versus pointer representation'],
    ['scheduler-only tuning', 'register allocation before frame and offsets match', 'dummy padding without evidence'],
  ));
  if (immediateFieldDifferences > 0) labels.push(mismatchLabel(
    'constant-or-immediate-construction', 'moderate',
    'Aligned opcode forms contain different immediate fields; constants, signedness, grouping, or relocation-bearing expressions are plausible causes.',
    { differingFields: immediateFieldDifferences, samples: differenceSamples.slice(0, EVIDENCE_SAMPLE_LIMIT) },
    ['constant spelling and grouping', 'signed versus unsigned comparison', 'field width', 'relocation-bearing address expression'],
    ['register allocation before immediate operands match', 'literal-only search when relocation evidence is missing'],
  ));
  const residualOpcodeDifferences = Math.max(0, opcodeDifferences - branchPolarityDifferences - memoryWidthOrSignednessDifferences);
  if (residualOpcodeDifferences > 0) labels.push(mismatchLabel(
    'opcode-or-expression', 'moderate',
    'Opcode differences remain after the narrower observed branch-polarity and memory-width families; source types or expression form should be inspected without assuming semantics.',
    { opcodeDifferences, residualOpcodeDifferences, samples: differenceSamples.slice(0, EVIDENCE_SAMPLE_LIMIT) },
    ['types and casts', 'expression grouping', 'array indexing versus pointer arithmetic', 'missing source behavior'],
    ['register-only tuning', 'scheduler-only tuning', 'semantic claims from opcode similarity'],
  ));
  if (labels.length === 0) labels.push(mismatchLabel(
    'mixed-or-unknown', 'low',
    'The bounded heuristics do not isolate one mismatch family; inspect the first divergent block without assuming semantic equivalence or inequivalence.',
    { firstDifference },
    ['first divergent block', 'types', 'expression form', 'compiler diagnostics'],
    ['unrestricted random permutation', 'boundary changes without structural evidence'],
  ));
  const primaryCategory = {
    'exact-bytes': 'exact',
    'length-mismatch': 'length',
    'relocation-identity-proven': 'relocation-records-identical',
    'relocation-mask-compatible': 'relocation-mask-compatible',
    'cfg-mismatch': !cfgExact ? 'cfg-shape' : 'branch-polarity',
    'register-allocation-only': 'register-allocation',
    'scheduling-or-block-order': 'scheduling-or-block-order',
    'stack-layout': 'stack-layout-or-offset-family',
    'load-store-width-or-signedness': 'load-store-width-or-signedness',
    'immediate-or-signedness': 'constant-or-immediate-construction',
    'opcode-or-expression': 'opcode-or-expression',
  }[primaryClass];
  labels.sort((left, right) => (left.category === primaryCategory ? -1 : 0) - (right.category === primaryCategory ? -1 : 0));
  const opcodeRatio = aligned === 0 ? 0 : opcodeMatches / Math.max(expectedWords.length, actualWords.length);
  const lengthRatio = Math.min(expected.length, actual.length) / Math.max(expected.length, actual.length, 1);
  const score = Math.round(10000 * (0.45 * opcodeRatio + 0.25 * (cfgExact ? 1 : 0) + 0.15 * lengthRatio + 0.15 * byteSimilarity(expected, actual))) / 100;
  return {
    schemaVersion: 2,
    primaryClass,
    recommendation,
    labels,
    mismatchCounts,
    differingInstructions,
    differingBytes,
    exactBytes,
    relocationMaskedExact,
    relocationEvidence: relocation.evidence,
    registerNormalizedExact,
    cfgExact,
    sameLength,
    score,
    expectedBytes: expected.length,
    actualBytes: actual.length,
    expectedInstructions: expectedWords.length,
    actualInstructions: actualWords.length,
    opcodeMatches,
    opcodeRatio,
    firstDifference,
    differenceSamples,
    expectedFrame,
    actualFrame,
    expectedCfg: cfgSignature(expectedCfg),
    actualCfg: cfgSignature(actualCfg),
  };
}

function targetMetrics(buffer, start) {
  const words = wordsFromBuffer(buffer);
  const cfg = cfgForWords(words, start);
  const frame = frameFacts(cfg.infos);
  return {
    instructions: words.length,
    blocks: cfg.blocks.length,
    edges: cfg.blocks.reduce((sum, block) => sum + block.edges.length, 0),
    calls: cfg.infos.filter((info) => info.call).length,
    indirectCalls: cfg.infos.filter((info) => info.call && info.indirect).length,
    indirectJumps: cfg.infos.filter((info) => info.control === 'jump-register' && !info.returnInstruction).length,
    branches: cfg.infos.filter((info) => info.control === 'branch').length,
    memoryOperations: cfg.infos.filter((info) => info.memory).length,
    floatingPoint: cfg.infos.some((info) => info.op === 0x11 || (info.memory && info.memory.float)),
    leaf: !cfg.infos.some((info) => info.call),
    frameSize: frame.frameSize,
    stackOffsets: frame.stackOffsets,
  };
}

module.exports = {
  bufferFromWords,
  cfgForWords,
  cfgSignature,
  compareMips,
  instructionInfo,
  opcodeKey,
  registerUsage,
  registerNormalizedRepresentation,
  relocationNormalizedRepresentation,
  structuralRepresentation,
  targetMetrics,
  wordsFromBuffer,
};
