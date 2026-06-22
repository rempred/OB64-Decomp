# Review Handoff Prompt Template

Use this follow-up prompt after a chunk/run is complete. Replace
`YYYY-MM-DD` and `<short-run-slug>` before sending it to the agent.
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
