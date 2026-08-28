# Total Resolver — Agent Guide

## Purpose

Total Resolver is a persistent runtime knowledge database for decompilation.
It combines facts from all accepted capture sessions.
It joins exact runtime facts with frozen static, resource, and field facts.
Use Total Resolver as an evidence navigator.

Runtime facts show what the machine did.
They do not prove game meaning, accepted function boundaries, or matching C.
Each new dynamic fact has the `live-unreviewed` state.

## Before a query

For a query task, read only the repository `AGENTS.md` and this file.
For a capture or maintenance task, also read these documents:

- `README.md`
- `docs/total-resolver/persistent-coverage-decision.md`
- The applicable status document or module document

All query commands work without Project64.
Run these checks before you use query results:

```text
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
```

If `knowledge verify` fails, stop.
Do not initialize or select a different database.
`knowledge status` identifies the current database.
`session status` describes the latest capture.
It can identify an older database or frontier.

## Query commands

Start with a function or an exact address.
Commands give small results by default.
Use `--include`, `--limit`, or `--cursor` only when you need more detail.

```text
python -m tools.total_resolver explain func_XXXXXXXX
python -m tools.total_resolver explain func_XXXXXXXX --relationship callers --include calls
python -m tools.total_resolver explain func_XXXXXXXX --relationship callees --include calls
python -m tools.total_resolver search --function PARTIAL_NAME
python -m tools.total_resolver search --physical 0x00123456 --opcode 0xXXXXXXXX
python -m tools.total_resolver search --session-keyword "capture name or notes"
python -m tools.total_resolver search --session SESSION_ID --frame-start 100 --frame-end 120
python -m tools.total_resolver search --edge-from 0x00123456 --edge-to 0x00124568
python -m tools.total_resolver search --focused-profile cutscene-studio-v1 --focused-target director-parser
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
```

`explain FUNCTION` searches all accepted sessions.
It shows callers and callees without a capture ID.
Use `--session-keyword` to find a session by its name or notes.
Then, use the session ID to find time, controller, marker, or focused-state context.

Use `callGraph.static` for frozen direct-call candidates.
Use `callGraph.runtime` for exact observed call relationships.
Frames, labels, controller states, activity bitmaps, and focused snapshots are context.
A known-activity hit proves only that a fact occurred in a session.
It does not prove the event time or the event count.
If a mapping is ambiguous, keep the mapping ambiguous.

## Access limits

A query agent has read-only access.
It can use `doctor`, read-only `pj64` checks, `knowledge status`, `knowledge verify`, and `session status`.
It can also use `explain`, `search`, `coverage`, and `unresolved`.

Do not do these actions without a database build assignment:

- A session start or stop
- GUI use
- A label, marker, name, or note
- Knowledge initialization, ingestion, import, selection, migration, or rebuild
- A legacy product or a live bundle
- Project64 start or control
- An emulator memory write

Joe must approve each capture run before it starts.
Never use computer control to start Project64.
