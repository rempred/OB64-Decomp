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
| RSR-001 | candidate-state-available | high | `battle\battle_loading_or_intro`, `battle\battle_command_prompt`, `battle\battle_active`, `battle\battle_ending_or_results` | Use the broad vanilla battle states to prove battle overlay mapping, active call paths, scheduler/stream state, command UI state, and battle cleanup/results transitions. | 19 combat states are now present and passed static header identity checks on 2026-06-23. Runtime observations are still needed before any behavior or patch safety can be marked proven. |
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
| RSR-012 | satisfied | high | Existing curated states plus request-specific missing captures | Retrospectively triage previous source-owned chunks and patch-workbench artifacts against the curated state catalog: mark requests as served by existing state, still needs capture, or not actionable. | Next source-ownership prompt should run this as a bounded one-shot over already source-owned work, without starting future chunks or speculative emulator work. **Backfill one-shot ran 2026-06-23 (chunks 34-35 prompt); see Backfill Triage section below.** |
| RSR-013 | candidate-state-available | medium | `core-menus\class_change` (6 states), `core-menus\army_management` (7 states) | Promotion / level-up / class-def overlay+register proof for chunks 34-35 code (e.g. `func_002226D4` level-up dispatcher and its callees, `func_0021EBBC` class-change state machine, the many `promotion consumer` / `class-def consumer` functions). Prove overlay/RAM mapping for the combat overlay these run in, and the meaning of the 0x801CE8xx / 0x801D08xx / 0x8018AA8x globals they read/write. | Opened by the chunks 34-35 source-ownership run. Broad class-change/army-management states exist and are the nearest starting points, but no runtime proof was recorded this run (static-only). Needs header-verified state load + register/memory watches. |
| RSR-014 | candidate-state-available | high | Newly populated `battle\*` catalog leaves | Next-run one-shot: examine the newly added combat states against already source-owned past work and patch-workbench artifacts, especially combat/battle code in chunks 30-35, High Attack hook candidates (`0x0021CD48`, `0x0021BF84`), the `0x001F36F0` cleanup-guard site, scheduler/stream state, battle command UI, and reward/results paths. | Do this in the next prompt after the active chunks 34-35 run, not by interrupting the active Claude session. Use existing states only unless Joe asks for new captures; classify static/state-label-only findings as `candidate` or `needs-runtime`, not proven. |

## Combat-State Catalog Update - 2026-06-23

Joe added 19 vanilla Rev 0 combat states under
`C:\Users\Joe\Projects\OgreBattlel64\runtime-states\vanilla\rev0\battle`.
Read-only static header parsing confirmed all 19 match CRC
`E6419BC5/69011DE3`, country `0x45`, version `0`.

Counts:

- `battle\battle_loading_or_intro`: 7 states.
- `battle\battle_command_prompt`: 2 states.
- `battle\battle_active`: 4 states.
- `battle\battle_ending_or_results`: 6 states.

This supersedes the earlier RSR-012 triage note that `battle\*` leaves were
empty. The new states make RSR-001 and RSR-014 `candidate-state-available`, but
they do not prove behavior by label alone. Future proof still needs exact state
path, checked identity, watches/registers/memory ranges, observation result, and
confidence.

## Backfill Triage — 2026-06-23 (chunks 34-35 one-shot, RSR-012)

Bounded static one-shot over already source-owned Rev 0 work (chunks 0-33,
`0x00001000..0x00221000`) and current patch-workbench artifacts, triaged against
the curated catalog. **No runtime states were loaded, captured, or mutated this
run; no emulator sweeps were performed.** Catalog directory was re-inventoried
read-only on 2026-06-23 and matched the then-current documented snapshot (79
`.pj.zip` states; `battle\*` and `data-coverage\*` leaves empty). The battle
portion of this triage was superseded later on 2026-06-23 when Joe added the 19
combat states recorded above.

| ID | Triage | Reason |
| --- | --- | --- |
| RSR-001 | superseded by combat-state update | During the one-shot, `battle\*` leaves were empty. Joe later added 19 combat states, so current status is `candidate-state-available`; runtime proof is still needed. |
| RSR-002 | still-needs-capture | `data-coverage\normal_enemy_squads_loaded` empty. |
| RSR-003 | still-needs-capture | `data-coverage\neutral_encounter_available` empty. |
| RSR-004 | still-needs-capture | `data-coverage\shop_inventory_loaded` empty; `core-menus\shop` (1 state) is only a UI-entry start, not a data-load proof. |
| RSR-005 | still-needs-capture | `data-coverage\map_objects_loaded` and `scenario-map\{enemy_visible_on_map,encounter_prompt}` empty. |
| RSR-006 | still-needs-capture | `data-coverage\{boss_or_special_squad_loaded,recruit_or_event_unit_present}` empty. |
| RSR-007 | served-by-existing-state (broad) / needs-runtime for proof | `core-menus\{army_management(7),class_change(6),unit_list(7)}` can reach the Army Management / Chaos Frame situation for overlay/RAM-mapping and task-buffer questions; the actual guard/watch proof still needs a header-verified runtime run (not done this prompt). |
| RSR-008 | still-needs-capture | `scenario-map\{post_battle_reward,scenario_complete}` empty. |
| RSR-009 | served-by-existing-state (broad) / needs-runtime for proof | `scenario-map\{mission_briefing(8),scenario_map_loaded(9),scenario_unit_selected(5),scenario_unit_moving(1)}` exist for scenario-map source-owned code; lower relevance to chunks 34-35 (combat/promotion). |
| RSR-010 | served-by-existing-state (broad) / needs-runtime for proof | `dialogue-cutscene\{cutscene_active(14),dialogue_box_active(11)}` exist; intersect chunk 33 text/glyph data, not chunks 34-35 directly. |
| RSR-011 | needs-runtime (standing) | Carried High-Attack hooks (z64 `0x0021CD48`, `0x0021BF84`) and the `0x001F36F0` cleanup-guard need an active-battle/streamsplit situation; `battle\*` empty, so unproven. Static metadata is recorded; runtime proof pending. |
| RSR-012 | satisfied (this one-shot) | This triage. |
| RSR-013 | candidate-state-available / needs-runtime | Opened this run for chunks 34-35 promotion/level-up/class-def code; nearest broad states are `core-menus\class_change` + `army_management`; no runtime proof recorded this run. |

Net request-log changes this run: opened **RSR-013**; marked **RSR-012 satisfied**
(one-shot executed); all other rows unchanged in stored status but annotated with
the triage above. No request could be upgraded to `satisfied` via recorded
runtime proof because this run was static-only by instruction.

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

Inspected after the combat-state update on 2026-06-23. These catalog leaves were
empty:

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
