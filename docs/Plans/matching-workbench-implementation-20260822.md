# Matching Workbench Implementation Plan

Status: **complete, including the post-plan ruleset ensemble**. Current usage is
documented in `docs/WORKFLOW.md`, `tools/README.md`, and
`node tools/match.js --help`; the planning language below is retained as the
design record.

## Goal

Turn the existing exact-ROM matching workflow into a higher-throughput research
workbench without weakening its acceptance rules. The workbench will prepare
compiler-aware C drafts, remember experiments, explain mismatches, discover
related functions, assemble callsite/type context, rank targets, and expose
compiler intermediate state.

The workbench is an aid. It never promotes source automatically. A function is
matching C only after the existing `diff`, target verifier, source-policy, sole
linker-owner, and complete exact-ROM gates pass.

## Interface and storage

The supported entry point will be:

```text
node tools/match.js <command>
```

Generated artifacts belong under ignored `build/matching/` paths. A versioned
SQLite database records experiment history. Selected candidates and durable
lessons enter tracked documentation only through an explicit preservation
command and normal review.

Every result identifies the accepted ROM, semantic model, compiler, assembler,
m2c checkout, and workbench schema used to produce it. Results from a changed
target model remain visible but are marked stale. Digests may index caches, but
exact metadata and bytes confirm identity.

The normal build and verifier remain usable without m2c, the workbench database,
Total Resolver, or Project64. Total Resolver integration is optional and
read-only.

## Phase 0: baseline and fixtures

- Record current matching runtimes and select a fixed pilot corpus: the 200
  smallest accepted leaf functions, representative medium functions, existing
  exact C, preserved blocked candidates, and a known exact clone pair.
- Define target, candidate, comparison, family, context, and evidence formats.
- Keep rebuildable analysis separate from explicitly preserved research and
  canonical source.

Acceptance: every fixture resolves uniquely through the current accepted
semantic/overlay model without deprecated parent boundaries or linear mapping.

## Phase 1: target model and persistent experiment memory

Implement `doctor`, `inspect`, `history`, `best`, `compare`, and `preserve`.

- Resolve exact target ranges, placements, owner source, and expected bytes.
- Create isolated scratch directories and a transactional SQLite experiment
  store.
- Record source text, lineage, tool identities, compiler options, artifacts,
  comparisons, and notes.
- Reuse an identical completed compile; never confuse different exact inputs.
- Mark history stale when an accepted source identity changes.

Acceptance: commands make no canonical writes, repeated work is idempotent,
interruption cannot corrupt the store, and an explicit export can preserve a
selected candidate with its provenance.

## Phase 2: compiler-aware mismatch classification

Implement `classify` and `watch`.

- Decode target and candidate words with delay-slot-aware CFGs.
- Separate length, CFG, block order, opcode/expression, immediate/signedness,
  register-renaming, scheduling, stack-layout, and relocation differences.
- Report the first genuine divergence and recommend the next research aid.

Acceptance: exact, register-renamed, scheduling, relocation, CFG, and mixed
fixtures classify deterministically; exact status still requires exact bytes.

## Phase 3: current-model m2c preparation and sweep

Implement `prepare`, `sweep`, and `sweep-status`.

- Export m2c input from current accepted boundaries and overlay placements.
- Generate symbol/type context and invoke a pinned m2c checkout with the
  `mips-gcc-c` target.
- Produce a small bounded set of deliberate views rather than unrestricted
  permutations.
- Compile through the authenticated KMC/GNU toolchain, classify each result,
  write only ignored artifacts, and resume interrupted batches.

Acceptance: the 200-smallest-leaf pilot reports generation/compile success,
exact and near-match yield, mismatch categories, time, and artifact volume.
Do not scale to the full corpus until the pilot shows useful yield.

## Phase 4: function-family atlas

Implement `family build`, `family <symbol>`, and bounded family listings.

Keep distinct tiers for exact bytes, relocation-normalized equality, opcode
equality under consistent register renaming, and def-use/CFG structural
similarity. A placement remains a distinct target even when bytes match.

Acceptance: the known `func_000E5938`/`func_0013466C` clone is recovered,
forced digest collisions cannot merge unequal representations, unrelated
same-size functions remain separate, and rebuilds are deterministic.

## Phase 5: callsite ABI and type context

Implement `context` and make its structured output available to `prepare`
without forcing inferred context into generation.

- Summarize argument preparation, stack arguments, extension behavior, return
  use, load/store widths, recurring structure offsets, calls, and globals.
