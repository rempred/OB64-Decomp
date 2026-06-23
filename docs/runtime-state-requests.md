# Runtime-State Requests

This is the Joe-facing backlog for vanilla Rev 0 runtime states and runtime
proof requests that would improve source ownership, patch-workbench metadata, or
future ROM patch safety.

The curated state catalog lives outside this decomp repo:

`C:\Users\Joe\Projects\OgreBattlel64\runtime-states\vanilla\rev0`

The catalog usage guide is `docs/runtime-state-catalog.md`.

## Maintenance Rules

- Do not guess when a needed runtime situation is missing. Add or update a
  request here.
- Do not delete resolved requests. Mark them `satisfied` or `superseded` and
  keep the evidence path.
- State names are convenience labels, not proof. A request is satisfied only by
  a checked state path plus recorded observations, watches, register/memory
  evidence, or controlled mutation when needed.
- Before using a state, verify the header identity. Current expected identity
  is vanilla US Rev 0 Project64 CRC `E6419BC5/69011DE3`, country `0x45`,
  version `0`.
- Autonomous emulator/runtime work must follow
  `C:\Users\Joe\Projects\OgreBattlel64\TestingWorkFlow.MD`. User-driven testing
  should stay passive unless Joe asks.
- Source ownership remains primary. These requests should support narrowed
  questions: overlay/RAM mapping, register meaning, active call paths, behavior
  confidence, data layout, and patch safety.

## Status Values

- `needs-capture`: no suitable curated state exists yet.
- `candidate-state-available`: a broad existing state may be enough, but proof
  has not been recorded.
- `needs-runtime`: a state exists or can be created, but runtime proof is still
  required.
- `satisfied`: exact state path and proof are recorded.
- `superseded`: replaced by a better request or no longer needed.

## Open Requests

| ID | Status | Priority | Needed state or nearest catalog slot | Request / proof needed | Notes |
| --- | --- | --- | --- | --- | --- |
| RSR-001 | needs-capture | high | `battle\battle_loading_or_intro`, `battle\battle_command_prompt`, `battle\battle_active`, `battle\battle_ending_or_results` | Curate broad vanilla battle states that can prove battle overlay mapping, active call paths, scheduler/stream state, command UI state, and battle cleanup/results transitions. | Current `battle` catalog is empty. Blocks better confidence for High Attack streamsplit style patch sites and battle-path source ownership. |
| RSR-002 | needs-capture | high | `data-coverage\normal_enemy_squads_loaded` | Capture a state with normal enemy squads loaded so agents can prove loaded EDAT/enemy-squad RAM layout, runtime squad selectors, and placement assumptions. | Supports raw squad placement safety, squad runtime hook work, and data table ownership. |
| RSR-003 | needs-capture | high | `data-coverage\neutral_encounter_available` | Capture a state where a neutral encounter can be inspected before and during load, with watches for encounter table reads and selected encounter data. | Supports neutral encounter table ownership and patch-safety checks. |
| RSR-004 | needs-capture | medium | `data-coverage\shop_inventory_loaded` plus existing `core-menus\shop` as a possible starting point | Prove where shop inventory rows are loaded/read in RAM, including exact source table ranges, registers, and menu update paths. | A shop menu state exists, but the data-coverage slot is empty. |
| RSR-005 | needs-capture | high | `data-coverage\map_objects_loaded`, `scenario-map\enemy_visible_on_map`, `scenario-map\encounter_prompt` | Capture states that show loaded map objects, visible enemy units, and encounter prompts with watches for object/squad descriptor reads. | Supports map-object placement, raw squad placement caveats, and scenario-map data ownership. |
| RSR-006 | needs-capture | medium | `data-coverage\boss_or_special_squad_loaded`, `data-coverage\recruit_or_event_unit_present` | Capture states that expose special squads, boss units, recruits, or event units in loaded RAM and prove which source rows feed them. | Useful for special-case data fields and future editor safety. |
| RSR-007 | candidate-state-available | medium | `core-menus\army_management`, `core-menus\class_change`, `core-menus\unit_list` | Build a small verified state set for Chaos Frame / Army Management patch safety: Army Management entry, class-change transition, return to Army Management, and watch evidence for task/list buffers and guard assumptions. | Existing menu states likely cover part of this, but exact state paths and watches must be recorded before marking satisfied. |
| RSR-008 | needs-capture | medium | `scenario-map\post_battle_reward`, `scenario-map\scenario_complete` | Capture post-battle reward and scenario-complete states to prove reward/transition paths, branch flags, and scenario status writes. | Current folders exist but are empty. |
| RSR-009 | candidate-state-available | medium | `scenario-map\mission_briefing`, `scenario-map\scenario_map_loaded`, `scenario-map\scenario_unit_selected`, `scenario-map\scenario_unit_moving` | For already source-owned scenario-map code, identify which existing broad states can answer overlay/RAM mapping and active-call-path questions, then record exact state paths and proof or downgrade to more specific requests. | Intended for retrospective source-ownership review without speculative testing. |
| RSR-010 | candidate-state-available | low | `dialogue-cutscene\dialogue_box_active`, `dialogue-cutscene\cutscene_active` | Use existing dialogue/cutscene states to prove narrowed text/script/display-list paths when source-owned functions naturally intersect these systems. | Do not use labels alone as proof; require watches or memory/register evidence. |
| RSR-011 | needs-runtime | high | Existing curated states if sufficient; otherwise exact missing category per hook | For patch-workbench hook candidates, record original words, displaced instructions, likely resume addresses, delay-slot/prologue/epilogue hazards, and runtime proof of active path/register assumptions before marking any hook proven. | This is a standing proof request for candidate hook sites harvested during source ownership. |
| RSR-012 | candidate-state-available | high | Existing curated states plus request-specific missing captures | Retrospectively triage previous source-owned chunks and patch-workbench artifacts against the curated state catalog: mark requests as served by existing state, still needs capture, or not actionable. | Next source-ownership prompt should run this as a bounded one-shot over already source-owned work, without starting future chunks or speculative emulator work. |

## Recording A Satisfied Request

When a request is satisfied, update its row and add a short note below this
section with:

- Request ID.
- Exact state path.
- Checked ROM identity.
- Project64/bridge/tooling details.
- ROM/RAM addresses, watchpoints, registers, and memory ranges.
- Observation result and confidence.
- Files updated, such as dossiers, review docs, or
  `docs/patch-workbench/rev0/*.json`.

## Missing Catalog Categories At Last Inspection

Inspected 2026-06-23. These catalog leaves were empty:

- `battle\battle_active`
- `battle\battle_command_prompt`
- `battle\battle_ending_or_results`
- `battle\battle_loading_or_intro`
- `core-menus\training`
- `data-coverage\boss_or_special_squad_loaded`
- `data-coverage\map_objects_loaded`
- `data-coverage\neutral_encounter_available`
- `data-coverage\normal_enemy_squads_loaded`
- `data-coverage\recruit_or_event_unit_present`
- `data-coverage\shop_inventory_loaded`
- `scenario-map\encounter_prompt`
- `scenario-map\enemy_visible_on_map`
- `scenario-map\post_battle_reward`
- `scenario-map\scenario_complete`
