# Total Resolver R3

Status: **Schema-3 agent queries and protocol-0.13 compact activity capture implemented**

Total Resolver is a research accelerator beside the exact-ROM build. It keeps static facts,
runtime placement, exact execution, field hypotheses, and resource ancestry in separate evidence
lanes so a useful answer can remain explicit about uncertainty. Generated sessions, products, and
bundles live below ignored `build/total-resolver/` paths.

The completed implementation plan is retained as the historical design record in
`docs/PLAN_2026-08-17-total-resolver-r3.md`; current results and known limits are summarized in
`docs/total-resolver/implementation-status.md`.
Agents must also follow `tools/total_resolver/AGENTS.md`, which gives the safe entry checklist and
separates offline queries from user-authorized capture.

## Agent roles

An ordinary agent using Total Resolver is a **querying agent** and must remain read-only. Its normal
command set is:

```text
python -m tools.total_resolver doctor [--project64-root PATH] [--connect --port PORT]
python -m tools.total_resolver pj64 health [--port PORT]
python -m tools.total_resolver pj64 status [--port PORT]
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
python -m tools.total_resolver session status
python -m tools.total_resolver explain ...
python -m tools.total_resolver search ...
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
```

A querying agent must not run `session start`, `session stop`, `session label`, `session mark`,
`session note`, `knowledge ingest`, `knowledge import`, `knowledge select`, `knowledge
migrate-frontier`, or `knowledge migrate-schema3`. It must likewise avoid knowledge
initialization/rebuild and other commands that write capture, database, selection, or generated
product state. Those operations belong only to an agent explicitly assigned to build or maintain
the database. A general decompilation, investigation, or resolver-query task does not grant that
role.

Even a database-building agent must not start capture until Joe explicitly says the run is ready,
and must never use computer control to launch Project64.

## Bridge contract

The repo-local client requires Project64 bridge protocol `0.13.0` and frontier format 4 exactly
and fails closed on a
version or capability mismatch. The bridge supplies:

- one emulator-side monotonic sequence across watch, PI DMA, execution-trace, and controller-input
  events;
- a bridge-instance epoch that changes when the script instance changes;
- one ordered drain queue;
- explicit dropped sequence ranges; and
- event-time destination bytes for ROM DMA completions;
- generation-aware instruction/edge observations keyed by physical address and exact opcode;
- transitions in the effective Player 1 input returned to the game; and
- a binary structural frontier loaded directly into native Project64, containing exact opcode,
  exact-endpoint edge, and exact event-time DMA keys plus stable fact ordinals;
- one stop-time instruction, edge, and DMA activity bitmap, recording which already-known facts
  occurred in the session without restoring their repeated event streams;
- an optional bounded native PC/edge ring whose before/after window is persisted when a human
  marker is created;
- a one-time native copy of exactly 4 MiB of RDRAM before the first captured instruction; and
- an exact lower-4-MiB vanilla-OB64 capture window. Project64 may allocate 4 or 8 MiB; the upper
  4 MiB is ignored by execution, DMA, snapshot, and database paths; and
- a pre-ROM arm state that installs the baseline, execution, input, and DMA hooks synchronously
  in Project64's `EMU_STARTED` callback, before the interpreter executes its first instruction.

Recorder timestamps, frames, and page generations are context only. They never replace bridge
ordering, and neither ordering nor an index fingerprint proves transient destination contents.

## Database-building workflow: persistent single database

Initialize and select one knowledge database once. The ROM path must name the normalized US Rev 0
target; the database snapshots the accepted static functions and records its static/resource
inputs.

```text
python -m tools.total_resolver knowledge init --rom C:\path\to\baserom.z64
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
```

After selection, ordinary capture is automatic:

```text
python -m tools.total_resolver session start --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session stop
python -m tools.total_resolver knowledge status
```

For a true power-on run, first end emulation so Project64 reports no ROM and zero allocated N64
RDRAM, then arm the recorder before manually opening the ROM:

```text
python -m tools.total_resolver session start --before-rom --port 64656
python -m tools.total_resolver session status
# Manually open the exact US Rev 0 ROM in Project64.
python -m tools.total_resolver session stop
```

