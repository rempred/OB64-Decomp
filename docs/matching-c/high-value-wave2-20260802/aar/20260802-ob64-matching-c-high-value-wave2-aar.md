# After-action report: high-value matching-C wave 2

## Outcome

The worker result is complete and review-pending. `func_00007688` now has an independently derived 224-byte C implementation that reproduces the retained assembly and the conventional full ROM. This advances the accepted matching-C set while preserving existing owners, so the Director must route the result for independent Critical review and must not treat it as accepted yet.

No commit, push, publication, or acceptance verdict was made. Joe must take no action during worker intake.

## Assignment and boundary

The worker mission covered one high-value matching-C target in `OB64 Decomp`. The worker could edit the canonical decomp repository only. The parent research repository, `editor/`, integration inputs, original assembly, master ROM, and protected roots remained read-only.

The canonical decomp repository started at `main` commit `697f54a1f3d3048b302cf72205dc4d7ad9f9f376`. The parent repository started at commit `1e22de1041be2480e8b1e789aedad4e24b7fae39`. The worker left all changes uncommitted for Director intake.

## Target selection

The target is one accepted owner row with a secondary entry inside the same retained assembly owner. It is not a new target for the secondary entry.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_state_slot_flagged_dispatch_lookup` | Initializes state, scans six fixed-size records, dispatches flagged records, and provides an index lookup entry. | `0x00007688..0x00007768` | z64 ROM range, end exclusive | Exact 224-byte target boundary |
| `boot_state_slot_flagged_dispatch_lookup` | Early boot placement for the same owner. | `0x80077288..0x80077368` | boot RAM virtual range, end exclusive | Linear ROM-to-RAM placement |
| `boot_state_slot_flagged_dispatch_lookup` | Accepted owner section and owner row. | `.ob64.r0067`, row `67`, `primary:3604e08f7eac09f922ae` | phase 5/7 owner model | Stable ownership and metadata |
| `boot_state_slot_index_entry` | Secondary entry that scans the same records and returns an index. | `0x00007714` | z64 ROM entry address | Alternate entry at owner offset `0x8C` |

The target is 224 bytes, which is above the 168-byte minimum and below the 512-byte maximum. Its six-record loop, multiple branches, two call sites, and callback path establish structural value. Its caller and callee relationships are recorded in `target-selection.md`.

## Independent derivation

The source file is `src/boot/boot_state_slot_flagged_dispatch_lookup.c`. It expresses the observed record stride, status flag, per-record flag, target field, loop bounds, return value, and external symbols as C. Constrained inline assembly and register bindings preserve the exact zero-register `addu` encodings and delay-slot placement. The source does not copy the original instruction body.

| Semantic item | Address | Address space | Evidence role |
|---|---|---|---|
| State-slot status | `0x800C4C26` | boot RAM virtual address | Controls primary dispatch early exit |
| State-slot records | `0x800E82C8` | boot RAM virtual address | Base of six records with `0xA8` stride |
| State-slot initializer | `0x80077F80` | boot RAM virtual address | Primary external call target |
| State-slot callback dispatcher | `0x80077F88` | boot RAM virtual address | Called for matching flagged slots |

The focused linked text contains 224 bytes and equals the 224-byte reference extracted from the retained assembly. The focused proof reports zero differing bytes and candidate/reference SHA-256 `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`.

## Verification

The pinned KMC compiler and binutils produced the focused proof. The Phase 8 build then compiled all three configured targets and reproduced the canonical ROM. Two fresh output roots produced identical build and verification identities.

| Gate | Result | Evidence |
|---|---|---|
| Pre-edit setup baseline | PASS; all 21 checks passed. | Setup report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Focused target proof | PASS; 224/224 bytes, zero differences. | `focused-proof.json` |
| Phase 8 model load | PASS; rows `1972`, `105`, and `67` load. | `config/phase8/matching-c.json` |
| Phase 8 root A build | PASS; all three targets link. | `build-report.json`, SHA-256 `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004` |
| Phase 8 root A verification | PASS; full ROM, placement, relocations, and preservation checks pass. | `verification.json`, SHA-256 `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B` |
| Phase 8 root B build and verification | PASS; identities match root A. | Root B build and verification reports |
| Two-root reproducibility | PASS; paths do not affect identities. | `reproducibility.json`, SHA-256 `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697` |
| Conventional Phase 7 verification | PASS; canonical ROM remains exact. | ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Post-edit setup | PASS; all 21 checks passed. | Setup report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The Phase 8 verifier recorded `fullRomExact: true`, `acceptedRowsPreserved: 7242`, `acceptedSlicesPreserved: 7251`, `overlayDescriptorsPreserved: 19`, and `originalAssemblyTargetsNotLinked: true`.

## Changed surfaces

The worker added the following source and evidence files:

- `src/boot/boot_state_slot_flagged_dispatch_lookup.c`
- `docs/matching-c/high-value-wave2-20260802/target-selection.md`
- `docs/matching-c/high-value-wave2-20260802/independent-derivation.md`
- `docs/matching-c/high-value-wave2-20260802/task-log.md`
- `docs/matching-c/high-value-wave2-20260802/evidence-index.md`
- `docs/matching-c/high-value-wave2-20260802/aar/20260802-ob64-matching-c-high-value-wave2-aar.md`

The worker added one target entry to `config/phase8/matching-c.json`. The retained original assembly was not changed. No generated build artifact was added to the canonical repository.

## Limits and deviations

The first setup invocation exceeded the shell tool's 124-second timeout before the verifier reported. The unchanged command passed on a 600-second retry. This was a host-tool timeout, not a product or semantic failure.

The focused artifacts were first produced in a temporary worker root and then moved intact to the required focused evidence root. The two Phase 8 reproduction roots were fresh and empty before their builds. No runtime emulator gate or human judgment gate was required.

The result proves byte identity and structural correspondence. It does not independently prove the runtime meaning of every state-slot field. The target remains review-pending until a separate reviewer evaluates the derivation, ownership, relocation model, and evidence package.

## Review and next action

All material claims in this report are marked supported and review-pending. The evidence index maps each claim to its artifact and command. The Director must freeze this uncommitted result and route it for independent Critical review.

After accepted review, the Director may update the canonical status documents to list this target as the third matching-C result. This worker did not edit those status documents because acceptance remains outside the worker role.
