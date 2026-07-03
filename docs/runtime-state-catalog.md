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

## Per-State Index And LOADING-Lane Facts (2026-07-03)

The parent corpus now has a generated per-state index with SHA-256 hashes and
curated capture notes: parent `runtime-states/INDEX.md` (JSON
`wiki/runtime-state-index.json`, generator `tools/gen_runtime_state_index.js`).
Check it before filing a runtime-state request. Operationally proven for
LOADING-transition work (parent `wiki/eset-archive-fetch-trace` series,
2026-07-03): `scenario-map/scenario_map_loaded/From cutscene scenario
LOADING.pj.zip` is the canonical staged-key redirect seed (`LOADING 2` is the
validated backup; `LOADING 3/4` fail redirect — documented non-seeds); drive
transitions with the calibrated card-clear input (wait ~90 frames, then four
spaced `A` pulses) — the older nine-A-plus-one-B recipe can walk into gameplay
menus and is invalid in current timing. Capture/liberation states pop a
"capture card" ~90 frames after load that needs an `A` press before
event-driven follow-ups land (parent `docs/project64-live-watch-sop.md`).

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
- `battle\...`: battle-loading/intro, command-prompt/menu, active-battle, and
  ending/results states. Use these for narrowed combat overlay, active call
  path, battle scheduler/stream state, command UI, reward/results, and
  patch-safety questions.
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
in `docs/runtime-state-requests.md` instead of guessing. A useful request names
the target situation, needed ROM/RAM addresses, watches/registers, expected
screen or scenario, and the proof needed.

Autonomous emulator/runtime work must follow
`C:\Users\Joe\Projects\OgreBattlel64\TestingWorkFlow.MD`. During user-driven
testing, stay passive unless asked: prepare watches, drain logs, capture
artifacts, and wait for Joe's observations.

## Current Coverage Snapshot

Inspected 2026-06-23. Present `.pj.zip` state count: 98.

| Category | Present states | Notes |
| --- | ---: | --- |
| `core-menus` | 31 | Army Management, class change, shop, title/file select, unit list, world-map idle. `training` folder is present but empty. |
| `dialogue-cutscene` | 25 | Cutscene-active and dialogue-box-active states. |
| `scenario-map` | 23 | Mission briefing, scenario map loaded, one unit-moving state, and selected-unit states. |
| `battle` | 19 | Loading/intro 7, command/menu 2, active battle 4, ending/results 6. Static header check on 2026-06-23 matched vanilla US Rev 0 identity for all 19. |
| `data-coverage` | 0 | Folder scaffolds exist for enemy squads, neutral encounters, map objects, recruit/event units, and shop inventory. Needs curated vanilla states. |

Battle leaf coverage:

- `battle\battle_loading_or_intro`: 7 states.
- `battle\battle_command_prompt`: 2 states.
- `battle\battle_active`: 4 states.
- `battle\battle_ending_or_results`: 6 states.

All 19 battle states were checked read-only with the local Project64 savestate
header parser (`tools\project64\pj64.py` `state_identity_from_file`) on
2026-06-23 and matched CRC `E6419BC5/69011DE3`, country `0x45`, version `0`.
This is a header identity check only; behavior still requires watches, register
snapshots, memory reads, or controlled mutation before it can be called proven.

Empty leaf categories at inspection time:

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
