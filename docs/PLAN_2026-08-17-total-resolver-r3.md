# Total Resolver R3 Product Plan

Status: **proposed complete product plan — implementation not yet authorized by this document alone**  
Created: 2026-08-17  
Target: **Ogre Battle 64: Person of Lordly Caliber, US Rev 0 only**  
Primary objective: build a clean, live-connected runtime/static resolver whose dynamic evidence is acquired from Project64 as the game is actually played, including transient overlays and data loads that may exist for only a few frames.

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
- a persistent `Pj64Agent` bridge client that can read/write RAM, install read/write/execute watches, drain structured events, frame-step, instruction-step, load/save states, drive controller input, capture framebuffer state, and dump RDRAM.

The missing product is not another debugger or another static database. The missing product is a **clean acquisition and integration layer** that turns live Project64 activity into lossless, provenance-backed runtime evidence and then feeds that evidence into a new accepted resolver generation.

Total Resolver R3 therefore has three major responsibilities:

1. **Capture reality without losing transient states.** A code or data placement that exists for one or two frames must be recordable even if no savestate was ever made while it was resident.
2. **Separate machine truth from human interpretation.** Project64 can prove that bytes were loaded, placed, executed, read, or written. Joe can label visible states such as `World Map`, `Army - Equipment`, or `Battle Results`. Those labels must never become the identity or proof of the underlying machine configuration.
3. **Resolve both live and offline evidence through one query surface.** A live PC, ROM offset, function, field, resource, loader event, runtime placement, or watch hit should be traceable through the accepted static and dynamic evidence without collapsing placement into execution or candidate evidence into fact.

The recommended architecture is **not** to mutate the current accepted resolver in place. Freeze the current resolver and all five existing source products as historical/current reference points. Build R3 beside them, prove it independently, then promote it atomically only after its verifiers and review gates pass.

The first implementation milestone is deliberately small: **capture one real transition end-to-end with no lost transient loads, regenerate the result deterministically from a raw session database, and resolve the captured live PCs back to accepted static identities.** Once that is trustworthy, full-game acquisition is mainly a coverage exercise.

---

## 2. Product Definition

### 2.1 What Total Resolver R3 is

Total Resolver R3 is the combination of:

- a **raw live-session capture store** fed by Project64;
- a **placement/lifetime derivation pipeline** that becomes Overlay Atlas 2.0;
- an **execution/memory-provenance derivation pipeline** that becomes Runtime Provenance 2.0;
- the existing accepted static aides, either reused directly or rebuilt from the same authoritative inputs;
- a new **R3 resolver registry and normalized query database**;
- a **live resolver adapter** that can enrich current Project64 events without granting those unreviewed events accepted status;
- deterministic coverage, provenance, unresolved, conflict, and review reports.

### 2.2 What Total Resolver R3 is not

It is not:

- a replacement for the byte-exact decomp;
- a replacement for Project64;
- a replacement for the existing Project64 bridge;
- a requirement to adopt Ghidra as canonical;
- a claim that every possible game state can be mathematically proven visited;
- a semantic gameplay database where a menu name or visible action automatically proves code meaning;
- a reason to copy runtime databases, savestates, or large generated artifacts into this exact-build repository;
- a destructive migration of Atlas 1.x or the current Unified Resolver.

---

## 3. Repository and Ownership Boundaries

This plan lives in `OB64-Decomp` because the resolver depends on the decomp's structural truth and because future decomp work needs a stable specification for runtime mapping. The implementation must still preserve the existing workspace split.

### 3.1 Parent research workspace (`OgreBattlel64`)

The parent workspace remains the owner of:

- Project64 runtime control;
- `Pj64Agent` and bridge-side experiment tooling;
- savestates and runtime-state corpora;
- live traces and event streams;
- raw RDRAM captures;
- live-session SQLite databases;
- generated atlases and research-aide products under `wiki/`;
- experimental recorder code until it becomes stable tooling;
- runtime screenshots, framebuffer hashes, crash bundles, and intervention logs.

Recommended maintained runtime tooling location:

```text
tools/project64/total_resolver/
```

Recommended generated product roots:

```text
wiki/sol-total-resolver-r3-<date>/
wiki/overlay-atlas-r4-<date>/          # if a separately versioned atlas product is retained
wiki/runtime-provenance-r4-<date>/     # if a separately versioned runtime product is retained
```

The exact generated root name may follow the parent workspace's current research-aide naming convention at implementation time. The important rule is that the dynamic databases stay out of the decomp repository.

### 3.2 `OB64-Decomp`

This repository remains the owner of:

- accepted Rev 0 static structure;
- function/data ownership;
- overlay descriptors and linker placement that have graduated into structural truth;
- source/build/toolchain inputs;
- byte-exact function ranges;
- curated subsystem documentation;
- any small machine-readable static export specifically needed to make cross-repository resolution reproducible;
- this product plan.

R3 must consume decomp structure; it must not make the decomp depend at build time on a live Project64 installation or on generated runtime databases.

### 3.3 LordlyCaliber/editor

LordlyCaliber may consume verified exports later, but no editor runtime dependency is required for R3. The resolver is a research/decomp capability first.

---

## 4. Existing Foundation and Source Lanes

The current Unified Resolver is already source-neutral and registry-driven. Its main accepted input families are represented by five adapters.

### 4.1 Static DB R3

Current adapter identity:

```text
static-db-r3
```

Current database role:

```text
db/ob64-static.sqlite
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

Current database role:

```text
db/resource-load-chains.sqlite
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

Current database role:

