# docs

Curated decomp documentation belongs here.

Read order for future agents:

1. `../AGENTS.md`
2. `PLATFORM.md`
3. `REV0_SCOPE.md`
4. `TOOLCHAIN.md`
5. `WORKFLOW.md`
6. `DECOMP_LOG.md`
7. `FULL_ROM_SOURCE_MANIFEST.md`
8. `NEXT_STEPS.md`

Use `dossiers/` for stable function dossiers and `subsystems/` for notes that
have graduated from parent-workspace experiments into decomp knowledge.

## Files

- `PLATFORM.md` - fast project orientation, current state, invariants, folders,
  and command snapshot.
- `REV0_SCOPE.md` - Rev 0 ROM identity, coverage ledger, and exact rebuild
  snapshot.
- `TOOLCHAIN.md` - project-local MIPS binutils setup and verification.
- `WORKFLOW.md` - source-replacement and evidence loop.
- `templates/matching-c-agent-prompt-guide.md` - concise guidance and a copyable
  prompt for ordinary one-function matching workers.
- `KMC_GCC_MATCHING_NOTES.md` - scoped, experimentally reproduced compiler
  matching observations and diagnostic-loop cautions.
- `dossiers/func-000135a0.md` - accepted exact-C example showing how source
  order, separate locals, integer widths, and expression shape affected output.
- `DECOMP_LOG.md` - compact running memory for completed decomp loops and
  context-compaction handoff.
- `FULL_ROM_SOURCE_MANIFEST.md` - full-ROM source ownership policy and current
  generated-manifest summary.
- `NEXT_STEPS.md` - ordered work queue for the next decomp pass.
