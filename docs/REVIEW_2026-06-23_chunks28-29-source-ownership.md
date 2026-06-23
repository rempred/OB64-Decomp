# Review Handoff: Rev 0 Chunks 28-29 Source Ownership

Date: 2026-06-23

Range covered: `0x001C1000..0x001E1000`

Final frontier: `0x001E1000`

Commits in this run:

- `78f93d7` - `Source-own Rev0 chunk 28`
- `047d0cd` - `Source-own Rev0 chunk 29`

## Outcome

Chunks 28 and 29 are source-owned as tracked code/data parts. No byte in either
chunk remains only in generated fallback ownership.

Current source mix from `verify_setup`:

- 30 tracked real-assembler chunks, all composite.
- 3,544 tracked original-MIPS source files.
- 70 generated fallback chunks.
- Source-owned frontier bytes: 1,966,080 bytes
  (`0x00001000..0x001E1000`), 69.0045% of the evidenced executable MIPS extent.
- Code-only classified bytes: 1,609,044 bytes, 56.4735% of the evidenced
  executable MIPS extent.

Next run must start at `0x001E1000` by emitting
`func_001E0FC8_chunk30tail`. The function starts in chunk 29 at
`0x001E0FC0`, has the parent prologue at `0x001E0FC8`, and has no return before
the chunk boundary.

## Opening Fixes

- Removed stale current-state/frontier/count wording from `AGENTS.md`,
  `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`, and
  `docs/WORKFLOW.md`.
- Cleaned data-index wording that used boundary terminology in data context.
  The hygiene search now finds no `True entry`, `read-before-write preamble`,
  `function-boundary`, or `function boundary` wording in chunk data indexes or
  data source owners.
- Confirmed no tracked root scratch artifacts beyond intended root files:
  `.gitattributes`, `.gitignore`, `AGENTS.md`, and `README.md`.
- Confirmed prior review commit tables used real commit hashes; no placeholder
  hash fix was needed.
- Preserved patch-workbench caveats from the backfill: manifest-only patch
  classification is still not trusted for `kind`/straddler metadata, same-file
  duplicate labels outside the active frontier remain caveats, and overlay/RAM
  behavior claims still require runtime proof.

## Chunk 28

Range: `0x001C1000..0x001D1000`

Dossier:
`docs/dossiers/lib-chunk28-1C1000-1D1000.md`

Data index:
`docs/data-index/rev0/chunk28-data-region-inventory.json`

Split JSON:
`build/chunk_001C1000-001D1000_splits.json`

Classification:

- 97 total parts.
- 73 normal code parts.
- 22 data parts.
- 2 function straddlers.
- `check_boundaries` reports 75 code-class parts because straddlers are counted
  with code there.

Boundary and region facts:

- Incoming function tail:
  `func_001C0FC8_chunk28tail`, `0x001C1000..0x001C1024`.
  It returns at `0x001C101C` with delay slot `0x001C1020`.
- Data territory 1:
  `0x001C2DC0..0x001C3300`, 1,344 bytes. Classified as inline mixed
  pointer/GBI-like UI/resource data. Evidence: 0 prologues, 0 `jr $ra`, 149
  RAM-like pointer words, 111 `0x8022/0x8023`-style RAM values, 76 zero words,
  and 42 GBI/RDP-like words.
- Data territory 2:
  `0x001C5690..0x001C904C`, 14,780 bytes. Classified as stronghold/tutorial
  text, pointer tables, and packed script data. Evidence includes strings such
  as `Stationing unit will gather information.`, `Stronghold Command. Proceed?`,
  `dedasi_000`, and `come here 000`.
- Data territory 3:
  `0x001C91E8..0x001CE070`, 20,104 bytes. Classified as pointer/id table plus
  packed script blob, debug string `tusc_hc_test come \n`, and zero pad.
- Outgoing function head:
  `func_001D0694`, `0x001D0694..0x001D1000`, continued first in chunk 29.

Data accounting:

- Data bytes source-owned: 36,228.
- Parsed or directly recognizable bytes: 1,124.
- Raw-but-classified/undecoded bytes: 35,104.
- Data files added: 22.
- Index files added: 1.
- Known format families: RAM pointer runs, string pools, GBI/RDP-like words,
  packed command/script blobs, zero padding.
- Exact data frontier: none inside chunk 28; all chunk-28 data bytes are owned
  and indexed.

Adversarial result:

- No structural disproofs after final split. The incoming tail, three data
  territories, resumed code at `0x001CE070`, and outgoing function head survived
  review.

## Chunk 29

Range: `0x001D1000..0x001E1000`

Dossier:
`docs/dossiers/lib-chunk29-1D1000-1E1000.md`

