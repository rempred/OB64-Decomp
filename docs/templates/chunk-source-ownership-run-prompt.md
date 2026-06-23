# Two-Chunk Source-Ownership Run Prompt Template

Use this template for future Rev 0 original-MIPS source-ownership runs. The
default unit of work is now two adjacent 64 KiB chunks. Replace every
`{PLACEHOLDER}` before sending it to an agent. Keep the data-region requirements
even when the next chunks are expected to be mostly code.

## Quick Update Checklist

- `{CHUNK_A_N}` / `{CHUNK_B_N}`: next two chunk numbers.
- `{CHUNK_A_START}` / `{CHUNK_A_END}`: first chunk exact z64 range.
- `{CHUNK_B_START}` / `{CHUNK_B_END}`: second chunk exact z64 range.
- `{PREV_FRONTIER}`: current frontier before the run.
- `{MID_FRONTIER}`: frontier after chunk A, usually `{CHUNK_A_END}`.
- `{NEXT_EXPECTED_FRONTIER}`: expected frontier after chunk B.
- `{CURRENT_TRACKED_FILES}` and `{CURRENT_FALLBACK_CHUNKS}`: from `verify_setup`.
- `{EXPECTED_FALLBACK_CHUNKS}`: expected fallback count after both chunks.
- `{CURRENT_SOURCE_OWNED_BYTES}` / `{EXPECTED_SOURCE_OWNED_BYTES}`.
- `{CURRENT_SOURCE_OWNED_PERCENT}` / `{EXPECTED_SOURCE_OWNED_PERCENT}`.
- `{CURRENT_CODE_ONLY_BYTES}` / `{CURRENT_CODE_ONLY_PERCENT}`.
- `{EXPECTED_CODE_ONLY_BYTES}` / `{EXPECTED_CODE_ONLY_PERCENT}` if knowable.
- `{INCOMING_STRADDLER}`: function or data straddler entering chunk A, or `none`.
- `{KNOWN_MID_STRADDLER}`: expected chunk A -> chunk B continuation, or `unknown`.
- `{KNOWN_PARENT_DB_CAVEAT}`: parent DB / overlay caveat for both chunks.
- `{PATCH_WORKBENCH_TARGETS}`: coordinator-side opportunistic patch-workbench
  targets from parent evidence, previous review caveats, known patch sites, and
  unresolved runtime-state requests. Use `none` when empty.
- `{REQUIRED_REVIEW_DOCS}`: latest review handoff docs for the prior run.
- `{KNOWN_ISSUES}`: cleanup/review issues to fix first.
- `{REVIEW_DOC_PATH}`: review handoff doc to create for this run, e.g.
  `docs/REVIEW_2026-06-23_chunks09-10-source-ownership.md`.
- `{BRIDGE_URL}`: usually `http://127.0.0.1:17776`.
- `{GUI_AGENT_NAME}`: the visible GUI agent/chat label, usually `Claude GUI`.

## Copyable Prompt

````text
You are continuing the Rev 0 original-MIPS source-ownership project in:

C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp

Primary objective:
Fix all known issues from the previous review, then fully source-own two adjacent
chunks:

- Chunk {CHUNK_A_N}: `{CHUNK_A_START}..{CHUNK_A_END}`
- Chunk {CHUNK_B_N}: `{CHUNK_B_START}..{CHUNK_B_END}`

Data ownership is part of the goal, not optional. Each chunk is complete only
when every byte in its range is source-owned as either code or honestly
classified data. Do not skip data regions, do not leave them as anonymous
fallback, and do not force data into `func_*` files just because it disassembles
into plausible MIPS. Data regions must be split, named conservatively, indexed in
the relevant chunk dossier, and included in the manifest/rebuild path.

