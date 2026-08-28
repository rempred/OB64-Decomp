# Total Resolver R3

Status: **Schema 5, factorized DMA knowledge, and protocol 0.17 are complete.**

Total Resolver is a research tool for the exact-ROM decompilation project.
It stores facts from accepted play sessions in one persistent knowledge database.
It keeps each type of evidence separate.
The evidence types include static facts, runtime placement, exact execution, field hypotheses, and resource ancestry.

Generated sessions, products, and bundles stay in ignored `build/total-resolver/` directories.
The historical plan is `docs/PLAN_2026-08-17-total-resolver-r3.md`.
The current status is `docs/total-resolver/implementation-status.md`.
All agents must also obey `tools/total_resolver/AGENTS.md`.

## Terms

A knowledge database stores facts from all accepted sessions.
A staging database stores one session before integration.
A fact is an exact machine observation.

A witness links a fact to a session, frame, or bridge sequence.
A frontier is a compact set of facts that Project64 already knows.
A bridge sequence gives the machine order of emitted events.
A bridge epoch identifies one bridge script instance.

## Agent roles

A query agent has read-only access.
The normal read-only commands are:

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

A query agent must not use these commands or functions:

- `session start`
- `session stop`
- `session label`
- `session mark`
- `session note`
- `session name`
- `gui`
- Knowledge initialization
- Knowledge ingestion
- Knowledge import
- Knowledge selection
- Knowledge migration
- Knowledge rebuild
- Legacy product builders
- Live evidence bundles
- Other functions that write generated state

Only an assigned database build agent can use those functions.
A general decompilation task does not give this permission.
Joe must approve each capture run before it starts.
Never use computer control to start Project64.

## Bridge contract

The repository client requires bridge protocol `0.17.0` and frontier format 6.
The client stops if a version or a capability does not agree.

The bridge supplies these functions:

- One emulator sequence for watch, PI DMA, execution, and controller events.
- One bridge epoch that changes after each script restart.
- One ordered drain queue.
- Explicit ranges for lost sequence numbers.
- Destination bytes from the time of each ROM DMA completion.
- Instruction and edge facts with a physical address, an exact opcode, and a generation.
- Each change in the effective Player 1 input that the game receives.
- One binary frontier that native Project64 loads directly.
- Stable fact numbers for instructions, edges, calls, and DMA facts.
- One activity bitmap for each fact class at session stop.
- An optional fixed PC and edge ring for a marker context window.
- One direct native execution observer for the known-fact path.
- Ordered batches with a maximum of 256 new execution facts.
- Native opcode gates for focused watches.
- One native copy of the lower 4 MiB of RDRAM.
- A pre-ROM arm state that installs all hooks before the first interpreter instruction.
- Optional focused watches for registers, stack words, and pointer bytes.

The frontier stores exact facts for these classes:

- Opcodes
- Edge endpoints
- Callsites, delay slots, and targets
- Conservative destination-specific DMA placements
- Static-data resources
- Data destinations

Project64 can allocate 4 MiB or 8 MiB of RDRAM.
Total Resolver uses only the lower 4 MiB.
All execution, DMA, snapshot, and database paths ignore the upper 4 MiB.

Recorder times, frame numbers, and page generations give context only.
They do not replace the bridge sequence.
An order value or an index fingerprint does not prove temporary destination bytes.

## Database workflow

### Initial setup

The `knowledge init` command creates and selects one knowledge database.
Use the normalized US Rev 0 ROM file.
The initialization step copies the accepted static functions and records all source identities.

```text
python -m tools.total_resolver knowledge init --rom C:\path\to\baserom.z64
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
```

Only a database build agent can do this setup.

### GUI workflow

Start the GUI with this command:

```text
python -m tools.total_resolver gui --port 64656
```

The **Launch Project64** button starts the configured Total Resolver build.
The configuration key is `project64.activeNativeRuntime.binaryPath` in `config/total-resolver/sources.json`.

Before launch, the GUI resolves the configured Project64 repository.
Then, the GUI checks the complete executable and the deployed bridge script.
It compares both files with their stored SHA-256 values.
The GUI also checks the script port and the selected GUI port.

