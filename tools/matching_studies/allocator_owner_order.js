#!/usr/bin/env node
'use strict';

// Bounded research harness for the allocator-return / owner-load ordering
// cluster. Generated artifacts are diagnostic only and stay under build/.

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {
  elfSectionBytes,
  parseElfFile,
  run,
  sha256File,
} = require('../lib/phase7_conventional');
const {
  compileScratchCandidate,
  prepareCompilerSession,
} = require('../lib/matching/compiler');
const {
  canonicalJson,
  digest,
  loadWorkbenchModel,
  resolveTarget,
} = require('../lib/matching/target_model');
const {
  classifySource,
  SOURCE_CLASSES,
} = require('../lib/source_policy');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT_ROOT = path.join(ROOT, 'build', 'matching-studies', 'allocator-owner-order');
const REPORT_FILE = path.join(OUTPUT_ROOT, 'report.json');
const EXPECTED_COMPILER_SOURCE_COMMIT = '43d1cdb67ed135879869b5266f01efaaada5e35a';
const EXPECTED_OWNER_PREFIX = Object.freeze([
  '3c04801d',
  '8c84e8bc',
  '00408021',
  '3c02801d',
  '8c42e8c0',
  '02002821',
  '24066094',
  '0c024c18',
]);

const DUMP_PASSES = Object.freeze([
  { name: 'rtl', flag: '-dr', suffix: '.rtl' },
  { name: 'combine', flag: '-dc', suffix: '.combine' },
  { name: 'schedule1', flag: '-dS', suffix: '.sched' },
  { name: 'local-allocation', flag: '-dl', suffix: '.lreg' },
  { name: 'global-allocation', flag: '-dg', suffix: '.greg' },
  { name: 'schedule2', flag: '-dR', suffix: '.sched2' },
  { name: 'delay-slots', flag: '-dd', suffix: '.dbr' },
]);

const CASES = Object.freeze([
  {
    symbol: 'func_002158E4',
    role: 'baseline-pure',
    source: 'docs/archive/matching-c-candidates/2026-09-03-func_002158E4-a493a3ded3.c',
    sourceSha256: 'C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1',
    oracleSource: 'src/battle/func_002158E4.c',
    oracleSourceSha256: 'C3B18C44ADE13DB19119F0AED8EF483C0219BB6DFCFF287B611C5FDBA1F9B698',
    expectedBytesSha256: '2F0A1C6BC565B80B40015D55DD7944DC2C2C842E488763608D932D9BBCE6A8BD',
    expectedBytes: 236,
    residualRegions: [{ offset: 0x18, bytes: 0x0C }],
  },
  {
    symbol: 'func_002159D0',
    role: 'baseline-pure',
    source: 'docs/archive/matching-c-candidates/2026-09-04-func_002159D0-49a839eaea.c',
    sourceSha256: '0069119A8570AB793446B1B77DB688871707BAF9B95516862C25D41A2285407D',
    oracleSource: 'src/battle/func_002159D0.c',
    oracleSourceSha256: '05B417FC6B488003B0011519B21D68D211BE211C0C32F3B6642DBBBEF32325E3',
    expectedBytesSha256: '3E34625B1C1630EA8A974ABF082D1AA19123E62D4A60B674D821DE3892BA06E8',
    expectedBytes: 800,
    residualRegions: [{ offset: 0x34, bytes: 0x0C }],
  },
  {
    symbol: 'func_00215CF0',
    role: 'baseline-pure',
    source: 'docs/archive/matching-c-candidates/2026-09-04-func_00215CF0-20b217bd52.c',
    sourceSha256: 'D1E9A5915BD38286869DC4FF67DF0EFD25932B3276B4E2CBF49828967A0A58B0',
    oracleSource: 'src/battle/func_00215CF0.c',
    oracleSourceSha256: '69C4F92273BC8469F007EE75A4F9239F6AF1D537E7951E66CF0A13E7A207EF30',
    expectedBytesSha256: '8E0531C287F3635893AAEB1282F89ADFC257682F8ED69D1311B0C23B21B21C9E',
    expectedBytes: 3400,
    residualRegions: [
      { offset: 0x4AC, bytes: 0x0C },
      { offset: 0xC4C, bytes: 0x0C },
    ],
  },
  {
    symbol: 'func_00217BA8',
    role: 'baseline-pure',
    source: 'docs/archive/matching-c-candidates/2026-09-04-func_00217BA8-b4df0a7d7f.c',
    sourceSha256: '00168420BDA77475FA8045AB47DA8695508AD1C6F9B8D017CA2BD6CD30331A99',
    oracleSource: 'src/battle/func_00217BA8.c',
    oracleSourceSha256: '7571288045AADC6FD45045A9CBFD28BACB7D74DC800C3F8BBFDDD66943ACAF09',
    expectedBytesSha256: 'FE23E341C7625CCBE953CE268D858A5ACF66FC2C012F4A8C0D82802A1F8E63D8',
    expectedBytes: 1032,
    residualRegions: [{ offset: 0x1C4, bytes: 0x0C }],
  },
  {
    symbol: 'func_00047a94',
    role: 'exact-pure-control',
    source: 'src/lib/func_00047a94.c',
    sourceSha256: 'E76473D7CC3200AF6F0B26A68E8D1FFEE427316F5DFD7F6379E8DBFA694F12B4',
    oracleSource: 'src/lib/func_00047a94.c',
    oracleSourceSha256: 'E76473D7CC3200AF6F0B26A68E8D1FFEE427316F5DFD7F6379E8DBFA694F12B4',
    expectedBytesSha256: '2DB96D28F83C459CC1971F3D7A3B16F0C2B311F4B61698DB05FFD9F7A2F3207B',
    expectedBytes: 836,
    residualRegions: [],
  },
  {
    symbol: 'func_0021C3B0',
    role: 'exact-pure-control',
    source: 'src/battle/func_0021C3B0.c',
    sourceSha256: 'BE8E96C64511E82F3674FAC8A94BC4C23F6B82C7217E7F130F81F4099D90732E',
    oracleSource: 'src/battle/func_0021C3B0.c',
    oracleSourceSha256: 'BE8E96C64511E82F3674FAC8A94BC4C23F6B82C7217E7F130F81F4099D90732E',
    expectedBytesSha256: 'DC90E3EE150A784F0E79C93D488526E631F0D4BDE8CEDEC97E888850AE2C9194',
    expectedBytes: 512,
    residualRegions: [],
  },
]);

