# Subsystem: Map-Unit AI / ESET Deployment Runtime (Rev 0)

Curated fact import from the parent research workspace (2026-07-03), per the AGENTS.md import
rule: every claim cites its parent source doc or artifact. Only promotion-grade facts are here —
each carries an evidence grade. Grades: **[live]** = runtime trace captured; **[edit]** =
controlled mutation proof (patched input, predicted+observed output change); **[code+multi]** =
static decode validated against multiple independent runtime cases. Facts below the bar
(candidates, hypotheses) are listed in "Explicitly NOT promoted" at the end.

Primary parent references: `docs/enemy-system.md` ("Map-unit object + dispatcher reference"
section + dated 2026-07-01..03 bullets), `docs/research-workflow.md`, per-claim artifacts under
`wiki/` as cited, AARs under `wiki/after-action-reports/` (20260702/03 scenario series).

## Overlay / VRAM mapping (overlay-aware addressing — extends the boot-only linear rule)

| module | ROM range (observed) | live delta | proof |
|---|---|---|---|
| early boot (already known) | low ROM to ~0x2F000 | `+0x8006FC00` | repo Watch Item |
| map-AI overlay | `0x00101000..0x00130000` | `+0x800AB8C0` | [live] dozens of PC attributions, e.g. dispatcher ROM `0x00105EA0` = live `0x801B1760` (parent `wiki/runtime-eset-natural-wake-key1-runA.json`) |
| scenario loader module | `~0x00195000..0x00197800` | `+0x8007FB70` | [live] builder trace ROM `0x196F84` = live `0x80216AF4` (`wiki/runtime-eset-route-descriptor-builder-trace-key20-summary.md`); loader call PC `0x8021697C` = ROM `0x00196E0C` (`wiki/eset-archive-fetch-trace.json`) |
| helper module (contains `0x8021590C`) | signature at z64 `0x0017282C` | `+0x800A30E0` | [live] first-bytes signature match (`wiki/eset-archive-fetch-trace.json`); single-site match — verify per new address before generalizing |

Trap (proven twice): the asm comment column in `asm/original/rev0/lib/*.s` is the NOMINAL linear
mapping. Exec-watching a linear-mapped address for overlay code produces false negatives — the
parent's `[13..15]`-reader "absent" result was exactly this failure, later refuted live
(`docs/enemy-system.md` 2026-07-02 S1.4 supersession note).

## Function identities (evidence-based names)

