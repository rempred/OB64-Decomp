'use strict';

const childProcess = require('child_process');
const { instructionInfo, registerUsage, wordsFromBuffer } = require('./mips_analysis');
const { digest } = require('./target_model');
const { requestStore } = require('./store');
const { syncTargets } = require('./compiler');
const { resolveLocalTools } = require('../local_tools');
const { ROOT } = require('../phase7_conventional');

const ARGUMENT_REGISTERS = [4, 5, 6, 7];

function targetInstructions(target) {
  return wordsFromBuffer(target.expectedBytes).map((word, index) => instructionInfo(word, target.vramStart + index * 4));
}

function targetByEntry(workbench) {
  const result = new Map();
  for (const target of workbench.targets) {
    const values = result.get(target.entryVram) || [];
    values.push(target);
    result.set(target.entryVram, values);
  }
  return result;
}

function buildContextIndex(workbench) {
  const entries = targetByEntry(workbench);
  const infosByTarget = new Map(workbench.targets.map((target) => [target.targetId, targetInstructions(target)]));
  const callersByTarget = new Map();
  for (const caller of workbench.targets) {
    const infos = infosByTarget.get(caller.targetId);
    infos.forEach((info, index) => {
      if (!info.call || info.target === null) return;
      const matches = entries.get(info.target) || [];
      for (const target of matches) {
        const facts = callersByTarget.get(target.targetId) || [];
        facts.push(callsiteFacts(caller, infos, index, entries));
        callersByTarget.set(target.targetId, facts);
      }
    });
  }
  return { entries, infosByTarget, callersByTarget };
}

function readBeforeWriteFacts(infos) {
  return ARGUMENT_REGISTERS.map((register, index) => {
    let firstRead = null;
    let firstWrite = null;
    for (let instructionIndex = 0; instructionIndex < infos.length; instructionIndex += 1) {
      const usage = registerUsage(infos[instructionIndex]);
      if (firstRead === null && usage.reads.includes(register)) firstRead = instructionIndex;
      if (firstWrite === null && usage.writes.includes(register)) firstWrite = instructionIndex;
      if (firstRead !== null || firstWrite !== null) break;
    }
    return {
      argument: index,
      register: `$a${index}`,
      readBeforeWrite: firstRead !== null && (firstWrite === null || firstRead < firstWrite),
      firstReadInstruction: firstRead,
      firstWriteInstruction: firstWrite,
      confidence: 'exact-linear-instruction-order',
    };
  });
}

function fieldFacts(infos) {
  return infos.flatMap((info, index) => {
    if (!info.memory || !ARGUMENT_REGISTERS.includes(info.rs)) return [];
    return [{
      instruction: index,
      pc: info.pc,
      baseArgument: info.rs - 4,
      offset: info.signedImmediate,
      width: info.memory.width,
      access: info.memory.load ? 'load' : 'store',
      signed: info.memory.signed,
      floatingPoint: Boolean(info.memory.float),
      text: info.text,
      confidence: 'exact-instruction-fact',
    }];
  });
}

function callsiteFacts(caller, infos, callIndex, entries) {
  const call = infos[callIndex];
  const targetMatches = call.target === null ? [] : entries.get(call.target) || [];
  const argumentFacts = [];
  for (const register of ARGUMENT_REGISTERS) {
    let fact = null;
    for (let index = callIndex - 1; index >= Math.max(0, callIndex - 12); index -= 1) {
      const usage = registerUsage(infos[index]);
      if (usage.writes.includes(register)) {
        fact = { instruction: index, pc: infos[index].pc, text: infos[index].text };
        break;
      }
    }
    argumentFacts.push({
      argument: register - 4,
      register: `$a${register - 4}`,
      preparation: fact,
      confidence: fact ? 'bounded-linear-predecessor-candidate' : 'not-observed-in-bounded-window',
    });
  }
  const stackArguments = [];
  for (let index = Math.max(0, callIndex - 12); index < callIndex; index += 1) {
    const info = infos[index];
    if (info.memory && !info.memory.load && info.rs === 29 && info.signedImmediate >= 16) {
      stackArguments.push({
        instruction: index,
        offset: info.signedImmediate,
        width: info.memory.width,
        text: info.text,
        confidence: 'bounded-linear-predecessor-candidate',
      });
    }
  }
  const returnWindow = [];
  for (let index = callIndex + 2; index < Math.min(infos.length, callIndex + 6); index += 1) {
    const usage = registerUsage(infos[index]);
    if (usage.reads.includes(2) || usage.writes.includes(2)) returnWindow.push({ instruction: index, text: infos[index].text, readsV0: usage.reads.includes(2), writesV0: usage.writes.includes(2) });
  }
  return {
    caller: caller.symbol,
    callerTargetId: caller.targetId,
    instruction: callIndex,
    pc: call.pc,
    targetAddress: call.target,
    targetCandidates: targetMatches.map((target) => ({ symbol: target.symbol, targetId: target.targetId })),
    mappingStatus: targetMatches.length === 1 ? 'unique-static-entry' : targetMatches.length > 1 ? 'ambiguous-overlay-entry' : 'unmapped-static-entry',
    arguments: argumentFacts,
    stackArguments,
    returnWindow,
    confidence: 'exact-call-instruction-with-bounded-linear-context-candidates',
  };
}