For data-heavy work, source ownership alone is not enough. Durable data
inventory is part of the task: every data span should be discoverable by ROM
range, file path, class, confidence, evidence, and unresolved questions. Prefer
machine-readable indexes under `docs\data-index\rev0\` plus a human summary in
the relevant dossier/review doc. If you cannot create a useful parsed index for a
span, create a conservative raw-span index entry instead of leaving it invisible.

Do not continue beyond chunk {CHUNK_B_N}. The successful end state is a clean
repo, exact rebuild preserved, chunks {CHUNK_A_N} and {CHUNK_B_N} complete, docs
current, one review handoff created, and exact next frontier
`{NEXT_EXPECTED_FRONTIER}`.

Minimum success is BOTH chunks complete. If chunk {CHUNK_A_N} completes but chunk
{CHUNK_B_N} hits a hard blocker, do not send `run_complete`. Commit the safe
chunk-A work only if all gates pass, document the exact blocked frontier/risk,
and ping `agent_error` with the exact address and reason.

Bridge instructions:
- Bridge URL: `{BRIDGE_URL}`.
- GUI agent/chat label: `{GUI_AGENT_NAME}`.
- The bridge is notification-only. It does not receive follow-up prompts itself;
  the coordinator will poll the bridge, read your review doc, and paste the next
  prompt into your GUI chat window.
- When both chunks are complete, verified, documented, committed, and the review
  handoff document exists, ping the bridge before your final response:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/run-complete' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = 'chunks{CHUNK_A_N}-{CHUNK_B_N}-{RANGE_SLUG}'
    reviewDoc = '{REVIEW_DOC_PATH}'
    frontier = '{NEXT_EXPECTED_FRONTIER}'
    message = 'Chunks {CHUNK_A_N}-{CHUNK_B_N} source-ownership and review handoff are complete; ready for coordinator review and next-run prompt.'
  } | ConvertTo-Json -Compress)
```

- If you hit a blocker instead of completing both chunks, ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '{BRIDGE_URL}/agent/error' `
  -Body (@{
    agentName = '{GUI_AGENT_NAME}'
    runSlug = 'chunks{CHUNK_A_N}-{CHUNK_B_N}-{RANGE_SLUG}'
    frontier = '<exact blocked frontier>'
    message = '<short blocker summary with exact address/range>'
  } | ConvertTo-Json -Compress)
```

- If the bridge is unavailable, do not fake the ping. Record the failed ping
  command and error in your final report so the coordinator can recover manually.

Use full swarm capabilities. Assign agents/passes for:
- required reading and current-state reconciliation
- cleanup/doc consistency fixes
- parent workspace evidence sweep for current chunk addresses
- opportunistic patch-workbench metadata harvest when encountered
- chunk {CHUNK_A_N} code/data classification
- chunk {CHUNK_A_N} code split review
- chunk {CHUNK_A_N} data classification/indexing
- inter-chunk boundary/straddler review
- DECOMP_LOG prune/archive between chunks
- chunk {CHUNK_B_N} code/data classification
- chunk {CHUNK_B_N} code split review
- chunk {CHUNK_B_N} data classification/indexing
- parent-undetected function discovery
- boundary planning
- adversarial review
- verification
- docs/running-log maintenance
- review handoff writing

Required reading before edits:
1. `C:\Users\Joe\Projects\OgreBattlel64\AGENTS.md`
2. `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\AGENTS.md`
3. `docs\DECOMP_LOG.md`
4. `docs\NEXT_STEPS.md`
5. `docs\WORKFLOW.md`
6. `docs\PLATFORM.md`
7. `docs\CODE_REGION_AUDIT.md`
8. `{REQUIRED_REVIEW_DOCS}`
9. Latest relevant dossier before `{PREV_FRONTIER}`
10. `asm\original\rev0\manifest.json`
11. Relevant tools: `tools\dump_function_context.js`, `tools\plan_chunk.js`,
    `tools\scan_functions.js`, `tools\check_boundaries.js`,
    `tools\check_splits.js`, `tools\split_original_mips_part.js`,
    `tools\slice_chunk.js`, `tools\integrate_chunk.js`,
    `tools\check_manifest.js`.

Parent workspace evidence sweep:
- Search the parent repo `C:\Users\Joe\Projects\OgreBattlel64` for docs,
  scripts, wiki artifacts, trace reports, Project64 bridge/watch outputs, patch
  builders, editor hooks, mod-editor references, and other research artifacts
  that mention addresses inside or near the current two-chunk range
  `{CHUNK_A_START}..{CHUNK_B_END}`.