```text
db/structure-field-access.sqlite
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

Evidence lanes: `field` and bounded `static` ownership.

### 4.4 Offline Overlay Atlas R3

Current adapter identity:

```text
overlay-atlas-r3
```

Current database role:

```text
db/overlay-atlas.sqlite
```

Provides:

- logical function placement observations;
- source input/state identities;
- RAM/live function locations;
- validated/candidate slabs;
- placement ambiguities.

Evidence lane: `placement`.

Its current boundary is important: the corpus is finite, absence from that corpus is not evidence that code is unused, and a validated slab proves byte mapping rather than execution.

### 4.5 Runtime Provenance R3

Current adapter identity:

```text
runtime-provenance-r3
```

Current database role:

```text
db/runtime-provenance.sqlite
```

Provides:

- runtime sessions;
- state identities and state-load proofs;
- frames;
- events;
- watches;
- executed PCs;
- mapped functions;
- memory accesses;
- observed direct edges;
- observed indirect targets;
- basic-block mappings;
- runtime overlay placements;
- live validation;
- conflicts and predictions.

Evidence lane: `runtime`.

### 4.6 R3 migration policy

For the clean Total Resolver R3 build:

- **Static DB R3, Resource Chain Static, and Structure/Field Static** may remain current accepted static sources if their source identities still validate.
- **Offline Overlay Atlas R3 and Runtime Provenance R3 must not seed the new dynamic database.** Freeze them and use them only for later comparison/corroboration.
- New dynamic observations must originate from clean R3 sessions or from a separately classified retrospective audit run.
- The old dynamic products remain queryable as historical/reference evidence outside the new accepted-current source set until a deliberate migration review says otherwise.

This prevents untrusted old savestate naming or unknown corpus gaps from becoming invisible inherited assumptions.

---

## 5. Product Goals

### G1. Clean acquisition from actual gameplay

Start from a known Rev 0 ROM and a fresh R3 capture session. Joe may begin at a clean boot/new game or another explicitly identified starting point. Old savestate labels are not required.

### G2. Preserve transient loads

A code or data placement that exists for only one frame, a few frames, or a transition window must be represented as a lifetime/event record even if it never becomes a stable visible screen.

### G3. Capture source, destination, content, lifetime, and execution separately

For every observed load where evidence permits, retain:

- the loader/trigger;
- source ROM/resource identity;
- destination RAM range;
- content hash;
- first/last observed frame or event sequence;
- replacement/unload cause;
- functions/bytes mapped into the region;
- whether any mapped bytes were actually executed;
- whether any addresses were read/written;
- confidence and evidence basis.

### G4. Human labels are optional annotations

Joe should be able to mark:

```text
World Map
Army - Unit List
Army - Equipment
Entering Item Shop
Battle - Results
```

but machine evidence must remain valid if a label is wrong, changed, absent, or more specific later.

### G5. Live resolution

During a Project64 session, a watch hit or live PC should be resolvable immediately against:

- accepted static structure;
- accepted previous dynamic evidence;
- the current unreviewed live session;
- current frame/configuration context.

### G6. Fail closed on ambiguous reused live addresses

If `0x801Dxxxx` can contain different overlays in different contexts, the resolver must not silently choose one without a frame/session/current placement that disambiguates it.

### G7. Deterministic regeneration

Raw session evidence must be sufficient to regenerate every derived dynamic atlas row and every R3 resolver contribution deterministically.

### G8. Measurable coverage

R3 must answer both:

- **static -> dynamic:** what known code/resources have never been observed placed/executing?
- **dynamic -> static:** what observed placements/PCs/loads still cannot be resolved to static identities?

---

## 6. Non-Goals

R3 does not initially need to:

- fully automate gameplay;
- understand every menu name without human input;
- prove semantic behavior of every function;
- trace every instruction continuously;
- hash all 8 MiB of RDRAM every frame;
- replace existing semantic docs;
- import all old savestates;
- create a GUI before the capture core is proven;
- modify ROM/RAM during ordinary capture;
- infer function meaning from co-residency alone;
- treat a loader chain as proof of natural reachability until actually observed.

---

## 7. Governing Invariants

These are hard product rules.

### 7.1 Address-space separation

Never collapse:

1. z64 ROM offsets;
2. raw `.v64` byte positions;
3. nominal linear VRAM labels;
4. physical RDRAM offsets;
5. live KSEG addresses.

The early-boot `RAM = ROM + 0x8006FC00` shortcut is not valid for later overlays.

### 7.2 Placement is not execution

A byte-exact region found resident in RAM proves placement within the stated evidence limits. It does not prove that any instruction in that region executed.

### 7.3 Execution is session-scoped

Observed execution proves that a PC/function executed in the recorded session/context. It does not prove universal gameplay semantics or reachability in every state.

### 7.4 Human labels are not machine identity

`Army - Equipment` is annotation. The machine identity is the underlying placement/resource/execution configuration.

### 7.5 Whole-RAM hashes are diagnostic only

RNG, stacks, actors, timers, animation state, and heaps make whole-RAM identity unsuitable for deduplicating executable configurations.

### 7.6 Raw capture is append-only/immutable after closure

Once a session is closed and its manifest is written, derivation must not rewrite the raw event stream. Corrections happen in derived products or through explicit superseding annotations.

### 7.7 Live evidence cannot silently become accepted evidence

Current-session rows use a distinct state such as:

```text
live-unreviewed
```

Promotion to accepted dynamic evidence requires the R3 build/verifier/review path.

### 7.8 No hidden ambiguity repair

Conflicts, missing sources, unknown loader completion, overlapping placements, and unresolved mappings remain visible.

### 7.9 Observation-only by default

The normal recorder does not press buttons, alter RAM, patch ROM, force state transitions, or inject code. Any automated exploration mode is separate and explicitly authorized.

### 7.10 Decomp exactness remains independent

No R3 failure may make the byte-exact baseline unrebuildable. Runtime research is an input to understanding, not a prerequisite for producing the accepted retail ROM.

---

## 8. High-Level Architecture

```text
                                  +-----------------------+
                                  |   OB64-Decomp static  |
                                  | functions / calls /   |
                                  | overlay structure      |
                                  +-----------+-----------+
                                              |
                                              v
+------------------+               +-----------------------+               +------------------+
| Project64        |               |   Total Resolver R3   |               | Human annotations|
| ob64-core        |-------------->|                       |<--------------| state / transition|
|                  | raw events    | normalized query DB   |               | labels / notes    |
+--------+---------+               +-----------+-----------+               +------------------+
         |                                     ^
         | bridge                              |
         v                                     |
+------------------+                +----------+-----------+
| Pj64Agent        |                | derived dynamic      |
| persistent TCP   |                | products              |
+--------+---------+                | Overlay Atlas 2.0    |
         |                          | Runtime Prov 2.0     |
         v                          +----------+-----------+
