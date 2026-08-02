# Wave 5 matching-C evidence index

## Status and result

Status: completed and review-pending. `func_0026B360` now builds through the
accepted compiler with exact linked bytes in two fresh external roots. This
matters because one larger control path joins the matching-C owners without
changing the canonical ROM. No action is required from Joe; the Director must
route the result for fresh Critical review.

## Mission identity

| Item | Result |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave5-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical starting branch and HEAD | `main`, `c81a897f4f6b7b65ddd84d23fa6b3012e45025e8` |
| Parent starting HEAD | `db51d5de60fbe67599553565fd97dc3dd5282e3f`; read-only |
| Integration baseline | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Setup report | `build/setup/verify-setup-report.json`; `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Matching-C configuration | `config/phase8/matching-c.json`; `E07A2C3A2E58478EF5F76BD1C168B97026920B9ADC35A5306E847017C55B6BD4` |

The prompt parent baseline was
`9f3b3ce95fc71074a1045785cbd9febdf36eedfe`. The observed parent HEAD differed.
The parent remained read-only, so the mismatch did not affect this result.

## Selected owner

The selection record is [target-selection.md](target-selection.md).

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0026B360` | Selector-indexed resource and state dispatcher | `0x0026B360..0x0026B7E4` | z64 ROM range, end exclusive | Selected owner |
| `func_0026B360` | Same dispatcher placement | `0x802167B0..0x80216C34` | overlay runtime range, end exclusive | Linked section `.ob64.r4834` |
| `func_0026B32C` | Boundary predecessor | `0x0026B32C..0x0026B360` | z64 ROM range | 52-byte predecessor |
| `func_0026B7E4` | Boundary successor | `0x0026B7E4..0x0026B820` | z64 ROM range | 60-byte successor |
| `g_func_0026B360_dispatch_table` | Seven-entry dispatch table | `0x80220C20` | overlay runtime virtual address | Indirect jump table |

The owner is 1,156 bytes. Its accepted row is `4834`, section `.ob64.r4834`,
chunk `038`, primary ID `primary:8665aebe04f0e5851dd9`, and descriptor `12`.

## Independent C derivation

The source is `src/overlays/descriptor_12/func_0026B360.c`. Its SHA-256 is
`A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8`.
The original assembly SHA-256 is
`2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73`.

The complete derivation is in
[independent-derivation.md](independent-derivation.md).

| Assembly evidence | C behavior or constant | Source result |
|---|---|---|
| Entry offsets `0x01C..0x0044` | Mask selector and dispatch through seven entries | `selector_arg & 0xFFFF`; computed `goto` |
| Case starts `0x050`, `0x088`, and `0x0DC` | Walk records, free arrays, or return a record value | Selectors one, two, and six |
| Selector-zero offsets `0x0F0..0x0184` | Load count, allocate arrays, initialize records, and call helpers | Three allocator calls and one bounded loop |
| Selector-five offsets `0x0194..0x0210` | Check flags, call helper, set high flag, clear state flag | Structural flag transition |
| Selector-three offsets `0x0218..0x03F0` | Run five record loops with fixed helper arguments | Five bounded loops |
| Selector-four offsets `0x03F8..0x0448` | Test flag and record halfword before helper call | Structural record check |
| Relocation table | Resolve overlay globals and 17 direct calls | 29 `.rel.text` entries and one `.rel.pdr` entry |

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
| Raw C object text | `09E0856A4F0881FE2D495FA4A2C291A889DB3BFCB784FC7D7623B8AE639F1249` |
| Linked target text | `5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC` |
| Linked section | `.ob64.r4834`, runtime `0x802167B0`, 1,156 bytes |
| C object relocation count | 30 total |
| asm-differ proof | 289 rows, score `0`, maximum `28,900`, exact |

The original assembly remains the comparison fallback. It is not linked for the
selected owner in either fresh build.

## Reproduction evidence

The complete command ledger is in
[reproduction-procedure.md](reproduction-procedure.md).

| Gate | Result | Evidence artifact |
|---|---|---|
| Setup | PASS; 21 checks | `build/setup/verify-setup-report.json`; SHA `B0E9FA40...` |
| Fresh build A | PASS | `C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a\build-report.json`; SHA `D8CBBDD...` |
| Fresh verifier A | PASS | `...wave5-20260802-a\phase8-final-a\verification.json`; SHA `B4DDC93...` |
| Fresh build B | PASS | `C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b\build-report.json`; SHA `D8CBBDD...` |
| Fresh verifier B | PASS | `...wave5-20260802-b\phase8-final-b\verification.json`; SHA `B4DDC93...` |
| Reproducibility | PASS | `...wave5-20260802-a\phase8-final-a\reproducibility.json`; SHA `2EE4D99...` |

Both roots produced the following identical output identities:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,130,728 | `D1AC44BDA03BB5B104F6CB810A8419A86791521FE6E0D2F820925C6B07CDAE0D` |
| `phase8.map` | 7,004,697 | `F6027949F179C558AEBE7906F308887AF5DA5B2A4F4B106F07BDE61B29F03778` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Layout | 4,899,208 | `6B6C34EC593BFB1C149A192368B45999731584196B3925A99FBA80482EEC72B9` |
| Readelf output | 4,620,742 | `7D2DB83D00427B0F84AA619781ACD5BA00268057696E54A53E079DFD3BE358F9` |
| Object manifest | 25,444 | `9552CC8B84B17BD3F47048502D3C764B6CC4AE4AD9078BF9695849BF212FB3CF` |

## Preservation evidence

The Phase 8 preservation report records 7,242 primary rows, 7,251 executable
slices, 19 overlay reservations, and no linked original-assembly target.

| Owner | Bytes | Linked target SHA-256 | asm-differ |
|---|---:|---|---|
| `func_000E5938` | 36 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` | exact |
| `func_0000B33C` | 168 | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` | exact |
| `func_00007688` | 224 | `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31` | exact |
| `func_0000BC8C` | 524 | `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424` | exact |
| `func_00269470` | 808 | `C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02` | exact |
| `func_0026B360` | 1,156 | `5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC` | exact |

## Evidence package

The evidence package consists of these curated records:

- [target-selection.md](target-selection.md)
- [independent-derivation.md](independent-derivation.md)
- [reproduction-procedure.md](reproduction-procedure.md)
- [task-log.md](task-log.md)
- [evidence-index.md](evidence-index.md)
- [worker AAR](aar/20260802-ob64-matching-c-high-value-wave5-aar.md)

Generated ROMs, objects, maps, executables, and bulk reports remain outside the
evidence root. The evidence root contains no prohibited generated artifact.

## Claim and review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. The worker does not accept its own result.

The Director can freeze this package for fresh Critical review. No canonical
semantic document change is proposed before that review.
