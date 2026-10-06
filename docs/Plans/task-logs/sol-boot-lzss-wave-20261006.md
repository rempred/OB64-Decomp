# Boot LZSS complete-owner wave

GreenGoose, Sol 6.1 Extra High, chat `01a112cb-b305-7a51-8b15-ce0144979169`;
Director SilentCrane. This record covers the complete assigned physical owner,
not four separate acceptance waves.

## Preserved membership

| Compiler function | ROM interval | Bytes | Binding |
|---|---|---:|---|
| `boot_lzss_decompress` | A510..ABE0 | 1744 | GLOBAL |
| `func_0000ABE0` | ABE0..AC0C | 44 | LOCAL |
| `func_0000AC0C` | AC0C..AF30 | 804 | LOCAL |
| `func_0000AF30` | AF30..AF7C | 76 | LOCAL |

The owner remains ROM A510..AF7C / RAM 8007A110..8007AB7C, 2668 bytes,
section `.ob64.r0099`. Canonical source is
[boot_lzss_decompress.c](../../../src/boot/boot_lzss_decompress.c).
The original ASM remains tracked as reference/fallback. Existing primary and
header-reader aliases, caller bindings, boundaries, compiler identity and linker
rules are unchanged. AC0C/AF30 remain local supplementary compiler bodies; no
new export or runtime-use claim follows from their bytes.

Coverage was reconciled with current intake, full disassembly, the
[reviewed census](../../audit/2026-09-23-boot-decode-body-census.md) and
[decompression trial](../../audit/2026-09-23-boot-decompression-trial.md).
The analysis packet's generators covered only the 1744-byte primary; full-owner
disassembly readback passed. That limitation never narrowed the assignment.

## Useful source evidence

A510's explicit working cursors avoid the pinned inliner's parameter-to-local
lifetimes. Short, literal, medium and long reference cases retain different
cursor-binding orders. Decoded lengths remain separate from working counts;
the medium case uses local input bytes and forms the reference before length.
Literal position advances before its input pointer. Consistent fill blocks
recover the retail shared zero halfword tails.

The [unsigned leading-store control](../../dossiers/boot_lzss_decompress-ca71f8b001.md)
and [signed-store effect](../../dossiers/boot_lzss_decompress-eb80037d0d.md)
isolate the final A510 discriminator: signed byte/halfword stores assigned `-1`
retain the full sentinel instead of separate FF/FFFF constants and restore the
retail tail jump. Unsigned `-1` alone emitted the same object as FF/FFFF.

The [AC0C baseline](../../dossiers/boot_lzss_decompress-de9f9f4972.md) and
[local-lifetime effect](../../dossiers/boot_lzss_decompress-289c12cb5a.md)
retain the same primary/readers. A branch-local promoted word, shifts through
the existing length variable, a separate promoted decoded count and byte
working counter, and a local offset remove the final 16 nonrelocated differences.
Astra's bounded read-only advice in mail 1507 informed the promoted-word
discriminator; this was not Claude guidance or tooling approval.

The paired research sources were normalized to LF and a single final newline
under new candidate identities. All four successor native objects are byte-identical
to their original private objects (archive-equivalence.json in the private root).
Original private sources remain recoverable; no whitespace rule was weakened.

The [complete global-function research source](../../dossiers/boot_lzss_decompress-f78fd5b302.md)
is recoverable for workbench replay. It remains private diagnostic evidence in
that representation. Canonical acceptance uses the local secondary functions
and its own compiler, relocation, ownership, placement and full-ROM gates.
Generated compiler output, objects, ROMs and proof reports remain ignored under
`build/matching/sol-lzss-20261006/` and ordinary build output paths.

## Canonical gates

Complete readiness mail 1508 and actual drains 1508/1510 preceded Director
release 1511. Shop14 was unfinished and retains its separate complete membership.
This worker changed only the assigned source, its activation/linkage records and
bounded research/cursor documentation. No shared tooling or structural change.

The canonical focused diff exited zero with `PURE_C`, exact decoded instructions,
exact raw linked bytes, zero differing bytes and a matching actual relocation
contract. The 21 emitted relocations are internal `R_MIPS_26` records against
`.text`; every linked relocation word agrees with retail. The complete native
and linked function census matches the table above. Map evidence has one C
contribution of 2668 bytes, zero fill and zero fallback contributions.

Linked owner SHA-256:
`9C23004D8774812BA8332D64ECFA121B1EA2EFCCE387A132F91E246137CB8394`.
The report is `build/diff/boot_lzss_decompress.json`, with an ignored copy and
log in the worker's private root. Its profiled wall time was 116.987 seconds.

ONE final `node tools/verify.js --profile` exited zero, verified at
`2026-10-06T22:00:16.645Z`, with a profiled wall time of 1287.231 seconds.
Baserom/toolchain identity, mechanical source policy, sole C ownership,
placement, relocations, complete target bytes and full ROM passed. Independent
fresh source compilation passed for the same inputs; this whole owner is
`PURE_C`. No separate preceding build, per-body verifier, independent
matching-review gate or unchanged verification repeat was run.

CURRENT fingerprint:
`EB7955E6AD686954FA833D2D449AB95550BF0E3010E2E777DCED91FD6AFB3C89`.
The unchanged baseline fingerprint is
`F1D9FEF423CFE385A84F9CFA92C47CA46A45A2AC48E39332C3305ACE9B2409C6`.
The rebuilt 41,943,040-byte ROM has canonical SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Canonical source SHA-256:
`D1D6B032083C9E8944262053F209D585EF5199BB0354734901B396CE5AADAD2B`.

Actual final reports are `build/current/verification.json` and
`build/current/fresh-compilation.json`, SHA-256 respectively
`402964ACB929906B8411739E9A1F84326D473EACD4CC022BF9184CC8F5ED3E75`
and `97252F21FDE5B29E4422EC787A087D1E686E34200DC69F20D08BE3E48C2A36D0`.
Ignored copies, a bounded summary, final state and CLI log are under
`build/matching/sol-lzss-20261006/`. The timing sidecar is
`build/verification-profile/verify-20261006213849480-46556.json`.
The predecessor's accepted baseline was reused throughout candidate iteration.

Completion mail 1512 reports the final identities and actual exits of every
native/CPP/intake/research-store/publication job. Closing documentation and the
scoped local commit do not change accepted canonical inputs. Production
ownership and the worker's watcher remain subject to Director release.

The accepted LHa/resource/decoder/archive/command owners and parked Combat,
Squad, Shop, Scenario and animation obligations remain protected; see the
[program](../sequential-main-program.md) and
[family scope](../sequential-family-scope.md). No branch/worktree, push, emulator,
runtime capture or self-assigned next wave.
