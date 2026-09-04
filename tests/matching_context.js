#!/usr/bin/env node
'use strict';

const { buildTargetContext } = require('../tools/lib/matching/context');
const { bufferFromWords } = require('../tools/lib/matching/mips_analysis');
const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');

function fail(message) {
  throw new Error(`matching context test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function addiu(rt, rs, immediate) {
  return ((0x09 << 26) | (rs << 21) | (rt << 16) | (immediate & 0xFFFF)) >>> 0;
}

function sw(rt, offset, base = 29) {
  return ((0x2B << 26) | (base << 21) | (rt << 16) | (offset & 0xFFFF)) >>> 0;
}

function jal(target) {
  return ((0x03 << 26) | ((target >>> 2) & 0x03FFFFFF)) >>> 0;
}

function jalr(rd, rs) {
  return ((rs << 21) | (rd << 11) | 0x09) >>> 0;
}

function branchAndLink(pc, target, rs = 4) {
  const displacement = (target - (pc + 4)) >> 2;
  return ((0x01 << 26) | (rs << 21) | (0x11 << 16) | (displacement & 0xFFFF)) >>> 0;
}

function target(symbol, vramStart, words) {
  return {
    symbol,
    targetId: `target:${symbol}`,
    modelId: 'model:synthetic-context',
    romStart: 0,
    entryVram: vramStart,
    vramStart,
    expectedBytes: bufferFromWords(words),
  };
}

function syntheticCallsite(words, options = {}) {
  const callerVram = options.callerVram || 0x80001000;
  const calleeVram = options.calleeVram || 0x80002000;
  const caller = target(options.callerSymbol || 'synthetic_caller', callerVram, words);
  const callee = target(options.calleeSymbol || 'synthetic_callee', calleeVram, [0x03E00008, 0]);
  const context = buildTargetContext({ targets: [caller, callee] }, callee);
  assert(context.callers.length === 1, 'synthetic callee did not resolve exactly one callsite');
  return { callsite: context.callers[0], context };
}

function syntheticTests() {
  const callee = 0x80002000;
  const stack = syntheticCallsite([
    sw(8, 16),
    sw(9, 20),
    sw(10, 24),
    sw(11, 28),
    sw(12, 32),
    jal(callee),
    sw(13, 36),
    sw(14, 40),
  ]).callsite;
  assert(JSON.stringify(stack.stackArguments.map((fact) => fact.offset)) === JSON.stringify([16, 20, 24, 28, 32, 36]),
    'direct-JAL stack delay-slot preparation was not bounded to the slot');
  assert(stack.stackArguments.slice(0, 5).every((fact, index) => (
    fact.instruction === index && fact.pc === 0x80001000 + index * 4 && fact.delaySlot === false
  )), 'pre-call stack candidates lost instruction/PC provenance');
  assert(stack.stackArguments[5].instruction === 6 && stack.stackArguments[5].pc === 0x80001018
      && stack.stackArguments[5].delaySlot === true,
  'stack delay-slot candidate lacks explicit instruction/PC provenance');
  assert(!stack.stackArguments.some((fact) => fact.offset === 40), 'post-slot stack store escaped the callsite bound');

  const register = syntheticCallsite([
    addiu(4, 0, 1),
    jal(callee),
    addiu(4, 0, 2),
  ]).callsite;
  assert(register.arguments[0].preparation.instruction === 2
      && register.arguments[0].preparation.pc === 0x80001008
      && register.arguments[0].preparation.delaySlot === true,
  'delay-slot argument-register write did not supersede its predecessor');
  assert(register.arguments[0].confidence === 'bounded-linear-predecessor-candidate'
      && register.arguments[1].confidence === 'not-observed-in-bounded-window'
      && register.confidence === 'exact-call-instruction-with-bounded-linear-context-candidates',
  'callsite confidence boundary drifted');
  assert(!Object.prototype.hasOwnProperty.call(register, 'arity')
      && !Object.prototype.hasOwnProperty.call(register, 'signature'),
  'bounded callsite facts invented a signature or arity');

  const truncated = syntheticCallsite([
    sw(8, 16),
    jal(callee),
  ]).callsite;
  assert(truncated.stackArguments.length === 1 && truncated.stackArguments[0].delaySlot === false
      && truncated.arguments.every((fact) => !fact.preparation || fact.preparation.delaySlot === false),
  'truncated JAL invented delay-slot preparation');

  const controlSlot = syntheticCallsite([
    addiu(4, 0, 1),
    jal(callee),
    jalr(4, 25),
  ]).callsite;
  assert(controlSlot.arguments[0].preparation.instruction === 0
      && controlSlot.arguments[0].preparation.delaySlot === false,
  'control-transfer delay slot was treated as argument preparation');

  const branchCallerVram = 0x80003000;
  const branchCalleeVram = 0x80003020;
  const branchAndLinkCall = syntheticCallsite([
    branchAndLink(branchCallerVram, branchCalleeVram),
    addiu(4, 0, 3),
  ], { callerVram: branchCallerVram, calleeVram: branchCalleeVram }).callsite;
  assert(branchAndLinkCall.arguments[0].preparation === null,
    'conditional branch-and-link delay slot was generalized as JAL preparation');

  return {
    stackOffsets: stack.stackArguments.map((fact) => fact.offset),
    stackDelaySlot: stack.stackArguments[5],
    registerDelaySlot: register.arguments[0].preparation,
    truncatedDelaySlotFacts: 0,
    controlSlotExcluded: true,
    conditionalLinkSlotExcluded: true,
  };
}

function realFixtureTests() {
  const workbench = loadWorkbenchModel();
  const callee = resolveTarget(workbench, 'func_00054e24');
  assert(callee.entryVram === 0x8017EF24, 'func_00054e24 accepted runtime entry drifted');
  const context = buildTargetContext(workbench, callee);
  const callerFacts = context.callers.filter((callsite) => (
    callsite.caller.toLowerCase() === 'func_00215cf0'
  ));
  const first = callerFacts.find((callsite) => callsite.pc === 0x801D338C);
  const second = callerFacts.find((callsite) => callsite.pc === 0x801D34B8);
  assert(first && first.instruction === 603 && first.mappingStatus === 'unique-static-entry',
    'first func_00215CF0 callsite did not resolve uniquely');
  assert(second && second.instruction === 678 && second.mappingStatus === 'unique-static-entry',
    'second func_00215CF0 callsite did not resolve uniquely');
  assert(JSON.stringify(first.stackArguments.map((fact) => fact.offset))
      === JSON.stringify([16, 20, 24, 28, 32, 36]),
  'first func_00215CF0 callsite omitted a bounded outgoing stack candidate');
  const firstSlot = first.stackArguments.find((fact) => fact.delaySlot);
  assert(firstSlot && firstSlot.offset === 36 && firstSlot.instruction === 604
      && firstSlot.pc === 0x801D3390,
  'first func_00215CF0 JAL delay-slot provenance drifted');
  assert(JSON.stringify(second.stackArguments.map((fact) => fact.offset))
      === JSON.stringify([16, 20, 24, 28, 32, 36])
      && second.stackArguments.every((fact) => fact.delaySlot === false),
  'second func_00215CF0 pre-call stack evidence drifted');
  assert(first.confidence === 'exact-call-instruction-with-bounded-linear-context-candidates'
      && second.confidence === 'exact-call-instruction-with-bounded-linear-context-candidates'
      && /lexical candidates, not path-sensitive dataflow proof/.test(context.evidenceBoundary),
  'real callsite evidence boundary drifted');
  assert(!Object.prototype.hasOwnProperty.call(first, 'arity')
      && !Object.prototype.hasOwnProperty.call(first, 'signature'),
  'real callsite evidence invented a signature or arity');

  return {
    callee: { symbol: callee.symbol, entryVram: callee.entryVram },
    first: {
      instruction: first.instruction,
      pc: first.pc,
      stackOffsets: first.stackArguments.map((fact) => fact.offset),
      delaySlot: firstSlot,
    },
    second: {
      instruction: second.instruction,
      pc: second.pc,
      stackOffsets: second.stackArguments.map((fact) => fact.offset),
      delaySlotStores: second.stackArguments.filter((fact) => fact.delaySlot).length,
    },
  };
}

function main() {
  console.log(JSON.stringify({
    status: 'pass',
    synthetic: syntheticTests(),
    acceptedModel: realFixtureTests(),
  }, null, 2));
}

if (require.main === module) main();

module.exports = { main };
