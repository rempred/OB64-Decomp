# Isolated reload observations

`tools/matching_studies/reload_trace/` observes GCC 2.7.2 `reload1.c` in a
fresh ignored research copy. It never substitutes the canonical compiler or
changes matching acceptance. `build.js` records the pinned source/tree,
ordered copied objects, current MSVC headers/libraries/tools, commands, and
instrumentation. A parsed metadata-only comparison binds the unmodified
copied-object relink to the exact pinned executable; this establishes that
relink's executable equivalence, **not original host reproducibility**.

Hooks distinguish planning `find_reloads(replace=0)` from replacement calls.
They record selected reload descriptors, spill order/cursor, allocation
candidates/results, inheritance/equivalence, retry restoration, cancellation,
label/call state, and reload-time emitted/substituted instructions. Internal
`reload.c` constraint-alternative search is unobserved. The generic function
filter is `OB64_RELOAD_FUNCTION`; forcing and host option environments are
rejected. Truncated or structurally incomplete traces fail validation.

`run.js <manifest>` checks five named source-bound controls with identical
expanded inputs and pinned flags. Pinned, trace-off and trace-on assembly and
whole native ELF bytes must agree, preserving ordered relocations and encoded
addends. `corpus.js` snapshots and content-deduplicates historical expanded
inputs. `broad.js <manifest> <inventory>` performs a bounded trace-off assembly
sweep, preserving failures separately: two identical compiler failures are
not parity passes. All outputs remain under ignored
`build/matching-studies/reload-trace/`; prior evidence is never deleted.

For an arbitrary private pure-C candidate, use:

```text
node tools/matching_studies/reload_trace/candidate.js --manifest <manifest.json> --source <candidate.c> --function <symbol>
```

This uses the same authenticated expanded input, pinned flags and complete
pinned/off/on native parity gates. The function filter must identify an
observed function; an empty trace fails. Source/dependency drift fails.

`node tests/reload_trace.js` exercises synthetic parser, environment,
instrumentation-anchor and PE-metadata rejection controls. Synthetic retries
do not establish observed compiler retry coverage. Candidate traces cannot
prove retail retry history or impossibility of a pure-C reconstruction.
