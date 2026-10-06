# Command stream dispatcher — complete accepted wave

BlueOsprey completed the assigned physical owner and all three required compiler table occurrences on `main`.
ONE normal `node tools/verify.js --profile` exited0 at `2026-10-06T19:41:27.699Z` (15:41 EDT),
including independent fresh compilation and a byte-identical complete canonical US Rev0 ROM.
The result establishes matching PURE_C under the existing structural and auxiliary contracts.
It does not establish stronger command, field or runtime meanings.

## Complete membership and source

| Contribution | Accepted interval | Complete coverage |
| --- | --- | --- |
| `boot_command_stream_dispatch`, row84 | ROM `978C..9A18`; RAM `8007938C..80079618` | 652 bytes: public28-byte varargs prefix plus624-byte framed fallthrough |
| Compiler occurrence `.L36` | ROM `3E3A8..3E3E0`; RAM `800ADFA8..800ADFE0` | 14 entries /56 bytes; native offset0 |
| Compiler occurrence `.L32` | ROM `3E3E0..3E408`; RAM `800ADFE0..800AE008` | 10 entries /40 bytes; native offset56 |
| Compiler occurrence `.L46` | ROM `3E408..3E438`; RAM `800AE008..800AE038` | 12 entries /48 bytes; native offset96 |

[Canonical source](../../../src/boot/boot_command_stream_dispatch.c) uses the accepted compiler's GNU legacy
ellipsis/next-argument idiom, aligned32-bit argument traversal and independently derived structured switches.
Native text contains one GLOBAL652-byte function with frame56. The framed fallthrough at97A8 is not selected
as another logical function. Existing fixed-address bindings preserve original `func_0000978C` and
`func_000097A8` labels; the final map records `8007938C` and `800793A8` respectively.
Original assembly remains reference/fallback. No caller source was rewritten.

The final normal verification and fresh-compilation records both classify the complete producer PURE_C.
Compiler assembly is authenticated and unchanged apart from the established section assignment.
Text has44 actual load-relevant relocations and zero differing linked bytes. Its sole map contribution is
`objects/c/boot_command_stream_dispatch.o`,652 bytes, with no fill or original-ASM fallback contribution.
The144-byte,8-aligned readonly section has36 actual `R_MIPS_32` relocations and no compiler padding.
All destinations lie inside this owner. Every occurrence and the complete linked fragment are exact,
with sole ownership by the same C object.

## Complete row789 conservation

| Contribution | ROM interval | Bytes | Linked ownership |
| --- | --- | ---: | --- |
| Original prefix | `3DDC0..3E3A8` | 1512 | Retained original ASM |
| THREE command tables | `3E3A8..3E438` | 144 | Command dispatcher C object |
| Original interior | `3E438..3E528` | 240 | Retained original ASM |
| Protected decoder table85 | `3E528..3E67C` | 340 | Accepted decoder C object |
| Protected original interior | `3E67C..3E6E8` | 108 | Retained original ASM |
| Protected op table9 | `3E6E8..3E70C` | 36 | Accepted op C object |
| Protected original tail | `3E70C..3F1B0` | 2724 | Retained original ASM |

These contributions preserve all5104 bytes without gaps, overlaps or duplicate ownership.
The decoder's former exterior prefix becomes the explicit240-byte interior before its unchanged table.
Its native344→340 and the op producer's40→36 source-terminal-alignment contracts are unchanged.
The final verifier confirms both complete protected owners (2216/248 bytes), their source classes,
actual relocations, linked bytes,85/9-entry tables and retained original contributions.
All other target contracts, prior bindings and target source entries remain unchanged.

## Reusable source evidence

Current target intake initially had no same-target history. The default analysis packet preserves complete
652-byte Kuna readback with unresolved switches and a visible default m2c jump-table failure; neither supplied
complete switch reconstruction. The manual source instead follows the full original ASM and all36 ROM words.

