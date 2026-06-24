Use Ultracode mode.

# OB64 Data Territory Ownership Prompt Template

Use this template for Rev 0 data-territory ownership runs after the
executable-MIPS frontier has ended. This template is for ownership work over
natural data units: data sections, archive families, parser-backed formats,
table families, asset banks, or other evidence-backed data groups.

Chunks are still required for coverage accounting, progress reporting, and
fallback boundaries. Chunks are not the primary unit when a stronger natural
data boundary is available.

Do not use this template for mixed code/data ranges, uncertain executable
boundaries, credible hidden-code risk, unresolved parser decisions that need a
smaller pass, patch-workbench/runtime-state questions that dominate the work, or
any range where review quality would suffer. Use the chunk source-ownership
template for those cases.

Replace every `{PLACEHOLDER}` before sending it to an agent.

## Quick Update Checklist

- `{DATA_UNIT_TITLE}`: short human title, e.g. `Raw graphics bank after chunk 47`.
- `{DATA_UNIT_SLUG}`: file-safe slug for indexes/dossiers.
- `{NATURAL_UNIT}`: archive, table family, asset bank, raw tail section, etc.
- `{ROM_START}` / `{ROM_END}`: exact z64 range for the natural unit or batch.
- `{CHUNK_COVERAGE}`: exact chunks and partial chunk spans covered.
- `{CURRENT_FRONTIER}`: current source-ownership frontier before this run.
- `{EXPECTED_FRONTIER}`: expected source-ownership frontier after this run.
- `{SURVEY_INDEX_PATHS}`: survey inventory/review paths that justify this batch.
- `{PARENT_TOOLING_LEADS}`: concrete parent scripts/tools/wiki/editor/artifact
  leads to compare, or `none known`.
- `{KNOWN_CONTINUATIONS}`: incoming/outgoing data continuations, if known.
- `{KNOWN_ISSUES}`: review issues to fix before the new ownership work.
- `{PATCH_WORKBENCH_TARGETS}`: opportunistic patch-workbench targets, or `none`.
- `{RUNTIME_STATE_ONESHOT}`: bounded runtime-state one-shot, usually `none`.
- `{REVIEW_DOC_PATH}`: review handoff doc to create for this run.
- `{RUN_SLUG}`: bridge-safe slug for this run.
- `{BRIDGE_URL}`: usually `http://127.0.0.1:17776`.
- `{GUI_AGENT_NAME}`: usually `Claude GUI`.

## Copyable Prompt

````text
Use Ultracode mode.

# OB64 Data Territory Ownership: {DATA_UNIT_TITLE}

You are continuing the Rev 0 source-ownership/data-indexing project in:

C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp

This is a data-territory ownership run. The primary unit is the natural data
unit below, not a pair of chunks:

- Natural unit: `{NATURAL_UNIT}`
- ROM range: `{ROM_START}..{ROM_END}`
- Chunk coverage: `{CHUNK_COVERAGE}`
- Current frontier: `{CURRENT_FRONTIER}`
- Expected frontier after this run: `{EXPECTED_FRONTIER}`
- Survey evidence: `{SURVEY_INDEX_PATHS}`
- Parent tooling leads: `{PARENT_TOOLING_LEADS}`
- Known continuations: `{KNOWN_CONTINUATIONS}`

Machine-readable indexes are canonical. Human-readable Markdown is the
review/dossier layer.

## Ownership Standard

A data section is owned only if the final evidence includes:

- byte-exact source ownership for every byte, or explicit unknown gaps
- offset, size, type/family, and source-file provenance
- parser/dumper/catalog/editor evidence, or strong byte-pattern evidence
- hidden-MIPS/code-risk checks
- exact chunk coverage accounting
- confidence and caveats
- unresolved fields/questions captured for follow-up

Final ownership status must be one of: `yes`, `partial`, or `no`.

A broad survey alone is not ownership. Do not claim full ownership across
unresolved gaps, unresolved schema conflicts, or credible hidden-code risk.

## Required Reading Before Edits

1. `C:\Users\Joe\Projects\OgreBattlel64\AGENTS.md`
2. `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\AGENTS.md`
3. `docs\PLATFORM.md`
4. `docs\REV0_SCOPE.md`
5. `docs\WORKFLOW.md`
6. `docs\DECOMP_LOG.md`
7. `docs\NEXT_STEPS.md`
8. `docs\CODE_REGION_AUDIT.md`
9. `docs\FULL_ROM_SOURCE_MANIFEST.md`
10. `asm\original\rev0\manifest.json`
11. `docs\runtime-state-catalog.md`
12. `docs\runtime-state-requests.md`
13. `{SURVEY_INDEX_PATHS}`
14. Latest relevant `docs\data-index\rev0\*.json` and `docs\dossiers\*.md`
    covering or adjacent to `{ROM_START}..{ROM_END}`.

## Known Issues To Fix First