- Label exact instruction facts, multi-callsite inferences, single-callsite
  candidates, conflicts, and optional runtime context separately.

Acceptance: known fixtures recover their argument/return facts, conflicts stay
ambiguous, missing runtime evidence is harmless, and the m2c pilot measures the
effect of added context. Context is generated for inspection by default and is
passed to m2c only through explicit `--with-context`.

## Phase 6: two-axis target ranking

Implement `rank`, `rank --lane leverage`, `rank --lane batch`, `rank --lane
hard-tail`, and `rank --explain`.

Keep value and matchability as separate inspectable scores. Value includes
reviewed subsystem priority, callgraph leverage, family multiplier, and optional
runtime reach. Matchability includes size/CFG, leaf status, stack/FPU/switch
hazards, m2c results, mismatch class, and matched-family exemplars. Missing
evidence is reported rather than treated as negative evidence.

Acceptance: rankings are deterministic and bounded, every contribution is
explained, stale experiments cannot silently affect current results, and the
default queue does not reduce project priority to easy-function count.

## Phase 7: compiler-behavior microscope

Implement `probe` and `probe compare`.

- Collect supported RTL, flow, combine, allocation, scheduling, and delay-slot
  dumps from the authenticated compiler.
- Permit a separately identified instrumented research build for allocator or
  scheduler logging, but make it structurally impossible to use that build in
  acceptance commands.
- Turn replicated microprobes into reviewed KMC notes rather than promoting
  one-off theories.

Acceptance: a comparison identifies the first compiler pass where two
candidates diverge, research compiler output is unmistakably non-acceptance,
and probe-disabled compilation remains unchanged.

## Workflow integration and final gate

The agent loop becomes:

```text
node tools/match.js rank --lane leverage
-> node tools/match.js prepare <symbol> --variant structured
-> inspect family, context, history, and generated candidates
-> edit one scratch candidate
-> node tools/match.js watch <symbol> --source <candidate>
-> run the configured ensemble only when another bounded generation view is useful
-> use probe only for a structurally close hard case
-> deliberately add exact source to the normal target configuration
-> diff <symbol>
-> verify --target <symbol> --require-pure
-> full verify
-> commit
```

Update `docs/WORKFLOW.md`, the matching-agent prompt guide, and `tools/README.md`.
`docs/NEXT_STEPS.md` receives only the active rollout queue. The final gate is a
clean test suite, deterministic rebuilds, unchanged Git status after all
read/generate commands, useful pilot measurements, and the canonical full-ROM
verifier.

## Implementation status

All eight numbered phases (0 through 7) are implemented on baseline commit
`3aa9865`.

| Phase | Status | Principal result |
|---|---|---|
| 0 | Complete | Fixed accepted-model fixtures and 200-smallest-leaf pilot |
| 1 | Complete | Schema-2 transactional target/candidate/observation/history store |
| 2 | Complete | Delay-slot-aware comparison and deterministic mismatch classes |
| 3 | Complete | Pinned current-model m2c prepare, checkpointed/resumable sweep, exact scratch compiler |
| 4 | Complete | Four-tier collision-safe family atlas and deterministic rebuild |
| 5 | Complete | Static ABI/field/callsite context plus optional read-only runtime context |
| 6 | Complete | Separate value/matchability scores and leverage/batch/hard-tail lanes |
| 7 | Complete | Accepted/research compiler probes and first-divergent-pass comparison |

Candidate identity is exact target plus exact source; portable generation
provenance is retained in separate observation rows. Compile insertion and its
comparison are atomic. Failed attempts remain retryable. A target model is
independent of whether its source is later promoted, so promotion does not
strand its experiment history.

The measured pilot and its evidence boundaries are recorded in
`docs/matching-c/matching-workbench-pilot-20260822.md`.

Post-plan calibration added a versioned eight-ruleset ensemble. Sweep contract 3
stores exact function-to-ruleset and candidate-ID membership, gains and losses
against the baseline pass, unique wins, and a deduplicated exact-function
total. Identical generator inputs and exact source are shared without dropping
the separate provenance observations. The two fixed-corpus results are recorded
in `docs/matching-c/matching-workbench-ensemble-20260823.md`.

Intentionally excluded from this implementation are automatic promotion,
unbounded permutation, semantic naming from code shape, revision comparison,
and any Project64 dependency. Scratch exactness remains diagnostic until the
existing linked target and full-ROM gates pass.