The GUI rejects these conditions:

- A required file does not exist.
- A required file is outside the configured repository.
- A required file has changed.
- The script port and the GUI port are different.

The canonical bridge source uses port `64640`.
The authenticated local deployment uses port `64656`.
The configured executable is:

```text
C:\Users\Joe\Projects\project64\Bin\Win32\Release_totalresolver_64656\Project64-TR-CallAware.exe
```

The launch button does not load a ROM.
The launch button does not start a capture.

Use this procedure for a normal capture:

1. Start Project64.
2. Select **Check Bridge**.
3. Select **Start Capture**.
4. Play the applicable game content.
5. Select **Stop Capture**.
6. Enter a clear session name and optional notes.
7. Select **Save Name and Integrate**.

The stop action closes and checks the isolated staging database.
The session name and notes give human context only.
They do not change the capture identity.
The integration action adds all valid facts in one database transaction.

The GUI writes each operation and each error to the displayed diagnostic log.
After a failure, the GUI also adds a short part of the worker log.
Give that log to the maintainer when you report a failure.

The GUI does not load a ROM.
It does not inject controller input.
It does not write to game memory.

### Focused Capture

Focused Capture adds state evidence to the normal coverage stream.
It uses the same staging database and the same knowledge database.

Focused Capture watches exact retained placements for these owners:

- The Stage builder
- The environment loaders
- The Director parser
- The HUFF functions
- The actor pose functions
- The sprite matrix builder

A native opcode gate rejects unrelated PCs before JavaScript starts.
Project64 checks the exact ROM entry signature before it saves state.
Project64 saves each call from an owner with a low call rate.
For pose and matrix owners, Project64 saves a maximum of one call in each frame.

Press **Add Note** when an important visual event occurs.
The note uses the current bridge frame as its anchor.
It selects 60 frames before the note and 30 frames after the note.
At 30 FPS, the window is approximately three seconds.
A delay of one second does not lose the earlier part of the event.

Focused Capture saves owner state without separate visual-event buttons.
The pointer snapshots have fixed size.
Project64 saves a return snapshot immediately before `jr ra` executes its delay slot.
Floating-point register values give numeric context.
They do not preserve exact NaN payload bits.
Each focused row starts with the `live-unreviewed` state.

### Command-line workflow

These commands give the same basic workflow:

```text
python -m tools.total_resolver session start --defer-ingest --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session stop
python -m tools.total_resolver session name SESSION_ID "army management and unit detail"
python -m tools.total_resolver knowledge ingest SESSION_ID
python -m tools.total_resolver knowledge status
```

Use `--defer-ingest` when a person must approve the closed session.
This option lets the person add a name before ingestion.
The GUI always uses this option.
Without this option, the command-line stop adds the valid delta automatically.

If ingestion fails, the raw session stays closed and available for another attempt.

```text
python -m tools.total_resolver knowledge ingest SESSION_ID
```

### Capture before ROM load

First, end emulation.
Make sure that Project64 reports no ROM and no allocated N64 RDRAM.
Then, arm the recorder before you open the ROM.

```text
python -m tools.total_resolver session start --before-rom --defer-ingest --port 64656
python -m tools.total_resolver session status
# Open the exact US Rev 0 ROM in Project64.
python -m tools.total_resolver session stop
```

The worker first enters the `armed` state.
When the ROM starts, the bridge checks the ROM CRC and the interpreter core.
Then, the bridge installs all observation hooks.
The bridge requests the 4 MiB snapshot before `ExecuteInterpret()` starts.
The worker also checks the exact normalized ROM identity.

These conditions stop the session:

- The ROM identity is wrong.
- The bridge restarts.
- The queue contains old data.
- RDRAM already exists before the arm action.
- A protocol value does not agree.

The recorder never opens the ROM.

### Session start and stop

`session start` exports the selected frontier to one compact binary file.
Native Project64 checks and installs that file in one operation.
Then, the recorder saves one exact 4 MiB memory census.
The recorder completes the census before it enables normal capture work.

