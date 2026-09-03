# High Attack Battle Stream Wave 1 Structural Correction Independent Re-review

Verdict: **Revision required**

Material result: corrected commit `67feba18102c6c8e11d6078016bd7f14c62e135d` makes the ordinary Phase 8 positive path work: exact 140-byte C owns `.ob64.r4033.s0`, retained assembly alone owns non-executable `.ob64.r4033.s1`, the map and ELF are exact, and the rebuilt ROM is canonical. The correction does not, however, satisfy the prior finding's fail-closed acceptance condition. Its external layout verifier accepts a mixed-row record that falsely classifies the C-owned executable slice as non-executable and accepts related placement and structural-provenance contradictions.

Consequence: do not integrate the frozen corrected subject or return the six blocked functions to ordinary Matching-C work yet. The exact build is sound, but the assigned layout-provenance proof can certify a materially false slice record.

Director action: route the narrowed residual of `HABSW1-SR-F01` to a correction worker. Require complete accepted-row structural comparison for both mixed-row slices and focused rejection tests, then proportionally re-review that bounded verifier correction.

## Frozen subject and protocol

- Worktree: `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-1-structural-audit`
- Branch: `codex/high-attack-wave-1-structural-audit`
- Frozen corrected subject: `67feba18102c6c8e11d6078016bd7f14c62e135d`
- Correction comparison base: `bbec5a2b426330b094c07d18ab5b35446564e712`
- Original audited subject: `7c8ff722b290e4a754effb969d7931aaa0d2d3cb`
- Correction worker task: `01a06309-6831-7e02-88e2-b0cd2be57b86`
- Reviewer task: `01a063b3-508e-7a11-8852-27196080c7d1` on host `local`
- Launch: `HABSW1-SRR-20260902-01`
- Workspace claim: `docs/Plans/task-logs/ob64-high-attack-wave1-structural-correction-rereview-20260902-r1-HABSW1-SRR-20260902-01.claim.json`
- Claim SHA-256: `64805C1CC3051B42F1E562795E835521654E77284B4928850CE12B5E5692FF50`

Before the first review write, I confirmed an exact clean `HEAD`, the assigned branch, the absence of the assigned claim, log, and report, and no other actor in the physical worktree. I constructed the complete claim in memory, created it atomically with create-new semantics, read it back, and did not edit it. After the long-running audit, `HEAD` and the claim hash were unchanged, the only non-ignored worktree item was the reviewer claim, and no competing actor was present.

The correction commit has the exact parent `bbec5a2b426330b094c07d18ab5b35446564e712`. Its frozen delta contains the correction records, two lifecycle addenda, two implementation changes, and two test changes. It does not change accepted assembly, source classification, active Matching-C configuration, linkage configuration, or the four underlying structural conclusions. `git diff --check bbec5a2b..67feba18` passed.

The immutable correction claim's receiving-task attribution error remains preserved. The attribution addendum and its independent create-only claim identify the worker task without rewriting that evidence. The later whitespace addendum is also lineage-only. Neither addendum entered the technical result.

## Correction-review mapping

| Earlier item | Status | Re-review result |
| --- | --- | --- |
| `HABSW1-SR-F01` | Run again | Unresolved in narrowed form. The positive split-row path is corrected, but the finding's explicit fail-closed execution, placement, and provenance acceptance condition still fails. |
| Four underlying ROM/owner conclusions | Keep | Their evidence identities are unchanged, and the correction does not alter the accepted model, assembly, ROM evidence, or classifications. |
| Exact current baseline and unrelated Phase 7/8 protections | Run again | The correction changes shared Phase 8 ownership/layout logic; affected suites and the heavyweight audit passed. |
| Detailed mixed-row layout consistency | Add | The new per-slice layout representation creates a direct generator/verifier consistency risk; the smallest one-field mutations exposed it. |

No underlying structural conclusion was reopened. The earlier independent review remains the evidence record for the loader slab, the 140-byte executable boundary, the two-row logical owner, and the 65-entry table with same-slab auxiliary ownership.

## Claims reviewed

| Assigned claim | Independent result | Decision |
| --- | --- | --- |
| Ordinary Phase 8 supports exact 140-byte C ownership of `.ob64.r4033.s0` while retained assembly solely owns `.ob64.r4033.s1` | The real resolver, compiler, pruning, linker, map, ELF, and exact-ROM path passed | Supported for the positive path |
| Map, ELF, and layout provenance are unambiguous and fail closed | Map and ELF checks passed; the detailed layout verifier accepted false execution, placement, and provenance fields | Not supported |
| The generic correction does not weaken unrelated owner, placement, execution, auxiliary, or exact-ROM gates | Existing affected suites and the full audit passed; no unrelated weakening was found | Supported, subject to the mixed-layout finding |
| The correction stays outside Matching-C activation, semantic naming, assembly changes, and source-class changes | Frozen-delta inspection found none of those changes | Supported |

## Review method and positive result

