# W7 func_00207E30 second look

Completed: the frozen evidence supports one narrow row-state experiment and identifies a current-variant allocation evidence gap. The Director can route this result to the sole W7 source worker. This assistance adds no independent source-review or acceptance gate.

## Scope and identities

Launch COMBAT-COMPOSITING-WAVE7-SECOND-LOOK-20260907-01; worker /root/compilation_groups_design, Astra Medium, local. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988. The complete atomic claim was created and read back at 2026-09-07T02:40:45.4932312-04:00. Starting HEAD was 8335c1e15aa0819b08043c3e58dca1f60acf22ce.

Inputs are only the assigned current snapshot, separate older diagnostic variant, original owner and canonical ROM. Accepted source baseline remains 0e1191013aeebed2929c9caff7c1f139169ad7f3. No live W7 candidate or header was read as an analysis input. Both input directories remain unchanged.

Current snapshot root: build/combat-compositing-wave7-r1/second-look-inputs/. Older variant root: build/combat-compositing-wave7-r1/rtl-207E30/. All identities below are SHA-256.

| Input | Identity |
|---|---|
| Current candidate.c | 8F8B61C0B367FDF521A44CCB422B1768318FBA48F8F365107ADA0C268E9C6A81 |
| Current candidate.input.c | 8D519D775786A25A4E4A31AC0750A1625D9C8AAC12DAAD202AD85DEECD70460D |
| Current candidate.compiler.s | 9B712C38B687B32D7F3E45037CC7F9A41B912DB1C1E2145E977C8690703E2CCB |
| Current candidate.raw.o | 87CB58F90DAE7B09A05B765AB6B38B3D7EDB6E464E671675485080410469540A |
| Current candidate.raw-evidence.json | 7862FD27328A0AD2C162B2CF5207CB584074FA953F50FA7727B0192A64284B1D |
| Older candidate.c | 90A65C1A2597DD43A991E9D192BE78B0A69382FC2B4E4E3AB687D4B8A3F0ACE4 |
| Older candidate.s | 4314A5F9621121A5F00D11A28F732F6395D3F7E7F43EDD05ECEAB7B1DC3AF3A6 |
| Older diagnostic-command.json | 72F12AF0C61A4974469E51124941CC5A14AFD9E81A7CF9E71F857C8477E7CD07 |
| Original func_00207E30.s | 9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6 |

Current source, compiler-input, assembly and object hashes agree with its raw-evidence record. Its policy record independently binds the same source and reports PURE_C. That classification does not accept its nonmatching output. The saved object has a 1,760-byte .ob64.r3844 section and a 272-byte frame. The complete retail owner has 1,752 bytes and a 264-byte frame.

The older command records successful status and -da with the named cc1 path. All seven assigned pass files are separately hashed in the evidence package. Their pseudo IDs and stage counts apply only to that older source. Its co-located command/dumps supply preserved diagnostic association, not a fresh reproduction or cryptographic source-to-pass execution receipt.

## Checked allocation facts

The worker's reported older counts are correct specifically in the flow dump. They are not the later local-allocation counts.

| Older variable | Pseudo | flow references / span / crossed calls | lreg references / span / crossed calls | greg result |
|---|---|---|---|---|
| sourceRow | 86 | 11 / 254 / 3 | 11 / 197 / 3 | Spilled |
| maskStride | 96 | 5 / 227 / 0 | 5 / 182 / 0 | Spilled |
| inputMask | 97 | 5 / 209 / 0 | 5 / 181 / 0 | hard16, s0 |
| Row index y | 98 | 13 / 227 / 0 | 13 / 194 / 0 | hard30, fp |

These are compiler-reported statistics, not dynamic execution frequencies. Older flow lines 34 and 58 record the sourceRow/y claims. Older lreg lines 34 and 58 give the changed spans. The greg allocation list places 98 before 86. Its disposition at line85 assigns 98 to hard30 and 97 to hard16. This supports allocation competition, but does not prove a complete priority formula or a unique repair.

Stable older UIDs tie the variables to operations: 303 initializes sourceRow from input+8; 352 receives maskStride; 406 forms inputMask. UID984 advances sourceRow, UID990 advances maskRow, and UID996 increments y. Initial RTL and later excerpts are preserved. UID996 becomes a hard30 increment in greg. UID352 becomes a stack+180 store in that older greg. The current variant's same numeric stack offset has a different role.

The current source differs materially from the older source. It introduces sourceStart and explicit rows reloads, moves inputMask construction, and changes high-nibble expression spelling. The current assembly already assigns maskStride to s0 and stores inputMask. Therefore, the older inputMask allocation must not be used to diagnose current mask-header ownership.

## Current-to-retail correspondence

Names below identify source roles only; they do not establish whole-owner game semantics. All stack offsets are relative to each function's own frame.

| Role | Retail evidence, z64 ROM | Current compiler assembly evidence |
|---|---|---|
| Source-row cursor | 0x00208054 initializes fp=input+8; 0x00208494 advances fp | Lines327–328 store input+8 at stack+124; lines664–668 load/advance/store it |
| Mask-header pointer | 0x002080D8..DC form and store inputMask at stack+AC | Lines337–338 form/store inputMask at stack+180 |
| Mask stride | 0x002080E0 moves helper result to s0; 0x002084A4 uses s0 | Line339 moves result to s0; line666 advances maskRow with s0 |
| Row index | 0x002080B4 stores zero at stack+B4; 0x002084AC..C0 loads, increments, compares and stores | Line295 initializes fp to zero; lines674–675 increment/compare fp |
| Alpha-row cursor | 0x002080F0 forms s6; 0x002084A8 advances s6 | Lines352,417,671,680 use stack+228 |