{KNOWN_ISSUES}

Before starting new ownership work, fix concrete issues from the previous
review when they are in scope and safe to fix. Do not broaden this into
unrelated cleanup. If a known issue would require a different run, record it in
the review handoff and proceed only if the current target remains safe.

## Swarm Operating Model

Use true subagents/workstreams if available. If not, run the following as
separate named passes and cross-check their conclusions.

Before broad edits, write a short swarm plan in your notes or review draft:

- Which passes are being executed.
- Whether true subagents/workstreams are available.
- Which files, if any, each pass may edit.
- Where each pass must report findings.
- Which pass owns final consolidation.

Default edit policy:

- Investigation passes are read-only.
- The lead/coordinator pass makes final source/index/doc edits after
  reconciliation unless this prompt explicitly allows distributed edits.
- If pass findings conflict, resolve with byte/parser evidence.
- If a conflict remains unresolved, downgrade the relevant range to `partial`,
  `raw-but-classified`, or `undecoded`.
- Record rejected leads and disagreements instead of smoothing them away.

Required passes:

1. Lead/coordinator pass
   - Own final decisions and reconciliation.
   - Prevent contradictory indexes, duplicate source owners, and stale frontier
     docs.
   - Consolidate all pass findings into the final machine-readable index and
     review handoff.

2. Range mapper pass
   - Map exact byte ranges, current owners, gaps, alignments, chunk coverage,
     and boundaries.
   - Identify natural archive/table/asset-bank limits.
   - Continue incoming data spans honestly before opening new spans.

3. Parent tooling comparator pass
   - Inspect parent repo dumpers, parsers/exporters, archive catalogs,
     table/graphics/text decoders, editor loaders, generated wiki JSON,
     ModderResources leads/audit output, existing data indexes, and relevant
     `scripts/`, `tools/`, `wiki/`, `ModderResources/`, and `editor/` files.
   - Prove or reject matches with exact ROM offsets, sizes, source paths, and
     reasoned evidence.
   - Distinguish ROM offsets, RAM addresses, archive offsets, destination RAM,
     and heuristic scanner output.

4. Parser/schema analyst pass
   - Identify known formats, candidate schemas, record sizes, sentinels,
     pointers, compression, palettes, display lists, strings, tables, or asset
     banks.
   - Prefer parser-backed decoding when evidence supports it.
   - Mark fields as decoded, guessed, or unknown.
   - Do not invent semantic field names without format, parent-tool, runtime, or
     byte-pattern evidence.

5. Hidden-MIPS/code-risk adversary pass
   - Try to disprove data-only assumptions.
   - Check for plausible MIPS entrypoints, branch/jump shapes, prologues,
     returns, code-like words, pointer tables, references from known code,
     alignment traps, and data that may be copied/executed at runtime.
   - If credible code risk remains, stop broad ownership claims and recommend a
     smaller chunk-fallback or mixed-range pass.

6. Machine-readable index QA pass
   - Validate JSON shape, offset math, contiguous coverage, chunk accounting,
     confidence values, status values, unresolved fields, and source-owner
     paths.
   - Confirm every subrange is one of `parsed`, `raw-but-classified`,
     `undecoded`, `owned-candidate`, or `gap`.
   - Confirm JSON ranges match dossier/review prose and actual source files.

7. Ownership reviewer pass
   - Independently decide `yes`, `partial`, or `no` against the ownership
     standard above.
   - Record caveats, rejected leads, and required follow-ups.
   - Do not let optimism from the implementation passes override missing
     evidence.

## Required Parent Repo Comparison

For the target range, inspect relevant material from:

- parent `scripts/` dumpers, parsers, tests, and archive catalogs
- parent `tools/` extraction, verification, graphics, text, table, and runtime
  utilities
