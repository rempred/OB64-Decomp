# Total Resolver — Agent Guide

This guide applies to every file below `tools/total_resolver/`. Total Resolver is a practical
decompilation accelerator. Preserve unique machine facts conservatively, state uncertainty, and
do not treat its live observations as courtroom evidence or as automatic structural promotion.

## Required reading

Read, in order:

1. the repository-root `AGENTS.md`;
2. this file;
3. `tools/total_resolver/README.md`;
4. `docs/total-resolver/persistent-coverage-decision.md`; and
5. the implementation-status page or module relevant to the task.

Read `docs/AUDIT.md` only when the work changes accepted structure, placement foundations,
executable boundaries, or the toolchain contract.

## Start with the selected knowledge database

Offline queries do not need Project64. Unless the task is specifically a migration or rebuild,
omit `--db` so commands use the canonical database named by ignored
`build/total-resolver/knowledge/selected.json`.

An ordinary Total Resolver user is a **querying agent**. Querying agents remain read-only and may
use only the following command families:

- `doctor` and read-only `pj64 health`/`pj64 status`;
- `knowledge status` and `knowledge verify`;
- `session status`; and
- `explain`, `coverage`, and `unresolved`.

In particular, a querying agent must not run:

- `session start` or `session stop`;
- `knowledge ingest` or `knowledge import`;
- `knowledge select` or `knowledge migrate-frontier`; or
- `knowledge init`, `knowledge rebuild`, capture recovery, product builders, or any other command
  that writes capture, knowledge, selection, or generated product state.

Those commands are reserved for an agent explicitly assigned to build or maintain the database.
Being asked to decompile a function, investigate behavior, inspect Total Resolver, or use its facts
does not make an agent a database-building agent.

Run these read-only checks before relying on its facts:

```text
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
python -m tools.total_resolver session status
```

`knowledge verify` must pass. A missing selected database is a setup decision; do not silently
initialize or select a different database. A closed latest session is normal. An optional missing
frozen R2 resolver appears as `SKIP` in `doctor` and does not invalidate schema 2.

For this workstation, verify the external runtime with:

```text
python -m tools.total_resolver doctor --project64-root C:\Users\Joe\Projects\project64
```

The dedicated live bridge currently uses port 64656. The port is local runtime configuration, not
part of a captured fact. A read-only live check is:

```text
python -m tools.total_resolver pj64 status --port 64656
```

Connection failure means no bridge is available; it is not permission to launch or manipulate the
emulator.

## Use the accumulated knowledge

Prefer the supported command surface over ad hoc writes:

```text
python -m tools.total_resolver explain func_XXXXXXXX
python -m tools.total_resolver explain live:0x80123456 --session SESSION_ID --sequence SEQUENCE
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
```

Exact physical-address/opcode instructions, exact endpoint edges, and exact DMA destination bytes
are machine facts. ROM/function mapping is byte-confirmed but remains `live-unreviewed` placement
evidence. Frames, timestamps, controller transitions, page generations, and labels are context.
None of these alone proves a semantic name, accepted function boundary, source owner, or matching-C
claim. A reused live address requires session/sequence context; do not choose a convenient mapping
when the resolver reports ambiguity.

The database grows with unique knowledge. Repeated sessions may still add session context,
counters, unresolved representatives, and genuinely new paths. Do not delete facts to make counts
look cleaner, and do not manually edit SQLite tables.

## Database-building agents only: capture requires Joe's explicit readiness

A querying agent never enters this workflow. For an explicitly assigned database-building agent, a
request to inspect, test, document, or use Total Resolver is still not permission to start a capture
or install a watch. Start only after Joe explicitly says he is ready for that run. Never use
computer control to launch Project64. Do not open/reset a ROM, load a state, pause/resume, step,
inject controller input, or write RAM on the recorder's behalf.

For an explicitly authorized ordinary run:

```text
python -m tools.total_resolver session start --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session stop
python -m tools.total_resolver knowledge verify
```

Use `--before-rom` only when Joe explicitly requests a fresh power-on capture and Project64 truly
has no loaded ROM or allocated N64 RDRAM. Arm it first, then Joe manually opens the exact Rev 0 ROM.
The bridge never opens the ROM. Stop promptly when requested.

Normal stop verifies the isolated staging database and atomically ingests it. If stop or ingestion
fails, leave the raw session intact, report the error, and use an explicit retry only after the
cause is understood:

```text
python -m tools.total_resolver session verify SESSION_ID
python -m tools.total_resolver knowledge ingest SESSION_ID
```

Never make a rejected or interrupted session look accepted by editing its manifest, capture, or
ledger. Do not expose the selected knowledge database or captured bytes to the bridge's broader
mutation commands; recorder code must use `ObservationOnlyPj64Client`.

## Database-building agents only: compatibility and repair

Live capture requires bridge protocol 0.12.0 and frontier format 3 exactly. Deterministic ledger
replay also accepts already-ingested historical protocols 0.8.0, 0.9.0, 0.10.0, and 0.11.0.
Protocol 0.7.x captures predate the accepted ordering/evidence contract and remain raw historical
sessions only.

Migration and rebuild outputs must be new files beside the accepted database; never overwrite the
selected source:

```text
python -m tools.total_resolver knowledge migrate-frontier --output NEW_DATABASE
python -m tools.total_resolver knowledge rebuild --output NEW_DATABASE
```

Select a migrated copy only when the task explicitly authorizes selection and its verification
passes. A rebuild is a repair/equivalence oracle, not the normal capture path.

## Change and verification rules

- Inspect Git status in the decomp, bridge, and native Project64 repositories before overlapping
  their files. Preserve unrelated dirty work.
- Do not create a branch or worktree without Joe's explicit direction.
- Keep Project64 optional for the ordinary exact-ROM build and for offline resolver queries.
- Keep generated sessions, databases, frontiers, RAM captures, products, and benchmarks below
  ignored `build/total-resolver/` paths.
- When the wire contract changes, bump the protocol, fail closed, update the bridge and client
  together, and add compatibility tests.
- When the native runtime changes, update its complete production source set and tested binary
  identities in `config/total-resolver/sources.json`; never refresh an identity merely to silence a
  failed check.
- Do not start a real capture as a test. The benchmark and bridge harness use fake emulators.

Run the complete tool suite after changes:

```text
python -m unittest discover -s tools/total_resolver/tests -v
python -m tools.total_resolver doctor --project64-root C:\Users\Joe\Projects\project64
python -m tools.total_resolver knowledge verify
```

A Total Resolver change is ready for agents only when the applicable tests, frozen runtime check,
and selected-database verification pass, with any remaining coverage or semantic uncertainty
reported plainly.
