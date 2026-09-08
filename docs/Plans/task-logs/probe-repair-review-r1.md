# Generic probe repair R1 independent review

## Verdict

**Accepted** at commit `492c99c049252fd179aa87c7270b9811e2d8afbb`.

The completed six-file change is a bounded research-diagnostic repair. It now compiles the authenticated source-policy expansion, binds every effective compiler/probe input, fails closed on incomplete or changed cache artifacts and metadata, and reports comparison provenance without turning textual pass divergence into a causal or matching claim. No production compiler flag, compiler identity, source-policy rule, ownership/layout rule, linker input, matching acceptance gate, or W8 source changed.

## Review findings and corrections

The first review pass found two material gaps. A self-consistently rehashed report could omit the runtime preprocessor, replace implementation identities with malformed records, and point public artifact fields outside its directory; `readProbe` accepted it. Separately, an extra header placed beside a stored candidate's generated `authored.c` snapshot could shadow the recorded origin directory because the source directory is first in quoted-include lookup.

Both gaps were corrected before this verdict. Schema-3 reads now validate complete identity shapes and cross-field bindings, require the canonical report filename and keyed directory, bind public paths to the three local artifacts, and still permit a properly rebased whole keyed-directory copy for historical comparison. Candidate snapshot directories must contain only `authored.c`; that census and the source bytes are rechecked before preprocessing, before compilation, after compilation, and before cached return. Follow-up review also aligned up-front target-ID and flag validation with the emitted schema and preserved source-policy's case-insensitive `.c` extension behavior. The focused suite contains recomputed-digest, rebased-copy, public-path, keyed-layout, pre-execution shadow, during-execution shadow, malformed-request, and uppercase-extension controls.

No required fix remains.

## Independent checks

- `git diff 492c99c^ 492c99c --check` passed; the commit contains only the six expected files.
- `node --check` passed independently for `tools/lib/matching/probe.js`, `tools/match.js`, and `tests/matching_probe.js`.
- A new repository-local headered fixture under ignored `build/probe-repair-review-r1/real/` was run through the full `tools/match.js probe` CLI against `func_001F3C00` with the accepted compiler and the `rtl` pass. Probe `8491389A293B91B77E48D4366AEB18B5F92C172B4449CB3A3F518474C7E5C7F1` recorded `PURE_C`, the exact local-header identity, 59 expanded bytes, the pinned compiler SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`, nonempty assembly and RTL artifacts, and a complete research-only report. The repeat returned an authenticated cache hit.
- `node build/probe-repair-review-r1/repro_malformed_report.js` independently passed three narrow controls on that real report: a recomputed-digest malformed provenance report rejected, a recomputed-digest escaping public artifact path rejected, and a correctly keyed/rebased historical copy authenticated and compared with no textual divergence.
- The writer's released evidence reports 59 focused adversarial checks, the real 13-dump pinned-chain integration, the broader existing matching-workbench suite, a full CLI control, and unchanged identities for all twenty paused W8 inputs. I inspected the focused controls and the final report rather than repeating the broad suite.

## Final input identities

| File | SHA-256 |
|---|---|
| `tools/lib/matching/probe.js` | `E21027895EC88E8904685F8BDE3B1D2FEA7B48DC041C6E97C24300B7C0B3285D` |
| `tests/matching_probe.js` | `23A15899DEA84F9FA1FF9229B52F136511BDBD0C2B72A5AF47637910ED18F978` |
| `tools/match.js` | `A10161E243515DFF99BF3638FD363E58C83B890ED0834F396CA3B9A79D97DA4B` |
| `tests/matching_workbench.js` | `864828D81FC5C4EEAB7B818798EFC54A6D02957463F6DF5B27215B59D3AFDE37` |
| `docs/MATCHING_WORKBENCH.md` | `3211D385A081D1499DBAEEA58196BDD98EFDDA90E5CD53FCF5DF298ADBE1297F` |
| `docs/Plans/task-logs/probe-repair-r1.md` | `F4FF0C7942954CDB6F202D24D12780417B633DE47BAAA28DAAB4B3F05FCBB31C` |

## Acceptance limits

Probe outputs remain research artifacts and `acceptanceEligible: false`. Historical comparisons authenticate the retained report and artifact set; they deliberately do not require the historical source tree, headers, compiler binary, or implementation files to equal today's live files. `firstTextualDivergence` preserves pseudo/UID differences and states only where normalized dump text first differs. Missing pass coverage remains separate.

This acceptance does not establish source identity, matching C, ownership, relocation correctness, linked-target equality, full-ROM equality, or W8 completion. No full-ROM verifier was run. The structural audit was not required because the repair does not change any foundation enumerated by `docs/AUDIT.md`; it changes only research-probe input, cache, artifact, and comparison handling.
