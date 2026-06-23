# Review Handoff Prompt Template

Fallback template only. Future chunk prompts should normally require the agent to
create the review handoff before it pings the bridge. Use this follow-up prompt
only when a chunk/run is complete but the agent did not create a sufficient review
handoff doc. Replace `YYYY-MM-DD` and `<short-run-slug>` before sending it to the
agent.
If the agent is using the local bridge, also replace `<bridge-url>`,
`<gui-agent-name>`, and `<current-frontier>`.

```text
Create a review handoff document for this run under:

docs/REVIEW_YYYY-MM-DD_<short-run-slug>.md

The review doc must be self-contained enough that a fresh reviewer can understand
exactly what changed, what was verified, what remains risky, and where to resume
without reading the full chat.

Do not write a vague progress summary. Include exact addresses, file counts, byte
counts, commands, commits, and caveats.

Required sections:

1. Title
Use a precise title with the date, run topic, and ROM range/chunk range, for example:
# Review Handoff: Chunk 7 Source-Ownership (`0x71000..0x81000`)

2. TL;DR
Include:
- What was completed.
- Exact ROM range(s).
- Composition: number of code files, data files, straddlers, tables, rodata, etc.
- Tracked source-file count before -> after.
- Generated fallback count before -> after.
- Source-owned byte coverage and percent of evidenced executable MIPS.
- Code-only coverage if the chunk contains significant data.
- Whether exact rebuild is preserved.
- Current frontier.

3. Commits
List every commit in this run:
- Commit hash.
- One-line purpose.
- Whether it is cleanup/tooling/source/docs/review handoff.

4. Opening Fixes
List any known issues fixed before extending work:
- Stale docs/counts.
- Scratch artifacts removed.
- Tooling fixes.
- Past `.s` split/name corrections.
- Manifest/hash resyncs.
For each, include exact files changed and why.

5. Work Completed
For each chunk/range:
- ROM range.
- Classification: code/data/mixed.
- Exact subranges.
- Function count.
- Data/table/rodata count.
- Straddlers in/out.
- Important boundary decisions.
- Evidence used: overlay map, parent DB, prologue scan, return scan, pointer
  density, ASCII/string evidence, table patterns, etc.

6. Parent DB / Overlay Map Contradictions
Document every contradiction found:
- Parent over-merge.
- Parent missed functions.
- False-positive data-as-function labels.
- Overlay-map gaps.
- Any parent-undetected code.
Include exact addresses and how the correction was proven.

7. Mistakes Found And Corrected
Include:
- Delay-slot leaks.
- Preamble-orphan mislabels.
- Slice seam mistakes.
- Data/code misclassification.
- Over-split or under-split functions/data.
- Bad names downgraded to `func_*`.
- Any prior-run mistakes corrected.
Include before/after ranges.

8. Data Classification
If any data was split:
- Exact data ranges.
- Names used.
- Evidence for each data class.
- Whether it straddles chunks.
- Known unknowns / field semantics not decoded.
- Whether any data region has MIPS-looking decode comments that should be ignored.

8a. Patch Workbench Harvest
This section is opportunistic and must not turn the source-ownership run into a
patch hunt. If no patch-workbench metadata was encountered naturally, write:
`None encountered during source-ownership work.`

If anything was encountered, include:
- Artifact path(s), preferably machine-readable JSON under
  `docs\patch-workbench\rev0\`.
- Behavior tags with confidence, provenance path(s), exact ROM/RAM ranges,
  evidence, and unresolved questions.
- Candidate, rejected, and `needs-runtime` hook sites with original words,
  displaced instructions, likely resume address, and owning source/data span.
- Delay-slot, prologue, epilogue, branch, overlay, and RAM address-space hazards.
- Data/free-space classification for any padding, cave, tail-space, table, or
  data range relevant to future patching.
- Runtime-state requests needed to prove behavior, registers, overlay mapping,
  memory layout, or patch safety.

8b. Runtime-State Catalog Evidence
If no runtime states were used, write:
`No runtime states were used; conclusions are static unless otherwise noted.`

If runtime states were used, include:
- Exact state path under
  `C:\Users\Joe\Projects\OgreBattlel64\runtime-states\vanilla\rev0`.
- Header/ROM identity that was checked: CRC pair, country, version, and whether
  it matched the running ROM.
- Broad catalog folder chosen and why it was the nearest state.
- Exact ROM/RAM addresses, watchpoints, breakpoints, registers, memory ranges,
  and frame/event ranges inspected.
- Observation result and confidence: proven by runtime trace/controlled
  mutation, supported candidate, rejected static lead, or still `needs-runtime`.
- Any limitations from using a broad stable state rather than a frame-perfect
  capture.

State names and folder names are convenience labels only. Do not treat a state
label as semantic proof. If the needed situation was missing, record a precise
runtime-state request in `docs\runtime-state-requests.md` instead of guessing.

8c. Runtime-State Request Log Changes
Summarize updates to `docs\runtime-state-requests.md`:
- Requests opened.
- Requests served by an existing state, with exact state path and proof summary.
- Requests left as `needs-capture`, `needs-runtime`, or
  `candidate-state-available`.
- Requests superseded, with the replacement ID or reason.

If the log was unchanged, write:
`No runtime-state request-log changes.`

9. Tooling Changes
For every tool touched or added:
- File path.
- Purpose.
- Example command.
- Whether it is tracked durable tooling or gitignored scratch.
- Any known limitations.

10. Verification
List exact commands run and results:
- `node --check ...`
- `node tools/check_manifest.js`
- `node tools/check_boundaries.js --splits ... --disasm ...`
- `node tools/check_splits.js --splits ... --disasm ...`
- data-header scan, if run
- root scratch artifact scan, if run
- `node tools/assemble_original_mips.js`
- `node tools/verify_setup.js`
- `node tools/audit_code_region.js`
- `git diff --check`
- `git status --short --branch`

Do not just say "verification passed." Include the important output numbers:
- tracked chunks
- tracked files
- fallback chunks
- code SHA
- ROM SHA
- current frontier

11. Files Changed
Summarize by category:
- Source `.s` files added/removed/renamed.
- Manifest changes.
- Tools.
- Docs.
- Any generated/scratch files intentionally not tracked.
- Confirm no unintended root-level scratch artifacts are tracked.

12. Current Frontier
State:
- Exact next ROM address.
- First required action for the next agent.
- Any straddler continuation.
- Whether next range is expected code/data/mixed.
- Which tool/pipeline to start with.

13. Unresolved Caveats
Be honest:
- Conservative names.
- RAM/global identity suspect.
- Data fields not decoded.
- Parent DB unreliable zones.
- Any checks not run and why.
- Any hypothesis-grade conclusions.

14. Reviewer Checklist
End with a short checklist for the reviewer:
- Check git status/log.
- Re-run manifest/build gates.
- Inspect any suspicious files.
- Confirm docs/counts match.
- Confirm next frontier.

Writing requirements:
- Use exact z64 addresses.
- Use current repo-relative paths.
- Keep historical notes accurate but mark superseded information clearly.
- Do not claim semantic behavior is verified unless runtime trace or mutation
  evidence exists.
- Do not claim patch behavior or patch safety is proven from static evidence
  alone; classify static-only findings as `candidate`, `rejected`, or
  `needs-runtime`.
- Runtime-state observations must cite exact state paths, checked ROM identity,
  addresses, watches/registers/memory ranges, and confidence. Missing runtime
  situations should become runtime-state requests in
  `docs\runtime-state-requests.md`, not guesses.
- Autonomous emulator/runtime work must follow
  `C:\Users\Joe\Projects\OgreBattlel64\TestingWorkFlow.MD`; user-driven testing
  should stay passive unless Joe asks otherwise.
- Keep source ownership as the priority. Do not report speculative patch hunts
  as run work.
- Do not call mixed code/data chunks "fully split into functions"; say
  "source-owned as code/data parts."
- Make the current state impossible to miss.

Bridge completion ping:
After the review handoff document is created, verified, and committed, ping the
local bridge before your final response:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri '<bridge-url>/agent/review-complete' `
  -Body (@{
    agentName = '<gui-agent-name>'
    reviewDoc = 'docs/REVIEW_YYYY-MM-DD_<short-run-slug>.md'
    frontier = '<current-frontier>'
    message = 'Review handoff created and committed; ready for tailored next-run prompt.'
  } | ConvertTo-Json -Compress)
```

If the bridge is unavailable, do not fake the ping. Include the failed ping command
and error in the final response.
```