Normal capture writes only to the staging SQLite database.
It does not write a second NDJSON event stream.
The stop action does not calculate a hash for the complete stage.
It does not make a second complete timeline.

The stop action writes a small session-context manifest.
Then, it checks the SQLite payloads and the machine-order contract.
Use a full replay only for repair or research.

### Capture hot path

The hot path does not query SQLite.
The client writes the frontier next to the knowledge database.
One bridge command checks and installs the complete frontier.
The bridge does not use the old JavaScript frontier loader.

A known instruction uses these native operations:

- One exact instruction lookup
- One cached exact-edge lookup
- Activity-bit updates
- A predecessor update

The known path does not take the script-system lock.
Native Project64 sends new execution facts in ordered batches.
It sends a batch before a different event stream gets a bridge sequence.

The recorder drains the queue at 30 Hz when the queue has no events.
It changes to 100 Hz when events arrive.
It drains again without delay while a backlog exists.
Each drain also gets the frame, pause state, execution state, and PC sample.

The recorder still reads ten 4 KiB safety ranges at the current interval.
A lower read rate can miss a short placement without a native dirty-page signal.

### Migration and repair

Migration and repair commands write new products.
They do not overwrite accepted historical products.

```text
python -m tools.total_resolver knowledge migrate-schema5 --output build/total-resolver/knowledge/total-resolver-v5-factorized-dma.sqlite
python -m tools.total_resolver knowledge migrate-frontier --output build/total-resolver/knowledge/total-resolver-frontier-repaired.sqlite
python -m tools.total_resolver knowledge import --sessions-root build/total-resolver/sessions
python -m tools.total_resolver knowledge rebuild --output build/total-resolver/knowledge/rebuilt.sqlite
python -m tools.total_resolver knowledge benchmark
```

The rebuild command replays each successful ledger entry into a new database.
It compares all canonical rows with exact equality.
It also compares the stable ledger identity.

The comparison excludes these rebuild values:

- Output paths and times
- Legacy diagnostic references
- The historical frontier-format label
- The regenerated delta-summary JSON

These values are rebuild metadata, not machine facts.
The benchmark uses a fake emulator with the production bridge script.
It never starts or controls Project64.

Ledger replay accepts protocols `0.8.0` through `0.17.0` as historical input.
Protocol `0.7.x` sessions stay available as raw historical captures.
Persistent knowledge does not accept them because they do not have the required order and payload contract.
The live bridge requires an exact protocol match.

`migrate-schema5` replays the declared ledger next to its source database.
Then, it checks the new database.
It proves exact representation of every old DMA row.

Each old DMA row must have one of these representations:

- The same conservative exact placement
- An exact static-data resource and an exact destination span

The migration compares all retained facts, candidates, context, and materialized results.
It excludes the candidate work log because schema 5 removes unused static-data lifetime work.
The command selects the new database only when you add `--select`.

`migrate-frontier` makes a separate SQLite backup.
It changes only the native frontier structures and their revision token.
It checks the new copy before an optional selection.
It does not change canonical facts or raw sessions.

The frozen R2 resolver is a historical reference.
If its SQLite file does not exist, `doctor` reports `SKIP`.
This condition does not stop the schema-5 workflow.
The R2 resolver never supplies dynamic facts to schema 5.

## Query interface

The `explain`, `search`, `coverage`, and `unresolved` commands use one read-only `ResolverContext`.
The dynamic source is the database in `build/total-resolver/knowledge/selected.json`.
The context opens the frozen static, resource, and field sources as separate evidence types.

All SQLite query connections use read-only mode and `PRAGMA query_only=ON`.
The context uses immutable mode for the applicable frozen sources.

Each result contains this source and freshness information:

- The selected database identity
- The ledger frontier
- The session count
- The frozen-source identities
- A freshness statement

A caller must give `--legacy-resolver PATH` to query a generated historical Resolver.
The command stops if the supplied database has the wrong schema type.

