# W8 paired reduction R1

Completed eight fixed common-deletion pairs; all retained the directional endpoint HOME
predicate. Final sources remove 3,201 bytes each while preserving the exact packet/row-loop
core per side. Shared/local frames are 480/472; dynamically identified endpoint pseudos are
650/654, with an accessed HOME only on shared. This is modest bounded reduction, not minimality,
game-behavior equivalence, source matching acceptance or a D037 improvement.

The [public study](../../research/w8-pro-research/paired-reduction.md) gives every trial result,
source/observation links, exact core hashes, replay command and the explicit explanatory limit.
Two reduced sources and their curated observations/dossiers were exported through accepted
import/preserve APIs; generated evidence remains ignored.

Changes: narrow `tools/matching_studies/w8-paired-reduction.js`, focused
`tests/w8_paired_reduction.js`, the study/report and six authored archive/dossier/metadata files.
No accepted stage1/2 tool edits, production matching changes, compiler/flag/policy/linker
changes, runtime, branches, commits or pushes.

Checks:

- `node tests/w8_paired_reduction.js`: 12 focused controls pass, including changing pseudo
  IDs, ambiguity, missing copy/consumer, short mode, USE-only references, wrong offsets and
  HOME-result identity mismatch, and destination-only definitions.
- `node tools/matching_studies/w8-paired-reduction.js build/w8-paired-reduction-r1/replay-r2`:
  21 inputs / 42 pinned+trace invocations, all emission comparisons pass; eight retained pairs.
  Same-pair, reversed and short controls reject. Full-source before/after pinned output agrees
  byte-for-byte with frozen R7 output. Source-core identities remain exact for every pair.
- All 21 recorded input dependency closures agree with the four preserved pilot headers.
  Final driver also checks original expanded identities and preserved dependency expectations.
- Both exports reproduce selected source hashes and original core bytes. All twenty protected
  W8 inputs remain unchanged. `git diff --check` passes.

The first run's top-level trial rows had redundant pair nesting; corrected flat-row assertions
and a fresh fixed replay resolved this reporting defect. Earlier evidence remains preserved.
Review also identified that a destination-only lreg definition could count as a consumer.
The final predicate inspects OR source subtrees; the new destination-only negative rejects,
and fresh `replay-r2` repeats the same eight choices successfully. Exports were regenerated
against the final study implementation hash, with superseded metadata preserved privately.
The authoritative corrected run measured 14 ms initial preparation, 4104 ms compiler subprocess
wall time and 7641 ms overall; classification/orchestration are not called compiler time.
Interpretation/reporting are unmeasured. Details live in ignored `build/w8-paired-reduction-r1/`.

All authorized stage3 writes/processes are released at terminal handback for independent
study/tool review. No further deletion choices or source trials are authorized by this report.
