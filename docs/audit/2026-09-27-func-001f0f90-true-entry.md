# True-entry correction for ROM 0x001F0F90

Status: accepted structural correction; full audit PASS and independent review PASS on 2026-09-27 UTC.

## Evidence and scope

The previous function returns at ROM `0x001F0F88` with its delay slot at `0x001F0F8C`. The next three instructions at `0x001F0F90` load values consumed by the branch after the stack adjustment at `0x001F0F9C`. Retail callers, including `func_002ACF08` at ROM `0x002ACF68`, execute `jal 0x801ADB00`. Accepted placement maps that runtime address to ROM `0x001F0F90`. The July correction record independently records the twelve-byte preamble fold.

The head owner remains `0x001F0F90..0x001F1000` (row 3669); its continuation remains `0x001F1000..0x001F102C` (row 3670). The callable name is now `func_001F0F90`, before the first instruction. The old `func_001F0F9C` label remains internal at the stack adjustment; it is no longer the head owner name. The continuation is named `func_001F0F90_chunk31tail`. All instruction words and physical ownership/placement are preserved.

The original [dossier](../dossiers/func_001F0F9C-preamble-orphan-20260926.md) and [prepared patch](../archive/matching-c-candidates/2026-09-26-func_001F0F90-true-entry-label.patch) retain the investigation. Historical June chunk reviews and inventory notes use the former prologue-based part name. The inventory's `codeContinuations.outgoing` is descriptive; the named table/string/export tools do not resolve this field as a build key.

## Recovered generation input

The historical default intake path is absent. The existing `--phase5a-root` option accepts the local configuration's preserved cumulative successor, under `.codex/ob64-matching-c-worktrees/outputs/lane-c/row565-phase5b-sol-correction-r1/phase5a-cumulative-successor`. All thirteen product files were authenticated through the unchanged `verifyPhase5aProduct` contract.

- Profile: `row565-row585-code-cumulative-successor`.
- Product: `02E621C81403C5EF7CC65EC29EF2ABF01B1ABA2755BB9B45801E94D6D4221BA6`.
- Product manifest: `F004C4C09D611671935BD0D7927D514EAC1E05C347FBB271A523C424AFDB1D04`.
- Primary ledger: `4C76602C42BB287A520EDC71D5A597FF94D8F3066E49EEFBF2502087AE452BBE`.

Before edits, `generate_phase5b_production_config.js --check --phase5a-root <configured root>` reproduced all current records exactly. The frozen original product also exists locally but is not substituted for the accepted cumulative successor.

## Reproduction and conservation

The ignored evidence root is `build/silentcrane-true-entry-20260927/`. It includes exact before/after inputs, complete model row/slice snapshots, an authentication report, and `apply-correction.cjs`, the bounded operation that performed these steps:

1. Authenticate the preserved product, verify baseline generation parity and save original inputs.
2. Apply the saved source/manifest patch and compare every instruction/address word pair in both owners; run `check_manifest.js`.
3. Run `generate_overlay_config.js`; require its sole semantic delta to be `conservation.sourceSplit.manifestSha256`.
4. Compute the generated overlay hash and update the generator's and production verifier's independent explicit overlay pins. All rejection logic remains unchanged.
5. Regenerate the production records from the authenticated cumulative product. Require only the overlay-hash fields to differ in segments YAML, semantic JSON and linker-input JSON. Require Splat YAML byte identity.
6. Compute the five changed conventional-build accepted-input pins from those files. Preserve all unrelated pins, rows, intervals and mappings.
7. Reload the accepted model; require only the two named part records to differ, head offset zero and runtime entry `0x801ADB00`.

The new overlay identity is `AF454D26C8453ED2393731A4C19C4D23E655B0601BF102D9A3D55731101BFB9B`. Re-running the ordinary generator check uses the authenticated external input and reproduces the new records. No missing-input bypass or replacement provenance was introduced.

## Validation

Completed: manifest integrity, before/after generator checks, production verifier, adversarial production-config tests, and explicit word/owner/placement conservation checks. Workbench inspection resolves one 156-byte logical function including both original parts, entry `0x801ADB00`, offset zero. Routine suite passed 18/18. The full structural audit passed at 2026-09-27T03:06:20.336Z, including independent CURRENT verification and the exact baseline/CURRENT ROM hash `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. [Independent review](2026-09-27-func-001f0f90-true-entry-review.md) passed; its stated audit condition is now met. No matching-C target is accepted by this correction alone. The complete roster wave retains its separate final matching acceptance gate.

## Separate dispatcher fixture maintenance

The first routine run passed 17 of 18 suites and found a pre-existing stale text identity in `tests/fixtures/matching/func_00284288-m2c-delay-slot.json`. That fixture dates to `08364676`; subsequent accepted manual-load mappings at `54618660` changed external call-name resolution. Today's entry correction does not change the dispatcher's emitted analysis text.

The preserved historical guarded text authenticates to the old fixture hash. Comparing its 2,226 lines with current output shows exactly 70 external `jal` operand spellings changed; every ROM/PC/raw-word prefix, internal label, guard, table and other line is identical. `dispatcher-call-name-proof.json` decodes each retail call destination and checks every new spelling against the accepted model. Sixty-nine calls resolve uniquely; one uses the existing honest ambiguous-address fallback at `0x8022AC90`, shared by `func_00286BD0` and `func_0029A4C0`. Fable independently confirmed these mappings in their pre-correction snapshot.

The authenticated existing reproducer still yields guarded success and the same unguarded failure, byte-identical to the historical failure output. Four guards are preserved. With Fable's concurrence in B1-001 messages 157–158, only the fixture's guarded and unguarded assembly hashes were refreshed. No guard, failure expectation, generator logic, retail bytes or C source changed. Original and current reproduction artifacts are preserved under the structural evidence root; the routine rerun passed all 18 suites without waiving its original failure.

## Preserved completion evidence

Before any roster activation, the exact audit, structural setup, baseline/CURRENT state, independent verification, fresh-compilation proof, build report and active matching configs were copied into `build/silentcrane-true-entry-20260927/audit-completion/`. Its `identities.json` records all source/snapshot hashes. The audit report identity is `B3303BD25FF6302E0A6202D1A1C4C26193B08FD18A96FB68E0BD44902DFAD108`; independent verification is `0F9B9BB1C63F63635B5186689F590569C6FF20DA1F7D9922138AA0ECA5D8EA08`. All original after-identities were rechecked unchanged at snapshot time. Generated policy counts remain in the saved reports.