`knowledge status` identifies the current selected database.
`session status` identifies the database and frontier at the start of the last capture.
Thus, `session status` can show an older database after a migration.

### Function queries

Use a function query before you search session files.

```text
python -m tools.total_resolver explain func_00029170
python -m tools.total_resolver explain func_00029170 --relationship callers --include calls
python -m tools.total_resolver explain func_00029170 --relationship callees --include calls
```

You do not need a session ID.
The `callGraph` result shows callers and callees in separate evidence types.

`callGraph.static` contains frozen direct-call candidates.
It can include code paths that no accepted session executed.
`callGraph.runtime` contains exact observed call relationships.

Each runtime call has these exact parts:

- The captured MIPS call instruction
- Its executed delay slot
- Its actual transfer target

The schema-5 migration reconstructed some protocol-0.13 calls.
It did this only when consecutive exact edge witnesses proved the same three parts.
Runtime details include session, frame, and bridge-sequence witnesses.

`unresolvedCallsiteCount` counts callsites from the function without an exact pair or a unique target.
Use `--relationship` to select one direction.
Use `--include calls --limit N --cursor N` to get more rows.
Use a session filter only when you need session context.

### Search commands

These examples show the main search types:

```text
python -m tools.total_resolver search --function 0022b1
python -m tools.total_resolver search --rom 0x0022B6D0
python -m tools.total_resolver search --live 0x801E8400
python -m tools.total_resolver search --physical 0x001E8400 --opcode 0x24070002
python -m tools.total_resolver search --bytes 24070002
python -m tools.total_resolver search --session-keyword "Hugo people"
python -m tools.total_resolver search --session SESSION_ID --frame-start 5886 --frame-end 5886 --sequence-start 7271 --sequence-end 7271
python -m tools.total_resolver search --edge-from 0x001E83FC --edge-to 0x001E8400
python -m tools.total_resolver search --unresolved-kind exact-execution-placement-or-generation-unresolved
python -m tools.total_resolver search --marker-text persuasion
python -m tools.total_resolver search --session SESSION_ID --controller --buttons 0x80000000
python -m tools.total_resolver search --focused-profile cutscene-studio-v1 --focused-target director-parser
python -m tools.total_resolver explain func_00284288 --include focused
```

`--session-keyword` searches names and notes without a case distinction.
All words in the query must occur.
The result gives a small session catalog and its session IDs.

Use a returned session ID with `--session`.
This search can show facts, controller context, markers, and focused state for that session.
Session results also show the semantic name and notes.
`--marker-text` searches markers that a person made inside a capture.

Commands give counts and a small row sample by default.
Use `--include SECTION` to get a detailed evidence type.
Use `--limit` and `--cursor` for pages of results.

An unresolved execution result includes these items:

- The exact physical address and opcode fact
- Byte-confirmed global candidates
- Contemporaneous candidates
- The reason for each candidate
- Contradictions or absent evidence
- Adjacent mapped edges
- The additional evidence that can resolve the fact

### Retained context and candidate states

Schema 5 retains these schema-3 records:

- The session catalog and ingestion summaries
- Instruction and edge frame witnesses
- Instruction and edge bridge-sequence witnesses
- Region lifetime intervals
- PC samples
- Semantic markers
- Typed unresolved fields
- The selected-source registry
- Candidate mapping evidence

The ingest step adds only address ranges that overlap the new evidence to the candidate work queue.
It does this after a new placement, lifetime interval, generation witness, or mapped edge.

The resolver keeps these candidate states separate:

- Exact machine fact
- Byte-confirmed global candidate
- Contemporaneous candidate
- Unique live mapping
- Ambiguous mapping or mapping with conflicts

Exact opcode equality creates a useful global candidate.
It does not create a resolved mapping without contemporaneous evidence.

Schema 5 also retains schema-4 focused data.
This data includes session rows, entry state, return state, and exact pointer bytes.

Old novelty filters removed some known execution events before transport.
A schema-5 replay can recover emitted events and saved samples only.
It cannot recreate old suppressed events.
Each applicable session reports this limitation.

## Optional runtime checks

