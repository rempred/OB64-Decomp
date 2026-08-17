# Total Resolver R3 Product Plan

Status: **proposed complete product plan — implementation not yet authorized by this document alone**  
Created: 2026-08-17  
Revised: 2026-08-17 — **Total Resolver is a first-class `OB64-Decomp` tool**  
Target: **Ogre Battle 64: Person of Lordly Caliber, US Rev 0 only**

## 1. Executive Summary

The project already has nearly all of the difficult ingredients required for a much stronger runtime-to-static research system:

- a byte-exact Rev 0 decomp/static model;
- a static call/database aide;
- a static resource-load-chain aide;
- a static structure/field-access aide;
- an offline overlay/placement atlas built from many saved runtime states;
- a runtime provenance atlas built from selected observed sessions;
- a source-neutral Unified Resolver that joins accepted aides while preserving evidence lanes;
- a custom `ob64-core` Project64 fork;
- a persistent Python Project64 client that can read/write RAM, install read/write/execute watches, drain structured events, frame-step, instruction-step, load/save states, drive controller input, capture framebuffer state, and dump RDRAM.

The missing product is not another debugger or another static database. The missing product is a **decomp-owned Total Resolver** that combines the accepted static model with clean, live Project64 acquisition and can build a new dynamic placement/runtime database while the game is actually being played.

The implementation belongs in this repository under `tools/total_resolver/`. Project64 remains an external runtime dependency, but the client, recorder, schemas, derivation pipeline, resolver, verifier, coverage tools, and user-facing commands are decomp-repo tools.

Large or mutable runtime outputs must still obey the decomp repository's source-ownership rules. Session databases, RAM captures, screenshots, temporary traces, generated SQLite products, and similar bulk artifacts live under ignored `build/total-resolver/` paths by default. The **tool is tracked; the raw runtime corpus is generated/ignored unless a deliberately bounded fixture is approved for version control.**

Total Resolver R3 has four major responsibilities:

1. **Capture reality without losing transient states.** A code or data placement that exists for one or two frames must be recordable even if no savestate was ever made while it was resident.
2. **Separate machine truth from human interpretation.** Project64 can prove that bytes were loaded, placed, executed, read, or written. Human labels such as `World Map`, `Army - Equipment`, or `Battle Results` remain annotations and never become machine identity.
3. **Resolve live and offline evidence through one query surface.** A live PC, ROM offset, function, field, resource, loader event, runtime placement, or watch hit should be traceable through accepted static and dynamic evidence without collapsing placement into execution or candidate evidence into fact.
4. **Measure coverage rather than guessing completeness.** R3 must report what the static model has never seen dynamically and what dynamic observations still cannot be explained statically.

The current Unified Resolver and its five source products should be frozen as reference inputs. R3 is built beside them, proven independently, then promoted only after its capture, derivation, query, and verification contracts pass.

The first implementation milestone is deliberately narrow: **capture one real transition end-to-end with no lost transient loads, regenerate that transition deterministically from a raw session database, and resolve its captured live PCs back to accepted static identities.** If that works, full-game acquisition becomes a coverage program rather than another one-off research project.

---

## 2. Product Definition

### 2.1 What Total Resolver R3 is

Total Resolver R3 is a tracked tool suite in `OB64-Decomp` consisting of:

- a Project64 bridge client owned by this repo, or a thin repo-local compatibility layer over the existing bridge protocol;
- a **raw live-session recorder**;
- a **placement/lifetime derivation pipeline** that produces Overlay Atlas 2.0 data;
- an **execution/memory-provenance derivation pipeline** that produces Runtime Provenance 2.0 data;
- adapters for the accepted static aides;
- a new R3 resolver registry and normalized query database;
- a live-session adapter that can enrich current Project64 events without granting them accepted status;
- deterministic coverage, provenance, unresolved, conflict, and review reports;
- a stable CLI/API usable by humans and Codex.

### 2.2 What Total Resolver R3 is not

It is not:

- a replacement for the byte-exact decomp;
- a replacement for Project64;
- a requirement to adopt Ghidra as canonical;
- a claim that every possible game state can be mathematically proven visited;
- a semantic gameplay database where a screen name automatically proves code meaning;
- a reason to commit ROMs, savestates, full RAM dumps, screenshots, or generated bulk databases to Git;
- a destructive migration of Atlas 1.x or the current Unified Resolver;
- a requirement that the normal decomp build have a running Project64 instance.

---

## 3. Repository Ownership and Layout

This revision intentionally makes Total Resolver a **decomp-repository capability**.

### 3.1 `OB64-Decomp` owns the Total Resolver implementation

Tracked source should live here:

```text
tools/total_resolver/
```

This repository owns:

- capture/recorder source code;
- Project64 client/protocol code required by the resolver;
- loader-specific decoders;
- schemas;
- static-source adapters;
- Overlay Atlas 2.0 generator;
- Runtime Provenance 2.0 generator;
- normalized resolver builder;
- query API/CLI;
- live event enrichment;
- coverage reporting;
- verifiers and tests;
- curated product documentation;
- small approved fixtures.

The decomp's accepted function ranges, structural ownership, overlay descriptors, linker model, and exact bytes remain the canonical static foundation.

### 3.2 Project64 is an external runtime dependency

The `ob64-core` Project64 fork can remain in its own repository/location. R3 communicates through the existing bridge protocol.

R3 should not require the Project64 source tree to be nested in `OB64-Decomp`.

The normal relationship is:

```text
OB64-Decomp/tools/total_resolver
        |
        | TCP bridge protocol
        v
Project64 ob64-core + OB64 bridge
```

If later it is useful to version the JavaScript bridge script itself in this repo, that should be an explicit migration with one canonical copy and protocol-version tests. Do not begin R3 by creating two independently maintained bridge implementations.

### 3.3 Generated runtime data stays in the decomp repo working tree but out of Git

Default generated root:

```text
build/total-resolver/
```

Suggested structure:

```text
build/total-resolver/
  sessions/
    <session-id>/
      capture.sqlite
      manifest.json
      events.ndjson
      captures/
      session.log
  products/
    overlay-atlas-2.sqlite
    runtime-provenance-2.sqlite
    resolver-r3.sqlite
    reports/
    manifests/
  cache/
```

These paths should be ignored unless a small fixture is intentionally promoted.

### 3.4 Version-controlled configuration and fixtures

Recommended tracked locations:

```text
config/total-resolver/
  sources.json
  loaders.json              # only if declarative loader config is useful
  policy.json               # only if policy is not clearer in code/docs

tests/fixtures/total-resolver/
  synthetic/
  transition-golden/        # bounded, copyright-safe evidence only
```

Do not commit raw game binaries or full captured game memory merely to make a test self-contained.

### 3.5 Parent workspace relationship

