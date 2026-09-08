# Generic probe repair R1

Implementation complete; independent tooling review is required before acceptance. This is stage 1 of `docs/Plans/probe-repair-and-w8-reuse.md`. No preservation-pilot or matching-source work was performed.

## Changed behavior

`tools/lib/matching/probe.js` now classifies and preprocesses through the existing authenticated source-policy API and compiles exactly those expanded bytes. Its schema-3 identity binds authored/expanded bytes, dependency and preprocessing identities, effective flags, compiler hash/designation, target, selected passes and implementation hashes. Live input/tool identities are rechecked before compilation, after compilation and before cached return. Every request preprocesses anew; cache reuse skips the compiler, not input authentication.

Explicit and active source files retain their original quoted-include lookup. Stored candidate text is snapshotted without substituting a newer origin file; a known origin directory precedes configured include directories. Probe-only CLI wiring passes that provenance, rejects mismatched candidate targets, and supports `--source-origin` when provenance is absent or ambiguous. Candidate filename-sensitive macros still observe the snapshot filename; this is documented.

Reuse and comparison authenticate the report digest, exact artifact census and nonempty authored source, expanded input, assembly and every requested dump. Missing, changed, malformed, symlinked, incomplete or failed artifacts cannot become complete cache hits. Compiler failure produces a failed report and CLI exit 2. Old report/cache identities remain untouched and must be regenerated; failed/incomplete keyed directories must be preserved outside their keyed location before retrying.

Comparisons authenticate retained artifacts, allowing intentional historical header/compiler differences. They expose provenance and pass-coverage differences. `firstTextualDivergence`, with the documented legacy `firstDivergentPass` alias, is explicitly textual. Pseudo/UID numbering is preserved and missing pass coverage is separate from textual inequality.

## Checks

- `node tests/matching_probe.js`: 59 independently authored adversarial checks pass after review corrections. These cover expansion delivery, unchanged reuse, header/flag/preprocessor/compiler changes, source provenance, invalid requests, grouped exclusion, all artifact classes, missing/empty output, failure, recomputed-digest malformed records, keyed-copy/public-path contracts, comparison provenance, pseudo-only inequality, legacy reports, extra/malformed census, execution-time input/tool drift, snapshot header shadowing and symlink paths.
- `node tests/matching_probe.js --integration`: real pinned-chain headered C passes, including a sibling header, nested include and existing project header. All 13 requested dumps are nonempty. Independent source-policy preprocessing yields identical expanded bytes/dependency identities; normal production-flag compilation agrees with probe assembly after removing only compiler option-comment lines. Unchanged reuse, stored-candidate include lookup and changed-header invalidation pass.
- `node tests/matching_workbench.js`: passes, including existing group-consumer checks and the new focused tests.
- Full `tools/match.js probe func_001F3C00 --source <integration fixture> --passes rtl` invocation succeeds; its output is retained at `build/probe-repair-r1/cli-source.json`.
- Syntax checks for both edited JavaScript entry points pass. All twenty W8 source/shared identities still equal the R8 terminal index.

Unit fixtures/results and real integration results remain under ignored `build/probe-repair-r1/`; generated probe artifacts use the normal ignored `build/matching/targets/.../probes/` location referenced by those results. No external reproducer implementation or harness was copied into tracked code. The focused suite is integrated into the existing workbench suite.

## Independent-review corrections

The reviewer demonstrated that recomputing report/identity digests could bypass shallow metadata checks, and that an extra header beside a candidate snapshot could shadow its original directory. Both findings were corrected before acceptance. Identity validation now checks required source-policy, dependency, runtime/effective preprocessor, implementation and compiler records, digest/byte/path shapes, source-policy digest and class/reason consistency. It binds the exact report filename, keyed directory and all three public artifact paths. Properly rebased complete historical copies remain supported without requiring old live inputs. Candidate snapshot directories require an exact `authored.c`-only census before preprocessing and at live rechecks. Malformed target IDs/flag arrays reject before execution; `.C` source extensions retain source-policy semantics. The 59-check focused suite and affected real pinned-chain cache/comparison integration pass on the corrected implementation; no unrelated broad suite was repeated for these bounded corrections. Reviewer-owned evidence was read but not modified or copied into tracked tests.

## Boundaries and handback

The pinned compiler remains SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. Production flags, source-policy implementation/configuration, ownership, layout and acceptance gates are unchanged. Grouped scratch exclusion remains fail-closed. Research compiler output remains ineligible for matching acceptance. No full-ROM verifier or structural audit was run because this repair changes only diagnostic input/cache/report handling, outside the enumerated structural audit triggers.

Measured timing is limited: the corrected real integration reported 12.549 seconds including preparation, compilation and assertions; the initial integration reported 11.817 seconds. The initial focused mocked suite took about 0.8 seconds. The full-task preparation/authentication, interpretation and reporting intervals were not separately instrumented, so no category percentages are asserted. These figures are not compiler-throughput measurements.

All shared-tool/source/build/report writes and processes are released to Director `/root` for independent review. This report does not self-accept the repair or accept W8. The source-pair pilot remains a separate next stage.