Use these commands to check frozen inputs or an active bridge:

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver doctor --connect
python -m tools.total_resolver pj64 health
python -m tools.total_resolver pj64 status
```

## Capture commands

These commands write capture or database state.
Only a database build agent can use them.
Joe must approve the capture before the agent starts it.

```text
python -m tools.total_resolver session start --defer-ingest --port 64656
python -m tools.total_resolver session status
python -m tools.total_resolver session label "army management"
python -m tools.total_resolver session mark "opened unit detail"
python -m tools.total_resolver session stop
python -m tools.total_resolver session name SESSION_ID "army management and unit detail"
python -m tools.total_resolver knowledge ingest SESSION_ID
python -m tools.total_resolver session verify SESSION_ID
python -m tools.total_resolver session dedupe SESSION_ID
```

Labels, markers, and notes are optional context.
The recorder removes only the watches that it owns.

The observation-only client does not have these functions:

- Controller input injection
- RAM writes
- Pause or resume
- Instruction steps
- State load or save
- ROM control
- A global watch clear
- A memory dump

With protocol 0.17, a focused label, marker, or note also requests an execution-context window.
Ordinary Capture disables the context ring.
Focused Capture uses a compact ring with a power-of-two size.
It sends only a requested before-and-after window.

The database marks an incomplete window if the capture stops too early.
The marker selects 60 frames before and 30 frames after its frame.
The exact-PC ring has a separate limit of 4,096 records on each side.
Neither context source changes canonical bridge order.

## Data growth and exact duplicate removal

The raw staging database keeps every event that the bridge sends.
Capture schema 4 stores each large exact byte value once.
Event rows refer to that stored value.

Some storage columns have `SHA` in their historical names.
These columns give storage or diagnostic data only.
The software reuses an existing byte value only after an exact BLOB comparison.

The knowledge database stores these cross-session facts:

- Direct executable keys
- Exact edges
- Exact callsite, delay-slot, and target relationships
- DMA facts
- Small context witnesses

Each dynamic row keeps the `live-unreviewed` state.
Dynamic rows do not change accepted ownership, boundaries, or names.

### Execution facts

Native Project64 checks both the persistent frontier and current-session facts.
It does this before it calls JavaScript.
One instruction identity contains a physical address and four exact opcode bytes.

A known instruction through a known edge does not produce another event.
Native Project64 still records the predecessor identity.

The bridge keeps these events:

- A new tail after a known prefix
- A known callee from a new caller
- The same opcode at a different physical address
- A changed opcode at a reused address
- An unresolved placement or generation

The bridge does not read or send complete code pages.
It adds generation context only to a new or unresolved fact.

Instruction identity and ROM attribution are separate decisions.
The resolver assigns a ROM offset only when all four opcode bytes agree with the ROM.
A static address crosswalk without captured opcode bytes stays a candidate.

After an opcode mismatch, the resolver keeps the exact physical address and opcode.
It also keeps one small unresolved row with an occurrence count.
Repeated raw witnesses stay in their raw sessions.
They do not make duplicate persistent unresolved rows.

`knowledge verify` checks each instruction-to-ROM mapping and its function range.

### Controller and DMA facts

The recorder combines only consecutive equal controller states.
Each controller transition stays with its session.

Project64 copies DMA destination bytes when each DMA completes.
It copies the bytes before the novelty decision.

Code, mixed, partial, and ambiguous transfers keep a complete destination-specific identity.
A safe full-ROM static-data transfer uses two exact facts:

- An exact source, range, and content resource
- An exact destination span

Native suppression requires both facts.
A new resource or a new destination produces one event.
This design removes the resource-by-slot Cartesian product.
It does not use a digest to discard event-time bytes.

Large byte values use a CRC32 bucket.
An exact BLOB comparison decides equality.
This rule applies to a forced CRC32 collision.
The staging database keeps each emitted source and destination pair.
Knowledge stores small resource and destination session summaries.

For a destination-specific placement, `matched_length` is the ROM-equal prefix length.
It is not the complete PI transfer length.
The frontier checks the complete source span, destination span, and event-time bytes.
It also checks bytes after a partial ROM match.
Thus, a conservative fact stays distinct, and an exact repeat becomes silent.

### Known activity

Frontier format 6 gives each known fact a stable number.
Native Project64 sets hit bits after an exact instruction, edge, call, or DMA match.

Project64 keeps the two prior instructions through a silent known prefix.
Thus, a new caller or target still produces one exact call fact.
At stop, Project64 sends one small summary with four bitmaps.

The frontier revision token contains the ledger revision and all native fact counts.
An index repair cannot use an old token as if it were current.

An activity bitmap proves that a known fact occurred in a session.
It does not prove the event time or the number of occurrences.
Detailed event context requires one of these records:

- A new fact
- A saved PC sample
- A controller transition
- A requested marker window

`session dedupe` reports possible staging-database byte savings.
It does not change the database.
The software does not remove closed raw sessions automatically.
The selected knowledge database remains the shared cross-session fact store.

## Legacy products

Normal queries use the selected knowledge database directly.
They do not build an atlas, a runtime product, or a generated Resolver.

Use these write commands only for maintenance, repair, or historical checks:

```text
python -m tools.total_resolver atlas build
python -m tools.total_resolver runtime build
python -m tools.total_resolver resolver build
python -m tools.total_resolver resolver verify build/total-resolver/products/resolver-r3
```

A reused live address without time context produces an ambiguous result.
A nominal-address match stays a candidate until exact bytes or a contemporaneous placement prove it.

## Live-evidence tasks

These tasks are not normal knowledge queries.
The `bundle`, `crash`, and `replay` commands create or read generated evidence artifacts.
The `current` command requires an active live bridge.

Use these commands only when the task requires live evidence or a reproducible bundle:

```text
python -m tools.total_resolver live bundle SESSION_ID --sequence 6
python -m tools.total_resolver live crash --session-id SESSION_ID --port 64656
python -m tools.total_resolver live replay BUNDLE_DIRECTORY
python -m tools.total_resolver live current 0x80123456 --port 64656
```

The live tool writes raw bridge and session data before it adds resolver data.
Thus, a resolver failure leaves a partial bundle with the original observation.
All live enrichment has the `live-unreviewed` state.
It never changes an accepted resolver database.

## Exact keys and fingerprints

Cryptographic capture integrity is not a persistent acceptance requirement.
Executable facts use direct address and opcode keys.
Rebuild verification compares exact canonical rows.

CRC32 only selects a bucket for large DMA byte values.
Exact BLOB equality decides whether the software reuses a value.
This rule also applies during a forced collision.

The Rev 0 ROM SHA-256 identifies the required repository target.
Legacy hash fields stay readable for compatibility and diagnostics.
New stop operations write a context manifest without capture, file, or mirror digests.
A hash mismatch alone cannot reject an otherwise valid session.
It also cannot reduce exact DMA evidence.

Legacy product builders can keep deterministic fingerprints.
Capture novelty and knowledge equality do not depend on those fingerprints.

## Tests

Run the Total Resolver test suite with this command:

```text
python -m unittest discover -s tools/total_resolver/tests -v
```

The suite checks these behaviors:

- Protocol incompatibility
- Global event order
- Epoch changes and lost ranges
- DMA destination bytes
- Execution coverage without code-page reads
- Effective controller transitions
- Forced fingerprint collisions
- Idempotent ingestion and transaction rollback
- A known prefix with a new tail
- A known callee with a new caller
- Relocated code and changed code
- The unresolved fallback
- Opcode mismatch rejection
- Exact equivalence between incremental ingestion and a full rebuild
- Database schema rejection
- Immediate selected-knowledge queries
- Delay-slot-aware caller and callee results
- Small indexed search results
- Candidate recalculation
- Known-activity membership
- Marker context windows
- Focused native state and pointer capture
- Focused rollback and read-only queries
- Mutation-surface exclusion
- Raw-session recovery
- Deterministic products
- Contextual ambiguity
- Coverage conservation
- Offline live-bundle replay