The parent research workspace may still hold historical experiments, old atlases, savestate corpora, and research logs. R3 may import explicitly identified historical products for **comparison**, but its implementation and normal command surface belong here.

This plan therefore supersedes the earlier assumption that the recorder/resolver code itself should remain a parent-workspace product.

---

## 4. Existing Foundation and Source Lanes

The current Unified Resolver is already source-neutral and registry-driven. Its accepted input families are represented by five adapters.

### 4.1 Static DB R3

Current adapter identity:

```text
static-db-r3
```

Provides:

- logical functions;
- z64 function ranges;
- structural/display names;
- direct callsites;
- candidate callees;
- indirect calls;
- unresolved targets;
- static caller/callee relationships.

Evidence lane: `static`.

### 4.2 Static Resource Load-Chain Atlas

Current adapter identity:

```text
resource-chain-static
```

Provides:

- resources and aliases;
- containers and catalog entries;
- loaders;
- codecs;
- consumers;
- allocations;
- chains, stages, edges;
- unresolved links and conflicts;
- ROM/source/live ranges where statically supported.

Evidence lane: `resource`.

### 4.3 Static Structure and Field-Access Atlas

Current adapter identity:

```text
structure-field-static
```

Provides:

- object families;
- field candidates;
- access sites;
- pointer lineage;
- field assignments;
- propagation stops;
- semantic claims;
- conflicts and unresolved evidence.

Evidence lanes: `field` plus bounded static ownership.

### 4.4 Offline Overlay Atlas R3

Current adapter identity:

```text
overlay-atlas-r3
```

Provides:

- logical function placement observations;
- state/input identities;
- RAM/live function locations;
- validated/candidate slabs;
- placement ambiguities.

Evidence lane: `placement`.

Its finite savestate corpus is useful historical evidence, but absence from that corpus is not evidence that code is unused.

### 4.5 Runtime Provenance R3

Current adapter identity:

```text
runtime-provenance-r3
```

Provides:

- runtime sessions;
- state identities/load proofs;
- frames/events/watches;
- executed PCs;
- mapped functions;
- memory accesses;
- observed direct/indirect targets;
- basic-block mappings;
- runtime overlay placements;
- live validation;
- conflicts/predictions.

Evidence lane: `runtime`.

### 4.6 Clean R3 migration policy

For the new clean dynamic lane:

- Static DB, Resource Chain Static, and Structure/Field Static may remain accepted static feeds if current identity checks pass.
- Old Overlay Atlas R3 and Runtime Provenance R3 are frozen reference products and **do not seed clean R3 dynamic facts**.
- Clean dynamic observations originate from new R3 capture sessions.
- Historical products can later be compared against clean R3 and classified as corroborated, compatible-but-unseen, conflicting, or unresolvable.

This avoids inheriting questionable old savestate names or hidden corpus gaps.

---

## 5. Product Goals

### G1. Clean acquisition from actual gameplay

Start from a known Rev 0 ROM and a fresh R3 capture session. A clean boot/new game is preferred for the first broad coverage run. Old savestate labels are not required.

### G2. Preserve transient loads

A code or data placement that exists for one event, one frame, a few frames, or only during a transition must remain representable.

### G3. Capture source, destination, content, lifetime, and execution separately

For every observed load where evidence permits, retain:

- loader/trigger;
- source ROM/resource identity;
- destination RAM range;
- content identity/hash;
- first/last observed sequence and frame;
- replacement/unload reason;
- functions/bytes mapped into the region;
- whether mapped bytes were actually executed;
- relevant reads/writes;
- confidence and evidence basis.

### G4. Human labels are optional annotations

Examples:

```text
World Map
Army - Unit List
Army - Equipment
Entering Item Shop
Battle - Results
```

A corrected human label must not change placement identity or raw machine evidence.

### G5. Live resolution

During a Project64 session, a watch hit or live PC should be immediately resolvable against:

- accepted static structure;
- accepted dynamic evidence;
- current live-unreviewed session evidence;
- current sequence/frame/configuration context.

### G6. Fail closed on reused live addresses

If the same KSEG range can host different overlays, a context-free query must not guess. Session/frame/region context must disambiguate it or the result stays unresolved.

### G7. Deterministic regeneration

Raw session evidence must be sufficient to regenerate all derived dynamic rows and reports deterministically.

### G8. Measurable coverage

R3 must answer:

- **static -> dynamic:** what known code/resources have never been observed placed or executed?
- **dynamic -> static:** what observed placements/PCs/loads still cannot be explained by accepted static identities?

### G9. Repo-local usability

A contributor with the decomp repo plus the configured Project64 runtime dependency should be able to use the canonical commands without locating a separate resolver source tree.

---

## 6. Non-Goals

R3 does not initially need to:

- fully automate gameplay;
- understand every menu name without human input;
- prove semantic behavior of every function;
- trace every instruction continuously;
- hash all 8 MiB of RDRAM every frame;
- import all old savestates;
- create a GUI before capture is proven;
- modify ROM/RAM during ordinary capture;
- infer function meaning from co-residency;
- treat a static loader chain as proof of natural reachability;
- make runtime acquisition part of `node tools/build.js` or ordinary exact-ROM verification.

---

## 7. Governing Invariants

### 7.1 Address-space separation

Never collapse:

1. z64 ROM offsets;
2. raw `.v64` byte positions;
3. nominal linear VRAM labels;
4. physical RDRAM offsets;
5. live KSEG addresses.

The early-boot `RAM = ROM + 0x8006FC00` shortcut is not valid for later overlays.

### 7.2 Placement is not execution

A byte-exact region resident in RAM proves placement within its evidence limits. It does not prove any instruction in that region executed.

### 7.3 Execution is session-scoped

Observed execution proves a PC/function executed in the recorded session/context. It does not prove universal gameplay semantics.

### 7.4 Human labels are not machine identity

`Army - Equipment` is annotation. The machine identity is the placement/resource/execution configuration.

### 7.5 Whole-RAM hashes are diagnostic only

RNG, stacks, actors, timers, animation state, and heaps make whole-RAM identity unsuitable for configuration deduplication.

### 7.6 Closed raw sessions are immutable inputs

Once a session is closed and its manifest is written, derivation must not rewrite the raw event stream. Corrections happen in derived products or superseding annotations.

### 7.7 Live evidence cannot silently become accepted evidence

Current-session rows use a distinct review state such as:

```text
live-unreviewed
```

Promotion requires the normal build/verifier/review path.

### 7.8 No hidden ambiguity repair

Conflicts, unknown loader completion, overlapping placements, missing sources, and unresolved mappings remain visible.

### 7.9 Observation-only by default

The normal recorder does not press buttons, alter RAM, patch ROM, force transitions, or inject code. Automated exploration is a separate explicit mode.

### 7.10 Decomp exactness remains independent