| autogen | ROM | proposed name | behavior (one line) | grade + proof |
|---|---|---|---|---|
| `func_001960A8` | `0x001960A8..0x00197734` | `Scenario_LoadEsetDeployment` | Parses staged ESET via container ptr table `0x800E7A90`, builds map-unit objects, per-row helper call at `0x196E0C` (args = Section1 `[0],[13],[14],[15]`), clears active bit for normal-source kind-2 start nodes (dormant spawns), builds route descriptors at `0x196F84..0x1971B8` | [live]+[edit] `wiki/eset-dormancy-static-analysis.md` (48/48 keys 17/20/21), `wiki/runtime-eset-route-descriptor-builder-*`, `wiki/eset-archive-fetch-trace.json` |
| `func_00120BBC` | `0x00120BBC..` | `MapUnit_PlaceAtSpawn` | Placement helper: writes position from selector/coordinate source, sets word0 bit `0x1` (`0x120C7C`), inits phase floats `+0x18/+0x1C`, home tile `+0x64` | [live] `wiki/runtime-eset-placement-writer-key06-summary.md` |
| `func_00105CC0` | `0x00105CC0..` | `MapUnit_UpdateDispatch` | Per-object update dispatcher: wake-request path A (word0 bit29, `0x105D4C..74`), dormant path B (resolver call `0x105DA4`, node stores `0x105E30`/`0x105EA0`, wake at `0x105EA4`), group-consumer call `0x106724`, active-count increment `0x105E44..54` | [live] R4 natural wake: path-B store live `0x801B1760` = ROM `0x105EA0`, wake `$ra 0x801B176C` (`wiki/runtime-eset-natural-wake-key1-runA.json`) |
| `func_00121DA8` | `0x00121DA8..` | `MapUnit_Wake` | Wake primitive: requires word0 bit `0x10`; sets bit `0x1` (store `0x121DD4`), ORs `0x04` into source-record byte1 (`0x801971F1 + id*25`), clears `+0x91/+0x92` | [live] multiple runs incl. natural wake f252 and operator-flip wake f116 (`wiki/runtime-eset-natural-wake-key1-runB-b11flip-u16.json`) |
| `func_001237F0` | `0x001237F0..0x00123E38` | `EsetGate_ResolveKind2` | Section 2/3 gate resolver for kind-2 nodes; compound grammar (see struct notes): op0 single, op1 branch-choice (A→`[16]`, else B→`[17]`), op2 AND, op3 OR; second-evaluator false branch `0x123C10` | [live]+[edit] both directions: suppression reproduced + one-byte operator flip woke the unit (`wiki/eset-resolver-kind2-branch-map.json`, runB clean-repeat + b11flip-u16 artifacts) |
| `func_0012BC64` | `0x0012BC64..0x0012C784` | `MapUnitGroup_MoveConsumer` | Formation/group movement: kind-2 first-activation `+0xBA` store `0x12C4F4` guarded `(word0&0x81)==0`; phase-rotated vector projection (angle=phase*2π, scale×0.8, chain rows `0x01FF/0x02FF`); moving-bit writer `0x12C39C` | [live]+[code+multi] `wiki/runtime-eset-movement-consumer-trace-matrix-summary.md`, `wiki/eset-vector-projection-analysis.md`, `wiki/route-active-easing-static-analysis.md` |
| `func_0012B440` | `0x0012B440..` | `MapUnit_StepTowardTarget` | Easing helper: advances toward target with `0.005f` capped step | [code+multi] `wiki/route-active-easing-static-analysis.md` (key28/32 exact, key33 in-flight residuals) |
| `func_001094BC` | `0x001094BC..` | `MapUnit_RecountActive` | Counts active normal-source non-player objects; caches byte at `0x801F0FDE`; passes count to Section 3 transfer | [live]+[edit] countdrop intervention 14→4 (`wiki/runtime-eset-pattern5-activation-probe-key20-countdrop-remnant4.json`) |
| (setter pass) | `0x0010A718..0x0010AD70` | `EsetSched_SetLatches` | Section 3 scheduler setter: per-kind dispatch via jump table (live `0x801EE118`, kinds 1..19), sets latch bits `0x801F0EBC` | [code+multi]+[live] kinds 1/4/8/9/0x0C latch captures (parent enemy-system 2026-07-01/02 bullets) |
| (transfer pass) | `0x0010ADB8..0x0010B030` | `EsetSched_TransferLatches` | Latch→evaluator transfer via jump table (live `0x801EE168`); evaluator bitset `0x801F0EBA` | same as above |
| `func_0012DA10` | `0x0012DA10..` | `SourceUnit_IsValid` | Validity helper: reads object/source byte `+0x04`, member records around `0x801971F2`, rejects member id 0 or ≥100, checks tables `0x80193BD8`/`0x80195578`; does NOT read word0 | [code+multi] `wiki/movement-ai-function-dossiers.md` |
| (site recompute) | writers `0x0010EC44`, `0x0010EC80` | `SiteRecord_UpdateFlags` | Reads `siteIndex = u32[0x801F0E04]`; on row `0x801951CC + idx*36` clears halfword0 bit `0x0004` then sets `0x0002` | [live]+[code+multi] `wiki/site-record-decode.json`, runC capture `0x000D→0x0009→0x000B` (`wiki/runtime-eset-natural-wake-key1-runC.json`) |
| (record builder) | hook point `0x0019554C` | `SquadRecord_Build` (region) | Builds the 52B runtime squad record from the 35B edat template (`a1` = template ptr at hook) | [edit] in-game substitution hook proof (parent `docs/runtime-override-rom-plan.md`, enemy-system "HOOK FOUND") |
| (resident leaves) | I: live `0x800900C0`, D: live `0x80090010` | `Cache_InvalidateI` / `Cache_InvalidateD` | `(a0=start, a1=len)`; clobber `$at,$t0-$t3` only; called by resident resource loader (RAM `0x800761E4..0x80076324` = ROM `0x65E4`) before PI DMA to executable destinations | [live] register trace `wiki/overlay-dma-source-map/20260628-223030-requester-cache/cache-coherency-audit.json` |
| `func_00119454` | `0x00119454..` | (no name promoted) | Scripted activator: wake + `+0xBA=1` on object at global ptr `0x801F0D2C` — **code-certain semantics but never observed firing live**; name deferred | [code only] parent dossiers; exec-watched silent in all sampled windows |

