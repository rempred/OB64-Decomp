# Combat draw W8 R12 — minimal hybrid continuation

Joe authorized the smallest assembly intervention for the three unresolved W8 targets on 2026-09-08. The eleven focused-exact PURE_C controls remain unchanged. W8 is complete: the single normal verifier passes all fourteen targets and the complete ROM, with eleven PURE_C and three HYBRID_C targets. The hybrids are exact source replacements, not matching C.

All twenty R8 inputs were authenticated and preserved under ignored `build/combat-draw-wave8-r12/starting-inputs/`, including exact local D764 bytes. The current 3C00 default analysis packet was reused from its authenticated cache with refreshed intake. The final authorized source changes are 3C00,6098 and DB10; only the actual 3C00 relocation list changed. Original pure-C sources remain recovery references.

## 3C00

The first controls bind real values in D037. Private results compare the complete linked target, including different extents; these are development measurements, not final ownership/ROM acceptance. Every successful diagnosed input below has exact pinned/tracer assembly agreement under the existing diagnostic-option normalization.

| Input under `build/combat-draw-wave8-r12/3c00/` | Bytes / frame | Different bytes / words | Observation |
| --- | ---: | ---: | --- |
| d037-control | 6740 / 504 | 770 / 261 | D037 reference output reproduced. |
| d037-strip-bound | 6720 / 488 | 2736 / 774 | Direct hard $30 strip binding perturbs frame and permits incompatible hard-register reuse; unselected. |
| d037-companion-bound | 6740 / 504 | 765 / 254 | One $22 companion binding; canonical focused diff confirms HYBRID_C and exact relocation contract. |
| d037-companion-u1-bound | 6740 / 504 | 788 / 255 | Adds $23 short endpoint binding; desired principal register roles appear, but normalization and packet differences remain. |
| d037-strip-identity | 6748 / 504 | 2343 / 663 | Point identity constraint adds two instructions. |
| companion-actual-add | 6740 / 504 | 759 / 249 | One actual `addu` with earlyclobber output removes the five companion construction regressions introduced by its binding. Current useful hybrid intermediate, separate from D037. |
| companion-add-u1-int | 6740 / 504 | 782 / 250 | Binding the endpoint as int still perturbs extraction/scheduling. The actual vertex use retains signed-short normalization. |
| companion-u1-convert | 6740 / 504 | 826 / 282 | Explicit two-instruction signed-short conversion does not repair scheduling. |
| optional-end-bound | 6704 / 504 | 1600 / 447 | Binding and reusing the real optional endpoint introduces broader sharing; one fewer relocation. |
| optional-end-recompute | 6740 / 504 | 759 / 249 | Retaining the original recomputation is byte-identical to companion-actual-add; declaration alone does not retain the constraint. |
| optional-end-andi | 6704 / 504 | 1632 / 455 | Actual constrained mask with shared final consumer still changes extent. |
| optional-end-andi-local | 6744 / 504 | 1459 / 450 | Original final recomputation restores call count but adds an instruction. |
| optional-end-input | 6744 / 504 | 1508 / 462 | Empty input constraint at the actual masked value similarly adds an instruction. |

The canonical companion-only check used one target compiler invocation and 601 sibling cache hits, completed in 117493 ms, and restored D037. Its report is `3c00/d037-companion-bound/focused.json`. All successful full-size private controls have 302 relocations; the 6704-byte controls have 301. Private relocation counts alone are not an exact relocation-contract claim.

The minimal bindings do not resolve the original optional/companion packet scheduling differences. An exact result still needs the right real register lifetimes, call sharing and instruction order together. Worse controls are preserved as input-specific mechanism evidence, not blanket rejection of readable C or hybrid source.

## 6098

The first transparent assembly frame-reservation experiment declares three unread, nonescaping scratch outputs before sourceY and three after it. Their only proposed purpose is HYBRID_C frame control; they are not purported original C fields or runtime values.

`late-home-reservations` uses six earlyclobber general outputs and the actual fixed-$2 return input, clobbering $3 through $25 and $30. The pinned compiler exits 33 with “fixed or forbidden register was spilled.” A separate diagnostic compiler attempt fails identically; no assembly-agreement or successful-output claim applies. Ordinary-output controls before the final packet tail (`reservations-before-tail`) and with $30 omitted (`reservations-allow-fp`) also fail. Sources, policy-expanded inputs and failed commands are retained in the corresponding ignored 6098 directories. The concrete reload limitation is under read-only investigation; no pressure permutation sweep or compiler change is authorized.