The Total Resolver is a decomp tool, but a live runtime is not required to rebuild or verify the retail ROM. Runtime research must not weaken the exact baseline.

### 7.11 Generated bulk is not source

Tracked code/config/docs are source. Session DBs, live dumps, screenshots, generated resolver DBs, caches, and large reports are build/research outputs unless explicitly promoted under a reviewed fixture policy.

---

## 8. High-Level Architecture

```text
                         OB64-Decomp repository

 +-------------------+       +----------------------+       +-------------------+
 | Byte-exact static |------>| Total Resolver R3    |<------| Human annotations |
 | model / aides     |       | tools/total_resolver |       | labels / markers  |
 +-------------------+       +----------+-----------+       +-------------------+
                                       ^ |
                              raw P64  | | live queries
                               events  | v
                             +---------+---------+
                             | Project64 client  |
                             | + recorder        |
                             +---------+---------+
                                       |
                                  TCP bridge
                                       |
                                       v
                              +------------------+
                              | Project64        |
                              | ob64-core        |
                              +------------------+

 Generated/ignored:
 build/total-resolver/sessions/*
 build/total-resolver/products/*
```

The key design rule is:

> **Project64 writes raw observations. Derivation builds placement/runtime evidence. The accepted resolver consumes the derived products.**

Project64 never writes directly into the accepted resolver database.

---

## 9. Recommended Repo-Local Module Layout

```text
tools/total_resolver/
  README.md
  __init__.py
  cli.py
  pj64_client.py             # canonical repo-local bridge client
  protocol.py                # command/event schema and version checks
  recorder.py                # Pj64CaptureRecorder
  capture_db.py
  bridge_events.py           # raw event normalization only
  watch_manager.py
  loader_catalog.py
  loaders/
    __init__.py
    <loader-specific decoders>.py
  region_tracker.py
  configuration.py
  annotations.py
  derive_overlay.py
  derive_runtime.py
  resolver_core/
    ...
  adapters/
    static_db.py
    resource_chain.py
    structure_field.py
    overlay_atlas_v2.py
    runtime_atlas_v2.py
    live_session.py
  live_resolver.py
  coverage.py
  verify.py
  health.py
  schemas/
    capture.sql
    normalized.schema.json
  tests/
    ...

config/total_resolver/
  sources.json

tests/fixtures/total_resolver/
  synthetic/
  transition-golden/
```

### 9.1 Project64 client ownership

The repo should own the client API used by Total Resolver. There are two acceptable migration paths:

1. move/adopt the existing proven `Pj64Agent` implementation into `tools/total_resolver/pj64_client.py`; or
2. create a thin decomp-local wrapper over a separately installed client only temporarily, then remove the cross-repo dependency after parity is proven.

The preferred steady state is **one canonical repo-local client for this tool**.

Do not duplicate the bridge protocol without version checks and parity tests.

### 9.2 User-facing command

Prefer one command surface:

```text
python -m tools.total_resolver <command>
```

or, if project conventions favor script entrypoints:

```text
python tools/total_resolver/cli.py <command>
```

Exact packaging can be decided during implementation, but there should be one documented normal interface.

---

## 10. Raw Session Capture Store

The raw session database is the foundation of R3. It must favor preservation over interpretation.

Default location:

```text
build/total-resolver/sessions/<session-id>/capture.sqlite
```

Side artifacts:

```text
manifest.json
events.ndjson              # optional raw mirror
captures/                  # bounded region/frame artifacts
session.log
```

### 10.1 `session`

Record at least:

- `session_id`;
- start/end UTC timestamps;
- Total Resolver version/commit;
- Project64 fork identity when available;
- bridge/protocol version;
- CPU core;
- ROM identity (CRC1/CRC2, country, version, normalized hash when known);
- `OB64-Decomp` commit/dirty-state summary;
- selected static source identities;
- accepted resolver identity if live enrichment is enabled;
- capture mode;
- intervention policy;
- closure status;
- manifest/hash identity.

### 10.2 `event_sequence`

Every bridge-derived event gets a recorder-local monotonically increasing sequence number.

Required concepts:

- `sequence_id`;
- Project64 frame count;
- host monotonic timestamp;
- bridge event type;
- raw payload hash;
- raw payload;
- ingestion status.

Frame number alone is not sufficient because multiple important loads/accesses can happen within one rendered frame.

### 10.3 `frame_sample`

Frame samples are context, not the master ordering primitive.

Possible fields:

- frame number;
- paused/running state;
- optional frame hash;
- current semantic marker;
- current configuration signature;
- recorder health counters.

### 10.4 `watch_definition`

Every recorder-installed watch must be auditable:

- watch ID;
- exec/read/write kind;
- address/range/size;
- label;
- reason;
- source of watch definition;
- installed/removed sequence;
- expected event rate;
- interpreter-mode requirement/verification.

### 10.5 `loader_event`

Represents an observed loader/DMA/decompress/resource transition.

Fields should allow partial knowledge:

- loader event ID;
- entry/completion sequence and frame;
- loader live PC;
- resolved loader function if known;
- source ROM/resource identity if known;
- compressed/decoded length when known;
- destination physical/live range;
- codec if known;
- register/argument snapshot reference;
- completion method;
- confidence/evidence grade;
- unresolved reason.

A partial event is better than dropping it.

### 10.6 `region_instance`

This is the central temporal placement concept.

One row means:

> **These bytes occupied this destination range for this observed lifetime.**

Fields:

- region instance ID;
- destination physical RDRAM start/end;
- live KSEG start/end;
- size;
- strong content identity/hash;
- first observed sequence/frame;
- last observed sequence/frame;
- replacement/unload/session-end reason;
- source loader event;
- source ROM/resource candidate;
- classification: executable/data/mixed/unknown;
- confidence;
- exact-byte-match status;
- optional capture artifact reference.

A later load into the same RAM range creates a **new region instance**. It never rewrites the old one.

### 10.7 `placement_observation`

Maps a static identity into a region instance.

Mapping methods must be explicit, for example:

- direct loader provenance;
- exact byte equality;
- validated slab delta;
- static descriptor mapping;
- candidate heuristic.

### 10.8 `execution_observation`

Represents observed execution:

- sequence/frame;
- live PC;
- physical PC;
- contemporaneous region instance;
- mapped z64 instruction/function when resolvable;
- event/watch source;
- register snapshot reference;
- evidence grade;
- mapping confidence.

### 10.9 `memory_access`

For read/write evidence:

- sequence/frame;
- access kind;
- width;
- effective address;
- value before/after where available;
- reader/writer PC;
- contemporaneous code region instance;
- static function/instruction when resolvable;
- optional field/resource relationship.

### 10.10 `semantic_marker`

Human annotation only.

Fields:

- marker ID;
- sequence/frame;
- optional end sequence/frame;
- label;
- type: stable-state, transition-start, transition-end, note, visible-action;
- source: human, inferred, imported-candidate;
- confidence;
- supersedes marker;
- note.

Human labels never become placement keys.

### 10.11 `transition`

Transitions are first-class because transient overlays/data may exist only between visible states.

Fields:

- transition ID;
- from marker/state;
- to marker/state;
- start/end sequence/frame;
- loader events in the interval;
- region instances born/destroyed in the interval;
- optional human note.

### 10.12 `configuration`

A machine configuration is a deduplicated set of relevant loaded region identities, not all RAM.

Recommended signature input:

```text
sorted(
  region class,
  destination start/end,
  content/source identity,
  loader/resource identity where known
)
```

Separate code/resource/combined configuration signatures if useful.

### 10.13 `unresolved_observation`

Anything unsafe to classify remains visible:

- unknown changed executable page;
- loader hit with unresolved destination;
- bytes changed before completion was captured;
- reused live address with multiple static candidates;
- bridge event lacking context;
- unresolved source resource;
- execution in an unknown region.

Every unresolved row should include the **smallest next evidence** likely to resolve it.

### 10.14 `recorder_health`

Track capture trustworthiness:

- event queue depth/high-water mark;
- dropped-event count if available;
- drain cadence;
- longest drain stall;
- frame polling latency;
- CPU core;
- bridge reconnects;
- watch failures;
- recorder exceptions;
- Project64 pause/wedge/relaunch events.

A session with known event loss cannot silently support full coverage claims.

---

## 11. Project64 Capture Design

### 11.1 Reuse the proven bridge protocol

Start from the capabilities already proven by the existing client/bridge. Do not rewrite `ob64-core` first.

Required operations include:

- health/status/execution/exception;
- exact RAM reads and batched reads;
- exec/read/write watches;
- event draining;
- pause/resume;
- frame stepping;
- instruction stepping;
- state identity/load/save where explicitly used;
- controller input for later automated mode;
- frame capture/hash;
- RDRAM dump/crash diagnostics.

Only modify Project64 or the bridge after a concrete missing primitive blocks a done-gate.

### 11.2 Recorder startup

The recorder should:

1. connect to Project64;
2. verify bridge protocol version;
3. verify exact ROM identity;
4. verify CPU core and require interpreter mode when watch coverage depends on it;
5. record current frame/emulator state;
6. clear only recorder-owned stale watches/events under an explicit ownership rule;
7. install loader/DMA/decompress watches;
8. record all installed watch definitions;
9. begin event draining before gameplay resumes;
10. establish an initial machine configuration without assuming a human label.

### 11.3 Event loop

The primary timeline is:

```text
bridge event order -> recorder sequence -> frame context
```

not:

```text
one snapshot per frame
```

The recorder must drain frequently enough that several important events can occur within one frame without being collapsed.

### 11.4 Loader instrumentation

Begin with loader, DMA, cache, decompression, and allocation paths already identified by static/resource-chain work.

Each loader should have a small decoder contract:

- entry watch;
- source representation;
- destination representation;
- length representation;
- required registers/arguments;
- completion indicator;
- asynchronous behavior;
- cache/ready semantics if relevant;
- known alternate paths.

Use loader-specific decoders instead of one monolithic heuristic.

### 11.5 Completion detection

Possible evidence:

- loader return;
- DMA completion callback;
- decompressor return;
- cache maintenance event after write completion;
- bounded destination stability;
- resource-chain completion event.

Record the method and confidence. Unknown completion remains unresolved.

### 11.6 Region lifetime tracking

When a completed load writes a range:

1. close or split previous overlapping region instances;
2. hash/capture the new range;
3. create the new region instance;
4. attempt direct source/resource/ROM mapping;
5. attempt exact-byte/static-function crosswalk;
6. update the configuration identity;
7. keep the instance alive until replaced, unloaded, or session end.

Partial overlap must be modeled explicitly.

### 11.7 Transient requirement

No minimum lifetime is allowed for machine acquisition.

R3 must represent sequences such as:

```text
frame N:     stable overlay A
frame N+1:   transient overlay B
frame N+2:   transient data C / overlay D
frame N+3:   final overlay E
```

B, C, and D remain valid observations even if no distinct screen is rendered for them.

### 11.8 Unknown-change safety net

Known loader hooks may miss alternate paths. After primary capture works, add bounded checks such as:

- page hashes of known dynamic load pools at frame boundaries;
- hashes after loader/DMA completion;
- destination-pool write watches;
- execution in pages lacking a current region identity;
- current page identity compared against region tracker.

Purpose:

> **Detect changes the known loader instrumentation failed to explain.**

This is a safety net, not the primary acquisition model.

### 11.9 Data loads are first-class

Region class:

```text
executable
data
mixed
unknown
```

Scripts, tables, cutscene streams, relocated data, and other non-code resources are valid runtime evidence.

### 11.10 Execution observation

Avoid full continuous instruction tracing by default. Prefer:

1. focused watches;
2. loader/entrypoint observations;
3. observed call edges from focused harnesses;
4. targeted execute ranges for new placements;
5. short bounded traces when needed.

Residency never creates execution evidence by itself.

### 11.11 Rolling context buffer

Keep a bounded recent event/frame buffer so a human can label a visible state after recognizing it. The raw session DB remains authoritative.

Example initial default:

```text
10 seconds or 300 frames
```

---

## 12. Human Play and Label Workflow

### 12.1 No prompt on every machine change

The recorder remains silent during ordinary play unless:

- the user explicitly labels/marks;
- capture integrity is threatened;
- optional discovery notifications are enabled.

Transient configurations are captured automatically without semantic questions.

### 12.2 Canonical commands

Recommended first command surface:

```text
python -m tools.total_resolver session start
python -m tools.total_resolver session status
python -m tools.total_resolver session label "World Map - Palatinus"
python -m tools.total_resolver session mark "Entering Army menu"
python -m tools.total_resolver session note "Opened equipment for Magnus"
python -m tools.total_resolver session stop
```

Later, a hotkey sidecar may make labels easier while playing.

### 12.3 Label correction

Annotations are superseded, not silently rewritten:

```text
marker 42: "Equipment"          superseded
marker 57: "Army - Equipment"  supersedes 42
```

### 12.4 Transition context

If two stable states are labeled, R3 may contextually describe the interval:

```text
World Map -> Army - Unit List
```

but that does not assign the same semantic meaning to every transient load within the interval.

---

## 13. Derived Product: Overlay Atlas 2.0

Overlay Atlas 2.0 is generated from clean raw sessions and is no longer fundamentally savestate-oriented.

### 13.1 Primary entities

- session/source input;
- region instance;
- placement identity;
- static function placement;
- slab/contiguous mapping;
- configuration;
- transition context;
- ambiguity/conflict;
- witness.

