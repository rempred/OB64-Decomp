# Attack P03 integration — 2026-10-28

The complete ten-member P03 wave passed the changed-input structural audit at 2026-10-28T10:19:11.033Z. All ten requested bodies are matching `PURE_C`: 4,472 C bytes and 311 actual target relocations. The unchanged physical owners contain 4,480 bytes, including eight retained original executable ASM bytes.

| Target | Matching C bytes | Actual relocations |
| --- | ---: | ---: |
| `func_002502DC` | 488 | 32 |
| `func_002504C4` | 552 | 41 |
| `func_00251FF8` | 204 | 16 |
| `func_002528B8` | 484 | 32 |
| `func_002530C4` | 484 | 32 |
| `func_0025402C` | 500 | 35 |
| `func_00254D50` | 484 | 32 |
| `func_002557C4` | 540 | 38 |
| `func_00256128` | 484 | 32 |
| `func_0025630C` | 252 | 21 |

The canonical verifier established sole C-object ownership, accepted placement, exact relocation contracts and exact linked target bytes for every member. Fresh compilation independently reproduced the source-to-object evidence, with no compiler-assembly rewrites. The complete 41,943,040-byte Rev 0 ROM equals the canonical normalized baserom: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

For `func_0025630C`, physical row 4522 remains ROM25630C..256410 in descriptor 11, RAM8020174C..80201850. The complete C body covers 252 bytes through the end of the return delay at 0x256408. The original executable ASM retains 0x256408..0x256410. Both RX slices have sole explicit full-path selectors, no linker fill, conserved load mapping and envelope interfaces, and one GLOBAL/default compiler function at 0x8020174C of size 252. The audit independently reconstructed the complete 260-byte row, SHA-256 `B2E5D589137DE76F640B77ED17358B14524840F7D8FF8C7475A6283F3BE9D531`. No derived alias or omitted local marker is needed. The full original assembly remains available as reference/fallback.

This admission applies only the independently reviewed P03 standalone patch `7A382C076888DBAF6D724EA350923BFC4B97FCCE6AD5B6BFFC37A5DC6840A91D`, using the existing generic registered-edge contract. No shared tooling, verification implementation, compiler flag, source-policy rule, boundary of a physical owner, overlay descriptor or linker rule changed. The structural configuration keeps its original line endings. Twenty-nine new data bindings and the accepted ASM entry `func_0024E898` were resolved against accepted overlay-aware owners; established helper signatures and shared headers are unchanged.

Unknown indirect, computed, encoded and runtime references remain unknown. One numeric direct-control scan hit to 0x8020184C resolves within overlay 9 to a different accepted owner, rather than an overlay 11 incoming edge. Neither original compiler-padding provenance nor universal suffix unreachability is claimed. The original suffix stays executable and represented.

All ten focused linked comparisons passed before the single changed-input audit. The first attempted diff refused the stale structural baseline before compiling; one separately budgeted baseline-only setup then reconstructed the exact retail ROM. No preceding CURRENT build or duplicate final verifier was run. The audit used the accepted external L4 structural product and included the registered-padding, native, scratch, retained-auxiliary, physical-interface, structural, fresh-compilation and complete-ROM gates.

Eight source files were normalized from mixed line endings to LF before focused checks. After the complete focused sequence, one empty EOF line was removed from each of those eight files; fresh source-policy preprocessing proved all compiler-input bytes, dependencies and preprocessor identities unchanged. The final audit compiled the exact final source hashes. Original source byte forms and correspondence records are preserved in the integration evidence.

The reusable [terminal-owner source pair](../dossiers/func_0025630C-5434473088.md) has a fresh research identity for the 252-byte body. Historical 201BCD6E/6760E2AC evidence remains a failed 260-byte diagnostic; the research import itself is uncompiled and acceptance-ineligible. Canonical acceptance comes from the separate audit above.

Ignored proof and orchestration evidence: [P03 integration](../../build/research/attack-p03-integration/). The private P03 root remains owned by its source worker; this integration performs no private-root cleanup or ownership release. E01's own complete matching assignment remains unfinished and separately tracked.

Accepted CURRENT: `801B5A5E7B890AACD5CA3A0429F4A55469F6E3DFD03D83C9D24EF3AEC5EF5559`.

Audit report SHA-256: `F28BCA845958124752480F1277636EB84F808F93E7E8E00959515164FEF2A8AB`.

Verification report SHA-256: `FA8B30BCB346A03C02A0C6D3B2E24C93F3ED41C40FD67ED13FD32402E7F7402C`.

Fresh compilation report SHA-256: `8666327AD3807870C120AFF2A5292007C42B906742F5997F1EDBE772EDA392E0`.

Source-policy report SHA-256: `C98CD0B0FA85A8739E5D8B1A99C410D9CE122816385487140D5933964623C73B`.
