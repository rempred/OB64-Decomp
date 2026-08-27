# Total Resolver R3 implementation status

Status: **Schema 3 and protocol 0.14 are implemented and independently verified**
Updated: 2026-08-26

This page records the current implementation boundary. Total Resolver is a practical decompilation
accelerator: it preserves exact machine structure conservatively, exposes useful candidates, and
states uncertainty without treating runtime context as accepted source structure.

## Selected knowledge

The verified call-aware database is the ignored runtime product
`build/total-resolver/knowledge/total-resolver-v3-frontier-v5-r2.sqlite`. It contains all ten
successfully ingested historical sessions and uses knowledge schema 3, frontier format 5, and active
bridge protocol 0.14.0. Its format-4 source remains untouched beside it.

| Persistent row class | Count |
|---|---:|
| Sessions | 10 |
| Exact instructions | 293,275 |
| Exact edges | 316,915 |
| Exact callsite/delay-slot/actual-target relationships | 11,016 |
| Exact call session/context witnesses | 11,467 |
| Historical callsite-to-delay-slot materializations | 9,277 |
| DMA placements | 222,319 |
| Function placements | 7,519 |
| Controller transitions | 5,956 |
| Instruction context witnesses | 570,445 |
| Edge context witnesses | 329,929 |
| Residency/region lifetime intervals | 549,390 |
| Periodic sampled PCs | 21,120 |
| Typed unresolved rows | 81,762 |
| Candidate-evidence rows | 607,040 |

The candidate rows cover 51,995 exact instructions and 52,469 distinct
instruction/function/ROM-offset candidate identities. Their evidence states are:

| Candidate state | Rows |
|---|---:|
| Byte-confirmed global candidate | 72,451 |
| Contemporaneous placement candidate | 175,481 |
| Uniquely resolved live mapping evidence | 352,225 |
| Ambiguous/conflicting mapping | 6,883 |

Candidate rows do not rewrite exact instruction facts. The selected database has 241,291 mapped
instruction facts, 51,984 unmapped facts, 302 ambiguous instructions, zero opcode mismatches, and
zero queued candidate recalculation ranges.

The old `call_fact` name was misleading: because MIPS executes a delay slot, all 9,277 selected
rows point from a call instruction to its delay-slot instruction, and all therefore retain the
caller function on both sides. They are callsite facts, not actual caller-to-callee relations.

The format-5 migration conservatively reconstructed 11,016 exact physical/opcode call triples from
the historical sessions. Each triple contains the callsite, executed delay slot, actual target, and
call kind. Of those, 8,787 have mapped caller and target functions and form 5,748 distinct
caller/callee function pairs. The remaining 2,229 exact machine relationships stay visible without
inventing a function mapping. Protocol 0.14 records this triple atomically for future captures.
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

## Protocol 0.14 future-session context

Frontier format 5 assigns stable fact ordinals to known instruction, edge, exact call, and canonical
DMA facts. Native Project64 continues exact in-memory novelty filtering and tracks two preceding
instructions through silent known execution. A new callsite or actual target therefore emits one
atomic call fact even after a completely known prefix. Known facts set in-memory hit bits. Capture
stop emits exactly one instruction/edge/call/DMA bitmap summary, allowing agents to answer whether
already-known structure occurred in a session without restoring the repeated instruction stream.

New instructions, edges, callers, tails, changed opcodes, unresolved placements, and changed DMA
bytes continue through the ordered novelty queue unchanged. DMA equality still includes the exact
event-time destination bytes. Queue loss remains explicit sequence ranges.

An optional native ring retains 32,768 recent exact execution records in emulator memory. A human
marker can save at most 4,096 records before and 4,096 after the marker. Only the requested window
crosses the bridge. Local execution order and frames are context, not canonical bridge order; a
stop before the after-window fills produces an explicit incomplete record.

The protocol-0.14 native source builds and links as Project64 Release|Win32 and the protocol-0.14
bridge passes its production JavaScript replay harness. Project64 was not launched during this
correction.

## Human capture workflow

`python -m tools.total_resolver gui --port 64656` opens a Tkinter capture window. Its explicit
**Launch Project64** button resolves and SHA-256-authenticates the frozen call-aware executable
before starting it visibly. Launch does not load a ROM or start capture. The window provides bridge
check, capture start, pre-ROM arm, clean stop, semantic name/notes, and an explicit **Save Name and
Integrate** action; it has no ROM lifecycle, controller injection, or RAM-write path.

GUI sessions always defer ingestion. Stop first closes and verifies staging. The semantic name is a
separate human-context sidecar and cannot alter machine identity or rename an already accepted
session. Ingestion is idempotent and atomic. A timestamped diagnostic log is displayed in the GUI;
tracebacks and a bounded worker-log tail are included on failure.

## Migration and equivalence

Schema 3 was built beside the selected schema-2 database by replaying all ten declared ledger
sessions. The prior database and historical products were not overwritten. Cross-schema comparison
found every schema-2 canonical fact row identical; only schema/protocol/frontier-format metadata
changed.

A separate `total-resolver-v3-frontier-v5-oracle-r2.sqlite` was then rebuilt from the ten-session
ledger. Direct
exact-row comparison reported no mismatched tables, including all schema-3 context, unresolved,
candidate, materialization, and activity tables. Both databases independently pass SQLite health,
foreign-key, opcode, mapping, frontier, materialization, candidate, context, and activity checks.

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

- 120 Python/Node Total Resolver tests pass.
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
  witnesses survived older novelty filtering. Of 11,016 retained exact call triples, 2,229 lack a
  mapped function at one or both endpoints. Static direct-call candidates can help navigate those
  gaps without claiming a witnessed runtime mapping.
- DMA ordering alone cannot prove transient placement contents; event-time destination bytes remain
  required.
- Closed raw staging sessions are retained. Persistent marginal structural growth can approach
  zero while a session catalog row, compact context, and the stop-time activity bitmap remain.
