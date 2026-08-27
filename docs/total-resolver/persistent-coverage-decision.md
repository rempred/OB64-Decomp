# Persistent structural delta capture

Status: **implemented and independently verified**
Scope: Total Resolver knowledge schema 3, frontier format 5, Project64 bridge protocol 0.14.0

## Decision

Total Resolver uses one selected, long-lived SQLite knowledge database. Each active capture is
still isolated in its own staging database. On normal stop, the recorder drains and closes that
stage, validates the protocol/ROM/epoch/sequence/payload contract, derives a delta outside the
knowledge transaction, then merges the delta and its affected materialized rows atomically.

Executable structure is not identified by a mutable 4 KiB page. The canonical instruction key is
physical instruction address plus the exact four opcode bytes. The canonical edge key is the exact
source instruction key plus the exact destination instruction key and edge kind.

Page generation is contextual. It is attached to an emitted instruction or edge witness, but a
generation change cannot create another instruction, edge, or call when the address/opcode keys
are already known. Historical full-page blobs remain in their original raw sessions; schema 2
does not copy them into structural knowledge.

Schema 3 preserves schema 2's exact machine-fact foundation and adds compact context and candidate
indexes. The persistent knowledge database itself is the default query authority; a stale
generated Resolver is never an implicit dynamic source.

This corrects the observed menu inflation. The protocol 0.9.0 run created 34,832 apparent new
instructions because 792 changed full-page images owned the instruction identity. Under schema 2,
that same session contributes 1,712 genuinely new address/opcode keys and 1,915 genuinely new
edges across zero new physical pages.

## Canonical identities

| Fact | Equality decision |
|---|---|
| Instruction | physical address and all four opcode bytes |
| Physical-page coverage | physical page plus a 1024-bit summary of observed aligned addresses |
| Edge | exact source instruction, exact destination instruction, and edge kind |
| Call | exact callsite instruction, exact executed delay-slot instruction, exact actual target instruction, and call kind |
| Page/generation witness | session, bridge epoch, physical page, native generation, sequence bounds |
| DMA placement | source domain/range, destination range, matched length, exact event-time destination bytes, mapping class |
| Controller transition | session, bridge sequence, effective P1 state and contextual bounds |

Identical opcodes at different physical addresses remain distinct. Different opcodes at a reused
physical address remain distinct. A known function reached from a new caller retains the new exact
edge. A known prefix followed by a new tail retains the new transition and tail. If the native
placement or generation payload is missing, the bridge emits a conservative unresolved event
instead of suppressing it.

MIPS calls execute their delay-slot instruction before transferring to the callee. The historical
schema-2 table named `call_fact` therefore materializes callsite-to-delay-slot edges; its stored
destination function must not be presented as the callee. Protocol 0.14 observes the callsite,
executed delay slot, and actual target as one atomic native fact. For the ten older sessions, the
format-5 migration creates that fact only where consecutive exact edge witnesses prove the same
triple. Frozen static direct-call decoding remains a separate candidate lane. Missing atomic or
historically consecutive evidence, or an unmapped target, remains unresolved rather than becoming
an invented relationship. Function attribution is a query/materialization step and is not part of
the physical/opcode call identity.

## Runtime-to-ROM mapping authority

Executable identity does not imply ROM or function identity. For an exact execution observation,
both nominal-VRAM and contemporaneous-DMA candidates must equal the captured opcode at all four ROM
bytes before the candidate may populate `z64_offset` or `function_id`. The ingestion boundary
rechecks that equality, and `knowledge verify` checks every stored mapping plus function-range
containment.

An address-only nominal crosswalk is useful as a search candidate but is not a resolved mapping.
Opcode mismatches remain exact physical-address/opcode facts with unresolved candidate context.
Repeated unresolved witnesses are compacted per exact issue with occurrence and sequence/frame
bounds; the immutable raw session retains the complete stream.

Opcode equality substantially strengthens a mapping and rejects overlay-slot misattribution, but a
single common opcode is not, by itself, semantic proof. Contemporaneous exact DMA placement remains
stronger than a nominal match, and all dynamic labels remain live-unreviewed.

When a new function placement, region lifetime, generation witness, or mapped edge arrives,
ingestion queues only the overlapping physical range for candidate recalculation. An exact opcode
match against a global placement is retained as a byte-confirmed global candidate. Same-session
residency can strengthen it to a contemporaneous candidate. Only an unambiguous contemporaneous
exact-byte result is a uniquely resolved live mapping; competing results remain explicitly
ambiguous and never auto-promote.

