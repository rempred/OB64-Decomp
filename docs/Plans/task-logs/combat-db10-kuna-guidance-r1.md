# DB10 Kuna guidance R1

Completed. Default Kuna supplies a useful second rendering, but no new supported source discriminator for DB10's remaining frame or initialization-order differences. The Director and production owner can retain this packet without another source trial based on these outputs alone.

Worker `/root/combat_draw_continuation`, Astra Medium; Director `/root`; launch `COMBAT-DB10-KUNA-GUIDANCE-20260908-01`; release `00380ed5d2485c9621377b11def7699e04fbaa97`.
The fresh claim was created atomically and read back before other writes. Its host/time fields were omitted. The Director authorized preserving the immutable claim and recording the omission here. Host is `local`; activation date is 2026-09-08. No more precise activation timestamp was captured.

All evidence paths below are relative to ignored `build/combat-db10-kuna-guidance-r1/` (R). Existing reports, Kuna installation and production inputs remain read-only.

## Authenticated analysis input

| Reference | Value | Meaning |
|---|---|---|
| Accepted owner | row3922, `.ob64.r3922`, overlay10 | Unique executable owner; symbol offset zero |
| ROM interval | 0020DB10–0020F0BC | 5,548 normalized retail bytes |
| Runtime interval | 801CA680–801CBC2C | Accepted loaded addresses, not stale original-assembly comment addresses |
| Retail SHA256 | A47D14C3227F9FAD494097A03496A8759DE3C1A19E00324012CD541C53732EB7 | Exact slice supplied to both analyses |
| Current source SHA256 | 5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3 | Read-only guarded source, copied as `current.c` |
| R3 terminal input index | F42C3D2C13B5CD1ED6F75C9BEDF0110A043589FC94D790BAA2FFA87931613E30 | Authenticated current source binding |

