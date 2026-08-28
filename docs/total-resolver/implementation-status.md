# Total Resolver R3 implementation status

Status: **Schema 5 factorized DMA and protocol 0.17 are implemented and locally verified**
Updated: 2026-08-28

This page records the current implementation boundary. Total Resolver is a practical decompilation
accelerator: it preserves exact machine structure conservatively, exposes useful candidates, and
states uncertainty without treating runtime context as accepted source structure.

## Selected knowledge

The selected, verified protocol-0.17 database is the ignored runtime product
`build/total-resolver/knowledge/total-resolver-v5-factorized-dma-protocol017-r3.sqlite`. It contains
all 17 successfully ingested sessions and uses knowledge schema 5 and frontier format 6. It was
built beside the prior selected schema-4 database
`total-resolver-v4-focused-protocol016-r1.sqlite`, which remains untouched.

| Persistent row class | Count |
|---|---:|
| Sessions | 17 |
| Exact instructions | 296,918 |
| Exact edges | 321,133 |
| Exact callsite/delay-slot/actual-target relationships | 11,341 |
| Exact call session/context witnesses | 11,792 |
| Historical callsite-to-delay-slot materializations | 9,277 |
| Conservative destination-specific DMA placements | 73,885 |
| Exact static-data DMA resources | 15,549 |
| Exact static-data destination spans | 864 |
| Native DMA frontier facts | 90,298 |
| Function placements | 8,558 |
| Controller transitions | 7,451 |
| Instruction context witnesses | 575,510 |
| Edge context witnesses | 334,482 |
| Residency/region lifetime intervals | 285,955 |
| Periodic sampled PCs | 28,391 |
| Typed unresolved rows | 91,650 |
| Candidate-evidence rows | 864,119 |
| Focused sessions/witnesses/pointer snapshots | 2 / 22,389 / 26,860 |

The candidate rows cover 53,534 exact instructions and 54,037 distinct
instruction/function/ROM-offset candidate identities. Their evidence states are:

| Candidate state | Rows |
|---|---:|
| Byte-confirmed global candidate | 85,731 |
| Contemporaneous placement candidate | 345,747 |
| Uniquely resolved live mapping evidence | 424,429 |
| Ambiguous/conflicting mapping | 8,212 |

Candidate rows do not rewrite exact instruction facts. The selected database has 243,405 mapped
instruction facts, 53,513 unmapped facts, 309 ambiguous instructions, zero opcode mismatches, and
zero queued candidate recalculation ranges.

The old `call_fact` name was misleading: because MIPS executes a delay slot, all 9,277 selected
rows point from a call instruction to its delay-slot instruction, and all therefore retain the
caller function on both sides. They are callsite facts, not actual caller-to-callee relations.

The format-5 migration conservatively reconstructed exact physical/opcode call triples from the
historical sessions. Each triple contains the callsite, executed delay slot, actual target, and
call kind. Protocols 0.14 through 0.17 record this triple atomically for future captures.
Frozen decoded direct calls remain available beside runtime results as a separate static candidate
lane.

## Truthful agent queries

`explain`, `search`, `coverage`, and `unresolved` now open one read-only `ResolverContext`. Selected
persistent knowledge is the dynamic authority. Frozen static, resource, and field products remain
separate read-only evidence lanes. SQLite connections use `mode=ro`, `PRAGMA query_only=ON`, and
immutable mode for frozen inputs.

Every result contains a source/freshness manifest with the selected database ID, schema, ledger
ordinal, frontier identity, session count, review boundary, and frozen-source identities validated
when the query context opens.
A historical generated Resolver is available only through an explicit `--legacy-resolver PATH`;
passing a knowledge database as a Resolver or a Resolver as knowledge fails closed.

Default output is bounded. `explain --include SECTION` exposes requested detail, while `search`
uses `--limit` and `--cursor`. Supported search dimensions include partial function name, ROM/live/
physical address, exact opcode/bytes, session/frame/bridge-sequence range, incoming/outgoing edge,
mapping status, unresolved kind, semantic session-name/notes keyword, semantic marker, native
marker execution context, and controller context. Session keyword search returns target session
IDs without requiring an agent to know a capture ID in advance. Session-filtered results, function
session previews, and known-activity summaries retain the human name and notes during drill-down.

