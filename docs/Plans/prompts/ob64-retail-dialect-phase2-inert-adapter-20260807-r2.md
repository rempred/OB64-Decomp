---
task_id: ob64-retail-dialect-phase2-inert-adapter
revision: 2
status: completed
role: worker
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: 1c3d7093d091473a85033743eb068a22
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.claim.json
depends_on:
  - eace7a5b63febfff0f3a53934e730cdedc4f33b6
  - 39c4cc1a3bb5a62ed171032469362760a9a35c5c
supersedes: ob64-retail-dialect-phase2-inert-adapter revision 1
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 39c4cc1a3bb5a62ed171032469362760a9a35c5c
current_agents_overrides_prompt: true
---

# Phase 2 worker assignment revision 2: inert compiler-assembly dialect adapter

## Outcome required

Complete the inert adapter implementation assigned by revision 1.

Revision 2 corrects only the authenticated `HYBRID_C` APP-marker boundary.

No C or assembly source may change. Every current owner must retain exact bytes and classification.

## Required reading

Read `AGENTS.md`, parent `docs/Worker-workflow.md`, this revision, and the superseded revision 1 prompt in full.

Read sections 8 through 11 of:

`C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-221529b0a843423c851d6fa32e751460\retail-assembler-dialect-investigation-20260807.md`

Use the read-only terminal-APP finding delivered by `/root/terminal_app_boundary`.

## Corrected dispatch contract

Classify every target before compilation.

`UNKNOWN` must reject before adaptation.

`HYBRID_C` compiler assembly is opaque byte-identical passthrough.

The adapter parser must not inspect, validate, or rewrite hybrid syntax.

Hybrid proof checks must require equal raw and adapted bytes, equal SHA-256 values, and zero transformations.

APP-marker diagnostics may be recorded for hybrid output. They must not gate passthrough.

EOF may end compiler output while APP mode remains active. A literal final `#NO_APP` is not required for hybrid output.

`PURE_C` must reject any `#APP` or `#NO_APP` marker before parsing moves.

Only marker-free `PURE_C` output may enter the numeric-GPR move parser.

This correction replaces revision 1's balanced-marker requirement and its hybrid unbalanced-marker negative fixture.

All other revision 1 requirements, prohibitions, gates, expected surfaces, evidence records, stop conditions, and handoff rules remain mandatory.

## Required corrected fixtures

- Preserve authentic `func_0002CD70.compiler.s` as hybrid passthrough with five APP and four NO_APP markers.
- Preserve authentic `func_0025C8A4.compiler.s` as hybrid passthrough with one APP and no NO_APP marker.
- Reject any hybrid adapted-byte mutation, hash mismatch, or nonzero transformation count.
- Reject APP-only, NO_APP-only, balanced APP/NO_APP, and terminal APP-to-EOF inputs classified `PURE_C`.
- Reject `UNKNOWN` before parser entry.

The `func_0002CD70` target must retain SHA-256 `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

Its words at function-relative offsets `+0x004` and `+0x028` must remain `0x00801025`.

## Provenance for the correction

- KMC `cc1.exe` SHA-256: `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
- Compiler manifest SHA-256: `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`.
- `func_0002CD70.compiler.s` SHA-256: `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969`.
- `func_0025C8A4.compiler.s` SHA-256: `2F5732577B0A3F9D4B4BA470F90D6D8D6A1E5BBABF94AB50002B7F5CA2E4D095`.
- GNU assembler 2.39 SHA-256: `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697`.

Authenticated GCC sources show file-scope assembly enabling APP mode without a forced disable.

GNU assembler treats APP markers as preprocessing-mode switches, not nested block syntax.

## Fresh activation

Create the revision 2 claim before technical writes:

`docs/Plans/task-logs/ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.claim.json`

Create the revision 2 task log:

`docs/Plans/task-logs/ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.md`

Preserve revision 1's frozen claim and task log.

Use host ID `codex-desktop-current`, receiving task ID `/root/phase2_worker`, Director task ID `ob64-retail-dialect-implementation-director`, and Director collaboration ID `/root`.

Return the completed or blocked result to `/root`. Do not commit or start Phase 3.
