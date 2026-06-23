# Review Handoff: 2026-06-23 Chunks 20–21 Source-Ownership (`0x00141000..0x00161000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk20-141000-151000.md`,
`docs/dossiers/lib-chunk21-151000-161000.md`.

## 1. Title
Review Handoff — Chunks 20 & 21 Source-Ownership, ROM z64 `0x00141000..0x00161000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 20 (`0x141000..0x151000`, MIXED — scenario data tables + a 125-string
  game-text pool + encounter/dispatcher code) + chunk 21 (`0x151000..0x161000`, MIXED —
  class/character-lookup code + trailing high-entropy data), plus opening doc fixes.
- **Both chunks are source-owned as code/data parts** (not "fully split into functions").
- **Chunk 20:** **175 parts** = 89 code (incl. 1 outgoing straddler-head) + 86 data.
- **Chunk 21:** **99 parts** = 94 code (incl. 1 incoming straddler-tail) + 5 data.
- **Tracked source files:** 2,526 → 2,701 (chunk 20) → **2,800** (chunk 21), +274.
- **Generated fallback chunks:** 80 → 79 → **78**.
- **Source-owned bytes:** chunks 0–21 = `0x1000..0x161000` = **1,441,792 B = 50.6033 %** of
  the 2,849,204-byte evidenced executable extent.
- **Code-only classified:** ≈ **1,209,308 B (42.4437 %)** (chunk 20 code +45,208, data
  +20,328; chunk 21 code +60,388, data +5,148).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`, both
  unchanged.
- **Current frontier:** `0x00161000` (chunk 22). Working tree clean.
- **Tooling:** added `tools/decode_ob64_tables.js` (durable fixed-stride table decoder);
  reused `tools/decode_rodata_strings.js` for the game-text pool.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `_(this doc's commit)_` | review handoff | Add chunks 20–21 review handoff (this file, final commit) |
| `19a8eda` | source + docs | Source-own chunk 21 (99 parts, MIXED); dossier `lib-chunk21` + data-index inventory + doc updates |
| `47f6753` | source + docs | Source-own chunk 20 (175 parts, MIXED); dossier `lib-chunk20` + 4 data indexes + 3 decoded exports + `tools/decode_ob64_tables.js` + doc updates |
| `1be9fce` | opening fixes | Chunks 18–19 review nit (hash e1b54b1) + stale NEXT_STEPS range + stale DECOMP_LOG next-fallback line |

## 4. Opening Fixes (commit `1be9fce`)
1. **`docs/REVIEW_2026-06-23_chunks18-19-source-ownership.md`** — replaced the commit-table
   placeholder `_(this doc's commit)_` with the real hash **`e1b54b1`**.
2. **`docs/NEXT_STEPS.md`** — corrected the stale source-owned range `0x00001000..0x00131000`
   → `0x00001000..0x00141000` (chunks 0–19).
3. **`docs/DECOMP_LOG.md`** — fixed the stale current-remainder "next fallback" sub-line (said
   chunk 18 `0x00121000..0x00131000`) → chunk 20 `0x00141000..0x00151000`; made the current
   frontier unmissable.
4. **Stale current-state sweep** — AGENTS/PLATFORM/WORKFLOW/NEXT_STEPS/DECOMP_LOG verified
   clean for the chunk-19-done state before chunk-20 work.
5. **No data files** carry "True entry"/"read-before-write preamble"/function wording (all
   chunks).
6. **All prior review own-commit rows** use real hashes (the remaining `_(this doc's commit)_`
   matches are descriptive text about past fixes, not unresolved own-rows).

## 5. Work Completed

### Chunk 20 (`0x141000..0x151000`), MIXED — 175 parts (89 code + 86 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| leading DATA (straddler + gfx/float + tables + ptr tables + strings) | `0x141000..0x145210` | 16,912 | data | 84 |
| CODE (encounter/dispatcher) + inline data island | `0x145210..0x151000` | 48,624 | code+1 island | 89+ |
- Incoming DATA straddler `data_00141000_chunk20tail [0x141000,0x1416A0)` (chunk-19
  packed-byte continuation). Inline DATA island `data_0014DE88 [0x14DE88,0x14EBE0)` (3,416 B:
  ptr tables + F3DEX + float64 pool). Outgoing straddler-head `func_00150550 [0x150550,
  0x151000)` → `0x15105C` in chunk 21.