+--------------------------+                   ^
| Raw Session Capture DB   |-------------------+
| events / loads / frames  | deterministic derivation
| region lifetimes / marks |
+--------------------------+
```

The key architectural choice is that **Project64 does not write the accepted atlas directly**. It writes raw observations. All accepted/derived data is reproducible from those observations.

---

## 9. Raw Session Capture Store

The raw session database is the foundation of R3. It must favor preservation over interpretation.

Recommended database name during capture:

```text
sessions/<session-id>/capture.sqlite
```

Recommended side artifacts:

```text
sessions/<session-id>/manifest.json
sessions/<session-id>/events.ndjson          # optional raw mirror
sessions/<session-id>/captures/              # bounded region/frame artifacts
sessions/<session-id>/session.log
```

### 9.1 `session`

Required fields should include at least:

- `session_id`;
- start/end UTC timestamps;
- recorder version/commit;
- Project64 fork version/commit when available;
- bridge version;
- CPU core;
- ROM identity (CRC1/CRC2, country, version, normalized hash if known);
- parent repo commit/dirty-state summary;
- decomp static source identity;
- resolver source identity if live resolution is enabled;
- capture mode;
- intervention policy;
- closure status;
- manifest/hash identity.

### 9.2 `event_sequence`

Every bridge-derived event must receive a recorder-local monotonically increasing sequence number. Do not rely only on frame number; multiple important events can occur in one frame.

Fields:

- `sequence_id`;
- Project64 frame count;
- host monotonic timestamp;
- bridge event type;
- raw JSON payload hash;
- raw payload;
- ingestion status.

### 9.3 `frame_sample`

A frame sample is context, not the master ordering primitive.

Fields may include:

- frame number;
- observed pause/run state;
- optional framebuffer/frame hash;
- current semantic marker;
- current configuration signature;
- recorder health counters.

### 9.4 `watch_definition`

Every watch installed by the recorder must be auditable:

- watch ID;
- kind: exec/read/write;
- address/range;
- size;
- label;
- reason;
- source of watch definition (static loader catalog, manual research request, safety detector);
- installed/removed sequence;
- expected event rate;
- whether interpreter mode was required/verified.

### 9.5 `loader_event`

Represents an observed loader/DMA/decompress/resource transition.

Fields should allow unknowns:

- loader event ID;
- entry and completion sequence/frame;
- loader live PC;
- resolved loader function if known;
- source ROM start/end if known;
- resource/container/catalog identity if known;
- compressed length;
- decoded length;
- destination physical/live range;
- codec if known;
- arguments/register snapshot references;
- completion method;
- confidence/evidence grade;
- unresolved reason.

Do not require all fields to create a row. A partial loader observation is preferable to losing the event.

### 9.6 `region_instance`

This is the central R3 temporal placement concept.

One row means: **these bytes occupied this destination range for this observed lifetime.**

Required/important fields:

- region instance ID;
- destination physical RDRAM start/end;
- live KSEG start/end;
- content size;
- content SHA-256 or equivalent strong identity;
- first observed sequence/frame;
- last observed sequence/frame;
- terminating/replacement event if known;
- source loader event;
- source ROM/resource candidate;
- classification: executable/data/mixed/unknown;
- confidence;
- exact byte-match status;
- capture artifact reference when bytes were preserved.

A later load into the same RAM range creates a **new region instance**. It does not mutate history.

### 9.7 `placement_observation`

Maps a static identity into a region instance.

Examples:

- whole ROM/resource range -> runtime region;
- function `func_XXXX` -> live KSEG range;
- validated slab -> destination range.

Store the mapping method:

- direct loader provenance;
- exact byte equality;
- relocation/slab delta;
- static descriptor mapping;
- candidate heuristic.

### 9.8 `execution_observation`

Represents actual observed execution:

- sequence/frame;
- live PC;
- physical PC;
- current region instance;
- mapped z64 instruction/function when resolvable;
- event/watch source;
- register snapshot reference;
- evidence grade;
- mapping confidence.

### 9.9 `memory_access`

For read/write evidence:

- sequence/frame;
- access kind;
- width;
- effective address;
- value before/after when available;
- writer/reader PC;
- current region instance for the PC;
- static function/instruction when resolvable;
- optional field/resource relationship.

### 9.10 `semantic_marker`

Human annotation only.

Fields:

- marker ID;
- sequence/frame;
- optional end sequence/frame;
- label;
- annotation type: stable-state, transition-start, transition-end, note, visible-action;
- author/source (`human`, `inferred`, `imported-candidate`);
- confidence in label;
- supersedes marker if corrected;
- free note.

Human labels never become placement keys.

### 9.11 `transition`

A transition should be first class because transient overlays/data often exist only between visible states.

Fields:

- transition ID;
- from marker/state;
- to marker/state;
- start/end sequence/frame;
- loader events occurring within it;
- region instances born/destroyed within it;
- optional human note.

### 9.12 `configuration`

A machine configuration is a deduplicated set of relevant loaded identities, not a snapshot of all RAM.

Recommended signature input:

```text
sorted(
  region class,
  destination start/end,
  strong content/source identity,
  loader/resource identity where known
)
```

Maintain separate signatures if useful:

- `code_configuration`;
- `resource_configuration`;
- `combined_configuration`.

### 9.13 `unresolved_observation`

Anything the recorder cannot safely classify goes here rather than disappearing:

- unknown changed executable page;
- loader hit with unresolved destination;
- destination bytes changed before completion could be sampled;
- reused live address with multiple possible static mappings;
- bridge event lacking enough context;
- source resource unresolved;
- apparent execution in an unknown region.

Every unresolved row should include the **smallest next evidence** likely to resolve it.

### 9.14 `recorder_health`

Track whether the capture itself is trustworthy:

- event queue depth/high-water mark;
- dropped-event count if bridge exposes one;
- drain cadence;
- longest drain stall;
- frame polling latency;
- current CPU core;
- bridge reconnects;
- watch installation failures;
- recorder exceptions;
- Project64 pause/wedge/relaunch events.

A session with known event loss must not silently promote to full coverage evidence.

---

## 10. Project64 Capture Design

### 10.1 Do not rewrite the bridge first

Start by wrapping the existing `Pj64Agent`. The current client already supports the essential operations:

- persistent socket connection;
- health/status/execution/exception;
- exact memory reads and batched reads;
- arbitrary memory writes for separately authorized tests;
- exec/read/write watches;
- event drain;
- pause/resume;
- frame stepping;
- instruction stepping;
- save/load state;
- controller input;
- frame capture/hash;
- RDRAM dumps and crash bundles.

Only modify `ob64-core` or the JavaScript bridge when the Phase 3 proof demonstrates a concrete missing primitive.

### 10.2 Recorder startup sequence

The capture process should:

1. connect to Project64;
2. verify bridge health;
3. verify exact ROM identity;
4. verify CPU core and require interpreter mode when watch coverage depends on it;
5. capture current frame/emu state;
6. clear stale recorder-owned watches/events only under a documented ownership rule;
7. install the selected loader/DMA/decompress watches;
8. record every installed watch definition;
9. begin the event drain loop before gameplay resumes;
10. create the initial machine configuration without assuming a human label.

### 10.3 Event loop

The recorder must drain events frequently enough that a transition can contain many events inside a single rendered frame without loss.

The primary timeline is:

```text
bridge event order -> recorder sequence -> frame context
```

not:

```text
one snapshot per rendered frame
```

Frame sampling is secondary context.

### 10.4 Loader instrumentation

Begin with loader, DMA, cache, decompression, and allocation functions already represented by the resource-chain/static work.

For each known loader path, define a small capture contract:

- entry watch location;
- registers/arguments to preserve;
- how source is represented;
- how destination is represented;
- how length is represented;
- completion indicator/return path;
- whether DMA completion is asynchronous;
- whether cache invalidation marks executable readiness;
- expected alternate callers/paths.

Do not build one giant hard-coded interpretation function. Use loader-specific decoders registered by function/resource identity.

### 10.5 Completion detection

Correct content hashing requires knowing when a load is complete. Supported methods may include:

- observed loader return;
- known DMA completion callback;
- decompressor return;
- cache maintenance event after write completion;
- destination stability across a bounded check;
- explicit resource-chain completion event.

Record the completion method and confidence. If completion cannot be established, retain a partial loader event and unresolved row.

### 10.6 Region lifetime tracking

When a completed load writes a destination range:

1. close/clip any prior region instance whose bytes are replaced;
2. hash/capture the newly loaded range;
3. create a new region instance;
4. attempt direct source/ROM/resource mapping;
5. attempt byte-equality/static function coverage mapping;
6. register the new machine configuration;
7. keep observing until replaced/unloaded/end-of-session.

Overlapping partial loads must be represented explicitly. Do not assume every load replaces an entire previous overlay.

### 10.7 Transient placement requirement

No minimum lifetime is allowed for machine acquisition.

The recorder must be able to represent:

```text
frame N:     stable overlay A
frame N+1:   transient overlay B
frame N+2:   transient data C / overlay D
frame N+3:   final overlay E
```

B, C, and D remain valid observations even if Joe never sees a distinct rendered menu for them.

### 10.8 Secondary unknown-change detector

Known loader hooks may miss alternate paths. Add a bounded safety net after the primary event-driven path works.

Candidate mechanisms, to be benchmarked rather than assumed:

- page hashes of known dynamic executable/load pools at each frame boundary;
- hashes after every loader/DMA completion;
- watch ranges on known destination pools;
- execution hits in pages whose current region identity is unknown;
- comparison of current page identity against the region tracker.

The detector should answer:

> Did RAM change in a way the loader instrumentation failed to explain?

It must not replace the event-driven model.

### 10.9 Data loads are first-class

Do not restrict R3 to executable overlays. Data tables, scripts, cutscene streams, resources, and runtime-relocated tables can be equally important.

Each region instance has a class:

```text
executable
data
mixed
unknown
```

Classification may improve after static matching or execution observation.

### 10.10 Execution observation

Avoid tracing every instruction by default. Use a layered strategy:

1. watches around research targets;
2. loader/entrypoint execution observations;
3. observed direct/indirect calls already exposed by focused harnesses;
4. targeted execute ranges when resolving a newly found placement;
5. short bounded traces when necessary.

The runtime atlas should represent what was actually observed, not pretend that residency equals execution coverage.

### 10.11 Rolling evidence buffer

Maintain a bounded in-memory ring buffer of recent events/frame context so a human marker can be attached after the visible transition is recognized.

Example default:

```text
10 seconds or 300 frames of recent event context
```

The raw session database remains the authoritative full history; the ring buffer exists only to make annotation convenient.

---

## 11. Human Label and Play Workflow

### 11.1 No mandatory prompt on every machine change

The recorder should remain silent during ordinary acquisition unless:

- Joe explicitly asks to label;
- an error threatens capture integrity;
- an optional discovery notification is enabled.

A few-frame transition may contain many machine configurations and should not create a barrage of prompts.

### 11.2 Minimal initial command surface

Recommended commands:

```text
python tools/project64/total_resolver/session.py start
python tools/project64/total_resolver/session.py status
python tools/project64/total_resolver/session.py label "World Map - Palatinus"
python tools/project64/total_resolver/session.py mark "Entering Army menu"
python tools/project64/total_resolver/session.py note "Opened equipment for Magnus"
python tools/project64/total_resolver/session.py stop
```

A later hotkey sidecar may map F8/F9 or another safe key to label/mark actions, but hotkeys are not required for the first proof.

### 11.3 Label correction

Never rewrite old annotations in place without history. Support superseding labels:

```text
marker 42: "Equipment"          superseded
marker 57: "Army - Equipment"  supersedes 42
```

### 11.4 Transition context

If Joe labels a stable state before and after a transition, R3 may derive a contextual description:

```text
World Map -> Army - Unit List
```

for the intervening transient observations without claiming that any transient region itself semantically means `Army`.

---

## 12. Derived Dynamic Product: Overlay Atlas 2.0

Overlay Atlas 2.0 is generated from raw session evidence. It should no longer be fundamentally savestate-oriented.

### 12.1 Primary entities

- source input/session;
- region instance;
- placement identity;
- static function placement;
- slab/contiguous mapping;
- configuration;
- transition context;
- ambiguity/conflict.

### 12.2 Placement identity

A canonical placement key should derive from machine facts such as:

- source static/ROM/resource range when known;
- destination physical/live range;
- content identity;
- length;
- relocation/slab relationship.

Human state names are not part of the key.

### 12.3 Witnesses

Multiple observations of the same placement become witnesses:

```text
placement P
  observed session 1, frames ...
  observed session 3, frames ...
  observed during labels "Army - Equipment" and "Army - Unit Detail"
