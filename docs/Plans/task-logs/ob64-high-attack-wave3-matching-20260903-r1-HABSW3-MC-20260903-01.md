# High Attack Battle Stream Wave 3 Matching-C Report

Status: **completed with one structural/tooling follow-up**

Wave 3 promoted two of its three accepted owners: `func_00201108` is exact
`PURE_C`, and `func_001FFE80` is exact `HYBRID_C` with an eight-byte bounded
inline-assembly fallback. `func_002013D0` has an exact 84-byte `PURE_C`
executable body, but its accepted 96-byte owner includes 12 trailing alignment
bytes that the ordinary C target workflow does not retain. That owner remains
assembly pending a separate structural/tooling decision.

## Assignment

| Item | Value |
|---|---|
| Role | Matching-C worker |
| Worktree | `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-3` |
| Branch | `codex/high-attack-wave-3` |
| Required starting HEAD | `e30440e2b01918641260b924fa7caa82a4b37e54` |
| Observed starting HEAD | `e30440e2b01918641260b924fa7caa82a4b37e54` |
| Starting status | clean |
| Structural scope | accepted Wave 3 boundaries and owners unchanged |

The initial branch, HEAD, and cleanliness gate passed before edits. Only the
prepared worktree was written. No branch, worktree, or remote operation was
performed.

## Family model

The supported static call chain remains:

```text
func_001FFE80 -> func_002013D0 -> func_00201108
```

`func_001FFE80` maintains two bounded record collections, updates two countdown
bytes in the shared context, resets a small group of halfword/byte state when
the second countdown expires, and then calls `func_002013D0`.

`func_002013D0` calls `func_00201108`, then invokes `func_00209774` for the two
context records at offsets `0x82F` and `0x848` using selectors zero and one.

`func_00201108` copies two 25-byte source records into those context offsets.
For each of the first five byte-shifted entries in each record, it searches at
most 20 actors, clears an unmatched/invalid entry ID, or calculates the signed
byte field at entry offset seven from actor fields. The two passes use distinct
actor predicates and arithmetic, matching the retail control flow.

These descriptions are static structural/semantic aids. No canonical symbol
rename is part of this work.

## Matching results

| Function | Accepted range | Accepted bytes | Relocations | Target SHA-256 | Result | Commit/evidence |
|---|---|---:|---:|---|---|---|
| `func_001FFE80` | `0x001FFE80..0x0020019C` | 796 | 54 | `F980232EFC52C2B199FE98013C63495EC8DF87303E18353FC34FB3E47F9C7402` | exact `HYBRID_C` | `430061ecb263a249c69a98f338e9de5c19d0829b` |
| `func_00201108` | `0x00201108..0x002013D0` | 712 | 22 | `169467C77946852999653F4F85C4CFD19FD2F9D29A5868B6839C33493CB8213A` | exact `PURE_C` | `e8c4d05896d9e34054021d04a9191e7e14d6d536` |
| `func_002013D0` | `0x002013D0..0x00201430` | 96 | 11 in candidate body | not applicable to a full accepted C owner | 84-byte executable prefix exact `PURE_C`; 12-byte owner-padding blocker | candidate `2EE9E463F38B39E3A9FA779A4F0D0293E76B09081C70008F784940AE1F74DB2C`; evidence commit `1385a212c25ab541d59d261c6b7e2499fdc7823d` |

The two promoted C objects are the sole linked owners of their complete accepted
target sections. Their decoded instructions and raw linked bytes match the
baserom, their relocation contracts match, and the complete rebuilt ROM is
byte-identical to the canonical Rev 0 baserom.

The promoted total is 1,508 accepted bytes: 712 `PURE_C` bytes and 796
`HYBRID_C` bytes. The remaining 96-byte wrapper owner is still assembly.

## Reconstruction evidence

The initializer reconstruction used explicit 25-byte source records, the two
context destinations, the retail five-entry bytewise scans, and actor-loop
bounds derived from the accepted owner. Volatile working-record access and
explicit 32-bit pointer comparisons preserved the retail instruction order.

