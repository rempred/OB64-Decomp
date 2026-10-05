# Resource DMA-transfer wave

The complete assigned wave passed one `node tools/verify.js --profile` invocation at 2026-10-05T18:14:25.733Z. Both physical owners and all three required logical bodies are `PURE_C`, with sole C ownership, accepted placement, exact actual relocations and complete linked target bytes, independently fresh source-to-object identity, and an exact complete Rev 0 ROM. The original assembly remains tracked as reference/fallback.

| Physical owner | Bytes | Required logical bodies | Actual relocations |
|---|---:|---|---:|
| `func_0001a380` | 192 | `func_0001a380` (192) | 6 |
| `func_0002de50` | 164 | `func_0002de50` (156), `func_0002DEEC` (8) | 3 |

1A380 retains real 24-byte queue and I/O-message storage, one message word, queue/cache calls even for zero length, the `0x200` chunk limit, and the DMA-start/wait sequence. The existing baseline `func_0001c040` interface is reused; the observed device pointer at RAM `0x800E7A20` is bound. DE50 retains real 32-byte scratch, sixteen-byte alignment, the unsigned less-than-sixteen branch, even-rounded actual transfer lengths, and the small byte-copy/direct-transfer paths. The independently called empty DEEC entry remains local at owner offset `0x9C` under the existing `LOCAL`/`fixed-address-call` census contract. Raw, stripped and linked function evidence covers both bodies. Original ASM, structural owners, compiler/tool contracts, OS/cache/device primitives and accepted resource-header/Scenario callers are preserved.

Useful research was published with the existing import/preserve commands:

- [1A380 post-start chunk lifetime](../../dossiers/func_0001a380-9352e8b29c.md) and [premature-update counterexample](../../dossiers/func_0001a380-62b10f6d6d.md): writing cursor updates after DMA-start in C keeps the chunk live through the call; GCC schedules the updates before it and selects the retail saved register. The ordinary `register` keyword was unnecessary. Production uses the existing lowercase start symbol; private source retains its original symbolic spelling.
- [DE50 branch-local copy cursor](../../dossiers/func_0002de50-0f22f20863.md) and [whole-path destination counterexample](../../dossiers/func_0002de50-94f0cc2a84.md): restricting the copy cursor to the small branch preserves the incoming direct-path argument and removes the extra move/four excess bytes. Private global-body census and production local-entry census are distinct; canonical checks verify the actual local entry.

Ignored evidence is under `build/matching/sol-dma-20261005/`: private watches, canonical diff logs, imports/preservation receipts and `final-verifier.log`. The assigned long root was rejected by the existing 24-character name limit; Astra1291 corrected it without a tooling change. This worker uses its own RosePanther identity and verified desktop-direct watcher. Astra1297 released the one integration interval only after Shop1296 acknowledged its native/store drain. No canonical mutation preceded that release.

`build/matching/sol-dma-20261005/final-evidence.json` retains the final state, both focused reports, relevant final verification/fresh-compilation/source-policy entries and report identities. CURRENT fingerprint `2B85BC8004318B8EDB84DE2CCD41F0E76726AC3988EEC44F67ABE9D4FCDA5D83`; baseline `1C14E225B1650F78DB175CCF6933B950262A4F848215BC114149ACD3181B061F`; exact 40 MiB ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Profile `build/verification-profile/verify-20261005174645389-38908.json` records 1660.402 seconds. Generated status owns changing counts. No unchanged verifier repeat is required for the scoped commit/handoff.

All canonical/native/store/import/publication commands were drained and stable inputs released under RosePanther1301; Astra1302 released Shop. Running generated status after the verifier extended that hold. Future stable-input release should follow required verification/publication immediately; optional reporting must not extend the hold or use active shared/native resources after release.

This wave does not complete all DMA, Scenario or the parked scheduler NINE/original FIVE, pursuit TWENTY-ONE, lifecycle TEN or Combat W6SEVENTEEN. Matching adds no runtime safety, capacity or behavioral claim. No push or successor wave is authorized.