Data index:
`docs/data-index/rev0/chunk29-data-region-inventory.json`

Split JSON:
`build/chunk_001D1000-001E1000_splits.json`

Classification:

- 103 total parts.
- 97 normal code parts.
- 4 data parts.
- 2 function straddlers.
- `check_boundaries` reports 99 code-class parts because straddlers are counted
  with code there.

Boundary and region facts:

- Incoming function tail:
  `func_001D0694_chunk29tail`, `0x001D1000..0x001D10A4`.
  It returns at `0x001D109C` with delay slot `0x001D10A0`.
- Recovered parent-undetected frameless helper:
  `func_001D9338`, `0x001D9338..0x001D94A8`.
- Recovered parent-undetected frameless helper:
  `func_001E0A38`, `0x001E0A38..0x001E0B60`.
- Zero-fill data islands:
  `0x001D46F8..0x001D4700`, `0x001D884C..0x001D8850`,
  `0x001DAAAC..0x001DAAB0`, and `0x001DBF68..0x001DBF70`.
- Outgoing function head:
  `func_001E0FC8`, file range `0x001E0FC0..0x001E1000`, parent prologue at
  `0x001E0FC8`.

Data accounting:

- Data bytes source-owned: 24.
- Parsed bytes: 24.
- Raw-but-classified bytes: 0.
- Undecoded bytes: 0.
- Data files added: 4.
- Index files added: 1.
- Known format families: zero-fill alignment islands only.
- Exact data frontier: none inside chunk 29; all chunk-29 data bytes are owned
  and indexed.

Adversarial result:

- The final adversarial pass found two high prefix-placement defects:
  `0x001D30B8..0x001D30C0` was initially left after the `func_001D2AB4`
  return, and `0x001DC4D8..0x001DC4E4` was initially left after the
  `func_001DC1CC` return.
- Both were fixed by moving the next part starts to `func_001D30B8` and
  `func_001DC4D8`.
- Re-run `check_boundaries` and `check_splits` both passed with 103 splits and
  0 hard failures/fragments.

## Parent Evidence Sweep

Useful parent leads:

- `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_functions.json`
- `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_symbols_v2.json`
- `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_overlay_map.json`
- `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_callgraph_v2.json`

These supplied parent DB/control-flow seeds only. Every boundary used in the
tracked split was reconciled against local byte-exact Rev 0 disassembly.

Additional useful leads:

- `C:\Users\Joe\Projects\OgreBattlel64\wiki\battle-turn-queue-trace\disasm_old_pointer_clear_training.txt`
  mentions `[ROM 0x001c1fbc]`; it lands inside `func_001C1F98` and caused no
  boundary or naming change.
- `C:\Users\Joe\Projects\OgreBattlel64\scripts\ob64_multu72_search_output.txt`
  has in-range leads at `0x001C1708`, `0x001CF770`, `0x001D39E4`,
  `0x001D9B98`, `0x001D9C80`, `0x001DABF8`, `0x001DAFF0`, and `0x001DB600`.
  These remain inside code parts or already-owned territories and caused no
  data reclassification.

Rejected or corrected leads:

- Runtime/editor/patch artifacts using `0x801D....` PCs were not treated as Rev
  0 z64 ROM offsets.
- `0x8022/0x8023` decode-column values were treated as overlay/RAM leads only,
  not simple ROM back-maps.
- Archive/catalog-like `0x01Cxxxxx` values outside the active z64 code range
  were rejected as current-boundary evidence.
- Parent DB boundaries were used as leads, not truth. The chunk 29 frameless
  helpers and prefix folds are local disassembly corrections.

## Patch Workbench

No new patch-workbench metadata was naturally encountered inside or immediately
adjacent to `0x001C1000..0x001E1000`, so no run-scoped patch-workbench JSON was
created.

The existing backfill artifact remains the baseline:
`docs/patch-workbench/rev0/patch-workbench-backfill-2026-06-23.json`.

Unresolved runtime-state requests from the backfill remain unchanged:

- High Attack Rev 0 moved-lane gates.
- Raw squad-capacity placement safety.
- Chaos Frame sub-screen regression.
- Scenario-main hook timing.
- Overlay mapping/register proof.

No static-only finding in this run was upgraded to `proven`.

## Tooling

No tracked JS tooling was changed. Split generation used the existing
source-ownership pipeline and ignored build artifacts.

## Verification

Commands and results from this run:

```powershell
node -e "... node --check touched JS tools ..."
```

Result: `node --check: no touched JS tools`.

```powershell
node tools/check_manifest.js
```

Result: `ALL CHECKS PASS`; chunk 28 has 97 parts and chunk 29 has 103 parts.

