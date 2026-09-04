#!/usr/bin/env node
'use strict';

const {
  analyzePassDump,
  canonicalizeCompilerAssembly,
  canonicalEmittedState,
  canonicalizeRtlDump,
  chooseFocusedVariants,
  concludeStudy,
  compareEmittedStates,
  contiguousRegions,
  parseArguments,
  requireIdentity,
  shouldStopFocused,
  splitTopLevelRtlForms,
  validateBaselineScheduleEvidence,
  validateStudyDefinition,
} = require('../tools/matching_studies/allocator_owner_order');

function fail(message) {
  throw new Error(`matching studies test failure: ${message}`);
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

function dumpFixture(ids, ownerBeforeSave = false) {
  const { call, save, owner, context, p0, p1, p2 } = ids;
  const operations = ownerBeforeSave
    ? `
(call_insn ${call} 9 ${owner} (parallel[
            (set (reg:SI 2 v0)
                (call (mem:SI (symbol_ref:SI ("func_80070F30")))
                    (const_int 16)))
            (clobber (reg:SI 31 ra))
        ] ) -1 (nil) (nil))

(insn/i:HI ${owner} ${call} ${save} (set (reg/v:SI ${p1})
        (mem:SI (symbol_ref:SI ("D_801CE8BC")))) 159 {movsi_internal2} (nil)
    (nil))

(insn ${save} ${owner} ${context} (set (reg/v:SI ${p0})
        (reg:SI 2 v0)) 159 {movsi_internal2} (insn_list ${call} (nil))
    (expr_list:REG_DEAD (reg:SI 2 v0) (nil)))

(insn ${context} ${save} 26 (set (reg:SI ${p2})
        (mem:SI (symbol_ref:SI ("D_801CE8C0")))) 159 {movsi_internal2}
    (insn_list:REG_DEP_ANTI ${save} (insn_list:REG_DEP_ANTI ${call} (nil)))
    (nil))`
    : `
(call_insn ${call} 9 ${save} (parallel[
            (set (reg:SI 2 v0)
                (call (mem:SI (symbol_ref:SI ("func_80070F30")))
                    (const_int 16)))
            (clobber (reg:SI 31 ra))
        ] ) -1 (nil) (nil))

(insn ${save} ${call} ${owner} (set (reg/v:SI ${p0})
        (reg:SI 2 v0)) 159 {movsi_internal2} (insn_list ${call} (nil))
    (expr_list:REG_DEAD (reg:SI 2 v0) (nil)))

(insn/i:HI ${owner} ${save} ${context} (set (reg/v:SI ${p1})
        (mem:SI (symbol_ref:SI ("D_801CE8BC")))) 159 {movsi_internal2} (nil)
    (nil))

(insn ${context} ${owner} 26 (set (reg:SI ${p2})
        (mem:SI (symbol_ref:SI ("D_801CE8C0")))) 159 {movsi_internal2}
    (insn_list:REG_DEP_ANTI ${save} (insn_list:REG_DEP_ANTI ${call} (nil)))
    (nil))`;
  const sortedFirst = ownerBeforeSave ? save : owner;
  return `;; Function fixture
;; source C:\\different\\scratch\\candidate.c
;; ready list at T-41: ${owner} (1) ${context} (1), now ${context} ${owner}
;; ready list at T-42: ${owner} (1) ${save} (1), now ${sortedFirst} ${ownerBeforeSave ? ` ${owner}` : ` ${save}`}
${operations}
`;
}

function main() {
  validateStudyDefinition();
  const first = dumpFixture({ call: 11, save: 13, owner: 16, context: 19, p0: 72, p1: 73, p2: 75 });
  const alphaEquivalent = dumpFixture({ call: 101, save: 107, owner: 130, context: 155, p0: 88, p1: 99, p2: 120 })
    .replace('C:\\different\\scratch', 'D:\\cosmetic\\path');
  const reordered = dumpFixture({ call: 11, save: 16, owner: 13, context: 19, p0: 72, p1: 73, p2: 75 }, true);
  assert(splitTopLevelRtlForms(first).length === 4, 'RTL form census drift');
  const firstCanonical = canonicalizeRtlDump(first);
  const alphaCanonical = canonicalizeRtlDump(alphaEquivalent);
  assert(firstCanonical.sha256 === alphaCanonical.sha256, 'UID, pseudo, or path changes altered canonical RTL identity');
  assert(firstCanonical.sha256 !== canonicalizeRtlDump(reordered).sha256, 'operation reordering was hidden by canonicalization');

  const assemblyA = '\t.file\t1 "one/candidate.c"\n # -funsigned-char -o\n\t.text\n\taddiu\t$2,$2,1\n';
  const assemblyB = '\t.file\t1 "two/candidate.c"\r\n # -funsigned-char -dr -dS -o\r\n\t.text\r\n\taddiu\t$2,$2,1\r\n';
  const assemblyChanged = assemblyB.replace('addiu', 'addu');
  assert(canonicalizeCompilerAssembly(assemblyA).sha256 === canonicalizeCompilerAssembly(assemblyB).sha256, 'dump-only provenance changed canonical compiler assembly identity');
  assert(canonicalizeCompilerAssembly(assemblyA).sha256 !== canonicalizeCompilerAssembly(assemblyChanged).sha256, 'instruction change was hidden by compiler assembly canonicalization');

  const observation = analyzePassDump(first);
  assert(observation.sites.length === 1, 'allocator site census drift');
  const site = observation.sites[0];
  assert(site.forwardOperationOrder.join(',') === 'return-save#1,owner-load#1,context-load#1', 'forward operation order drift');
  assert(site.decisiveComparator.lastScheduled === 'context-load#1', 'last-scheduled operation mapping drift');
  assert(site.decisiveComparator.save.dependencyFromLast.kind === 'REG_DEP_ANTI', 'anti-dependence mapping drift');
  assert(site.decisiveComparator.save.schedulerClass === 3 && site.decisiveComparator.owner.schedulerClass === 3, 'free anti/output cost was not normalized to class 3');
  assert(site.decisiveComparator.winningClause === 'original-luid', 'wrong scheduler comparator clause');
  assert(site.decisiveComparator.backwardWinner === 'owner-load#1', 'wrong backward scheduler winner');
  assert(site.decisiveComparator.observedSortedFirst === 'owner-load#1', 'derived winner disagrees with dump ready list');
  const schedulerEvidence = validateBaselineScheduleEvidence(
    { symbol: 'fixture', residualRegions: [{ offset: 0, bytes: 12 }] },
    { schedule2: observation },
  );
  assert(schedulerEvidence.allSitesConform && schedulerEvidence.observedSiteCount === 1, 'baseline scheduler evidence validation drift');

  const words = Buffer.from('3c04801d8c84e8bc00408021', 'hex');
  const relocations = [
    { offset: '0x00000004', type: 'R_MIPS_LO16', symbol: 'D_801CE8BC', addend: 0 },
    { offset: '0x00000000', type: 'R_MIPS_HI16', symbol: 'D_801CE8BC', addend: 0 },
  ];
  const state = canonicalEmittedState(words, relocations);
  const reorderedRelocations = canonicalEmittedState(words, [...relocations].reverse());
  assert(state.emittedStateSha256 === reorderedRelocations.emittedStateSha256, 'relocation enumeration order changed emitted-state identity');
  assert(state.relocationSha256 === reorderedRelocations.relocationSha256, 'relocation enumeration order changed relocation identity');
  const changedWord = canonicalEmittedState(Buffer.from('3c04801d8c84e8bc00408025', 'hex'), relocations);
  const wordDifference = compareEmittedStates(state, changedWord);
  assert(!wordDifference.exact && wordDifference.differingInstructionOffsets.join(',') === '0x00000008', 'word difference localization drift');
  const changedRelocation = canonicalEmittedState(words, [
    relocations[0],
    { ...relocations[1], symbol: 'D_801CE8C0' },
  ]);
  assert(!compareEmittedStates(state, changedRelocation).exact, 'relocation identity difference was hidden');
  assert(JSON.stringify(contiguousRegions([0x18, 0x1C, 0x20, 0x30])) === JSON.stringify([
    { offset: 0x18, bytes: 12 },
    { offset: 0x30, bytes: 4 },
  ]), 'residual region grouping drift');

  assert(chooseFocusedVariants([], 2).length === 2, 'focused variant bound drift');
  const exactSmall = { experimentId: 'exact-fixture', sourcePolicy: { class: 'PURE_C' }, outcome: { diagnosticLinkedExact: true } };
  assert(shouldStopFocused([exactSmall], 3).reason === 'exact-small-candidate-ready-for-target-verification', 'exact-candidate stop condition drift');
  assert(shouldStopFocused([], 0).reason === 'no-focused-experiments-requested', 'zero-variant stop condition drift');
  assert(shouldStopFocused([{}, {}, {}], 3).reason === 'bounded-variant-limit-reached', 'bounded stop condition drift');
  const exactConclusion = concludeStudy([exactSmall], 1);
  assert(exactConclusion.pureCandidateReadyForCanonicalVerification && !exactConclusion.familyGeneralizationReady, 'exact small target was incorrectly blocked or generalized');
  assert(concludeStudy([], 0).outcome === 'baseline-only-no-focused-experiments', 'zero-variant run claimed a hypothesis result');
  assert(concludeStudy([{}], 1).outcome === 'bounded-hypotheses-falsified', 'bounded hypothesis outcome drift');
  assert(parseArguments(['--help']).command === 'help' && parseArguments(['-h']).command === 'help', 'help option parsing drift');
  requireIdentity('case-insensitive fixture', 'abc123', 'ABC123');

  const rejections = [
    expectRejection('identity drift', /identity drift/, () => requireIdentity('fixture', 'A', 'B')),
    expectRejection('unaligned residual', /malformed instruction offset/, () => contiguousRegions([2])),
    expectRejection('duplicate variants', /must be unique/, () => chooseFocusedVariants(['do-while-late-transfer', 'do-while-late-transfer'], 3)),
    expectRejection('unknown variant', /unknown focused variant/, () => chooseFocusedVariants(['not-a-variant'], 3)),
    expectRejection('malformed object text', /aligned Buffer/, () => canonicalEmittedState(Buffer.from([0]), [])),
    expectRejection('duplicate relocation offset', /duplicate emitted-state relocation/, () => canonicalEmittedState(words, [relocations[0], relocations[0]])),
    expectRejection('missing scheduler evidence', /site census/, () => validateBaselineScheduleEvidence(
      { symbol: 'fixture', residualRegions: [{ offset: 0, bytes: 12 }] },
      { schedule2: { sites: [] } },
    )),
  ];

  console.log(JSON.stringify({
    status: 'pass',
    canonicalRtlAlphaEquivalent: true,
    decisiveComparator: site.decisiveComparator,
    emittedStateDeduplication: true,
    residualLocalization: wordDifference,
    failClosedMutations: rejections,
  }, null, 2));
}

main();