I inspected the complete frozen correction diff and traced the corrected owner from `resolveAcceptedRows` through fallback pruning, layout generation, linker-map verification, ELF/model verification, target byte comparison, and exact-ROM verification. I then exercised the real split-row build fixture, inspected its linked artifacts independently, reran the affected generic suites, and completed the heavyweight audit.

The positive fixture established:

- the resolver owner has `logicalOffset = 0`, `logicalEnd = 140`, and `bytes = 140`;
- `objects/c/func_0021C8DC.o` contains only the relevant `.ob64.r4033.s0`, with 140 bytes, executable/alloc flags, and SHA-256 `58A0D8F0D763A659AC0E489FC9F6F117B2C628496F07F7E42F37304B59EAB19C`;
- the pruned `objects/assembly/chunk_033.o` retains `.ob64.r4033.s1`, with eight alloc-only bytes and SHA-256 `AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC`, while `.s0` is absent;
- the map has exactly one `.s0` contribution from `objects/c/func_0021C8DC.o` and one `.s1` contribution from `objects/assembly/chunk_033.o`;
- the linked ELF places executable `.s0` at ROM `0x0021C8DC`, VRAM `0x801D960C`, size 140, and alloc-only `.s1` at ROM `0x0021C968`, VRAM `0x801D9698`, size eight;
- the corresponding `PT_LOAD` records have flags `R|X` and `R`, respectively; and
- the 41,943,040-byte ROM has canonical SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The emitted layout is correct in this successful build. The blocking issue is that the assigned independent layout check does not prove that correctness.

## Blocking finding

### HABSW1-SR-F01

**Finding ID:** `HABSW1-SR-F01`

**Finding:** The correction resolves the original split-row over-rejection but leaves its required external-layout gate fail-open for the matching-C slice's execution, placement, and structural provenance, and for retained-slice placement provenance.

**Failed assigned claim or gate:** The correction re-review requires unambiguous map/ELF/layout provenance and fail-closed negative behavior. The original finding's acceptance test explicitly requires mutations of either slice's owner, execution flags, placement, bytes, or provenance to be rejected. The correction report likewise claims that the external verifier compares both slices' provenance, execution classification, and placement with the accepted row.

**Frozen subject:** `67feba18102c6c8e11d6078016bd7f14c62e135d`, specifically `verifyPhase8Layout` in `tools/lib/phase8_matching_c.js` and its negative coverage in `tests/split_row_phase8.js`.

**Direct observation:** In the mixed-row branch, `verifyPhase8Layout` compares the matching slice's input kind, source/fallback identity, symbol, logical offset, and linked owner, but not its `executable`, ROM extent, VRAM extent, placement kind, load-slab identity, or executable/non-executable range identities. On a reviewer-owned copy of the valid fixture layout, changing only `.ob64.r4033.s0.executable` from `true` to `false` was accepted. Independent one-field changes to its ROM start, VRAM start, placement kind, load-slab identity, and non-executable-range identity were also accepted. The retained slice correctly rejects execution and ROM-placement mutations, but accepts wrong placement kind, load-slab identity, and non-executable-range identity. Unchanged control mutations to `.s0.matchingCLogicalOffset`, `.s1.executable`, and `.s1.romStart` were rejected, confirming that the real verifier was reached.

**Reachable producer path:** `writeLayout` emits `layout.json` during every ordinary Phase 8 build, and `verifyPhase8Output` reads that artifact and delegates its structural validation to `verifyPhase8Layout`. A one-field generator defect can therefore create the tested state before the ordinary verifier runs. No malformed source candidate, post-verification tampering, unsupported runtime state, or semantic assumption is involved.

**Material consequence:** A build can receive a passing external-layout decision while its authoritative mixed-row slice record says that the 140 executable C bytes are non-executable or attributes either slice to the wrong placement provenance. The simultaneously correct map/ELF/ROM evidence does not make that contradictory layout provenance unambiguous. The structural result therefore cannot yet be propagated as a certified dependency for ordinary Matching-C work.

**Supporting evidence:**

- `tools/lib/phase8_matching_c.js:1926-1935` omits the matching slice's structural fields from the comparison.
- `tools/lib/phase8_matching_c.js:1937-1950` checks retained execution and extents but omits its placement kind, slab/overlay identity, and range provenance.
- `tests/split_row_phase8.js` mutates only `matchingCLogicalOffset` for its matching-C layout-provenance negative, so the missing execution and placement comparisons are not exercised.
- `build/reviewer/HABSW1-SRR-20260902-01/layout_mutations.js` is the focused reviewer harness, SHA-256 `3D8534B9024A16E78158E6B1590D6F2ABE702220FDD78CE9D5D295B3A204AB0C`.
- `build/reviewer/HABSW1-SRR-20260902-01/layout_mutation_results.json` records three rejected controls and nine accepted contradictory records, SHA-256 `701878C282AA67817DC3F6A22BFDCF62A6A57A5B82952F2F062BD9F8F2488D4B`.
- `build/reviewer/HABSW1-SRR-20260902-01/positive_census.json` records the independently inspected valid objects, map owners, ELF sections, load segments, and ROM identity, SHA-256 `D9A4014B5B483AE40A97C4CC1905526B1A07FE7611E1BDC98CFB159856ADD1D0`.

