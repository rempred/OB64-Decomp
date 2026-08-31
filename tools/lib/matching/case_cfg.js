'use strict';

const {
  cfgForWords,
  instructionInfo,
  opcodeKey,
  wordsFromBuffer,
} = require('./mips_analysis');
const { canonicalJson, digest } = require('./target_model');

function integer(value, label) {
  if (Number.isSafeInteger(value)) return value;
  if (typeof value === 'string' && /^(?:0x[0-9a-f]+|[0-9]+)$/i.test(value.trim())) {
    const parsed = Number.parseInt(value, 0);
    if (Number.isSafeInteger(parsed)) return parsed;
  }
  throw new Error(`${label} must be a nonnegative integer`);
}

function offset(value, label, length) {
  const parsed = integer(value, label);
  if (parsed < 0 || parsed >= length || parsed % 4 !== 0) {
    throw new Error(`${label} is outside the aligned function extent`);
  }
  return parsed;
}

function hex(value, width = 8) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(width, '0')}`;
}

function commandValue(value, label = 'command value') {
  const parsed = integer(value, label);
  if (parsed < 0 || parsed > 0xFFFFFFFF) throw new Error(`${label} is outside the u32 domain`);
  return parsed >>> 0;
}

function knownRead(registers, known, number, context) {
  if (!known[number]) throw new Error(`${context} reads unknown register $${number}`);
  return registers[number] | 0;
}

function maybeRead(registers, known, number) {
  return known[number] ? registers[number] | 0 : null;
}

function writeRegister(registers, known, number, value) {
  if (number !== 0) {
    registers[number] = value | 0;
    known[number] = 1;
  }
  registers[0] = 0;
  known[0] = 1;
}

function writeUnknown(known, number) {
  if (number !== 0) known[number] = 0;
  known[0] = 1;
}

function writeUnary(registers, known, destination, source, operation) {
  const value = maybeRead(registers, known, source);
  if (value === null) writeUnknown(known, destination);
  else writeRegister(registers, known, destination, operation(value));
}

function writeBinary(registers, known, destination, left, right, operation) {
  const leftValue = maybeRead(registers, known, left);
  const rightValue = maybeRead(registers, known, right);
  if (leftValue === null || rightValue === null) writeUnknown(known, destination);
  else writeRegister(registers, known, destination, operation(leftValue, rightValue));
}

function executeDispatchInstruction(info, registers, known, context) {
  if (info.op === 0 && info.funct === 0x00) {
    writeUnary(registers, known, info.rd, info.rt, (value) => value << info.sa);
    return;
  }
  if (info.op === 0 && info.funct === 0x21) {
    writeBinary(registers, known, info.rd, info.rs, info.rt, (left, right) => (left + right) | 0);
    return;
  }
  if (info.op === 0 && info.funct === 0x2A) {
    writeBinary(registers, known, info.rd, info.rs, info.rt, (left, right) => left < right ? 1 : 0);
    return;
  }
  if (info.op === 0x09) {
    writeUnary(registers, known, info.rt, info.rs, (value) => (value + info.signedImmediate) | 0);
    return;
  }
  if (info.op === 0x0A) {
    writeUnary(registers, known, info.rt, info.rs, (value) => value < info.signedImmediate ? 1 : 0);
    return;
  }
  if (info.op === 0x0B) {
    writeUnary(registers, known, info.rt, info.rs,
      (value) => (value >>> 0) < (info.signedImmediate >>> 0) ? 1 : 0);
    return;
  }
  if (info.op === 0x0D) {
    writeUnary(registers, known, info.rt, info.rs, (value) => value | info.immediate);
    return;
  }
  if (info.op === 0x0F) {
    writeRegister(registers, known, info.rt, info.immediate << 16);
    return;
  }
  throw new Error(`${context} uses unsupported dispatch instruction: ${info.text}`);
}

function localJumpOffset(info, word, start, mode, context) {
  if (mode === 'section-relative') return ((word & 0x03FFFFFF) * 4) >>> 0;
  if (mode === 'absolute') return ((info.target - start) >>> 0);
  throw new Error(`${context} has unknown local jump mode: ${mode}`);
}

function normalizedDispatchSpec(spec, bufferLength, label) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) throw new Error(`${label} dispatch spec is missing`);
  const dispatchOffset = offset(spec.dispatchOffset, `${label} dispatch offset`, bufferLength);
  const bodyOffset = offset(spec.bodyOffset, `${label} body offset`, bufferLength);
  if (dispatchOffset >= bodyOffset) throw new Error(`${label} dispatch offset must precede its body offset`);
  const valueRegister = integer(spec.valueRegister, `${label} value register`);
  if (valueRegister < 1 || valueRegister > 31) throw new Error(`${label} value register is invalid`);
  const initialRegisters = new Map();
  for (const [key, value] of Object.entries(spec.initialRegisters || {})) {
    const register = integer(key, `${label} initial register`);
    if (register < 1 || register > 31 || initialRegisters.has(register)) {
      throw new Error(`${label} initial register set is invalid`);
    }
    initialRegisters.set(register, commandValue(value, `${label} initial register value`));
  }
  if (initialRegisters.has(valueRegister)) throw new Error(`${label} value register is also fixed by initialRegisters`);
  return {
    dispatchOffset,
    bodyOffset,
    valueRegister,
    initialRegisters,
    localJumpMode: spec.localJumpMode || 'absolute',
    maximumSteps: integer(spec.maximumSteps ?? 2048, `${label} maximum steps`),
  };
}

function publicDispatchSpec(spec) {
  const initialRegisters = {};
  for (const [register, value] of [...spec.initialRegisters].sort((left, right) => left[0] - right[0])) {
    initialRegisters[String(register)] = hex(value);
  }
  return {
    dispatchOffset: hex(spec.dispatchOffset, 4),
    bodyOffset: hex(spec.bodyOffset, 4),
    valueRegister: spec.valueRegister,
    initialRegisters,
    localJumpMode: spec.localJumpMode,
    maximumSteps: spec.maximumSteps,
  };
}

function normalizedCandidateIdentity(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw new Error('case CFG candidate comparison identity is missing');
  }
  for (const field of ['candidateId', 'runId']) {
    if (typeof source[field] !== 'string' || !/^[0-9a-f]{64}$/i.test(source[field])) {
      throw new Error(`case CFG candidate ${field} is not a 64-digit identity`);
    }
  }
  if (typeof source.sourceClass !== 'string' || !source.sourceClass) {
    throw new Error('case CFG candidate source class is missing');
  }
  return {
    candidateId: source.candidateId.toUpperCase(),
    runId: source.runId.toUpperCase(),
    sourceClass: source.sourceClass,
  };
}

function resolveCandidateComparisonContract(map, candidateId) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error('case-CFG map is missing');
  if (map.schemaVersion === 1) return null;
  if (map.schemaVersion !== 2 || !Array.isArray(map.candidateContracts) || !map.candidateContracts.length) {
    throw new Error('case-CFG map candidate-contract schema is missing or unsupported');
  }
  const normalizedId = String(candidateId || '').toUpperCase();
  const matches = map.candidateContracts.filter((contract) => (
    typeof contract?.candidateId === 'string' && contract.candidateId.toUpperCase() === normalizedId
  ));
  if (matches.length !== 1) {
    throw new Error(`case-CFG candidate contract does not resolve uniquely for ${candidateId}: found ${matches.length}`);
  }
  const contract = matches[0];
  if (!contract.actualDispatch || !Array.isArray(contract.actualTails) || !contract.actualTails.length) {
    throw new Error(`case-CFG candidate contract is incomplete for ${candidateId}`);
  }
  return contract;
}

function traceCommandEntry(buffer, start, spec, value, label = 'command') {
  if (!Buffer.isBuffer(buffer) || buffer.length % 4 !== 0) throw new Error('case CFG input must be an aligned byte buffer');
  const normalized = normalizedDispatchSpec(spec, buffer.length, label);
  const words = wordsFromBuffer(buffer);
  const registers = new Int32Array(32);
  const known = new Uint8Array(32);
  known[0] = 1;
  writeRegister(registers, known, normalized.valueRegister, commandValue(value, `${label} value`));
  for (const [register, initial] of normalized.initialRegisters) {
    writeRegister(registers, known, register, initial);
  }
  let index = normalized.dispatchOffset / 4;
  const visited = new Set();
  const executedOffsets = [];
  const delaySlotOffsets = [];
  const finish = (entryOffset) => ({ entryOffset, executedOffsets, delaySlotOffsets });
  for (let step = 0; step < normalized.maximumSteps; step += 1) {
    const currentOffset = index * 4;
    if (currentOffset >= normalized.bodyOffset) return finish(currentOffset);
    if (currentOffset < normalized.dispatchOffset || currentOffset >= buffer.length) {
      throw new Error(`${label} dispatch escaped its bounded range at ${hex(currentOffset)}`);
    }
    const stateKey = `${index}:${Array.from(registers).join(',')}:${Array.from(known).join('')}`;
    if (visited.has(stateKey)) throw new Error(`${label} dispatch entered a cycle at ${hex(currentOffset)}`);
    visited.add(stateKey);
    executedOffsets.push(currentOffset);
    const word = words[index];
    const info = instructionInfo(word, start + currentOffset);
    const context = `${label} dispatch at ${hex(currentOffset)}`;
    if (info.op === 0x02) {
      const targetOffset = localJumpOffset(info, word, start, normalized.localJumpMode, context);
      if (targetOffset % 4 !== 0 || targetOffset >= buffer.length) {
        throw new Error(`${context} jumps outside the aligned function extent`);
      }
      if (index + 1 >= words.length) throw new Error(`${context} has no delay slot`);
      executedOffsets.push(currentOffset + 4);
      delaySlotOffsets.push(currentOffset + 4);
      executeDispatchInstruction(instructionInfo(words[index + 1], start + currentOffset + 4), registers, known, `${context} delay slot`);
      if (targetOffset >= normalized.bodyOffset) return finish(targetOffset);
      index = targetOffset / 4;
      continue;
    }
    if ([0x04, 0x05, 0x14, 0x15].includes(info.op)) {
      const left = knownRead(registers, known, info.rs, context);
      const right = knownRead(registers, known, info.rt, context);
      const equal = left === right;
      const taken = [0x04, 0x14].includes(info.op) ? equal : !equal;
      const likely = [0x14, 0x15].includes(info.op);
      if (taken || !likely) {
        if (index + 1 >= words.length) throw new Error(`${context} has no delay slot`);
        executedOffsets.push(currentOffset + 4);
        delaySlotOffsets.push(currentOffset + 4);
        executeDispatchInstruction(instructionInfo(words[index + 1], start + currentOffset + 4), registers, known, `${context} delay slot`);
      }
      const targetOffset = ((info.target - start) >>> 0);
      if (taken) {
        if (targetOffset % 4 !== 0 || targetOffset >= buffer.length) {
          throw new Error(`${context} branches outside the aligned function extent`);
        }
        if (targetOffset >= normalized.bodyOffset) return finish(targetOffset);
        index = targetOffset / 4;
      } else index += 2;
      continue;
    }
    if ([0x06, 0x07, 0x16, 0x17].includes(info.op)) {
      const source = knownRead(registers, known, info.rs, context);
      const taken = [0x06, 0x16].includes(info.op) ? source <= 0 : source > 0;
      const likely = [0x16, 0x17].includes(info.op);
      if (taken || !likely) {
        if (index + 1 >= words.length) throw new Error(`${context} has no delay slot`);
        executedOffsets.push(currentOffset + 4);
        delaySlotOffsets.push(currentOffset + 4);
        executeDispatchInstruction(instructionInfo(words[index + 1], start + currentOffset + 4), registers, known, `${context} delay slot`);
      }
      const targetOffset = ((info.target - start) >>> 0);
      if (taken) {
        if (targetOffset % 4 !== 0 || targetOffset >= buffer.length) {
          throw new Error(`${context} branches outside the aligned function extent`);
        }
        if (targetOffset >= normalized.bodyOffset) return finish(targetOffset);
        index = targetOffset / 4;
      } else index += 2;
      continue;
    }
    if (info.control) throw new Error(`${context} uses unsupported control flow: ${info.text}`);
    executeDispatchInstruction(info, registers, known, context);
    index += 1;
  }
  throw new Error(`${label} dispatch exceeded its step bound`);
}

function resolveCommandEntry(buffer, start, spec, value, label = 'command') {
  return traceCommandEntry(buffer, start, spec, value, label).entryOffset;
}

function mapCommandEntries(buffer, start, spec, commands, label = 'command') {
  if (!Array.isArray(commands) || commands.length === 0) throw new Error('case CFG command list is empty');
  const seen = new Set();
  return commands.map((source, index) => {
    const value = commandValue(source && typeof source === 'object' ? source.value : source, `${label} ${index} value`);
    if (seen.has(value)) throw new Error(`${label} list contains duplicate value ${hex(value)}`);
    seen.add(value);
    const route = traceCommandEntry(buffer, start, spec, value, `${label} ${hex(value)}`);
    const entryOffset = route.entryOffset;
    return {
      value,
      valueHex: hex(value),
      entryOffset,
      entryOffsetHex: hex(entryOffset, 4),
      entryVram: (start + entryOffset) >>> 0,
      entryVramHex: hex((start + entryOffset) >>> 0),
      dispatchExecutedOffsets: route.executedOffsets,
      dispatchDelaySlotOffsets: route.delaySlotOffsets,
    };
  });
}

function normalizeRelocations(records) {
  const byOffset = new Map();
  for (const [index, record] of (records || []).entries()) {
    if (!record || typeof record !== 'object') throw new Error(`relocation ${index} is malformed`);
    const recordOffset = integer(record.offset, `relocation ${index} offset`);
    if (recordOffset % 4 !== 0) throw new Error(`relocation ${index} offset is not aligned`);
    if (byOffset.has(recordOffset)) throw new Error(`multiple relocations occupy ${hex(recordOffset)}`);
    byOffset.set(recordOffset, record);
  }
  return byOffset;
}

function applySectionLocalRelocations(buffer, start, records) {
  const words = wordsFromBuffer(buffer);
  for (const [recordOffset, record] of normalizeRelocations(records)) {
    if (record.type !== 'R_MIPS_26' || record.symbol !== '.text') continue;
    if (recordOffset >= buffer.length) throw new Error(`local relocation lies outside function text: ${hex(recordOffset)}`);
    const word = words[recordOffset / 4];
    const localOffset = ((word & 0x03FFFFFF) * 4) >>> 0;
    if (localOffset >= buffer.length || localOffset % 4 !== 0) {
      throw new Error(`local relocation target is outside function text: ${hex(recordOffset)}`);
    }
    words[recordOffset / 4] = ((word & 0xFC000000) | (((start + localOffset) >>> 2) & 0x03FFFFFF)) >>> 0;
  }
  const result = Buffer.alloc(buffer.length);
  words.forEach((word, index) => result.writeUInt32BE(word >>> 0, index * 4));
  return result;
}

function normalizedTails(source, bufferLength, label) {
  if (!Array.isArray(source) || source.length === 0) throw new Error(`${label} shared-tail map is empty`);
  const names = new Set();
  const offsets = new Map();
  const records = [];
  for (const [index, tail] of source.entries()) {
    if (!tail || typeof tail !== 'object' || typeof tail.name !== 'string' || !tail.name) {
      throw new Error(`${label} shared tail ${index} is malformed`);
    }
    if (names.has(tail.name)) throw new Error(`${label} shared-tail name is duplicated: ${tail.name}`);
    names.add(tail.name);
    const values = Array.isArray(tail.offsets) ? tail.offsets : [tail.offset];
    if (!values.length) throw new Error(`${label} shared tail ${tail.name} has no offsets`);
    const parsedValues = [];
    for (const value of values) {
      const parsed = offset(value, `${label} shared tail ${tail.name}`, bufferLength);
      if (offsets.has(parsed)) throw new Error(`${label} shared-tail offset is ambiguous: ${hex(parsed)}`);
      offsets.set(parsed, tail.name);
      parsedValues.push(parsed);
    }
    records.push({ name: tail.name, offsets: parsedValues.sort((left, right) => left - right).map((value) => hex(value, 4)) });
  }
  records.sort((left, right) => left.name.localeCompare(right.name));
  return { names, offsets, records };
}

function assertCandidateComparisonInputs(contract, actualDispatch, actualTails, bufferLength) {
  if (!contract) return;
  const expectedDispatch = publicDispatchSpec(
    normalizedDispatchSpec(contract.actualDispatch, bufferLength, 'tracked actual'));
  const providedDispatch = publicDispatchSpec(
    normalizedDispatchSpec(actualDispatch, bufferLength, 'provided actual'));
  const expectedTails = normalizedTails(contract.actualTails, bufferLength, 'tracked actual').records;
  const providedTails = normalizedTails(actualTails, bufferLength, 'provided actual').records;
  if (canonicalJson(expectedDispatch) !== canonicalJson(providedDispatch)
      || canonicalJson(expectedTails) !== canonicalJson(providedTails)) {
    throw new Error(`case-CFG actual inputs differ from tracked candidate contract for ${contract.candidateId}: expected ${canonicalJson({ dispatch: expectedDispatch, sharedTails: expectedTails })}, received ${canonicalJson({ dispatch: providedDispatch, sharedTails: providedTails })}`);
  }
}

function callSymbol(info, instructionOffset, relocationByOffset, symbolForAddress) {
  if (!info.call) return null;
  const relocation = relocationByOffset.get(instructionOffset);
  if (relocation && relocation.type === 'R_MIPS_26' && relocation.symbol !== '.text') return relocation.symbol;
  if (info.target !== null) return symbolForAddress ? symbolForAddress(info.target >>> 0) : hex(info.target >>> 0);
  return '<indirect-call>';
}

function operationSignature(info, instructionOffset, relocationByOffset, symbolForAddress) {
  const symbol = callSymbol(info, instructionOffset, relocationByOffset, symbolForAddress);
  if (symbol) return { signature: `CALL:${symbol}`, symbol };
  const key = opcodeKey(info);
  if (info.control) return { signature: key, symbol: null };
  const relocation = relocationByOffset.get(instructionOffset);
  if (relocation) {
    return { signature: `${key}|RELOC:${relocation.type}:${relocation.symbol}`, symbol: null };
  }
  if (info.op === 0 || info.op === 0x10 || info.op === 0x11) {
    return { signature: key, symbol: null };
  }
  return { signature: `${key}|IMM:${hex(info.immediate, 4)}`, symbol: null };
}

function analyzeRegion(buffer, start, entryOffset, tails, options = {}) {
  const words = wordsFromBuffer(buffer);
  const cfg = cfgForWords(words, start);
  const blockByStart = new Map(cfg.blocks.map((block) => [block.startIndex * 4, block]));
  const tail = tails.offsets.get(entryOffset);
  if (tail) return { entryOffset, blocks: [], calls: [], successors: [`tail:${tail}`], sharedTails: [tail] };
  const first = blockByStart.get(entryOffset);
  if (!first) throw new Error(`command entry does not begin a CFG block: ${hex(entryOffset)}`);
  const relocationByOffset = normalizeRelocations(options.relocations || []);
  const queue = [first.ordinal];
  const visited = new Set();
  const successors = new Set();
  const sharedTails = new Set();
  while (queue.length) {
    const ordinal = queue.shift();
    if (visited.has(ordinal)) continue;
    visited.add(ordinal);
    if (visited.size > (options.maximumBlocks || cfg.blocks.length)) throw new Error('command region exceeded its block bound');
    const block = cfg.blocks[ordinal];
    for (const edge of block.edges) {
      if (edge.kind === 'call-external') continue;
      if (edge.to === null || edge.to === undefined) {
        successors.add(edge.kind);
        continue;
      }
      if (edge.kind === 'call-internal') {
        successors.add('call-internal');
        continue;
      }
      const targetBlock = cfg.blocks[edge.to];
      const targetOffset = targetBlock.startIndex * 4;
      const tailName = tails.offsets.get(targetOffset);
      if (tailName) {
        successors.add(`tail:${tailName}`);
        sharedTails.add(tailName);
      } else queue.push(edge.to);
    }
  }
  const blocks = [...visited].sort((left, right) => cfg.blocks[left].startIndex - cfg.blocks[right].startIndex).map((ordinal) => {
    const block = cfg.blocks[ordinal];
    const blockOffset = block.startIndex * 4;
    const calls = [];
    const operations = block.words.map((info, index) => {
      const instructionOffset = blockOffset + index * 4;
      const operation = operationSignature(info, instructionOffset, relocationByOffset, options.symbolForAddress);
      if (operation.symbol) calls.push({ offset: instructionOffset, symbol: operation.symbol });
      return operation.signature;
    });
    const edgeShape = block.edges.map((edge) => {
      if (edge.to === null || edge.to === undefined) return edge.kind;
      const targetOffset = cfg.blocks[edge.to].startIndex * 4;
      const tailName = tails.offsets.get(targetOffset);
      return tailName ? `${edge.kind}:tail:${tailName}` : `${edge.kind}:internal`;
    }).sort();
    return {
      offset: blockOffset,
      offsetHex: hex(blockOffset, 4),
      words: block.endIndex - block.startIndex,
      calls,
      signature: `${operations.join(',')}|${edgeShape.join(',')}`,
    };
  });
  const calls = blocks.flatMap((block) => block.calls).sort((left, right) => left.offset - right.offset);
  return {
    entryOffset,
    blocks,
    calls,
    successors: [...successors].sort(),
    sharedTails: [...sharedTails].sort(),
  };
}

function unmatchedBlocks(left, right) {
  const buckets = new Map();
  for (const block of right) {
    if (!buckets.has(block.signature)) buckets.set(block.signature, []);
    buckets.get(block.signature).push(block);
  }
  const unmatched = [];
  for (const block of left) {
    const bucket = buckets.get(block.signature);
    if (bucket && bucket.length) bucket.shift();
    else unmatched.push({ offset: block.offset, offsetHex: block.offsetHex, words: block.words, signature: block.signature });
  }
  return unmatched;
}

function sameStrings(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function caseComparisonDigest(report) {
  return digest({
    schemaVersion: report.schemaVersion,
    target: report.target,
    candidate: {
      candidateId: report.candidate.candidateId,
      sourceClass: report.candidate.sourceClass,
    },
    expected: report.comparisonContract.expected,
    actual: report.comparisonContract.actual,
    actualInputs: report.comparisonContract.actualInputs,
    commandCount: report.commandCount,
    summary: report.summary,
    commands: report.commands,
    evidenceBoundary: report.evidenceBoundary,
  });
}

function assertCandidateComparisonResult(contract, report) {
  if (!contract) return;
  if (contract.expectedSummary !== undefined
      && canonicalJson(report.summary) !== canonicalJson(contract.expectedSummary)) {
    throw new Error(`case-CFG result summary differs from tracked candidate contract for ${contract.candidateId}`);
  }
  if (contract.expectedResultDigest !== undefined
      && report.resultDigest !== contract.expectedResultDigest) {
    throw new Error(`case-CFG result digest differs from tracked candidate contract for ${contract.candidateId}: expected ${contract.expectedResultDigest}, received ${report.resultDigest}`);
  }
}

function compareCaseCfg(expectedBuffer, actualBuffer, options) {
  if (!options || typeof options !== 'object') throw new Error('case CFG options are required');
  const start = integer(options.start, 'case CFG start') >>> 0;
  const commands = options.commands;
  const candidate = normalizedCandidateIdentity(options.candidate);
  const expectedDispatch = normalizedDispatchSpec(options.expectedDispatch, expectedBuffer.length, 'expected');
  const actualDispatch = normalizedDispatchSpec(options.actualDispatch, actualBuffer.length, 'actual');
  const expectedEntries = mapCommandEntries(expectedBuffer, start, options.expectedDispatch, commands, 'expected command');
  const actualEntries = mapCommandEntries(actualBuffer, start, options.actualDispatch, commands, 'actual command');
  const expectedTails = normalizedTails(options.expectedTails, expectedBuffer.length, 'expected');
  const actualTails = normalizedTails(options.actualTails, actualBuffer.length, 'actual');
  const missingTailNames = [...expectedTails.names].filter((name) => !actualTails.names.has(name));
  const extraTailNames = [...actualTails.names].filter((name) => !expectedTails.names.has(name));
  if (missingTailNames.length || extraTailNames.length) {
    throw new Error(`shared-tail names do not align: missing=${missingTailNames.join(',') || 'none'} extra=${extraTailNames.join(',') || 'none'}`);
  }
  const normalizedActual = applySectionLocalRelocations(actualBuffer, start, options.actualRelocations || []);
  const rows = expectedEntries.map((expectedEntry, index) => {
    const actualEntry = actualEntries[index];
    const expected = analyzeRegion(expectedBuffer, start, expectedEntry.entryOffset, expectedTails, {
      relocations: options.expectedRelocations,
      symbolForAddress: options.symbolForAddress,
    });
    const actual = analyzeRegion(normalizedActual, start, actualEntry.entryOffset, actualTails, {
      relocations: options.actualRelocations,
      symbolForAddress: options.symbolForAddress,
    });
    const expectedCallSymbols = expected.calls.map((call) => call.symbol);
    const actualCallSymbols = actual.calls.map((call) => call.symbol);
    const expectedOnlyBlocks = unmatchedBlocks(expected.blocks, actual.blocks);
    const actualOnlyBlocks = unmatchedBlocks(actual.blocks, expected.blocks);
    const successorsMatch = sameStrings(expected.successors, actual.successors);
    const callsMatch = sameStrings(expectedCallSymbols, actualCallSymbols);
    const tailsMatch = sameStrings(expected.sharedTails, actual.sharedTails);
    return {
      command: expectedEntry.valueHex,
      value: expectedEntry.value,
      expected: {
        entryOffset: expectedEntry.entryOffsetHex,
        entryVram: expectedEntry.entryVramHex,
        blockCount: expected.blocks.length,
        calls: expected.calls.map((call) => ({ offset: hex(call.offset, 4), symbol: call.symbol })),
        successors: expected.successors,
        sharedTails: expected.sharedTails,
      },
      actual: {
        entryOffset: actualEntry.entryOffsetHex,
        entryVram: actualEntry.entryVramHex,
        blockCount: actual.blocks.length,
        calls: actual.calls.map((call) => ({ offset: hex(call.offset, 4), symbol: call.symbol })),
        successors: actual.successors,
        sharedTails: actual.sharedTails,
      },
      unmatchedBlocks: { expected: expectedOnlyBlocks, actual: actualOnlyBlocks },
      parity: {
        blockCount: expected.blocks.length === actual.blocks.length,
        calls: callsMatch,
        successors: successorsMatch,
        sharedTailConvergence: tailsMatch,
        normalizedBlocks: expectedOnlyBlocks.length === 0 && actualOnlyBlocks.length === 0,
      },
    };
  });
  const exactStructural = rows.filter((row) => Object.values(row.parity).every(Boolean)).length;
  const report = {
    schemaVersion: 2,
    target: options.symbol || null,
    candidate,
    comparisonContract: {
      candidate,
      expected: {
        dispatch: publicDispatchSpec(expectedDispatch),
        commandBodyOffset: hex(expectedDispatch.bodyOffset, 4),
        sharedTails: expectedTails.records,
      },
      actual: {
        dispatch: publicDispatchSpec(actualDispatch),
        commandBodyOffset: hex(actualDispatch.bodyOffset, 4),
        sharedTails: actualTails.records,
      },
      actualInputs: {
        dispatchOffset: hex(actualDispatch.dispatchOffset, 4),
        commandBodyOffset: hex(actualDispatch.bodyOffset, 4),
        sharedTails: actualTails.records.flatMap((tail) => tail.offsets.map((tailOffset) => `${tail.name}=${tailOffset}`)),
      },
    },
    commandCount: rows.length,
    summary: {
      mappedCommands: rows.length,
      exactStructuralCommands: exactStructural,
      blockCountParity: rows.filter((row) => row.parity.blockCount).length,
      callParity: rows.filter((row) => row.parity.calls).length,
      successorParity: rows.filter((row) => row.parity.successors).length,
      sharedTailConvergence: rows.filter((row) => row.parity.sharedTailConvergence).length,
      normalizedBlockParity: rows.filter((row) => row.parity.normalizedBlocks).length,
      expectedRegionBlocks: rows.reduce((sum, row) => sum + row.expected.blockCount, 0),
      actualRegionBlocks: rows.reduce((sum, row) => sum + row.actual.blockCount, 0),
      expectedRegionCalls: rows.reduce((sum, row) => sum + row.expected.calls.length, 0),
      actualRegionCalls: rows.reduce((sum, row) => sum + row.actual.calls.length, 0),
    },
    commands: rows,
    evidenceBoundary: 'Case-aware CFG comparison is a scratch structural aid; it does not establish source ownership, linked bytes, semantics, or full-ROM identity.',
  };
  report.resultDigest = caseComparisonDigest(report);
  return report;
}

module.exports = {
  analyzeRegion,
  applySectionLocalRelocations,
  assertCandidateComparisonInputs,
  assertCandidateComparisonResult,
  caseComparisonDigest,
  compareCaseCfg,
  mapCommandEntries,
  resolveCandidateComparisonContract,
  resolveCommandEntry,
  traceCommandEntry,
};