The armed worker returns immediately in state `armed`. On manual ROM load, the bridge checks the
target CRC and interpreter core synchronously, installs every observation hook, and requests the
4 MiB snapshot before `ExecuteInterpret()` begins. The worker then verifies the loaded file's exact
normalized ROM identity before the session can be accepted. A wrong ROM, restarted bridge, stale
queue, pre-existing RDRAM allocation, or protocol mismatch fails closed. The bridge never opens the
ROM on the recorder's behalf.

`session start` exports the selected database frontier to one compact binary file, loads it into
native Project64, and records an atomic 4 MiB resident-memory census before enabling ordinary
capture work. `session stop` closes and verifies the isolated staging database,
derives its delta, and commits that delta atomically. If ingestion fails, the raw session remains
closed and retryable:

```text
python -m tools.total_resolver knowledge ingest SESSION_ID
```

Normal capture writes only the staging SQLite database; the duplicate NDJSON event mirror is
disabled. Stop does not hash the whole stage and does not materialize a second full timeline. It
writes a small non-authoritative session-context manifest, then validates the SQLite payloads and
machine-order contract directly. Full replay remains an explicit repair or research operation.

The hot path never queries SQLite. The client writes the frontier beside the knowledge database,
then one bridge command asks native Project64 to validate and atomically install it. The old
JavaScript batch-loading path is not used.

Migration and repair never overwrite accepted historical products:

```text
python -m tools.total_resolver knowledge migrate-schema3 --output build/total-resolver/knowledge/total-resolver-v3.sqlite
python -m tools.total_resolver knowledge migrate-frontier --output build/total-resolver/knowledge/frontier-v4.sqlite --select
python -m tools.total_resolver knowledge import --sessions-root build/total-resolver/sessions
python -m tools.total_resolver knowledge rebuild --output build/total-resolver/knowledge/rebuilt.sqlite
python -m tools.total_resolver knowledge benchmark
```

The rebuild replays the successful ledger into a new database and requires direct, exact canonical
row equivalence. Stable ledger identity is compared exactly. Output paths/timestamps, legacy
diagnostic references, the historical frontier-format label, and the regenerated delta-summary
JSON are excluded because they are rebuild bookkeeping rather than machine facts. The benchmark
uses a fake emulator around the production bridge script; it never launches or controls Project64.

Ledger replay accepts protocols 0.8.0 through 0.12.0 as historical inputs plus the current 0.13.0
protocol. Protocol 0.7.x sessions remain available as raw historical captures but are not admitted
to persistent knowledge because they predate the accepted ordering and payload contract. Live
bridge compatibility remains exact-version only.

`migrate-schema3` replays the declared ledger into a new database and compares the schema-2
canonical fact foundation exactly before selection. `migrate-frontier` copies a supported database
beside its source, installs format 4 and the additive compact-activity/marker-context tables,
verifies it, then selects it only when `--select` is supplied. The prior database remains
untouched.

The frozen R2 resolver is historical reference only. If its old SQLite copy is absent, `doctor`
reports `SKIP` rather than blocking the schema-3 workflow; it is never used to seed dynamic facts.

## Querying the selected knowledge database

`explain`, `search`, `coverage`, and `unresolved` use one read-only `ResolverContext`. Its dynamic
source is the database named by `build/total-resolver/knowledge/selected.json`; the frozen static,
resource, and field products are opened as separate read-only evidence lanes. Every result includes
the selected database identity, ledger frontier, session count, frozen-source identities, and a
freshness statement. A generated historical Resolver can answer only when the caller explicitly
passes `--legacy-resolver PATH`; passing the wrong database type fails closed.

Typical bounded searches are:

```text
python -m tools.total_resolver search --function 0022b1
python -m tools.total_resolver search --rom 0x0022B6D0
python -m tools.total_resolver search --live 0x801E8400
python -m tools.total_resolver search --physical 0x001E8400 --opcode 0x24070002
python -m tools.total_resolver search --bytes 24070002
python -m tools.total_resolver search --session SESSION_ID --frame-start 5886 --frame-end 5886 --sequence-start 7271 --sequence-end 7271
python -m tools.total_resolver search --edge-from 0x001E83FC --edge-to 0x001E8400
python -m tools.total_resolver search --unresolved-kind exact-execution-placement-or-generation-unresolved
python -m tools.total_resolver search --marker-text persuasion
python -m tools.total_resolver search --session SESSION_ID --controller --buttons 0x80000000
```

Default results contain counts and a small representative preview. Use `--include SECTION` with
`explain` for a detailed lane, and `--limit`/`--cursor` for bounded pagination. Unresolved execution
results include the exact physical/opcode fact, byte-confirmed global and contemporaneous
candidates, the reason each candidate exists, contradictions or missing evidence, adjacent mapped
edges, and the additional observation needed to resolve it.

Schema 3 retains the session catalog, exact instruction/edge frame and bridge-sequence witnesses,
region lifetime intervals, sampled PCs, semantic markers, typed unresolved fields, selected-source
registry, and mapping-candidate evidence. New placements and residency evidence enqueue only
overlapping physical ranges for candidate recalculation. Candidate states are deliberately
separate: exact machine fact, byte-confirmed global candidate, contemporaneous candidate, uniquely
resolved live mapping, and ambiguous/conflicting mapping. Exact opcode equality makes a global
placement useful and searchable; it does not promote it without contemporaneous evidence.

Historical novelty filtering means a schema-3 replay can recover emitted events and saved samples,
but cannot recreate already-known instructions that older sessions suppressed. The limitation is
recorded per session rather than inferred away.

## Other common commands