## Read-only query authority

The agent query path opens selected persistent knowledge, frozen static functions, frozen resource
chains, and the frozen field product through read-only SQLite connections with `query_only` set.
Frozen immutable sources are opened immutable. Each response includes a source/freshness manifest.
Generated Resolver products require an explicit `--legacy-resolver` option, and database-schema
confusion fails closed.

Schema 3 adds indexed session/frame/sequence witnesses for instructions and edges, region lifetime
intervals, sampled PCs, semantic markers, typed unresolved fields, source selection identity, and
candidate evidence. Default output is bounded. Unresolved results explain the exact fact,
candidates, basis, contradiction or missing evidence, adjacent mapped edges, and next useful
observation.

Human capture names and notes are a searchable contextual index over the session catalog. A
case-insensitive, all-words keyword query returns bounded session IDs; an agent can then apply the
ordinary session/frame/sequence filters to retained facts. Session-filtered results and function
session previews carry the label forward. This context never participates in machine-fact
identity, mapping promotion, or novelty suppression.

Function explanations are cross-session. A function name returns bounded incoming and outgoing
static and runtime call views directly from the selected knowledge plus frozen static source; no
capture-session identifier is required.

## Hashing policy

Cryptographic capture integrity is not a persistent session/knowledge acceptance class.

- Executable facts and frontier lookups use direct fixed-width exact keys; they are not hashed.
- Large variable DMA byte strings use CRC32 only to select a small candidate bucket. A bucket hit
  is confirmed by byte-for-byte BLOB equality before reuse. Forced bucket collisions are tested.
- The canonical ROM SHA-256 remains because the decomp repository requires the Rev 0 target
  identity.
- Capture schemas 3 and 4 retain historically named SHA columns for compatibility and storage
  diagnostics. Candidate content references are confirmed by exact bytes. Normal capture disables
  the duplicate NDJSON mirror; stop does not hash the whole SQLite capture or logical table set, and
  its context manifest has no capture/file/mirror digest. Hash mismatches alone do not reject
  knowledge ingestion or lower DMA evidence when exact bytes and their required metadata are valid.
- Incremental/full-rebuild equivalence compares canonical table rows directly. No logical digest
  is used as an equality oracle.

## Frontier and hot path

Frontier format 5 is one validated binary image containing:

- fixed-width exact instruction records containing stable fact ordinal, physical address, and
  opcode;
- fixed-width exact edge records containing stable fact ordinal and both exact endpoint
  instructions;
- fixed-width exact call records containing stable fact ordinal, exact callsite, executed delay
  slot, actual target, and call kind;
- exact-span DMA metadata, stable canonical ordinal, and complete event-time destination bytes; and
- an opaque database revision token, exact lower-4-MiB capture-window contract, and required ROM
  identity.

The client exports the frontier from SQLite before capture, then native Project64 validates and
atomically installs it. Execution and DMA callbacks perform in-memory exact lookups and
in-session exact deduplication before JavaScript is called. Hash functions may select native
container buckets, but equality operators compare every canonical field and every DMA byte. The
hot path performs no SQLite work, persistent write, or 4 KiB code-page read. Native tracking keeps
the two previous instructions current through silent known prefixes, so it can still identify an
atomic call after both earlier instructions were suppressed.

At capture start Project64 takes one native, atomic copy of the lower 4 MiB of RDRAM before the first
captured instruction. Total Resolver matches complete static function bytes against that census to
establish resident placement candidates. This is residence evidence only: it does not claim the
function executed or identify its loader. Project64 may allocate 4 or 8 MiB; execution, DMA, and
snapshot data in the upper 4 MiB never enter Total Resolver.

For power-on coverage, the recorder can load the frontier and arm while Project64 has no loaded ROM
and reports zero N64 RDRAM. Project64 invokes the bridge's `EMU_STARTED` handler after constructing
fresh RDRAM but before entering the interpreter. That handler validates the target CRC and core,
then atomically installs the baseline, execution, input, and DMA callbacks. The first ordered event
is therefore the 4 MiB census at the first CPU PC; subsequent PI DMA and RDRAM execution observations
cover the game's initial loads. The worker independently hashes the loaded ROM file before the stage
can be accepted. A wrong ROM never enables capture, and an exact-identity failure cannot be ingested.

