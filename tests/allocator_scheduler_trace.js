#!/usr/bin/env node
'use strict';

const {
  EXPECTED_EMITTED_STATES,
  analyzeCreationOrder,
  assertParity,
  parseArguments,
  parseTrace,
  schedulerPairs,
  semanticSchedulerEvidence,
  studyDefinitions,
} = require('../tools/matching_studies/allocator_scheduler_trace');

function fail(message) {
  throw new Error(`allocator scheduler trace test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, message: error.message };
  }
  fail(`${name} was accepted`);
}

const TRACE = [
  'OB64TRACE|emit|seq=1|kind=allocator-call|uid=11|dest=-1|src=-1',
  'OB64TRACE|emit|seq=2|kind=return-save|uid=12|dest=72|src=2',
  'OB64TRACE|call-copy|seq=3|uid=12|dest=72|src=2|path=target-move',
  'OB64TRACE|emit|seq=4|kind=owner-load|uid=13|dest=73|src=-1',
  'OB64TRACE|emit|seq=5|kind=context-load|uid=14|dest=75|src=-1',
  'OB64TRACE|cost|seq=1|reload=1|insn=12|insnkind=return-save|used=14|usedkind=context-load|kind=14|raw=2|adjusted=0|final=1|free_entry=0|zero_entry=0|free_before=0|zero_before=0|free_after=1|zero_after=0',
  'OB64TRACE|rank|seq=2|reload=1|last=14|lastkind=context-load|x=12|xkind=return-save|xluid=10|xpriority=1|xlink=14|xraw=2|xcost=1|xclass=3|y=13|ykind=owner-load|yluid=11|ypriority=1|ylink=-1|yraw=-1|ycost=-1|yclass=3|clause=luid|result=1|preferred=13|preferredkind=owner-load',
  'OB64TRACE|select|seq=3|reload=1|clock=42|last=14|lastkind=context-load|selected=13|selectedkind=owner-load|priority=1|luid=11|ready=2',
  'OB64TRACE|cost|seq=4|reload=1|insn=13|insnkind=owner-load|used=14|usedkind=context-load|kind=0|raw=3|adjusted=3|final=3|free_entry=0|zero_entry=0|free_before=0|zero_before=0|free_after=0|zero_after=1',
].join('\n');

function main() {
  const records = parseTrace(`unrelated compiler text\n${TRACE}\n`);
  assert(records.length === 9, 'trace record census drift');
  const creation = analyzeCreationOrder(records, 1);
  assert(creation.length === 1, 'creation site census drift');
  assert(creation[0].directlyObservedOrder.join(',') === 'allocator-call,return-save,calls-result-copy,owner-load', 'creation order drift');
  assert(creation[0].returnSave.uid === creation[0].callsResultCopy.uid, 'calls.c copy did not identify the created return save');

  const pairs = schedulerPairs(records, 1);
  assert(pairs.length === 1, 'decisive pair census drift');
  assert(pairs[0].adjustment.rawCost === 2 && pairs[0].adjustment.postAdjustCost === 0
    && pairs[0].adjustment.effectiveCost === 1, 'cost adjustment trace drift');
  assert(pairs[0].owner.class === 3 && pairs[0].returnSave.class === 3, 'effective scheduler class drift');
  assert(pairs[0].comparator.clause === 'luid' && pairs[0].comparator.preferredKind === 'owner-load', 'LUID decision drift');
  assert(pairs[0].selected.kind === 'owner-load', 'ready[0] selection drift');
  const semanticEvidence = semanticSchedulerEvidence(records);
  assert(semanticEvidence.nonFreeTrueDependencies.length === 1
    && semanticEvidence.nonFreeTrueDependencies[0].effectiveCost === 3, 'non-free semantic dependency summary drift');

  const relocation = [{ offset: '0x00000000', type: 'R_MIPS_HI16', symbol: 'fixture', addend: 0 }];
  const production = { objectText: Buffer.from('00000000', 'hex'), relocations: relocation };
  const research = { objectText: Buffer.from('00000000', 'hex'), relocations: [...relocation] };
  const bytes = Buffer.from('fixture', 'utf8');
  const parity = assertParity(production, research, {
    productionAssembly: bytes,
    researchAssembly: Buffer.from(bytes),
    productionAdjusted: bytes,
    researchAdjusted: Buffer.from(bytes),
    productionObject: bytes,
    researchObject: Buffer.from(bytes),
  });
  assert(parity.compilerAssemblyExact && parity.rawObjectExact && parity.relocationsExact, 'equal output failed parity');

  const definitions = studyDefinitions();
  assert(definitions.length === 6, 'study must contain four baselines and two focused states');
  assert(definitions.filter((item) => item.strictScheduler).length === 4, 'baseline strict-trace census drift');
  assert(definitions.slice(4).map((item) => item.variant).join(',') === 'do-while-late-transfer,inline-two-result-helper', 'focused emitted-state selection drift');
  assert(new Set(definitions.slice(4).map((item) => item.expectedEmittedStateSha256)).size === 2
    && Object.keys(EXPECTED_EMITTED_STATES).length === 6, 'pinned emitted-state contract drift');
  assert(parseArguments(['prepare', '--compiler-source', 'C:\\fixture']).command === 'prepare', 'prepare argument parsing drift');
  assert(parseArguments(['--help']).command === 'help', 'help argument parsing drift');

  const rejections = [
    expectRejection('missing trace', /no OB64TRACE/, () => parseTrace('ordinary compiler output')),
    expectRejection('non-increasing sequence', /not increasing/, () => parseTrace([
      'OB64TRACE|emit|seq=2|kind=allocator-call|uid=1',
      'OB64TRACE|emit|seq=1|kind=owner-load|uid=2',
    ].join('\n'))),
    expectRejection('trace internal error', /uid-limit/, () => parseTrace('OB64TRACE|error|seq=1|reason=uid-limit|uid=65536')),
    expectRejection('wrong site count', /site census/, () => analyzeCreationOrder(records, 2)),
    expectRejection('missing cost adjustment', /did not confirm/, () => schedulerPairs(records.filter((item) => item.type !== 'cost'), 1)),
    expectRejection('assembly parity', /parity failed/, () => assertParity(production, research, {
      productionAssembly: bytes,
      researchAssembly: Buffer.from('different', 'utf8'),
      productionAdjusted: bytes,
      researchAdjusted: bytes,
      productionObject: bytes,
      researchObject: bytes,
    })),
  ];

  console.log(JSON.stringify({
    status: 'pass',
    directlyObservedCreationOrder: creation[0].directlyObservedOrder,
    directSchedulerDecision: pairs[0],
    outputParity: parity,
    studyCaseCount: definitions.length,
    failClosedMutations: rejections,
  }, null, 2));
}

main();