A bare `explain FUNCTION` now includes bounded incoming and outgoing call previews across all
ingested sessions. `--relationship callers` and `--relationship callees` select one direction;
`--include calls` expands the paginated detail. The result separates frozen static direct-call
candidates from exact runtime callsite/delay-slot/target pairs and includes retained session,
frame, and bridge-sequence witnesses. Querying does not require prior knowledge of a capture ID.

Unresolved execution diagnostics return the exact instruction fact, candidate mappings, the basis
for each candidate, contradictions or missing contemporaneous evidence, adjacent mapped edges, and
the next observation needed for promotion. The previously stranded Block-like observation at
physical `0x001E8400`, opcode `0x24070002`, session
`20260820T010432.018225Z-d237a550`, frame 5886, bridge sequence 7271 is now discoverable through
`search` alone. It reports exact instruction 268,993, incoming edge 290,088, and the byte-confirmed
global candidate `func_0022b1f4` at ROM `0x0022B6D0`, while correctly withholding live promotion
because no contemporaneous residency interval covers that observation.

## Schema 3 context and reconciliation

Schema 3 preserves the schema-2 machine-fact foundation and adds:

- source registry and selected-source identity;
- session catalog and ingestion context summaries;
- instruction and edge frame/sequence witnesses;
- residency/region lifetime intervals;
- periodic sampled-PC context;
- semantic markers and notes;
- typed indexed unresolved fields;
- exact candidate mapping evidence; and
- an affected-range candidate recalculation queue.

Ingestion queues only ranges touched by new placements, lifetimes, generation witnesses, or mapped
edges. Exact opcode equality against a global placement creates a searchable global candidate.
Promotion still requires unambiguous contemporaneous exact-byte evidence. Ambiguous candidates do
not auto-promote.

The ten historical sessions report context completeness as `emitted-events-and-saved-samples`.
Events suppressed as already known under older novelty frontiers cannot be reconstructed. This is
an explicit historical limitation; emitted events, saved samples, controller transitions, and
recoverable residency context were retained.

## Schema 5 factorized static-data DMA

The prior schema stored each exact static-data resource at each rotating destination slot as a
separate persistent placement. This produced a resource-by-slot Cartesian product: the seventeenth
session observed 7,667 DMA transfers and appeared to add 6,852 placements even though it repeated
a previously captured scene. Of those apparent additions, 4,605 were 960-byte static-data
transfers through rotating slots.

Schema 5 keeps destination-specific identity for executable, mixed, partial, unknown, and
otherwise unsafe-to-factor DMA. A safe full-ROM static-data transfer is represented by two exact
facts: its source range plus all event-time bytes, and its physical destination span. Resource and
destination tables retain exact association bitmaps, occurrence counts, session counts, and
per-session summaries. The immutable raw staging database remains the source for exact historical
pair chronology.

The 253,590 historical placement rows migrated into 73,885 retained conservative placements,
15,549 exact data resources, and 864 data destination spans. Frontier format 6 exports 90,298 DMA
facts: all 73,885 conservative placement records, 15,549 resource records, and 864 destination
records.
Native Project64 suppresses a safe static-data event only when its resource bytes and destination
span are both already known. A new resource in a known slot, or a known resource in a new slot,
still emits once. Exact byte equality, not a digest, decides suppression.

For a destination-specific fact, the stored `matched_length` remains the number of bytes that also
matched the ROM. Native dedupe does not misuse that prefix as the transfer length: it compares the
complete source span, destination span, and event-time bytes. This matters for 22,047 retained
partial-prefix, padded, or unknown-region transfers. They remain conservative placement facts but
an identical completed transfer is now silent on a later run. The R2 frontier migration added only
these derived native-index entries; canonical facts and raw sessions are byte-for-byte unchanged.
The selected R3 copy also expands the opaque frontier revision token to include exact call and DMA
fact counts. A repaired frontier therefore cannot share a token with its predecessor. This changes
no captured fact or wire layout; it makes stale-frontier and activity provenance fail closed.