- [First-argument local control](../../dossiers/boot_command_stream_dispatch-3b698b0d4a.md): an early opcode-local
  copy preserves the first word in s2, moves the root load behind frame setup and emits a656-byte nonmatch.
- [Direct-first-word best](../../dossiers/boot_command_stream_dispatch-f396a978e7.md): passing the original word
  directly to the initial lookup restores the retail28-byte prefix,652-byte extent and all nonrelocation bits.
  The source comment records this measured workaround. The complete three table occurrences also agree.

Private results were honestly symbolic-object diagnostics for an inactive ASM owner; no private linked or
matching acceptance was claimed. Complete readiness1482 and actual native/store drains1484/1485 preceded
Director integration release1486. Two ordinary configuration rejections were corrected before the passing
focused diff: active auxiliary fragments must follow linker order, and relocation records use the existing
canonical JSON field order. No compiler, source-policy, boundary, tooling or verification rule changed.

## Exact proof

- Final input fingerprint: `0B9FFC3A7319D380EEFA0F930DE7CB04174262E41BBAD7849B95A2D43FA04908`.
- Unchanged baseline: `F1D9FEF423CFE385A84F9CFA92C47CA46A45A2AC48E39332C3305ACE9B2409C6`.
- Source SHA256: `8838C6E48CDD691831B8B226CDBA3B863809CB16B5D0D5A6043167F2F1BE581D`.
- Verification report SHA256: `4B900E42FBAA5145B22A89EC6F388126C0B91ECDD5E2B0BC8FEC29370A387082`.
- Fresh-compilation SHA256: `6294F162195AB19A8C4EF4915F14C4A5C6E70CD13E53FA42463955144DEFF938`.
- ROM:41943040 bytes, SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Final verification: `build/current/verification.json`; fresh compilation: `build/current/fresh-compilation.json`.
- Profile: `build/verification-profile/verify-20261006191829349-14312.json`; total1378.419 seconds.
- Focused linked diff: `build/diff/boot_command_stream_dispatch.json`, EXACT/PURE_C/MATCH,64.814 seconds.

Recoverable exact report copies, selected target/table evidence, publication receipts, private source pair,
native census and final log remain under ignored `build/matching/sol-command-20261006/`.
The final output is `C:/Users/Joe/.codex/ob64-decomp-current/current/0b9ffc3a7319d380eefa0f93/build`.
Generated status remains authoritative for changing counts. No preliminary build, separate audit/reviewer
gate, per-function full-ROM verification or unchanged acceptance repeat was run.

The required post-verification `node tools/status.js` attempt failed in
`tools/lib/status_accounting.js:204..213`: it unconditionally equates authenticated native terminal padding
with a retained original tail, omitting the already accepted `discardedTerminalAlignment:true` mode.
The protected decoder selects340 bytes from native344 with four discarded zeros and no exterior tail;
the op producer selects36 from native40 while retaining a2724-byte original tail. Canonical and fresh
verification preserve these distinct contributions correctly. Status accounting is separately routed to
GoldOx/SilentCrane in1487; source workers do not change tooling or fabricate tail evidence to satisfy it.
No manual status counts are published here. All owned native/store/publication/status commands have exited.

## Continuation

Director1488 independently inspected the actual final state, verification/fresh reports and their hashes,
confirmed complete-wave normal acceptance, and released Shop's native hold. The separate status-accounting
repair and its review belong to the Director; they do not reopen this source wave's completed matching gates.
All work in this assigned source/table wave is complete. The scoped local closing commit releases production
ownership; the worker retires only its verified own watcher after that commit and reports actual retirement.
No push, new source/config change, unchanged verifier repeat or new wave is authorized.
Shop14 remains independently owned by PeachTrout. All parked Combat17, Squad scheduler5/NINE and pursuit21,
lifecycle10/movement, broader Scenario/animation, later codecs and validator1A34/1A3C obligations remain
through the [queue](../../NEXT_STEPS.md), [program](../sequential-main-program.md) and
[family scope](../sequential-family-scope.md). This wave does not close the resource family or full program.
