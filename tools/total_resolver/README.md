# Total Resolver R3

Status: **Phases 0-9 implemented and verified; Phase 10 gameplay acquisition pending**

Total Resolver is a research accelerator beside the exact-ROM build. It keeps static facts,
runtime placement, exact execution, field hypotheses, and resource ancestry in separate evidence
lanes so a useful answer can remain explicit about uncertainty. Generated sessions, products, and
bundles live below ignored `build/total-resolver/` paths.

The implementation plan is `docs/PLAN_2026-08-17-total-resolver-r3.md`; current results and known
limits are summarized in `docs/total-resolver/implementation-status.md`.

## Bridge contract

The repo-local client requires Project64 bridge protocol `0.8.0` exactly and fails closed on a
version or capability mismatch. The bridge supplies:

- one emulator-side monotonic sequence across watch, PI DMA, execution-trace, and controller-input
  events;
- a bridge-instance epoch that changes when the script instance changes;
- one ordered drain queue;
- explicit dropped sequence ranges; and
- event-time destination bytes for ROM DMA completions;
- generation-aware unique instruction/edge observations with exact code-page bytes; and
- transitions in the effective Player 1 input returned to the game.

Recorder timestamps and frames are context only. They never replace bridge ordering, and neither
ordering nor a hash proves what transient destination bytes contained.

## Common commands

Check frozen inputs and the live bridge:

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver doctor --connect
python -m tools.total_resolver pj64 health
python -m tools.total_resolver pj64 status
```

Manage an observation-only capture:

```text
python -m tools.total_resolver session start --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session label "army management"
python -m tools.total_resolver session mark "opened unit detail"
python -m tools.total_resolver session stop
python -m tools.total_resolver session verify SESSION_ID
python -m tools.total_resolver session dedupe SESSION_ID
```

Labels, marks, and notes are optional context. The recorder owns and removes only its own watches;
passive capture does not press controls, write RAM, load a state, or clear bridge-global state.

## Capture growth and exact deduplication

Total Resolver follows one rule: **deduplicate payloads, never occurrences**. Every DMA, watch,
input, or trace occurrence that reaches the recorder keeps its bridge order and context. Large
exact byte payloads are stored once per session in `content_blob` and referenced by every event
that used them. SHA-256 is an index; a matching digest is reused only after size and exact bytes
also match. A mismatch fails closed.

Execution coverage is more aggressive because its identities are structural. During one active
bridge capture, returning to the same menu with the same bytes at the same physical placement does
not re-emit instruction or edge coverage already seen for that page generation. The bridge still
retains any new physical placement, changed page bytes, PC/opcode, control-flow edge, or controller
transition. A repeated prefix never disables observation of the rest of the stream: every executed
instruction still passes through the native novelty check, so a new edge reached after an old path
is retained. Consecutive identical controller states are coalesced; the next transition remains an
ordered event. DMA occurrences remain because a repeated transfer can still establish a new
placement lifetime, but repeated destination bytes share one stored blob.

`session dedupe` reports these exact savings without changing the database. Closed raw sessions
are not automatically deleted, and separate session databases do not physically share blobs.

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
selecting a convenient mapping.

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

## What hashes mean

Hashes detect byte changes, pin the exact inputs used by a generated product, make an offline
rebuild cheap to compare, and provide an efficient bucket for exact-content interning. Exact byte
comparison, not the hash alone, decides deduplication. Hashes do not establish semantics,
correctness, execution, or equivalent behavior. Exact event bytes, contextual placement records,
static facts, and human interpretation remain distinct evidence.

## Tests

```text
python -m unittest discover -s tools/total_resolver/tests -v
```

The suite includes protocol incompatibility, global ordering, epoch/loss handling, DMA
destination-byte capture, generation-aware execution coverage, effective-input transitions,
exact-content collision handling, raw-session recovery, deterministic products, contextual
ambiguity, source-identity rejection, coverage conservation, and offline live-bundle replay.