The normalized full-ROM hash equals `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Every original assembly word equals the slice. Original assembly hash is `4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE`.

`prepare.js` first encountered the existing workbench rejection of active compilation-group records without standalone source fields. No shared code or configuration changed. It then used `loadAcceptedModel` directly, asserted unique accepted ownership, and read the accepted slice. `target.json` preserves the complete row. This is analysis preparation, not a changed matching model.

`inputs/DB10.elf` follows the accepted ELF32 big-endian analysis method. It supplies one exact load interval, MIPS III/O32 flags, accepted entry/extent and a neutral function symbol. No prototype, expected edge, source array or compiler dump was supplied to Kuna. No additional data table was mapped.

`validation.json` confirms independent pyelftools load/symbol/extent readback. Kuna disassembly covers all 1,387 words, without truncation, with exact bytes and addresses. `selected-retail.json` retains the complete consequential sort/run region. No invalid word was reported.

## Commands and costs

Default Kuna succeeded in 0.560447 seconds. Complete disassembly took 0.051981 seconds. Raw m2c succeeded in 0.720562 seconds. These are subprocess timings, excluding preparation and inspection. Each command had a 60-second limit; none timed out.

The existing Kuna executable SHA256 is `C14FCE2F93FDF56B8C9B4B3E1742C2319937D65A1C192D02F1A95699778179EA`. All shipped specs were rehashed against the accepted trial manifest before execution. `tool-pins.json` records those identities. Automatic target selection remains the accepted default MIPS32 big-endian interpretation; no alternate transformation or explicit MIPS64 run was justified.

m2c remains at commit `3478473441a1e6da75d6bf07629452f410390ef4`, with only the known untracked `_levelUp_test.s`. Entry script SHA256 is `B99BC4CBAD2AA8C89CCDF67B874256E0A36CE7B31B7AC26E488BB27EE446AB63`. The command uses `--target mips-gcc-c --function func_0020DB10 --globals used`, without context or prototypes.

The existing assembly emitter supplied accepted direct-target names and five analysis guard nops. `m2c-input.s` preserves that output; `m2c-raw.s` omits the five guards for this raw comparison. This omission is recorded in `input.json`; it does not change retail bytes or production assembly. Both tools' commands, stdout and stderr are retained.

The first independent ELF check failed because the m2c Python environment lacks pyelftools. The existing isolated angr environment then performed the check with `-B`; no installation, angr execution or prior-root write occurred. These preparation limitations are recorded rather than repaired in shared tools.

## Consequential comparison

| Question | Kuna / raw m2c / current source | Consequence |
|---|---|---|
| Deduplication entry and four equalities | Kuna retains nonzero-count guard and source/variant/flag comparisons. Both drafts and current C express the same operations. | Rediscovery; no fourth comparison-only-home mechanism. |
| Insertion key and shifts | Kuna separates search position `v18`, unsigned key `v17`, and shift position `v14`; it retains six shifted streams. Current C already separates index/key/shift. | No new real lifetime or operation. Tool variable reuse elsewhere is not original C lifetime evidence. |
| Submission run | Kuna tests total count, with a run beginning at one; equal resource keys extend it. Raw m2c and current C also preserve this unusual total-count bound. | Do not replace it with count minus actorIndex. No new bound-state test is proposed. |
| Base setup versus actor clear | Kuna lines525–527 print `v41=v29`, `v42=v30`, then `v22=0`. Their mappings identify retail preheader operations. | Matches known retail order, already investigated by named-base controls. |
| Stack size | Kuna infers fragmented arrays and four accessed scalar locals. It does not explain the extra eight-byte retail allocation. | No array enlargement, new local or padding follows. |
| Return and callee types | Kuna prints void DB10; raw m2c prints an f64 return chain. Some Kuna calls omit arguments retained in registers. | Both are context-free hypotheses; neither changes project prototypes or proves callee effects. |

At owner offsets11DC–11F0, retail establishes source base `sp+18`, biased context base `sp+5C`, and biased resource base `sp+A4`, then clears outer actorIndex. Current C's compiled order clears actorIndex before those five setup instructions. The preheader's operation multiset is already known; Kuna does not reveal a missing operation.

`selected-kuna-lines.json` joins output lines with instruction addresses. The printed base assignments map to stores at runtime801CB860/801CB868; the actor clear maps to801CB870. Full retail instructions establish the preceding address calculations independently of imperfect line mappings.

The earlier named-sort-bases control used source/context/variant aliases and failed. The later guarded source/context/resource control tested the relevant natural starts with the current guard unchanged. That control remains SHA256 `4EEBE52C7969122FA46B32A543DDCEE7BA0835DDEA2928AFB0213E03D2063738`, with5612 bytes/frame576/native260. It adds accessed storage and does not solve the complete order. Kuna's printed assignments do not provide a distinct reason to repeat it. Never encode biased machine bases as one-before-array C pointers.

## Array and lifetime limits

`stack-interpretation.json` records Kuna variables and offsets translated from incoming SP to allocated SP. It prints sources at18 as17 integers, followed by a four-byte fragment at5C. Contexts start60 as17 integers, followed by another fragment atA4. Resources startA8 as17 integers. The next inferred arrays startEC,134 and17C, with actual insertion/submission accesses using their plus-four addresses.

These fragments describe address-use boundaries in this output. They are not evidence that the real arrays have17 or20 elements. In particular, inferred `v31[20]` at17C extends to1CC, merging beyond the current final array's declared span. No new referenced object or missing unused home is established by that declaration.

The predicate-origin report and93-input survey remain the allocation evidence. The three known comparison-only homes and remaining emitted key/bound predicates receive no new origin from Kuna. Default output cannot recover a vanished compiler pseudo or identify the retail compiler's allocation decision.

No supported new source trial follows from this bounded comparison. Remaining questions are still the genuine source history behind the extra frame position and the preheader base/clear ordering. This result does not establish that all source forms are exhausted or that pure C is impossible.

## Release

The accepted trial/review, frozen predicate-origin report, R3 terminal report and retained base controls were reused. Joe's standing Kuna/m2c packet requirement was read. This task creates one isolated packet; it implements no shared adapter or build dependency.

No source/header/configuration, KMC compiler, shared tooling, runtime, Resolver, Git staging or commit changed. No production compile, linked diff or verifier ran. Current DB10 bytes remain unchanged. All14 W8 targets and their one final complete-wave verifier remain required.

The Director and sole production owner received the findings. This report and scoped evidence are complete; all DB10 Kuna guidance writes are released. All previous reports remain frozen.