The old-to-new conservation oracle accounted for every source DMA row and compared all retained
instruction, edge, call, content, context, candidate-result, and materialized rows directly. The
candidate recalculation queue is intentionally excluded because it is an operational work log;
the new schema does not enqueue discarded static-data lifetimes, while the resulting 864,119
candidate rows remain exactly equal. The selected database passes SQLite, foreign-key, opcode,
mapping, frontier, factorization, materialization, context, activity, and focused-capture checks.

## Protocol 0.16 native execution path retained by 0.17

Frontier format 6 assigns stable fact ordinals to known instruction, edge, exact call, and
factorized DMA facts. Native Project64 continues exact in-memory novelty filtering and tracks two preceding
instructions through silent known execution. A new callsite or actual target therefore emits one
atomic call fact even after a completely known prefix. Known facts set in-memory hit bits. Capture
stop emits exactly one instruction/edge/call/DMA bitmap summary, allowing agents to answer whether
already-known structure occurred in a session without restoring the repeated instruction stream.

New instructions, edges, callers, tails, changed opcodes, unresolved placements, and changed DMA
bytes continue through the ordered novelty queue unchanged. DMA equality still includes the exact
event-time destination bytes. Queue loss remains explicit sequence ranges.

An optional compact native ring retains 32,768 recent exact execution records in emulator memory. A human
marker can save at most 4,096 records before and 4,096 after the marker. Only the requested window
crosses the bridge. Local execution order and frames are context, not canonical bridge order; a
stop before the after-window fills produces an explicit incomplete record.

Protocol 0.16 retains the protocol-0.14/0.15 frontier, activity, and focused-evidence contracts,
but removes generic script work from the common known-instruction path. Native Project64 now uses
one direct observer, one-pass exact known-fact lookups, cached exact edges, word-indexed focused
watch gates, and native opcode prechecks. Novel execution facts are delivered in exact ordered
batches of at most 256 and flush before DMA, input, focused-watch, and stop events. Ordinary
Capture disables the marker ring; Focused Capture uses a smaller 32-byte ring record and
power-of-two indexing. The recorder idles at 30 Hz, accelerates on activity/backlog, and receives
frame/status context in the drain response instead of separate polls.

The protocol-0.17 native Release/Win32 build, standalone exact-novelty tests, protocol tests, and
production JavaScript replay harness pass. Project64 was not launched during this correction. Real-game FPS
must still be measured by Joe; no FPS claim is inferred from synthetic tests.

## Focused Capture

The GUI now has a separate **Start Focused Capture** action. It extends normal novelty-filtered
coverage and ingests into the same selected knowledge database. The Cutscene Studio profile resolves
11 configured owners to 15 exact live watches because four shared environment/HUFF owners have two
retained physical placements. Missing functions, placements, signatures, schema 4 or later, or protocol
capabilities fail closed.

Entry watches are filtered by exact opcode in native Project64 and then confirmed against exact ROM
signature bytes before JavaScript records anything. Each accepted invocation retains full GPR
context, numeric FPR context, bounded stack words, and configured argument-pointer bytes captured
synchronously at entry and immediately before an in-range `jr ra`. Hot pose/matrix targets sample
at most once per frame; outstanding invocations are bounded. Return values precede the delay slot,
and FPR values do not claim raw NaN payload identity.

The single **Add Note** action obtains the current bridge frame, records the note over 60 frames
before through 30 frames after, and requests the existing bounded native execution-context window.
This supports a roughly one-second human reaction delay without requiring separate background,
camera, or actor buttons. Routine owner changes remain automatic.

Schema 4 stores focused profile configuration, indexed entry/return witnesses, and exact pointer
bytes transactionally. Queries expose a compact focused preview by default and full bounded state
through `explain FUNCTION --include focused`; `search --focused-profile` and
`--focused-target` work without Project64. All focused evidence remains `live-unreviewed`.

## Human capture workflow

`python -m tools.total_resolver gui --port 64656` opens a Tkinter capture window. Its explicit
**Launch Project64** button resolves and SHA-256-authenticates the frozen call-aware executable and
the separately deployed bridge script before starting it visibly. It also requires the deployed
script's literal port, the runtime inventory port, and the GUI port to agree. Launch does not load a
ROM or start capture. The window provides bridge check, normal or focused capture start, one Add
Note action, pre-ROM arm, clean stop, semantic name/notes, and an explicit **Save Name and
Integrate** action; it has no ROM lifecycle, controller injection, or RAM-write path.

