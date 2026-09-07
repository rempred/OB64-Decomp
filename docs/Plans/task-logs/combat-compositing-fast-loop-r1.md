Completed: the frozen fast-loop passes do not support a new readable representation with a predictable input-versus-inner-destination allocation benefit. The fast loop already has separate pointer induction variables. The competing destination belongs to the other branch. Director intake is next; the sole W7 writer retains matching experiments. No source hypothesis is proposed.

Assignment: `COMBAT-COMPOSITING-FAST-LOOP-20260907-01`, revision 1. Worker: `/root/compilation_groups_design`, Astra Medium. Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local. Starting HEAD: `676af2a531d267f91ce41281c0d8211de6a1673d`. The complete fresh claim was created atomically before other writes.

## Authenticated scope

The package is `build/combat-compositing-wave7-r1/rtl-207E30-named-branch-advance/`.

- Preprocessed `candidate.c`: SHA256 `4EE397F4A55054F73CAAE92C396A087D320C79B734393566F9DEC6BC6C018710`.
- Compiler assembly `candidate.s`: SHA256 `A7A682F1860A173E763C309D9B676E83C0D1AE7CC1DCACDBF9EC409CF9A6AF87`.
- Authored `func_00207E30.named-deltas-typed-source.c`: SHA256 `662FB1B83F0711BFB271AADEAF18B2662332DA21B16D51D22C914CA198270914`.
- Authored `func_00207E30.named-deltas-branch-advance.c`: SHA256 `AAEED6C8B340F9C281B82EEDA752A53793A0A197690C5C6FCB860BE2BF2EA9D9`.

The two authored files are distinct. Their fast-loop bodies equal the compiler input after removing comments and whitespace. This limited comparison excludes sourceRow advancement. It does not authenticate complete preprocessing or native equivalence between the authored files.

The retained dump script copies a mutable `func_00207E30.input.c` into the package before compiling. Its command record reports success and the pinned compiler path. It does not bind that historical mutable input to either authored snapshot. No current mutable input was read. Whole-unit native equivalence remains the source worker's report.

All thirteen pass files and the command record were hashed. Assembly directly confirms `.frame $sp,264,$31`. The package contains no object or linked relocation proof. Reported 1752 text bytes and 33 differing non-relocation words therefore remain reported observations, not independently reproduced results.

The original owner SHA256 remains `9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6`. No new ROM-byte claim or full-ROM check was made. The frozen global-allocation and priority reports also passed their recorded hash checks. The priority report remains unchanged at `3023eda`.

## Actual fast-loop pass account

The compiler input tests `inputMask->field_03 == 1`. Its indexed loop tests `x < input->width` and increments `x`. A nonzero mask byte triggers an alpha-byte store and destination halfword self-assignment.

Initial RTL reads the mask twice, at UIDs 441 and 452. The first CSE pass removes the second read. The alpha store at UID454 uses the first mask value, pseudo171. Naming that loaded byte would therefore duplicate an optimization already present; these passes provide no allocation benefit for such a spelling change.

The loop pass identifies the fast loop between notes 425 and 483. It converts the indexed addresses into these induction variables:

| Fast-loop value | Generated pseudo | Initial row pseudo | Increment | Retained memory operation |
|---|---:|---:|---:|---|
| Destination cursor | 454 | 88 | 2 bytes | Halfword read UID467, write UID469 |
| Alpha cursor | 455 | 89 | 1 byte | Byte write UID454 |
| Mask cursor | 456 | 87 | 1 byte | Byte read UID441 |

The identical numbers for instruction UID454 and pseudo454 denote different entities. The loop report explicitly reduces the destination address to pseudo454. The scalar pixel index remains pseudo100; the report says it cannot eliminate that basic induction variable.

Post-local-allocation RTL retains the entry width load at UID1030 and backedge width load at UID429. Both load an unsigned halfword from input pseudo84 plus four. UID431 compares the incremented index with the loaded width; UID432 supplies the backedge branch. The destination self-load/store also survives, after the conditional alpha store.

The final fast-loop assembly retains those operations and a branch-likely mask test. Retail original words show the same operation sequence. The retail entry and backedge width loads are at z64 ROM offsets `0x00208108` and `0x00208140`. Retail uses input register 18; this package uses register 17. The retail body has the conditional alpha store, destination halfword read/write, index increment, comparison, and backedge at `0x00208120` through `0x00208150`.

The final compiler cursor registers are destination 3, alpha 5, and mask 4. Their initial row registers differ from retail. This does not turn them into the packed-loop destination pseudo451.

## Allocation distinction

The requested input record is authenticated: `lreg` reports pseudo84 with 33 references across 215 instructions and three calls. The other requested record is also authenticated: pseudo451 has 27 references across 142 instructions. The loop report places pseudo451 in the packed branch's address reductions, not the fast loop. This report does not analyze or change that branch's solved expressions.

| Value | flow references / length | lreg references / length | Priority from frozen rule |
|---|---|---|---:|
| Input, pseudo84 | 33 / 256 | 33 / 215 | 7674 |
| Packed destination, pseudo451 | 27 / 163 | 27 / 142 | 7605 |
| Fast destination, pseudo454 | 19 / 18 | 19 / 15 | 50666 |
| Fast alpha, pseudo455 | 15 / 17 | 15 / 14 | 32142 |
| Fast mask, pseudo456 | 15 / 16 | 15 / 13 | 34615 |

The `greg` header lists unshared, size-one entries. Its relative order is input84 before packed destination451, matching the reconstructed priority calculation. Fast destination454 is much earlier in that list. Reference weights are compiler bookkeeping; they are not additional source memory accesses. The priority rule alone does not determine all final hard registers.

## Precise evidence gap

Only one fast-loop source representation is authenticated here. Both named authored files contain the same fast-loop body. There is no retained alternate fast-loop pass package showing a changed input lifetime while preserving its memory and control-flow operations.

Explicit pointer cursors have no evidenced benefit because loop optimization already creates them. Caching width outside the loop would remove the required backedge width load. A narrower scope or renamed temporary has no demonstrated distinct pass effect here. Neither the input's aggregate lifetime nor packed destination451's lifetime can be attributed solely to this fast loop from the retained statistics.

Thus the missing evidence is a causal pass difference, not a missing priority formula. A meaningful future hypothesis would need a natural fast-loop representation with a distinct lifetime consequence and preserved width reads, stores, and branches. No such hypothesis is supported by this package. No artificial references, source spelling sweep, or speculative source recipe is recommended.

## Delivery

Offline parser `build/combat-compositing-fast-loop-r1/inspect.js` passed. It authenticated 23 input files and retained stage excerpts, source comparisons, assembly, original words, and allocation arithmetic. Evidence: `build/combat-compositing-fast-loop-r1/evidence.json`, SHA256 `DFABFEAE5C25FE136F364B78395285DA5BD66838689B379044D28EDFFB003FA1`.

The first parser check exposed the authored explanatory comment; the corrected comparison explicitly removes comments as well as whitespace. No source input was changed. Only this report, the fresh claim, and the assigned ignored evidence root were written.

No candidate, compiler, build, verifier, runtime, database, production source/configuration, or Git mutation occurred. SourceRow, counter, branch-end copies, and solved packed expansions remain with the sole writer. All writes are released at handoff. All seven W7 members retain their original complete-wave gates. This assistance adds no independent matching review or broader compiler research acceptance.
