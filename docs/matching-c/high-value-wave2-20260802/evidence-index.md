# Evidence index

The worker result is complete and review-pending. This index ties each material claim to a command, source record, or generated artifact, so the Director can route a bounded Critical review. No action is required from Joe during worker intake.

## Claim index

| Claim | Evidence artifact or source | Command or verification | Result and review state |
|---|---|---|---|
| The repository setup passed before source edits. | `build/setup/verify-setup-report.json` | `node tools/verify_setup.js --phase5a-root "C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731"` | All 21 checks passed. Report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`. Supported; review pending. |
| The selected symbol is a valid high-value structural target. | `target-selection.md`; `docs/dossiers/boot-state-slot-flagged-dispatch-lookup.md`; accepted owner model row 67 | Target-boundary and model queries recorded in `target-selection.md` | One `.ob64.r0067` owner spans 224 bytes. It has a six-record dispatch loop, two call sites, multiple branches, and an accepted secondary entry. Supported; review pending. |
| The C source independently derives the retained assembly. | `src/boot/boot_state_slot_flagged_dispatch_lookup.c`; `independent-derivation.md` | Pinned KMC compiler, GNU assembler, linker, and objcopy in the focused procedure | Focused linked `.text` is 224 bytes and exact. Supported; review pending. |
| The focused candidate is byte-exact. | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-focused-a\\focused-proof.json` | Focused compile, link, extraction, and inline comparison | `exact: true`; 224 reference bytes, 224 candidate bytes, zero differences. Candidate and reference SHA-256 `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`. Supported; review pending. |
| Phase 8 accepts the new target with exact metadata. | `config/phase8/matching-c.json` | Phase 8 model load and matching-C build | Three targets load with rows `1972`, `105`, and `67`. The new target has source SHA-256 `BDEDCC08040A6DB6D45303ACEA8AE652E3A261FB6B63D44064C72F534A81F5A5` and config SHA-256 `2A0FA4B1EB460E5DD2AD24459DC35B1876DBD51D44B721031922DE9791F4EDD6`. Supported; review pending. |
| The conventional full ROM remains exact. | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a\\build-report.json`; Phase 7 conventional output | `node tools/build_phase8_matching_c.js ...`; `node tools/verify_phase7_conventional.js ...` | Build and conventional verification passed. ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Supported; review pending. |
| Existing accepted targets and owner mappings were preserved. | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a\\verification.json` | `node tools/verify_phase8_matching_c.js ...` | `fullRomExact: true`; `acceptedRowsPreserved: 7242`; `acceptedSlicesPreserved: 7251`; `overlayDescriptorsPreserved: 19`; `originalAssemblyTargetsNotLinked: true`. Supported; review pending. |
| The result is reproducible from two fresh roots. | Root A and root B reports; `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a\\reproducibility.json` | `node tools/compare_phase8_reproducibility.js --left ... --right ... --report ...` | Reproducibility passed. Build report SHA-256 `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004`; verification SHA-256 `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B`; reproducibility SHA-256 `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697`. Supported; review pending. |
| Post-edit setup remained valid. | `build/setup/verify-setup-report.json`; `task-log.md` | The required explicit-root setup command was rerun after source and configuration edits | All 21 checks passed. Canonical code and ROM hashes remained exact. Supported; review pending. |
| No generated artifacts or unrelated scoped files were added. | Final explicit-path Git inventory; `task-log.md` | `git status --short --untracked-files=all -- src/boot/boot_state_slot_flagged_dispatch_lookup.c config/phase8/matching-c.json docs/matching-c/high-value-wave2-20260802` | Expected source, config, and evidence files only. The worker left changes uncommitted. Supported; review pending. |

## Artifact identities

| Artifact | Identity |
|---|---|
| Canonical ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code region | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Original assembly | `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s`; SHA-256 `90B860B2C29E15957BB39D1E17DF7939C205CCC50E94A8F9FD215F36382E6DD2` |
| Matching-C source | `src/boot/boot_state_slot_flagged_dispatch_lookup.c`; SHA-256 `BDEDCC08040A6DB6D45303ACEA8AE652E3A261FB6B63D44064C72F534A81F5A5` |
| Phase 8 configuration | `config/phase8/matching-c.json`; SHA-256 `2A0FA4B1EB460E5DD2AD24459DC35B1876DBD51D44B721031922DE9791F4EDD6` |
| Focused candidate/reference | `focused-proof.json`; both SHA-256 `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31` |
| Focused object `.text` | `focused-proof.json`; SHA-256 `12FEA357E2873AB82DE2314783730C154F7B1B7964FCC9F9E0AD9E69FD994EBE` |
| Phase 8 build report | `build-report.json`; SHA-256 `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004` |
| Phase 8 verification report | `verification.json`; SHA-256 `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B` |
| Reproducibility report | `reproducibility.json`; SHA-256 `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697` |
| Setup report | `build/setup/verify-setup-report.json`; SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The raw focused and Phase 8 artifacts remain outside the canonical repository. The canonical repository contains only the source, configuration, and handoff evidence required by this assignment.