```powershell
node tools/check_boundaries.js --splits build/chunk_001C1000-001D1000_splits.json --disasm build/original-mips/rev0/code_001C1000_001D1000.s
node tools/check_splits.js --splits build/chunk_001C1000-001D1000_splits.json --disasm build/original-mips/rev0/code_001C1000_001D1000.s
```

Result: chunk 28 boundary check passed with 97 parts, 75 code-class parts, 22
data parts, and 0 fragment/cross/under/leak/straddler/data-island warnings.
Split check found 0 fragment candidates.

```powershell
node tools/check_boundaries.js --splits build/chunk_001D1000-001E1000_splits.json --disasm build/original-mips/rev0/code_001D1000_001E1000.s
node tools/check_splits.js --splits build/chunk_001D1000-001E1000_splits.json --disasm build/original-mips/rev0/code_001D1000_001E1000.s
```

Result: chunk 29 boundary check passed with 103 parts, 99 code-class parts, 4
data parts, and 0 fragment/cross/under/leak/straddler/data-island warnings.
Split check found 0 fragment candidates.

```powershell
node -e "... verify chunks 28 and 29 are tracked contiguous manifest parts ..."
```

Result:

- `0x001C1000 97 tracked contiguous ok`
- `0x001D1000 103 tracked contiguous ok`

```powershell
node -e "... parse chunk28, chunk29, and patch-workbench JSON ..."
```

Result: chunk 28 data index, chunk 29 data index, and the patch-workbench
backfill JSON all parsed.

```powershell
rg -n "True entry|read-before-write preamble|function-boundary|function boundary" docs\data-index\rev0 asm\original\rev0\lib -g "chunk2*-data-region-inventory.json" -g "data_*.s" -g "rodata_*.s" -g "table_*.s" -g "zero_fill_*.s"
```

Result: no matches.

```powershell
node tools/assemble_original_mips.js
```

Result: exact code-region match PASS.

- Bytes: 6,510,444.
- Code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

```powershell
node tools/verify_setup.js
```

Result: PASS.

- Archives: 825.
- Unknown bytes: 0.
- Overlap bytes: 108.
- Source mix: 30 tracked real-asm chunks, 30 composite, 3,544 tracked files,
  70 generated fallback chunks.
- Source manifest: 1,059 entries.
- Ambiguous bytes preserved explicitly: 2,469,141.
- Code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

```powershell
node tools/audit_code_region.js
```

Result: OK.

- Parent inputs loaded.
- Executable extent: `0x00001000..0x002B89B4`, 2,849,204 bytes.
- Suspected non-code tail: `0x002B89B4..0x0063676C`, 3,661,240 bytes,
  56.24% of configured region.
- Control-flow into tail: 0 branches, 7 raw linear J/JAL hits, 0 to known
  functions.
- Verdict: no credible code edge into tail.

```powershell
git diff --check
```

Result: PASS before each chunk commit.

## Files Changed

Chunk 28 commit categories:

- Added chunk 28 `asm/original/rev0/lib/` source-owner parts.
- Updated `asm/original/rev0/manifest.json`.
- Added `docs/dossiers/lib-chunk28-1C1000-1D1000.md`.
- Added `docs/data-index/rev0/chunk28-data-region-inventory.json`.
- Updated current-state docs and cleaned stale data-index wording.

Chunk 29 commit categories:

- Added chunk 29 `asm/original/rev0/lib/` source-owner parts.
- Updated `asm/original/rev0/manifest.json`.
- Added `docs/dossiers/lib-chunk29-1D1000-1E1000.md`.
- Added `docs/data-index/rev0/chunk29-data-region-inventory.json`.
- Updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, and `docs/WORKFLOW.md` to final counts/frontier.

## Caveats

- Source ownership and byte-exact rebuild are proven; game behavior names remain
  conservative unless backed by runtime or mutation evidence.
- Parent DB, editor hook, trace, or patch labels remain leads only after the low
  resident region. Overlay/RAM mapping claims still need runtime proof.
- Chunk 28 packed command/script territories are source-owned and indexed but
  not fully semantically decoded. Their unresolved fields are listed in the
  chunk 28 data index.
- No patch-workbench behavior or hook-site metadata was harvested in range.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for
  `0x001C1000` and `0x001D1000`.
- Review chunk 28 data classifications against
  `docs/data-index/rev0/chunk28-data-region-inventory.json`.
- Review chunk 29 adversarial prefix fixes at `0x001D30B8` and `0x001DC4D8`.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x001E1000` with `func_001E0FC8_chunk30tail`; do not continue past
  that first boundary without confirming the return/end of the straddler.