## Data labels (verified)

| address (live) | name | layout | grade + proof |
|---|---|---|---|
| `0x801F1080` | `gMapUnitPool` | 50 × `0xC0`; index == ESET sourceId; low ids `0x00..0x1D`, normal `0x1E..0x31`; code also addresses slot 30 via base `0x801F2700` (= `+30*0xC0`) | [live]+[code+multi] `wiki/eset-capacity-static-analysis.md` |
| `0x801F0CB0` | `gMapUnitPtrTable` | 50 × 4 (second base `0x801F0D28` = entry 30) | same |
| `0x801F367C` | `gMapUnitActiveIterBound` | u32, dynamic iterator bound over ptr table | same |
| `0x801971F0` | `gSourceUnitRecords` | stride 25; byte1 bit `0x04` set by wake | [live] wake captures |
| `0x801F0E18` | `gEsetSection3` | count + 16 × 10 (hard cap: abuts bitsets) | [code+multi] capacity/atlas |
| `0x801F0EBA` / `0x801F0EBC` | `gEsetEvaluatorBits` / `gEsetLatchBits` | u16 each | [live] many captures |
| `0x801F0EBE` | `gEsetSection2` | 16 × 18 (hard cap: abuts `0x801F0FDE`; node ids `0x04..0x13`) | [code+multi]+[edit] |
| `0x801F0FDE` | `gActiveNormalSourceCount` | u8 | [live]+[edit] countdrop |
| `0x801F0E04` | `gSiteUpdateIndex` | u32, input to `SiteRecord_UpdateFlags` | [live]+[code+multi] |
| `0x801951CC` | `gSiteRecords` | stride 36; name string at `+0x08`; halfword0 = dynamic flag bits (`0x0004`/`0x0002` toggled by recompute; NOT plain ownership — semantics open) | [live] runB/runC site tables |
| `0x801969B8` | `gRouteDescriptors` | 10 × 11: `[0]` group id, `[1]` flags, `[2..6]` source ids (0xFF sentinel), `[8]` pattern, `[9]` aggregate move type, `[10]` 11−len | [live]+[code+multi] descriptor atlas 26/26 |
| `0x801EACE0` / `0x801EB118` | `gFormationVectors` / `gFormationMemberOrder` | static tables consumed by MoveConsumer | [code+multi] vector projection analysis |
| `0x80186FBC` | `gMoveTypePriority` | `[7,2,6,3,5,4,1]` (class-def B32 aggregation) | [code+multi] descriptor atlas |
| `0x800E7A90` | `gScenarioResContainers` | pointer table: eset container slot consumed by the loader; `+0xC` (`0x800E7A9C`) = selector container (key30 → `0x802279D0`) | [live] `wiki/eset-archive-fetch-trace.json`, `wiki/selector-table-rom-source.json` |
| `0x801F0D2C` | (scripted-wake target ptr) | code-derived only — no live observation; not promoted as a stable name | [code only] |

