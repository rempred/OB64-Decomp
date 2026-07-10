# Subsystem: Cutscene Animation VM And Pose Programs (Rev 0)

Curated Phase-1 subsystem packet imported from the parent research workspace
on 2026-07-09. The byte-exact atlas supplies function identity; the parent
function DB is enrichment only. Every promoted claim below carries an evidence
grade and a parent artifact. Grades follow the established subsystem pattern:
**[live]** = runtime trace captured, **[edit]** = controlled mutation with the
predicted observed effect, **[code+multi]** = static decode checked against
multiple independent runtime cases.

Primary parent references:
`wiki/decomp/cutscene-vm-target-map.{json,md}`,
`docs/cutscene-system.md`,
`wiki/decomp/traces/op84-op90-runtime-20260709/runtime-summary.md`, and
`wiki/decomp/traces/hugo-getup-setpos.ingested.{json,md}`.

## Overlay / runtime mapping

| function | z64 ROM / atlas part | runtime RAM | grade + proof |
|---|---:|---:|---|
| choreography interpreter | `func_0001299c`, entry `0x1299C`; loop `0x129CC` | entry `0x8008259C`; loop `0x800825CC` | [code+multi] dispatch behavior plus captured handler returns |
| opcode `0x84` tween setter | `func_00014408` | `0x80084008` | [live] 24 entry hits in `wiki/pj64-hugo-getup-setpos.json` |
| opcode `0x90` pose-record selector | `func_000114f0` | `0x800810F0` | [live] 183 entry hits across the two cited traces |
| pose descriptor resolver | `func_002A2674` | `0x80232E44` | [live]+[code+multi] atlas start correction plus live lookup target |
| pose-program lookup | `func_002A3198` | `0x80233968` | [live]+[code+multi] exact overlay mapping |
| director word-command parser | `func_00284288` | `0x802282B8` | [live]+[code+multi] registered-wait and move-command traces |
| motion-command creator | `func_002A0B14` | `0x802312E4` | [live] first coordinate-author write, frame 520 |
| motion integrator | `func_002A0EF0` plus continuation `func_002A0EF0_chunk42tail` | `0x802316C0` | [live] 50 coordinate writes, frames 522..570 |
| sprite-record matrix builder | `func_002A9AD0` | `0x8023A370` | [live] parent render-path exec watch |

The low-ROM VM functions use the permanent `ROM + 0x8006FC00` mapping. The
pose/director functions are overlays; their atlas comment-column addresses are
fake-linear assembly labels and must not be used as runtime watch PCs.

## VM contract and handler facts

- **[code+multi] Dispatch ABI:** `$a0` is the object/controller, `$a1` points
  just past the opcode byte, and `$v0` returns the next script pointer. A zero
  return stops interpretation. The accepted opening-walk trace records the
  same `$a0/$a1` relationship across 38 opcode-`0x90` entries; the older Hugo
  capture records it across another 145 `0x90` and 24 `0x84` entries.
- **[code+multi] Opcode domain:** the dispatch table has 45 valid handlers for
  `0x80..0xAC`. There is no upper-bound check before the table lookup. A
  top-level byte below `0x80` follows the inline literal path at RAM
  `0x80082608` rather than dispatching a handler.
- **[code+multi] Terminator:** opcode `0x80` (`func_0001438c`) resets the object
  fields documented in the target map and returns zero. It is the explicit
  script terminator.
- **[live]+[code] Opcode `0x84`:** the handler consumes exactly six bytes and
  executes on four transient/non-channel objects in the Hugo get-up capture.
  The 24 hits span frames 61..890. Captured first-six-byte patterns are
  `01 7F 01 7F 01 00` (20), `01 7F 01 7F 29 00` (2), and
  `01 00 01 7F FF 7F` (2). Handler disassembly proves the duration/rate and
  two-axis object-field writes summarized in the target map; no controlled
  edit in this packet assigns higher-level visual names to each operand.
- **[code+multi] Repeat stack (opcodes `0x95`/`0x96`):** the controller keeps
  a repeat/loop stack with depth byte at `+0xDB` and per-depth frames in
  `+0xE0..+0x13B`. Opcode `0x95` (`func_00014830`) pushes: it saves the
  current `+0x38` parser cursor to `+0xF0 + 4*depth` (ROM `0x14854..0x14858`)
  along with the repeat count and resume script pointer in the surrounding
  frame arrays. Opcode `0x96` (`func_0001489c`) pops/loops: count `0xFF`
  repeats forever, otherwise it decrements and restores `+0x38` from
  `+0xF0 + 4*(depth-1)` (ROM `0x148E0..0x148EC`). Runtime corroboration: in
  both captured scenes the value at `C+0xF0` trails the live `C+0x38` cursor
  by small, only-growing byte deltas (mode −3), exactly the saved-snapshot
  vs advancing-cursor signature. `controller.+0x38` itself is live parser
  state — initialized by `func_000140cc` (ROM `0x142C0..0x142C4`, which also
  sets `+0x8C` from the same table pointer) and advanced byte-wise by
  `func_000135a0` (ROM `0x135C8..0x13624`) — never a stable identity key.
- **[live]+[code] Opcode `0x90`:** the handler consumes one direct byte when
  bit 7 is clear or a two-byte 15-bit big-endian index when it is set. Static
  code computes `index * 7`, selects a record through
  `*(object+0x74)+0x18`, consumes record byte `[0]` as the frame/duration value,
  and writes the duration/rate pair. Runtime captures prove handler execution,
  object/operand ABI, and choreography channel/script association. They do
  **not** prove that the script operand is a direct coordinate; it is a pose-
  record index.

## Actor and pose-program data

