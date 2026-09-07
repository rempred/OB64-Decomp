# Verdict: Accepted

**Material result.** The frozen D14C package supports the claimed artifact correspondence, the bounded candidate-to-retail loop correspondence, the conclusion that the candidate cursor form already exists in initial RTL, and the separate conclusion that the candidate loop index first appears as hard register `s3` between local and global allocation. The evidence does not identify the upstream cause of either difference and does not establish retail compiler-pass history.

**Consequence.** These results may be propagated as static, offline diagnostic research. They do not accept a candidate or source, establish whole-function semantic equivalence, award matching credit, partition the internal table, or authorize production changes. The complete 6,844-byte `func_0022D14C` owner and all shared-wave dependencies remain intact.

**Required Director action.** Record the two bounded diagnostic conclusions as Supported research only. If the proposed follow-up is useful after the W7 source/build writer releases its production surface, route one separately authorized, one-variable source-expression experiment and retain the complete owner and existing structural gates. Do not activate source from this review; any later candidate must pass its assigned linked-byte, ownership, source-class, and complete-ROM gates.

## Frozen subject and eligibility

- Assignment: `combat-d14c-diagnostics-review` revision 1, launch `COMBAT-D14C-DIAGNOSTICS-REVIEW-20260907-01`.
- Frozen subject: `bfa83ed20cad7570c0ff50c438a39093173ca613`.
- Accepted source baseline: `0e1191013aeebed2929c9caff7c1f139169ad7f3`.
- Frozen report: `docs/Plans/task-logs/combat-d14c-preserved-diagnostics-r1.md`, 13,800 worktree bytes, SHA-256 `C67BA3B53F4CB12FFBC8F85CCFBA645A265BA45548F43E627D916A1EB7B87DCD`.
- Frozen evidence: `build/combat-d14c-preserved-diagnostics-r1/evidence.json`, 74,164 bytes, SHA-256 `4F81BBF9542EE4651C3011DDCE6FA47BC4FBB97B410D064477C99EA3DF750FBB`.
- Reviewer: `/root/compilation_groups_implementation_review`, independent of the worker that produced the subject.

The subject commit's report blob is 13,799 bytes with SHA-256 `3A98A949F29B630D0282DD09FE7D206931DA9CC726C14801973359CA91598ABD`. Byte comparison found only the checkout's added carriage return in the final newline; after newline normalization the blob and assigned worktree report are identical. The assigned local artifact therefore resolves uniquely. This is an identity note, not a finding.

The worker reported a completed offline diagnostic; the package is explicitly `acceptanceEligible: false`. W7 production inputs were excluded, the review paths were unclaimed, and all review mutations stayed under the assigned ignored root. No compiler, build, linked diff, verifier, source-policy generator, runtime, GUI, bridge, database, or Git mutation was used.

## Claims reviewed

1. P03's source, assembly, and thirteen pass dumps correspond to the preserved E07 candidate artifact.
2. The selected final-loop regions correspond in bounded operations and control flow despite different instruction layout, frame size, cursor expression, and allocated index register.
3. The candidate's cursor-relative address form exists before allocation and scheduling, so final allocation or scheduling cannot be its sole origin.
4. The candidate index remains pseudo `176` through local allocation and materializes as hard register `19` (`s3`) in global allocation; this stage observation does not establish the causal root of the choice.
5. The suggested aggregate-relative formulation is a bounded research follow-up rather than an accepted repair or source activation path.

## Independent method and results

I used a reviewer-owned Node.js static checker to recompute identities and decode only the assigned evidence. It independently rehashed all 19 input records; reconciled the embedded source text, P03 assembly, E07 assembly, object bytes, relocation records, original retail word records, overlay mappings, and family inventory; then checked the cited lines against every raw pass dump. The successful result is `build/combat-d14c-diagnostics-review-r1/attempt-02/static-review-result.json`, SHA-256 `D4B8AB1D929E5DDE20FBB0D0E93CC195A7290B315AF69C221B43034834E3A0A4`.

### Artifact correspondence

- All 19 package inputs exist and match their recorded byte lengths and SHA-256 identities. The thirteen dump identities match P03's manifest.
- P03's embedded `sourceText` exactly matches the 41,217-byte `func_0022D14C.c` input.
- P03 `func_0022D14C.s` and E07 `candidate.compiler.s` are byte-identical after removing only their `.file` directives and compiler-command comments. Those two removed lines account for the path and dump-option differences; no code line was normalized away.
- E07's base64 object text decodes to 6,744 bytes and matches the candidate word evidence. The original assembly contains 1,711 contiguous retail words from ROM `0x0022D14C` through `0x0022EC08`, or 6,844 bytes, and matches the frozen native-word evidence.
- The accepted overlay records resolve the D14C loaded entry to `0x801E9E7C`; the bounded retail call encodings resolve consistently with the accepted mappings for `func_0020BFE4`, `rand`, and `func_0021D230`.

