#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');
const { analyzeRegion, mapCommandEntries } = require('./lib/matching/case_cfg');
const { cfgForWords, instructionInfo, registerUsage, targetMetrics, wordsFromBuffer } = require('./lib/matching/mips_analysis');
const { loadWorkbenchModel, resolveTarget } = require('./lib/matching/target_model');

const SYMBOL = 'func_00284288';
const SPEC_PATH = path.join(ROOT, 'docs', 'audit', 'evidence', '2026-08-31-func-00284288-preparatory', 'case-cfg-map.json');
const EVIDENCE_DIR = path.dirname(SPEC_PATH);
const DETAIL_PATH = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research', 'retail-command-evidence.json');
const ASM_PATH = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'prepare', `${SYMBOL}.s`);
const PREDECESSOR_PATH = path.join(ROOT, 'docs', 'archive', 'matching-c-candidates', '2026-08-31-func_00284288-e8eb93fecb.c');
const COMMAND_CSV = path.join(EVIDENCE_DIR, 'command-map.csv');
const PROTOTYPE_CSV = path.join(EVIDENCE_DIR, 'prototype-ledger.csv');
const SUMMARY_JSON = path.join(EVIDENCE_DIR, 'coverage-summary.json');
const FIXED_NEIGHBORS = new Set([
  'func_00283E14', 'func_00283FA8', 'func_00284210', 'func_0028422C',
  'func_002861C8', 'func_002827EC',
]);
const REGISTER_NAMES = [
  '$zero', '$at', '$v0', '$v1', '$a0', '$a1', '$a2', '$a3',
  '$t0', '$t1', '$t2', '$t3', '$t4', '$t5', '$t6', '$t7',
  '$s0', '$s1', '$s2', '$s3', '$s4', '$s5', '$s6', '$s7',
  '$t8', '$t9', '$k0', '$k1', '$gp', '$sp', '$s8', '$ra',
];

