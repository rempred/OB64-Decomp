# 3C00: provisional exact hybrid with two explicit instructions

Commit `2c5e43a1` preserves the final R12 source and its actual relocation record on `main`. Joe explicitly allowed minimal HYBRID_C exact completion for the three unresolved W8 targets. This is a canonical focused result; the complete fourteen-target wave and its full-ROM verifier remain required. It does not contribute to matching-C counts.

## Final source and proof

The authored source SHA-256 is `627B8E1DDD076AB292711B230E99C877496190066D79267578F59A9843471D69`; its compiler-input SHA-256 is `17C196C2D870931979FF9EE3960AF23BFDFA5DC5DFF80DDB5159B798C312D4A5`. Source policy mechanically reports HYBRID_C. The current implementation is [func_001F3C00.c](../../../src/lib/func_001F3C00.c); retrieve the preserved exact version and related inputs with `node tools/match.js intake func_001F3C00 --limit 50 --json`.

The final focused report confirms the original 6740-byte extent, 504-byte frame, one contribution from `objects/c/func_001F3C00.o` to `.ob64.r3698`, no assembly fallback or fill, exact placement, all 302 actual linked relocation words, a matching relocation contract, and exact target bytes. Linked and expected target SHA-256 are both `458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A`. The compiler assembly is not rewritten.

The first focused check exposed the older D037 relocation offsets. Only this target's `expectedRelocations` list changed: 302 entries before and after, with 48 old offset records replaced by 48 actual records and an unchanged type/symbol inventory. Every other linkage property and target remained unchanged. The refreshed check passed after this correction and a comment clarification. It took about 107.84 seconds, with one target compilation and 601 sibling cache hits.

## Practical minimization

The first private exact input had 22 fixed-register bindings, 19 empty templates and 13 nonempty templates. Sequential controls removed 12 bindings, replaced 11 instruction templates with C expressions and empty constraints, and removed 14 empty constraints plus the initial optional-tail barrier. Each retained reduction preserved exact bytes and pinned/tracer agreement. The final source has 10 bindings, 15 empty templates and two nonempty templates, each emitting one real operation:

- The companion-address ADDU uses an earlyclobber destination to keep the stride product out of the bound companion register.
- The packed-width SLL preserves the final shift's emitted shape; the tested ordinary-C replacement changed the extent.

Remaining constraints operate on real values and packet boundaries. They preserve selected register lifetimes, expression grouping, exact masks, already-performed stores and observed reads. Comments explain their purposes beside the source. This is bounded, context-dependent minimization, not a proof that no smaller hybrid can ever be found.

Several corrections are ordinary C: consume `currentState` in each DE packet after assigning it, split a later row calculation and mask across their existing calls, and capture/reuse command cursors at the observed retail read positions. The two early mismatches formerly called "tag-store" differences were DE command pointer fields, not opcode literals.

## Remaining pure-C question

The preserved [D037 reference](../../dossiers/func_001F3C00-519474319f.md) remains available for later conversion. The earlier pure-C work did not recover the complete source history behind the packet allocation/order and retained zero-format reload. In particular, first CSE reused the division result and removed that read in the tested source, while a retained nonzero-path control kept a sign-adjustment temporary until later cleanup. Replacing the named raw cache did not prevent reuse of an unnamed temporary. Those observations do not establish original compiler history or pure-C impossibility.

The final hybrid explicitly retains the real `tileBytes` input at the observed normalization boundary. It lets the compiler resolve the existing home and makes no claim that the original programmer wrote that constraint. The [controlled read-preservation pair](combat-3c00-retail-read-r12.md) and [opcode/tail pair](combat-3c00-hybrid-opcode-pair-r12.md) preserve useful intermediate contexts. Their active-source descriptions record their historical stages; the source selected at this record's commit is the final hybrid above.

## Retained evidence

Final source, policy, focused report and command output are under ignored `build/combat-draw-wave8-r12/3c00/hybrid-final-contract/`. The focused report SHA-256 is `B89EB451F5D418D8FA6BB7480CE8845657609161F620D7AF93A4153B97448560`; policy SHA-256 is `3490D29D06507B069FD439134317F85B43EAB05C5AEDA4F74C25657A31F6DD34`. The preceding readable input differs only in a comment and has identical expanded input, dependencies and preprocessor identity; its authenticated trace is under `3c00-traces/hybrid-readable/` with analysis SHA-256 `63DF1454909B8C825B6B8EBC395D693B7E8DD284A544A56E0F21C199559F69EA`. Named `min-binding-*`, `min-operation-*` and `min-empty-*` inputs retain the bounded controls. Bulk compiler and ROM artifacts remain untracked.
