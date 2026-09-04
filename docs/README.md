# docs

Curated decomp documentation belongs here. Historical reports and plans record
what happened at a fixed commit; they are not the current command surface or a
source for changing progress counts.

Use the repository guide's task-scoped read order:

1. `../AGENTS.md`
2. `WORKFLOW.md`
3. `SOURCE_POLICY.md`
4. `NEXT_STEPS.md`
5. only the relevant subsystem, toolchain, audit, or research document

Read `AUDIT.md` only for structural work or when explicitly assigned. Total
Resolver work has an additional mandatory guide at
`../tools/total_resolver/AGENTS.md`.

Use `dossiers/` for stable function dossiers and `subsystems/` for notes that
have graduated from parent-workspace experiments into decomp knowledge.

## Files

- `PLATFORM.md` - structural inventory and historical acceptance chronology;
  use `WORKFLOW.md` and executable help for current commands.
- `REV0_SCOPE.md` - Rev 0 ROM identity, coverage ledger, and exact rebuild
  snapshot.
- `TOOLCHAIN.md` - authenticated KMC GCC 2.7.2 / GNU Binutils 2.6 production
  setup and verification.
- `WORKFLOW.md` - source-replacement and evidence loop.
- `MATCHING_WORKBENCH.md` - optional candidate generation, diagnostic comparison,
  experiment history, and compiler probes; scratch results are not acceptance.
- `templates/matching-c-agent-prompt-guide.md` - concise guidance and a copyable
  prompt for ordinary one-function matching workers.
- `KMC_GCC_MATCHING_NOTES.md` - scoped, experimentally reproduced compiler
  matching observations and diagnostic-loop cautions.
- `dossiers/func-000135a0.md` - accepted exact-C example showing how source
  order, separate locals, integer widths, and expression shape affected output.
- `DECOMP_LOG.md` - historical compact log through its stated cutoff, not a
  current-state authority.
- `FULL_ROM_SOURCE_MANIFEST.md` - full-ROM source ownership policy and current
  generated-manifest summary.
- `NEXT_STEPS.md` - ordered work queue for the next decomp pass.

Run `node tools/status.js` for current generated progress. Use
`node tools/match.js --help` and `../tools/README.md` for the matching workbench
rather than copying command lists from dated reports.
