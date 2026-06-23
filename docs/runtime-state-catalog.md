# Vanilla Rev 0 Runtime-State Catalog

This decomp repo does not own savestate files. The curated vanilla Rev 0
Project64 state catalog lives in the parent research workspace:

`C:\Users\Joe\Projects\OgreBattlel64\runtime-states\vanilla\rev0`

Do not move, edit, rename, or delete those states from this repo workflow unless
Joe explicitly asks. Treat the catalog as runtime evidence support for
source-ownership, overlay/RAM mapping, behavior-confidence, and patch-safety
questions, not as a replacement for static source ownership.

## Identity

Current verified identity for all present states:

- Game: Ogre Battle 64 US Rev 0 retail.
- Project64 CRC: `E6419BC5 / 69011DE3`.
- Country: `0x45`.
- Version: `0`.

Agents must still verify savestate headers before use. The catalog identity is a
curation promise, not a license to skip per-run safety checks.

Preferred preflight when Project64 bridge tooling is available:

```powershell
python C:\Users\Joe\Projects\OgreBattlel64\tools\project64\pj64.py --port <port> stateinfo "<path-to-state.pj.zip>"
```

If loading a state into Project64, use the warning-aware load path from the same
tooling. Do not force or header-patch a state unless the task explicitly calls
for that and the run records why.

## How To Choose A State

Pick the nearest broad runtime situation, then prove the specific fact with
watches, register snapshots, memory reads, or controlled mutation:

- `core-menus\...`: title, file select, world-map menus, Army Management,
  unit list, class-change, shop, and related UI/task-buffer questions.
- `dialogue-cutscene\...`: text boxes, choices, scripted cutscenes, travel/map
  path cutscenes, and cutscene display-list/state questions.
- `scenario-map\...`: mission briefing, scenario map loaded, selected/moving
  units, and scenario-world overlay questions.
- `battle\...`: intended location for battle-loading, command-prompt,
  active-battle, and ending/results states, but currently empty.
- `data-coverage\...`: intended location for data-table proof states such as
  loaded enemy squads, neutral encounters, map objects, recruit/event units, and
  shop inventory, but currently empty.

State filenames and folder names are convenience labels only. They are useful
for finding a likely starting point, but they are not semantic proof. A state
named for a screen or situation does not prove that a function is active, that a
RAM address has a given owner, or that a patch site is safe.

## Recording Runtime Observations

When a source-ownership run uses a runtime state, record the observation in the
chunk dossier, review handoff, and any patch-workbench JSON it affects. Include:

- Exact state path.
- ROM identity: CRC pair, country, version, and whether it matched the running
  ROM.
- Project64 mode/bridge details when relevant.
- Exact ROM and RAM addresses inspected.
- Watchpoints, breakpoints, memory ranges, registers, and frame or event ranges.
- What was observed, what was not observed, and confidence.
- Whether the evidence proves behavior, merely supports a candidate, rejects a
  static lead, or remains `needs-runtime`.

Runtime evidence can upgrade confidence for overlay/RAM mapping, active call
paths, register meanings, behavior tags, and patch-safety questions. It should
not broaden the static source-ownership range, replace byte-exact rebuild gates,
or turn static-only claims into proven behavior.

If no state reaches the needed situation, record a precise runtime-state request
instead of guessing. A useful request names the target situation, needed ROM/RAM
addresses, watches/registers, expected screen or scenario, and the proof needed.

Autonomous emulator/runtime work must follow
`C:\Users\Joe\Projects\OgreBattlel64\TestingWorkFlow.MD`. During user-driven
testing, stay passive unless asked: prepare watches, drain logs, capture
artifacts, and wait for Joe's observations.

## Current Coverage Snapshot

Inspected 2026-06-23. Present `.pj.zip` state count: 79.

| Category | Present states | Notes |
| --- | ---: | --- |
| `core-menus` | 31 | Army Management, class change, shop, title/file select, unit list, world-map idle. `training` folder is present but empty. |
| `dialogue-cutscene` | 25 | Cutscene-active and dialogue-box-active states. |
| `scenario-map` | 23 | Mission briefing, scenario map loaded, one unit-moving state, and selected-unit states. |
| `battle` | 0 | Folder scaffolds exist for loading/intro, command prompt, active battle, and ending/results. Needs curated vanilla states. |
| `data-coverage` | 0 | Folder scaffolds exist for enemy squads, neutral encounters, map objects, recruit/event units, and shop inventory. Needs curated vanilla states. |

Empty leaf categories at inspection time:

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