```

The placement remains one technical identity with multiple contexts.

### 12.4 Confidence hierarchy

Recommended placement grades:

- **Verified placement**: source/destination relationship proven by direct loader provenance plus exact resulting bytes or equivalent direct proof;
- **Supported placement**: exact byte crosswalk and validated boundaries/slab evidence;
- **Candidate placement**: plausible but incomplete mapping;
- **Unresolved**: observed region without safe source/static identity.

Do not reuse `Verified` if the current evidence policy reserves it for a stricter definition without updating the shared evidence contract first.

### 12.5 Output reports

Overlay Atlas 2.0 should emit:

- placement inventory;
- region lifetime summary;
- transient-only placement report;
- placement-by-human-state context report;
- source->destination map;
- destination reuse/ambiguity report;
- never-seen static placement candidates;
- unresolved runtime regions;
- old-Atlas comparison report, generated only after the clean atlas is built.

---

## 13. Derived Dynamic Product: Runtime Provenance 2.0

Runtime Provenance 2.0 is generated from observed execution and memory activity.

### 13.1 Required entities

Retain and improve the useful current concepts:

- runtime session;
- state/starting identity;
- frame;
- event;
- executed PC;
- mapped function;
- memory access;
- observed direct edge;
- observed indirect target;
- basic block mapping;
- live validation;
- runtime overlay placement reference;
- watch;
- conflict;
- prediction/hypothesis if the current schema still needs it.

### 13.2 Execution-to-placement linkage

Every executed PC should attempt to reference the `region_instance` that owned that address at that exact sequence/frame.

This is crucial. A bare live address is insufficient when the same KSEG range can host different overlays over time.

### 13.3 Memory provenance

For a read/write event, record both:

- the data address being accessed;
- the code region/function containing the reader/writer PC.

Where static field/resource evidence exists, link it without rewriting the original evidence lane.

### 13.4 Call evidence

Observed direct/indirect call edges should remain explicitly session-scoped. Static caller/callee relationships and observed runtime edges are complementary, not interchangeable.

---

## 14. Total Resolver R3 Normalized Query Product

### 14.1 Source registry

The first clean R3 registry should contain, subject to identity verification:

```text
static-db-r3                    accepted-current
resource-chain-static           accepted-current
structure-field-static          accepted-current
overlay-atlas-2                 accepted-current after review
runtime-provenance-2            accepted-current after review
```

Old overlay/runtime products remain outside the current source set as historical comparison archives.

### 14.2 Current live session as an overlay source

Do **not** insert a currently recording session into the accepted SQLite resolver database.

Instead, the query layer may compose:

```text
accepted resolver DB
+
current live-session adapter (read-only, live-unreviewed)
```

Responses must label the source distinction.

### 14.3 Core query forms

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

Add bounded contextual forms such as:

```text
--session <id>
--frame <n>
--sequence <n>
--current
--relationship placements
--relationship executions
--relationship loads
--relationship resources
--relationship fields
--relationship callers
--relationship callees
```

### 14.4 Required live-PC resolution behavior

For a query such as:

```text
live:0x8020B150 --session S --frame F
```

R3 should attempt:

1. identify the region instance owning that address at F;
2. identify the placement/source mapping for that region;
3. map to z64 instruction/function if supported;
4. return function+offset;
5. return whether execution was merely queried, previously observed, or observed at the current event;
6. return resource/loader ancestry when available;
7. return static callers/callees;
8. return field/resource access evidence where relevant;
9. show conflicts/unresolved alternatives;
10. fail closed if multiple live mappings remain equally valid.

### 14.5 Event enrichment

Provide a programmatic API for Project64 tools:

```python
resolve_live_pc(pc, session_id=None, frame=None, sequence=None)
resolve_watch_event(event, session_context)
resolve_trace(events, session_context)
resolve_address(address, address_space, context=None)
```

Recommended higher-level wrapper:

```text
Ob64ResearchAgent
  .pj64       -> Pj64Agent
  .resolver   -> TotalResolverClient