**Smallest correction boundary:** Keep the corrected resolver, pruning, linker, map, ELF, and ROM logic. In `verifyPhase8Layout`, compare each mixed-row layout slice's complete existing structural projection with its accepted row slice: ROM/VRAM bounds, execution classification, placement kind, descriptor/slab/overlay identity, and executable/non-executable range identity, in addition to the ownership decoration already checked. Add one-field negatives for matching-C execution and placement/provenance plus retained placement provenance. No accepted model, writer meaning, assembly, source class, candidate activation, or linkage contract needs to change.

## Mutation admissibility record for HABSW1-SR-F01

1. **Assigned condition:** both mixed-row slices must have unambiguous accepted-row layout provenance, and mutations of either slice's execution, placement, or provenance must fail closed.
2. **Supported producer:** the ordinary `writeLayout` generator can produce the detailed slice record; generator defects are an accepted producer class.
3. **Ordinary sequence:** resolve accepted owner, compile and prune, write layout, link, then run `verifyPhase8Output`, which calls `verifyPhase8Layout` on the generated artifact.
4. **Material consequence:** the proof can pass while classifying executable C as non-executable or assigning a slice to false placement provenance, so the layout evidence is contradictory and unsafe to propagate.
5. **Smallest useful falsifier:** change one existing field on one slice in a reviewer-owned copy and invoke the exact frozen layout verifier, with unchanged rejected controls.
6. **Evidence-grade fit:** this remains a static structural ownership, placement, execution, and provenance test. It does not request runtime or semantic evidence beyond the assigned grade.
7. **Threat-model fit:** the test models a generator defect in the newly added mixed-row schema, uses the same mutation boundary as the assigned negative tests, and does not invent an unbounded hostile environment.

Classification: admissible acceptance test.

## Tests and results

| Check | Result |
| --- | --- |
| `node tests/active_targets.js` | Pass; 500 active targets and corrected 140-byte logical extent |
| `node tests/split_row_phase8.js` | Pass; exact `PURE_C` fixture, exact ROM, and its eight covered mutations rejected |
| `node tests/phase7_conventional_build.js --output <accepted reviewer baseline>` | Pass; execution, placement, and slab mutations rejected |
| `node tests/phase8_matching_c.js --output <current Phase 8 build>` | Pass; established owner, auxiliary, source-proof, and exact-ROM mutation suite |
| `node tests/multi_owner_phase8.js` | Pass; unrelated two-row structural fixture and exact ROM |
| `node tools/audit.js` | Pass; Structural protections and CURRENT exact ROM |
| Reviewer `layout_mutations.js` | Fail acceptance; three controls rejected, nine execution/placement/provenance contradictions accepted |
| Direct object/map/ELF/ROM census | Pass for the valid emitted fixture |
| `git diff --check bbec5a2b..67feba18` | Pass |

The fresh audit completed at `2026-09-02T22:38:55.065Z` with 500 proof targets, 439 `PURE_C`, 61 `HYBRID_C`, zero `UNKNOWN`, zero compiler-assembly rewrites, three auxiliary sections, and the canonical ROM hash. Its report is `build/audit/report.json`, SHA-256 `71C60230508E302A49661EBA47FB695B424347D8B6991EF31F03AC6CB109B0E1`.

## Reused evidence and limits

- The four underlying structural conclusions are reused from the frozen original independent review because this correction changes only active-target logical extent and Phase 8 split-row consumers.
- The split-row exact source is generated under ignored test output. It proves pipeline support but is not an activation, a canonical source change, or a new Matching-C claim.
- The actual generated layout, map, ELF, and ROM inspected here are correct. The finding is limited to the external layout verifier's ability to reject an admissible generator defect.
- No weakening was found in the actual map/ELF ownership checks, fallback pruning, exact bytes, exact ROM, auxiliary ownership, multi-owner behavior, source policy, or unrelated Phase 7 placement/execution gates.
- No semantic name, original translation-unit boundary, or Matching-C implementation is assessed.

## Documentation consequences and exact route

The correction report's corrected-behavior item 6 and its claim that split-row execution, placement, bytes, and provenance are fail-closed are overstated until this verifier gap is corrected. Preserve the positive evidence and the supported underlying structural conclusions; update the correction record only through a worker-owned follow-up.

The Director must not integrate `67feba18102c6c8e11d6078016bd7f14c62e135d` as the completed structural dependency. Route only the bounded `verifyPhase8Layout` comparison and negative-test correction described above, freeze the result, and request a proportional independent re-review of `HABSW1-SR-F01`. Do not reopen the four underlying ROM-evidence conclusions or expand the correction into Matching-C implementation, semantic naming, assembly ownership changes, source classification, or a `func_0021CBC4` linkage contract.