### 13.2 Placement identity

A placement key derives from machine facts such as:

- source ROM/resource range when known;
- destination physical/live range;
- content identity;
- length;
- relocation/slab relationship.

Human labels are excluded.

### 13.3 Witnesses

Repeated observations accumulate witnesses instead of duplicate identities.

Example:

```text
placement P
  session 1 / frames ...
  session 3 / frames ...
  observed around "Army - Equipment"
  observed around "Army - Unit Detail"
```

### 13.4 Placement grades

Recommended conceptual levels:

- verified placement: direct source/destination proof plus exact resulting bytes or equivalent direct proof;
- supported placement: exact byte crosswalk with validated boundaries/slab evidence;
- candidate placement: plausible but incomplete mapping;
- unresolved: observed region without safe static identity.

Use the project's existing evidence vocabulary exactly if it differs; do not create incompatible grade meanings casually.

### 13.5 Required reports

- placement inventory;
- region lifetime summary;
- transient-only placements;
- placement-by-human-context;
- source->destination map;
- destination reuse/ambiguity;
- never-seen static placement candidates;
- unresolved runtime regions;
- post-build old-Atlas comparison.

---

## 14. Derived Product: Runtime Provenance 2.0

Runtime Provenance 2.0 is generated from observed execution and memory activity.

### 14.1 Required entities

Retain/improve the useful current concepts:

- runtime session;
- starting/state identity;
- frame;
- event;
- executed PC;
- mapped function;
- memory access;
- observed direct edge;
- observed indirect target;
- basic-block mapping;
- live validation;
- runtime placement reference;
- watch;
- conflict;
- prediction/hypothesis only if still needed by policy.

### 14.2 Execution-to-placement linkage

Every executed PC attempts to reference the `region_instance` owning that address at that exact sequence/frame.

A bare live address is insufficient where overlays reuse RAM.

### 14.3 Memory provenance

For every read/write event retain both:

- data address;
- code region/function containing the reader/writer PC.

Field/resource evidence can be linked without rewriting its original lane.

### 14.4 Call evidence

Observed call edges remain session-scoped. Static and runtime call relationships are complementary and distinct.

---

## 15. Total Resolver R3 Normalized Query Product

### 15.1 Clean current source set

Subject to identity/review gates:

```text
static-db-r3                    accepted-current
resource-chain-static           accepted-current
structure-field-static          accepted-current
overlay-atlas-2                 accepted-current after review
runtime-provenance-2            accepted-current after review
```

Historical dynamic products remain outside the current set.

### 15.2 Current live session

Do not insert a recording session into the accepted resolver DB.

Compose queries as:

```text
accepted resolver
+
current live-session adapter (live-unreviewed)
```

The response must say which claims are accepted and which are live-unreviewed.

### 15.3 Query forms

Retain existing forms:

```text
func_00043d1c
id:839
rom:0x43D1C
z64:0x43D1C
live:0x8016DE1C
ram:0x0016DE1C
field-offset:0x1F
```

Add context selectors:

```text
--session <id>
--frame <n>
--sequence <n>
--current
```

Add relationships:

```text
placements
executions
loads
resources
fields
callers
callees
transitions
witnesses
```

### 15.4 Live-PC resolution behavior

For:

```text
live:0x8020B150 --session S --frame F
```

R3 should attempt, in order:

1. find the contemporaneous region instance;
2. find that region's placement/source mapping;
3. map to z64 instruction/function if supported;
4. return function+offset;
5. distinguish queried vs previously observed vs observed-now execution;
6. return resource/loader ancestry;
7. return static callers/callees;
8. return field/resource context;
9. surface conflicts/unresolved alternatives;
10. refuse to guess if multiple mappings remain equally valid.

### 15.5 Programmatic API

At minimum:

```python
resolve_live_pc(pc, session_id=None, frame=None, sequence=None)
resolve_watch_event(event, session_context)
resolve_trace(events, session_context)
resolve_address(address, address_space, context=None)
```

Recommended higher-level object:

```text
Ob64ResearchAgent
  .pj64      -> repo-local Project64 client
  .resolver  -> TotalResolverClient
```

Raw emulator access and resolution stay separable so a resolver failure cannot destroy or block raw capture.

---

## 16. Evidence and Acceptance Model

### 16.1 Evidence lanes

At minimum:

- `static`;
- `placement`;
- `runtime`;
- `field`;
- `resource`;
- optional `annotation` for human semantic context.

### 16.2 Review states

Recommended distinction:

- `live-unreviewed`;
- `generated-unreviewed`;
- `review-pending`;
- `accepted-source`;
- `historical`;
- `rejected` when preserved by source policy.

### 16.3 Relationship disposition

Retain:

- `compatible`;
- `conflicting`;
- `unresolved`;
- `unsupported`.

### 16.4 Promotion path

```text
raw session
  -> deterministic derivation
  -> schema validation
  -> provenance validation
  -> source-identity validation
  -> product verifier
  -> independent review proportional to structural impact
  -> accepted-current registry update
```

No manual SQLite editing is an acceptance path.

---

## 17. Coverage and Meaning of "Complete"

R3 must never define completeness as "many savestates" or "many hours played."

### 17.1 Static -> dynamic

Classify relevant static executable/resource identities as:

```text
observed placed
observed executed
observed loaded but not executed
never observed
not expected to be independently loadable
unresolved static identity
```

### 17.2 Dynamic -> static

For every observed:

- region instance;
- executable page/region;
- executed PC;
- loader event;
- source resource;

report whether it resolves to an accepted static identity.

### 17.3 Loader coverage

Track:

- known loader paths watched;
- alternate paths discovered;
- complete source+destination observations;
- unresolved source;
- unresolved completion/destination;
- unexplained memory changes detected by safety net.

### 17.4 Transition coverage

Human labels can build a navigation graph such as:

```text
Title -> Main Menu
World Map -> Army
Army -> Equipment
Scenario -> Battle
Battle -> Results
```

This helps find gameplay gaps but is not proof of machine completeness.

### 17.5 Discovery rate

Report per session/time:

- new placements;
- new region identities;
- new loader chains;
- newly executed functions;
- new unresolved PCs.

A falling discovery rate is useful prioritization evidence, not proof of completion.

### 17.6 Acceptable completeness statement

A release may say something bounded like:

> All runtime placements encountered in the recorded Rev 0 coverage program resolve without unexplained live-address ambiguity, all observed loader events are accounted for or explicitly unresolved, and the accepted static inventory has a reported observed/unobserved classification.

Do not claim that no unseen secret/unreachable/untested state exists without independent proof.

---

## 18. Operational Modes

### 18.1 Manual Play Capture

Default.

- human controls the game;
- recorder is observation-only;
- labels are optional;
- transient machine states are automatic;
- no old savestate naming is trusted.