```

The wrapper must not make `Pj64Agent` depend on resolver internals. Keep the raw emulator client reusable.

---

## 15. Evidence and Acceptance Model

R3 should preserve the current lane separation and make live status explicit.

### 15.1 Evidence lanes

At minimum:

- `static`;
- `placement`;
- `runtime`;
- `field`;
- `resource`;
- optional `annotation` for human semantic labels if those enter normalized query output.

### 15.2 Review states

Recommended distinction:

- `live-unreviewed`;
- `generated-unreviewed`;
- `review-pending`;
- `accepted-source`;
- `historical`;
- `rejected` where the product contract requires preserving a rejected record.

### 15.3 Dispositions

Retain:

- `compatible`;
- `conflicting`;
- `unresolved`;
- `unsupported`.

### 15.4 Promotion rule

A live observation becomes accepted only through:

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

## 16. Coverage and the Meaning of "Complete"

R3 must never define completeness as "we made lots of savestates" or "we played for N hours."

### 16.1 Static -> dynamic coverage

For each known/candidate executable resource, function ownership range, overlay descriptor, or load-chain endpoint that is meaningful to runtime placement, classify:

```text
observed placed
observed executed
observed loaded but not executed
never observed
not expected to be independently loadable
unresolved static identity
```

### 16.2 Dynamic -> static coverage

For every observed:

- region instance;
- executable page;
- executed PC;
- loader event;
- resource source;

report whether it resolves to an accepted static identity.

### 16.3 Loader coverage

Track:

- known loader paths watched;
- alternate loader paths discovered;
- loader events with complete source+destination proof;
- loader events with unresolved source;
- loader events with unresolved completion/destination.

### 16.4 Transition coverage

Human labels can produce a useful navigation map:

```text
Title -> Main Menu
World Map -> Army
Army -> Equipment
Scenario -> Battle
Battle -> Results
...
```

This is a gameplay-coverage aid, not proof of machine completeness.

### 16.5 Discovery rate

Report new unique technical discoveries by session/time:

```text
new placements
new region identities
new loader chains
new executed functions
new unresolved PCs
```

A declining discovery rate helps prioritize exploration but is not itself proof of completion.

### 16.6 Completion claim

The strongest acceptable release wording should be bounded, for example:

> All executable/runtime placements encountered in the recorded Rev 0 coverage program resolve without unexplained live-address ambiguity, all observed loader events are accounted for or explicitly unresolved, and the accepted static inventory has a reported observed/unobserved classification.

Do not claim that no unreachable/secret/untested state exists unless independently proven.

---

## 17. Operational Modes

### 17.1 Manual Play Capture

Default R3 acquisition mode.

- Joe controls the game.
- recorder is observation-only;
- labels are optional;
- all transient machine states are acquired automatically;
- no old savestate naming is trusted.

### 17.2 Focused Research Capture

Used when investigating one field/function/resource.

- install targeted watches;
- record full event/register evidence;
- still write into the raw session schema;
- derive the same products as ordinary play.

### 17.3 Retrospective Old-Corpus Audit

Only after the clean system works.

- load old states or parse old captures in a separately marked mode;
- classify old human names as imported-candidate labels;
- compare machine placements against clean R3 identities;
- never allow this mode to silently seed accepted clean coverage.

### 17.4 Automated Codex Exploration

Optional later mode.

- Codex may use `Pj64Agent.input()`/stick/frame-step to navigate reproducible paths;
- requires explicit authorization because it controls gameplay;
- must record every intervention and input sequence;
- useful for hunting remaining static->dynamic gaps after manual coverage is mature;
- does not change evidence grades merely because the run was automated.

### 17.5 Live Research Query Mode

Codex can resolve a newly drained watch event immediately against accepted+current-session evidence without waiting for a formal atlas rebuild.

---

## 18. Recommended File/Module Layout

### 18.1 Parent workspace maintained tools

```text
tools/project64/total_resolver/
  __init__.py
  session.py                 # user-facing capture/session CLI
  recorder.py                # Pj64CaptureRecorder
  bridge_events.py           # raw event normalization only
  watch_manager.py
  loader_catalog.py
  loaders/
    <loader-specific decoders>.py
  region_tracker.py
  configuration.py
  annotations.py
  live_resolver.py
  health.py
  schemas/
    capture_schema.sql
  tests/
```

If current parent conventions prefer `scripts/` for product generators, keep capture-time tooling under `tools/project64/` and generation under a product root or `scripts/`.

### 18.2 Generated R3 product root

Suggested shape:

```text
wiki/sol-total-resolver-r3-<date>/
  README.md
  registry/
    sources.v2.json
  schema/
    README.md
    normalized.schema.json
    capture.schema.sql
  adapters/
    static_db_v1.py
    resource_chain_v1.py
    structure_field_v1.py
    overlay_atlas_v2.py
    runtime_atlas_v2.py
  scripts/
    build_capture_product.py
    build_overlay_atlas.py
    build_runtime_atlas.py
    build_resolver.py
    query_resolver.py
    verify_product.py
    coverage.py
  db/
    overlay-atlas-2.sqlite
    runtime-provenance-2.sqlite
    resolver-r3.sqlite
  reports/
    coverage.md
    unresolved.md
    conflicts.md
    transient-placements.md
    source-identity.md
    old-atlas-comparison.md
  exports/
  manifests/
  evidence/
  tests/