The three helper calls before row setup, the input+8 cursor, maskBase+8/header and maskBase+16/data relationships establish this correspondence. Row iteration advances four cursors and reloads input height. This is not an equal-offset instruction comparison.

Retail's row-index update loads the stored index once, reloads input height, increments the loaded value and compares it. It stores that same incremented value in the back-edge delay slot. This matters for the proposed experiment: an additional volatile reread would have no counterpart here.

Current sourceRow initialization has already moved after all three helper calls in the final assembly. Its source spelling begins earlier. A suggestion merely to move that assignment later is therefore not a discriminating repair from these artifacts. Current rows is also already reloaded before each back edge. A spelling sweep over equivalent rows assignments has no new evidence basis.

## One bounded testable hypothesis

**H1 — make the real row index stored state, with one short-lived next-row value.** The hypothesis is that y consumes a register needed by a row cursor. Retail's actual index load/store provides a concrete reason to test this storage form.

The source worker can test a local volatile int for the actual y state. Keep an ordinary nonvolatile next-row temporary for the incremented value. Initialize y once, and guard entry using the already loaded input height. For each row, read y once, compute its successor, store that successor once, and compare the successor with the freshly loaded height. Use the temporary for the comparison; do not reread volatile y. Preserve the existing cursor advances, memory operations and complete loop behavior. This is an ordinary C hypothesis, not a candidate supplied or tested here.

A volatile local must model this actual loop-carried index. Do not add padding, dummy state, pointer escapes, register bindings or fabricated accesses. The initial guard avoids introducing a volatile y read before the first row. It must retain zero-height behavior. The bounded height is an unsigned short in both preserved sources; the new form must retain the existing increment and access order.

**Predicted early-stage effect:** the carried index becomes a memory operation rather than a long-lived y pseudo. The next-row value should span only the update/compare/store region. This prediction can be checked before interpreting a final register change.

**Predicted allocation effect:** one long-lived competitor for fp disappears. sourceRow may receive fp, but alphaRow or another contender may receive it instead. Neither outcome is predictable uniquely without the current allocation graph. A 264-byte frame and retail register distribution are possible success criteria, not promised consequences.

**Falsifiers and stop points:** if a long-lived index pseudo survives, the proposed lifetime mechanism failed. If it disappears while sourceRow still spills, freeing y alone is insufficient. If the compiler adds an initial index load, repeated volatile loads, extra stores or a changed loop guard, the access-shape prediction failed. Any disturbance of the solved channel order or byte load/narrow/store region requires reassessment. Matching remains a linked-byte question, not a frame-size score.

The Director relayed three later worker trials before this handoff: sourceRow as the initial call result emitted 1,760 bytes; an explicit next-row counter emitted 1,764; a typed u16 source-row pointer emitted 1,760. None fixed allocation. Those later source identities are outside the frozen inputs, so exact correspondence with H1 is unresolved. H1 specifically changes the actual loop-carried y to volatile storage, not merely a nonvolatile next-row spelling. The source worker must first compare that distinction with the existing 1,764-byte trial. If that trial already used the same one-read/one-write stored-state form, H1 is already tested and must not be repeated. This report supplies no additional variant in that case; the current allocation-artifact gap remains the result.

A plain volatile declaration with the original while(y < rows) spelling would likely add observable reads. That is not the proposed control. The short next-row value is essential to the one-read/one-write prediction. Store scheduling into the retail delay slot is also unproved.

## Precise evidence gap and retained work

The named current snapshot has no current-source RTL, flow, lreg or greg dumps. Older pseudo86/98 ordering cannot fill that gap. The current final assembly confirms the storage outcome, but does not identify which current competing lifetime caused it. If H1 frees fp without improving sourceRow, current-source allocation evidence is the narrow next diagnostic. This task generated no such compilation.

No second source recipe is justified from these inputs. Current mask-header/stride storage already moved toward retail. A mask-pointer qualifier or older-variant rollback would combine a solved-region change with the row experiment. The current direct indexed pixel reads and existing single volatile byte read remain untouched.

The complete seven-member W7 and its sole production worker remain unchanged. This report establishes neither source acceptance nor a whole-owner semantic claim. Only the original complete-wave PURE_C, ownership, placement, relocation, exact target and full-ROM gates can accept resulting C.

## Verification and release

Task-local command: node build/combat-compositing-wave7-second-look-r1/check.js. Result: PASS. It checks the current record bindings, object section size/hash/frame, older statistics and original 438 ROM words. Original source also matches the accepted baseline blob after newline normalization. Normalized canonical ROM SHA-256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A; normalization was in memory only.

Evidence: build/combat-compositing-wave7-second-look-r1/evidence.json, SHA-256 0D28DA29D384696F1A97E4FB798321D48990284F18617ECBCD8C2CA63F99C02B. It records nineteen input identities and bounded source, assembly, original-word and pass excerpts. The compiler identity reported by current evidence is F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6. No compiler was invoked or reauthenticated.

One PowerShell brace-list read failed before inspection. Explicit paths resolved it. The offline ELF parser initially selected empty .text; section inventory identified the actual .ob64.r3844 owner, then its recorded hash passed. These were task-local inspection errors, not candidate failures. Broad text output was narrowed after truncation.

Only the fresh claim, this report and ignored check.js/evidence.json were written. No input directory, source, configuration, tool, runtime or Git state was modified. Existing W7 and disjoint review writes were preserved. No canonical-document change is proposed. All assigned writes are released at terminal handoff.

