# W8 reuse pilot R1 implementation

Implemented import-only research observations using the existing candidate/observation store,
bounded effect retrieval and explicit observation preservation. Five exact independently authored
R7/R8 sources, curated metadata and dossiers are preserved. The
[pilot index](../../research/w8-pro-research/reuse-pilot.md) provides source links, relation order,
fresh-store import recipe, replay commands and the distinction between frozen observations and
new compiler replay. Stage 3 reduction is not implemented.

Changed tooling: `tools/lib/matching/research.js`, probe-independent wiring in `tools/match.js`,
one existing-store query in `tools/matching_workbench/store.py`; focused tests in
`tests/matching_research.js` and suite wiring in `tests/matching_workbench.js`.
Documentation: workbench guide, pilot index, this report, five exact C archives and ten
associated metadata/dossier files. No database migration or new compiler instrumentation.

Validation completed:

- `node tests/matching_research.js`: 22 positive/adversarial checks passed, 16.358 s,
  zero intercepted KMC invocations and zero compile rows. Controls cover identity drift,
  malformed/NUL annotations, header/reference hashes, parent/related integrity, current grouped
  exclusion, stored preprocessor tampering, snapshot shadowing, Windows path case, exact export
  and overwrite rejection. Final review correction binds stored variant to authored label;
  a recomputed-observation-ID mismatch rejects, while the preprocessor-drift control keeps
  the label/variant consistent to isolate that separate check.
- `node tests/matching_workbench.js`: PASS, including the new research suite, existing probe
  unit controls and group-consumer integration. A redundant direct group-consumer invocation
  without its required workbench argument failed as a harness call; the completed parent suite
  supplied that argument and passed.
- Five imports/preservations, bounded effect queries and an idempotent CLI repeat import passed.
  Global compile counts remained unchanged. That count is corroboration, not standalone proof
  of no codegen: the import call path only preprocesses and writes the store, and the test spy
  rejects KMC invocation.
- Tracked archive plus `.authored` metadata reimport into an empty isolated store passed in
  dependency order: all five candidate IDs stable, exact source/expanded/dependency identities,
  no compile rows. Observation IDs change appropriately with archive provenance.
- Accepted probe replay of all five archives passed all requested dump/artifact checks,
  exact expanded hashes and full pinned assembly agreement to their respective frozen controls.
  Normalization was restricted to `.file`, known compiler-option comments and CRLF.
  An initial private script assertion used the wrong report-field name after successful codegen;
  the corrected run authenticated that first cached result and compiled the other four.
- `git diff --check`: PASS. All twenty current W8 inputs authenticated unchanged against
  the R8 terminal inventory. Accepted probe SHA-256 remains
  `E21027895EC88E8904685F8BDE3B1D2FEA7B48DC041C6E97C24300B7C0B3285D`.

After the metadata-only final correction, the focused suite passed again and all five exports'
source/expanded/dependency identities plus twenty protected inputs were reauthenticated.
The previously passing broad suite and compiler replays were not repeated for this isolated guard.

Measured pilot preparation/authentication: 10.007 s; import/export: 5.506 s; empty-store
reimport: 1.764 s. Five probe-reported compiler invocation/authentication durations sum to
1.423 s, including the first result's original invocation. Interpretation/reporting were not
separately instrumented; no estimated percentages are asserted. Ignored scripts and results
are in `build/w8-reuse-pilot-r1/`, with authenticated probe outputs in the existing matching cache.

Limits: preserved allocation/HOME and linked extent claims cite exact R7/R8 evidence; this
pilot does not invent newly measured HOME events or match acceptance. Root-directory C
remains subject to the existing source-policy include-directory boundary. Source/header or
reference drift rejects. Archives must reproduce expansion without historical build context.
Roles and selected-best labels do not change source ownership. Compiler identity, flags,
source policy, target ownership, linker contracts and every W8 acceptance gate remain unchanged.
No matching source edits, runtime, full-ROM verification, commits or pushes were performed.

Implementation is ready for independent shared-tool review. Production/source/build/report
writes and running processes are released at terminal handback; acceptance belongs to review.