```

Do not copy raw full-session databases into the accepted product unless the product contract specifically needs bounded source artifacts. Prefer hashed source references plus minimal preserved evidence extracts when repository size/provenance policy requires it.

### 18.3 `OB64-Decomp`

Initial R3 changes here should be minimal:

```text
docs/PLAN_2026-08-17-total-resolver-r3.md
```

Later accepted static exporter/configuration changes should be added only when the cross-repo contract actually requires them.

---

## 19. Implementation Phases and Done-Gates

## Phase 0 — Freeze and Inventory the Current Resolver Stack

### Work

Record exact current identities for:

- current Unified Resolver product;
- `static-db-r3`;
- `resource-chain-static`;
- `structure-field-static`;
- `overlay-atlas-r3`;
- `runtime-provenance-r3`;
- current `Pj64Agent`;
- current bridge script;
- current `ob64-core` fork;
- decomp static source identity.

Preserve old products read-only.

### Done-gate

- exact paths/versions/hashes recorded;
- all existing verifiers run and results preserved;
- no source product mutated;
- old dynamic atlases clearly classified as historical/reference for the clean R3 acquisition lane.

---

## Phase 1 — Freeze R3 Contracts and Schemas

### Work

Define:

- raw capture schema;
- region lifetime semantics;
- configuration identity;
- address spaces;
- event ordering rules;
- source identity/provenance contract;
- evidence grades/review states;
- live-unreviewed query behavior;
- normalized R3 adapter contract changes, if any.

Create migration fixtures from the current adapter schemas so static-source compatibility is tested rather than assumed.

### Done-gate

- schema is closed and versioned;
- unknown fields/enum values fail as intended;
- test fixtures prove address-space separation;
- region replacement/overlap semantics have executable tests;
- human label changes cannot alter machine configuration identity;
- current static adapters either pass unchanged or have a documented R3 adapter migration.

---

## Phase 2 — Build the Raw Project64 Capture Recorder

### Work

Implement `Pj64CaptureRecorder` around existing `Pj64Agent`.

Required first functions:

- session start/stop;
- health/ROM/core verification;
- bridge event drain loop;
- monotonic event sequencing;
- frame context sampling;
- watch registration/audit;
- raw event persistence;
- semantic marker CLI;
- recorder health counters;
- clean shutdown/recovery.

Do **not** implement full atlas inference yet.

### Done-gate

- recorder runs through a several-minute manual play session without data corruption;
- event ordering is deterministic on replay;
- recorder crash/restart behavior is documented;
- raw session can be reopened read-only and independently verified;
- no game input or RAM/ROM writes occur in observation mode.

---

## Phase 3 — One-Transition Lossless Placement Proof

This is the first major product proof.

### Selection

Choose one reproducible transition known or strongly expected to exercise dynamic loading. `World Map -> Army` is a good candidate if conveniently reachable; otherwise choose the simplest transition that demonstrably replaces runtime code/data.

### Work

Instrument only the loader paths required for this transition.

Capture:

- entry/exit/completion events;
- relevant register snapshots;
- source/destination/length when derivable;
- every distinct destination content identity;
- region lifetimes;
- transient placements lasting only a few frames;
- final stable configuration;
- endpoint human labels.

Generate an offline timeline such as:

```text
frame/sequence A: source state
  load X
  transient region B
  load Y
  transient region C
  load Z
frame/sequence B: destination state
```

### Done-gate

- every observed destination change in the watched pools is explained by a recorded load or explicitly listed unresolved;
- at least one transient region can be represented if the chosen transition contains one;
- raw bytes/hashes reproduce on replay;
- static crosswalk resolves known functions without fake linear mapping;
- an independent verifier regenerates the transition result from raw capture only;
- human labels can be changed without changing the machine timeline.

If this phase fails, do not proceed to full-game capture. Fix the observation model first.

---

## Phase 4 — Generalize Loader Coverage and Add the Unknown-Change Safety Net

### Work

Expand loader-specific decoding across known paths from the resource-chain/static aide.

Add:

- alternate loader/DMA paths;
- asynchronous completion handling;
- partial/overlapping region replacement;
- cache/ready-state evidence if useful;
- page/range change detector for unexplained loads;
- execution-in-unknown-region alerting;
- bounded capture artifacts for unresolved changes.

### Done-gate

Run a varied manual session including several menus/modes.

Require:

- no known event-buffer overflow;
- every detected executable-region change is either loader-explained or explicitly unresolved;
- transient multi-load transitions survive capture;
- resource/data loads can be recorded without misclassifying everything as code;
- capture overhead is measured and acceptable for research use.

---

## Phase 5 — Build Overlay Atlas 2.0 Generator

### Work

Derive from clean raw sessions:

- region instances;
- deduplicated placement identities;
- function placements;
- slab relationships;
- source/destination mappings;
- witness sessions/contexts;
- destination reuse;
- ambiguities/conflicts;
- transient-only placements;
- static->placement coverage.

### Done-gate

- fresh rebuilds are byte/logically deterministic;
- changing only a human label does not change placement identity/root;
- source/destination mutation tests trigger verifier failure;
- old Overlay Atlas R3 is not used as an input;
- a post-build comparison may show agreement/disagreement with Atlas R3, but the clean output remains independent.

---

## Phase 6 — Build Runtime Provenance 2.0 Generator

### Work

Derive:

- sessions;
- frames/events;
- executed PCs;
- observed function execution;
- memory accesses;
- observed direct/indirect edges;
- region-instance linkage;
- live validations;
- runtime conflicts/unresolved PCs;
- runtime->static coverage.

### Done-gate

- every accepted runtime PC maps through the placement owning that address at the recorded time;
- reused live addresses are tested across at least two different placement contexts;
- execution claims disappear if their raw observation is removed;
- residency alone never generates an execution row;
- static call edges remain distinguishable from observed runtime edges.

---

## Phase 7 — Build Total Resolver R3

### Work

Create the new registry, adapters, normalized DB, query interface, and verifier.

Required source set after review:

- static DB;
- resource chain;
- structure/field;
- Overlay Atlas 2.0;
- Runtime Provenance 2.0.

Add contextual live-address resolution.

### Done-gate

- all existing representative static queries still resolve with equivalent or explicitly improved results;
- live address reuse fails closed without context;
- session/frame context resolves the correct placement when available;
- function -> placements -> sessions and live PC -> ROM -> function queries work;
- field/resource relationships remain in their own evidence lanes;
- stale/mismatched source identities cause hard failure;
- full product rebuild is deterministic.

---

## Phase 8 — Add Live Project64 Enrichment

### Work

Add a read-only current-session adapter/client so Codex can do:

```text
watch hit
  -> resolve current PC
  -> identify current region/placement
  -> map to z64/function
  -> show static callers/callees
  -> show resource/field context
  -> preserve raw event