This establishes correspondence of the historical artifacts at the package's static evidence grade. It does not authenticate or reproduce the historical compiler today, and it does not make the 6,744-byte candidate acceptance eligible.

### Bounded candidate-to-retail region

The independently decoded regions have the same bounded operation sequence: call `func_0020BFE4`; reject zero and nonpositive count; initialize index/cursor; call `rand` three times; form the random value including the `% 6` lowering with multiplier `0xAAAAAAAB`; call `func_0021D230` with event `0x2F` and argument `0xFF`; store value plus 10 at object offset `0x94`; update the maximum at stack offset `0x16C`; advance index and cursor; loop; and store the maximum through the output pointer.

| Observation | Retail | E07 candidate | Review judgment |
|---|---|---|---|
| Calls | five calls in the bounded region | five corresponding relocations | Corresponds |
| Cursor initialization | `sp + 40` | `sp + 192` | Different form |
| Selected-entry load | `152(s2)` | `0(s2)` | Both select post-prologue `sp + 192 + 4i` |
| Loop index | `s5` | `s3` | Material register difference |
| Frame size | 616 bytes | 576 bytes | Prevents absolute-address equivalence |

The affine slot equality is local to each post-prologue frame. Because the frames differ by 40 bytes, this review does not claim identical absolute runtime addresses. Nor does the bounded operation correspondence prove that the surrounding 6,844-byte owner is semantically equivalent. E07 remains 100 bytes short and `rawExactBytes: false`.

### Compiler-stage conclusions

The raw pass dumps independently support the reported transition:

| Stage | Cursor | Index |
|---|---|---|
| Initial RTL | pseudo `112 = pseudo 69 + 152`; load through pseudo `112` | pseudo `176` |
| CSE | pseudo `112 = frame pointer + 192`; load through pseudo `112` | pseudo `176` |
| Local allocation | pseudo form retained | pseudo `176` retained |
| Global allocation | pseudo `112 -> hard 18` (`s2`) | pseudo `176 -> hard 19` (`s3`) |
| Final/delay-slot dump | `s2` cursor retained | `s3` index retained |

Thus the candidate cursor form predates the final allocator and scheduler. Separately, the hard-register selection becomes observable between local and global allocation. The dumps cannot show why global allocation chose `s3`, and there are no original retail intermediates against which to compare a retail stage transition.

## Admissible findings and competing explanations

No admissible defect was found in the assigned claims.

The strongest remaining alternatives are upstream source/aggregate representation, earlier lowering or CSE decisions, and broader live-range or register-pressure differences caused outside the bounded loop. Any of those could contribute to the candidate's address form, its `s3` choice, the 40-byte frame deficit, or the 100-byte text deficit. The frozen report keeps these explanations open and does not mistake the observed materialization stage for a cause.

The proposed follow-up is proportional: vary one defined aggregate-relative address formulation, preserve the operations, their order, and the full owner, then inspect initial RTL/CSE first. If CSE reproduces the current cursor form, that hypothesis is falsified. If the address form changes, inspect allocation separately rather than attributing both discrepancies to one cause. This remains a research experiment requiring a separate assignment; pointer-rule exceptions, register binding, source-policy exceptions, table extraction, and source activation are outside it.

## Reused evidence, reviewer-tool history, and limits

The review reused the immutable P03/E07 artifacts and original retail assembly named in the frozen evidence package. It did not reuse the worker's interpretation as a test oracle: identities, word encodings, address arithmetic, pass excerpts, and family membership were recomputed from the named files.

Reviewer attempt 01 stopped on an over-specific assertion about doubled backslashes in GCC's `.file` string. It created no result. The failed script, its SHA-256 `8B9E3687537346FC4EDCFDF1FC8FC6F244D637EB44197E54F77B16780F19789F`, and the supported cause are preserved under `build/combat-d14c-diagnostics-review-r1/attempt-01/`. Attempt 02 changed only that separator-independent regression and its clean-root path, then passed. This reviewer-tool repair has no bearing on the frozen subject.

Static evidence cannot recover the original compiler's intermediate state, prove whole-function behavior, or explain the remaining frame/text differences. The family reconciliation found 8 W5 targets, all 17 W6 shared owners including complete `func_0022D14C`, 7 W7 targets, and 15 W8 targets; the B438/B894 and EAF0 dependencies remain present. The separate 64-byte table-interior structural gate remains unchanged.

## Exact next route

The Director may propagate the early-address-form and global-allocation-materialization results as Supported diagnostic research. Production remains with the existing sole writer. After that writer releases its surface, the Director may either leave the evidence queued or issue a new bounded research assignment for the one-variable formulation experiment described above. That assignment cannot accept or activate source. Any resulting candidate must return through the applicable complete-owner and canonical wave verification path, with the table-interior structural gate and all shared dependencies preserved.
