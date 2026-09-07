# Compilation-group implementation log

Completed implementation of the accepted r1 design and r2 raw metadata correction; final audit passed. No group production activation is authorized.

Starting main HEAD: `5c0507e44035c2d9bfbd86e6bd5be67ffdce8a77`. Assignment `compilation-groups-implementation`, revision 1, launch `COMPILATION-GROUPS-IMPLEMENTATION-20260906-01`. Worker `/root/compilation_groups_design`; Director `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local.

The complete claim was created atomically before other writes. Existing retrieval/review claims and reports are disjoint. Normal Git inventory warned about inaccessible global-ignore/cache paths. Production sources, active target/linkage records and owner boundaries remain read-only.

Plan: implement and test the native producer/projection contract first, then integrate all production consumers, then exercise focused fixtures and routine tests. Run one final changed-input structural audit after the implementation is complete. Strongest risks are section-symbol/addend semantics, stale member evidence and per-target compiler assumptions.

## Implemented scope

The implementation separates one authenticated compilation producer from each accepted function owner. The new schema-1 registry is empty. Group admission resolves every ordered member against the accepted structural model, requires contiguous ROM/RAM placement in one overlay/load context, checks complete functions/text/relocations and admits only final native alignment tail. No production C/ASM, active target/linkage/multi-owner record or structural owner was changed.

`tools/lib/compilation_groups.js` owns the strict registry, binding, raw/projected/stripped census, deterministic projection, shared compiler producer, member evidence and manifest expansion/collapse. `elf_text_split.js` gains a distinct byte-preserving native projection entry point: section metadata changes, instruction bytes and encoded relocation addends do not. Each old owner still has its own physical output section and one-section PT_LOAD mapping. The original group-base section symbol stays anchored to the first owner; relocation places are rebased. Cross-owner HI16/LO16 pairing and unsupported relocations reject.

Affected consumers are active_targets, source_policy, phase8_matching_c, text_contract, current_workflow, diff_object_cache, build_phase8_matching_c and status. A complete translation unit is classified/preprocessed once per group. Every member inherits that class and receives separate ownership, public entry, fallback exclusion, relocation and byte proof. One producer object is linked and cached once; complete ordered member records are mandatory. The requested diff member forces the complete group fresh. CURRENT strict reproduction compiles the producer anew; caches do not establish final matching acceptance. Producer counts are displayed separately from function counts.

The raw/projected `.reginfo` contract is exactly the accepted r2 shape and reference closure. Projection preserves its payload; the pinned ancillary remover must eliminate it before link. No other uncontracted nonempty allocation or COMMON is admitted. Compiler assembly is unchanged and object projection is independently parsed and reproduced. Pinned GNU 2.6 objcopy changes ELF e_flags from observed raw/projected 0x10001001 to stripped 0x10000000; projection flags must agree, all headers are recorded, and fresh tool reproduction authenticates the stripped container. An initially added raw/stripped flag equality failed a real focused test and was removed as unsupported; no accepted invariant required that equality.

## Schema and supported scope

Group registry schema 1, group textContract schema 2, group objectEvidence schema 3 and producerStages schema 1 are new. Legacy representation schemas retain their meanings. CURRENT fingerprint version 7 and diff-cache schema 4 invalidate old reuse. Build accepted-input identity now requires the group registry, so older reports cannot silently omit it. Outer existing build/audit schema versions remain unchanged. Contract documentation is in WORKFLOW, SOURCE_POLICY and AUDIT.

The first mode deliberately rejects auxiliary owners, multi-owner continuations, local-multifunction combinations and noncontiguous/group-interior padding. Existing independent legacy modes remain available. The standalone candidate workbench rejects grouped targets until complete-group candidates are supported. Existing historical audit migration canaries remain pinned to their accepted standalone sources. Later activation of a group is separate source-wave work; no new matching target is accepted here.

## Focused and routine evidence

- `node tools/test.js`: final pass, 16/16 suites in 35.3 seconds. Log: `build/compilation-groups-implementation-r1/routine-final.log`.
- `node tests/compilation_groups.js`: independent authored PURE_C call/address and zero-tail translation units; native sizes 80 and 16 bytes, terminal tails 8 and 0, four and zero load relocations. Split/unsplit links agree at two RAM placements with carry-sensitive external address; compiler/cache member artifacts agree; requested second member compiles one producer and real cache miss/hit preserves both members. Final 37+31 rejection assertions include every raw metadata shape field, payload drift, extra allocations, metadata symbols/references, text/tail/relocation changes, stale registry and producer evidence, missing/duplicate/reordered/forged manifest member counts. Report: `build/compilation-groups-implementation-r1/focused-7sG31m/report.json`.
- `node tests/compilation_groups_phase8.js`: ignored pose research source plus existing art-native target through shared model binding, authenticated classification, producer compilation, manifest/link/layout, strict source object proof and complete-ROM verification. Six PURE_C target results, one group object; exact 40 MiB ROM. Output: `C:/Users/Joe/.codex/ob64-compilation-groups-implementation-20260906-r1/pose-TdmhwS`; log `build/compilation-groups-implementation-r1/mixed-phase8.log`. The fixture does not edit the production registry. An earlier pose-only version also passed.
- `node tests/native_text_tail.js`: PASS, exact complete ROM and 22 retained malformed-evidence/raw/link/cache mutations; output `C:/Users/Joe/.codex/ob64-decomp-current/nt-E0SMzn`, log `build/compilation-groups-implementation-r1/native-regression.log`.
- `node tests/multi_owner_text.js`: PASS including intended illegal assembler rejection; log `build/compilation-groups-implementation-r1/legacy-multi-owner.log`. Routine active-target tests preserve existing multi-function and mode exclusions.
- `git diff --check`: pass (line-ending notices only). Read-only comparison against launch HEAD shows no differences under src, asm or existing active target/linkage/multi-owner configs.

An early cache producer identifier check rejected the new hyphenated group key; its dedicated bounded group identifier validator was corrected and real miss/hit tests pass. A routine run failed only the unsupported ELF flag equality described above; the final complete routine rerun passes. Initial full fixture authentication failed under the sandbox SID's Git ownership check; approved escalated runs use existing authenticated setup without changing trust configuration. Existing global Git-ignore/cache access warnings remain; this report makes no unrestricted clean-tree claim.

## Tool identity and final structural verification

Starting accepted production baseline was 497181d, unchanged through launch HEAD 5c0507e44035c2d9bfbd86e6bd5be67ffdce8a77. Starting trees: tools b24c110a143e5be2535bf9d5fe0323cdc45a80d4, config 4da1aa153aaf69f7f3cc712c527ee295f1ac2498, tests 7d7f0bd3e53ee606b38004e1618950ec010e9f48. Parent documentation commits proceeded concurrently in disjoint paths.

Authenticated compiler SHA-256: F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6. GNU binutils 2.6 source commit: 54514ded39ceb32165a125ddba04ca5b551773a2. Full tool and dependency identities are retained in generated focused and final verification evidence.

One final changed-input `node tools/audit.js` was launched after all implementation/test changes. No redundant final build preceded it. Its terminal result will be recorded below before release.

## Terminal result and release

Completed: `node tools/audit.js` returned exit 0 and AUDIT PASS at 2026-09-07T00:07:07.627Z. Structural protections, CURRENT full-ROM verification and fresh compilation pass. CURRENT fingerprint: 6CD705C5F9B66EC2FDE7C2D3504D79B04318B4B907B8D5006E8AAD13197C1A70. Output: `C:/Users/Joe/.codex/ob64-decomp-current/current/6cd705c5f9b66ec2fde7c2d3/build`. All 564 active targets retain generated classes 499 PURE_C, 65 HYBRID_C, zero ASM/UNKNOWN. Exact ROM: 41,943,040 bytes, SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. This is one final audit, with no audit retry or redundant build.

Evidence SHA-256:

- `build/audit/report.json`: C84FC8504ACB9E0C3FBD9495BA86A82AD380B2DDEE6F1E5B789D12A46CC4CD70
- `build/current/verification.json`: 2A837B56D02452A333704C31DBB70334831F7F7C6BD181A0F58FF1F4F64A6FAF
- `build/current/fresh-compilation.json`: 3C70064F8B11167109705110D991E360DF75453D81BB435FA488FB1E583B1A6D
- `build/setup/verify-setup-report.json`: D1C16E156BC6201E3C523953C2A39D6BEEFA4FC0D376F48AF57203E26FBA50DC
- Empty registry: C1DD4D66A62ED91ED83616E310ADE37F2D22FF11C55225D7B8BF3A6F23F04834

Exact owned changed paths for freezing:

- config/matching-c-compilation-groups.json
- tools/lib/compilation_groups.js
- tools/lib/elf_text_split.js
- tools/lib/active_targets.js
- tools/lib/source_policy.js
- tools/lib/phase8_matching_c.js
- tools/lib/text_contract.js
- tools/lib/current_workflow.js
- tools/lib/diff_object_cache.js
- tools/build_phase8_matching_c.js
- tools/status.js
- tools/test.js
- tests/compilation_groups.js
- tests/compilation_groups_phase8.js
- docs/WORKFLOW.md
- docs/SOURCE_POLICY.md
- docs/AUDIT.md
- docs/Plans/task-logs/compilation-groups-implementation-r1.md
- docs/Plans/task-logs/compilation-groups-implementation-r1.claim.json

All production and report writes are released to Director for freezing and independent implementation review. No implementation blocker remains. Independent structural/tooling review remains required before source-wave activation; the production group registry remains empty. Other agents' disjoint untracked claims/reports are not part of this handoff. No agent, branch/worktree, stage, commit or push was created by this worker.
