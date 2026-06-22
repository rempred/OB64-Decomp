# Chunk Source-Ownership Run Prompt Template

Use this template for future Rev 0 original-MIPS chunk source-ownership runs.
Replace every `{PLACEHOLDER}` before sending it to an agent. Keep the data-region
requirements even when the next chunk is expected to be mostly code.

## Quick Update Checklist

- `{CHUNK_N}`: next chunk number.
- `{CHUNK_START}` / `{CHUNK_END}`: exact z64 range, e.g. `0x00071000`.
- `{PREV_FRONTIER}`: current frontier before the run.
- `{NEXT_EXPECTED_FRONTIER}`: expected frontier after success.
- `{CURRENT_TRACKED_FILES}` and `{CURRENT_FALLBACK_CHUNKS}`: from `verify_setup`.
- `{CURRENT_SOURCE_OWNED_BYTES}` and `{CURRENT_SOURCE_OWNED_PERCENT}`: current source-owned metric.
- `{CURRENT_CODE_ONLY_BYTES}` and `{CURRENT_CODE_ONLY_PERCENT}`: only if mixed data is significant.
- `{INCOMING_STRADDLER}`: function or data straddler from the previous chunk, or `none`.
- `{KNOWN_PARENT_DB_CAVEAT}`: parent DB / overlay caveat for the next range.
- `{REQUIRED_REVIEW_DOCS}`: latest review handoff docs for the prior run.
- `{KNOWN_ISSUES}`: cleanup issues to fix first.
- `{BRIDGE_URL}`: usually `http://127.0.0.1:17776`.
- `{GUI_AGENT_NAME}`: the visible GUI agent/chat label, usually `Claude GUI`.

## Copyable Prompt

```text
You are continuing the Rev 0 original-MIPS source-ownership project in:

C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp

Primary objective:
Fix all known issues from the previous review, then fully source-own Chunk {CHUNK_N}:
`{CHUNK_START}..{CHUNK_END}`.

Data ownership is part of the goal, not optional. Chunk {CHUNK_N} is complete only
when every byte in `{CHUNK_START}..{CHUNK_END}` is source-owned as either code or
honestly classified data. Do not skip data regions, do not leave them as anonymous
fallback, and do not force data into `func_*` files just because it disassembles
into plausible MIPS. Data regions must be split, named conservatively, indexed in
the chunk dossier, and included in the manifest/rebuild path.

Do not continue into the next chunk unless chunk {CHUNK_N} is complete, verified,
documented, committed, and the only remaining work is a small read-only recon note.
The successful end state is a clean repo, exact rebuild preserved, chunk {CHUNK_N}
complete, docs current, and an exact next frontier.

Bridge instructions:
- Bridge URL: `{BRIDGE_URL}`.
- GUI agent/chat label: `{GUI_AGENT_NAME}`.
- The bridge is notification-only. It does not receive follow-up prompts itself;
  the coordinator will poll the bridge and paste the next prompt into your GUI
  chat window.
- When the source-ownership run is complete, verified, documented, and committed,
  ping the bridge before your final response:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/run-complete' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = 'chunk{CHUNK_N}-{RANGE_SLUG}'
    frontier = '{NEXT_EXPECTED_FRONTIER}'
    message = 'Chunk {CHUNK_N} source-ownership run is complete and ready for review handoff prompt.'
  } | ConvertTo-Json -Compress)
```

- If you hit a blocker instead of completing the run, ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/error' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = 'chunk{CHUNK_N}-{RANGE_SLUG}'
    frontier = '<exact blocked frontier>'
    message = '<short blocker summary with exact address/range>'
  } | ConvertTo-Json -Compress)
