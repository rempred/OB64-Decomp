# func_001F0F9C: preamble-orphan true entry at 0x001F0F90 (2026-09-26)

Preservation does not change current source ownership or establish matching acceptance.

2026-09-27 update: the true-entry correction is now implemented provisionally using the recovered authenticated cumulative Phase 5 input and the existing `--phase5a-root` option. See the [structural correction report](../audit/2026-09-27-func-001f0f90-true-entry.md) for current validation/review status. The notes below preserve the original September 26 investigation and its then-unapplied state.

- Prepared change: [patch](../archive/matching-c-candidates/2026-09-26-func_001F0F90-true-entry-label.patch) (rename of the head and chunk-31 tail parts, true-entry label, manifest records; assembled bytes unchanged; `check_manifest.js` passes with it applied)
- Blocked caller: `func_002ACF08` candidate at [archive](../archive/matching-c-candidates/2026-09-26-func_002ACF08-blocked-preamble-entry.c)
- Status: reverted from the tree; nothing applied.

## Finding

Retail bytes:

```
1F0F88  jr $ra ; 1F0F8C delay slot        end of the previous function
1F0F90  lui $v1,0x801D                     true entry (0x801ADB00), D_801CE8BC load
1F0F94  lw  $v1,-0x1744($v1)
1F0F98  lw  $v0,0x56C0($v1)
1F0F9C  addiu $sp,$sp,-8                   registry label func_001F0F9C sits here
```

`func_002ACF08` calls `0x801ADB00`. The split part `asm/original/rev0/lib/func_001F0F9C.s` already spans `0x1F0F90..0x1F1000` and its header names the true entry, but the part label is on the `addiu $sp`, so `phase7_conventional.js` derives a 12-byte pre-label prefix and the matching model reports entry `0x801ADB0C`. The 2026-07-08 corrections overlay (`scripts/ob64_function_corrections_rev0.json`) records this exact fold (`parentStart 0x001F0F9C`, `decompStart 0x001F0F90`). The June 2026 chunk reviews fixed the same class with a true-entry label and a part rename (for example `func_0000D248`); that step was never applied to the July folds.

## Why it is not a local edit

Any change to a part's text changes `asm/original/rev0/manifest.json`, whose SHA-256 is an accepted input:

1. `config/phase7/conventional-build.json` `acceptedInputSha256` pins the manifest; every `diff.js`, `inspect`, and `verify.js` fails with "accepted input SHA-256 drift" until it is re-pinned.
2. `config/overlays/us_rev0.json` embeds `sourceSplit.manifestSha256` (regenerable with `tools/generate_overlay_config.js`; only that field changes).
3. The overlay config's own hash is pinned in `config/segments/rev0.yaml`, `config/splat/us_rev0.semantic.json` (twice), `config/splat/us_rev0.overlay-linker-inputs.json`, and again in the phase 7 accepted inputs.
4. Items in 3 are produced by `tools/generate_phase5b_production_config.js` from the phase 5 intake product `docs/external-intake/phase5-boundary-segment-reconciliation-static-20260731`, which is not present in the tree (only `phase6-kmc-reproduction-20260801` is).

Hand-editing those hashes would satisfy the checks without the provenance they represent. That is outside ordinary matching work and outside what this session did.

## What acceptance of the fix needs

- Apply the patch (or re-split with `tools/split_original_mips_part.js` using the `:true-entry-label` field).
- Regenerate the overlay config, then the phase 5b production records with the intake product available, then re-pin `config/phase7/conventional-build.json`.
- Run `node tools/verify.js` once; expect `EXACT BASELINE` with unchanged bytes.
- Then `func_002ACF08`: copy the archived candidate to `src/lib/`, add its target record, `diff.js`, relocation contract.

The same treatment applies to every other July preamble-orphan fold whose part label was left on the prologue; a caller that resolves through the registry will hit the same wall.
