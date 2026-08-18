# Total Resolver R3

Status: **Phases 0-9 implemented and verified; Phase 10 gameplay acquisition pending**

Total Resolver is a research accelerator beside the exact-ROM build. It keeps static facts,
runtime placement, exact execution, field hypotheses, and resource ancestry in separate evidence
lanes so a useful answer can remain explicit about uncertainty. Generated sessions, products, and
bundles live below ignored `build/total-resolver/` paths.

The implementation plan is `docs/PLAN_2026-08-17-total-resolver-r3.md`; current results and known
limits are summarized in `docs/total-resolver/implementation-status.md`.

## Bridge contract

The repo-local client requires Project64 bridge protocol `0.7.2` exactly and fails closed on a
version or capability mismatch. The bridge supplies:

- one emulator-side monotonic sequence across watch and PI DMA events;
- a bridge-instance epoch that changes when the script instance changes;
- one ordered drain queue;
- explicit dropped sequence ranges; and
- event-time destination bytes for ROM DMA completions.

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
```

Labels, marks, and notes are optional context. The recorder owns and removes only its own watches;
passive capture does not press controls, write RAM, load a state, or clear bridge-global state.

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

Hashes detect byte changes, pin the exact inputs used by a generated product, and make an offline
rebuild cheap to compare. They do not establish semantics, correctness, execution, or equivalent
behavior. Exact event bytes, contextual placement records, static facts, and human interpretation
remain distinct evidence.

## Tests

```text
python -m unittest discover -s tools/total_resolver/tests -v
```

The suite includes protocol incompatibility, global ordering, epoch/loss handling, DMA
destination-byte capture, raw-session recovery, deterministic products, contextual ambiguity,
source-identity rejection, coverage conservation, and offline live-bundle replay.