function hex(value, width = 8) {
  return `0x${(value >>> 0).toString(16).toUpperCase().padStart(width, '0')}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function csvCell(value) {
  const text = value === null || value === undefined ? 'unknown' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(file, columns, rows) {
  const lines = [columns.join(',')];
  for (const row of rows) lines.push(columns.map((column) => csvCell(row[column])).join(','));
  fs.writeFileSync(file, `${lines.join('\n')}\n`);
}

function walk(root, extensions, result = []) {
  if (!fs.existsSync(root)) return result;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) walk(full, extensions, result);
    else if (extensions.has(path.extname(entry.name).toLowerCase())) result.push(full);
  }
  return result;
}

function normalizeSpace(value) {
  return String(value || '').replace(/\s+/g, ' ').replace(/\s*\*\s*/g, ' *').trim();
}

function canonicalType(value) {
  let type = normalizeSpace(value)
    .replace(/\bunsigned\s+int\b/g, 'u32')
    .replace(/\b(?:signed\s+int|int)\b/g, 's32')
    .replace(/\bunsigned\s+short\b/g, 'u16')
    .replace(/\b(?:signed\s+short|short)\b/g, 's16')
    .replace(/\bunsigned\s+char\b/g, 'u8')
    .replace(/\b(?:signed\s+char|char)\b/g, 's8');
  const namedPointer = type.match(/^(.*\*)\s*[A-Za-z_]\w*$/);
  if (namedPointer) type = namedPointer[1];
  else {
    const named = type.match(/^(.+\s+)[A-Za-z_]\w*$/);
    if (named && !/^(?:unsigned|signed|long)\s+$/.test(named[1])) type = named[1].trim();
  }
  return normalizeSpace(type);
}

function canonicalPrototype(signature, symbol) {
  if (!signature) return null;
  const match = signature.match(new RegExp(`^(.*?)\\s+${symbol}\\((.*)\\)$`));
  if (!match) return normalizeSpace(signature);
  const parameters = normalizeSpace(match[2]);
  const parts = parameters === '' || parameters === 'void'
    ? []
    : parameters.split(',').map(canonicalType);
  return `${canonicalType(match[1])}(${parts.join(',')})`;
}

function prototypeShape(signature, symbol) {
  const canonical = canonicalPrototype(signature, symbol);
  const match = canonical?.match(/^(.*?)\((.*)\)$/);
  if (!match) return null;
  return {
    returnType: match[1],
    parameters: match[2] ? match[2].split(',') : [],
  };
}

function renderPrototype(symbol, shape) {
  return `${shape.returnType} ${symbol}(${shape.parameters.length ? shape.parameters.join(', ') : 'void'})`;
}

function parseAssembly(file, target) {
  const rows = [];
  const byOffset = new Map();
  const calls = [];
  const symbolsByAddress = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\/\*\s+([0-9A-Fa-f]{8})\s+([0-9A-Fa-f]{8})\s+([0-9A-Fa-f]{8})\s+\*\/\s+(.+?)\s*$/);
    if (!match) continue;
    const rom = Number.parseInt(match[1], 16) >>> 0;
    const pc = Number.parseInt(match[2], 16) >>> 0;
    const word = Number.parseInt(match[3], 16) >>> 0;
    const text = match[4].trim();
    const offset = (pc - target.entryVram) >>> 0;
    const info = instructionInfo(word, pc);
    const row = { index: rows.length, rom, pc, word, text, offset, info };
    rows.push(row);
    byOffset.set(offset, row);
    const call = text.match(/^jal\s+(\S+)/);
    if (call) {
      const record = { ...row, symbol: call[1] };
      calls.push(record);
      if (info.target !== null) symbolsByAddress.set(info.target >>> 0, call[1]);
    }
  }
  if (rows.length !== target.bytes / 4) throw new Error(`assembly coverage drift: ${rows.length} instructions`);
  return { rows, byOffset, calls, symbolsByAddress };
}

function edgeName(edge, cfg, tails, calls) {
  if (edge.kind === 'call-external') return null;
  if (edge.to === null || edge.to === undefined) return edge.kind;
  const offset = cfg.blocks[edge.to].startIndex * 4;
  if (tails.offsets.has(offset)) return `tail:${tails.offsets.get(offset)}`;
  if (edge.kind === 'call-internal') return `call-internal:${hex(offset, 4)}`;
  return `${edge.kind}:${hex(offset, 4)}`;
}

function entrySuccessors(entryOffset, cfg, tails) {
  if (tails.offsets.has(entryOffset)) return [`tail:${tails.offsets.get(entryOffset)}`];
  const block = cfg.blocks.find((candidate) => candidate.startIndex * 4 === entryOffset);
  if (!block) throw new Error(`entry is not a retail CFG leader: ${hex(entryOffset, 4)}`);
  return block.edges.map((edge) => edgeName(edge, cfg, tails)).filter(Boolean).sort();
}

function s1Effect(info) {
  const usage = registerUsage(info);
  if (!usage.writes.includes(17)) return { delta: 0, dynamic: false };
  if (info.op === 0x09 && info.rs === 17 && info.rt === 17) {
    return { delta: info.signedImmediate, dynamic: false };
  }
  return { delta: 0, dynamic: true };
}

function cursorPaths(entry, cfg, tails, byOffset) {
  let initialDelta = 0;
  let initialDynamic = false;
  const delayEffects = [];
  for (const offset of entry.dispatchDelaySlotOffsets) {
    const row = byOffset.get(offset);
    if (!row) throw new Error(`dispatch trace lacks assembly at ${hex(offset, 4)}`);
    const effect = s1Effect(row.info);
    initialDelta += effect.delta;
    initialDynamic ||= effect.dynamic;
    if (effect.delta || effect.dynamic) delayEffects.push({ offset: hex(offset, 4), text: row.text });
  }
  if (tails.offsets.has(entry.entryOffset)) {
    return { deltas: initialDynamic ? [] : [initialDelta], dynamic: initialDynamic, delayEffects, exits: [`tail:${tails.offsets.get(entry.entryOffset)}`] };
  }
  const first = cfg.blocks.find((block) => block.startIndex * 4 === entry.entryOffset);
  if (!first) throw new Error(`cursor analysis entry is not a CFG block: ${entry.entryOffsetHex}`);
  const queue = [{ ordinal: first.ordinal, delta: initialDelta, dynamic: initialDynamic }];
  const visited = new Set();
  const exits = new Set();
  const deltas = new Set();
  let dynamic = false;
  while (queue.length) {
    const state = queue.shift();
    const key = `${state.ordinal}:${state.delta}:${state.dynamic ? 1 : 0}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (visited.size > 10000) {
      dynamic = true;
      exits.add('analysis-bound');
      break;
    }
    const block = cfg.blocks[state.ordinal];
    let delta = state.delta;
    let isDynamic = state.dynamic;
    for (const info of block.words) {
      const effect = s1Effect(info);
      delta += effect.delta;
      isDynamic ||= effect.dynamic;
    }
    const traversable = block.edges.filter((edge) => edge.kind !== 'call-external' && edge.kind !== 'call-internal');
    if (!traversable.length) {
      exits.add('fallthrough-end');
      if (isDynamic) dynamic = true; else deltas.add(delta);
    }
    for (const edge of traversable) {
      if (edge.to === null || edge.to === undefined) {
        exits.add(edge.kind);
        if (isDynamic) dynamic = true; else deltas.add(delta);
        continue;
      }
      const targetOffset = cfg.blocks[edge.to].startIndex * 4;
      const tail = tails.offsets.get(targetOffset);
      if (tail) {
        exits.add(`tail:${tail}`);
        if (isDynamic) dynamic = true; else deltas.add(delta);
      } else queue.push({ ordinal: edge.to, delta, dynamic: isDynamic });
    }
  }
  return { deltas: [...deltas].sort((a, b) => a - b), dynamic, delayEffects, exits: [...exits].sort() };
}

