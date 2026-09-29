# Sol five-family decomp resumption

Current checkout: `main` at `8012b84a` before this session's research records. Sol/BoldTower is the sole production source/build writer. The queued order is Combat/High Attack, scenario loading, squad lifecycle, shop inventory, then combat animation. This note records the current cursor; it does not narrow any family's membership.

## Current wave and accepted baseline

The active Combat shared-context wave retains all three original High Attack W3 members: `func_001FFE80`, `func_002013D0`, and `func_00201108`. The two siblings are accepted `PURE_C` and unchanged. `func_001FFE80` remains exact `HYBRID_C` in production, not matching C. Its active source is restored to SHA-256 `0ADD34F029663A846F12D2370B8C98A335E1B2F0B34241039EEC1A1B180765B6`. Its standalone executable owner is `.ob64.r3750`, z64 `[0x001FFE80,0x0020019C)`, VMA `0x801BC9F0`, 796 bytes. The current C producer and full original disassembly cover the primary loop, secondary loop, and trailer; no owner or boundary change is proposed.

`node tools/status.js` reported an exact current retail ROM and zero `UNKNOWN` classifications before source experiments. Production source was restored byte-for-byte afterward. No final verifier was run because the three-member wave is incomplete.

## PURE_C experiments

- [Plain current-source control](../../archive/matching-c-candidates/2026-09-29-func_001FFE80-9edc78cf1b.c) removes both assembler mechanisms while retaining the current call expression. Source policy reports `PURE_C`. A current-run canonical diff compiled it, then correctly rejected its 792-byte section against the 796-byte owner before linking. The preserved scratch object has 198 instructions and 54 relocations.
- [Late original-position use](../../archive/matching-c-candidates/2026-09-29-func_001FFE80-658423bc4b.c) remains 792 bytes, but its compiler output places the record-to-core `move $4,$18` in the flag branch delay slot. It still loads the original position directly into `a2` and defers the entry-to-`a3` copy until after the sum guard.
- [Entry-pointer condition](../../archive/matching-c-candidates/2026-09-29-func_001FFE80-591839a7be.c) compiles to the exact same object and compiler assembly as the late-position candidate. It supplies no independent early-copy effect.
- An ignored scratch control duplicating the same final call under an already-loaded pointer condition remains 792 bytes and nonexact. It did not change the assembled final `jal` delay-slot `nop`; no separate final-call experiment is selected from it.

The default Kuna and m2c [analysis packet](../../../build/sol-five-family/analysis-packets/) was produced from authenticated retail bytes. It supplied no new source-lifetime form beyond the existing C; Kuna omitted arguments at the helper call. Both outputs remain hypotheses.

**Correction to the earlier preserved observations:** their statement that the *current-source* plain and late-position trials have a separate final-call scheduling mismatch is wrong. That was true of an older archived candidate, not these new assembled objects. The current plain object's owner offsets `0x2EC/0x2F0/0x2F4` contain `jal`, `nop`, then the `ra` load. Retail has those same instructions at `0x2F0/0x2F4/0x2F8`. The entire tail is shifted four bytes by an earlier missing instruction. The old observations remain preserved; this note corrects their claim for future use.

## Next experiment and limits

GoldOx received a specific advisory packet and the tail correction in Agent Mail discussion `DECOMP-FIVE-FAMILIES-20260929`; no source ownership was transferred. The next experiment should test one evidence-backed C lifetime/control-flow form that makes the entry and original-position copies occur before the sum while retaining the now-established final `nop`. Keep the exact hybrid source as the production fallback and the archived source pair recoverable. Run a focused canonical linked diff when a candidate reaches the required owner extent, then one final normal verifier only after all three wave members are ready.

No tooling or structural defect has been established. Do not change accepted ownership, compiler contracts, linker rules, or verification gates. The other four families and later Combat waves remain assigned and unfinished.