- Include both z64 ROM offsets and plausible RAM-address forms for the active
  overlay/code mapping. When searching RAM addresses, reconcile boot simple-map
  addresses, overlay-loaded RAM addresses, Rev 0/Rev 1 differences, and any
  patch/build relocation before treating a match as relevant.
- Treat parent artifacts as naming/control-flow leads only after they are
  reconciled against byte-exact Rev 0 disassembly and the current manifest.
  Never trust an old editor hook, patch site, runtime watch, trace label, or
  parent DB boundary just because it has a familiar name.
- Record every useful match, rejected false match, address-space correction, and
  contradiction in the relevant chunk dossier and the review handoff. Include
  exact parent repo paths and the reason each artifact did or did not affect
  split boundaries, names, data classification, or control-flow assumptions.

Patch Workbench Targets:
{PATCH_WORKBENCH_TARGETS}

Patch workbench harvest rules:
- Source ownership remains the priority. Do not start speculative patch hunts,
  do not widen the range, and do not delay chunk completion to prove patch
  behavior.
- Harvest patch metadata only when it is encountered naturally during parent
  evidence sweep, source/data classification, data/free-space classification,
  or review caveats.
- Static-only findings are `candidate`, `rejected`, or `needs-runtime`, never
  `proven`. Runtime trace, controlled mutation, or equivalent evidence is
  required before calling behavior or patch safety proven.