The independent lifetime mechanism succeeds without register clobbers. Moving outputs after the factor-zero early exit and inputs to the outer-loop entry preserves the original scheduling boundaries while maintaining across-call/backedge lifetimes. It produces exactly six non-accessed homes at 0x164/0x16C/0x174 and 0x184/0x18C/0x194, sourceY at0x17C and decoded address at0x19C. A point identity constraint through register23 immediately after the actual x0 load fixes the remaining sixteen register-choice words; a function-wide binding instead perturbs two packet scheduling regions.

The final commented source is SHA720791A9D1523EC3E46B564C965EB77D6EBFB09E849EAB8C19B985FF77027B9C. Canonical focused diff reports HYBRID_C EXACT:4148 bytes/frame456, all162 relocation words exact, sole C-object contribution with no fallback and exact placement/linked bytes. The command took133979 ms with one target compile and601 sibling cache hits. `6098/hybrid-final/focused.json` binds the proof. This source is active provisionally; `current-protected-inputs.json` records only its authorized delta from the twenty recovery inputs. Full-wave verification remains pending. All assembly templates are empty; no instruction or data bytes are injected.

## DB10 in progress

Two opaque scratch lifetimes, followed by a separate saved-register clobber and their final input use, add exactly one non-accessed home after the last real home. One lifetime alone allocates register30 despite its listed clobber; two simultaneously live quantities leave one in that register and one homed. The two-reservations input produces5548 bytes/frame560 with only19 differing bytes/six words, all in the sort preheader. Its actual used homes and original three unused homes retain the expected layout; pinned/tracer emission agrees. Canonical focused confirmation binds HYBRID_C, all 209 relocation words, sole C ownership and exact placement; the remaining 19 bytes/six words are nonexact. The command took 183168 ms, with 600 cache hits and two compiler invocations (including one sibling). Production was restored to 5BF6. The source-specific curated pair is recorded in `combat-db10-hybrid-frame-r12.md`.

An actual index-clear instruction with the three real base-address inputs, in an equivalent do/while loop, exposes the separate placement issue. Unsigned integer address operands encode the contexts/resources predecessor bias without forming a C pointer before an array. The compiler nevertheless inserts generated-base copies/stores after the clear; a scoped source-base register binding removes an extra copy, yielding5548/frame560 and23 bytes/seven words, still confined to the preheader. Broader real-base aliases introduce duplicate induction values/homes and are unselected.

Staged-countdown point constraints either prevent induction replacement or retain copies between the generated index and the constrained value. They preserve the new frame but add instructions. These controls do not disprove the original source relation; the remaining question is a minimal source representation that places the actual one-time clear after the already generated base preparation. A truthful explicit-label loop/preheader control is under investigation. All private inputs/results remain under the DB10 directory; production remains5BF6 between focused checks.

## Connected 3C00 packet constraints

The scoped texture endpoint/width constraints first preserve all pre-packet roles with 6740 bytes/frame 504 (u1-point-width: 736 differing bytes/228 words). The optional row and F200 opcode then require distinct real constraints: row in register 19, and a volatile opcode identity in register 2 at its original store boundary. This makes the optional F200 region exact while avoiding a global register-11 constraint, which had displaced the reload scratch register throughout the function.

The optional endpoint normalization needs a dependency on the actual normalized width field before subtraction/shift/mask. A three-instruction control established the schedule; an empty identity followed by ordinary C subtraction/shift and one constrained AND emits identical bytes. The separate row AND retains the exact 4095 mask. These instructions operate on actual packet fields; no dummy data or output rewriting is involved.

| Private input | Extent / frame | Different bytes / words | Observation |
|---|---:|---:|---|
| optional-row-opcode | 6736 / 504 | 1380 / 400 | F200 region exact; endpoint normalization remains early. |
| optional-width-dependency | 6736 / 504 | 1372 / 399 | Dependency at the final AND orders only that instruction. |
| optional-end-chain | 6736 / 504 | 1358 / 393 | Actual three-instruction normalization has correct order. |
| optional-end-point-chain | 6736 / 504 | 1358 / 393 | Smaller assembly emits identical output. |
| optional-row-mask | 6736 / 504 | 1357 / 392 | Correct row mask; final OR remains shared. |
| primary-opcode-point | 6740 / 504 | 792 / 243 | Correcting the actual primary F200 opcode history separates final OR tails and restores full extent. |

All six inputs have 302 actual relocations and exact per-input pinned/tracer agreement; these are private comparisons, not canonical acceptance. The last pair is immutable and released for source-specific curation. Optional packet code is now exact except the three-word cursor-load/line-shift ordering at offsets 12C0–12C8. Two earlier state-pointer store register differences and primary packet differences remain. Production stays D037.

The DB10 lexical-loop control was classified as a phony optimization loop; an explicit internal initializer preserves recognition but adds three actual jumps. Address-taken label anchoring is ruled out by retained compiler code: its REG_LABEL or forced-label handling invalidates the relevant optimization loop. No such source trial or compile was needed.