const HOLDOUTS = Object.freeze([
  {
    symbol: 'func_00219A14',
    offset: 0x3FC,
    expectedPrefix: EXPECTED_OWNER_PREFIX,
    sourceAvailable: false,
    boundaryCaveat: 'The accepted owner includes a read-before-prologue preamble; no reviewed PURE_C candidate exists.',
  },
  {
    symbol: 'func_0021A5C8',
    offset: 0x2F4,
    expectedPrefix: EXPECTED_OWNER_PREFIX,
    sourceAvailable: false,
    boundaryCaveat: 'The accepted owner includes a read-before-prologue preamble; no reviewed PURE_C candidate exists.',
  },
]);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function shown(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function hex(value, width = 8) {
  return `0x${Number(value).toString(16).toUpperCase().padStart(width, '0')}`;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function requireIdentity(label, actual, expected) {
  if (String(actual).toUpperCase() !== String(expected).toUpperCase()) {
    throw new Error(`${label} identity drift: expected ${expected}, observed ${actual}`);
  }
  return actual;
}

function readPinnedSource(source, expectedSha256) {
  const file = path.join(ROOT, source);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`study source is missing: ${source}`);
  const bytes = fs.readFileSync(file);
  requireIdentity(`${source} SHA-256`, sha256(bytes), expectedSha256);
  return { file, bytes, text: bytes.toString('utf8'), sha256: sha256(bytes) };
}

function validateStudyDefinition(cases = CASES, holdouts = HOLDOUTS) {
  const symbols = new Set();
  for (const record of cases) {
    if (symbols.has(record.symbol)) throw new Error(`duplicate study symbol: ${record.symbol}`);
    symbols.add(record.symbol);
    if (!['baseline-pure', 'exact-pure-control'].includes(record.role)) throw new Error(`unknown study role: ${record.role}`);
    if (!Number.isInteger(record.expectedBytes) || record.expectedBytes <= 0 || record.expectedBytes % 4 !== 0) {
      throw new Error(`malformed expected extent: ${record.symbol}`);
    }
    let previousEnd = -1;
    for (const region of record.residualRegions) {
      if (!Number.isInteger(region.offset) || !Number.isInteger(region.bytes)
          || region.offset < 0 || region.bytes <= 0 || region.offset % 4 !== 0
          || region.bytes % 4 !== 0 || region.offset + region.bytes > record.expectedBytes
          || region.offset < previousEnd) {
        throw new Error(`malformed residual region: ${record.symbol}`);
      }
      previousEnd = region.offset + region.bytes;
    }
  }
  if (cases.filter((record) => record.role === 'baseline-pure').length !== 4) throw new Error('study must retain four PURE_C baselines');
  if (cases.filter((record) => record.role === 'exact-pure-control').length !== 2) throw new Error('study must retain two exact PURE_C controls');
  if (holdouts.length !== 2 || holdouts.some((record) => symbols.has(record.symbol))) throw new Error('study holdout census drift');
  return true;
}

function splitTopLevelRtlForms(text) {
  const forms = [];
  const starts = /(^|\n)\((insn|call_insn|jump_insn|code_label|barrier)\b/g;
  let match;
  while ((match = starts.exec(text)) !== null) {
    const start = match.index + (match[1] ? 1 : 0);
    let depth = 0;
    let quoted = false;
    let escaped = false;
    let end = start;
    for (; end < text.length; end += 1) {
      const character = text[end];
      if (quoted) {
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === '"') quoted = false;
        continue;
      }
      if (character === '"') quoted = true;
      else if (character === '(') depth += 1;
      else if (character === ')') {
        depth -= 1;
        if (depth === 0) {
          end += 1;
          break;
        }
      }
    }
    if (depth !== 0) throw new Error(`unbalanced RTL ${match[2]} form`);
    forms.push(text.slice(start, end));
    starts.lastIndex = end;
  }
  return forms;
}

function rtlHeader(form) {
  const match = /^\((insn|call_insn|jump_insn|code_label|barrier)(?:[\/:][A-Za-z0-9_]+)*\s+(\d+)(?:\s+(-?\d+)\s+(-?\d+))?/.exec(form);
  if (!match) throw new Error(`unrecognized RTL form header: ${form.slice(0, 80)}`);
  return { type: match[1], uid: Number(match[2]), previous: match[3] === undefined ? null : Number(match[3]), next: match[4] === undefined ? null : Number(match[4]) };
}

function operationKind(form) {
  if (/\(call\s+\(mem:SI\s+\(symbol_ref:SI\s+\("func_80070F30"\)\)\)/s.test(form)) return 'allocator-call';
  if (/\(set\s+\(reg(?:\/v)?:SI\s+\d+(?:\s+[A-Za-z0-9_$]+)?\)\s+\(mem:SI\s+\(symbol_ref:SI\s+\("D_801CE8BC"\)\)\)\)/s.test(form)) return 'owner-load';
  if (/\(set\s+\(reg(?:\/v)?:SI\s+\d+(?:\s+[A-Za-z0-9_$]+)?\)\s+\(mem:SI\s+\(symbol_ref:SI\s+\("D_801CE8C0"\)\)\)\)/s.test(form)) return 'context-load';
  if (/\(set\s+\(reg(?:\/v)?:SI\s+\d+(?:\s+[A-Za-z0-9_$]+)?\)\s+\(reg:SI\s+2\s+v0\)\)/s.test(form)) return 'return-save';
  if (/\(asm_operands\b/s.test(form)) return 'asm-dependency';
  return null;
}

function destinationRegister(form) {
  const match = /\(set\s+\(reg(?:\/v)?:([A-Z]+)\s+(\d+)(?:\s+([A-Za-z0-9_$]+))?\)/s.exec(form);
  return match ? { mode: match[1], number: Number(match[2]), name: match[3] || null, pseudo: Number(match[2]) >= 64 } : null;
}

function canonicalizeRtlDump(text) {
  const forms = splitTopLevelRtlForms(String(text).replace(/\r\n/g, '\n'));
  const headers = forms.map(rtlHeader);
  const uidMap = new Map(headers.map((header, index) => [header.uid, `i${index}`]));
  const pseudoMap = new Map();
  let nextPseudo = 0;
  const normalized = forms.map((form, index) => {
    let value = form
      .replace(/[A-Za-z]:[\\/][^\s"()]+/g, '<path>')
      .replace(/^\((insn|call_insn|jump_insn|code_label|barrier)(?:[\/:][A-Za-z0-9_]+)*\s+\d+(?:\s+-?\d+\s+-?\d+)?/, `(${headers[index].type} @${index}`)
      .replace(/\(insn_list(?::([A-Z_]+))?\s+(\d+)/g, (all, kind, uid) => `(insn_list${kind ? `:${kind}` : ''} @${uidMap.get(Number(uid)) || 'external'}`)
      .replace(/\(label_ref\s+(\d+)\)/g, (all, uid) => `(label_ref @${uidMap.get(Number(uid)) || 'external'})`)
      .replace(/\(reg((?:\/v)?):([A-Z]+)\s+(\d+)(\s+[A-Za-z0-9_$]+)?\)/g, (all, variant, mode, number, name) => {
        const numeric = Number(number);
        if (numeric < 64) return `(reg${variant}:${mode} h${numeric}${name || ''})`;
        if (!pseudoMap.has(numeric)) pseudoMap.set(numeric, `p${nextPseudo++}`);
        return `(reg${variant}:${mode} ${pseudoMap.get(numeric)})`;
      })
      .replace(/\s+/g, ' ')
      .trim();
    return value;
  });
  return {
    forms: normalized,
    sha256: sha256(Buffer.from(canonicalJson(normalized), 'utf8')),
  };
}

function parseDependencies(form, uidMap, operationByUid) {
  const dependencies = [];
  const expression = /\(insn_list(?::([A-Z_]+))?\s+(\d+)/g;
  let match;
  while ((match = expression.exec(form)) !== null) {
    const uid = Number(match[2]);
    dependencies.push({
      kind: match[1] || 'REG_DEP_TRUE',
      predecessor: operationByUid.get(uid) || uidMap.get(uid) || 'external',
      rawUid: uid,
    });
  }
  return dependencies;
}

function parseReadyEvents(text, operationByUid) {
  const events = [];
  const expression = /^;; ready list at T-(\d+):([^\r\n]*?)(?:, now([^\r\n]*))?$/gm;
  let match;
  while ((match = expression.exec(text)) !== null) {
    const parseList = (value) => {
      const list = [];
      const items = /(\d+)(?:\s+\(([0-9a-fA-F]+)\))?/g;
      let item;
      while ((item = items.exec(value || '')) !== null) {
        const uid = Number(item[1]);
        list.push({ uid, operation: operationByUid.get(uid) || null, priority: item[2] === undefined ? null : Number.parseInt(item[2], 16) });
      }
      return list;
    };
    events.push({ clock: Number(match[1]), before: parseList(match[2]), after: parseList(match[3]) });
  }
  return events;
}

function analyzePassDump(text) {
  const forms = splitTopLevelRtlForms(text);
  const headers = forms.map(rtlHeader);
  const uidMap = new Map(headers.map((header, index) => [header.uid, `i${index}`]));
  const counts = new Map();
  const operationByUid = new Map();
  const operations = [];
  for (let index = 0; index < forms.length; index += 1) {
    const kind = operationKind(forms[index]);
    if (!kind) continue;
    const ordinal = (counts.get(kind) || 0) + 1;
    counts.set(kind, ordinal);
    const label = `${kind}#${ordinal}`;
    operationByUid.set(headers[index].uid, label);
    operations.push({ label, kind, ordinal, index, rawUid: headers[index].uid, destination: destinationRegister(forms[index]) });
  }
  for (const operation of operations) {
    operation.dependencies = parseDependencies(forms[operation.index], uidMap, operationByUid);
  }
  const allReadyEvents = parseReadyEvents(text, operationByUid);
  const readyEvents = allReadyEvents.filter((event) => (
    event.before.some((item) => item.operation) || event.after.some((item) => item.operation)
  ));
  const sites = [];
  for (const call of operations.filter((operation) => operation.kind === 'allocator-call')) {
    const following = operations.filter((operation) => operation.index > call.index && operation.index <= call.index + 20);
    const nextCall = following.find((operation) => operation.kind === 'allocator-call');
    const bounded = nextCall ? following.filter((operation) => operation.index < nextCall.index) : following;
    const owner = bounded.find((operation) => operation.kind === 'owner-load');
    const save = bounded.find((operation) => operation.kind === 'return-save');
    const context = bounded.find((operation) => operation.kind === 'context-load');
    const dependency = bounded.find((operation) => operation.kind === 'asm-dependency');
    const decisiveReadyEvent = readyEvents.find((event) => {
      const labels = new Set(event.before.map((item) => item.operation));
      return owner && save && labels.has(owner.label) && labels.has(save.label);
    }) || null;
    let decisiveComparator = null;
    if (decisiveReadyEvent && owner && save) {
      const eventIndex = allReadyEvents.indexOf(decisiveReadyEvent);
      const previousEvent = eventIndex > 0 ? allReadyEvents[eventIndex - 1] : null;
      const lastScheduledItem = previousEvent?.after?.[0] || previousEvent?.before?.[0] || null;
      const lastScheduledOperation = lastScheduledItem?.operation
        ? operations.find((operation) => operation.label === lastScheduledItem.operation)
        : operations.find((operation) => operation.rawUid === lastScheduledItem?.uid);
      const linkTo = (candidate) => lastScheduledOperation?.dependencies.find((item) => item.predecessor === candidate.label) || null;
      const ownerLink = linkTo(owner);
      const saveLink = linkTo(save);
      const schedulerClass = (link) => {
        if (!link) return 3;
        if (link.kind === 'REG_DEP_ANTI' || link.kind === 'REG_DEP_OUTPUT') return 3;
        return null;
      };
      const ownerReady = decisiveReadyEvent.before.find((item) => item.operation === owner.label);
      const saveReady = decisiveReadyEvent.before.find((item) => item.operation === save.label);
      const ownerClass = schedulerClass(ownerLink);
      const saveClass = schedulerClass(saveLink);
      let winningClause = 'unresolved';
      let backwardWinner = null;
      if (ownerReady?.priority !== saveReady?.priority) {
        winningClause = 'priority';
        backwardWinner = ownerReady.priority > saveReady.priority ? owner.label : save.label;
      } else if (ownerClass !== null && saveClass !== null && ownerClass !== saveClass) {
        winningClause = 'last-scheduled-dependence-class';
        backwardWinner = ownerClass > saveClass ? owner.label : save.label;
      } else if (ownerClass !== null && saveClass !== null && owner.index !== save.index) {
        winningClause = 'original-luid';
        backwardWinner = owner.index > save.index ? owner.label : save.label;
      }
      decisiveComparator = {
        lastScheduled: lastScheduledOperation?.label || (lastScheduledItem ? `uid-${lastScheduledItem.uid}` : null),
        owner: { priority: ownerReady?.priority ?? null, dependencyFromLast: ownerLink, schedulerClass: ownerClass },
        save: { priority: saveReady?.priority ?? null, dependencyFromLast: saveLink, schedulerClass: saveClass },
        antiOutputCostRule: 'MIPS ADJUST_COST makes anti/output cost zero; insn_cost normalizes ncost <= 1 to LINK_COST_FREE and returns 1, so rank_for_schedule classifies it as class 3.',
        winningClause,
        backwardWinner,
        observedSortedFirst: decisiveReadyEvent.after[0]?.operation || (decisiveReadyEvent.after[0] ? `uid-${decisiveReadyEvent.after[0].uid}` : null),
      };
    }
    sites.push({
      ordinal: sites.length + 1,
      call: call.label,
      owner: owner?.label || null,
      save: save?.label || null,
      context: context?.label || null,
      dependency: dependency?.label || null,
      forwardOperationOrder: [owner, save, context, dependency]
        .filter(Boolean)
        .sort((left, right) => left.index - right.index)
        .map((operation) => operation.label),
      ownerDependencies: owner?.dependencies || [],
      saveDependencies: save?.dependencies || [],
      ownerDestination: owner?.destination || null,
      saveDestination: save?.destination || null,
      decisiveReadyEvent,
      decisiveComparator,
    });
  }
  const canonical = canonicalizeRtlDump(text);
  return {
    rawSha256: sha256(Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8')),
    canonicalRtlSha256: canonical.sha256,
    executableFormCount: forms.length,
    operations,
    sites,
    readyEvents,
  };
}

function canonicalRelocation(relocation) {
  const ordered = {};
  for (const key of Object.keys(relocation).sort()) ordered[key] = relocation[key];
  return ordered;
}

function canonicalEmittedState(objectText, relocations) {
  if (!Buffer.isBuffer(objectText) || objectText.length % 4 !== 0) throw new Error('object text must be an aligned Buffer');
  const byOffset = new Map();
  const canonicalRelocations = (relocations || []).map(canonicalRelocation).sort((left, right) => {
    const leftOffset = typeof left.offset === 'string' ? Number.parseInt(left.offset, 16) : left.offset;
    const rightOffset = typeof right.offset === 'string' ? Number.parseInt(right.offset, 16) : right.offset;
    return leftOffset - rightOffset || canonicalJson(left).localeCompare(canonicalJson(right));
  });
  for (const relocation of canonicalRelocations) {
    const offset = typeof relocation.offset === 'string' ? Number.parseInt(relocation.offset, 16) : relocation.offset;
    if (!Number.isInteger(offset) || offset < 0 || offset % 4 !== 0 || offset >= objectText.length || byOffset.has(offset)) {
      throw new Error(`malformed or duplicate emitted-state relocation at ${relocation.offset}`);
    }
    byOffset.set(offset, canonicalRelocation(relocation));
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
    relocationSha256: sha256(Buffer.from(canonicalJson(canonicalRelocations), 'utf8')),
    emittedStateSha256: sha256(Buffer.from(canonicalJson(identity), 'utf8')),
  };
}

function contiguousRegions(offsets) {
  const sorted = [...new Set(offsets)].sort((left, right) => left - right);
  const regions = [];
  for (const offset of sorted) {
    if (!Number.isInteger(offset) || offset < 0 || offset % 4 !== 0) throw new Error(`malformed instruction offset: ${offset}`);
    const last = regions[regions.length - 1];
    if (last && last.offset + last.bytes === offset) last.bytes += 4;
    else regions.push({ offset, bytes: 4 });
  }
  return regions;
}

function compareEmittedStates(expected, actual) {
  const maximum = Math.max(expected.instructions.length, actual.instructions.length);
  const offsets = [];
  for (let index = 0; index < maximum; index += 1) {
    if (canonicalJson(expected.instructions[index] || null) !== canonicalJson(actual.instructions[index] || null)) offsets.push(index * 4);
  }
  return {
    exact: expected.emittedStateSha256 === actual.emittedStateSha256,
    expectedBytes: expected.bytes,
    actualBytes: actual.bytes,
    differingInstructionCount: offsets.length,
    differingInstructionOffsets: offsets.map((offset) => hex(offset)),
    residualRegions: contiguousRegions(offsets).map((region) => ({ offset: hex(region.offset), bytes: region.bytes })),
  };
}

function compareLinkedBytes(expected, actual) {
  const maximum = Math.max(expected.length, actual.length);
  const byteOffsets = [];
  const instructionOffsets = [];
  for (let offset = 0; offset < maximum; offset += 1) {
    if (expected[offset] !== actual[offset]) byteOffsets.push(offset);
  }
  for (let offset = 0; offset < maximum; offset += 4) {
    if (!expected.subarray(offset, offset + 4).equals(actual.subarray(offset, offset + 4))) instructionOffsets.push(offset);
  }
  return {
    exact: expected.equals(actual),
    differingBytes: byteOffsets.length,
    differingInstructions: instructionOffsets.length,
    differingInstructionOffsets: instructionOffsets.map((offset) => hex(offset)),
    residualRegions: contiguousRegions(instructionOffsets).map((region) => ({ offset: hex(region.offset), bytes: region.bytes })),
    firstDifferingByteOffset: byteOffsets.length ? hex(byteOffsets[0]) : null,
  };
}

function inspectCompilerSource(sourceRoot) {
  if (!sourceRoot) throw new Error('compiler source is required via --compiler-source or OB64_KMC_GCC_SOURCE');
  const directory = path.resolve(sourceRoot);
  const files = {
    scheduler: path.join(directory, 'sched.c'),
    backend: path.join(directory, 'config', 'mips', 'mips.h'),
    calls: path.join(directory, 'calls.c'),
  };
  for (const [role, file] of Object.entries(files)) {
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`compiler ${role} source is missing: ${file}`);
  }
  const git = (args) => {
    const result = childProcess.spawnSync('git', ['-C', directory, ...args], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0) throw new Error(`compiler-source git check failed: ${String(result.stderr || result.stdout).trim()}`);
    return String(result.stdout).trim();
  };
  const commit = git(['rev-parse', 'HEAD']);
  requireIdentity('compiler source commit', commit, EXPECTED_COMPILER_SOURCE_COMMIT);
  const trackedDiff = git(['status', '--short', '--untracked-files=no', '--', 'sched.c', 'calls.c', 'config/mips/mips.h']);
  if (trackedDiff) throw new Error(`compiler explanatory sources have tracked changes:\n${trackedDiff}`);
  const scheduler = fs.readFileSync(files.scheduler, 'utf8');
  const backend = fs.readFileSync(files.backend, 'utf8');
  const calls = fs.readFileSync(files.calls, 'utf8');
  const observations = {
    priorityFirst: /INSN_PRIORITY \(tmp\) - INSN_PRIORITY \(tmp2\)/.test(scheduler),
    lastInstructionDependencyClassSecond: /tmp_class - tmp2_class/.test(scheduler),
    originalLuidLast: /return INSN_LUID \(tmp\) - INSN_LUID \(tmp2\)/.test(scheduler),
    backwardScheduling: /ready list at T-%d/.test(scheduler) && /PREV_INSN \(insn\)/.test(scheduler),
    antiAndOutputCostZero: /REG_NOTE_KIND \(LINK\) != 0[\s\S]{0,160}\(COST\) = 0/.test(backend),
    adjustedCostAtMostOneNormalizedToOne: /if \(ncost <= 1\)\s+LINK_COST_FREE \(link\) = ncost = 1;/s.test(scheduler),
    rankTreatsCostOneAsClassThree: /if \(link == 0 \|\| insn_cost \(tmp, link, last_scheduled_insn\) == 1\)\s+tmp_class = 3;/s.test(scheduler),
    callResultCopiedImmediately: /emit_move_insn \(value, hard_libcall_value \(outmode\)\)/.test(calls),
  };
  if (Object.values(observations).some((value) => value !== true)) throw new Error(`compiler-source observation drift: ${JSON.stringify(observations)}`);
  return {
    explanatoryOnly: true,
    binaryProvenanceClaimed: false,
    root: directory,
    commit,
    files: Object.fromEntries(Object.entries(files).map(([role, file]) => [role, { path: file, sha256: sha256File(file) }])),
    observations,
    conclusion: 'KMC ranks backward-scheduler candidates by priority, effective dependence class relative to the last scheduled instruction, then original LUID. MIPS anti/output cost zero is normalized to free cost one and therefore class 3. Call expansion emits the return-register copy immediately.',
  };
}

function activeElfEvidence() {
  const stateFile = path.join(ROOT, 'build', 'current', 'state.json');
  if (!fs.existsSync(stateFile)) throw new Error('build/current/state.json is required for isolated diagnostic links');
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  if (typeof state.output !== 'string') throw new Error('current state output is malformed');
  const elfFile = path.join(state.output, 'phase8.elf');
  if (!fs.existsSync(elfFile)) throw new Error(`current exact ELF is missing: ${elfFile}`);
  const elf = parseElfFile(elfFile);
  const addresses = new Map();
  for (const symbol of elf.symbols) {
    if (!symbol.name || symbol.binding !== 1 || symbol.sectionIndex === 0) continue;
    if (addresses.has(symbol.name) && addresses.get(symbol.name) !== symbol.value) throw new Error(`ambiguous current ELF symbol: ${symbol.name}`);
    addresses.set(symbol.name, symbol.value);
  }
  return { stateFile, elfFile, elf, addresses, sha256: sha256File(elfFile) };
}

function diagnosticLink(session, target, objectFile, directory, accepted) {
  const object = parseElfFile(objectFile);
  const auxiliary = object.sections.filter((section) => section.size > 0 && (section.flags & 2)
    && section.name !== target.sectionName && section.name !== '.reginfo');
  if (auxiliary.length) throw new Error(`diagnostic link needs an auxiliary-section contract: ${target.symbol} (${auxiliary[0].name})`);
  const definitions = [];
  for (const symbol of object.symbols.filter((item) => item.name && item.sectionIndex === 0)) {
    if (!/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(symbol.name) || !accepted.addresses.has(symbol.name)) {
      throw new Error(`current ELF cannot resolve diagnostic symbol: ${symbol.name}`);
    }
    definitions.push(`${symbol.name} = ${hex(accepted.addresses.get(symbol.name))};`);
  }
  definitions.sort();
  const script = path.join(directory, 'diagnostic.ld');
  const linkedFile = path.join(directory, 'diagnostic.elf');
  const body = [
    'OUTPUT_FORMAT("elf32-bigmips")',
    'OUTPUT_ARCH(mips)',
    'SECTIONS',
    '{',
    `  ${target.sectionName} ${hex(target.vramStart)} : AT(0x1000)`,
    `  { *(${target.sectionName}) }`,
    '  /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) }',
    '}',
    ...definitions,
    '',
  ].join('\n');
  fs.writeFileSync(script, body);
  const linker = session.runtime.tools['mips-kmc-elf-ld.exe'].path;
  const args = [...session.context.phase8.model.config.binutils.linkerFlags, '-T', script, '-o', linkedFile, objectFile];
  run(linker, args, { cwd: directory });
  const linked = parseElfFile(linkedFile);
  const sections = linked.sections.filter((section) => section.name === target.sectionName);
  if (sections.length !== 1) throw new Error(`diagnostic target section census drift: ${target.symbol}`);
  const section = sections[0];
  const owners = linked.symbols.filter((symbol) => symbol.name === target.symbol && symbol.sectionIndex === section.index);
  if (owners.length !== 1 || owners[0].value !== target.vramStart || owners[0].size <= 0) {
    throw new Error(`diagnostic target owner placement drift: ${target.symbol}`);
  }
  const bytes = Buffer.from(elfSectionBytes(linked, section)).subarray(0, owners[0].size);
  return {
    bytes,
    evidence: {
      acceptanceEligible: false,
      linker: { path: linker, sha256: sha256File(linker), args },
      script: shown(script),
      linkedElf: shown(linkedFile),
      linkedElfSha256: sha256File(linkedFile),
      linkedBytes: bytes.length,
      linkedBytesSha256: sha256(bytes),
      placement: hex(owners[0].value),
      resolvedSymbolCount: definitions.length,
    },
  };
}

function runDumpCompiler(session, sourceFile, directory) {
  const dumpDirectory = path.join(directory, 'dumps');
  fs.mkdirSync(dumpDirectory, { recursive: true });
  // GCC 2.7.2 writes pass dumps beside the input source, regardless of the
  // assembly output path or cwd.  Give the dump invocation its own byte-identical
  // source copy so discovery cannot escape or collide with the experiment dir.
  const dumpSource = path.join(dumpDirectory, 'candidate.c');
  fs.copyFileSync(sourceFile, dumpSource);
  const output = path.join(dumpDirectory, 'dump.compiler.s');
  const args = [
    ...session.context.phase8.config.compiler.compileFlags,
    ...DUMP_PASSES.map((pass) => pass.flag),
    '-o',
    output,
    dumpSource,
  ];
  run(session.context.localTools.compiler, args, { cwd: dumpDirectory });
  const observations = {};
  for (const pass of DUMP_PASSES) {
    const candidates = fs.readdirSync(dumpDirectory).filter((name) => name.endsWith(pass.suffix));
    if (candidates.length !== 1) throw new Error(`${pass.name} dump census is ${candidates.length}, expected one`);
    const file = path.join(dumpDirectory, candidates[0]);
    const text = fs.readFileSync(file, 'utf8');
    observations[pass.name] = { file: shown(file), sha256: sha256File(file), ...analyzePassDump(text) };
  }
  return {
    compilerAssembly: output,
    compilerAssemblySha256: sha256File(output),
    canonicalCompilerAssemblySha256: canonicalizeCompilerAssembly(fs.readFileSync(output, 'utf8')).sha256,
    sourceCopy: { file: shown(dumpSource), sha256: sha256File(dumpSource) },
    command: { executable: session.context.localTools.compiler, args, cwd: dumpDirectory },
    passes: observations,
  };
}

function canonicalizeCompilerAssembly(text) {
  const canonical = String(text)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !/^\s*\.file(?:\s|$)/.test(line) && !/^\s*#/.test(line))
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n');
  return { text: canonical, sha256: sha256(Buffer.from(canonical, 'utf8')) };
}

function replaceExactly(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0 || source.indexOf(needle, first + 1) >= 0) throw new Error(`${label} transform anchor census is not one`);
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

const FOCUSED_VARIANTS = Object.freeze([
  {
    id: 'do-while-late-transfer',
    hypothesis: 'A constant-folded one-iteration do/while scope can keep the allocator result in a short-lived carrier until after the owner load, changing RTL lifetime/order without changing instructions.',
    predictedCompilerEffect: 'The first RTL or allocation dump should place the owner load before the transfer into the long-lived snapshot, or add a dependency that makes the return save win the backward-scheduler choice.',
    stopReason: 'One semantics-preserving scope/lifetime form tests the prior exact func_00047a94 observation; equivalent emitted state falsifies it for this site.',
    apply(source) {
      const declarations = '    register void *owner;\n    u8 saved_value;\n    u8 *snapshot;';
      const declarationsReplacement = '    register void *owner;\n    void *allocation;\n    u8 saved_value;\n    u8 *snapshot;';
      const statements = '    snapshot = func_80070F30(0x6094);\n    owner = D_801CE8BC;';
      const statementsReplacement = '    allocation = func_80070F30(0x6094);\n    do {\n        owner = D_801CE8BC;\n        snapshot = allocation;\n    } while (0);';
      return replaceExactly(replaceExactly(source, declarations, declarationsReplacement, this.id), statements, statementsReplacement, this.id);
    },
  },
  {
    id: 'inline-two-result-helper',
    hypothesis: 'Inlining a helper that returns the allocation and writes the owner result may preserve the helper return boundary long enough to change the return-copy dependency/order.',
    predictedCompilerEffect: 'Inlining must leave one function and the exact extent; the owner load should precede the long-lived return copy in a canonicalized RTL pass. Extra text or stack traffic rejects the shape.',
    stopReason: 'One inline boundary is enough to distinguish tree integration from statement spelling; no broad helper permutation follows an equivalent or regressed state.',
    apply(source) {
      const prototype = 'void func_0021C3B0(void);\n\nvoid func_002158E4(void)';
      const helper = 'void func_0021C3B0(void);\n\nstatic __inline__ void *func_002158E4_allocate_with_owner(void **owner)\n{\n    void *allocation = func_80070F30(0x6094);\n    *owner = D_801CE8BC;\n    return allocation;\n}\n\nvoid func_002158E4(void)';
      const statements = '    snapshot = func_80070F30(0x6094);\n    owner = D_801CE8BC;';
      const statementsReplacement = '    snapshot = func_002158E4_allocate_with_owner(&owner);';
      return replaceExactly(replaceExactly(source, prototype, helper, this.id), statements, statementsReplacement, this.id);
    },
  },
  {
    id: 'one-shot-loop-carrier',
    hypothesis: 'A genuine one-iteration control-flow region can alter allocation weighting and dependency release even when KMC later removes its constant control edge.',
    predictedCompilerEffect: 'The source must collapse to the accepted CFG/extent but change the canonical RTL site order or decisive ready event before changing the three-word residual.',
    stopReason: 'This is the final bounded control-flow/lifetime probe; failure or an equivalent emitted state ends the focused source-shape study.',
    apply(source) {
      const declarations = '    register void *owner;\n    u8 saved_value;\n    u8 *snapshot;';
      const declarationsReplacement = '    register void *owner;\n    void *allocation;\n    int once;\n    u8 saved_value;\n    u8 *snapshot;';
      const statements = '    snapshot = func_80070F30(0x6094);\n    owner = D_801CE8BC;';
      const statementsReplacement = '    allocation = func_80070F30(0x6094);\n    for (once = 1; once != 0; once = 0) {\n        owner = D_801CE8BC;\n        snapshot = allocation;\n    }';
      return replaceExactly(replaceExactly(source, declarations, declarationsReplacement, this.id), statements, statementsReplacement, this.id);
    },
  },
]);

function chooseFocusedVariants(requested = [], maximum = FOCUSED_VARIANTS.length) {
  if (!Number.isInteger(maximum) || maximum < 0 || maximum > FOCUSED_VARIANTS.length) throw new Error(`focused-variant limit must be 0..${FOCUSED_VARIANTS.length}`);
  const selected = requested.length
    ? requested.map((id) => {
      const variant = FOCUSED_VARIANTS.find((item) => item.id === id);
      if (!variant) throw new Error(`unknown focused variant: ${id}`);
      return variant;
    })
    : [...FOCUSED_VARIANTS];
  if (new Set(selected.map((item) => item.id)).size !== selected.length) throw new Error('focused variants must be unique');
  return selected.slice(0, maximum);
}

function shouldStopFocused(results, maximum) {
  if (results.some((result) => result.outcome?.diagnosticLinkedExact && result.sourcePolicy?.class === SOURCE_CLASSES.PURE_C)) {
    return { stop: true, reason: 'exact-small-candidate-ready-for-target-verification' };
  }
  if (maximum === 0 && results.length === 0) return { stop: true, reason: 'no-focused-experiments-requested' };
  if (results.length >= maximum) return { stop: true, reason: 'bounded-variant-limit-reached' };
  return { stop: false, reason: null };
}

function concludeStudy(focusedVariants, selectedCount) {
  const exactVariant = focusedVariants.find((experiment) => (
    experiment.outcome?.diagnosticLinkedExact && experiment.sourcePolicy?.class === SOURCE_CLASSES.PURE_C
  ));
  if (exactVariant) {
    return {
      outcome: 'exact-small-diagnostic-only',
      pureCandidateReadyForCanonicalVerification: true,
      familyGeneralizationReady: false,
      reason: 'The exact small diagnostic candidate may proceed through its own canonical diff and verifier. Family propagation and both holdouts are required only before claiming the shape generalizes.',
      experimentId: exactVariant.experimentId,
    };
  }
  if (selectedCount === 0) {
    return {
      outcome: 'baseline-only-no-focused-experiments',
      pureCandidateReadyForCanonicalVerification: false,
      reason: 'Baseline and control reproduction completed, but no focused source hypothesis was executed or falsified.',
      nextDiscriminatingExperiment: 'Run at least one named focused variant before drawing a source-hypothesis conclusion.',
    };
  }
  return {
    outcome: 'bounded-hypotheses-falsified',
    pureCandidateReadyForCanonicalVerification: false,
    reason: 'No focused variant produced exact diagnostic linked bytes. This does not establish PURE_C impossibility.',
    nextDiscriminatingExperiment: 'Instrument a separately built research compiler to log rank_for_schedule comparison operands and dependence classes for the two semantic operations; never use that compiler output as a matching candidate.',
  };
}

function validateBaselineScheduleEvidence(record, passObservations) {
  const sites = (passObservations?.schedule2?.sites || []).filter((site) => site.decisiveComparator);
  if (sites.length !== record.residualRegions.length) {
    throw new Error(`${record.symbol} decisive schedule2 site census is ${sites.length}, expected ${record.residualRegions.length}`);
  }
  const summaries = sites.map((site) => {
    const comparator = site.decisiveComparator;
    const order = site.forwardOperationOrder;
    const saveIndex = order.indexOf(site.save);
    const ownerIndex = order.indexOf(site.owner);
    const contextIndex = order.indexOf(site.context);
    const valid = saveIndex >= 0 && saveIndex < ownerIndex && ownerIndex < contextIndex
      && comparator.lastScheduled === site.context
      && comparator.owner.priority !== null
      && comparator.owner.priority === comparator.save.priority
      && comparator.owner.dependencyFromLast === null
      && comparator.owner.schedulerClass === 3
      && comparator.save.dependencyFromLast?.kind === 'REG_DEP_ANTI'
      && comparator.save.dependencyFromLast?.predecessor === site.save
      && comparator.save.schedulerClass === 3
      && comparator.winningClause === 'original-luid'
      && comparator.backwardWinner === site.owner
      && comparator.observedSortedFirst === site.owner;
    if (!valid) throw new Error(`${record.symbol} schedule2 comparator evidence drift at allocator site ${site.ordinal}`);
    return {
      site: site.ordinal,
      readyClock: site.decisiveReadyEvent.clock,
      equalPriority: comparator.owner.priority,
      lastScheduled: comparator.lastScheduled,
      owner: site.owner,
      save: site.save,
      ownerClass: comparator.owner.schedulerClass,
      saveClass: comparator.save.schedulerClass,
      saveDependency: comparator.save.dependencyFromLast.kind,
      winningClause: comparator.winningClause,
      backwardWinner: comparator.backwardWinner,
      forwardOrder: order,
    };
  });
  return {
    expectedSiteCount: record.residualRegions.length,
    observedSiteCount: sites.length,
    allSitesConform: true,
    sites: summaries,
  };
}

function expectedRegions(record) {
  return record.residualRegions.map((region) => ({ offset: hex(region.offset), bytes: region.bytes }));
}

function passSiteSignature(pass) {
  return canonicalJson((pass?.sites || []).map((site) => ({
    forwardOperationOrder: site.forwardOperationOrder,
    ownerDependencies: site.ownerDependencies.map((item) => ({ kind: item.kind, predecessor: item.predecessor })),
    saveDependencies: site.saveDependencies.map((item) => ({ kind: item.kind, predecessor: item.predecessor })),
    ownerDestination: site.ownerDestination,
    saveDestination: site.saveDestination,
      decisiveReadyEvent: site.decisiveReadyEvent ? {
      before: site.decisiveReadyEvent.before.map((item) => ({ operation: item.operation, priority: item.priority })),
      after: site.decisiveReadyEvent.after.map((item) => item.operation),
      } : null,
      decisiveComparator: site.decisiveComparator ? {
        lastScheduled: site.decisiveComparator.lastScheduled,
        owner: site.decisiveComparator.owner,
        save: site.decisiveComparator.save,
        winningClause: site.decisiveComparator.winningClause,
        backwardWinner: site.decisiveComparator.backwardWinner,
        observedSortedFirst: site.decisiveComparator.observedSortedFirst,
      } : null,
  })));
}

function comparePasses(reference, actual) {
  const comparisons = [];
  for (const pass of DUMP_PASSES) {
    const left = reference?.[pass.name];
    const right = actual?.[pass.name];
    if (!left || !right) continue;
    comparisons.push({
      pass: pass.name,
      canonicalRtlEqual: left.canonicalRtlSha256 === right.canonicalRtlSha256,
      siteObservationEqual: passSiteSignature(left) === passSiteSignature(right),
    });
  }
  return {
    comparisons,
    firstCanonicalRtlDifference: comparisons.find((item) => !item.canonicalRtlEqual)?.pass || null,
    firstSiteObservationDifference: comparisons.find((item) => !item.siteObservationEqual)?.pass || null,
  };
}

function compileExperiment({ session, target, sourceText, sourceOrigin, sourceExpectedSha256, label, role, hypothesis, predictedCompilerEffect, oracleState, expectedBytes, acceptedElf, dump = true }) {
  const sourceSha256 = sha256(Buffer.from(sourceText, 'utf8'));
  if (sourceExpectedSha256) requireIdentity(`${label} source`, sourceSha256, sourceExpectedSha256);
  const identity = {
    schemaVersion: 1,
    study: 'allocator-owner-order',
    targetId: target.targetId,
    label,
    role,
    hypothesis,
    predictedCompilerEffect,
    sourceSha256,
    compilerToolId: session.toolId,
    compileFlags: session.context.phase8.config.compiler.compileFlags,
    dumpPasses: dump ? DUMP_PASSES.map((pass) => pass.name) : [],
  };
  const experimentId = digest(identity);
  const directory = path.join(OUTPUT_ROOT, 'runs', experimentId);
  fs.mkdirSync(directory, { recursive: true });
  const sourceFile = path.join(directory, 'candidate.c');
  if (fs.existsSync(sourceFile) && fs.readFileSync(sourceFile, 'utf8') !== sourceText) throw new Error(`experiment source collision: ${experimentId}`);
  fs.writeFileSync(sourceFile, sourceText, 'utf8');
  const sourcePolicy = classifySource(sourceFile, { preprocessor: session.preprocessor });
  if (role === 'oracle-hybrid') {
    if (sourcePolicy.class !== SOURCE_CLASSES.HYBRID_C) throw new Error(`${label} exact oracle is not HYBRID_C: ${sourcePolicy.class}`);
  } else if (sourcePolicy.class !== SOURCE_CLASSES.PURE_C) {
    throw new Error(`${label} is not PURE_C: ${sourcePolicy.class}`);
  }
  const compile = compileScratchCandidate({ session, target, sourceFile, artifactDir: directory });
  const objectFile = path.join(ROOT, compile.scratchContract.artifacts.object);
  const emittedState = canonicalEmittedState(compile.objectText, compile.relocations);
  const dumpEvidence = dump ? runDumpCompiler(session, sourceFile, directory) : null;
  if (dumpEvidence) {
    const ordinaryAssembly = canonicalizeCompilerAssembly(fs.readFileSync(path.join(directory, 'candidate.compiler.s'), 'utf8'));
    requireIdentity(`${label} dump/non-dump canonical compiler assembly`, dumpEvidence.canonicalCompilerAssemblySha256, ordinaryAssembly.sha256);
  }
  const linked = diagnosticLink(session, target, objectFile, directory, acceptedElf);
  const linkedComparison = compareLinkedBytes(expectedBytes, linked.bytes);
  const comparison = oracleState ? compareEmittedStates(oracleState, emittedState) : null;
  const report = {
    schemaVersion: 1,
    experimentId,
    identity,
    target: { symbol: target.symbol, targetId: target.targetId, bytes: target.bytes, vramStart: hex(target.vramStart) },
    label,
    role,
    hypothesis,
    predictedCompilerEffect,
    source: { origin: sourceOrigin, snapshot: shown(sourceFile), sha256: sourceSha256 },
    sourcePolicy,
    compiler: {
      authenticatedAcceptanceCompiler: true,
      toolId: session.toolId,
      identity: session.tool,
      executable: session.context.localTools.compiler,
      executableSha256: sha256File(session.context.localTools.compiler),
      flags: session.context.phase8.config.compiler.compileFlags,
    },
    object: {
      file: compile.scratchContract.artifacts.object,
      fileSha256: compile.scratchContract.artifacts.objectSha256,
      bytes: emittedState.bytes,
      textSha256: emittedState.objectTextSha256,
      relocationCount: compile.relocations.length,
      relocationSha256: emittedState.relocationSha256,
      emittedStateSha256: emittedState.emittedStateSha256,
      scratchContract: compile.scratchContract,
    },
    passObservations: dumpEvidence ? dumpEvidence.passes : {},
    dumpCompiler: dumpEvidence ? {
      command: dumpEvidence.command,
      sourceCopy: dumpEvidence.sourceCopy,
      compilerAssembly: shown(dumpEvidence.compilerAssembly),
      compilerAssemblySha256: dumpEvidence.compilerAssemblySha256,
      canonicalCompilerAssemblySha256: dumpEvidence.canonicalCompilerAssemblySha256,
    } : null,
    comparisonToExactOracle: comparison,
    diagnosticLink: linked.evidence,
    outcome: {
      diagnosticLinkedExact: linkedComparison.exact,
      diagnosticLinkedComparison: linkedComparison,
      acceptanceEligible: false,
      acceptanceBoundary: 'This isolated object/link study does not prove canonical ownership, accepted relocation policy, or complete-ROM identity.',
    },
  };
  writeJson(path.join(directory, 'experiment.json'), report);
  return { report, emittedState, linkedBytes: linked.bytes };
}

function parseArguments(argv) {
  const args = { command: 'run', variants: [], maximum: FOCUSED_VARIANTS.length, compilerSource: process.env.OB64_KMC_GCC_SOURCE || null, skipFocused: false };
  const values = [...argv];
  if (values.includes('--help') || values.includes('-h')) return { ...args, command: 'help' };
  if (values[0] && !values[0].startsWith('-')) args.command = values.shift();
  while (values.length) {
    const option = values.shift();
    if (option === '--variant') args.variants.push(values.shift());
    else if (option === '--max-focused') args.maximum = Number(values.shift());
    else if (option === '--compiler-source') args.compilerSource = values.shift();
    else if (option === '--skip-focused') args.skipFocused = true;
    else throw new Error(`unknown allocator-owner-order option: ${option}`);
  }
  if (args.variants.some((value) => !value)) throw new Error('--variant requires a value');
  return args;
}

function listStudy() {
  validateStudyDefinition();
  return {
    schemaVersion: 1,
    study: 'allocator-owner-order',
    cases: CASES.map((record) => ({ symbol: record.symbol, role: record.role, source: record.source, residualRegions: expectedRegions(record) })),
    focusedVariants: FOCUSED_VARIANTS.map(({ id, hypothesis, predictedCompilerEffect, stopReason }) => ({ id, hypothesis, predictedCompilerEffect, stopReason })),
    holdouts: HOLDOUTS,
    stopCondition: `At most ${FOCUSED_VARIANTS.length} focused variants; stop early on an exact small PURE_C result and require all family sites plus both holdouts before generalization.`,
  };
}

function runStudy(options) {
  validateStudyDefinition();
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  const session = prepareCompilerSession();
  const model = loadWorkbenchModel();
  const acceptedElf = activeElfEvidence();
  const compilerSource = inspectCompilerSource(options.compilerSource);
  const report = {
    schemaVersion: 1,
    study: 'allocator-owner-order',
    researchOnly: true,
    acceptanceEligible: false,
    createdAt: new Date().toISOString(),
    outputRoot: shown(OUTPUT_ROOT),
    authenticatedInputs: {
      studyHarness: { path: shown(__filename), sha256: sha256File(__filename) },
      compiler: session.tool,
      compilerExecutable: { path: session.context.localTools.compiler, sha256: sha256File(session.context.localTools.compiler) },
      assemblerExecutable: session.runtime.tools['mips-kmc-elf-as.exe'],
      linkerExecutable: session.runtime.tools['mips-kmc-elf-ld.exe'],
      acceptedElf: { path: acceptedElf.elfFile, sha256: acceptedElf.sha256, stateFile: shown(acceptedElf.stateFile) },
      compilerSource,
    },
    hypothesis: {
      id: 'backward-scheduler-dependency-and-order',
      statement: 'The pure candidates enter RTL with the return-register save before the owner load. At the observed schedule2 choice both have priority 1. The save has an anti-dependence on the last-scheduled context load, but MIPS ADJUST_COST zeroes that cost and insn_cost normalizes it to free cost 1; rank_for_schedule therefore gives both candidates class 3. The later original LUID (owner load) wins while scheduling backward, yielding save-before-owner in forward output. A PURE_C solution must change incoming order or introduce a non-free dependency/rank distinction before the final object.',
      prediction: 'Cosmetic sources that alpha-normalize to the same RTL and emitted state will retain the residual. A causal candidate must first change a canonical pass-site observation and then eliminate only the declared residual while preserving extent and relocations.',
      evidenceStrength: 'Compiler-source corroboration plus targeted pass operations and ready-list evidence; diagnostic object/link only, not canonical acceptance.',
    },
    stopCondition: {
      maximumFocusedVariants: options.skipFocused ? 0 : options.maximum,
      earlyStop: 'Stop at the first exact small PURE_C candidate and permit target-local canonical verification. Require all family functions and both untouched holdouts only before generalizing the shape.',
      boundedFailure: 'Reaching the fixed variant limit falsifies only the named source hypotheses and does not prove PURE_C impossible.',
    },
    baselines: [],
    controls: [],
    oracleExperiments: [],
    focusedVariants: [],
    emittedStates: [],
    holdouts: HOLDOUTS,
  };
  const stateGroups = new Map();
  const addState = (experiment) => {
    const state = experiment.object.emittedStateSha256;
    if (!stateGroups.has(state)) stateGroups.set(state, []);
    stateGroups.get(state).push({ symbol: experiment.target.symbol, label: experiment.label, experimentId: experiment.experimentId });
  };
  const baselineSmall = {};
  for (const record of CASES) {
    const target = resolveTarget(model, record.symbol);
    requireIdentity(`${record.symbol} expected-byte SHA-256`, target.expectedBytesSha256, record.expectedBytesSha256);
    if (target.bytes !== record.expectedBytes) throw new Error(`${record.symbol} accepted extent drift: ${target.bytes}`);
    const source = readPinnedSource(record.source, record.sourceSha256);
    const oracleSource = readPinnedSource(record.oracleSource, record.oracleSourceSha256);
    const expectedBytes = Buffer.from(target.expectedBytes);
    const oracle = compileExperiment({
      session,
      target,
      sourceText: oracleSource.text,
      sourceOrigin: record.oracleSource,
      sourceExpectedSha256: record.oracleSourceSha256,
      label: `${record.symbol}-exact-oracle`,
      role: record.role === 'baseline-pure' ? 'oracle-hybrid' : 'exact-pure-control',
      hypothesis: 'Reproduce the currently accepted exact source as the relocation-aware object and isolated-link oracle.',
      predictedCompilerEffect: 'Object plus relocations and isolated linked bytes equal the accepted target bytes.',
      oracleState: null,
      expectedBytes,
      acceptedElf,
      dump: record.symbol === 'func_002158E4',
    });
    if (!oracle.report.outcome.diagnosticLinkedExact) throw new Error(`${record.symbol} exact oracle failed isolated reproduction`);
    report.oracleExperiments.push(oracle.report);
    addState(oracle.report);
    if (record.role === 'exact-pure-control') {
      report.controls.push(oracle.report);
      continue;
    }
    const baseline = compileExperiment({
      session,
      target,
      sourceText: source.text,
      sourceOrigin: record.source,
      sourceExpectedSha256: record.sourceSha256,
      label: `${record.symbol}-pure-baseline`,
      role: record.role,
      hypothesis: 'Reproduce the archived PURE_C baseline and its declared allocator-owner residual.',
      predictedCompilerEffect: `Exact extent and relocation identity; remaining instruction regions ${JSON.stringify(expectedRegions(record))}.`,
      oracleState: oracle.emittedState,
      expectedBytes,
      acceptedElf,
      dump: true,
    });
    const observed = baseline.report.comparisonToExactOracle.residualRegions;
    if (canonicalJson(observed) !== canonicalJson(expectedRegions(record))) {
      throw new Error(`${record.symbol} baseline residual drift: expected ${JSON.stringify(expectedRegions(record))}, observed ${JSON.stringify(observed)}`);
    }
    baseline.report.schedulerEvidence = validateBaselineScheduleEvidence(record, baseline.report.passObservations);
    baseline.report.passComparisonToOracle = comparePasses(oracle.report.passObservations, baseline.report.passObservations);
    report.baselines.push(baseline.report);
    addState(baseline.report);
    if (record.symbol === 'func_002158E4') Object.assign(baselineSmall, { record, target, source, oracle, baseline, expectedBytes });
  }

  const chosen = options.skipFocused ? [] : chooseFocusedVariants(options.variants, options.maximum);
  for (const variant of chosen) {
    const sourceText = variant.apply(baselineSmall.source.text);
    const experiment = compileExperiment({
      session,
      target: baselineSmall.target,
      sourceText,
      sourceOrigin: `${baselineSmall.record.source} + ${variant.id}`,
      sourceExpectedSha256: null,
      label: `func_002158E4-${variant.id}`,
      role: 'focused-pure-variant',
      hypothesis: variant.hypothesis,
      predictedCompilerEffect: variant.predictedCompilerEffect,
      oracleState: baselineSmall.oracle.emittedState,
      expectedBytes: baselineSmall.expectedBytes,
      acceptedElf,
      dump: true,
    });
    experiment.report.stopReason = variant.stopReason;
    experiment.report.passComparisonToPureBaseline = comparePasses(baselineSmall.baseline.report.passObservations, experiment.report.passObservations);
    const aliases = stateGroups.get(experiment.report.object.emittedStateSha256) || [];
    experiment.report.emittedStateDeduplication = {
      newState: aliases.length === 0,
      // Copy the prior-members list: addState mutates the backing group next.
      equivalentPriorExperiments: [...aliases],
      interpretation: aliases.length
        ? 'This source converged on a previously observed final object/relocation state. Distinct earlier compiler-pass states remain recorded and are not deduplicated away.'
        : 'This source created one new final object/relocation state; novelty is not progress unless the residual and pass evidence improve.',
    };
    report.focusedVariants.push(experiment.report);
    addState(experiment.report);
    const stop = shouldStopFocused(report.focusedVariants, chosen.length);
    if (stop.stop && stop.reason === 'exact-small-candidate-ready-for-target-verification') {
      report.stopCondition.observed = stop;
      break;
    }
  }
  if (!report.stopCondition.observed) report.stopCondition.observed = shouldStopFocused(report.focusedVariants, chosen.length);
  report.emittedStates = [...stateGroups.entries()].map(([emittedStateSha256, experiments]) => ({ emittedStateSha256, experiments }));
  report.conclusion = concludeStudy(report.focusedVariants, chosen.length);
  writeJson(REPORT_FILE, report);
  return report;
}

function printHelp() {
  console.log([
    'Allocator owner-order compiler study (diagnostic only)',
    '',
    'Usage:',
    '  node tools/matching_studies/allocator_owner_order.js list',
    '  node tools/matching_studies/allocator_owner_order.js run [--compiler-source <gcc-source>] [--variant <id>] [--max-focused <0..3>] [--skip-focused]',
    '  node tools/matching_studies/allocator_owner_order.js --help',
    '',
    'A run requires --compiler-source or the OB64_KMC_GCC_SOURCE environment variable.',
    'All artifacts stay under build/matching-studies/allocator-owner-order/.',
    'The compiler, assembler, linker, sources, target identities, and exact controls are authenticated before conclusions are written.',
  ].join('\n'));
}

function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.command === 'help') {
    printHelp();
    return;
  }
  if (options.command === 'list') {
    console.log(JSON.stringify(listStudy(), null, 2));
    return;
  }
  if (options.command !== 'run') throw new Error(`unknown allocator-owner-order command: ${options.command}`);
  const report = runStudy(options);
  console.log(JSON.stringify({
    status: 'complete',
    report: shown(REPORT_FILE),
    baselines: report.baselines.map((item) => ({ symbol: item.target.symbol, residualRegions: item.comparisonToExactOracle.residualRegions })),
    controls: report.controls.map((item) => ({ symbol: item.target.symbol, exact: item.outcome.diagnosticLinkedExact })),
    focusedVariants: report.focusedVariants.map((item) => ({ label: item.label, emittedState: item.object.emittedStateSha256, newState: item.emittedStateDeduplication.newState, exact: item.outcome.diagnosticLinkedExact })),
    conclusion: report.conclusion,
  }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`allocator owner-order study failed: ${error.stack || error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  CASES,
  DUMP_PASSES,
  FOCUSED_VARIANTS,
  HOLDOUTS,
  analyzePassDump,
  canonicalizeCompilerAssembly,
  canonicalEmittedState,
  canonicalizeRtlDump,
  chooseFocusedVariants,
  concludeStudy,
  compareEmittedStates,
  compareLinkedBytes,
  contiguousRegions,
  inspectCompilerSource,
  listStudy,
  operationKind,
  parseArguments,
  parseReadyEvents,
  requireIdentity,
  shouldStopFocused,
  splitTopLevelRtlForms,
  validateBaselineScheduleEvidence,
  validateStudyDefinition,
};