function memoryLabel(info, constants) {
  const role = info.memory.load ? 'R' : 'W';
  const signed = info.memory.load && info.memory.signed !== null ? (info.memory.signed ? 's' : 'u') : '';
  const type = `${role}${signed}${info.memory.width * 8}`;
  if (constants.has(info.rs)) return `${type}@${hex((constants.get(info.rs) + info.signedImmediate) >>> 0)}`;
  const base = REGISTER_NAMES[info.rs] || `$${info.rs}`;
  return `${type}@${base}${info.signedImmediate < 0 ? '-' : '+'}${hex(Math.abs(info.signedImmediate), 4)}`;
}

function blockMemory(block) {
  const constants = new Map([[0, 0]]);
  const accesses = [];
  const streamReads = [];
  for (const info of block.words) {
    if (info.memory && info.rs !== 29) {
      accesses.push(memoryLabel(info, constants));
      if (info.memory.load && info.rs === 8 && info.signedImmediate > 0) {
        const signed = info.memory.signed === null ? 'unknown' : (info.memory.signed ? 'signed' : 'unsigned');
        streamReads.push(`+${hex(info.signedImmediate, 2)}:${info.memory.width * 8}-bit-${signed}`);
      }
    }
    const usage = registerUsage(info);
    for (const register of usage.writes) constants.delete(register);
    if (info.op === 0x0F) constants.set(info.rt, (info.immediate << 16) | 0);
    else if (info.op === 0x0D && constants.has(info.rs)) constants.set(info.rt, constants.get(info.rs) | info.immediate);
    else if (info.op === 0x09 && constants.has(info.rs)) constants.set(info.rt, (constants.get(info.rs) + info.signedImmediate) | 0);
    else if (info.op === 0 && info.funct === 0x21) {
      if (constants.has(info.rs) && constants.has(info.rt)) constants.set(info.rd, (constants.get(info.rs) + constants.get(info.rt)) | 0);
    }
  }
  return { accesses, streamReads };
}

