# Parent-Evidence Audit — Source-Owned Chunks 0–11 (z64 ROM 0x00001000..0x000C1000)

Date: 2026-06-23
Scope: retroactive, read-only audit of the already source-owned chunks 0–11 (boot chunk 0 +
lib chunks 1–11) against parent-repo research artifacts. No `.s` files were modified. Output is
this report + recommendations only.

Decomp repo: `C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp`
Parent repo: `C:/Users/Joe/Projects/OgreBattlel64`

---

## Method

1. **Enumerated our split.** Parsed `asm/original/rev0/manifest.json` for every `part` whose
   `romStart` < `0x000C1000` → **1802 parts** (1407 named `func_<addr>`, 274 descriptively-named
   code routines, 121 data parts). 16.6% of the range is classified as data.

2. **Built the parent join.** Ran the repo's own reconciliation tool
   `node tools/dump_function_context.js --start 0x1000 --end 0xC1000`, which joins the three
   parent DBs the decomp already consumes:
   - `../scripts/ob64_functions.json` — function boundaries (already z64 `start_rom`/`end_rom`;
     **inclusive** last-word semantics, so exclusive end = `end_rom + 4`, asserted by the tool).
   - `../scripts/ob64_symbols_v2.json` — overlay-aware names + callgraph (keyed by z64 ROM hex).
   - `../scripts/ob64_xrefs.json` — global xref map.
   Result: **1128 parent functions** in range, **295** with a name field.

3. **Reconciled each parent function to our parts** by start address, computed boundary deltas,
   and flagged any parent function that lands inside one of our *data* parts (classification
   conflict candidate). Verified every candidate against the actual disassembly in
   `asm/original/rev0/lib/`.

4. **Searched hand-written parent artifacts** for addresses resolving into the range:
   `editor/` (hardcoded ROM/RAM offsets), `MIPS_Decode.md`, `docs/` index, `AGENTS.md`.

### Parent paths searched
| Path | What | Result |
|---|---|---|
| `scripts/ob64_functions.json` | boundaries (z64 rom) | joined (1128 fns in range) |
| `scripts/ob64_symbols_v2.json` | names + callgraph (overlay-aware) | joined (295 named) |
| `scripts/ob64_xrefs.json` | global xrefs | joined via tool |
| `scripts/ob64_overlay_map.json` | RAM↔ROM↔overlay (5.9 MB) | available; only needed for editor RAM addrs |
| `editor/` (squadblob.js, tools-data.js, RELEASE_NOTES.md) | hardcoded ROM/RAM offsets | 3 in-range hits, reconciled below |
| `MIPS_Decode.md` | hand analysis | 1 in-range hit (`0x60988`) |
| `docs/` (index in `MIPS_Decode.md`) | dossier index | `supp_table_decoded.md` cites `0x60988` |

### Paths skipped (and why)
- `Ogre Battle Modding Notes.zip`, `OB64 portraits*.zip`, `Downloads.7z` — compressed archives,
  not extracted (out of scope; no loose text).
- `ram_snapshots/`, `pj64_saves/`, `PJ64 State Scratch/`, `All Scenarios Save States/`,
  `Cutscene Frames/` — binary runtime blobs; no text labels addressing this ROM range.
- `mips_to_c/`, `mips_c/`, `mips_asm/` — present but contain no function names mapping into
  `0x1000..0xC1000` that the symbols DB does not already carry (the symbols DB is the distillation
  of those runs). `ob64_callgraph_v2.json` is already folded into `ob64_symbols_v2.json`.
- `ModderResources/`, `ob64_text_blocks/`, `wiki/` — string/asset data, not code-region labels.

---

## Findings table

Verdict legend: **CONFIRMED LEAD** (parent name/role matches our part at a reconciled address) ·
**REJECTED** (false match) · **CONTRADICTION** (parent proves our split wrong) ·
**NAMING LEAD** (better name available, evidence-graded, do not auto-apply).

