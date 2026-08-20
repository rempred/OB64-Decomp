# Total Resolver R3

Status: **Persistent protocol 0.12 native delta and pre-ROM capture implemented; schema 2 selected**

Total Resolver is a research accelerator beside the exact-ROM build. It keeps static facts,
runtime placement, exact execution, field hypotheses, and resource ancestry in separate evidence
lanes so a useful answer can remain explicit about uncertainty. Generated sessions, products, and
bundles live below ignored `build/total-resolver/` paths.

The implementation plan is `docs/PLAN_2026-08-17-total-resolver-r3.md`; current results and known
limits are summarized in `docs/total-resolver/implementation-status.md`.
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
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
```

A querying agent must not run `session start`, `session stop`, `knowledge ingest`, `knowledge
import`, `knowledge select`, or `knowledge migrate-frontier`. It must likewise avoid knowledge
initialization/rebuild and other commands that write capture, database, selection, or generated
product state. Those operations belong only to an agent explicitly assigned to build or maintain
the database. A general decompilation, investigation, or resolver-query task does not grant that
role.

Even a database-building agent must not start capture until Joe explicitly says the run is ready,
and must never use computer control to launch Project64.

## Bridge contract

The repo-local client requires Project64 bridge protocol `0.12.0` exactly and fails closed on a
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
  exact-endpoint edge, and exact event-time DMA keys;
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
python -m tools.total_resolver knowledge migrate-frontier --output build/total-resolver/knowledge/frontier-v3.sqlite --select
python -m tools.total_resolver knowledge import --sessions-root build/total-resolver/sessions
python -m tools.total_resolver knowledge rebuild --output build/total-resolver/knowledge/rebuilt.sqlite
python -m tools.total_resolver knowledge benchmark
```

The rebuild replays the successful ledger into a new database and requires direct, exact canonical
row equivalence. Stable ledger identity is compared exactly. Output paths/timestamps, legacy
diagnostic references, the historical frontier-format label, and the regenerated delta-summary
JSON are excluded because they are rebuild bookkeeping rather than machine facts. The benchmark
uses a fake emulator around the production bridge script; it never launches or controls Project64.

Ledger replay accepts protocols 0.8.0 through 0.11.0 as historical inputs plus the current 0.12.0
protocol. Protocol 0.7.x sessions remain available as raw historical captures but are not admitted
to persistent knowledge because they predate the accepted ordering and payload contract. Live
bridge compatibility remains exact-version only.

`migrate-frontier` copies a format-2 schema-2 database beside its source, changes only protocol/
frontier metadata, verifies all facts and materializations, then selects it only when `--select`
is supplied. The prior database remains untouched.

The frozen R2 resolver is historical reference only. If its old SQLite copy is absent, `doctor`
reports `SKIP` rather than blocking the schema-2 workflow; it is never used to seed dynamic facts.

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
mutation-surface exclusion, raw-session recovery,
deterministic products, contextual ambiguity, coverage conservation, and offline live-bundle
replay.