function runtimeContext(target, options = {}) {
  if (options.runtime !== true) return { requested: false, available: null };
  const localTools = resolveLocalTools();
  const result = childProcess.spawnSync(localTools.splatPython, [
    '-m', 'tools.total_resolver', 'search', '--rom', `0x${target.romStart.toString(16)}`, '--limit', String(options.runtimeLimit || 10),
  ], { cwd: ROOT, encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) return { requested: true, available: false, error: String(result.stderr || '').trim() };
  try {
    const payload = JSON.parse(result.stdout);
    return { requested: true, available: true, reviewState: 'live-unreviewed', payload };
  } catch (error) {
    return { requested: true, available: false, error: `Total Resolver returned malformed JSON: ${error.message}` };
  }
}

function buildTargetContext(workbench, target, options = {}) {
  const index = options.index || buildContextIndex(workbench);
  const entries = index.entries;
  const infos = index.infosByTarget.get(target.targetId);
  const callees = [];
  infos.forEach((info, index) => {
    if (!info.call) return;
    const matches = info.target === null ? [] : entries.get(info.target) || [];
    callees.push({
      instruction: index,
      pc: info.pc,
      targetAddress: info.target,
      indirect: info.indirect,
      candidates: matches.map((item) => ({ symbol: item.symbol, targetId: item.targetId })),
      mappingStatus: info.indirect ? 'indirect' : matches.length === 1 ? 'unique-static-entry' : matches.length > 1 ? 'ambiguous-overlay-entry' : 'unmapped-static-entry',
      confidence: 'exact-call-instruction',
    });
  });
  const callers = index.callersByTarget.get(target.targetId) || [];
  const writesV0 = infos.flatMap((info, index) => registerUsage(info).writes.includes(2)
    ? [{ instruction: index, pc: info.pc, text: info.text, confidence: 'exact-instruction-fact' }]
    : []);
  const context = {
    schemaVersion: 1,
    target: { symbol: target.symbol, targetId: target.targetId, modelId: target.modelId, romStart: target.romStart, entryVram: target.entryVram },
    arguments: readBeforeWriteFacts(infos),
    fields: fieldFacts(infos),
    callers,
    callees,
    returnWrites: writesV0,
    runtime: runtimeContext(target, options),
    evidenceBoundary: 'Instruction facts are exact. Read-before-write and near-callsite windows are lexical candidates, not path-sensitive dataflow proof; they support type hypotheses but not semantic names.',
  };
  context.summary = {
    callers: callers.length,
    callees: callees.length,
    ambiguousCallers: callers.filter((item) => item.mappingStatus !== 'unique-static-entry').length,
    argumentRegistersReadBeforeWrite: context.arguments.filter((item) => item.readBeforeWrite).map((item) => item.register),
    fieldAccesses: context.fields.length,
    returnWrites: writesV0.length,
  };
  context.contextId = digest(context);
  return context;
}

function storeTargetContext(workbench, target, options = {}) {
  const storeOptions = options.storeOptions || {};
  if (options.syncTargets !== false) syncTargets(workbench, storeOptions);
  const context = buildTargetContext(workbench, target, options);
  requestStore({ action: 'put_context', record: {
    contextId: context.contextId,
    targetId: target.targetId,
    modelId: workbench.modelId,
    context,
    createdAt: new Date().toISOString(),
  } }, storeOptions);
  return context;
}

function renderM2cContext(context) {
  const usedArguments = context.arguments.filter((item) => item.readBeforeWrite);
  const maximumArgument = usedArguments.length ? Math.max(...usedArguments.map((item) => item.argument)) : -1;
  const parameters = [];
  for (let index = 0; index <= maximumArgument; index += 1) {
    const pointer = context.fields.some((field) => field.baseArgument === index);
    parameters.push(`${pointer ? 'u8 *' : 's32 '}arg${index}`);
  }
  const returnUsed = context.callers.some((caller) => caller.returnWindow.some((item) => item.readsV0 && !item.writesV0));
  const lines = [
    'typedef signed char s8;',
    'typedef unsigned char u8;',
    'typedef signed short s16;',
    'typedef unsigned short u16;',
    'typedef signed int s32;',
    'typedef unsigned int u32;',
    '',
    `/* Read-only structural context for ${context.target.symbol}. */`,
    `/* Arguments read before overwrite: ${context.summary.argumentRegistersReadBeforeWrite.join(', ') || 'none observed'}. */`,
    `${returnUsed ? 's32' : 'void'} ${context.target.symbol}(${parameters.length ? parameters.join(', ') : 'void'});`,
  ];
  for (const field of context.fields.slice(0, 64)) {
    lines.push(`/* arg${field.baseArgument}${field.offset >= 0 ? '+' : ''}${field.offset}: ${field.access} ${field.width} byte(s), ${field.signed === null ? 'untyped' : field.signed ? 'signed' : 'unsigned'} */`);
  }
  lines.push('');
  return lines.join('\n');
}

module.exports = {
  buildContextIndex,
  buildTargetContext,
  renderM2cContext,
  storeTargetContext,
  targetInstructions,
};