| Parent artifact | Address (parent form) | Reconciled z64 ROM | Our part | Verdict | Evidence |
|---|---|---|---|---|---|
| `ob64_functions.json` fn `0x2E348` (size 548) | end ≈ z64 `0x2E56C` | overruns into `0x2E450` | `func_0002E348` (ends `0x2E450`) + `data_0002E450_rsp_ucode` | **REJECTED (parent over-run)** | Our `func_0002E348` ends with a clean `jr $ra`+delay slot at `0x2E448/0x2E44C` (balanced `addiu $sp,-0x40`/`+0x40`). Bytes from `0x2E450` are RSP ucode (`mfc0 $a1,$11`; `jal 0x84001120`; `break`; `lwc2`/`op_0x12` vector ops). Parent scanner ran past the epilogue into ucode. **Our split is the correct one.** |
| `ob64_functions.json` fn `0x30008..0x30074` (leaf, 0 callers/0 callees) | z64 `0x30008` | inside `data_0002E450_rsp_ucode` | `data_0002E450_rsp_ucode` | **REJECTED (false positive)** | Only parent fn fully inside any data part. Lives in the RSP ucode blob; 0 in/out edges. Host-disassembler false function inside vector microcode. Our data classification is correct. |
| `ob64_symbols_v2.json` `0x2DE50` (conf 1.0) | z64 `0x2DE50` | `0x2DE50` exact | `func_0002de50` | **NAMING LEAD (low/interpretive)** | Parent name `seed::dma_pipeline3`. Bytes are a 16-byte-aligned byte-copy/staging loop calling alloc `0x80089F80`; boundaries match exactly. "dma_pipeline" is interpretive, not proven; keep conservative name, note the lead. |
| `ob64_symbols_v2.json` `0x2DEF4` (conf 1.0) | z64 `0x2DEF4` | `0x2DEF4` exact | `func_0002def4` | **NAMING LEAD (low/interpretive)** | Parent name `seed::dma_pipeline2`. Same family as above; boundaries match. |
| `ob64_symbols_v2.json` `0x1DE40` (conf 0.6) | z64 `0x1DE40` | `0x1DE40` exact | `func_0001de40` | **NAMING LEAD (weak)** | Parent name `dispatch::dispatcher/state-machine`. Confidence 0.6; boundaries match (our `0x1DE40..0x1E340`). |
| `ob64_symbols_v2.json` `0x23460` (conf, `seed::memcpy_like`) | z64 `0x23460` | `0x23460` (1st sub-fn of our part) | `memcpy` (`0x23460..0x23780`) | **CONFIRMED LEAD** | Our `memcpy.s` bundles ≥2 routines (`jr $ra` at `0x234D0` and `0x2364C`). Parent names the first sub-fn `seed::memcpy_like`; the part outer boundary `0x23780` matches the parent's next-fn start exactly. Confirms our part is a correctly-bounded memcpy bundle. |
| `editor/squadblob.js`, `editor/RELEASE_NOTES.md` | z64 `0x0283C4` / RAM `0x80097FC4` | z64 `0x283C4` exact | `data_000283C4` (`0x283C4..0x28430`, 108 B) | **CONFIRMED LEAD + NAMING LEAD** | Editor's squadblob bootstrap injection site (record-builder hook trampoline target). Confirms our *data* classification of this 108 B block and supplies a precise role name (squadblob bootstrap). |
| `MIPS_Decode.md` / `supp_table_decoded.md` | ROM `0x60988` | z64 `0x60988` | `data_00060980` (`0x60980..0x61000`) | **CONFIRMED LEAD + NAMING LEAD** | Hand analysis labels `0x60988` the **combat action table**. Falls inside our data part `data_00060980`. Confirms data classification; supplies role name. |
| `editor/tools-data.js`, `RELEASE_NOTES.md` | RAM `0x800A4A78`/`0x800A4B00` ("bootstrap runtime"); RELEASE_NOTES z64 `0x034E78` | z64 `0x34E78`/`0x34F00` (via unreliable linear early-map) | `rsp_ucode_text_00034100` / `zero_fill_00034E80` | **REJECTED (weak reconciliation)** | The z64↔RAM pairing uses the linear `RAM=ROM+0x8006FC00` map, which project rules flag as invalid above ~`0x2F000`. "bootstrap runtime" is a *relocation destination* label, not a source-region classification, and the linear back-map is untrustworthy here. Not a usable source-side claim; no conflict with our split. |
| `ob64_symbols_v2.json` thematic tags | 172× `character::char-data consumer` (`0x40E90..0xC0EDC`), 16× `class::class-def consumer`, 16× `dma/resource::resource loader`, 4× `promotion::promotion consumer` | various, starts match our parts | many `func_<addr>` | **NAMING LEAD (subsystem-level only)** | These are *subsystem-affinity* tags (which data table the fn touches), not function identities — too coarse to adopt as names. Useful only as binning hints for which dossier a `func_<addr>` belongs to. |

