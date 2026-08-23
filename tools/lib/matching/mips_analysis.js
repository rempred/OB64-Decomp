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

function maskedWords(expectedWords, actualWords, relocations) {
  const masks = new Map();
  for (const relocation of relocations || []) {
    const offset = typeof relocation.offset === 'string' ? Number.parseInt(relocation.offset, 16) : relocation.offset;
    const mask = relocationMask(relocation.type);
    // Unknown relocation kinds cannot safely excuse a byte difference.
    if (mask !== null && Number.isInteger(offset) && offset % 4 === 0) masks.set(offset / 4, mask);
  }
  return expectedWords.map((word, index) => [word & (masks.get(index) ?? 0xFFFFFFFF), actualWords[index] & (masks.get(index) ?? 0xFFFFFFFF)]);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
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
  let firstDifference = null;
  for (let index = 0; index < aligned; index += 1) {
    if (opcodeKey(expectedCfg.infos[index]) === opcodeKey(actualCfg.infos[index])) opcodeMatches += 1;
    if (firstDifference === null && expectedWords[index] !== actualWords[index]) {
      firstDifference = {
        index,
        offset: index * 4,
        pc: (start + index * 4) >>> 0,
        expectedWord: `0x${expectedWords[index].toString(16).toUpperCase().padStart(8, '0')}`,
        actualWord: `0x${actualWords[index].toString(16).toUpperCase().padStart(8, '0')}`,
        expected: expectedCfg.infos[index].text,
        actual: actualCfg.infos[index].text,
      };
    }
  }
  if (firstDifference === null && !sameLength) firstDifference = { index: aligned, offset: aligned * 4, reason: 'length' };
  const masked = sameLength ? maskedWords(expectedWords, actualWords, options.relocations) : [];
  const relocationMaskedExact = sameLength && masked.every(([left, right]) => left === right);
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
  const expectedFrame = frameFacts(expectedCfg.infos);
  const actualFrame = frameFacts(actualCfg.infos);
  const frameMismatch = expectedFrame.frameSize !== actualFrame.frameSize || !sameJson(expectedFrame.stackOffsets, actualFrame.stackOffsets);
  let primaryClass = 'mixed-or-unknown';
  let recommendation = 'inspect the first divergent block and reconstruct its C behavior';
  if (exactBytes) {
    primaryClass = 'exact-bytes';
    recommendation = 'run canonical diff and verification before promotion';
  } else if (!sameLength) {
    primaryClass = 'length-mismatch';
    recommendation = 'correct the function shape, boundary assumptions, or emitted prologue/epilogue';
  } else if (relocationMaskedExact && (options.relocations || []).length > 0) {
    primaryClass = 'relocation-only';
    recommendation = 'establish the exact symbol and reviewed linkage contract';
  } else if (!cfgExact) {
    primaryClass = 'cfg-mismatch';
    recommendation = 'correct branches, loops, early returns, or block ordering before tuning registers';
  } else if (registerNormalizedExact) {
    primaryClass = 'register-allocation-only';
    recommendation = 'inspect variable lifetimes; a bounded permuter or compiler probe may now be appropriate';
  } else if (blockWordMultisetsEqual) {
    primaryClass = 'scheduling-or-block-order';
    recommendation = 'inspect statement ordering and scheduler dumps';
  } else if (frameMismatch) {
    primaryClass = 'stack-layout';
    recommendation = 'inspect aggregate locals, declaration lifetimes, and stack offsets';
  } else if (opcodeMatches === aligned) {
    primaryClass = 'immediate-or-signedness';
    recommendation = 'inspect constants, signedness, field widths, and relocation operands';
  } else if (blockOpcodeMultisetsEqual) {
    primaryClass = 'scheduling-or-block-order';
    recommendation = 'inspect statement ordering and scheduler dumps';
  } else {
    primaryClass = 'opcode-or-expression';
    recommendation = 'inspect types and expression form at the first opcode divergence';
  }
  const opcodeRatio = aligned === 0 ? 0 : opcodeMatches / Math.max(expectedWords.length, actualWords.length);
  const lengthRatio = Math.min(expected.length, actual.length) / Math.max(expected.length, actual.length, 1);
  const score = Math.round(10000 * (0.45 * opcodeRatio + 0.25 * (cfgExact ? 1 : 0) + 0.15 * lengthRatio + 0.15 * byteSimilarity(expected, actual))) / 100;
  return {
    schemaVersion: 1,
    primaryClass,
    recommendation,
    exactBytes,
    relocationMaskedExact,
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