Queue insertion remains bounded and ordered by one bridge-side monotonic sequence. Queue overload
is represented by explicit dropped sequence ranges. Native DMA filtering includes event-time
destination bytes in its exact identity; incomplete or ambiguous identities fall back to capture.
Recorder time and frame number remain context only.

Native Project64 marks the stable ordinals of known instructions, edges, calls, and DMA facts that
occur. Capture stop sends one compact bitmap for each lane. The bitmaps restore session membership
without restoring repeated event streams and make no event-order claim. Native predecessor tracking
still advances through every silent known instruction, so new tails, callers, and actual targets
remain discoverable.

An optional 32,768-record native execution-context ring keeps exact PCs and predecessor edges in
emulator memory. A human marker requests a bounded before/after window of at most 4,096 records per
side; only that window is emitted. Its local order and frames are contextual, and an early stop
records an explicit incomplete window.

## Observation-only authority

The recorder receives an ObservationOnlyPj64Client facade. It exposes status/health, reads,
frontier loading, recorder-owned watch installation/removal, unified drain, DMA observation, and
capture start/stop. It does not expose RAM writes, controller injection, pause/resume, stepping,
state load/save, ROM open/close/reset, global clear, or memory dumps.

The selected knowledge database and captured bytes are passed only through this facade during a
recorder run. The broader bridge retains explicitly invoked research controls for other tools, but
the capture/indexing path cannot accidentally call them. Tests enumerate and reject mutation
methods on the recorder facade.

## Atomic ingestion and repair

A session ID is the idempotence key. Exact protocol, ROM, epoch, sequence range, capture schema,
and capture reference metadata must agree when that ID is seen again; otherwise ingestion fails.
The successful ledger row is the final write in the SQLite transaction. An injected failure,
invalid session, interrupted session, discontinuity, stale frontier, or incompatible protocol
cannot partially change knowledge.

The human GUI always uses deferred ingestion. Its separate launch button can start only the
configured Project64 capture executable after exact SHA-256 authentication; this does not load a
ROM or start a capture. Stop first closes and verifies staging; the human then assigns a semantic
name and optional notes in a separate sidecar before requesting ingestion. Semantic context is
stored with the accepted session but is never part of its machine identity. A failed integration
remains retryable with the same name. GUI and worker diagnostics are retained below ignored
`build/total-resolver/` paths, and the GUI appends a bounded worker-log tail when an operation fails.

Normal materialization refreshes only destinations and functions touched by the delta. The rebuild
command creates a separate database, replays successful ledger rows in order, and compares every
canonical row directly after independently verifying both databases. Stable ledger identity is
also compared exactly. Rebuild-local paths/timestamps, diagnostic product/manifest references, the
historical frontier-format label, and regenerated summary JSON are bookkeeping and are not part of
canonical equivalence.

## Migration result

The ten-session schema-2 database remained selected while schema 3 was replayed beside it. Exact
cross-schema comparison preserved every canonical schema-2 row: 293,275 instructions, 316,915
edges, 222,319 DMA placements, 9,277 calls, 7,519 function placements, controller context, and all
ten stable ledger identities.

The schema-3 copy was then upgraded to frontier format 5 and protocol 0.14. The migration
conservatively reconstructed 11,016 exact physical/opcode callsite/delay-slot/actual-target
relationships and 11,467 retained session/context witnesses from consecutive historical facts.
A separate clean ten-session ledger replay was exactly row-equivalent across every schema-3 table,
including 570,445 instruction witnesses, 329,929 edge witnesses, 549,390 residency intervals,
21,120 sampled PCs, 81,762 typed unresolved rows, and 607,040 candidate-evidence rows. Only after
both independent verification and the 120-test suite passed was the format-5 database selected.
The format-4 database, raw sessions, and historical products remain unchanged beside it.

## Intentionally contextual or uncertain

Controller transitions, frames, recorder clocks, page generations, and placement lifetimes remain
session context. Dynamic rows remain live-unreviewed; they do not promote accepted structural
names, ownership, or matching claims. DMA ordering alone still does not prove transient contents,
so event-time destination bytes remain required. Coverage is path-biased and incomplete, and an
observed machine transition does not by itself establish the human meaning of the code. Static
nominal address matches without observed opcode equality remain candidates only.