```

Add resolved crash/evidence bundles containing both raw and derived views.

### Done-gate

- current-session records are visibly `live-unreviewed`;
- disabling the resolver does not affect raw P64 capture;
- a resolver failure cannot lose the raw watch event;
- current live queries cannot mutate accepted resolver DBs;
- watch-event enrichment is reproducible offline from the saved event+session context.

---

## Phase 9 — Clean Manual Playthrough Coverage Program

### Work

Begin from the chosen clean Rev 0 starting point and play normally while the recorder runs.

Joe labels only meaningful states/transitions as useful. The recorder captures all machine transitions regardless of labels.

Suggested coverage categories, not a rigid checklist:

- boot/title/intro;
- new game/file/select/options;
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
- ending paths reachable in the coverage program.

### Done-gate

Not "finished the game." Instead require an R3 coverage report showing:

- total unique placement identities;
- total transient-only placements;
- total observed loader events;
- total executed functions/PCs;
- static inventory observed/unobserved classification;
- dynamic observations resolved/unresolved classification;
- destination reuse/ambiguity status;
- discovery rate over recent sessions;
- remaining explicit high-value gaps.

---

## Phase 10 — Gap Hunting and Optional Codex Automation

### Work

Use coverage reports to target what is actually missing.

Examples:

- static executable resource never seen loaded;
- live PC repeatedly unresolved;
- resource chain with no dynamic witness;
- menu family with unexplained destination changes;
- training/rare state with unique loaders;
- old Atlas R3 placement not reproduced by clean R3.

Only after manual coverage is mature, optionally authorize Codex to use controller input or known saves to pursue specific gaps.

### Done-gate

Every remaining gap is one of:

- resolved;
- bounded unreachable/not-yet-reachable candidate;
- explicitly unresolved with smallest-next-evidence;
- intentionally out of scope.

No vague "probably complete" bucket.

---

## Phase 11 — Independent Review, Promotion, and Release

### Work

Perform independent review of:

- raw capture integrity;
- loader interpretation;
- region lifetime logic;
- placement derivation;
- runtime execution linkage;
- address ambiguity handling;
- source identity checks;
- coverage claims;
- current-only registry semantics.

Freeze a release manifest and tag/version the product.

### Done-gate

- fresh rebuild/verifier passes;
- independent review findings closed or explicitly accepted as limits;
- old resolver remains preserved;
- current R3 registry contains only reviewed current sources;
- release README states exact boundaries and non-claims;
- release artifacts contain no ROM/savestate material that violates repository policy.

---

## 20. Test Strategy

Testing must cover both database correctness and the harder observation problem.

### 20.1 Unit tests

- event ordering;
- address normalization;
- ROM/live/physical conversions;
- region overlap/split/replace;
- configuration signature stability;
- human-label independence;
- loader argument decoder fixtures;
- evidence-grade rules;
- ambiguity rejection;
- source registry validation.

### 20.2 Synthetic event-stream tests

Use fabricated bridge events to force cases that may be rare naturally:

- two loads in one frame;
- load A replaced by B one event later;
- partial overlap;
- asynchronous completion;
- unknown destination;
- event loss marker;
- same live address hosting two different ROM sources;
- execution before mapping is known;
- label correction.

The synthetic suite tests the recorder/derivation algorithm, not OB64 facts.

### 20.3 Real transition golden fixture

The Phase 3 transition becomes a permanent bounded fixture. Preserve only what policy permits: hashes, event extracts, metadata, and minimal derived artifacts rather than uncontrolled bulk runtime data.

### 20.4 Deterministic rebuild tests

Two fresh derivations from the same raw session must produce equivalent logical output and declared stable hashes.

### 20.5 Mutation tests

Deliberately alter:

- source range;
- destination range;
- content hash;
- event order;
- placement source;
- region lifetime;
- source registry hash;
- semantic label.

Required result:

- machine-evidence mutations must fail or change the corresponding product root;
- semantic-label-only mutations must not change machine placement identity.

### 20.6 Ambiguity tests

Create/locate at least two contexts where the same live address maps to different static regions. A context-free query must refuse to pick. A session/frame-context query must choose only when evidence uniquely supports it.

### 20.7 Performance tests

Measure:

- event drain throughput;
- queue high-water mark;
- recorder CPU overhead;
- Project64 interpreter slowdown;
- page-hash safety-net cost;
- database write rate;
- size growth per hour/session;
- resolver latency for live queries.

Performance optimization must not discard evidence silently.

---

## 21. Reliability and Failure Handling

### 21.1 Bridge disconnect

- record disconnect sequence/time;
- mark capture continuity broken;
- reconnect only under explicit recorder logic;
- do not pretend the gap was observed.

### 21.2 Project64 wedge/crash

Use existing relaunch/crash-bundle procedures. Session manifest must record the interruption.

### 21.3 Watch failure or wrong CPU core

If required watches need interpreter mode and the emulator is not in interpreter mode, fail loudly before claiming coverage.

### 21.4 Event overflow/loss

If the bridge can expose dropped events, record and fail the affected coverage lane. If it cannot, Phase 2/4 should determine whether an event sequence/queue metric needs to be added to the bridge.

### 21.5 Incomplete loader completion

Retain an unresolved load row. Never hash partially written memory and call it a verified placement without documenting that state.

### 21.6 Session closure

On normal stop:

- flush DB;
- close open region lifetimes with `session-end` reason rather than pretending unload;
- write manifest;
- hash declared stable artifacts;
- run quick verifier;
- mark session closed.

---

## 22. Risk Register

### R1. Transient loads occur faster than polling

**Mitigation:** event-driven loader/watch capture; frame polling only as context/safety net.

### R2. Alternate loader path is unknown

**Mitigation:** changed-page safety net; execution in unknown region alert; expand loader catalog from observed evidence.

### R3. Interpreter mode changes timing

**Mitigation:** treat timing as research-environment observation; use exact event/frame ordering rather than assuming retail wall-clock timing; selectively corroborate important placement facts through byte/resource identity.

### R4. Human labels are wrong

**Mitigation:** labels are annotations, supersedable, and excluded from machine identity.

### R5. Old Atlas results bias clean discovery

**Mitigation:** old overlay/runtime atlases excluded from clean dynamic source set until post-build comparison.

### R6. Live address reuse causes wrong ROM mapping

**Mitigation:** region-instance + session/frame context; fail closed without unique context.

### R7. Data and code are confused

**Mitigation:** region class is explicit and may remain unknown; execution promotes evidence that bytes are executable but does not force entire region classification.

### R8. Large data volume

**Mitigation:** store structured events/hashes by default; preserve bounded byte captures where needed; deduplicate large captured content by hash; keep raw bulk outside Git.

### R9. Static decomp changes after atlas capture

**Mitigation:** every session/product records decomp/static source identity; rebuild adapters or mark drift rather than silently remapping.

### R10. Savestate restores mask natural loader behavior

**Mitigation:** clean manual play/cold-load sessions are the primary R3 acquisition lane; retrospective state loads are separately classified.

### R11. Recorder becomes an invasive emulator dependency

**Mitigation:** keep `Pj64Agent` raw and reusable; add a sidecar recorder/wrapper; modify the emulator only for proven missing primitives.

### R12. "Complete" becomes an untestable claim

**Mitigation:** publish explicit static->dynamic, dynamic->static, loader, unresolved, and discovery-rate metrics; use bounded release wording.

---

## 23. Product Verification Requirements

The final R3 verifier must independently check at least:

1. schema version and closed-schema behavior;
2. registry identity;
3. complete selected-source identity set;
4. source DB hashes/logical roots;
5. no duplicate primary entity keys;
6. address-space validity;
7. region lifetime ordering;
8. no impossible negative/overlapping lifetime representation unless explicitly modeled;
9. placement mapping arithmetic and boundary checks;
10. execution observation linkage to the correct contemporaneous region;
11. no accepted execution generated solely from residency;
12. live-address ambiguity rejection;
13. human annotation independence from machine identity;
14. deterministic generation;
15. unresolved/conflict preservation;
16. raw-session provenance references;
17. no historical dynamic source accidentally selected as current;
18. representative current-resolver query compatibility;
19. bounded coverage report consistency;
20. database read-only/immutability expectations during verification.

---

## 24. User-Facing Query and Status Examples

### Resolve a live watch hit

```text
total-resolver explain live:0x8020B150 --current
```

Expected conceptual output:

```text
live address       0x8020B150
session/frame      S42 / 19364
region instance    region:184
placement          overlay-placement:73
z64                0x0022F580 + offset
function           func_0022F580
placement evidence observed this session
execution evidence observed at event 9112
resource ancestry  resource -> loader -> allocation (when known)
static callers     ...
static callees     ...
field/resource     ...
conflicts          none / listed
review state       live-unreviewed
```

### Resolve a function

```text
total-resolver explain func_0022F580 --relationship placements
```

Should show accepted historical/current placements plus clearly separated current-session witnesses.

### Show coverage

```text
total-resolver coverage
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