## Primary packet continuation

On the E91 input, one actual OR of tile offset and F588 opcode fixes the first primary tile's reassociation and register choices (companion-tile-or: 6740/504, 770 bytes/236 words). An empty identity of the same C OR preserves grouping but changes the cursor interleave, so it is retained as a minimization control rather than selected.

A row-shift constraint with a broad memory clobber moves an unrelated zero store. Narrow inputs naming the actual global cursor and previously written E600 first word preserve the store sequence and make offsets 1488–14DC exact (companion-row-store-order: 6740/504, 717/222). The template emits only the real shift; the memory operands declare ordering dependencies and emit no loads.

An actual endpoint sum with the completed width field as a dependency fixes offsets 14E0–14FC without constraining the ordinary subtraction, shift or final mask (companion-end-sum: 6740/504, 685/214). An empty identity of the real endpoint/tag OR prevents reassociation. Binding the actual companion sync cursor to register 17 removes two extra copies and makes 1510–1544 exact (companion-cursor-bound: 6732/504, 1131/329). The shorter extent is unselected; later tile construction and sharing remain unresolved. No replacement instruction or padding compensates for the removed copies.

Each input has 302 relocations and exact pinned/tracer assembly agreement. All controls remain in their named private directories. These source-specific regions are diagnostic progress, not exact-target or complete-wave acceptance.

## 3C00 exact hybrid and minimization

The final packet ordering sequence reaches private exact output: 6740 bytes/frame 504, 302 relocations, with pinned/tracer assembly agreement. The two early differences at E30/E94 were DE packet pointer fields: assigning currentState before the packet and consuming that value fixes them in ordinary C. Splitting the next raw-row calculation and mask around their existing WIDTH calls fills the retail call delay slots. Explicit captures reuse the actual next-command cursor at each observed retail read position; they do not add a second cursor read.

The otherwise-redundant tileBytes read is retained as an explicit input at the normalized-width boundary. This preserves the observed real value and compiler-owned reload, while making no claim that its original source spelling has been recovered. The control removing the authored raw cache still retains an unnamed common subexpression and does not recover that read. It is not selected.

After private exact C0F84D250F195423B364ACA031184A6D5640AE82AA0D3B89422721722400BEC4, bounded single-removal checks removed the optional tail barrier, 12 of 22 fixed-register bindings, 11 of 12 tested nonempty packet instruction templates, and 14 of 29 empty constraints. Each removal was kept only with exact linked bytes and independent pinned/tracer agreement. All rejected inputs remain private. The three removal command batches took 21232, 12083 and 29215 ms wall time respectively, including preprocessing, compilation, linking and interpretation by the helper; reasoning/reporting time is unmeasured. The separate pointer-add simplification also failed and was retained.

Only two nonempty assembly templates remain: the real companion-pointer ADDU (earlyclobber prevents propagation through the stride product) and the final packed-width SLL (its ordinary-C replacement changes extent). Remaining empty constraints preserve actual value identities, exact masks, observed reads and packet store ordering. The final source comments describe those purposes locally. This is practical bounded minimization, not a proof of globally minimum assembly.

The first readable proof input is DC0CD1BC51B2088CD21D7FD937D336C6C9A7280DF8312DD8371DF40BA53F6AB4. A comment-only correction produces final source SHA 627B8E1DDD076AB292711B230E99C877496190066D79267578F59A9843471D69; both have identical expanded input 17C196C2D870931979FF9EE3960AF23BFDFA5DC5DFF80DDB5159B798C312D4A5, four dependencies and preprocessor identity. Private evidence is `3c00/hybrid-readable/` and `3c00-traces/hybrid-readable/`; minimization inputs/summaries use `min-binding-*`, `min-operation-*`, and `min-empty-*`. Canonical focused verification now passes HYBRID_C exact: 6740 bytes, sole objects/c/func_001F3C00.o owner, no fallback, exact placement and all 302 linked relocation words. The first focused run took 129258 ms and exposed the old D037 relocation offsets; only this target's actual list was updated (302 entries, 48 removed/48 added, unchanged type/symbol inventory). The required refreshed diff took 107840 ms with one target compiler invocation and 601 sibling cache hits. Final proof: `3c00/hybrid-final-contract/focused.json`. Linked and expected SHA-256 are 458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A.

## DB10 local bases and exact hybrid

The narrow source-array revert and early reservation declarations preserve real context/resource predecessor identities. Their remaining extra homes were caused by serial loop-motion profitability: removing context/resource from the movable list admitted variant/flag10, then flag8. This was not duplicated address identity. The guarded LA control keeps two bases local but emits two instructions per address and promotes flag8 next; it is unselected.