The outer reconstruction reached a 792-byte pure-C candidate after typed-record,
control-flow, lifetime, volatility, pointer-expression, and call-scheduling
trials. That candidate and its blocker rationale are preserved at:

- `docs/archive/matching-c-candidates/2026-09-03-func_001FFE80-2d73908d61.c`
- `docs/dossiers/func_001FFE80-2d73908d61.md`

The final exact outer source uses one zero-instruction extended-assembly
constraint to retain the retail call-argument register reuse and one two-move
assembly template. A direct field expression for the later call argument
produced the retail `addu $a1,$v1,$a1` delay-slot word and removed the final
non-relocation mismatch. Scratch candidate
`AC607774E3182E6887921067083602C8E8F679BBEF903F408863BF350FE65D1C`
matched all bytes after relocation masks; the canonical linked diff then proved
the symbol/addend identities and exact final bytes.

## Wrapper blocker

The wrapper candidate emits the complete 21-instruction, 84-byte executable
body in pure C. Its three expected-only words are the accepted owner's trailing
12 zero bytes at `0x00201424..0x00201430`. Activating the 84-byte object against
the unchanged 96-byte row failed closed with:

```text
KMC target object section shape drift: func_002013D0 .ob64.r3758
```

Changing the accepted boundary, row ownership, linker layout, or padding policy
would be structural work and was outside this assignment. No such change was
made. The strongest reproducible evidence is preserved at:

- `docs/archive/matching-c-candidates/2026-09-03-func_002013D0-2ee9e463f3.c`
- `docs/dossiers/func_002013D0-2ee9e463f3.md`

The original assembly remains the sole accepted owner of the full 96-byte row.

## Verification

Focused acceptance commands passed for both promoted targets:

```text
node tools/diff.js func_00201108
node tools/verify.js --target func_00201108 --require-pure
node tools/diff.js func_001FFE80
node tools/source_policy.js --target func_001FFE80
node tools/verify.js --target func_001FFE80
```

The final focused results were:

```text
func_00201108 ........ EXACT
Source class ............... PURE_C
Raw linked bytes ........... EXACT
Relocation contract ........ MATCH

func_001FFE80 ........ EXACT
Source class ............... HYBRID_C
Raw linked bytes ........... EXACT
Relocation contract ........ MATCH
```

The single wave-end complete verifier passed on the final tracked tree:

```text
node tools/verify.js

Baserom identity ........... PASS
Toolchain .................. PASS
Source policy .............. PASS
C linker ownership ......... PASS
Target placement ........... PASS
Relocations ................ PASS
Target bytes ............... EXACT
Full ROM ................... EXACT

PURE_C exact ............... 458 functions / 31820 bytes
HYBRID_C exact ............. 62 functions / 33724 bytes

RESULT: EXACT BASELINE
```

Final generated status after verification was:

```text
Retail ROM ................... EXACT
Exact PURE_C ................. 458 functions / 31820 bytes
Exact HYBRID_C ............... 62 functions / 33724 bytes
Assembly owners remaining .... 5664 / 6445040 bytes
Other/data owners ............ 1058 / 35432596 bytes
UNKNOWN classifications ...... 0
```

## Hybrid extent

The active `func_001FFE80` translation unit is truthfully `HYBRID_C`. Its inline
assembly emits exactly two `move` instructions, eight bytes total. The other
extended-assembly statement emits zero instructions but still makes the source
hybrid under policy. The remaining 788 target bytes are compiler output from C.

`func_00201108` contains no assembler mechanism. `func_002013D0` was not
converted to hybrid and remains assembly-owned.

## Director handoff

The Director should review the two exact promotions, the preserved wrapper
blocker, this report, and the final clean worktree inventory. Integration should
retain the accepted Wave 3 structural owner for `func_002013D0` unless a
separate structural task proves a safe padding/ownership treatment.