## 25. Old Atlas Comparison Policy

After clean Atlas 2.0 is independently generated, produce a comparison report against the old Overlay Atlas/Runtime Atlas.

Classify each comparable old claim:

- corroborated by clean R3;
- compatible but not yet re-observed;
- machine mapping differs;
- human label differs/suspect;
- old source identity unavailable;
- cannot compare.

Do **not** automatically delete or rewrite old products. The comparison is historical quality analysis and may identify useful remaining coverage targets.

---

## 26. Review and Change Control

Structural changes to any of these require independent review:

- address-space rules;
- region lifetime semantics;
- loader source/destination derivation;
- placement identity;
- function crosswalk;
- current-source registry;
- coverage/completeness claims;
- acceptance-grade policy.

Routine new play sessions do not require bespoke independent review merely to exist as raw evidence. Their promotion into an accepted generated atlas is covered by the generator/verifier/review process.

---

## 27. First Implementation Slice

The first worker should **not** be told to build the complete system in one pass.

The first implementation assignment should be approximately:

> Build the R3 raw session recorder and prove one dynamic game transition losslessly. Wrap the existing `Pj64Agent`; do not modify `ob64-core` or the bridge unless a concrete missing primitive blocks the proof. Record a monotonically ordered raw event stream, frame context, recorder health, installed watches, loader entry/completion evidence, destination byte identities, region lifetimes, and optional human endpoint labels. Select one reproducible transition that performs dynamic loading. Demonstrate that every detected destination change in the observed runtime pools is either explained by a captured load or explicitly unresolved, including any placement that lasts only one/few frames. Regenerate the transition timeline deterministically from the closed raw session database. Do not build the final accepted resolver or import old Atlas 1.x dynamic claims in this phase.

That slice should produce enough evidence to answer the decisive question:

> **Can this acquisition layer observe the real overlay/data lifecycle without losing the short-lived states that savestate-based Atlas 1.x could miss?**

If yes, proceed through the phases above. If no, fix the runtime observation primitive before investing in the full database product.

---

## 28. Final Product Acceptance Criteria

Total Resolver R3 is ready for accepted release only when all of the following are true:

- current R2/current aides are preserved and reproducibly identifiable;
- clean dynamic acquisition does not depend on old savestate names;
- transient one/few-frame region instances are representable and proven captured in at least one real transition when naturally present;
- loader events and region lifetimes have explicit provenance;
- Overlay Atlas 2.0 is deterministic and independent of old dynamic atlas inputs;
- Runtime Provenance 2.0 distinguishes placement from execution;
- live PC resolution is contemporaneous-placement aware;
- reused live addresses fail closed without sufficient context;
- accepted static, resource, field, placement, and runtime evidence remain separate lanes;
- live-unreviewed events can enrich Codex research without mutating accepted DBs;
- human labels can be corrected without changing machine evidence identities;
- coverage is reported in both static->dynamic and dynamic->static directions;
- every unresolved runtime observation remains visible with a next-evidence path;
- the complete product rebuild/verifier passes from declared inputs;
- independent review has accepted the capture and mapping contracts;
- release documentation states bounded completeness rather than claiming omniscience.

---

## 29. Recommended Execution Order

The recommended order is therefore:

1. freeze current resolver/aides;
2. define R3 raw-session and normalized contracts;
3. build the observation-only Project64 recorder;
4. prove one transition losslessly;
5. generalize loader coverage and unknown-change detection;
6. generate Overlay Atlas 2.0;
7. generate Runtime Provenance 2.0;
8. build Total Resolver R3 and its fail-closed contextual live resolver;
9. connect current P64 events to live-unreviewed resolver enrichment;
10. begin clean manual gameplay acquisition;
11. use coverage reports to hunt only real gaps;
12. optionally authorize Codex gameplay automation for targeted remaining gaps;
13. independently review, freeze, and promote the R3 current source set.

The guiding principle throughout is:

> **Capture raw machine truth first, derive placement and execution evidence second, attach human meaning separately, and promote only through reproducible verification.**

That architecture preserves the project's strongest existing evidence discipline while finally making Project64, the dynamic atlases, the static decomp, and the Unified Resolver operate as one coherent research system.