function commandRows(target, spec, assembly, caseReport) {
  const entries = mapCommandEntries(target.expectedBytes, target.entryVram, spec.expectedDispatch, spec.commands, 'retail command');
  if (entries.length !== 153) throw new Error('accepted command set does not contain 153 values');
  const tails = {
    offsets: new Map(spec.expectedTails.flatMap((tail) => (Array.isArray(tail.offsets) ? tail.offsets : [tail.offset])
      .map((value) => [Number.parseInt(value, 0), tail.name]))),
  };
  const words = wordsFromBuffer(target.expectedBytes);
  const cfg = cfgForWords(words, target.entryVram);
  const actualByCommand = new Map((caseReport?.commands || []).map((row) => [row.command, row]));
  const details = entries.map((entry) => {
    const region = analyzeRegion(target.expectedBytes, target.entryVram, entry.entryOffset, tails, {
      symbolForAddress: (address) => assembly.symbolsByAddress.get(address >>> 0) || hex(address),
    });
    const blocks = region.blocks.map((block) => {
      const cfgBlock = cfg.blocks.find((candidate) => candidate.startIndex * 4 === block.offset);
      if (!cfgBlock) throw new Error(`region block is missing from retail CFG: ${block.offsetHex}`);
      return cfgBlock;
    });
    const memory = blocks.map(blockMemory);
    const cursor = cursorPaths(entry, cfg, tails, assembly.byOffset);
    const fixedArgs = !cursor.dynamic && cursor.deltas.length === 1 && cursor.deltas[0] >= 0 ? cursor.deltas[0] : null;
    const streamReads = [...new Set(memory.flatMap((row) => row.streamReads))].sort();
    const accesses = [...new Set(memory.flatMap((row) => row.accesses))].sort();
    const blockOffsets = region.blocks.map((block) => block.offset);
    const span = blockOffsets.length
      ? `${hex(Math.min(...blockOffsets), 4)}..${hex(Math.max(...region.blocks.map((block) => block.offset + block.words * 4)), 4)}`
      : `entry=${entry.entryOffsetHex}`;
    const actual = actualByCommand.get(entry.valueHex) || null;
    return {
      command: entry.valueHex,
      entryOffset: entry.entryOffsetHex,
      entryRom: hex(target.romStart + entry.entryOffset),
      entryVram: entry.entryVramHex,
      cfgRegion: `${span}; ${region.blocks.length} blocks`,
      cfgBlocks: region.blocks.map((block) => block.offsetHex),
      successors: entrySuccessors(entry.entryOffset, cfg, tails),
      streamArgumentCount: fixedArgs,
      streamWidthsSignedness: fixedArgs === null
        ? `unknown/variable; direct retail reads=${streamReads.join('|') || 'none isolated'}`
        : `${fixedArgs} x 32-bit stream slots; slot signedness unknown; direct retail reads=${streamReads.join('|') || 'none isolated'}`,
      cursorAdvancement: fixedArgs === null
        ? `unknown/variable before shared tail; observed deltas=${cursor.deltas.join('|') || 'dynamic'}`
        : `+${fixedArgs} argument slots before shared tail; normal continuation consumes +1 command slot`,
      dispatchDelayEffects: cursor.delayEffects,
      calls: region.calls.map((call) => ({ symbol: call.symbol, rom: hex(target.romStart + call.offset), live: hex(target.entryVram + call.offset) })),
      memoryGlobalAccesses: accesses,
      sharedExitTail: region.sharedTails.length ? region.sharedTails.join('|') : cursor.exits.join('|'),
      caseComparison: actual ? {
        actualEntryOffset: actual.actual.entryOffset,
        expectedBlocks: actual.expected.blockCount,
        actualBlocks: actual.actual.blockCount,
        expectedUnmatchedBlocks: actual.unmatchedBlocks.expected.length,
        actualUnmatchedBlocks: actual.unmatchedBlocks.actual.length,
        parity: actual.parity,
      } : null,
    };
  });
  return { details, cfg };
}

function parsePredecessorDeclarations(source) {
  const beforeFunction = source.slice(0, source.indexOf(`s32 ${SYMBOL}(void)`));
  const declarations = new Map();
  const pattern = /^\s*([A-Za-z_][\w\s]*?(?:\s*\*)?)\s+(func_[0-9A-Fa-f]+|resource_free)\s*\(([^;]*)\)\s*;/gm;
  let match;
  while ((match = pattern.exec(beforeFunction)) !== null) {
    declarations.set(match[2], `${normalizeSpace(match[1])} ${match[2]}(${normalizeSpace(match[3])})`);
  }
  return declarations;
}