```

- If the bridge is unavailable, do not fake the ping. Record the failed ping command
  and error in your final report so the coordinator can recover manually.

Use full swarm capabilities. Assign agents/passes for:
- required reading and current-state reconciliation
- cleanup/doc consistency fixes
- chunk {CHUNK_N} code/data classification
- data-blob continuation analysis
- parent-undetected function discovery
- boundary planning
- code split review
- data classification/indexing
- adversarial review
- verification
- docs/running-log maintenance

Required reading before edits:
1. `C:\Users\Joe\Projects\OgreBattlel64\AGENTS.md`
2. `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\AGENTS.md`
3. `docs\DECOMP_LOG.md`
4. `docs\NEXT_STEPS.md`
5. `docs\WORKFLOW.md`
6. `docs\PLATFORM.md`
7. `{REQUIRED_REVIEW_DOCS}`
8. `docs\dossiers\lib-chunk{PREV_CHUNK_PADDED}-{PREV_RANGE_SLUG}.md`
9. `asm\original\rev0\manifest.json`
10. Relevant tools: `tools\scan_functions.js`, `tools\check_boundaries.js`,
    `tools\check_splits.js`, `tools\split_original_mips_part.js`,
    `tools\slice_chunk.js`, `tools\integrate_chunk.js`.

Known issues to fix first:
{KNOWN_ISSUES}

Also check for recurring known issues:
1. Remove or relocate root scratch artifacts. Root analysis dumps should not remain
   tracked. If still useful, move them under ignored `build/`; otherwise remove
   them from git.
2. Update `docs\WORKFLOW.md`, `AGENTS.md`, `docs\DECOMP_LOG.md`,
   `docs\NEXT_STEPS.md`, and `docs\PLATFORM.md` if counts/frontiers are stale.
3. Search for stale counts/frontiers from the previous run and fix current-state
   sections. Preserve historical sections only when clearly historical.
4. Confirm no data files carry "True entry", "read-before-write preamble", or
   function-boundary wording.

Current known state:
- Chunks already source-owned: `{OWNED_RANGE}`.
- Current tracked files: `{CURRENT_TRACKED_FILES}`.
- Current fallback chunks: `{CURRENT_FALLBACK_CHUNKS}`.
- Current source-owned bytes: `{CURRENT_SOURCE_OWNED_BYTES}`.
- Project coverage metric: `{CURRENT_SOURCE_OWNED_PERCENT}` of evidenced executable MIPS.
- Code-only classified bytes: `{CURRENT_CODE_ONLY_BYTES}`, about `{CURRENT_CODE_ONLY_PERCENT}`.
- Current frontier: `{PREV_FRONTIER}`.
- Incoming straddler or continuation: `{INCOMING_STRADDLER}`.
- Parent DB / overlay caveat: `{KNOWN_PARENT_DB_CAVEAT}`.

Chunk {CHUNK_N} required first action:
Classify the start of `{CHUNK_START}`. Determine whether the incoming straddler or
data continuation continues into chunk {CHUNK_N}, where it ends, and whether/where
code resumes. Do not assume the chunk is code. Start with content scan,
zero/ASCII/pointer density, return/prologue scan, and continuity from the previous
chunk.

Chunk {CHUNK_N} workflow:
1. Promote or prepare `{CHUNK_START}..{CHUNK_END}`.
2. Classify the chunk into ordered regions: data continuation, code region(s),
   inline data islands, and trailing data if present.
3. For parent-undetected code, use `tools\scan_functions.js` to seed prologue starts.
4. Use `slice_chunk.js --disasm` for code subregions of the mixed chunk.
5. Run code-analysis swarm over slices. Watch especially for:
   - frameless leaves
   - 2-word global-load preamble-orphans
   - delay-slot leaks
   - false straddler-head labels at slice seams
   - inline pointer tables
   - data that decodes as plausible MIPS
6. Run data-classification swarm over all data regions. Classify as `data_`,
   `table_`, `rodata_`, `zero_fill_`, or a more specific prefix only with evidence.
7. Integrate code and data into one full-chunk splits JSON in ROM order.
8. Run `check_boundaries` before writing tracked files. Fix every hard failure.
9. Run adversarial review on the proposed split. Require it to try to disprove
   code/data boundaries and function boundaries.
10. Apply fixes, rerun `check_boundaries`, then split with
    `split_original_mips_part.js --remove-source`.

Data-region handling requirements:
- Continue any incoming data straddler from the previous chunk until evidence shows
  it ends.
- For each data region, classify the best-supported type: `data_`, `table_`,
  `rodata_`, `zero_fill_`, or a more specific prefix only when backed by strings,
  pointer patterns, fixed strides, display-list opcodes, float constants, record
  structure, or cross-references.
- Record exact ROM ranges, byte counts, observed structure, pointer density, string
  content, stride hypotheses, and unresolved field semantics in the chunk dossier.
- If a data blob straddles into the next chunk, mark the chunk part honestly as an
  outgoing data continuation/head and leave the exact expected next-chunk first
  action.
- Run an adversarial pass against every data/code boundary: look for missed
  frameless leaves inside data, inline pointer tables inside code, and data words
  that merely decode as MIPS by coincidence.
- Do not call the chunk complete if any byte in `{CHUNK_START}..{CHUNK_END}`
  remains unclassified or only implicitly covered by fallback.

Running log / compaction safety:
- Keep `docs\DECOMP_LOG.md` updated as work progresses, not only at the end.
- After cleanup, record the cleanup fixes.
- After chunk classification, record exact region boundaries and evidence.
- After chunk split, record exact part counts, data/code counts, current frontier,
  tracked file count, fallback count, byte coverage, and unresolved caveats.
- If continuing beyond this chunk, prune/archive the running log between chunks
  before starting the next chunk:
  - Keep the top/current summary, active frontier, verification status, and latest
    next-step instructions concise and current.
  - Move bulky historical detail into `docs\archive\` or the relevant chunk dossier.
  - Do not delete durable facts; relocate them with clear references.
  - Ensure `AGENTS.md`, `docs\NEXT_STEPS.md`, and the latest dossier contain enough
    context to resume without reading the entire historical log.
  - After pruning, run a quick search for stale counts/frontiers and fix them before
    proceeding.
- If interrupted or compacted, the next agent must be able to resume from
  `AGENTS.md`, `docs\DECOMP_LOG.md`, `docs\NEXT_STEPS.md`, and the latest chunk
  dossier without guessing.
- Never leave "continue later" without an exact address and next action.

Docs required:
- `AGENTS.md`
- `docs\DECOMP_LOG.md`
- `docs\NEXT_STEPS.md`
- `docs\PLATFORM.md`
- `docs\WORKFLOW.md`
- New `docs\dossiers\lib-chunk{CHUNK_N}-{RANGE_SLUG}.md`
- New review handoff doc for this run.
- Update the previous chunk dossier if an incoming straddler/continuation boundary
  is refined.

Verification required before commit/final:
- `node --check` on touched JS tools.
- `node tools/check_manifest.js`
- `node tools/check_boundaries.js --splits <chunk splits> --disasm build/original-mips/rev0/code_{CHUNK_START_NODOT}_{CHUNK_END_NODOT}.s`
- `node tools/check_splits.js --splits <chunk splits> --disasm build/original-mips/rev0/code_{CHUNK_START_NODOT}_{CHUNK_END_NODOT}.s`
- Verify every byte in `{CHUNK_START}..{CHUNK_END}` is represented by a tracked
  code or data part.
- Verify no data files have function/true-entry wording.
- Verify no root scratch artifacts are tracked.
- `node tools/assemble_original_mips.js`
- `node tools/verify_setup.js`
- `node tools/audit_code_region.js`
- `git diff --check`
- `git status --short --branch`

Commit expectations:
- Commit cleanup/docs/tool fixes separately if they are meaningful.
- Commit chunk source ownership only after all verification passes.
- Add the review handoff as its own final commit if that matches current repo
  pattern.
- End with a clean working tree unless there is a clearly documented blocker.

Final report must include:
- Issues fixed.
- Exact chunk ranges and classifications.
- Function count, data count, and straddlers.
- Current tracked source-file count.
- Current fallback chunk count.
- Source-owned byte coverage and percent of evidenced executable MIPS.
- Code-only classified byte coverage if mixed data remains significant.
- Current frontier.
- Unresolved caveats.
- Verification commands and results.
- Recommended next run.
```