z64 static sources: ESET archives #752-814 at `0x0274783E+` (fetch live-verified for keys 6/30:
`0x02747D90` #758, `0x02749AC3` #780, matching the parent archive catalog exactly); shared
placement-resources region `0x02625000..0x02628000` (59/64 literal bounds records AND the key30
selector table at `0x02626DFB`, entry = `base+0x1C+(sel-1)*8`, BE f32 X,Z — validated 7/7 on
key30, second-key validation pending).

## Struct notes (proven fields only — sketches for future include/ promotion)

- **MapUnitObj (0xC0):** `+0x00` u32 status word0 — proven bits: `0x1` active, `0x8`
  player-flagged, `0x10` wakeable (wake gate; stripped by 0xFF-terminal), `0x40` follower, `0x80`
  anchor, `0x1000` blocks dormant path, `0x4000` forces pattern 0 (first source), `0x40000`
  moving (transient), `0x800000` has-destination, `0x08000000` path-B skip, `0x20000000` wake
  request. `+0x04` sourceId<<24; `+0x08/+0x10` X/Z f32; `+0x14` map/tile; `+0x18/+0x1C` phase
  f32; `+0x28..` waypoint triple; `+0x4C..` dest triple; `+0x74` selector−1 (−1 = coordinate
  row); `+0xBA` current Section 2 node id. (Full bit/offset table with per-bit evidence: parent
  `docs/enemy-system.md` "Map-unit object + dispatcher reference".)
- **EsetSection2Node (18):** `[0]` node id (`0x04`+row), `[1]` kind (vanilla ∈ {0,1,2}; resolver
  dispatches only on 2), `[2]` subtype, `[10]` gate extra A, `[11]` operator {0 single, 1
  branch-choice, 2 AND, 3 OR}, `[12]` gate extra B, `[16]` op1 alternate next-node, `[17]` next
  node (`0xFF` = terminal camp: parks unit AND strips wakeable bit — one-way). Census: 565
  vanilla nodes, operators {0:428, 1:8, 2:54, 3:75}, 137/137 extraB refs valid.
- **EsetSection3Extra (10):** `[0]` extra id (1-based bit index), `[1]` kind, `[2..9]` payload.
  Live-proven kinds: `0x01` player-in-rect, `0x04` player-at-site (`+0x74==payload−1`), `0x08`
  object-in-rect+sourceId, `0x09` remnant-count ≤N, `0x0C` site-flag `0x0004` test.
- **SourceUnitRecord (25):** byte1 bit `0x04` = wake-activated. Other fields not promoted.
- **EsetFile:** header stream dir (`[4..5]` sec2 off, `[6..7]` sec3 off, count low byte at
  `+0x0F`), Section 1 rows 18B from `+0x12` (proven: `[0]` sourceId, `[1..2]` edat 1-based u16,
  `[3..4]` placement selector/coordinate, `[5]` phase wheel, `[6]` start node, `[10..12]` drop,
  `[16..17]` descriptor tail links; `[13..15]` consumed per-row by helper `0x8021590C` — semantics
  open). Parent codec: `tools/eset_codec.js` (63/63 byte-identical round-trip).

## Explicitly NOT promoted (below the bar)

Name candidates in parent `docs/hotpath-label-candidates.md` (e.g. `func_0010DDB4` spawner
candidate, `0x00106AAC` node-table path); site halfword0 bit semantics ("threat/influence" is
hypothesis); Section 1 `[9]` tier byte ("likely", untested); `[13..15]` meaning (all-zero
specimen only); Section 2 extended-operator bytes `[13]/[15]` (observed 0 in vanilla); the
`0x000E5968` archive-catalog-walk fetch candidate (static only, no live callsite match); scripted
activator naming (never observed live); operator semantics beyond the resolver (other consumers
unverified).
