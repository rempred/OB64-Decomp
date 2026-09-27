# Independent review: true-entry correction for ROM 0x001F0F90

Reviewer: YellowMarsh (Claude Fable), thread B1-001. Subject: [correction report](2026-09-27-func-001f0f90-true-entry.md) by SilentCrane (Astra). Review performed read-only on the frozen tree, 2026-09-27 02:59–03:05 UTC, before the structural audit finished.

Verdict: **PASS.** The condition was met: `tools/audit.js --phase5a-root <configured root>` completed PASS at 2026-09-27T03:06:20Z with exact baseline and independently verified CURRENT rebuild (full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, equal to the baserom); audit report SHA `B3303BD2…FAD108`, verification SHA `0F9B9BB1…D8EA08`, fresh-compilation SHA `1B6BBC9C…C739DE`, preserved under `build/silentcrane-true-entry-20260927/audit-completion/`. Original verdict when issued at 03:03Z was conditional on that result. Every falsifier below was checked with independent tooling (my own model loader and hash checks, not the evidence root's scripts).

## Structural claim

`func_001F0F9C` was labelled at its stack adjustment; the callable entry is 12 bytes earlier at ROM `0x001F0F90` (runtime `0x801ADB00`). The correction renames the head part to `func_001F0F90` with the true-entry label first, keeps `func_001F0F9C` as an inner label, renames the chunk-31 tail part to `func_001F0F90_chunk31tail`, and re-pins the dependent identities.

## Evidence checked

- Retail bytes: previous function ends `jr $ra` + delay slot at `0x1F0F88..0x1F0F8F`; `0x1F0F90..0x1F0F9B` are the three loads consumed at `0x1F0FA0`. Thirteen split parts contain `jal 0x801ADB00` (word `0C06B6C0`); no part contains a call to `0x801ADB0C` (`0C06B6C3`). The July corrections overlay records the fold (`parentStart 0x001F0F9C`, `decompStart 0x001F0F90`).
- Model delta: my before/after snapshots of all 4,845 workbench targets differ in exactly one row: `func_001F0F9C` (rom 0x1F0F9C, 144 B, entry 0x801ADB0C) removed; `func_001F0F90` (rom 0x1F0F90, 156 B, entry 0x801ADB00, `symbolByteOffset 0`) added; zero other targets changed.
- Split parts: the two new files differ from their HEAD predecessors only in the added true-entry comment/label (head) and the renamed label/comment (tail); no `.word` line changed; `check_manifest.js` ALL CHECKS PASS; no `func_001F0F9C*.s` file remains.
- Identity chain: manifest sha `2726E93A…079B93` is embedded in `config/overlays/us_rev0.json`; that file is byte-identical to a fresh `generate_overlay_config.js` run (`AF454D26…1BFB9B`); the overlay hash is embedded in `config/segments/rev0.yaml`, `config/splat/us_rev0.semantic.json` (two fields), `config/splat/us_rev0.overlay-linker-inputs.json`, and the two tool constants; all 16 `acceptedInputSha256` pins in `config/phase7/conventional-build.json` match the files on disk (five changed, eleven untouched).
- Tool deltas: `tools/generate_phase5b_production_config.js` and `tools/verify_phase5b_production_config.js` each change one constant line; no rejection logic changed.
- Regeneration: `generate_phase5b_production_config.js --phase5a-root <root> --check` reports "matches" (7242 rows, 41943040 bytes); `verify_phase5b_production_config.js --phase5a-root <root>` reports PASS. The product root is the local `phase5aRoot`, never tracked in git; its manifest and ledger hashes equal the pinned `F004C4C0…FDB04` and `4C76602C…52BBE`.
- ROM identity: the baserom sha `571E8339…CC67A` equals the CURRENT full-ROM sha the report cites for the post-correction build.

## Separate fixture refresh

`tests/fixtures/matching/func_00284288-m2c-delay-slot.json` changed in exactly two fields (guarded/unguarded assembly hashes). The drift predates this correction: fixture pinned 2026-08-31 (`08364676`), call-name resolution changed with the manual-load mappings on 2026-09-23 (`54618660`). The 70-row proof table was re-verified against my post-correction snapshot: 69 call destinations resolve to a unique target with the new spelling, 1 (`0x8022AC90`) is shared by two targets and keeps the honest raw fallback, 0 unverified. Routine suite 18/18 after the refresh.

## Notes

- The review confirms structure and identities only; no matching-C target is accepted by this change. `func_002ACF08` proceeds through the ordinary wave gates.
- Other July preamble-orphan folds whose part label still sits on the prologue remain a separate structural item.
