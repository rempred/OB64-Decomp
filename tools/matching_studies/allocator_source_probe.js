#!/usr/bin/env node
'use strict';

// One diagnostic source probe for func_002158E4. This intentionally avoids
// the ordinary compilation/source-policy modules while those contracts are
// changing. Research-compiler output is used only after byte-for-byte parity
// with the authenticated production compiler.

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT_ROOT = path.join(ROOT, 'build', 'allocator-source-probe');
const REPORT_FILE = path.join(OUTPUT_ROOT, 'report.json');
const SECTION = '.ob64.r4002';

const ARCHIVED_SOURCE = path.join(
  ROOT,
  'docs',
  'archive',
  'matching-c-candidates',
  '2026-09-03-func_002158E4-a493a3ded3.c',
);
const ACCEPTED_TRACE_REPORT = path.join(ROOT, 'build', 'scheduler-trace', 'report.json');
const BASELINE_RUN = path.join(
  ROOT,
  'build',
  'matching-studies',
  'allocator-owner-order',
  'runs',
  '19FC495A6CEE0D18CED020757A2D71474FFA94A6D0A2740458B4DED9CEB446A8',
);
const EXACT_ORACLE_RUN = path.join(
  ROOT,
  'build',
  'matching-studies',
  'allocator-owner-order',
  'runs',
  '2D579D5163268845F1F571974FEA882430575D85C6F4F8688CA354FDFCD548AF',
);
const BINUTILS = path.join(
  ROOT,
  '.toolchains',
  'gnu-binutils-2.6-mips-kmc-elf-msys2',
  'bin',
);

const EXPECTED = Object.freeze({
  sourceSha256: 'C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1',
  acceptedTraceReportSha256: '61B528A347219ADFE776A7CAB1CEABE4B76A7643BADF84F8676CE751FE2551D0',
  productionCompilerSha256: 'F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6',
  researchCompilerSha256: 'F675E352B9C9505AB821ED358755E5329BE01D8A6B50ADE57C07DE50F5A4447F',
  instrumentationId: '6EDFDE806E62D97C9B6A7C085B94832D9420234B02CBDC87C898954D7EFBF7F1',
  assemblerSha256: '0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C',
  linkerSha256: '48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F',
  objdumpSha256: '5F5B5822691BFAD87E628BCE4C781459902E4124AB7ED6604CA2DB62075D9816',
  baselineCompilerAssemblySha256: '9FD127B2E165F1D6495E21ABE97E6C2EF0978C9BF3D0AAB5D01D9A65C29E7D74',
  baselineAdjustedAssemblySha256: '6107F53DAB0A2E611E67A571D0021E45B44C0057878B74E30F699B37DFBFBBCE',
  baselineObjectSha256: '8166B518268ABA3C409D5E9ABF7F997B3703E7A9CC70DDE20BE16730B02EA61E',
  linkerScriptSha256: '5096BC4C923BED1F5940EEE5B1B1AD812B2000435F81FA95D6E91B745DC5A6F2',
  exactOracleElfSha256: 'EF1C90BCE33E90D766C292E140620CD029B5AA8CF423C577389F5B0E3B54647A',
  targetBytesSha256: '2F0A1C6BC565B80B40015D55DD7944DC2C2C842E488763608D932D9BBCE6A8BD',
  targetBytes: 236,
  targetVram: '0x801D2614',
  baselineTextSha256: '32630296E7707E4AA6AF916B5CC86CB767D9FAFE72B6AF39AA679A21F3CA353C',
  baselineRelocationCount: 27,
  baselineRelocationSha256: 'C0C8E70E92B86ED0114A528D8AF5B1F66E0C01B4407586702A37C0871CF25C45',
  baselineEmittedStateSha256: '7AB4A8AFA47CB78EB730FAF409263BDB76EA77055DD20A5C144B3AB4AAD67F75',
  doWhileEmittedStateSha256: '30D1EAA445D0F491313CE4621EA9F0F34774348DA9FBAD01F85885B36CBA79EA',
  baselineResidualInstructions: 3,
});

const COMPILER_FLAGS = Object.freeze([
  '-quiet',
  '-O2',
  '-meb',
  '-mips3',
  '-mgp32',
  '-mfp32',
  '-G',
  '0',
  '-fno-PIC',
  '-mno-abicalls',
  '-fno-builtin',
  '-funsigned-char',
]);
const ASSEMBLER_FLAGS = Object.freeze([
  '-G',
  '0',
  '-mips3',
  '-mabi=32',
  '-force-n64align',
  '-EB',
]);
const LINKER_FLAGS = Object.freeze(['-EB', '-m', 'elf32bmip']);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function sha256File(file) {
  return sha256(fs.readFileSync(file));
}