### 18.2 Focused Research Capture

For a particular function/field/resource:

- install targeted watches;
- record full event/register evidence;
- use the same raw schema;
- derive through the same pipeline.

### 18.3 Retrospective Old-Corpus Audit

Only after clean capture works:

- load/parse old states in a separately marked mode;
- treat names as imported-candidate annotations;
- compare machine placements against clean identities;
- never silently seed accepted clean coverage.

### 18.4 Automated Codex Exploration

Optional later mode:

- use repo-local Project64 client input/stick/frame-step;
- requires explicit authorization for gameplay control;
- record every intervention/input;
- use to hunt specific coverage gaps;
- automation does not raise evidence grade by itself.

### 18.5 Live Research Query

Codex can resolve newly drained watch events against accepted + current-session evidence immediately.

---

## 19. Canonical CLI

The final command naming can be adjusted to repo convention, but the conceptual surface should stay small.

### Environment/health

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver pj64 health
```

### Sessions

```text
python -m tools.total_resolver session start
python -m tools.total_resolver session status
python -m tools.total_resolver session label "Army - Equipment"
python -m tools.total_resolver session mark "Entering shop"
python -m tools.total_resolver session stop
python -m tools.total_resolver session verify <session-id>
```

### Derivation/build

```text
python -m tools.total_resolver build overlay
python -m tools.total_resolver build runtime
python -m tools.total_resolver build resolver
python -m tools.total_resolver build all
```

### Query

```text
python -m tools.total_resolver explain func_00043d1c
python -m tools.total_resolver explain live:0x8016DE1C --current
python -m tools.total_resolver explain live:0x8016DE1C --session <id> --frame <n>
```

### Coverage

```text
python -m tools.total_resolver coverage
python -m tools.total_resolver unresolved
python -m tools.total_resolver compare-old-atlas
```

### Verification

```text
python -m tools.total_resolver verify
```

Do not expose dozens of phase-specific commands once the product stabilizes.

---

## 20. Implementation Phases and Done-Gates

## Phase 0 — Freeze and Inventory Current Resolver Stack

Record exact identities for:

- current Unified Resolver;
- static DB;
- resource-chain atlas;
- structure/field atlas;
- old overlay atlas;
- old runtime provenance atlas;
- current Project64 client;
- bridge script/protocol;
- `ob64-core` version;
- decomp static source identity.

Done-gate:

- identities/hashes/versions recorded;
- existing verifiers run;
- no source product mutated;
- old dynamic atlases classified as historical/reference for clean R3.

---

## Phase 1 — Establish Repo-Local Tool Ownership and Protocol Parity

### Work

Create `tools/total_resolver/` and establish the canonical repo-local Project64 client.

If adopting the existing `Pj64Agent`, first prove parity for:

- health/status;
- RAM read/batch read;
- watches/event drain;
- pause/resume;
- frame/instruction step;
- state identity/load where used;
- framebuffer/hash/dump diagnostics;
- controller input (for later optional mode).

Add explicit bridge protocol/version checks.

Update repo docs/AGENTS only as required to reflect that **Total Resolver runtime acquisition is now an intentional decomp-owned tool**, while ordinary unrelated emulator experiments may still live elsewhere.

### Done-gate

- repo-local client performs the required bridge operations;
- no duplicate hidden protocol semantics;
- bridge incompatibility fails loudly;
- ordinary exact decomp build remains independent of Project64.

---

## Phase 2 — Freeze Raw Capture and Normalized Schemas

Define and test:

- raw capture schema;
- event ordering;
- region lifetime semantics;
- configuration identity;
- address spaces;
- source/provenance contract;
- evidence/review states;
- live-unreviewed behavior;
- normalized adapter contract changes.

Done-gate:

- schemas versioned/closed;
- unknown fields/enums reject as intended;
- address-space separation tests pass;
- overlap/split/replace tests pass;
- label-only changes cannot alter machine configuration identity;
- static adapters either remain compatible or have explicit migrations.

---

## Phase 3 — Build Raw Project64 Capture Recorder

Implement:

- session start/stop;
- ROM/core/protocol verification;
- event drain loop;
- monotonic event sequencing;
- frame context;
- watch audit;
- raw persistence;
- annotations;
- recorder health;
- clean shutdown/recovery.

Do not implement full atlas inference yet.

Done-gate:

- several-minute manual session without corruption;
- deterministic raw replay ordering;
- documented crash/restart behavior;
- closed session independently verifies;
- observation mode performs no controller/RAM/ROM mutation.

---

## Phase 4 — One-Transition Lossless Placement Proof

Choose one reproducible dynamic-loading transition, preferably `World Map -> Army` if convenient.

Instrument only required loader paths and capture:

- loader entry/completion;
- registers/arguments;
- source/destination/length where derivable;
- every destination content identity;
- region lifetimes;
- any few-frame transient placements;
- final configuration;
- optional endpoint labels.

Generate a timeline such as:

```text
source state
  load X
  transient B
  load Y
  transient C
  load Z
destination state
```

Done-gate:

- every detected destination change in watched pools is explained or explicitly unresolved;
- transient region(s), if naturally present, are preserved;
- raw bytes/hashes reproduce;
- static crosswalk resolves known functions without fake linear mapping;
- independent derivation regenerates the timeline from raw capture only;
- label edits do not change machine timeline.

If this fails, stop scaling and fix acquisition.

---

## Phase 5 — Generalize Loader Coverage and Unknown-Change Detection

Expand across known loader/DMA/decompress paths.

Add:

- alternate paths;
- async completion;
- partial/overlapping writes;
- cache/ready evidence where useful;
- page/range change safety net;
- execution-in-unknown-region detection;
- bounded unresolved captures.

Done-gate after varied manual play:

- no known event overflow;
- every detected executable-region change is loader-explained or unresolved;
- multi-load transitions survive capture;
- data resources are not misclassified as code;
- overhead measured and acceptable.

---

## Phase 6 — Build Overlay Atlas 2.0 Generator

Derive:

- region instances;
- deduplicated placements;
- function placements;
- slab relationships;
- source/destination mapping;
- witness sessions/contexts;
- destination reuse;
- conflicts/ambiguities;
- transient-only placements;
- static->placement coverage.

Done-gate:

- deterministic fresh builds;
- label-only changes do not alter placement identity;
- source/destination mutation tests fail correctly;
- old overlay atlas is not an input;
- old-atlas comparison is post-build only.

---

## Phase 7 — Build Runtime Provenance 2.0 Generator

Derive:

- sessions/events/frames;
- executed PCs/functions;
- memory accesses;
- observed call/indirect edges;
- region-instance linkage;
- live validation;
- runtime conflicts/unresolved PCs;
- runtime->static coverage.

Done-gate:

- each accepted runtime PC maps through the contemporaneous placement;
- reused live addresses tested across different contexts;
- removing raw execution removes execution claims;
- residency never generates execution evidence;
- static and observed call edges remain distinguishable.

---

## Phase 8 — Build Total Resolver R3

Create:

- source registry;
- adapters;
- normalized SQLite DB;
- query interface;
- verifier;
- coverage engine;
- contextual live resolution.

Done-gate:

- representative old static queries remain equivalent or explicitly improve;
- context-free reused live addresses fail closed;
- session/frame context selects only supported placement;
- function -> placements -> sessions works;
- live PC -> ROM -> function works;
- field/resource lanes remain separate;
- stale source identities hard-fail;
- build is deterministic.

---

## Phase 9 — Add Live Project64 Enrichment

Add the current-session adapter so a watch hit can produce:

```text
raw watch event
  -> current region
  -> current placement
  -> z64/function
  -> callers/callees
  -> resource ancestry
  -> field context