- If anything useful is found, prefer one run/chunk-scoped machine-readable JSON
  artifact under `docs\patch-workbench\rev0\`, plus a short dossier/review
  summary. Suggested top-level fields: `runSlug`, `chunks`, `sourceRange`,
  `behaviorTags`, `hookSites`, `dataFreeSpace`, `runtimeRequests`, `rejected`,
  and `provenance`.
- Behavior tags should include tag/name, confidence, provenance path(s), exact
  ROM/RAM range, evidence, and unresolved questions.
- Candidate or rejected hook sites should include status, ROM/RAM address,
  owning file/function/data span, original words, displaced instructions, likely
  resume address, delay-slot/prologue/epilogue/branch hazards, overlay/RAM
  address-space caveats, register/state assumptions, and the reason for the
  classification.
- Data/free-space notes should classify padding, caves, tail space, tables, or
  data as `candidate`, `rejected`, or `needs-runtime`, with ownership, collision
  risk, loader/tail constraints, and evidence.
- Runtime-state requests should be precise: required savestate or scenario,
  watchpoints, registers, overlay mapping, memory ranges, branch/register proof,
  or mutation needed to prove behavior or patch safety.
- If no patch-workbench metadata is encountered, say so briefly in the dossier
  and review handoff. Do not create empty noise.

Known issues to fix first:
{KNOWN_ISSUES}

Also check for recurring known issues:
1. Remove or relocate root scratch artifacts. Root analysis dumps should not
   remain tracked. If still useful, move them under ignored `build/`; otherwise
   remove them from git.
2. Update `docs\WORKFLOW.md`, `AGENTS.md`, `docs\DECOMP_LOG.md`,
   `docs\NEXT_STEPS.md`, and `docs\PLATFORM.md` if counts/frontiers are stale.
3. Search for stale counts/frontiers from the previous run and fix current-state
   sections. Preserve historical sections only when clearly historical.
4. Confirm no data files carry "True entry", "read-before-write preamble", or
   function-boundary wording.
5. Confirm prior review-doc commit tables use real commit hashes, not placeholders.

Current known state:
- Chunks already source-owned: `{OWNED_RANGE}`.
- Current tracked files: `{CURRENT_TRACKED_FILES}`.
- Current fallback chunks: `{CURRENT_FALLBACK_CHUNKS}`.
- Current source-owned bytes: `{CURRENT_SOURCE_OWNED_BYTES}`.
- Project coverage metric: `{CURRENT_SOURCE_OWNED_PERCENT}` of evidenced executable MIPS.
- Code-only classified bytes: `{CURRENT_CODE_ONLY_BYTES}`, about `{CURRENT_CODE_ONLY_PERCENT}`.
- Current frontier: `{PREV_FRONTIER}`.
- Expected mid-run frontier after chunk {CHUNK_A_N}: `{MID_FRONTIER}`.
- Expected final frontier after chunk {CHUNK_B_N}: `{NEXT_EXPECTED_FRONTIER}`.
- Expected source-owned bytes after both chunks: `{EXPECTED_SOURCE_OWNED_BYTES}`.
- Expected project coverage after both chunks: `{EXPECTED_SOURCE_OWNED_PERCENT}`.
- Expected fallback chunks after both chunks: `{EXPECTED_FALLBACK_CHUNKS}`.
- Incoming straddler or continuation: `{INCOMING_STRADDLER}`.
- Known or suspected chunk {CHUNK_A_N} -> chunk {CHUNK_B_N} straddler:
  `{KNOWN_MID_STRADDLER}`.
- Parent DB / overlay caveat: `{KNOWN_PARENT_DB_CAVEAT}`.

Chunk {CHUNK_A_N} required first action:
Classify the start of `{CHUNK_A_START}`. Determine whether the incoming
straddler or data continuation continues into chunk {CHUNK_A_N}, where it ends,
and whether/where code resumes. Do not assume the chunk is code. Start with
content scan, zero/ASCII/pointer density, return/prologue scan, and continuity
from the previous chunk.

Chunk {CHUNK_A_N} workflow:
1. Promote or prepare `{CHUNK_A_START}..{CHUNK_A_END}`.
2. Classify the chunk into ordered regions: incoming continuation, code
   region(s), inline data islands, interior data, and trailing continuation if
   present.
3. For parent-detected code, use `dump_function_context` + `plan_chunk`. For
   parent-undetected code, use `tools\scan_functions.js` to seed prologue starts.
4. Use `slice_chunk.js --disasm` for code subregions of mixed chunks.
5. Run code-analysis swarm over slices. Watch especially for frameless leaves,
   2-word global-load preamble-orphans, delay-slot leaks, false straddler-head
   labels at slice seams, inline pointer tables, data that decodes as plausible
   MIPS, large switch dispatchers with `jr $v0`, and relocated overlay tail-jumps
   that are not boundaries.
6. Run data-classification swarm over all data regions.
7. Integrate code and data into one full-chunk splits JSON in ROM order.
8. Run `check_boundaries` before writing tracked files. Fix every hard failure.
9. Run adversarial review on the proposed split.
10. Apply fixes, rerun `check_boundaries`, then split with
    `split_original_mips_part.js --remove-source`.

Mid-run gate before starting chunk {CHUNK_B_N}:
- Run at least:
  - `node tools/check_manifest.js`
  - `node tools/check_boundaries.js --splits <chunk-A splits> --disasm build/original-mips/rev0/code_{CHUNK_A_START_NODOT}_{CHUNK_A_END_NODOT}.s`
  - `node tools/check_splits.js --splits <chunk-A splits> --disasm build/original-mips/rev0/code_{CHUNK_A_START_NODOT}_{CHUNK_A_END_NODOT}.s`
  - `node tools/assemble_original_mips.js`
  - `git diff --check`
- Commit chunk {CHUNK_A_N} source ownership if and only if those gates pass.
- Update `docs\DECOMP_LOG.md`, `docs\NEXT_STEPS.md`, `docs\PLATFORM.md`,
  `docs\WORKFLOW.md`, `AGENTS.md`, and the chunk {CHUNK_A_N} dossier with exact
  counts/frontier.
- Prune/archive `docs\DECOMP_LOG.md` between chunks if it has grown bulky:
  keep current summary/frontier/verification/next action concise, move bulky
  details to `docs\archive\` or the chunk dossier, and search for stale counts
  before proceeding.
- If chunk {CHUNK_A_N} has an outgoing straddler into chunk {CHUNK_B_N}, write
  the exact first action for chunk {CHUNK_B_N}.

Chunk {CHUNK_B_N} required first action:
Classify the start of `{CHUNK_B_START}`. If chunk {CHUNK_A_N} ended with an
outgoing straddler or data continuation, emit the honest continuation first.
Confirm its end from disassembly/data evidence before splitting the rest of the
chunk.

Chunk {CHUNK_B_N} workflow:
Repeat the same classification, code/data splitting, analysis swarm,
adversarial review, and verification process used for chunk {CHUNK_A_N}. Do not
assume the second chunk has the same code/data shape as the first.

Data Territory Mode:
Switch from function-splitting-first mode to data ownership plus data inventory
mode whenever a target range is data-dominant, past the evidenced executable
MIPS extent, or contains substantial non-code regions. Mixed chunks still need
normal function splitting for code spans, but all data spans must receive the
inventory treatment below.

The goal in Data Territory Mode is to account for every byte, classify every
span, preserve every raw byte, and build durable indexes that future agents can
query. Do not stop at "byte-exact rebuild passes" if the data is still
unindexed.

Required outputs for each data-dominant range or substantial data span:
- Byte-exact tracked source owners for every span.
- A range inventory table with start, end, size, file path, class, confidence,
  evidence, and unresolved questions.
- A machine-readable JSON index under `docs\data-index\rev0\` when the range has
  strings, pointers, records, tables, display lists, archive-like headers, or
  repeated structure. Include a dossier summary even when the JSON is still
  conservative.
- String inventory where applicable.
- Pointer/RAM-reference inventory where applicable.
- Record/table stride hypotheses where applicable.
- Compression/archive/header scan results.
- Cross-reference notes from parent repo docs/scripts/wiki/traces/editor code.
- Explicit list of undecoded spans, with why they remain undecoded.
- Verification that all bytes rebuild exactly and no data remains only in
  fallback.

Parsing requirements:
- If a structure is regular, fixed-stride, pointer-based, string-based,
  compressed, display-list-like, archive-like, or table-like, attempt to parse it
  into an index.
- If parsing is uncertain, emit a conservative raw/indexed representation rather
  than inventing field names.
- Mark hypothesis-grade fields as hypotheses.
- Do not claim semantic meaning unless backed by format evidence, parent
  artifact reconciliation, runtime evidence, or known N64/OB64 structure.

Indexing requirements:
- Every data file should be discoverable by ROM range and class.
- Every parsed table should list row count, row size if known, raw range,
  unresolved fields, and confidence.
- Every string pool should list offsets and decoded text where possible.
- Every pointer table should list raw pointer values, resolved ROM/RAM targets
  when possible, and unresolved targets.
- Every unknown blob should still have size, entropy/pattern notes, nearby
  references, and follow-up recommendations.
- Distinguish `parsed`, `raw-but-classified`, and `undecoded`. A span can be
  byte-owned and classified without being semantically decoded; say so plainly.

Data-region handling requirements:
- Continue any incoming data/function straddler until evidence shows it ends.
- For each data region, classify the best-supported type: `data_`, `table_`,
  `rodata_`, `zero_fill_`, `jumptable_`, `rsp_ucode_`, or a more specific prefix
  only when backed by strings, pointer patterns, fixed strides, display-list
  opcodes, float constants, record structure, or cross-references.
- Record exact ROM ranges, byte counts, observed structure, pointer density,
  string content, stride hypotheses, and unresolved field semantics in the
  relevant chunk dossier.
- If a data blob or function straddles into the next chunk after chunk
  {CHUNK_B_N}, mark the chunk part honestly as an outgoing continuation/head and
  leave the exact expected next-run first action.
- Run an adversarial pass against every data/code boundary.
- Do not call either chunk complete if any byte remains unclassified or only
  implicitly covered by fallback.

Running log / compaction safety:
- Keep `docs\DECOMP_LOG.md` updated as work progresses, not only at the end.
- After cleanup, record the cleanup fixes.
- After each chunk classification, record exact region boundaries and evidence.
- After each chunk split, record exact part counts, data/code counts, current
  frontier, tracked file count, fallback count, byte coverage, and unresolved
  caveats.
- Prune/archive between chunks before starting chunk {CHUNK_B_N} if the log is
  bulky. Do not delete durable facts; relocate them with clear references.
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
- New `docs\dossiers\lib-chunk{CHUNK_A_N}-{CHUNK_A_RANGE_SLUG}.md`
- New `docs\dossiers\lib-chunk{CHUNK_B_N}-{CHUNK_B_RANGE_SLUG}.md`
- New `docs\patch-workbench\rev0\...` artifact(s), only if opportunistic
  patch-workbench metadata was actually harvested.
- New review handoff doc for this two-chunk run: `{REVIEW_DOC_PATH}`.
- Update the previous chunk dossier if an incoming straddler/continuation
  boundary is refined.

Review handoff requirements:
- Create `{REVIEW_DOC_PATH}` before the bridge ping.
- Make it self-contained enough for a fresh reviewer to understand exactly what
  changed, what was verified, what remains risky, and where to resume without
  reading the full chat.
- Cover BOTH chunks separately and together.
- Include exact addresses, file counts, byte counts, commands, commits, caveats,
  current frontier, and reviewer checklist.
- Include opening fixes, parent DB / overlay contradictions, mistakes corrected,
  parent workspace evidence matches/contradictions, data classification, tooling
  changes, verification, files changed, current frontier, unresolved caveats, and
  reviewer checklist.
- Include patch-workbench harvests if encountered: behavior tags, hook-site
  candidates/rejections, original words/displaced instructions/resume addresses,
  hazards, overlay/RAM caveats, data/free-space notes, runtime-state requests,
  and artifact paths. If none were encountered, state that explicitly.
- For any data-dominant range or substantial data span, include total data bytes
  source-owned, parsed bytes, raw-but-classified bytes, undecoded bytes, data
  files added, index files added, known format families found, and exact next
  data frontier.
- Do not write a vague progress summary.
- Do not call mixed code/data chunks "fully split into functions"; say
  "source-owned as code/data parts."

Verification required before final commit/final:
- `node --check` on touched JS tools.
- `node tools/check_manifest.js`
- `node tools/check_boundaries.js --splits <chunk-A splits> --disasm build/original-mips/rev0/code_{CHUNK_A_START_NODOT}_{CHUNK_A_END_NODOT}.s`
- `node tools/check_splits.js --splits <chunk-A splits> --disasm build/original-mips/rev0/code_{CHUNK_A_START_NODOT}_{CHUNK_A_END_NODOT}.s`
- `node tools/check_boundaries.js --splits <chunk-B splits> --disasm build/original-mips/rev0/code_{CHUNK_B_START_NODOT}_{CHUNK_B_END_NODOT}.s`
- `node tools/check_splits.js --splits <chunk-B splits> --disasm build/original-mips/rev0/code_{CHUNK_B_START_NODOT}_{CHUNK_B_END_NODOT}.s`
- Verify every byte in both chunks is represented by a tracked code or data part.
- Verify no data files have function/true-entry wording.
- Verify any new `docs\data-index\rev0\*.json` files parse as valid JSON and
  match the ranges documented in dossiers/review docs.
- Verify any new `docs\patch-workbench\rev0\*.json` files parse as valid JSON
  and do not claim static-only findings as proven.
- Verify no root scratch artifacts are tracked.
- `node tools/assemble_original_mips.js`
- `node tools/verify_setup.js`
- `node tools/audit_code_region.js`
- `git diff --check`
- `git status --short --branch`
- Confirm `{REVIEW_DOC_PATH}` exists, is current, and includes verification
  numbers from this run.

Commit expectations:
- Commit cleanup/docs/tool fixes separately if meaningful.
- Commit chunk {CHUNK_A_N} source ownership after mid-run gates pass.
- Commit chunk {CHUNK_B_N} source ownership after full gates pass.
- Add the review handoff as its own final commit if that matches current repo
  pattern.
- End with a clean working tree unless there is a clearly documented blocker.

Final report must include:
- Issues fixed.
- Exact chunk ranges and classifications for both chunks.
- Function count, data count, and straddlers for both chunks.
- Current tracked source-file count.
- Current fallback chunk count.
- Source-owned byte coverage and percent of evidenced executable MIPS.
- Code-only classified byte coverage if mixed data remains significant.
- Current frontier.
- Unresolved caveats.
- Patch-workbench artifacts and unresolved runtime-state requests, if any.
- Verification commands and results.
- Review doc path.
- Recommended next run.

End Chunk {CHUNK_A_N}-{CHUNK_B_N} prompt
````