function sourceSignatures(files, symbols) {
  const result = new Map(symbols.map((symbol) => [symbol, []]));
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const symbol of symbols) {
      if (!source.includes(symbol)) continue;
      const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`^\\s*((?:extern\\s+|static\\s+)?[A-Za-z_][\\w \\t]*(?:\\s*\\*)?)\\s*${escaped}\\s*\\(([^;{}]*)\\)\\s*([;{])`, 'gm');
      let match;
      while ((match = pattern.exec(source)) !== null) {
        result.get(symbol).push({
          signature: `${normalizeSpace(match[1].replace(/^(?:extern|static)\s+/, ''))} ${symbol}(${normalizeSpace(match[2])})`,
          kind: match[3] === '{' ? 'definition' : 'declaration',
          storage: /^\s*static\b/.test(match[1]) ? 'static' : (/^\s*extern\b/.test(match[1]) ? 'extern' : 'global'),
          file: path.relative(ROOT, file).replace(/\\/g, '/'),
        });
      }
    }
  }
  return result;
}

function callSiteAbi(call, assembly) {
  const rows = assembly.rows;
  const cfg = cfgForWords(rows.map((row) => row.word), rows[0].pc);
  const block = cfg.blocks.find((candidate) => call.index >= candidate.startIndex && call.index < candidate.endIndex);
  const start = block ? block.startIndex : Math.max(0, call.index - 16);
  const end = Math.min(rows.length - 1, call.index + 1);
  const written = new Set();
  let maxStackSlot = 0;
  for (let index = start; index <= end; index += 1) {
    const row = rows[index];
    for (const register of registerUsage(row.info).writes) if (register >= 4 && register <= 7) written.add(register);
    if (row.info.memory && !row.info.memory.load && row.info.rs === 29
        && row.info.signedImmediate >= 0x10 && row.info.signedImmediate <= 0x40) {
      maxStackSlot = Math.max(maxStackSlot, ((row.info.signedImmediate - 0x10) / 4) + 1);
    }
  }
  let returnUse = 'unknown';
  for (let index = call.index + 2; index < Math.min(rows.length, call.index + 8); index += 1) {
    const usage = registerUsage(rows[index].info);
    if (usage.reads.includes(2)) { returnUse = 'used'; break; }
    if (usage.writes.includes(2)) { returnUse = 'not-observed-before-overwrite'; break; }
    if (rows[index].info.control) break;
  }
  return {
    argumentRegisters: [...written].sort((a, b) => a - b).map((register) => REGISTER_NAMES[register]),
    stackArgumentSlots: maxStackSlot,
    minimumArgumentCount: Math.max(
      maxStackSlot ? 4 + maxStackSlot : 0,
      written.size ? Math.max(...written) - 3 : 0,
    ),
    returnUse,
  };
}

