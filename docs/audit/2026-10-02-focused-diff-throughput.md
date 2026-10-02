# Focused diff throughput — 2026-10-02

Status: accepted by the Director on 2026-10-02 after GoldOx's independent code
and final-result review (Agent Mail 698, thread `OB64-VERIFY-THROUGHPUT-20261002`).

Joe selected normal warm focused diff latency, with a 30-second objective, ahead
of the remaining throughput queue in `docs/NEXT_STEPS.md`. Parallel AI agents
decompiling functions and a Linux toolchain remain deferred. Local tool processes
and bounded tooling implementation/review are separate from that deferral.

Sol released production source/config/build ownership at `0d66dc9e`. His saved
Scenario continuation and unfinished complete Combat W6 remain intact. This
tooling validation does not declare that unfinished family complete.

## Existing measurements

The previously accepted repair is recorded in
[the verification throughput report](2026-10-02-verification-throughput.md).
It measured a 127.291-second warm focused diff, 1,002.625-second normal verification
including a fresh CURRENT build, and a 1,085.069-second structural audit.

A new unchanged `func_00129268` baseline took 130.187 seconds for 733 active targets
and 727 producers. Preprocessing took 65.176 seconds; sibling object handling took
22.458 seconds; linking took 9.491 seconds; layout evidence took 8.226 seconds.
The requested compiler invocation itself took 0.339 seconds. These observations
identify process and evidence overhead, not expensive C compilation.

## Change and protection boundaries

- Preparation uses the accepted model already freshly loaded by the active-target
  loader. An observer supplies only freshly authenticated assembly text to a private
  symbol index. One final content sweep and complete model/census seal replace
  repeated reads; default callers still finish that sweep before returning.
- Layout, requested comparison, and report construction share one invocation-local
  linked ELF/map context. Its identities are checked after all consumers finish.
- Object evidence uses scoped snapshots of confined artifact bytes. Opaque tokens
  bind those bytes to their target and expire when the callback returns; exposed buffers are copies.
  A diff-only, invocation-local memo reuses its own derivations after fresh byte
  authentication. Group and auxiliary-projection derivations remain fresh.
- Object evidence is derived once inside each `recordsForTarget` call, with a
  private handoff to linked evidence and final artifact identity checks.
- Sibling object cache hits retain semantic inspection, copy-time hashes, source
  checks, and the executable/configuration seal. Cloned evidence replaces redundant
  inspection of identical copied files; a final destination sweep detects drift.
  Hits copy the inspected bytes, so cache corruption after inspection cannot alter
  this output. The next use rejects and rebuilds the corrupted entry.
- Manifest construction compares each actual C object hash to both its compiled
  record and stripped-object evidence before publication. Layout checks compare
  fresh post-link artifacts against the compiled evidence as well.
- The new development-only preprocessing cache stores CPP bytes, never source
  classification or acceptance verdicts. Its first tier accepts only directive-free
  sources without volatile/reserved macro spellings or ambiguous lexical escapes,
  and requires an exact source-only dependency census. A second tier supports a
  conservative literal-include closure, including inactive includes, and binds
  include search order plus directory name/type inventories. Unsupported inputs
  use fresh preprocessing without changing source-policy admissibility.
- The requested producer always preprocesses and compiles freshly, including every
  member sharing its compilation-group source. Ordinary build, verify, and audit
  callers use the original fresh preprocessing path.
- Reuse binds source contents, source/cwd/include paths, implementation, pinned
  preprocessing tools/configuration, and a full inherited-environment hash. No
  environment values are stored. Classification scans and digests are recomputed;
  source/dependency/tool/configuration/environment identities are checked at finish.

Like the existing sibling object cache, this is development artifact reuse, not
independent proof of source-to-compiler correspondence against coordinated forged
cache contents. Canonical acceptance continues to reproduce compilation freshly.

## Validation record

- Independent replay reproduced all 733 baseline target records exactly before
  the final model/snapshot changes. The final audit also preserved every one of
  the 720 previously verified target records exactly.
- Simulated object drift after derivation was rejected.
- Focused cache tests cover input/tool/environment invalidation, corrupt metadata
  and bytes, unexpected files, post-use drift, requested-producer freshness,
  unsupported-input fallback, symlink confinement, and atomic publication races.
- Claude reviewed the preprocessing tiers, object memo/snapshots, copy provenance,
  model observer/index/bracket, and final regex/probe reductions. His additional
  manifest guard and duplicate baserom-read findings were addressed.
- Native fixture passed with an exact isolated ROM and malformed owner, padding,
  writable allocation, map, evidence, snapshot-token and cache mutation controls.
- Final routine run passed all 24 suites in 192.0 seconds. An initial run passed
  23 of 24 suites: the remaining test incorrectly
  expected already-accepted EF50 to remain inactive. Its corrected canary retains
  D14C's inactive state; the complete auxiliary-interior suite then passed. A
  second stale fixed target count in the separate logical-function suite was
  replaced by exact census equality against the independently loaded workbench;
  that separate suite also passed.

## Real nonmatching candidates

`node tests/diff_nonmatching_candidates.js <case>` runs isolated preserved sources
through the actual development linked diff. It authenticates the archived source
and expanded compiler input, changes no production C/configuration, and restores
the prior development report. Results are explicitly ineligible for acceptance.