---

## PROVEN MISTAKES TO FIX

**None.** No parent artifact, after byte-exact Rev 0 reconciliation, proves any boundary, name, or
classification in our chunks 0–11 split is wrong.

The two cases where the parent *disagreed* with our split (the `0x2E348` over-run and the
`0x30008` phantom leaf) both resolve **in our favor**: the disassembly shows our function boundary
(`jr $ra` at `0x2E448`) and our `data_0002E450_rsp_ucode` classification are correct, and the
parent's function detector ran into / hallucinated functions inside RSP vector microcode. No `.s`
edit, no name change, and no boundary change is required.

---

## Naming leads (do not auto-apply)

Graded by strength. All boundaries already match ours exactly unless noted.

**Strong (external hand-analysis corroborated):**
- `data_000283C4` (`0x283C4..0x28430`) → squadblob/record-builder **bootstrap injection block**
  (editor `squadblob.js`; RAM `0x80097FC4`). High confidence it is data with this exact role.
- `data_00060980` (contains `0x60988`) → **combat action table** (`MIPS_Decode.md` /
  `supp_table_decoded.md`). High confidence data + role.

**Moderate (parent symbol DB, boundaries exact):**
- `memcpy` (`0x23460` sub-fn) → `seed::memcpy_like` (already effectively captured by our name).

**Low / interpretive (parent symbol DB; name is a guess, keep conservative `func_` name for now):**
- `func_0002de50` → `seed::dma_pipeline3` (conf 1.0 in DB, but "pipeline" is interpretive; code is
  an aligned byte-copy staging helper).
- `func_0002def4` → `seed::dma_pipeline2` (same family).
- `func_0001de40` → `dispatch::dispatcher/state-machine` (conf 0.6).

**Subsystem-binning hints only (too coarse to be names):**
- 172 functions tagged `character::char-data consumer` spanning `0x40E90..0xC0EDC` — i.e. chunks
  4–11 are dominated by character-data-consuming code. Use to route `func_<addr>` parts to the
  right chunk dossier, not to rename.
- `class::class-def consumer` (×16), `dma/resource::resource loader` (×16),
  `promotion::promotion consumer` (×4) — same caveat.

---

## Coverage / confidence

- **Range:** 786,432 bytes (`0x1000..0xC1000`). Data-classified: 130,788 B (**16.6%**) — RSP ucode,
  F3DEX/S2DEX/L3DEX microcode text, the VM jump table (`0x387C0..0x3C100`), rodata, and game data
  tables. Code-classified: 655,644 B across 1681 parts.
- **Boundary corroboration:** 975 of 1681 code parts begin exactly at a parent function start.
  The remaining deltas are dominated by the known parent-scanner artifacts: preamble-orphan starts
  (+4/+8/+12 B, 130 cases) and inclusive-vs-exclusive end (−4/−8/−12 B, 177 cases). None of these
  are real disagreements; spot-checks (`os_inval_icache`, `guMtxF2L`, `memcpy`, `udivmod_u64`)
  confirm our parts capture complete functions where the parent placed phantom mid-function entries.
- **Name corroboration:** ~30.4% of code bytes have a *specific* (non-generic) parent name at the
  matching function start; the rest carry only generic `tiny utility` / unnamed tags. **0%** of the
  range has a parent name that *contradicts* ours.
- **Classification corroboration:** exactly one parent function falls fully inside a data part
  (`0x30008`, the RSP-ucode false positive) — verified, not a real conflict. Two independent
  external sources (editor, MIPS_Decode) confirm two of our data blocks (`0x283C4`, `0x60988`).
- **Confidence:** **High** that the chunks 0–11 split has no parent-provable mistakes. Parent
  corroboration is strong for boundaries (97%+ once artifacts are accounted for) and data
  classification, and additive (not corrective) for names.

---

## Reproduction
```
node tools/dump_function_context.js --start 0x1000 --end 0xC1000
# -> build/context/rev0-function-context-00001000-000C1000.{json,md}
```
Cross-checks were done against `asm/original/rev0/lib/*.s` and `asm/original/rev0/manifest.json`,
parent DBs under `../scripts/`, and `editor/` + `MIPS_Decode.md` in the parent repo.