function prototypeRows(workbench, target, assembly, predecessor) {
  if (assembly.calls.length !== 145) throw new Error(`retail external-call count drift: ${assembly.calls.length}`);
  const metrics = targetMetrics(target.expectedBytes, target.entryVram);
  if (metrics.calls !== 145 || metrics.indirectCalls !== 0) throw new Error('retail call metrics no longer match the accepted 145 direct calls');
  const symbols = [...new Set(assembly.calls.map((call) => call.symbol))].sort();
  const signatures = sourceSignatures([
    ...walk(path.join(ROOT, 'src'), new Set(['.c'])),
    ...walk(path.join(ROOT, 'include'), new Set(['.h'])),
  ], symbols);
  const targetsByEntry = new Map();
  for (const row of workbench.targets) {
    const entry = row.entryVram >>> 0;
    if (!targetsByEntry.has(entry)) targetsByEntry.set(entry, []);
    targetsByEntry.get(entry).push(row);
  }
  const rows = symbols.map((symbol) => {
    const sites = assembly.calls.filter((call) => call.symbol === symbol);
    const siteOwners = sites.map((site) => targetsByEntry.get(site.info.target >>> 0) || []);
    const ambiguousOwners = [...new Set(siteOwners.filter((owners) => owners.length > 1).flat())];
    const acceptedTargets = [...new Set(siteOwners.filter((owners) => owners.length === 1).map((owners) => owners[0]))];
    const ownerResolution = ambiguousOwners.length
      ? `ambiguous:${ambiguousOwners.map((row) => row.symbol).sort().join('|')}`
      : acceptedTargets.length
        ? `unique:${acceptedTargets.map((row) => row.symbol).sort().join('|')}`
        : 'unmapped:no accepted entry at retail call target';
    const activeSources = ambiguousOwners.length ? []
      : [...new Set(acceptedTargets.map((row) => row.activeMatchingSource).filter(Boolean))];
    const found = signatures.get(symbol) || [];
    const definitions = found.filter((entry) => entry.kind === 'definition' && entry.storage !== 'static');
    const activeDefinitions = definitions.filter((entry) => activeSources.includes(entry.file));
    const preferred = activeDefinitions[0] || definitions[0] || null;
    const abis = sites.map((site) => callSiteAbi(site, assembly));
    const observedRegisters = [...new Set(abis.flatMap((abi) => abi.argumentRegisters))].sort();
    const observedStackSlots = [...new Set(abis.map((abi) => abi.stackArgumentSlots))].sort((a, b) => a - b);
    const observedMinimumArguments = [...new Set(abis.map((abi) => abi.minimumArgumentCount))].sort((a, b) => a - b);
    const returnUses = [...new Set(abis.map((abi) => abi.returnUse))].sort();
    let strength = 'weak:predecessor-declaration-and-call-site-only';
    if (preferred && activeDefinitions.length) strength = 'strong:accepted-linked-C-definition';
    else if (preferred && FIXED_NEIGHBORS.has(symbol)) strength = 'strong:fixed-neighbor-definition';
    else if (preferred) strength = 'moderate:repository-C-definition-linkage-unconfirmed';
    else if (!predecessor.has(symbol)) strength = 'unknown:no-C-prototype-evidence';
    const declaration = predecessor.get(symbol) || null;
    const preferredShape = prototypeShape(preferred?.signature, symbol);
    const declarationShape = prototypeShape(declaration, symbol);
    const materializedArguments = Math.max(...observedMinimumArguments);
    let recommended = preferred?.signature || declaration;
    let callSiteExtension = false;
    if (preferredShape && materializedArguments > preferredShape.parameters.length) {
      const extra = declarationShape?.parameters.slice(preferredShape.parameters.length, materializedArguments) || [];
      while (extra.length < materializedArguments - preferredShape.parameters.length) extra.push('unknown');
      recommended = renderPrototype(symbol, {
        returnType: preferredShape.returnType,
        parameters: [...preferredShape.parameters, ...extra],
      });
      callSiteExtension = true;
      strength = 'strong:accepted-definition-plus-retail-call-site-extension';
    }
    const discrepancies = [];
    if (!declaration) discrepancies.push('predecessor declaration missing');
    if (preferred && declaration
        && canonicalPrototype(preferred.signature, symbol) !== canonicalPrototype(declaration, symbol)) {
      discrepancies.push('predecessor differs from strongest C definition');
    }
    if (ambiguousOwners.length) discrepancies.push('call target maps to multiple accepted entry owners');
    else if (!acceptedTargets.length) discrepancies.push('call target not mapped to accepted entry metadata');
    if (!preferred) discrepancies.push('return/parameter types remain unconfirmed');
    if (callSiteExtension) {
      discrepancies.push(`retail call materializes ${materializedArguments} arguments but accepted definition exposes ${preferredShape.parameters.length}`);
    }
    return {
      symbol,
      targetVram: sites[0].info.target === null ? null : hex(sites[0].info.target),
      acceptedSymbols: acceptedTargets.map((row) => row.symbol).join('|') || null,
      acceptedOwnerResolution: ownerResolution,
      retailCallCount: sites.length,
      callSitesRom: sites.map((site) => hex(site.rom)).join('|'),
      observedArgumentRegisters: observedRegisters.join('|') || 'none isolated',
      observedStackArgumentSlots: observedStackSlots.join('|'),
      observedMinimumArgumentCount: observedMinimumArguments.join('|'),
      observedReturnUse: returnUses.join('|'),
      predecessorDeclaration: declaration,
      strongestRepositoryDefinition: preferred ? `${preferred.signature} [${preferred.file}]` : null,
      linkageEvidence: activeSources.join('|') || 'no active matching-C owner mapped',
      evidenceStrength: strength,
      recommendedPrototype: recommended,
      discrepancies: discrepancies.join('; ') || 'none',
    };
  });
  return rows;
}

