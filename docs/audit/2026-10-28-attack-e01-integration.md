# Attack E01 integration — 2026-10-28

The complete original 21-conversion E01 wave passed the changed-input audit at 2026-10-28T16:26:27.796Z. All requested bodies are matching `PURE_C`: 4,648 C bytes with 331 actual text relocations. The requested physical code owners contain 4,656 bytes, including eight retained original executable ASM bytes. Existing `PURE_C` `func_00260264` remains unchanged and passes the same final report.

| Target | Matching C bytes | Actual text relocations |
| --- | ---: | ---: |
| `func_0004ecfc` | 52 | 5 |
| `func_0004ed30` | 48 | 5 |
| `func_0020144C` | 120 | 1 |
| `func_0020BD8C` | 64 | 3 |
| `func_0025F800` | 992 | 90 |
| `func_0025FBE0` | 104 | 10 |
| `func_0025FC48` | 76 | 7 |
| `func_0025FC94` | 32 | 1 |
| `func_0025FCB4` | 76 | 7 |
| `func_0025FD00` | 144 | 0 |
| `func_0025FD90` | 188 | 1 |
| `func_0025FE4C` | 104 | 12 |
| `func_0025FEB4` | 480 | 29 |
| `func_00260094` | 84 | 6 |
| `func_002600E8` | 296 | 40 |
| `func_00260210` | 84 | 2 |
| `func_00260270` | 380 | 53 |
| `func_002603EC` | 48 | 3 |
| `func_00263190` | 60 | 3 |
| `func_002631CC` | 564 | 21 |
| `func_00263400` | 652 | 32 |

The canonical verifier proves sole C-object ownership, accepted placement, exact relocation contracts and exact linked target bytes for every member. Fresh compilation independently reproduces the final source-to-object evidence without compiler-assembly rewrites. The complete 41,943,040-byte US Rev 0 ROM equals the canonical normalized baserom: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The approved registered terminal edges keep physical rows 4646 and 4723 whole in overlay 12. `func_002603EC` supplies 48 C bytes at ROM 2603EC..26041C; original executable ASM retains 26041C..260420. `func_00263400` supplies 652 C bytes at ROM 263400..26368C, including the original preamble; original executable ASM retains 26368C..263690. Each C object has one GLOBAL original-name compiler function of the complete admitted body size. Both suffixes retain sole explicit original ASM ownership and exact bytes. The audit reconstructs the full physical rows, with hashes `9807F266F625BAD3E610529285C7835DA6EBE70FD5FE03FFA99B9F3F1268B738` and `8713A9B0765971F897BBEBCEF2F203F67DC5FC6EC97FBF8AD0FD60383BC7711C`. No claim of universal suffix unreachability or original compiler-padding provenance is made. Original assembly remains available as reference/fallback.

The row 4723 report records the original zero-size LOCAL/STT_OBJECT marker `func_00263408` at offset 8 under `omittedLocalSymbols`. The sole GLOBAL C function covers all 652 body bytes, including the preceding eight-byte preamble. This marker is distinct from a compiler function or a derived public interface.

`func_002631CC` supplies its complete 564-byte body and the original 20-byte switch table at ROM 2756F0..275704 / RAM 80220B40..80220B54, row 4930. The table has sole C-object ownership, five actual `R_MIPS_32` relocations and linked SHA-256 `99F220C10D96A82E24C9EA32E4E032088C7479CDB8EEFBF23E5751BF454E113F`. Its native read-only object section is 24 bytes, aligned to 8: the approved existing generic source-prefix contract preserves the 20-byte payload and records omission of only the four terminal zero alignment bytes. Native full-section, payload and zero-suffix identities, all relocation offsets/addends and the closed native symbol set remain pinned. No retail bytes are synthesized or dropped; the original ASM table is excluded exactly once.

The structural admission applies only the independently reviewed E01-after-P03 patch `A5665BE8B003F493F349D0CA6EE9290BA695A779C37AA2191BEDD8456A19BEE7`, followed by the approved auxiliary patch `D4912AE35B1F5AE2B5BF2B9F3EAE04892B8683A2C441A30A9D40DDDF25A42050`. The separate table review `90428E840117DC4AD8A3E184700500F606D3FBBD81FDD919A6144548178163B8` includes independent raw-object/retail evidence and adversarial rejection checks. Ordinary integration adds 44 fixed bindings resolved against accepted overlay-aware owners and records 331 actual text relocations. Shared headers, tooling, compiler identity, source-policy rules, physical owner boundaries and overlay descriptors are unchanged.

All 21 focused linked comparisons passed before one changed-input `tools/audit.js` run with the accepted external L4 product. The changed structural baseline required one separately admitted setup build, which reproduced the canonical ROM exactly. No preceding CURRENT build, per-function full-ROM verifier, duplicate final verifier or ordinary-wave source-review gate was added. The audit includes registered-edge, retained-auxiliary, native, scratch, physical-interface, structural, fresh-compilation and complete-ROM checks.

The source plan preserves private native-tested source identities. Two explanatory comments were added before production checks: the postincrement schedule in `func_00260094` and the volatile byte-view reload workaround in `func_00263400`. The original flag declaration remains unknown. Reusable positive/negative source pairs for [direct coefficient indexing](../dossiers/func_002631CC-782952b28a.md) and [direct array arguments](../dossiers/func_0025F800-72d4df040b.md) retain their diagnostic status; canonical acceptance comes from the final audit.

Ignored detailed evidence: [E01 integration](../../build/research/attack-e01-integration/), including exact input/source manifests, focused reports, native table provenance and immutable final proof snapshots. Other workers' scratch and prior accepted proof are preserved. This acceptance record does not authorize scratch cleanup or itself release worker ownership.

Accepted CURRENT: `31E3FB109C951A9C1DDECBE77DA724633518F8A0A533A1F1721DCD89D29D277C`.

Audit report SHA-256: `090F8A7E1AF8B53A7D8F893B4E99BF9F84D7F9294C3DCA8FF9BC201D0592D464`.

Verification report SHA-256: `8E751D381EE0F68290DE07E16E9ADBEEE2D63AAAF5F32BD8C6E0E2AD638294AC`.

Fresh compilation report SHA-256: `D6E3F10D89CA0396B0613815D5F375FB0D7C5503D6AC5AE883C832BEFE67FC58`.

Source-policy report SHA-256: `1D46CEDA20F091CD03DE7918B5C97FF48519E02D921C5A02DCA2A08ED4830EED`.