function shown(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function requireIdentity(label, actual, expected) {
  if (String(actual).toUpperCase() !== String(expected).toUpperCase()) {
    throw new Error(`${label} identity drift: expected ${expected}, observed ${actual}`);
  }
  return actual;
}

function replaceExactly(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0 || source.indexOf(needle, first + 1) >= 0) {
    throw new Error(`${label} transform anchor census is not one`);
  }
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

function runTool(label, executable, args, options = {}) {
  const result = childProcess.spawnSync(executable, args, {
    cwd: options.cwd || ROOT,
    env: options.env || process.env,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 128 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} exited ${result.status}: ${String(result.stderr || result.stdout).trim()}`);
  }
  return { stdout: String(result.stdout || ''), stderr: String(result.stderr || '') };
}

function copyArtifact(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function makeProbeSource(source) {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  let result = replaceExactly(
    source,
    `    u8 *snapshot;${newline}`,
    `    u8 *snapshot;${newline}    void *allocation;${newline}`,
    'allocation declaration',
  );
  result = replaceExactly(
    result,
    `    snapshot = func_80070F30(0x6094);${newline}    owner = D_801CE8BC;`,
    `    allocation = func_80070F30(0x6094);${newline}    owner = D_801CE8BC;${newline}    snapshot = allocation;`,
    'sequential carrier statements',
  );
  return result;
}

function diagnosticSourceScan(source) {
  const forbidden = [
    { label: 'assembler keyword', pattern: /\b(?:asm|__asm|__asm__)\b/ },
    { label: 'assembler include', pattern: /^\s*#\s*include\s*[<"][^>"]+\.(?:s|asm)[>"]/im },
  ];
  const matches = forbidden.filter((record) => record.pattern.test(source)).map((record) => record.label);
  requireCondition(matches.length === 0, `diagnostic source contains an assembler escape token: ${matches.join(', ')}`);
  return {
    result: 'no-assembler-escape-token-observed',
    officialSourceClass: null,
    boundary: 'This lexical diagnostic is not the source-policy classifier and makes no official PURE_C claim.',
  };
}

function replaceTextSection(assembly) {
  const matches = assembly.match(/^\t\.text\r?$/gm) || [];
  requireCondition(matches.length === 1, `compiler assembly .text anchor census is ${matches.length}, expected one`);
  return assembly.replace(
    /^(\t)\.text(\r?)$/m,
    `$1.section\t${SECTION},"ax",@progbits$2`,
  );
}

function parseRelocations(text) {
  const records = [];
  for (const line of String(text).split(/\r?\n/)) {
    const match = /^\s*([0-9A-Fa-f]{8})\s+(R_MIPS_[A-Z0-9_]+)\s+(\S+)\s*$/.exec(line);
    if (match) {
      records.push({
        offset: `0x${match[1].toUpperCase()}`,
        type: match[2],
        symbol: match[3],
        section: '.rel.text',
      });
    } else if (line.includes('R_MIPS_')) {
      throw new Error(`unparsed relocation line: ${line}`);
    }
  }
  requireCondition(records.length > 0, 'object has no parsed target relocations');
  return records;
}

function canonicalRelocation(relocation) {
  const ordered = {};
  for (const key of Object.keys(relocation).sort()) ordered[key] = relocation[key];
  return ordered;
}

function canonicalEmittedState(objectText, relocations) {
  requireCondition(Buffer.isBuffer(objectText) && objectText.length % 4 === 0, 'object text must be an aligned Buffer');
  const byOffset = new Map();
  const canonicalRelocations = relocations.map(canonicalRelocation).sort((left, right) => {
    const leftOffset = Number.parseInt(left.offset, 16);
    const rightOffset = Number.parseInt(right.offset, 16);
    return leftOffset - rightOffset || canonicalJson(left).localeCompare(canonicalJson(right));
  });
  for (const relocation of canonicalRelocations) {
    const offset = Number.parseInt(relocation.offset, 16);
    requireCondition(
      Number.isInteger(offset) && offset >= 0 && offset % 4 === 0 && offset < objectText.length && !byOffset.has(offset),
      `malformed or duplicate emitted-state relocation at ${relocation.offset}`,
    );
    byOffset.set(offset, relocation);
  }
  const instructions = [];
  for (let offset = 0; offset < objectText.length; offset += 4) {
    instructions.push({
      offset,
      word: objectText.readUInt32BE(offset).toString(16).padStart(8, '0'),
      relocation: byOffset.get(offset) || null,
    });
  }
  const identity = { schemaVersion: 1, bytes: objectText.length, instructions };
  return {
    ...identity,
    objectTextSha256: sha256(objectText),
    relocationCount: canonicalRelocations.length,
    relocationSha256: sha256(Buffer.from(canonicalJson(canonicalRelocations), 'utf8')),
    emittedStateSha256: sha256(Buffer.from(canonicalJson(identity), 'utf8')),
  };
}

function extractSection(tools, input, output, label) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const dump = runTool(label, tools.objdump, ['-s', '-j', SECTION, input]).stdout;
  requireCondition(dump.includes(`Contents of section ${SECTION}:`), `${label} did not report ${SECTION}`);
  const words = [];
  for (const line of dump.split(/\r?\n/)) {
    const prefix = /^\s*[0-9A-Fa-f]+\s+/.exec(line);
    if (!prefix) continue;
    const pieces = line.slice(prefix[0].length, prefix[0].length + 35).trim().split(/\s+/).filter(Boolean);
    requireCondition(pieces.length <= 4 && pieces.every((piece) => /^[0-9A-Fa-f]{8}$/.test(piece)), `malformed ${label} data row: ${line}`);
    words.push(...pieces);
  }
  requireCondition(words.length > 0, `${label} produced no section words`);
  const bytes = Buffer.from(words.join(''), 'hex');
  fs.writeFileSync(output, bytes);
  fs.writeFileSync(`${output}.objdump.txt`, dump, 'utf8');
  return bytes;
}

function inspectObject(tools, objectFile, outputDirectory) {
  const textFile = path.join(outputDirectory, 'candidate.text.bin');
  const objectText = extractSection(tools, objectFile, textFile, 'target section extraction');
  const relocationDump = runTool(
    'target relocation dump',
    tools.objdump,
    ['-r', '-j', SECTION, objectFile],
  ).stdout;
  const relocationFile = path.join(outputDirectory, 'candidate.relocations.txt');
  fs.writeFileSync(relocationFile, relocationDump, 'utf8');
  const relocations = parseRelocations(relocationDump);
  return {
    objectText,
    relocations,
    state: canonicalEmittedState(objectText, relocations),
    artifacts: {
      object: shown(objectFile),
      objectSha256: sha256File(objectFile),
      text: shown(textFile),
      relocations: shown(relocationFile),
    },
  };
}

function parseTrace(text) {
  const records = [];
  for (const line of String(text).split(/\r?\n/)) {
    if (!line.startsWith('OB64TRACE|')) continue;
    const pieces = line.split('|');
    if (pieces.length < 3 || pieces[0] !== 'OB64TRACE' || !/^[a-z-]+$/.test(pieces[1])) {
      throw new Error(`malformed research trace line: ${line}`);
    }
    const record = { type: pieces[1], traceLine: line };
    for (const piece of pieces.slice(2)) {
      const separator = piece.indexOf('=');
      if (separator <= 0) throw new Error(`malformed research trace field: ${line}`);
      const key = piece.slice(0, separator);
      const rawValue = piece.slice(separator + 1);
      if (!/^[a-z][a-z0-9_]*$/.test(key) || Object.prototype.hasOwnProperty.call(record, key) || !rawValue) {
        throw new Error(`invalid research trace field: ${line}`);
      }
      record[key] = /^-?\d+$/.test(rawValue) ? Number(rawValue) : rawValue;
    }
    if (record.type === 'error') throw new Error(`research compiler reported ${record.reason || 'an internal trace error'}`);
    requireCondition(Number.isSafeInteger(record.seq) && record.seq > 0, `research trace record lacks a positive sequence: ${line}`);
    records.push(record);
  }
  requireCondition(records.length > 0, 'research compiler produced no OB64TRACE records');
  for (const domain of [new Set(['emit', 'call-copy']), new Set(['cost', 'rank', 'select'])]) {
    let previous = 0;
    for (const record of records.filter((item) => domain.has(item.type))) {
      requireCondition(record.seq > previous, `research trace sequence is not increasing at: ${record.traceLine}`);
      previous = record.seq;
    }
  }
  return records;
}

function sideForKind(rank, kind) {
  if (rank.xkind === kind) {
    return { uid: rank.x, luid: rank.xluid, priority: rank.xpriority, link: rank.xlink, raw: rank.xraw, cost: rank.xcost, class: rank.xclass };
  }
  if (rank.ykind === kind) {
    return { uid: rank.y, luid: rank.yluid, priority: rank.ypriority, link: rank.ylink, raw: rank.yraw, cost: rank.ycost, class: rank.yclass };
  }
  return null;
}

function analyzeCreationOrder(records) {
  const emissions = records.filter((record) => record.type === 'emit');
  const copies = records.filter((record) => record.type === 'call-copy');
  const sites = [];
  let previousCopySequence = 0;
  for (const copy of copies) {
    const precedingCalls = emissions.filter((record) => record.kind === 'allocator-call'
      && record.seq > previousCopySequence && record.seq < copy.seq);
    previousCopySequence = copy.seq;
    if (!precedingCalls.length) continue;
    sites.push({ call: precedingCalls.at(-1), copy });
  }
  requireCondition(sites.length === 1, `allocator result-copy site census is ${sites.length}, expected one`);
  return sites.map(({ call, copy }, index) => {
    const end = sites[index + 1]?.copy.seq ?? Number.POSITIVE_INFINITY;
    const owner = emissions.find((record) => record.kind === 'owner-load' && record.seq > call.seq && record.seq < end);
    const context = emissions.find((record) => record.kind === 'context-load' && record.seq > call.seq && record.seq < end);
    const save = emissions.find((record) => record.kind === 'return-save' && record.uid === copy.uid && record.seq > call.seq && record.seq < end);
    requireCondition(copy && save && owner, `direct RTL creation evidence is incomplete at allocator site ${index + 1}`);
    const observed = [
      { kind: 'allocator-call', seq: call.seq },
      { kind: 'return-save', seq: save.seq },
      { kind: 'calls-result-copy', seq: copy.seq },
      { kind: 'owner-load', seq: owner.seq },
    ].sort((left, right) => left.seq - right.seq).map((record) => record.kind);
    return {
      site: index + 1,
      allocatorCall: { seq: call.seq, uid: call.uid },
      returnSave: { seq: save.seq, uid: save.uid, destination: save.dest, source: save.src },
      callsResultCopy: { seq: copy.seq, uid: copy.uid, destination: copy.dest, source: copy.src, path: copy.path },
      ownerLoad: { seq: owner.seq, uid: owner.uid },
      contextLoad: context ? { seq: context.seq, uid: context.uid } : null,
      directlyObservedOrder: observed,
    };
  });
}

function schedulerPairs(records) {
  const candidateRanks = records.filter((record) => record.type === 'rank'
    && record.reload === 1
    && new Set([record.xkind, record.ykind]).size === 2
    && [record.xkind, record.ykind].includes('owner-load')
    && [record.xkind, record.ykind].includes('return-save'));
  const unique = new Map();
  for (const rank of candidateRanks) {
    const owner = sideForKind(rank, 'owner-load');
    const save = sideForKind(rank, 'return-save');
    unique.set(`${rank.last}:${owner.uid}:${save.uid}`, rank);
  }
  return [...unique.values()].map((rank, index) => {
    const owner = sideForKind(rank, 'owner-load');
    const save = sideForKind(rank, 'return-save');
    const costs = records.filter((record) => record.type === 'cost' && record.reload === 1
      && record.insn === save.uid && record.used === rank.last && record.kind === 14);
    const adjustment = costs.find((record) => record.adjusted === 0 && record.final === 1) || null;
    const selection = records.find((record) => record.type === 'select' && record.reload === 1
      && record.last === rank.last && record.selected === owner.uid) || null;
    return {
      site: index + 1,
      last: { uid: rank.last, kind: rank.lastkind },
      owner,
      returnSave: save,
      comparator: { clause: rank.clause, result: rank.result, preferred: rank.preferred, preferredKind: rank.preferredkind },
      adjustment: adjustment ? {
        linkKind: adjustment.kind,
        rawCost: adjustment.raw,
        postAdjustCost: adjustment.adjusted,
        effectiveCost: adjustment.final,
        freeBefore: adjustment.free_before,
        freeAfter: adjustment.free_after,
      } : null,
      selected: selection ? { uid: selection.selected, kind: selection.selectedkind, clock: selection.clock, ready: selection.ready } : null,
      directTraceLines: [adjustment?.traceLine, rank.traceLine, selection?.traceLine].filter(Boolean),
    };
  });
}

function semanticSchedulerEvidence(records) {
  const semantic = new Set(['owner-load', 'return-save', 'context-load']);
  const dependencies = new Map();
  for (const record of records.filter((item) => item.type === 'cost' && item.reload === 1
    && item.kind === 0 && item.final > 1
    && semantic.has(item.insnkind) && semantic.has(item.usedkind))) {
    const key = `${record.insn}:${record.used}:${record.kind}`;
    const prior = dependencies.get(key);
    if (!prior || (prior.adjusted < 0 && record.adjusted >= 0)) dependencies.set(key, record);
  }
  return {
    nonFreeTrueDependencies: [...dependencies.values()].map((record) => ({
      insn: { uid: record.insn, kind: record.insnkind },
      used: { uid: record.used, kind: record.usedkind },
      linkKind: record.kind,
      rawCost: record.raw,
      postAdjustCost: record.adjusted,
      effectiveCost: record.final,
      directTraceLine: record.traceLine,
    })),
    semanticSelections: records.filter((record) => record.type === 'select' && record.reload === 1
      && semantic.has(record.lastkind) && semantic.has(record.selectedkind)).map((record) => ({
      clock: record.clock,
      last: { uid: record.last, kind: record.lastkind },
      selected: { uid: record.selected, kind: record.selectedkind },
      ready: record.ready,
      directTraceLine: record.traceLine,
    })),
  };
}

function traceSignature(creationOrder, pairs, semantic) {
  const identity = {
    creationOrder: creationOrder.map((site) => ({
      order: site.directlyObservedOrder,
      returnSaveSource: site.returnSave.source,
      callsResultCopy: {
        source: site.callsResultCopy.source,
        path: site.callsResultCopy.path,
      },
      saveAndCopyShareDestination: site.returnSave.destination === site.callsResultCopy.destination,
    })),
    schedulerPairs: pairs.map((pair) => ({
      lastKind: pair.last.kind,
      owner: {
        luidDeltaFromSave: pair.owner.luid - pair.returnSave.luid,
        priority: pair.owner.priority,
        link: pair.owner.link,
        raw: pair.owner.raw,
        cost: pair.owner.cost,
        class: pair.owner.class,
      },
      returnSave: {
        priority: pair.returnSave.priority,
        link: pair.returnSave.link,
        raw: pair.returnSave.raw,
        cost: pair.returnSave.cost,
        class: pair.returnSave.class,
      },
      comparator: {
        clause: pair.comparator.clause,
        resultSign: Math.sign(pair.comparator.result),
        preferredKind: pair.comparator.preferredKind,
      },
      adjustment: pair.adjustment ? {
        linkKind: pair.adjustment.linkKind,
        rawCost: pair.adjustment.rawCost,
        postAdjustCost: pair.adjustment.postAdjustCost,
        effectiveCost: pair.adjustment.effectiveCost,
        freeBefore: pair.adjustment.freeBefore,
        freeAfter: pair.adjustment.freeAfter,
      } : null,
      selectedKind: pair.selected?.kind || null,
      ready: pair.selected?.ready ?? null,
    })),
    nonFreeTrueDependencies: semantic.nonFreeTrueDependencies.map((record) => ({
      insnKind: record.insn.kind,
      usedKind: record.used.kind,
      linkKind: record.linkKind,
      rawCost: record.rawCost,
      postAdjustCost: record.postAdjustCost,
      effectiveCost: record.effectiveCost,
    })),
    semanticSelections: semantic.semanticSelections.map((record) => ({
      lastKind: record.last.kind,
      selectedKind: record.selected.kind,
      ready: record.ready,
    })),
  };
  return { identity, sha256: sha256(Buffer.from(canonicalJson(identity), 'utf8')) };
}

function creationIdentitySignature(creationOrder) {
  const identity = creationOrder.map((site) => ({
    allocatorCall: site.allocatorCall,
    returnSave: site.returnSave,
    callsResultCopy: site.callsResultCopy,
    ownerLoad: site.ownerLoad,
    contextLoad: site.contextLoad,
    order: site.directlyObservedOrder,
  }));
  return { identity, sha256: sha256(Buffer.from(canonicalJson(identity), 'utf8')) };
}

function contiguousRegions(offsets) {
  const regions = [];
  for (const offset of [...new Set(offsets)].sort((left, right) => left - right)) {
    const prior = regions.at(-1);
    if (prior && prior.offset + prior.bytes === offset) prior.bytes += 4;
    else regions.push({ offset, bytes: 4 });
  }
  return regions;
}

function compareLinkedBytes(actual, expected) {
  const differingByteOffsets = [];
  const length = Math.max(actual.length, expected.length);
  for (let index = 0; index < length; index += 1) {
    if (actual[index] !== expected[index]) differingByteOffsets.push(index);
  }
  const differingInstructionOffsets = [...new Set(differingByteOffsets.map((offset) => Math.floor(offset / 4) * 4))]
    .sort((left, right) => left - right);
  return {
    exact: actual.length === expected.length && differingByteOffsets.length === 0,
    expectedBytes: expected.length,
    actualBytes: actual.length,
    differingBytes: differingByteOffsets.length,
    differingInstructionCount: differingInstructionOffsets.length,
    differingInstructionOffsets: differingInstructionOffsets.map((offset) => `0x${offset.toString(16).toUpperCase().padStart(8, '0')}`),
    residualRegions: contiguousRegions(differingInstructionOffsets).map((record) => ({
      offset: `0x${record.offset.toString(16).toUpperCase().padStart(8, '0')}`,
      bytes: record.bytes,
    })),
  };
}

function compileOne({ tools, compiler, sourceFile, scratch, destination, trace }) {
  fs.mkdirSync(scratch, { recursive: true });
  fs.mkdirSync(destination, { recursive: true });
  const compilerAssembly = path.join(scratch, 'candidate.compiler.s');
  const adjustedAssembly = path.join(scratch, 'candidate.s');
  const objectFile = path.join(scratch, 'candidate.o');
  const environment = { ...process.env };
  if (trace) environment.OB64_SCHED_TRACE = '1';
  else delete environment.OB64_SCHED_TRACE;
  const compile = runTool(
    `${trace ? 'research' : 'production'} compiler`,
    compiler,
    [...COMPILER_FLAGS, '-o', compilerAssembly, shown(sourceFile)],
    { cwd: ROOT, env: environment },
  );
  if (!trace) requireCondition(!compile.stderr.includes('OB64TRACE|'), 'production compiler unexpectedly emitted research trace records');
  const adjusted = replaceTextSection(fs.readFileSync(compilerAssembly, 'utf8'));
  fs.writeFileSync(adjustedAssembly, adjusted, 'utf8');
  const assemble = runTool(
    `${trace ? 'research' : 'production'} assembler`,
    tools.assembler,
    [...ASSEMBLER_FLAGS, '-o', objectFile, adjustedAssembly],
    { cwd: scratch },
  );
  const names = ['candidate.compiler.s', 'candidate.s', 'candidate.o'];
  for (const name of names) copyArtifact(path.join(scratch, name), path.join(destination, name));
  fs.writeFileSync(path.join(destination, 'compiler.stdout.log'), compile.stdout, 'utf8');
  fs.writeFileSync(path.join(destination, 'compiler.stderr.log'), compile.stderr, 'utf8');
  fs.writeFileSync(path.join(destination, 'assembler.stdout.log'), assemble.stdout, 'utf8');
  fs.writeFileSync(path.join(destination, 'assembler.stderr.log'), assemble.stderr, 'utf8');
  const inspected = inspectObject(tools, path.join(destination, 'candidate.o'), destination);
  return {
    compilerAssembly: fs.readFileSync(path.join(destination, 'candidate.compiler.s')),
    adjustedAssembly: fs.readFileSync(path.join(destination, 'candidate.s')),
    object: fs.readFileSync(path.join(destination, 'candidate.o')),
    compilerStderr: compile.stderr,
    inspected,
  };
}

function assertParity(production, research) {
  const parity = {
    compilerAssemblyExact: production.compilerAssembly.equals(research.compilerAssembly),
    adjustedAssemblyExact: production.adjustedAssembly.equals(research.adjustedAssembly),
    rawObjectExact: production.object.equals(research.object),
    objectTextExact: production.inspected.objectText.equals(research.inspected.objectText),
    relocationsExact: canonicalJson(production.inspected.relocations) === canonicalJson(research.inspected.relocations),
    emittedStateExact: production.inspected.state.emittedStateSha256 === research.inspected.state.emittedStateSha256,
  };
  requireCondition(Object.values(parity).every(Boolean), `research/production parity failed: ${JSON.stringify(parity)}`);
  return {
    ...parity,
    compilerAssemblySha256: sha256(production.compilerAssembly),
    adjustedAssemblySha256: sha256(production.adjustedAssembly),
    rawObjectSha256: sha256(production.object),
    objectTextSha256: production.inspected.state.objectTextSha256,
    relocationSha256: production.inspected.state.relocationSha256,
    emittedStateSha256: production.inspected.state.emittedStateSha256,
  };
}

function linkProduction({ tools, production, directory, oracleBytes }) {
  const script = path.join(directory, 'diagnostic.ld');
  const linkedElf = path.join(directory, 'diagnostic.elf');
  const linkedBinary = path.join(directory, 'diagnostic.text.bin');
  copyArtifact(path.join(EXACT_ORACLE_RUN, 'diagnostic.ld'), script);
  const link = runTool(
    'diagnostic link',
    tools.linker,
    [...LINKER_FLAGS, '-T', script, '-o', linkedElf, path.join(directory, 'candidate.o')],
    { cwd: directory },
  );
  fs.writeFileSync(path.join(directory, 'linker.stdout.log'), link.stdout, 'utf8');
  fs.writeFileSync(path.join(directory, 'linker.stderr.log'), link.stderr, 'utf8');
  const bytes = extractSection(tools, linkedElf, linkedBinary, 'linked target extraction');
  return {
    elf: shown(linkedElf),
    elfSha256: sha256File(linkedElf),
    bytes: shown(linkedBinary),
    bytesSha256: sha256(bytes),
    comparison: compareLinkedBytes(bytes, oracleBytes),
  };
}

function compileCase({ id, source, context, strictControl }) {
  const directory = path.join(OUTPUT_ROOT, id);
  const scratch = path.join(directory, 'c');
  const sourceFile = path.join(directory, 'candidate.c');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(sourceFile, source, 'utf8');
  const sourceScan = diagnosticSourceScan(source);
  const production = compileOne({
    tools: context.tools,
    compiler: context.productionCompiler,
    sourceFile,
    scratch,
    destination: path.join(directory, 'production'),
    trace: false,
  });
  const research = compileOne({
    tools: context.tools,
    compiler: context.researchCompiler,
    sourceFile,
    scratch,
    destination: path.join(directory, 'research'),
    trace: true,
  });
  const parity = assertParity(production, research);
  const records = parseTrace(research.compilerStderr);
  const creationOrder = analyzeCreationOrder(records);
  const decisiveSchedulerPairs = schedulerPairs(records);
  const semanticEvidence = semanticSchedulerEvidence(records);
  const creationIdentity = creationIdentitySignature(creationOrder);
  const signature = traceSignature(creationOrder, decisiveSchedulerPairs, semanticEvidence);
  const diagnosticLink = linkProduction({
    tools: context.tools,
    production,
    directory: path.join(directory, 'production'),
    oracleBytes: context.oracleBytes,
  });
  if (strictControl) {
    requireIdentity('control object-text SHA-256', parity.objectTextSha256, EXPECTED.baselineTextSha256);
    requireIdentity('control relocation SHA-256', parity.relocationSha256, EXPECTED.baselineRelocationSha256);
    requireIdentity('control emitted-state SHA-256', parity.emittedStateSha256, EXPECTED.baselineEmittedStateSha256);
    requireIdentity('control relevant trace signature SHA-256', signature.sha256, context.acceptedBaselineTraceSignature.sha256);
    requireCondition(diagnosticLink.comparison.differingInstructionCount === EXPECTED.baselineResidualInstructions, 'control residual instruction count drift');
  }
  return {
    id,
    source: {
      file: shown(sourceFile),
      bytes: Buffer.byteLength(source, 'utf8'),
      sha256: sha256File(sourceFile),
      diagnosticSourceScan: sourceScan,
    },
    parity,
    object: {
      bytes: production.inspected.state.bytes,
      textSha256: production.inspected.state.objectTextSha256,
      relocationCount: production.inspected.state.relocationCount,
      relocationSha256: production.inspected.state.relocationSha256,
      emittedStateSha256: production.inspected.state.emittedStateSha256,
    },
    diagnosticLink,
    trace: {
      recordCount: records.length,
      typeCounts: Object.fromEntries([...new Set(records.map((record) => record.type))]
        .map((type) => [type, records.filter((record) => record.type === type).length])),
      creationOrder,
      creationIdentitySignature: creationIdentity,
      decisiveSchedulerPairs,
      semanticSchedulerEvidence: semanticEvidence,
      relevantSignature: signature,
    },
    artifacts: {
      production: shown(path.join(directory, 'production')),
      research: shown(path.join(directory, 'research')),
      trace: shown(path.join(directory, 'research', 'compiler.stderr.log')),
    },
  };
}

function authenticateInputs() {
  requireIdentity('archived source SHA-256', sha256File(ARCHIVED_SOURCE), EXPECTED.sourceSha256);
  requireIdentity('accepted scheduler trace report SHA-256', sha256File(ACCEPTED_TRACE_REPORT), EXPECTED.acceptedTraceReportSha256);
  const acceptedTrace = JSON.parse(fs.readFileSync(ACCEPTED_TRACE_REPORT, 'utf8'));
  requireCondition(acceptedTrace.study === 'allocator-scheduler-trace' && acceptedTrace.researchOnly === true, 'accepted trace report contract drift');
  requireIdentity('accepted instrumentation ID', acceptedTrace.researchCompiler.instrumentationId, EXPECTED.instrumentationId);
  requireIdentity('accepted production compiler report SHA-256', acceptedTrace.authenticatedProductionCompiler.sha256, EXPECTED.productionCompilerSha256);
  requireIdentity('accepted research compiler report SHA-256', acceptedTrace.researchCompiler.sha256, EXPECTED.researchCompilerSha256);

  const productionCompiler = path.resolve(acceptedTrace.authenticatedProductionCompiler.path);
  const researchCompiler = path.resolve(acceptedTrace.researchCompiler.path);
  const tools = {
    assembler: path.join(BINUTILS, 'mips-kmc-elf-as.exe'),
    linker: path.join(BINUTILS, 'mips-kmc-elf-ld.exe'),
    objdump: path.join(BINUTILS, 'mips-kmc-elf-objdump.exe'),
  };
  for (const file of [productionCompiler, researchCompiler, ...Object.values(tools)]) {
    requireCondition(fs.existsSync(file), `required retained executable is missing: ${file}`);
  }
  requireIdentity('production compiler SHA-256', sha256File(productionCompiler), EXPECTED.productionCompilerSha256);
  requireIdentity('research compiler SHA-256', sha256File(researchCompiler), EXPECTED.researchCompilerSha256);
  requireIdentity('assembler SHA-256', sha256File(tools.assembler), EXPECTED.assemblerSha256);
  requireIdentity('linker SHA-256', sha256File(tools.linker), EXPECTED.linkerSha256);
  requireIdentity('objdump SHA-256', sha256File(tools.objdump), EXPECTED.objdumpSha256);

  requireIdentity('retained baseline compiler assembly SHA-256', sha256File(path.join(BASELINE_RUN, 'candidate.compiler.s')), EXPECTED.baselineCompilerAssemblySha256);
  requireIdentity('retained baseline adjusted assembly SHA-256', sha256File(path.join(BASELINE_RUN, 'candidate.s')), EXPECTED.baselineAdjustedAssemblySha256);
  requireIdentity('retained baseline object SHA-256', sha256File(path.join(BASELINE_RUN, 'candidate.o')), EXPECTED.baselineObjectSha256);
  requireIdentity('retained baseline linker script SHA-256', sha256File(path.join(BASELINE_RUN, 'diagnostic.ld')), EXPECTED.linkerScriptSha256);
  requireIdentity('retained exact-oracle linker script SHA-256', sha256File(path.join(EXACT_ORACLE_RUN, 'diagnostic.ld')), EXPECTED.linkerScriptSha256);
  requireIdentity('retained exact-oracle ELF SHA-256', sha256File(path.join(EXACT_ORACLE_RUN, 'diagnostic.elf')), EXPECTED.exactOracleElfSha256);

  const anchorDirectory = path.join(OUTPUT_ROOT, 'authenticated-anchors');
  fs.mkdirSync(anchorDirectory, { recursive: true });
  const oracleBytes = extractSection(
    tools,
    path.join(EXACT_ORACLE_RUN, 'diagnostic.elf'),
    path.join(anchorDirectory, 'exact-oracle.text.bin'),
    'exact oracle extraction',
  );
  requireCondition(oracleBytes.length === EXPECTED.targetBytes, `exact oracle extent drift: ${oracleBytes.length}`);
  requireIdentity('exact oracle target bytes SHA-256', sha256(oracleBytes), EXPECTED.targetBytesSha256);
  const retainedBaseline = inspectObject(
    tools,
    path.join(BASELINE_RUN, 'candidate.o'),
    path.join(anchorDirectory, 'retained-baseline'),
  );
  requireIdentity('retained baseline text SHA-256', retainedBaseline.state.objectTextSha256, EXPECTED.baselineTextSha256);
  requireIdentity('retained baseline relocation count', retainedBaseline.state.relocationCount, EXPECTED.baselineRelocationCount);
  requireIdentity('retained baseline relocation SHA-256', retainedBaseline.state.relocationSha256, EXPECTED.baselineRelocationSha256);
  requireIdentity('retained baseline emitted-state SHA-256', retainedBaseline.state.emittedStateSha256, EXPECTED.baselineEmittedStateSha256);

  const acceptedBaseline = acceptedTrace.cases.find((record) => record.id === 'b1');
  const acceptedDoWhile = acceptedTrace.cases.find((record) => record.id === 'v1');
  requireCondition(acceptedBaseline && acceptedDoWhile, 'accepted trace report lacks b1 or v1 evidence');
  requireIdentity('accepted b1 emitted state', acceptedBaseline.parity.emittedStateSha256, EXPECTED.baselineEmittedStateSha256);
  requireIdentity('accepted v1 emitted state', acceptedDoWhile.parity.emittedStateSha256, EXPECTED.doWhileEmittedStateSha256);
  const acceptedBaselineTraceSignature = traceSignature(
    acceptedBaseline.trace.creationOrder,
    acceptedBaseline.trace.decisiveSchedulerPairs,
    acceptedBaseline.trace.semanticSchedulerEvidence,
  );
  const acceptedDoWhileTraceSignature = traceSignature(
    acceptedDoWhile.trace.creationOrder,
    acceptedDoWhile.trace.decisiveSchedulerPairs,
    acceptedDoWhile.trace.semanticSchedulerEvidence,
  );

  return {
    acceptedTrace,
    acceptedBaselineTraceSignature,
    acceptedDoWhileTraceSignature,
    productionCompiler,
    researchCompiler,
    tools,
    oracleBytes,
    identities: {
      acceptedTraceReport: { file: shown(ACCEPTED_TRACE_REPORT), sha256: sha256File(ACCEPTED_TRACE_REPORT) },
      productionCompiler: { file: productionCompiler, sha256: sha256File(productionCompiler) },
      researchCompiler: {
        file: shown(researchCompiler),
        sha256: sha256File(researchCompiler),
        instrumentationId: acceptedTrace.researchCompiler.instrumentationId,
      },
      assembler: { file: shown(tools.assembler), sha256: sha256File(tools.assembler), flags: ASSEMBLER_FLAGS },
      linker: { file: shown(tools.linker), sha256: sha256File(tools.linker), flags: LINKER_FLAGS },
      objdump: { file: shown(tools.objdump), sha256: sha256File(tools.objdump) },
      archivedSource: { file: shown(ARCHIVED_SOURCE), sha256: sha256File(ARCHIVED_SOURCE) },
      retainedBaselineObject: { file: shown(path.join(BASELINE_RUN, 'candidate.o')), sha256: sha256File(path.join(BASELINE_RUN, 'candidate.o')) },
      exactOracleElf: {
        file: shown(path.join(EXACT_ORACLE_RUN, 'diagnostic.elf')),
        sha256: sha256File(path.join(EXACT_ORACLE_RUN, 'diagnostic.elf')),
        targetBytesSha256: sha256(oracleBytes),
      },
    },
  };
}

function classifyOutcome(control, probe, context) {
  const creationIdentity = probe.trace.creationIdentitySignature.sha256 === control.trace.creationIdentitySignature.sha256
    ? 'unchanged-from-control'
    : 'distinct';
  const relevantState = probe.trace.relevantSignature.sha256 === control.trace.relevantSignature.sha256
    ? 'unchanged-from-control'
    : probe.trace.relevantSignature.sha256 === context.acceptedDoWhileTraceSignature.sha256
      ? 'matches-accepted-do-while'
      : 'distinct';
  const emittedState = probe.object.emittedStateSha256 === EXPECTED.baselineEmittedStateSha256
    ? 'baseline'
    : probe.object.emittedStateSha256 === EXPECTED.doWhileEmittedStateSha256
      ? 'accepted-do-while-regression'
      : 'distinct';
  const regressions = {
    extentChanged: probe.object.bytes !== EXPECTED.targetBytes,
    relocationsChanged: probe.object.relocationCount !== EXPECTED.baselineRelocationCount
      || probe.object.relocationSha256 !== EXPECTED.baselineRelocationSha256,
    residualWorsened: probe.diagnosticLink.comparison.differingInstructionCount > EXPECTED.baselineResidualInstructions,
  };
  const exactDiagnosticLinkedBytes = probe.diagnosticLink.comparison.exact;
  let stopDecision;
  if (exactDiagnosticLinkedBytes) {
    stopDecision = 'pause-for-coordinated-official-classification-and-canonical-verification';
  } else if (relevantState === 'unchanged-from-control') {
    stopDecision = 'stop-relevant-creation-and-dependency-state-unchanged';
  } else if (emittedState === 'accepted-do-while-regression' || relevantState === 'matches-accepted-do-while') {
    stopDecision = 'stop-matches-known-do-while-regression';
  } else if (Object.values(regressions).some(Boolean)) {
    stopDecision = 'stop-emitted-result-regressed';
  } else {
    stopDecision = 'stop-single-planned-probe-complete';
  }
  return {
    creationIdentity,
    relevantState,
    emittedState,
    regressions,
    exactDiagnosticLinkedBytes,
    stopDecision,
    acceptanceEligible: false,
    acceptanceBoundary: exactDiagnosticLinkedBytes
      ? 'The isolated exact result, if any, still requires coordinated official source classification, canonical ownership checks, target verification, and complete-ROM verification.'
      : 'This isolated diagnostic does not prove canonical ownership, official source class, target acceptance, or complete-ROM identity.',
  };
}

function runProbe() {
  const context = authenticateInputs();
  const archivedSource = fs.readFileSync(ARCHIVED_SOURCE, 'utf8');
  const probeSource = makeProbeSource(archivedSource);
  const control = compileCase({ id: 'control', source: archivedSource, context, strictControl: true });
  const probe = compileCase({ id: 'sequential-carrier', source: probeSource, context, strictControl: false });
  const outcome = classifyOutcome(control, probe, context);
  const report = {
    schemaVersion: 1,
    study: 'allocator-source-probe',
    symbol: 'func_002158E4',
    researchOnly: true,
    acceptanceEligible: false,
    createdAt: new Date().toISOString(),
    hypothesis: {
      sourceForm: [
        'allocation = func_80070F30(0x6094);',
        'owner = D_801CE8BC;',
        'snapshot = allocation;',
      ],
      semanticJustification: 'The allocator remains before the global owner read because the call may mutate that global. Moving only the automatic pointer copy after the owner read has no externally observable side effect and preserves the values passed to the later calls.',
      predictedCompilerEffect: 'The calls.c return copy should remain before the owner-load creation. If carrier lifetime alone is causal, the later allocation-to-snapshot transfer should create a useful direct dependency without the do-while emitted regression; otherwise pseudo coalescing should reproduce the baseline LUID tie.',
      stopRule: 'Stop after this one source probe if relevant creation/dependency state is unchanged, matches the known do-while regression, or the emitted extent, relocations, or residual worsen.',
    },
    invocation: {
      compilerFlags: COMPILER_FLAGS,
      assemblerFlags: ASSEMBLER_FLAGS,
      linkerFlags: LINKER_FLAGS,
      target: { section: SECTION, bytes: EXPECTED.targetBytes, vram: EXPECTED.targetVram },
      boundary: 'Direct retained-tool invocation; no active compiler, source-policy, header, target-model, workflow, or accepted trace module was imported.',
    },
    authenticatedInputs: context.identities,
    control,
    probe,
    outcome,
  };
  writeJson(REPORT_FILE, report);
  return report;
}

function printHelp() {
  console.log([
    'One func_002158E4 allocator source probe (diagnostic only)',
    '',
    'Usage:',
    '  node tools/matching_studies/allocator_source_probe.js',
    '',
    'Runs one authenticated baseline control and one sequential-carrier probe.',
    'All generated outputs remain under build/allocator-source-probe/.',
  ].join('\n'));
}

function main(argv = process.argv.slice(2)) {
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) return printHelp();
  if (argv.length) throw new Error(`unknown allocator source probe option: ${argv.join(' ')}`);
  const report = runProbe();
  console.log(JSON.stringify({
    status: 'complete',
    report: shown(REPORT_FILE),
    controlEmittedState: report.control.object.emittedStateSha256,
    probeEmittedState: report.probe.object.emittedStateSha256,
    relevantState: report.outcome.relevantState,
    residualInstructions: report.probe.diagnosticLink.comparison.differingInstructionCount,
    stopDecision: report.outcome.stopDecision,
  }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`allocator source probe failed: ${error.stack || error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  EXPECTED,
  canonicalEmittedState,
  classifyOutcome,
  creationIdentitySignature,
  makeProbeSource,
  parseRelocations,
  parseTrace,
  traceSignature,
};