- **[live]+[code+multi] Manager records:** the opening capture's special root
  is manager channel 0 at `0x80118AE0`; active controllers then use `0x13C`
  spacing. “Active channel” in the parent runtime summary is one-based after
  excluding this root.
- **Controller-to-sprite link at `+0x7C` — REFUTED (linkage review
  2026-07-09):** the original packet promoted "linked record at controller
  `+0x7C`" at [live]+[code+multi]. The follow-up static review
  (`wiki/after-action-reports/20260709-cutscene-controller-plus7c-linkage-review-aar.md`)
  proved the offset entered the tooling as an unvalidated adjacency heuristic
  (`ROW_SIZE = 0x7C` scanner association, commit `48e5f7d`) and that the v5
  capture read the address `controller + 0x7C` itself — it never dereferenced
  a link pointer. The "sprite `+116`" field is arithmetic identity
  `(C+0x7C)+0x74 = C+0xF0`, which the disassembly proves is the VM
  **repeat-stack save slot for the `+0x38` parser cursor** (opcode `0x95`
  `func_00014830` stores `C+0x38` → `C+0xF0 + 4*depth`, depth byte `C+0xDB`,
  at ROM `0x14854..0x14858`; opcode `0x96` `func_0001489c` restores it at ROM
  `0x148E0..0x148EC`). The captured deltas match live parser state, not a
  pairing key: **20/22** rows at −3 at first VM hit (ch3 = −5, ch8 = −2) and
  **17/22** at end with only-growing deltas (ch3 → −8, ch8 → −10) — the
  originally appended "22/22" count was itself wrong. `controller.+0x38` is a
  MUTABLE parser cursor (initialized with `+0x8C` in `func_000140cc` ROM
  `0x142C0..0x142C4`, advanced by `func_000135a0` ROM `0x135C8..0x13624`),
  so even the chair-scene equality `controller.+0x38 == record(+0x1B8).+116`
  (18/18 rows in `wiki/pj64-cast.json`) is a snapshot-matching heuristic, not
  a proven ownership invariant. Every `linkedSprite*` value in the capture
  artifacts and summary tables remains NOT promoted (the `linkedSpriteBundle`
  column literally read `C+0xF0`); the true controller→visible-sprite
  ownership relation is OPEN. The channel-instability conclusion (below)
  stands on the independent suppression evidence, not on these columns.
- **[live] Channel is not a stable visible-character identity:** across beats
  the same controller row associates with different sprite records (per the
  prior suppression/detachment evidence in `docs/cutscene-system.md`); no
  channel→character map is promoted.
- **[code+multi] Pose descriptor directory:** `*(0x802395B0)` points to 40
  records of stride `0x3C`; bank is `+0x00`, variant is `+0x0C`, and the pose-
  program table pointer is `+0x28`.
- **[code+multi] Pose-program table:** first u32 relative offset divided by 4
  yields state count; following u32 entries are offsets from the table base;
  each program begins with a u8 entry count and uses the live entry-length
  table at `0x801CEEE0`. Parent decoder:
  `scripts/ob64_pose_program_decode.py`.
- **[live] Director motion chain:** the creator's first watched coordinate
  write maps to ROM `0x2A0CC4` inside `func_002A0B14`; the integrator writes at
  exact ROM `0x2A106C` / `0x2A1084` in the continuation atlas part and carries
  motion-object pointer `$s2=0x801A2D50` with sprite-record base
  `$s0=0x800E4E30` in the first sample.

## Exact editor implication

The first safe `CutsceneAnimationMVP` product increment is a structural script
parser/validator, not a visual pose editor. On export it must:

1. reject an opcode greater than `0xAC` at an opcode boundary;
2. require a reachable `0x80` terminator inside the bounded script region;
3. consume the authoritative operand widths from
   `wiki/decomp/cutscene-vm-target-map.json`, including exactly six bytes for
   `0x84` and the one/two-byte 15-bit form for `0x90`;
4. preserve inline `<0x80` literal runs and unknown-but-valid handler operands
   byte-for-byte; and
5. expose the `0x90` pose index only as a raw/indexed record selection until
   pose-record bytes `[1..6]` and renderer-frame thumbnails are decoded.

This implication requires no ROM-derived byte payload in the public editor;
the editor can implement the grammar and validation rules only.

## Explicitly NOT promoted

- ANY controller→sprite pairing offset. `+0x7C` is REFUTED (an overlapping
  view of the controller's own state; its "bundle" field is the `C+0xF0`
  repeat-stack slot — see the linkage-review finding above). The chair-scene
  `+0x1B8` equality is a snapshot heuristic only, because `+0x38` is a mutable
  cursor. ALL per-fire `linkedSprite*` values in the 2026-07-09 capture tables
  stay not-promoted; any character identity ever inferred from
  `linkedSpriteId` is void. Code-proof path for the real relation: watch the
  creation-time writer of the eventual sprite record's `+0x74` field and
  correlate with the manager-selected controller.
- A stable choreography-channel-to-visible-character map (grounded in the
  suppression/detachment evidence in `docs/cutscene-system.md`, not in the
  refuted `linkedSprite*` columns).
- Semantic names for opcode-`0x84` operands beyond the code-proven
  duration/rate and two-axis field operations; no controlled edit isolates all
  six operands.
- Meanings or consumers for pose-record bytes `[1..6]`; opcode `0x90` itself
  reads only byte `[0]`.
- “Opcode `0x90` writes coordinates directly.” The disassembly refutes this.
- A safe visual thumbnail/pose name for each pose-program state.
- Any runtime claim from the accepted opening-walk capture for opcode `0x84`;
  that specific 570-frame window had zero `0x84` hits. The positive proof comes
  from the separately hashed Hugo get-up capture.