| Private input | Extent / frame | Different bytes / words | Result |
|---|---:|---:|---|
| sort-offset-first | 5564 / 576 | 814 / 251 | Correct original preheader; two extra accessed homes. |
| inner-address-tied | 5560 / 560 | 905 / 480 | Correct eight-home layout; three base copies remain. |
| inner-cursors-array-stores | 5548 / 560 | 337 / 320 | Real backward cursors remove copies; actor/index register priorities exchange. |
| inner-five-plain-flag8 | 5548 / 560 | 14 / 4 | Ordinary flag8 base restores priorities; two load/address pairs remain reversed. |
| inner-five-load-inputs | 5548 / 560 | 0 / 0 | Input-only constraints recover ordering without extra loads. |
| hybrid-readable | 5548 / 560 | 0 / 0 | Final bounded simplification and comments; canonical focus passes. |

All rows have 209 actual relocations and per-input pinned/tracer agreement. The completed search bound and five actual predecessor cursors retain the original array stores and shift semantics. Integer address arithmetic avoids forming a C pointer before an array; dereferences remain inside the original nonempty shift guard. The current total-run batching bound is unchanged.

Minimization removes all three transient base bindings and both load points once the ordinary cursor representation retains the required history. Two bindings remain: actual source-array base22 and actual resource cursor5. Their separate removal controls regress. Three empty reservation templates and one real index-clear instruction remain; removing the saved-register exclusion loses the required frame, while excluding30 is unnecessary and was removed. Flattening the ordinary base temporaries also regresses and is not selected. An intermediate base-removal selector made one unchanged-input replay; it is not counted as a distinct removal. These are bounded necessity controls, not a global minimum claim.

Final private source is 9F388B973CA8BA7937495B5438A3D2E94A32B064C26132A823F769591CB07274 under `db10/hybrid-readable/`; its trace is `db10-traces/hybrid-readable/`. Earlier exact26F2 and every rejected control remain immutable. The two grouped minimization commands took 6964 and 3417 ms wall time, including their preprocessing/compiler/link/trace calls; other reasoning and reporting time is unmeasured.

Canonical DB10 focus passes on the final source in 105841 ms: HYBRID_C, sole objects/c/func_0020DB10.o owner, no fallback or fill, exact placement, all 209 relocation words and unchanged existing relocation contract. Linked/expected SHA-256 is A47D14C3227F9FAD494097A03496A8759DE3C1A19E00324012CD541C53732EB7; expanded input is D2DC36CC1E0718535997A08FA6FD6148D85406B6DE6FD28EAAA26FB5E21D8C9F. Proof: `db10/hybrid-readable/focused.json`. The heuristic score is 1140, while decoded pairwise rows and complete linked bytes are exact; score alone is not acceptance.

## Completed wave

The one normal `node tools/verify.js` invocation exited 0 with EXACT BASELINE. It includes the CURRENT build, canonical ownership/placement/relocation/target-byte checks, full-ROM comparison, fresh recompilation and final source policy. Wall time was approximately 1215 seconds, measured from process creation to the verified-state timestamp; this includes all command phases, not reasoning time. No redundant build or verifier ran.

The exact fourteen-target census is 11 PURE_C plus 3 HYBRID_C (func_001F3C00,func_001F6098,func_0020DB10). Every target has one C owner, no original fallback/fill, accepted placement, exact relocation words, zero differing bytes and words, and fresh source/object identity. All twenty current-protected inputs authenticate. The only recovery differences are the three C sources and the 3C00-only actual relocation record. D037/D764/5BF6 recovery bytes remain preserved. No shared tooling, flags, compiler identity, structural contract, ownership rule or runtime changed.

ROM: 41943040 bytes, SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. CURRENT fingerprint: 9878C600CE8BAE6574C9A7410AD891954E2017B8C6221441DC8F10AB442FF51B.

Immutable ignored evidence under `build/combat-draw-wave8-r12/`:

- `final-verification.json`: 106C508ED41DF29185C380F40CF489D22B0B2A6289BAD883777C116A6B7C60A4.
- `final-fresh-compilation.json`: 07607B6FEF43E4066826FAC1D638A5063180B491D9A1D7A1BC207EF66FC1DE20.
- `final-source-policy.json`: 99A9D35B4BE6CE698AC0D93E41E0275798B1B0AD76143230FAA89D0BF28C0E12.
- `final-wave-census.json` binds each of the fourteen source hashes, classes, owners, placements, relocation counts and expanded inputs. `final-verify.stdout.txt` records the successful invocation; stderr is empty.

All source/build/report writes and processes are released for integration. No commit or push was performed by this worker.