```

Add resolved crash/evidence bundles with raw and derived views.

Done-gate:

- live records clearly marked `live-unreviewed`;
- resolver disable/failure cannot lose raw P64 evidence;
- live queries cannot mutate accepted DBs;
- enrichment reproducible offline from saved event/session context.

---

## Phase 10 — Clean Manual Gameplay Coverage Program

Begin from the selected clean Rev 0 starting point and play normally.

Suggested coverage categories:

- boot/title/intro;
- new game/file/options;
- world map;
- army management;
- unit detail;
- class change;
- equipment/items;
- shops;
- deployment;
- scenario maps;
- scenario menus/submenus;
- battle setup;
- active battle variants;
- results/victory/defeat;
- training;
- cutscene/event modes;
- special/secret flows;
- reachable ending paths.

The recorder captures all machine transitions. Human labels are only added where useful.

Done-gate is a coverage report, not merely finishing the game:

- unique placements;
- transient-only placements;
- loader events;
- executed functions/PCs;
- static inventory observed/unobserved;
- dynamic resolved/unresolved;
- destination reuse/ambiguity;
- discovery rate;
- explicit high-value gaps.

---

## Phase 11 — Gap Hunting and Optional Codex Automation

Use coverage, not intuition, to target:

- static executable resource never observed;
- repeatedly unresolved live PC;
- resource chain with no witness;
- menu/context with unexplained changes;
- training/rare mode with unique loaders;
- old-atlas placement not reproduced by clean R3.

Only after manual coverage matures, optionally authorize Codex input automation for specific gaps.

Done-gate:

Every gap becomes:

- resolved;
- bounded unreachable/not-yet-reachable candidate;
- explicitly unresolved with next evidence;
- intentionally out of scope.

No vague `probably complete` bucket.

---

## Phase 12 — Independent Review, Promotion, and Release

Review:

- raw capture integrity;
- protocol assumptions;
- loader interpretation;
- region lifetime logic;
- placement derivation;
- runtime execution linkage;
- live-address ambiguity handling;
- source identities;
- coverage claims;
- current registry semantics.

Done-gate:

- fresh build/verifier passes;
- review findings closed or documented as limits;
- old resolver preserved;
- current R3 registry contains only reviewed sources;
- release docs state exact boundaries/non-claims;
- no prohibited ROM/savestate/bulk runtime artifacts committed.

---

## 21. Test Strategy

### 21.1 Unit tests

- event ordering;
- address normalization;
- ROM/live/physical conversions;
- region overlap/split/replace;
- configuration signature stability;
- label independence;
- loader decoder fixtures;
- evidence rules;
- ambiguity rejection;
- registry/source identity.

### 21.2 Synthetic event-stream tests

Force cases such as:

- two loads in one frame;
- load A replaced by B one event later;
- partial overlap;
- asynchronous completion;
- unknown destination;
- event loss marker;
- same live address hosting different ROM sources;
- execution before mapping known;
- label correction.

These test the algorithm, not OB64 facts.

### 21.3 Real transition golden fixture

Phase 4 becomes the bounded real-world regression fixture. Preserve only copyright-safe hashes/event excerpts/metadata/minimal bytes permitted by repo policy.

### 21.4 Deterministic rebuild

Two derivations from identical raw inputs must produce equivalent logical outputs and stable declared hashes.

### 21.5 Mutation tests

Mutate:

- source range;
- destination range;
- content hash;
- event order;
- placement source;
- region lifetime;
- registry identity;
- semantic label.

Machine-evidence mutations must fail/change product identity; label-only mutations must not change machine placement identity.

### 21.6 Ambiguity tests

Prove at least two contexts where one live address maps differently. No-context query must refuse to choose; contextual query may choose only with unique evidence.

### 21.7 Performance tests

Measure:

- event drain throughput;
- queue high-water mark;
- recorder CPU overhead;
- interpreter slowdown;
- page-hash safety-net cost;
- DB write rate;
- disk growth per hour;
- query latency.

Performance work must never silently discard evidence.

---

## 22. Failure Handling

### Bridge disconnect

- record interruption sequence/time;
- mark continuity broken;
- do not pretend the gap was observed.

### Project64 wedge/crash

Use existing relaunch/crash diagnostic procedures and record the interruption.

### Wrong CPU core/watch failure

If coverage requires interpreter watches and the core is wrong, fail loudly before claiming coverage.

### Event overflow/loss

If the bridge exposes dropped events, record them and invalidate the affected coverage claim. If it does not, determine whether queue/event-sequence telemetry must be added before Phase 5 acceptance.

### Incomplete loader completion

Retain unresolved loader evidence. Do not hash partially written memory and promote it as a verified placement.

### Session closure

On clean stop:

- flush DB;
- close open lifetimes with `session-end` reason;
- write manifest;
- hash stable artifacts;
- run session verifier;
- mark session closed.

---

## 23. Risk Register

### R1. Transient loads are faster than polling

Mitigation: event-driven watches/loader capture; frame sampling only as context/safety net.

### R2. Unknown alternate loader path

Mitigation: page/range safety net and execution-in-unknown-region alerting.

### R3. Interpreter timing differs from normal recompiler play

Mitigation: treat timing as research-environment evidence; rely on event order and byte/resource identity rather than assuming wall-clock equivalence.

### R4. Human labels are wrong

Mitigation: annotations are supersedable and excluded from machine identity.

### R5. Old atlas biases clean discovery

Mitigation: old dynamic products excluded from clean source set until comparison stage.

### R6. Live address reuse maps to wrong ROM code

Mitigation: contemporaneous region-instance context; fail closed without it.

### R7. Data/code confusion

Mitigation: explicit executable/data/mixed/unknown class; execution evidence does not force entire-region classification.

### R8. Data volume grows quickly

Mitigation: structured events/hashes by default, bounded byte captures, content deduplication, ignored `build/total-resolver/` storage.

### R9. Static decomp changes after capture

Mitigation: every session/product records decomp source identity; rebuild or mark drift rather than silently remapping.

### R10. Savestate restores mask natural loads

Mitigation: clean boot/manual play is primary R3 lane; retrospective state work is separately classified.

### R11. Resolver becomes coupled to Project64 internals

Mitigation: stable repo-local client/protocol layer; raw capture and resolver remain separable.

### R12. "Complete" becomes untestable

Mitigation: explicit static->dynamic, dynamic->static, loader, unresolved, transition, and discovery metrics.

---

## 24. Product Verification Requirements

Final verifier must independently check at least:

1. schema versions and closed-schema behavior;
2. registry identity;
3. selected-source identities;
4. source DB hashes/logical roots;
5. no duplicate primary entity keys;
6. address-space validity;
7. region lifetime ordering;
8. legal overlap/split representation;
9. placement arithmetic/boundaries;
10. execution linkage to contemporaneous region;
11. no execution derived solely from residency;
12. live-address ambiguity rejection;
13. annotation independence from machine identity;
14. deterministic generation;
15. unresolved/conflict preservation;
16. raw-session provenance references;
17. no historical dynamic source accidentally selected current;
18. representative current-resolver query compatibility;
19. coverage report internal consistency;
20. read-only/immutability expectations during verification;
21. generated bulk is ignored and tracked source remains clean;
22. ordinary exact-ROM build remains unaffected when Project64 is absent.

---

## 25. User-Facing Examples

### Resolve a live watch hit

```text
python -m tools.total_resolver explain live:0x8020B150 --current
```

Conceptual output:

```text
live address       0x8020B150
session/frame      S42 / 19364
region instance    region:184
placement          overlay-placement:73
z64                0x0022F580 + offset
function           func_0022F580
placement evidence observed this session
execution evidence observed at event 9112
resource ancestry  resource -> loader -> allocation
static callers     ...
static callees     ...
field/resource     ...
conflicts          none / listed
review state       live-unreviewed
```

### Resolve a function

```text
python -m tools.total_resolver explain func_0022F580 --relationship placements
```

### Coverage

```text
python -m tools.total_resolver coverage
```

Conceptual output:

```text
Static executable functions/resources
  observed placed ........ X
  observed executed ...... Y
  never observed ......... Z