GUI sessions always defer ingestion. Stop first closes and verifies staging. The semantic name is a
separate human-context sidecar and cannot alter machine identity or rename an already accepted
session. Ingestion is idempotent and atomic. A timestamped diagnostic log is displayed in the GUI;
tracebacks and a bounded worker-log tail are included on failure.

## Migration and equivalence

Schema 4 was built beside the selected schema-3 database by replaying all 16 declared ledger
sessions. The prior database and historical products were not overwritten. Cross-schema comparison
found every canonical foundation row identical; only schema/protocol metadata and the additive
empty focused tables changed.

The historical `total-resolver-v3-frontier-v5-oracle-r2.sqlite` remains as the prior same-schema
oracle. Schema-4 test fixtures independently prove exact full-rebuild equivalence including focused
profile, witness, pointer-content, context, candidate, and materialization rows. The selected real
database passes SQLite health, foreign-key, opcode, mapping, frontier, materialization, candidate,
context, activity, focused-context, factorized-DMA, and DMA-frontier checks. The schema-5
conservation comparison passes against the complete 17-session schema-4 source. The protocol-0.16
database remains available beside it as the pre-factorization source.

## Capture-volume and lookup measurements

The deterministic benchmark executes the production bridge in a fake emulator and never launches
or controls Project64.

| Measurement | First path | Exact replay |
|---|---:|---:|
| Canonical instruction/edge facts | 3 | 0 |
| Structural trace events crossing JavaScript | 2 | 0 |
| Full 4 KiB reads on the execution path | 0 | 0 |
| Exact known DMA events crossing JavaScript | — | 0 |

The replay reduction is 100% for both canonical structural facts and structural trace events in
the fixture. Five known fact hits, including one exact call, were retained in one stop-time summary
using three bitmap bytes. A
changed DMA still emitted one exact event. A new tail, new caller, relocation, changed opcode, and
ambiguous fallback all remained visible. The latest complete fake-emulator run took 0.727 seconds
on this host; this is not an FPS claim.

With one read-only context already open, an exact physical/opcode lookup measured 1.16 ms and a
bounded common-opcode lookup measured 0.54 ms. Opening the context and revalidating all three frozen
source identities took 2.85 seconds. Query plans use the opcode, session/frame/sequence, unresolved,
and marker-context indexes, so lookup work does not scan linearly with total history.

A real gameplay FPS comparison remains intentionally unperformed because it requires Joe to launch
and play Project64. No capture was started during this correction.

## Verification

- All 132 Python/Node Total Resolver tests pass, including focused protocol, trigger,
  atomic-ingestion, rollback, query, migration, and compatibility coverage.
- The standalone native exact-novelty test passes with 3,020 instructions and 3,003 edges in its
  stress fixture.
- Project64 Release|Win32 compiles, links, and passes its clang-format gate.
- `doctor` passes the active bridge, native source-set, native binary, repository, and configured
  source-freeze checks; the missing optional R2 Resolver database is `SKIP`. Opening the default
  read-only query context separately validates all three frozen source identities.
- The selected knowledge database passes all independent verification checks.
- The ordinary exact-ROM build remains independent of Project64.

## Intentionally contextual or uncertain

- Coverage is incomplete and biased toward played paths.
- Frames, recorder timestamps, controller transitions, page generations, sampled PCs, and marker
  ring order remain context rather than canonical machine ordering.
- Global exact-byte candidates are useful search results, not contemporaneous live mappings.
- Dynamic rows remain `live-unreviewed`; they do not promote accepted boundaries, ownership,
  semantic names, or matching-C claims.
- Historical exact caller/callee relationships exist only where consecutive callsite and transfer
  witnesses survived older novelty filtering. Static direct-call candidates can help navigate
  unmapped endpoints without claiming a witnessed runtime mapping.
- Focused return snapshots precede the MIPS delay slot, pointer bytes cover only the configured
  bounded arguments, and floating-point values are numeric context rather than raw bit identity.
- DMA ordering alone cannot prove transient placement contents; event-time destination bytes remain
  required.
- Closed raw staging sessions are retained. Persistent marginal structural growth can approach
  zero while a session catalog row, compact context, and the stop-time activity bitmap remain.
