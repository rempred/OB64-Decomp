# Verification throughput repair — 2026-10-02

Joe authorized the throughput investigation and implementation. Claude reviewed the
updated Downloads advisory and the concrete proposal; the Director retained final
approval. This change preserves the accepted production sources and contracts at
`e9c7ad82`.

## Measured cause and scope

The first unchanged `func_00129268` linked diff took 1,078.535 seconds, including
795.473 seconds in 711 preprocessing children. Its requested C compilation took
39 milliseconds. GoldOx identified and removed 78 orphaned inbox watchers left by
his monitor's 30-minute re-arm. The same unchanged diff then took 152.549 seconds,
with identical exact bytes, source class, relocation verdict, and sibling-cache hits.
These two measurements isolate a substantial host-contention effect; they do not
attribute the whole historical verifier delay to one cause.

The remaining layout stage took 61.713 seconds. Repeated map splitting/scanning and
duplicate target-evidence derivation were removed. A run-local prepared context now
shares the parsed ELF and map index, hashes the actual parsed/raw bytes, freezes ELF
metadata recursively, and rechecks disk and backing-buffer identities before success.
Existing consumers retain their distinct map boundary and duplicate-header semantics.
No cross-run verdict cache, incremental acceptance, compiler change, or security-setting
change was introduced. Fresh preprocessing, fresh compilation, real-ELF asm-differ,
relocation, ownership, target-byte, and complete-ROM checks remain.

`verify.js --profile` and `audit.js --profile` write diagnostic sidecars separately
from acceptance reports. Failures in timing output cannot replace verification failures.

## Validation

- All 717 generated layout records are byte-identical to the prior 24,332,368-byte
  layout. A private invocation took 4.744 seconds; the accepted output was not modified.
- Prepared-map tests cover 144 reference equivalences, 12 ownership cases, seven
  identity controls, and three shallow-freeze mutation controls.
- All 22 routine suites passed. The separate native-text fixture rebuilt its isolated
  exact ROM and rejected malformed text, owner, padding, BSS, fill, and cache evidence.
- Independent review found and verified fixes for shallow-frozen metadata and missing
  context finalization in three supporting tools.
- `node tools/audit.js --profile` passed at 04:38:27 UTC. All 951 captured source,
  include, config, and tooling input identities remained unchanged during validation.
- The entire canonical verification report is identical to the prior report. ELF,
  map, ROM, layout, ELF report, and object manifest hashes are also unchanged.
  Fresh-compilation evidence is identical except for its timestamp and output directory.

| Measured stage | Seconds |
| --- | ---: |
| Initial preparation | 43.735 |
| Structural checks and canary | 82.189 |
| Fresh CURRENT build, including its checks | 508.678 |
| Independent verifier | 354.144 |
| Fresh compilation | 95.998 |
| Complete structural audit | 1,085.069 |

The normal-verification portion, including preparation and a new CURRENT build,
took 1,002.625 seconds (16 minutes 43 seconds). This is a substantial improvement
over the prior 2 hours 44 minutes, but it does **not** meet the proposed 15-minute
goal. Host cleanup and code optimization both contribute; the final audit alone
does not separate their contributions.

After regenerating the cache under the new implementation identity, the focused
diff took 322.102 seconds cold (711 compiler invocations) and 127.291 seconds warm
(710 sibling hits, one fresh requested compilation). Both remained `PURE_C`, exact,
and relocation-correct. The final warm layout stage was 7.647 seconds. Preprocessing
was the largest remaining stage at 70.936 seconds, versus 32.518 seconds in the
earlier clean-host sample: launch latency still varies. The 30-second warm-diff goal
is **not** met. Bounded preprocessing/independent-comparison concurrency is the next
measured optimization candidate; this patch does not introduce a worker pool or
reuse prior acceptance verdicts.

The Director accepted this bounded repair after independent final review. Future
performance work must preserve the same producer grouping, per-input drift checks,
result census, and canonical acceptance gates. Existing native research loops and
per-wave verification cadence remain available while that work is considered.

Generated logs and profiles are under `build/throughput-20261002/`,
`build/verification-profile/`, and `build/warm-diff-profile/` (ignored).