Runtime
  unique placements ...... X
  transient-only ......... Y
  resolved to static ..... Z
  unresolved ............. N

Loader events
  total .................. X
  source+dest resolved ... Y
  unresolved ............. Z

Current session
  new placements ......... X
  new executed functions . Y
  new unresolved ......... Z
```

---

## 26. Old Atlas Comparison Policy

Only after clean Atlas 2.0 is independently generated, compare it with old Overlay/Runtime atlases.

Classify old claims as:

- corroborated;
- compatible but not yet re-observed;
- machine mapping differs;
- human label differs/suspect;
- source identity unavailable;
- cannot compare.

Do not delete or rewrite old products automatically.

---

## 27. Review and Change Control

Independent review is required for structural changes to:

- address-space rules;
- region lifetime semantics;
- loader source/destination derivation;
- placement identity;
- function crosswalk;
- current source registry;
- coverage/completeness claims;
- acceptance-grade policy;
- bridge protocol semantics that affect evidence.

Routine raw play sessions do not require bespoke review merely to be recorded. Promotion into an accepted generated product carries the review burden.

---

## 28. First Implementation Slice

The first worker should not be asked to build every final feature in one pass.

The first implementation assignment should be approximately:

> Create `tools/total_resolver/` in `OB64-Decomp`, establish a repo-local Project64 client with parity to the bridge operations required for observation, build the raw session recorder, and prove one dynamic game transition losslessly. Record a monotonically ordered event stream, frame context, recorder health, installed watches, loader entry/completion evidence, destination byte identities, region lifetimes, and optional human endpoint labels. Select one reproducible transition that performs dynamic loading. Demonstrate that every detected destination change in the observed runtime pools is either explained by a captured load or explicitly unresolved, including any placement that lasts only one/few frames. Regenerate the transition timeline deterministically from the closed raw session database. Keep all generated bulk under ignored `build/total-resolver/`. Do not build the final accepted resolver or import old Atlas 1.x dynamic claims in this first slice.

The decisive question is:

> **Can the repo-local acquisition layer observe the real overlay/data lifecycle without losing the short-lived states that savestate-oriented Atlas 1.x could miss?**

If yes, scale through the later phases. If no, fix the observation primitive before investing in broad coverage.

---

## 29. Final Product Acceptance Criteria

Total Resolver R3 is release-ready only when:

- its maintained implementation lives in `OB64-Decomp`;
- current R2/current aides are preserved and reproducibly identifiable;
- clean acquisition does not depend on old savestate names;
- transient one/few-frame region instances are representable and actually captured in a real transition when present;
- loader events and region lifetimes have explicit provenance;
- Overlay Atlas 2.0 is deterministic and independent of old dynamic atlas inputs;
- Runtime Provenance 2.0 distinguishes placement from execution;
- live PC resolution is contemporaneous-placement aware;
- reused live addresses fail closed without sufficient context;
- static/resource/field/placement/runtime evidence remain separate lanes;
- live-unreviewed events enrich Codex research without mutating accepted DBs;
- human labels can be corrected without changing machine evidence;
- coverage is reported both static->dynamic and dynamic->static;
- unresolved runtime observations remain visible with next-evidence paths;
- complete product generation/verifier passes from declared inputs;
- generated runtime bulk stays outside tracked source by default;
- ordinary decomp build/verify remains usable without Project64;
- independent review accepts capture and mapping contracts;
- release documentation states bounded completeness rather than omniscience.

---

## 30. Recommended Execution Order

1. freeze current resolver/aides and protocol identities;
2. create the tracked `tools/total_resolver/` product skeleton;
3. establish repo-local Project64 client parity;
4. freeze raw-session and normalized contracts;
5. build observation-only recorder;
6. prove one transition losslessly;
7. generalize loaders and unknown-change detection;
8. generate Overlay Atlas 2.0;
9. generate Runtime Provenance 2.0;
10. build Total Resolver R3 and fail-closed contextual live resolution;
11. connect current P64 events to live-unreviewed enrichment;
12. begin clean manual gameplay acquisition;
13. use coverage reports to hunt real gaps;
14. optionally authorize Codex gameplay automation for targeted gaps;
15. independently review, freeze, and promote the R3 current source set.

The guiding principle is:

> **Capture raw machine truth first, derive placement and execution evidence second, attach human meaning separately, and promote only through reproducible verification.**

The resulting product should make the decomp repository itself the authoritative place to ask both:

> **What is this ROM code?**

and

> **What is executing or being loaded in Project64 right now, and where did it come from?**