function main() {
  const caseReportIndex = process.argv.indexOf('--case-report');
  const caseReportPath = caseReportIndex >= 0 ? path.resolve(process.argv[caseReportIndex + 1]) : null;
  if (caseReportIndex >= 0 && (!process.argv[caseReportIndex + 1] || !fs.existsSync(caseReportPath))) {
    throw new Error('--case-report must name an existing case-aware report');
  }
  const workbench = loadWorkbenchModel();
  const target = resolveTarget(workbench, SYMBOL);
  const spec = readJson(SPEC_PATH);
  const assembly = parseAssembly(ASM_PATH, target);
  const caseReport = caseReportPath ? readJson(caseReportPath) : null;
  const command = commandRows(target, spec, assembly, caseReport);
  const predecessorSource = fs.readFileSync(PREDECESSOR_PATH, 'utf8');
  const predecessor = parsePredecessorDeclarations(predecessorSource);
  const prototypes = prototypeRows(workbench, target, assembly, predecessor);
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(DETAIL_PATH), { recursive: true });
  const commandColumns = [
    'command', 'retail_rom_entry', 'live_entry', 'cfg_region', 'cfg_blocks', 'successors',
    'stream_argument_count', 'stream_widths_signedness', 'cursor_advancement', 'external_calls',
    'important_memory_global_accesses', 'shared_exit_tail', 'expected_block_count', 'candidate_block_count',
    'block_count_parity', 'call_parity', 'successor_parity', 'shared_tail_convergence',
    'normalized_block_parity', 'expected_unmatched_blocks', 'candidate_unmatched_blocks',
  ];
  writeCsv(COMMAND_CSV, commandColumns, command.details.map((row) => ({
    command: row.command,
    retail_rom_entry: row.entryRom,
    live_entry: row.entryVram,
    cfg_region: row.cfgRegion,
    cfg_blocks: row.cfgBlocks.join('|') || 'none before shared tail',
    successors: row.successors.join('|') || 'unknown',
    stream_argument_count: row.streamArgumentCount,
    stream_widths_signedness: row.streamWidthsSignedness,
    cursor_advancement: row.cursorAdvancement,
    external_calls: row.calls.map((call) => `${call.symbol}@${call.rom}`).join('|') || 'none',
    important_memory_global_accesses: row.memoryGlobalAccesses.join('|') || 'none isolated',
    shared_exit_tail: row.sharedExitTail || 'unknown',
    expected_block_count: row.caseComparison ? row.caseComparison.expectedBlocks : 'not compared',
    candidate_block_count: row.caseComparison ? row.caseComparison.actualBlocks : 'not compared',
    block_count_parity: row.caseComparison ? row.caseComparison.parity.blockCount : 'not compared',
    call_parity: row.caseComparison ? row.caseComparison.parity.calls : 'not compared',
    successor_parity: row.caseComparison ? row.caseComparison.parity.successors : 'not compared',
    shared_tail_convergence: row.caseComparison ? row.caseComparison.parity.sharedTailConvergence : 'not compared',
    normalized_block_parity: row.caseComparison ? row.caseComparison.parity.normalizedBlocks : 'not compared',
    expected_unmatched_blocks: row.caseComparison ? row.caseComparison.expectedUnmatchedBlocks : 'not compared',
    candidate_unmatched_blocks: row.caseComparison ? row.caseComparison.actualUnmatchedBlocks : 'not compared',
  })));
  const prototypeColumns = [
    'symbol', 'target_vram', 'accepted_symbols', 'accepted_owner_resolution', 'retail_call_count', 'call_sites_rom',
    'observed_argument_registers', 'observed_stack_argument_slots', 'observed_minimum_argument_count',
    'observed_return_use',
    'predecessor_declaration', 'strongest_repository_definition', 'linkage_evidence',
    'evidence_strength', 'recommended_prototype', 'discrepancies',
  ];
  writeCsv(PROTOTYPE_CSV, prototypeColumns, prototypes.map((row) => ({
    symbol: row.symbol,
    target_vram: row.targetVram,
    accepted_symbols: row.acceptedSymbols,
    accepted_owner_resolution: row.acceptedOwnerResolution,
    retail_call_count: row.retailCallCount,
    call_sites_rom: row.callSitesRom,
    observed_argument_registers: row.observedArgumentRegisters,
    observed_stack_argument_slots: row.observedStackArgumentSlots,
    observed_minimum_argument_count: row.observedMinimumArgumentCount,
    observed_return_use: row.observedReturnUse,
    predecessor_declaration: row.predecessorDeclaration,
    strongest_repository_definition: row.strongestRepositoryDefinition,
    linkage_evidence: row.linkageEvidence,
    evidence_strength: row.evidenceStrength,
    recommended_prototype: row.recommendedPrototype,
    discrepancies: row.discrepancies,
  })));
  const retailMetrics = targetMetrics(target.expectedBytes, target.entryVram);
  const summary = {
    schemaVersion: 1,
    symbol: SYMBOL,
    acceptedBoundary: { rom: `${hex(target.romStart)}..${hex(target.romEndExclusive)}`, live: `${hex(target.vramStart)}..${hex(target.vramEndExclusive)}`, bytes: target.bytes },
    commands: {
      requested: spec.commands.length,
      uniquelyMapped: command.details.length,
      withKnownFixedArgumentCount: command.details.filter((row) => row.streamArgumentCount !== null).length,
      withExternalCalls: command.details.filter((row) => row.calls.length).length,
      withMemoryAccessEvidence: command.details.filter((row) => row.memoryGlobalAccesses.length).length,
    },
    prototypes: {
      retailCallSites: assembly.calls.length,
      uniqueCallees: prototypes.length,
      callSitesRepresented: prototypes.reduce((sum, row) => sum + row.retailCallCount, 0),
      uniqueAcceptedOwnerCallees: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('unique:')).length,
      uniqueAcceptedOwnerCallSites: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('unique:'))
        .reduce((sum, row) => sum + row.retailCallCount, 0),
      unmappedOwnerCallees: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('unmapped:')).length,
      unmappedOwnerCallSites: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('unmapped:'))
        .reduce((sum, row) => sum + row.retailCallCount, 0),
      ambiguousOwnerCallees: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('ambiguous:')).length,
      ambiguousOwnerCallSites: prototypes.filter((row) => row.acceptedOwnerResolution.startsWith('ambiguous:'))
        .reduce((sum, row) => sum + row.retailCallCount, 0),
      strong: prototypes.filter((row) => row.evidenceStrength.startsWith('strong:')).length,
      moderate: prototypes.filter((row) => row.evidenceStrength.startsWith('moderate:')).length,
      weak: prototypes.filter((row) => row.evidenceStrength.startsWith('weak:')).length,
      unknown: prototypes.filter((row) => row.evidenceStrength.startsWith('unknown:')).length,
      predecessorDisagreementsWithStrongestDefinition: prototypes.filter((row) => row.discrepancies.includes('predecessor differs')).length,
    },
    retailMetrics: {
      instructions: retailMetrics.instructions,
      blocks: retailMetrics.blocks,
      edges: retailMetrics.edges,
      calls: retailMetrics.calls,
      indirectCalls: retailMetrics.indirectCalls,
      indirectJumps: retailMetrics.indirectJumps,
      branches: retailMetrics.branches,
      memoryOperations: retailMetrics.memoryOperations,
      floatingPoint: retailMetrics.floatingPoint,
      leaf: retailMetrics.leaf,
      frameSize: retailMetrics.frameSize,
      stackMemoryReferences: retailMetrics.stackOffsets.length,
    },
    caseReport: caseReportPath ? path.relative(ROOT, caseReportPath).replace(/\\/g, '/') : null,
    evidenceBoundary: 'Static retail/control-flow evidence only. Unknown entries are intentional; this report does not establish behavior names, matching C, linked ownership, or full-ROM identity.',
  };
  fs.writeFileSync(SUMMARY_JSON, `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(DETAIL_PATH, `${JSON.stringify({ schemaVersion: 1, summary, commands: command.details, prototypes }, null, 2)}\n`);
  console.log(JSON.stringify({
    commandMap: path.relative(ROOT, COMMAND_CSV).replace(/\\/g, '/'),
    prototypeLedger: path.relative(ROOT, PROTOTYPE_CSV).replace(/\\/g, '/'),
    summary: path.relative(ROOT, SUMMARY_JSON).replace(/\\/g, '/'),
    detail: path.relative(ROOT, DETAIL_PATH).replace(/\\/g, '/'),
    coverage: summary,
  }, null, 2));
}

main();