Check frozen inputs and the live bridge:

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver doctor --connect
python -m tools.total_resolver pj64 health
python -m tools.total_resolver pj64 status
```

Manage an observation-only capture (labels remain optional context):

```text
python -m tools.total_resolver session start --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session label "army management"
python -m tools.total_resolver session mark "opened unit detail"
python -m tools.total_resolver session stop
python -m tools.total_resolver session verify SESSION_ID
python -m tools.total_resolver session dedupe SESSION_ID
```

Labels, marks, and notes are optional context. The recorder owns and removes only its own watches.
Its observation-only client facade has no control injection, RAM write, pause/resume, stepping,
state load/save, ROM lifecycle, global-clear, or memory-dump methods.

On protocol 0.13, a label/mark/note also requests a bounded native execution-context window by
default. The ring remains entirely in emulator memory while ordinary execution occurs. Only the
requested before/after window crosses the bridge, and an incomplete window is explicitly marked if
capture stops before its after side fills. This context has native local order and frames; it is
not promoted to canonical bridge ordering.

## Capture growth and exact deduplication

The raw staging session preserves every event that the bridge emits. Capture schema 4 stores large
exact byte payloads once and references them from occurrences. Its historically named SHA columns
are storage/diagnostic fields, not acceptance evidence; an existing candidate key is reused only
after exact BLOB comparison. Across sessions, the knowledge
database stores direct executable keys, exact edges, calls, DMA facts, and compact contextual
witnesses. All accumulated dynamic rows remain `live-unreviewed` machine facts; they do not
silently change accepted source ownership, boundaries, or semantic names.

Execution coverage is filtered natively against both the persistent frontier and the current
session before JavaScript is called. An
instruction is exactly physical address plus four opcode bytes. A known instruction reached
through a known edge is silent, but the native callback still tracks its predecessor. A new tail
after a known prefix, a known callee reached from a new caller, the same opcode at another physical
address, a changed opcode at a reused address, or an unresolved placement/generation is retained.
The bridge does not read or emit whole code pages. Generation context is attached only to emitted
novel or conservatively unresolved facts.

Instruction identity and ROM/function attribution are separate decisions. An observed instruction
is assigned to a proposed nominal or contemporaneous ROM offset only when all four captured opcode
bytes equal the ROM bytes at that offset. A static address crosswalk without observed opcode bytes
is returned as a candidate, not a resolved mapping. A mismatch keeps the exact physical/opcode fact
and a compact unresolved representative with an occurrence count; repeated witnesses remain in the
raw session rather than multiplying persistent unresolved rows. `knowledge verify` independently
checks every stored instruction-to-ROM mapping and its function range.

Controller states are coalesced only while consecutively unchanged and remain tied to their
session. Project64 copies DMA destination bytes at completion and compares the complete exact DMA
identity before JavaScript is called. Exact known transfers are silent. Partial or ambiguous
matches are conservatively emitted. Persistent ingestion collapses their canonical
placement/content fact while keeping compact per-session witness counts. Large DMA blobs use a
CRC32 bucket followed by exact BLOB comparison. These contextual rows, the 4 MiB startup census,
and one ledger row mean a repeated session is small, not literally zero bytes.

Known frontier facts have stable ordinals in format 4. Native Project64 sets ordinal hit bits while
it performs the same exact instruction, edge, and DMA comparisons. At stop it emits exactly one
compact three-bitmap summary. This restores session-level answers such as “the already-known
function ran in session X” without sending each repeated instruction to JavaScript or SQLite. The
bitmap proves membership only; detailed event correlation still requires a newly emitted fact,
saved sample, controller transition, or requested marker window.

`session dedupe` reports staging-database byte savings without changing data. Closed raw sessions
are not automatically deleted. The selected knowledge database is the cross-session shared fact
store; raw staging databases remain isolated for crash safety.

Build and inspect accepted products:

```text
python -m tools.total_resolver atlas build
python -m tools.total_resolver runtime build
python -m tools.total_resolver resolver build
python -m tools.total_resolver resolver verify build/total-resolver/products/resolver-r3
python -m tools.total_resolver explain func_00043d1c
python -m tools.total_resolver explain live:0x80197B70 --session SESSION_ID --sequence 200
python -m tools.total_resolver search --function PARTIAL_NAME
python -m tools.total_resolver search --physical 0x00197B70 --opcode 0xXXXXXXXX
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
```

A reused live address without session/sequence or frame context reports ambiguity instead of
selecting a convenient mapping. A bare nominal-address match is likewise reported as a candidate
until exact code bytes or a contemporaneous placement establish it.

Preserve and replay raw-first live context:

```text
python -m tools.total_resolver live bundle SESSION_ID --sequence 6
python -m tools.total_resolver live crash --session-id SESSION_ID --port 64656
python -m tools.total_resolver live replay BUNDLE_DIRECTORY
python -m tools.total_resolver live current 0x80123456 --port 64656
```

Raw bridge/session material is written before enrichment. Resolver failure therefore produces a
partial bundle rather than losing the observation. Live enrichment is marked `live-unreviewed`
and never mutates an accepted resolver database.

## Exact keys and fingerprints

Cryptographic capture integrity is not a persistent session/knowledge acceptance class. Executable
facts use direct address/opcode keys, and rebuild equivalence compares exact canonical rows. CRC32
is only a bucket accelerator for large DMA byte strings; exact BLOB equality decides reuse,
including under forced collisions. The Rev 0 ROM SHA-256 remains the repository-required target
identity. Legacy raw-session and explicit product hash fields remain readable for compatibility and
diagnostics. New stops write a context manifest without capture/file/mirror digests, and hash
mismatches alone cannot reject ingestion or lower otherwise exact DMA evidence. Legacy product
builders may retain deterministic
fingerprints, but capture novelty and knowledge equality do not depend on them.

## Tests

```text
python -m unittest discover -s tools/total_resolver/tests -v
```

The suite includes protocol incompatibility, global ordering, epoch/loss handling, DMA
destination-byte capture, page-read-free structural execution coverage, effective-input
transitions, forced fingerprint collisions, persistent idempotence and rollback,
known-prefix/new-tail and new-caller replays, relocated/changed code, unresolved fallback,
opcode-mismatched mapping rejection, incremental/full-rebuild exact-row equivalence,
schema-type rejection, immediate selected-knowledge queries, bounded indexed search, candidate
reconsideration, compact known-activity membership, marker-ring context, mutation-surface exclusion,
raw-session recovery,
deterministic products, contextual ambiguity, coverage conservation, and offline live-bundle
replay.
