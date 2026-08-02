# Wave 6 matching-C evidence index

## Status and result

Status: completed and review-pending. `func_0026B820` now builds with exact
linked bytes in two fresh external roots. This matters because the new owner
preserves the canonical ROM and the six earlier C owners. No action is required
from Joe; the Director must route the package for fresh Critical review.

## Mission identity

| Item | Result |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave6-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical starting branch and HEAD | `main`, `3b8b950d654848d5178c3f8bcdbbc00ca493accf` |
| Parent starting HEAD | `a77c56c125d284ad71b8511b5642da1ae649725a`; read-only |
| Integration baseline | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Setup report | `build/setup/verify-setup-report.json`; `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Matching-C configuration | `config/phase8/matching-c.json`; `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C` |

The prompt parent baseline was
`e595013a15663a114b1d8692badea3738652b3bf`. The observed parent HEAD differed.
The parent remained read-only, so the mismatch did not affect this result.

## Selected owner

The selection record is [target-selection.md](target-selection.md).

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0026B820` | Selector-indexed resource and state dispatcher | `0x0026B820..0x0026BCCC` | z64 ROM range, end exclusive | Selected owner |
| `func_0026B820` | Same dispatcher placement | `0x80216C70..0x8021711C` | overlay link virtual range, end exclusive | Linked section `.ob64.r4836` |
| `func_0026B7E4` | Boundary predecessor | `0x0026B7E4..0x0026B820` | z64 ROM range | 60-byte predecessor |
| `func_0026BCCC` | Boundary successor | `0x0026BCCC..` | z64 ROM range | Immediate successor |
| `g_func_0026B820_dispatch_table` | Seven-entry dispatch table | `0x80220C40` | overlay runtime virtual address | Indirect jump table |

The owner is 1,196 bytes. Its accepted row is `4836`, section `.ob64.r4836`,
chunk `038`, primary ID `primary:3c25abac34d57e6d87f8`, and descriptor `12`.

## Independent C derivation

The source is `src/overlays/descriptor_12/func_0026B820.c`. Its SHA-256 is
`12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900`.
The original assembly SHA-256 is
`C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D`.

The complete derivation is in
[independent-derivation.md](independent-derivation.md).

| Assembly evidence | C behavior or constant | Source result |
|---|---|---|
| Entry offsets `0x018..0x050` | Mask selector and dispatch through seven entries | `selector_arg & 0xFFFF`; computed `goto` |
| Case offsets `0x058..0x0F4` | Walk records, free arrays, or return a record value | Selectors one, two, and six |
| Selector-zero offsets `0x0F8..0x1B8` | Load count, allocate arrays, initialize records, and call helpers | Three allocator calls and one bounded initialization loop |
| Selector-five offsets `0x1C0..0x240` | Check flags, call helper, set high flag, clear state flag | Structural flag transition |
| Selector-three offsets `0x244..0x410` | Run four record loops with fixed helper arguments | Four bounded propagation loops |
| Selector-four offsets `0x410..0x478` | Test flag and record halfword before helper call | Structural record check |
| Relocation table | Resolve overlay globals and direct calls | 29 `.rel.text` entries and one `.rel.pdr` entry |

No external-derived implementation supplied C expressions or control flow.

## Compiler and target contract

The accepted compiler is KMC GCC 2.7.2. Its executable SHA-256 is
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
The compile flags are:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

The target contract records these identities:

| Artifact | Result |
|---|---|
| Raw C object text | `C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D` |
| Linked target text | `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A` |
| Linked section | `.ob64.r4836`, runtime `0x80216C70`, 1,196 bytes |
| C object relocation count | 30 total |
| asm-differ proof | 299 rows, score `0`, maximum `29,900`, exact |

The original assembly remains the comparison fallback. It is not linked for the
selected owner in either fresh build.

## Reproduction evidence

The complete command ledger is in
[reproduction-procedure.md](reproduction-procedure.md).

| Gate | Result | Evidence artifact |
|---|---|---|
| Setup | PASS; 21 checks | `build/setup/verify-setup-report.json`; SHA `B0E9FA40...` |
| Fresh build A | PASS | `C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional\build-report.json`; SHA `A7470608...` |
| Fresh verifier A | PASS | `...run-a\conventional\verification.json`; SHA `D265EAEE...` |
| Fresh build B | PASS | `C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional\build-report.json`; SHA `A7470608...` |
| Fresh verifier B | PASS | `...run-b\conventional\verification.json`; SHA `D265EAEE...` |
| Reproducibility | PASS | `...run-a\conventional\reproducibility.json`; SHA `D99C32C6...` |

Both roots produced the following identical output identities:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,130,992 | `AFBCE8B6A5C6D43FC0BDA6A3F9386603DC89D839F76CDB9C159C3D2DBE1EFCF5` |
| `phase8.map` | 7,006,000 | `350B31BF8D51070A5039AFFA67ED2703F33C397EBF42873DBC3BF4CB92E075E2` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,899,701 | `9682CB22EEED5D20FD7091C6B4E76E6C8DD27F7E12D943FEB13E88240A328D91` |
| `phase8.readelf.txt` | 4,621,335 | `82C560E890175C78BF93F3C47E1F635CD4C671EF6876D1886516098DB1E06C7D` |
| `objects/manifest.json` | 25,742 | `8EC8D2EFF32B9CB1A57D3676A30AAB61A67685C2B835B056CD1BA86DD35E3F37` |

## Preservation evidence

The Phase 8 preservation report records 7,242 primary rows, 7,251 executable
slices, 19 overlay reservations, and no linked original-assembly target.

| Owner | Bytes | Linked target SHA-256 | asm-differ |
|---|---:|---|---|
| `func_000E5938` | 36 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` | exact; score `0` |
| `func_0000B33C` | 168 | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` | exact; score `0` |
| `func_00007688` | 224 | `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31` | exact; score `0` |
| `func_0000BC8C` | 524 | `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424` | exact; score `0` |
| `func_00269470` | 808 | `C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02` | exact; score `0` |
| `func_0026B360` | 1,156 | `5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC` | exact; score `0` |

## Evidence package

The evidence package consists of these curated records:

- [target-selection.md](target-selection.md)
- [independent-derivation.md](independent-derivation.md)
- [reproduction-procedure.md](reproduction-procedure.md)
- [task-log.md](task-log.md)
- [worker AAR](aar/20260802-ob64-matching-c-high-value-wave6-aar.md)

Generated ROMs, objects, maps, executables, and bulk reports remain outside the
evidence root. The evidence root contains no prohibited generated artifact.

## Claim and review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. The worker does not accept its own result.

The Director can freeze this package for fresh Critical review. No canonical
semantic document change is proposed before that review.