- **neutral_encounter_table** `table_00141ED0 [0x141ED0,0x142200)` 40×20 (HIGH conf) and
  **creature_drop_table** `table_00142258 [0x142258,0x142378)` 36×8 (HIGH conf, Hawkman class
  0x27 → 0x31/0x9B/0xE8) — both fully field-decoded. **125-string game-text pool**
  `rodata_001432E4 [0x1432E4,0x1449F0)` (5,900 B) decoded ("Legion led by…"/"Winning
  condition…").

### Chunk 21 (`0x151000..0x161000`), MIXED — 99 parts (94 code + 5 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| incoming straddler-tail | `0x151000..0x15105C` | 92 | code | 1 |
| CODE (class/character lookup) | `0x15105C..0x15FBF0` | 60,308 | code | 93 |
| DATA (trailing, high-entropy) | `0x15FBF0..0x161000` | 5,148 | data | 5 |
- Incoming straddler-tail `func_00150550_chunk21tail`. `func_001591FC` = the parent-doc
  `classLookup_full` lead (name kept conservative). Outgoing DATA straddler
  `data_0015FDF8_chunk21head [0x15FDF8,0x161000)` → chunk 22 (packed small-byte stream, no
  terminator). The trailing data is high-entropy/possibly compressed (undecoded).

## 6. Parent DB / Overlay Contradictions & Corrections
- **Both chunk-20 named tables independently documented + byte-verified** (docs/neutral-
  encounters.md, drop-table.md, editor/parsers.js, ram_snapshots/table_map.json sizes
  816/288). Field layouts HIGH confidence. The neutral-table boundary was aligned to the
  documented 816-byte size (`0x142200`), not the analysis agent's initial `0x1421F0`.
- **Address-space correction (both chunks):** symbols_v2 `ram` (0x801B4xxx) is the WRONG
  linear back-map; real runtime slots are 0x801F4xxx (chunk 20) / 0x8020xxxx (chunk 21),
  scenario state — trust `runtime_ram_primary`. Classifier role tags NOT adopted (names stay
  `func_*`). The `classLookup_full` and runtime-override-hook identities recorded as LEADS.
- **Chunk 20 adversarial (5 agents, 1 fix):** data-hunter found HIDDEN CODE at `0x145210`
  mis-classified as `data_00145210` (two real frameless leaves `func_00145210`/`func_00145280`);
  the data→code boundary was moved `0x145290` → `0x145210`.
- **Chunk 21 adversarial (4 agents, 1 fix):** a missed frameless leaf `func_0015F838` (over-
  merged into `func_0015F694` across its epilogue). The data-hunter independently CONFIRMED
  the trailing high-entropy region has 0 prologues/returns — the linear-map fallacy (which
  mis-claimed code in chunk-19's data) does NOT recur here.
- **Overlay invariants:** `jr $v0`/`jr $reg` are jump-table dispatches into relocated
  `0x801E…/0x801F…/0x80214…` tables (NOT boundaries); `j 0x801/0x802xxxxx` are overlay
  tail-jumps. FP instructions are CODE; chunk-20's "float-const runs" / chunk-21's FP blocks
  are code, not data.

## 7. Straddler Refinements
- **Chunk 19 → 20:** `data_00140EA0_chunk19head` continues as `data_00141000_chunk20tail
  [0x141000,0x1416A0)` (ends at a `0xDF000000` transition).
- **Chunk 20 → 21:** `func_00150550` (prologue `addiu $sp,-0x40`) continues as
  `func_00150550_chunk21tail [0x151000,0x15105C)`.
- **Chunk 21 → 22:** `data_0015FDF8_chunk21head [0x15FDF8,0x161000)` (packed small-byte
  stream, values 0x0F-0x2B, no terminator) continues into chunk 22 — **chunk-22 first action:
  emit `data_00161000_chunk22tail` and prove its end** (and test the high-entropy chunk-21
  trailing blob against the LZSS decoder if a header appears).

## 8. Data Classification & Decode/Export Outputs (Data Territory)
- **Chunk 20 — 20,328 B in 86 parts** (`docs/data-index/rev0/chunk20-data-region-inventory.json`).
  By class: rodata-string 6,344 B · ram-pointer-table 5,492 B · display-list/graphics 3,976 B
  · incoming straddler-tail 1,696 B · neutral table 816 B · zero-fill 776 B · float-const-pool
  664 B · creature-drop table 288 B · packed/record 276 B. **Parsed:** both named tables
  (1,104 B full field decode) + the 125-string pool (5,900 B) + pointer tables + zero-fills +
  float pools (≈14.5 KB). **Raw-but-classified:** display-list/graphics + packed records
  (≈4.3 KB). **Undecoded:** the 88-byte inter-table gap + the 0x81xx string control-code
  semantics.
- **Chunk 21 — 5,148 B in 5 parts** (`docs/data-index/rev0/chunk21-data-region-inventory.json`).
  By class: outgoing straddler-head 4,616 B · packed-fill 424 B · high-entropy blob 96 B ·
  packed/unknown 12 B. **Parsed:** none (no fixed structure). **Raw-but-classified:** all
  5,148 B (high-entropy / possibly compressed). **Undecoded:** the entropy blob contents
  (follow-up: LZSS decoder if a header is found). No ASCII/text → no string export.
- **Index files added (4):** `chunk20-data-region-inventory.json`,
  `chunk20-neutral-encounter-table.json`, `chunk20-creature-drop-table.json`,
  `chunk20-string-pool-1432E4.json`; **(1):** `chunk21-data-region-inventory.json`.
- **Human-readable exports added (3):** `data/decoded/rev0/tables/chunk20-neutral-encounter-table.md`,
  `data/decoded/rev0/tables/chunk20-creature-drop-table.md`,
  `data/decoded/rev0/strings/chunk20-string-pool-1432E4.md`. All derive byte-exactly from the
  raw `.s` owners (the table/string decoders read the same disasm bytes).
- **Format families found:** fixed-stride record tables (encounter 40×20, drop 36×8); RAM-
  pointer tables (0x801A/0x801B/0x801E bands); IEEE float32/float64 const pools; F3DEX
  display-list/graphics blobs; packed-byte streams; ASCII game-text + debug/symbol strings
  (0x81xx control codes); high-entropy/possibly-compressed blob.
- **Total data bytes source-owned this run:** 25,476 (20,328 + 5,148). **Exact next data
  frontier:** `data_00161000_chunk22tail` at `0x161000` (chunk-21 straddler continuation).

## 9. Tooling Changes
- **Added** `tools/decode_ob64_tables.js` (durable; decodes neutral_encounter_table +
  creature_drop_table from the byte-exact disasm into JSON indexes + Markdown exports;
  field layouts from reconciled parent evidence). `node --check` clean.
- Reused `tools/decode_rodata_strings.js` (from the chunks-14-15 run) for the game-text pool.
- Build helpers (gitignored): `build/combine_chunk.js`, `build/scan_chunk.js`,
  `build/wf_chunk2{0,1}_analyze.js`.

## 10. Verification (commands + key output)
- `node --check tools/decode_ob64_tables.js` / `decode_rodata_strings.js` → clean.
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (22 chunks, 2,800 parts).
- `node tools/check_boundaries.js --splits build/chunk_00141000-00151000_splits.json --disasm build/original-mips/rev0/code_00141000_00151000.s` → **PASS** (175 parts; 0 of each).
- `node tools/check_boundaries.js --splits build/chunk_00151000-00161000_splits.json --disasm build/original-mips/rev0/code_00151000_00161000.s` → **PASS** (99 parts; 0 of each).
- `node tools/check_splits.js …` (both chunks) → 0 true fragments (small files are real leaves with returns).
- Adversarial: chunk 20 → 1 hidden-code fix; chunk 21 → 1 missed-leaf fix; data-hunters confirmed no hidden code in the data regions.
- Every byte `0x141000..0x161000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 22 tracked composite chunks, **2,800** tracked files, **78** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent unchanged).
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse; the table/string decodes derive from the raw owners.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 22 · tracked files 2,800 · fallback 78 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00161000`.**

## 11. Files Changed
- **Source `.s` (added):** 175 (chunk 20: 89 code + 86 data) + 99 (chunk 21: 94 code + 5
  data) = 274 under `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_00141000_…s`
  / `code_00151000_…s` (`--remove-source`).
- **Manifest:** chunk count 20→22, total parts 2,526→2,800.
- **Tools:** new `tools/decode_ob64_tables.js`.
- **Data indexes:** 5 new under `docs/data-index/rev0/` (chunk20 inventory + 2 table indexes +
  1 string index; chunk21 inventory).
- **Decoded exports:** 3 new under `data/decoded/rev0/{tables,strings}/`.
- **Docs:** new `docs/dossiers/lib-chunk20-141000-151000.md`, `lib-chunk21-151000-161000.md`;
  this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`; chunks-18-19 review hash fix.

## 12. Current Frontier
- **Next ROM address:** `0x00161000` (chunk 22, `0x161000..0x171000`).
- **First required action:** continue the OUTGOING DATA straddler — emit
  `data_00161000_chunk22tail` as chunk 22's first part (continuation of the packed-byte
  stream `data_0015FDF8_chunk21head`), prove its end. Then content-scan/classify; the chunk-21
  trailing blob is high-entropy/possibly compressed — if a header appears at/after the
  straddler, test the LZSS decoder.

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>`; overlay relocation makes
  RAM/global/callee identity SUSPECT. LEADS recorded (classLookup_full @0x1591FC, runtime-
  override hook @0x1574B8, chunk-20 table/string roles) but not adopted.
- **Chunk-20 data:** pointer-table wiring, display-list format, the 88-byte inter-table gap,
  and the 0x81xx string control-code semantics are NOT decoded.
- **Chunk-21 trailing data:** high-entropy, possibly compressed — undecoded; needs a
  header/decoder test.
- **Linear-map fallacy:** any future RAM→ROM mapping from a runtime trace must be validated
  against byte-exact Rev 0 (prologue/return presence), never trusted as `ROM = RAM − 0x8006FC00`
  for overlay code/data.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `19a8eda`, `47f6753`, `1be9fce`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (22 chunks / 2,800 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (22 / 2,800 / 78; ROM `571E8339…CC67A`).
- [ ] Chunk 20 spot-check: `data_00141000_chunk20tail.s` (incoming straddler); `table_00141ED0.s`
  + `table_00142258.s` (the two named tables, no function wording) and their decoded JSON/MD
  (Hawkman class 0x27 → 0x31/0x9B/0xE8); `rodata_001432E4.s` (125-string pool); `func_00145210.s`
  (the hidden-code fix); `func_00150550.s` (outgoing straddler-head, no `jr $ra`).
- [ ] Chunk 21 spot-check: `func_00150550_chunk21tail.s` (incoming straddler-tail);
  `func_001591FC.s` (classLookup_full, conservative name); `func_0015F694.s`/`func_0015F838.s`
  (the missed-leaf split); `data_0015FDF8_chunk21head.s` (outgoing data straddler). Confirm
  `[0x15FBF0,0x161000)` has 0 prologues/returns.
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  22 chunks / 2,800 files / 78 fallback / frontier `0x00161000`.
- [ ] Confirm the 5 chunk-20/21 data-index JSONs parse and match manifest ranges; the 3 decoded
  exports derive from the raw owners; 0 data files with function wording; 0 root scratch.
- [ ] Confirm next frontier `0x00161000` and the `data_00161000_chunk22tail` first-action.