- parent `wiki/` generated JSON and research artifacts
- parent `ModderResources/` and modder-resource audit outputs
- parent `editor/` parsers, loaders, exporters, and generated data files
- local `docs\data-index\rev0\` indexes and dossiers
- local build or coverage reports relevant to source ownership

Record useful matches and rejected leads in the machine-readable index or review
notes. Broad statements such as "searched scripts" are not enough; name the
artifact path and why it did or did not affect ownership.

## Runtime-State One-Shot

{RUNTIME_STATE_ONESHOT}

When this is `none`, do not invent a runtime pass. If it is populated, keep it
bounded and follow `TestingWorkFlow.MD`. Runtime evidence can support parser
meaning, loaded-data behavior, or patch safety, but source/data ownership remains
byte-exact and static unless the prompt explicitly asks for runtime proof.

## Patch Workbench Targets

{PATCH_WORKBENCH_TARGETS}

Patch-workbench harvest is opportunistic only. Do not turn this data ownership
run into a speculative patch hunt. Static-only findings are `candidate`,
`rejected`, or `needs-runtime`, never `proven`.

## Ownership Work Requirements

For the target natural data unit:

- Create or update byte-exact tracked source owners for every byte in
  `{ROM_START}..{ROM_END}`, or explicitly document gaps.
- Continue incoming data/function straddlers until evidence shows they end.
- Split at evidence-backed natural boundaries, zero-fill/alignment boundaries,
  archive/table boundaries, or parser-backed record boundaries.
- Preserve raw bytes exactly.
- Prefer specific names only when evidence supports them. Otherwise use
  conservative `data_` / `zero_fill_` names and explain why.
- Do not force data into `func_*` files because it disassembles as plausible
  MIPS.
- Do not call padding or static data patch space without loader/runtime proof.

## Machine-Readable Deliverables

Create or update canonical machine-readable inventory under:

`docs\data-index\rev0\{DATA_UNIT_SLUG}.json`

The JSON should include, as applicable:

- `schemaVersion`
- `dataUnit`
- `romRange`
- `chunkCoverage`
- `frontierBefore`
- `frontierAfter`
- `sourceOwners`
- `subregions`
- `typeFamily`
- `status`
- `confidence`
- `parserEvidence`
- `dumperEvidence`
- `catalogEvidence`
- `editorEvidence`
- `modderResourceEvidence`
- `runtimeEvidence`
- `hiddenCodeRisk`
- `decodedRecords`
- `unresolvedFields`
- `rejectedLeads`
- `ownershipAssessment`
- `recommendedFollowups`

Status values should be conservative:

- `parsed`: parser/schema evidence explains the span well enough to decode it.
- `raw-but-classified`: byte-owned and classified by evidence, but not
  field-decoded.
- `undecoded`: byte-owned or surveyed, but type/schema remains unknown.
- `owned-candidate`: survey-level or partial evidence suggests an ownership
  target, but the ownership pass is not complete.
- `gap`: explicit unowned or unresolved gap requiring follow-up.

## Human-Readable Deliverables

Create or update a concise dossier/review summary when useful:

`docs\dossiers\{DATA_UNIT_SLUG}.md`

Markdown should summarize the machine-readable data, not replace it.

Update `docs\DECOMP_LOG.md`, `docs\NEXT_STEPS.md`, `docs\PLATFORM.md`,
`docs\WORKFLOW.md`, and `AGENTS.md` only when durable frontier/count/workflow
facts change.

Create `{REVIEW_DOC_PATH}` before the bridge ping. The review must be
self-contained enough for a fresh coordinator to decide the next prompt without
reading the full chat.

## Stop And Fallback Conditions

Use smaller batches or chunk fallback if any of these appear:

- mixed code/data
- credible hidden-code risk
- uncertain natural boundary
- unknown schema needing focused parser work
- parent tooling evidence conflicts with byte evidence
- patch-workbench or runtime-state implications
- dirty or incomplete prior run state
- review quality would suffer from a larger batch

If a fallback is required, document the exact address/range, reason, and
recommended next unit. Do not push through just to preserve the planned batch.

## Verification Required

Run the appropriate subset before final commit/final report:

- JSON parse/shape checks for every new or changed
  `docs\data-index\rev0\*.json`.
- Source-owner coverage check for every byte in `{ROM_START}..{ROM_END}`.
- `node tools/check_manifest.js`
- `node tools/assemble_original_mips.js`
- `node tools/verify_setup.js` when source-owner manifests or rebuild-relevant
  files changed enough to require the full proof.
- `node tools/audit_code_region.js` when touching configured code-region data or
  changing code/data frontier claims.
- `git diff --check`
- `git status --short --branch`

If a command is skipped, explain why in the review handoff.

## Bridge Completion

When the target is complete, verified, documented, committed, and the review
handoff document exists, ping the bridge before your final response:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/run-complete' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = '{RUN_SLUG}'
    reviewDoc = '{REVIEW_DOC_PATH}'
    frontier = '{EXPECTED_FRONTIER}'
    message = '{DATA_UNIT_TITLE} data-territory ownership and review handoff are complete; ready for coordinator review and next prompt.'
  } | ConvertTo-Json -Compress)
```

If blocked, ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/error' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = '{RUN_SLUG}'
    frontier = '<exact blocked frontier>'
    message = '<short blocker summary with exact address/range>'
  } | ConvertTo-Json -Compress)
```

If the bridge is unavailable, do not fake the ping. Record the failed command
and error in the final report.

## Final Report Requirements

End with a concise report covering:

- natural unit and exact ROM range
- chunk coverage
- code/data composition
- machine-readable index paths
- parent tooling inspected
- parser/dumper/catalog/editor matches and rejected leads
- hidden-MIPS adversarial result
- ownership status: `yes`, `partial`, or `no`
- caveats and unresolved fields
- recommended next ownership unit or fallback chunk range
- runtime-state one-shot status
- patch-workbench status
- verification commands and results
- review doc path

End {DATA_UNIT_TITLE} data ownership prompt
````