| Case | Expected result | Final warm seconds |
| --- | --- | ---: |
| Unfinished PURE_C attempt for hybrid `func_001FFE80`, `1d2ef51fa2` | 4 differing words / 4 bytes; relocations match | 46.497 |
| `func_00129268`, `726821885f` | Decoded rows equal, raw 20 words / 20 bytes differ | 41.507 |
| `func_00129268`, `9a04de33e8` | Instructions differ, 27 words / 47 bytes; relocations differ | 43.251 |
| Truncated `func_001FFE80`, `9edc78cf1b` | 792-byte output rejected against 796-byte owner before linking | Rejection only |
| Inactive ASM owner `func_00249A14`, `a715baaf13` | Authenticated 900-byte candidate rejected at link: undefined `D_801D7C78` | Rejection only |

The three completed nonmatching linked runs and the accepted-function warm run
each compile only the requested producer freshly. A preceding FFE80 run took
42.522 seconds but also compiled one uncached sibling, so it is not the fully
warm sample. The inactive Scenario fixture overlays the target-list read only
inside the test's loader invocation; it protects the real config and ASM files.
It keeps the current unresolved-symbol rejection instead of inventing a symbol
definition. Its historical 107-word/274-byte mismatch is not claimed as a current
linked result. A Windows path-casing error in the initial harness was corrected
by using the loader's exported config path.

Two other initial harness
expectations were corrected: `requestedFresh` is a count, and the instruction-
different candidate has a genuine relocation mismatch. Neither harness failure
is counted as a passing test. The short candidate is a rejection test, not a
linked-diff latency sample.

## Final focused measurements and remaining priority

The accepted `func_00129268` control took 251.494 seconds with a cold object cache
(727 compiler invocations, warm CPP cache), then **43.627 seconds warm** (726
sibling object hits, one requested compilation). It remained `PURE_C`, raw-byte
exact and relocation-correct, with target SHA-256
`393F6AC7A59CAC56EF63C348237EC9882B12E34F8A648427D2F33119E554A213`.
The 130.187-second baseline and final control use the same target/source and
733-target/727-producer census. This is about a threefold improvement. The
30-second objective is **not met**.

| Warm stage | Seconds |
| --- | ---: |
| Preparation, including source policy | 10.307 |
| Runtime tools and baseline input | 1.344 |
| Fallback object preparation | 3.812 |
| Requested compilation and sibling artifact handling | 11.202 |
| Link and linked-artifact generation | 9.957 |
| Layout evidence | 5.576 |
| Requested comparison | 0.385 |
| Other preparation, publication and final identity checks | 1.044 |

Claude approved this bounded serial improvement after audit. Resume Sol,
and keep the sub-30-second work first in the tooling queue. A process pool is a
separate design involving producer groups, failure cleanup and drift brackets;
its unmeasured projection is not a reason to keep the decomp worker paused.
No lower-priority queue item is selected by this report.

An isolated linker experiment tested Claude's proposed `-n` padding reduction
using the pinned executable and copied objects. Control and `-n` both produced
a 196,764,436-byte ELF with identical parsed records and the canonical ROM hash.
The predicted file-size reduction was falsified. Their ordered link times
(8.254 and 6.728 seconds) do not establish a causal speed improvement. Production
flags remain unchanged. Final artifact rehashes also remain: a mutation test
demonstrates that they detect post-derivation drift.

## Canonical audit

`node tools/audit.js --profile` passed at **2026-10-02T15:26:03.697Z**. All 968
source, include, config and tooling input hashes captured at **14:40:45Z**
remained unchanged during validation.
The current 733-target configuration passed source classification, sole ownership,
placement, actual relocations, target bytes, independent fresh compilation and
complete-ROM equality. All 720 target records in the previous accepted report
are deeply identical, with no differing fields.

The other 13 targets were already configured provisional W6 sources before this
tooling task. This audit changes no production source or activation configuration
and does not close the complete 17-member W6: B1F4 and D14C still have ASM source
blockers. It also does not establish Scenario acceptance.

- CURRENT fingerprint: `A1500B01E87936BD724CB054618330113C6C71D4A2179747A2BACF5B9409132F`.
- Canonical ROM SHA-256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Audit report SHA-256: `7ECA0F87084726E1E9AD94D72A759C29059E6685EF85FD97464A408C15C51377`.
- Verification report SHA-256: `2F038E6709B71C736E50C7A80C2373C17AB3D62767E81D613FFD6B332B5410A0`.
- Fresh-compilation report SHA-256: `5DBCA7EE717C6ED26BD0C1DC77C0A521409D7876F42F01F6274F29070550AE0A`.

| Audit stage | Seconds |
| --- | ---: |
| Preparation | 79.778 |
| Structural checks and canary | 119.368 |
| New CURRENT build and its checks | 751.216 |
| Independent verifier | 466.305 |
| Fresh compilation comparison | 141.395 |
| Complete audit | 1,558.384 |

This audit took **25 minutes 58 seconds**, longer than the earlier 717-target
18-minute audit. The target census and run conditions differ, so these samples
do not establish the cause. This batch demonstrates the focused-diff improvement;
it does not demonstrate a faster full verifier or meet the 15-minute verifier
goal. Do not repeat unchanged acceptance merely for the local commit or handoff.

Generated evidence is under
`build/focused-diff-30s-20261002/` and `build/warm-diff-profile/` (ignored).
