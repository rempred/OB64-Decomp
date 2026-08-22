# Project64 Capture Hot-Path Census — Total Resolver

Status: **source-grounded census complete; no code changed**
Scope: guest CPU execution through native Project64 callbacks, exact novelty
structures, Duktape/JavaScript, bridge queue and transport, Python recorder and
staging database.
Method: read-only source inspection. No builds, tests, benchmarks, captures, or
database operations were run.

## Provenance

| Repository | Inspected at | State |
|---|---|---|
| `C:\Users\Joe\Projects\OgreBattlel64` (parent; owns `tools/project64` bridge tree) | `e8d275b` "feat(project64): add ordered trace and input capture" | 42 dirty entries preserved untouched, including `M tools/project64/ob64_pj64_bridge.js` |
| `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` | `1c4eaa6` "feat(total-resolver): implement schema 3 query pipeline" (`main`, ahead 8 of origin) | Clean |
| `C:\Users\Joe\Projects\project64` (native fork, branch `ob64-core`) | `463653b3b` "Fix scripted ROM launch path lifetime" | 81 dirty runtime/config entries preserved untouched |

No `AGENTS.md` exists in the native fork or beneath the parent's
`tools/project64`; the governing rules are the decomp root `AGENTS.md`,
`tools/total_resolver/AGENTS.md`, and the parent repository `AGENTS.md`.

Bridge script identity: the canonical tracked file
`tools/project64/ob64_pj64_bridge.js` is dirty in the working tree
(+739/−210 versus HEAD). The deployed capture copy
`Bin\Win32\Release_totalresolver_64656\Scripts\000_ob64_pj64_bridge.js`
differs from that dirty working-tree file by exactly one line: the default
`PORT` constant (64640 versus 64656). All line citations below use the deployed
copy; they apply to the canonical working-tree file at the same lines except
for that constant.

## 1. Executive conclusion

**Warmed known-path cost** (every guest instruction when instruction and edge
are already in the persistent frontier) is dominated by fixed native work that
runs before novelty suppression:

1. The interpreter itself — execution events exist only on the interpreter
   core; there is no recompiler hook path today.
2. A full callback environment build plus page-generation lookup per step,
   even though the registered ranges make every game instruction a candidate.
3. `InvokeAppCallbacks` acquiring the `m_InstancesCS` critical section and
   traversing generic callback machinery for **every executed instruction**.
4. Marker-context ring recording: a 12-field record construction and a
   32,768-entry ring write execute **before** novelty suppression, so fully
   known instructions pay it.
5. Exact instruction and edge lookups: already direct-mapped O(1) via an
   8 MiB hot-slot table and a four-entry per-record destination cache, with
   activity-bit updates. This machinery is well optimized.

Items 2–4 are implementation choices, not correctness requirements. Item 1 is
structural: only recompiler-side instrumentation removes it.

**Novel-event storm cost** (first visits to new code, edges, placements, DMA
contents) adds per-novel-step synchronous Duktape transitions, JavaScript event
construction with a second string-keyed dedupe layer, unified-queue pushes, and
per-drain JSON serialization of whole batches. DMA completions additionally
copy their full destination bytes natively per completed transfer inside the
capture window, and novel contents cross transport as hex text (2 characters
per byte).

The two problems are independent: storm fixes cannot move the warmed floor
(known steps make zero script calls), and warmed-path fixes cannot reduce
first-visit storms. The user-reported context of roughly 30 FPS unpatched and
roughly 15 FPS during capture is consistent with a large fixed warm-path floor;
no percentage attribution is claimed anywhere in this report.

## 2. Source-linked hot-path table

Confidence values: `established` = frequency and operation proven from source;
`strongly inferred` = frequency proven, magnitude inferred; `weakly inferred`
= operation present, cost significance uncertain; `unknown`.

### 2.1 Per-guest-instruction path (interpreter)

| # | Operation | When | Work involved | Location | Required vs choice | Cost confidence |
|---|---|---|---|---|---|---|
| W1 | Interpreter opcode fetch and dispatch | Every instruction | Direct `*m_InstructionPtr` fetch refreshed on page crossings; `Jump_Opcode[op]()` table dispatch | `Source\Project64-core\N64System\Interpreter\InterpreterOps.cpp:84-157` (fetch `:106`, dispatch `:138`, refresh `:101-105,:152-155`) | Core emulation; required | Established baseline |
| W2 | Debugger gate checks | Every instruction | `haveDebugger`, `haveExecutionBP`, `trackCPUStepStarted`, `stepping`, `skipOp`, `cpuLoggingEnabled` branches | `InterpreterOps.cpp:107-136` | Mixed: gates required if hooks used; per-check design is a choice | Strongly inferred |
| W3 | Step-environment construction | Every instruction while any app callback exists | `JSHookCpuStepEnv` fill, `COpInfo` wrap, trace-predecessor fields | `Source\Project64\UserInterface\Debugger\Debugger.cpp:697-714` | Choice (built before range test) | Established frequency; magnitude strongly inferred |
| W4 | Page-generation lookup | Every instruction while any app callback exists | KSEG mask, 8 MiB bounds check, one array read | `Debugger.cpp:227-237` (`TracePageGeneration`), call site `:712` | Choice of call position; operation required for placement truth | Established cheap primitive |
| W5 | Exec-range check | Every instruction | Cached count/range/range-cache test | `ScriptSystem.h:132-163`; call site `Debugger.cpp:716` | Required gate; currently passes ~always because of W6 registration scope | Established pass-through |
| W6 | Callback-range registration | Session setup | Two `onexecfrontier` registrations covering `0x80000000-0x803FFFFF` and `0xA0000000-0xA03FFFFF` | Deployed bridge `000_ob64_pj64_bridge.js:846-853` | Choice (full-window scope); KSEG1 alias redundant for OB64 kseg0 execution | Established |
| W7 | Critical-section acquisition + traversal | Every in-range instruction | `CGuard guard(m_InstancesCS)`; loop over disabled/stopping checks; condition-function indirection | `ScriptSystem.cpp:168-190`; entry via `Debugger.cpp:716-719` | Choice (generic dispatch reused for hot hook) | Established frequency; magnitude strongly inferred |
| W8 | Condition evaluation | Every in-range instruction | Flag resets, range compare | `ScriptAPI_events.cpp:745-754`, `:740-743` | Required for frontier semantics | Established trivial |
| W9 | Context-record build + marker-ring write | Every in-range instruction, **before** novelty suppression | 12-field record incl. two physical resolutions and `ViFrameCount()`; ring slot write with modulo indexing, order counter, count bookkeeping | `ScriptAPI_events.cpp:762-784`; ring impl `ScriptTypes.h:146-181,:275-297` | Choice: continuous retention enables retrospective markers; not required for fact capture | Established frequency; magnitude strongly inferred |
| W10 | Exact instruction check | Every in-range instruction | Direct-indexed hot slot (`physical >> 2`) compare + record match; fallback FNV open-addressing probe with hot promotion | `ExactExecNovelty.h:94-117` via `InsertInstruction`, `FindInstruction :479-532`, hot slots `:50-52,:345-349,:447-471` | Required for suppression correctness | Established O(1) typical; table growth/rehash `:553-613` amortized |
| W11 | Activity-bit update on known facts | Known instructions/edges | Bitmap byte OR, first-hit counting | `ExactExecNovelty.h:408-428` (`MarkActivity`), invoked `:108-111,:210-223` | Required for stop-time membership bitmaps | Established trivial |
| W12 | Edge suppression | Every stepped pair where previous valid | Single-slot last-record cache; ≤4-entry hot-destination scan; else edge-table probe + round-robin destination cache fill; unresolved pages force conservative `traceNewEdge=true` without insert | `ScriptAPI_events.cpp:793-841`; `ExactExecNovelty.h:193-227,:229-262,:704-744,:746-764` | Required for exact-edge identity | Established O(1) typical |
| W13 | Predecessor state update | Every instruction while callbacks exist | Trace previous PC/opcode/page/generation stores; pending-store tracking | `Debugger.cpp:729-738` | Required for edge derivation | Established trivial |

### 2.2 Novel-step additions

| # | Operation | When | Work involved | Location | Required vs choice | Cost confidence |
|---|---|---|---|---|---|---|
| N1 | Duktape transition | Each step returning true (novel instruction, novel edge, or ready marker window) — one call may carry several facts | `duk_push_heapptr` + arg builder + `duk_pcall` on the emulator thread | `ScriptInstance.h:62-97` (`RawInvokeAppCallback`, `RawCall` `duk_pcall :84`) | Required under current JS-callback architecture | Established transition; magnitude unknown |
| N2 | Event object construction | Same as N1 | Object with 13 properties; marker windows additionally materialize up to 8,192 per-record objects | `ScriptAPI_events.cpp:982-1056+` (`CbArgs_UniqueExecEventObject`) | Choice of representation | Established allocation; magnitude strongly inferred |
| N3 | Second novelty layer in JS | Each emitted event | `seenInstructions` string-key dict test/set, hex key building | Bridge `:721-739` | Choice (defense-in-depth dedupe; also feeds counters) | Established allocation |
| N4 | Unified queue push + overflow trim | Each event of any stream | Epoch + monotonic sequence assignment at enqueue; array push; `shift()`-based trim beyond 65,536 with dropped-range recording | Bridge `:485-502`, limit `:49` | Sequencing required; trim policy choice | Established; shift cost weakly inferred |
| N5 | Watch-event enrichment | Watch hits only | Full register snapshot (~30 mapped reads), timestamp, frame | Bridge `:431-439` (`pushEvent`, `regSnapshot`) | Choice | Established per-hit cost |
| N6 | DMA completion handling | Every completed PI DMA inside lower-4-MiB window | Destination-byte vector reset + full RDRAM copy; identity map lookup; linear candidate scan with exact BLOB equality; activity bitmap on hit | `ScriptAPI_events.cpp:846-893` (`CopyRdramBytes :863`, map `:879-880`, equality `:881-888`) | Copy + exact bytes required by evidence contract ("event-time destination bytes"); scan structure is choice | Established copy volume ∝ transfer length; map/scan strongly inferred |
| N7 | Novel DMA payload serialization | New DMA content only | Hex encoding at 2 chars/byte into event | `ScriptAPI_events.cpp` payload → Bridge `bytesToHex :521-529`, packet push `:1370-1374` | Encoding choice (contract requires exact bytes, not hex) | Established size ∝ 2× transfer length |

### 2.3 Transport and host side (pull-based)

| # | Operation | When | Work involved | Location | Required vs choice | Cost confidence |
|---|---|---|---|---|---|---|
| T1 | Drain request/response | Python polls every 10 ms | `drain [max]` command; reply = single `JSON.stringify` of batched events array over TCP newline framing; 65,536-byte recv chunks | Bridge drain `:1565-1579`, send `:1426-1428`; client `tools\total_resolver\pj64_client.py:458-459,:116` | Polling architecture is a choice; ordering contract required | Established batching; stringify magnitude scales with backlog |
| T2 | Recorder poll cycle | 100 Hz target | Strict epoch/sequence continuity and conservation validation per batch; loss-range bookkeeping | `tools\total_resolver\recorder.py:1079-1153` (limits `:121-122`: 10 ms, 4096) | Validation required by ingest contract | Established Python-side cost, off emulator thread |
| T3 | Staging database writes | Per drained batch | One `BEGIN IMMEDIATE` transaction; per-event JSON compaction, two SHA-256 digests, content-blob interning SELECT+INSERT, event row INSERT; commit per batch; WAL checkpoint TRUNCATE at close | `tools\total_resolver\capture_db.py:433-527` (begin `:440`, interning `:450-474`, commit `:527`, checkpoint `:855`) | Interning/hashing are contract choices; transaction shape required for atomicity | Established host cost; never blocks emulation directly |

### 2.4 Recompiler versus interpreter

| Fact | Evidence |
|---|---|
| Execution-frontier registration requires the interpreter core | `RequireInterpreterCPU` declared/enforced in `ScriptAPI_events.cpp:36` and used by `js_events_onexecfrontier`; hooks live solely in the interpreter's `CPUStepStarted` path |
| A compiled block is a CFG, not a straight line | `CodeBlock.h:82` (`ExistingSection`), `:111-134` (`CreateBlockLinkage(CCodeSection*)`, `SectionMap`/`SectionList`, `m_EnterSection`) |
| No cached-interpreter mode exists | `ExecuteOps` already uses direct page-pointer fetch and table dispatch (`InterpreterOps.cpp:106,:138`); nothing pre-decoded beyond this |
| Deployed runtime is Win32 x86 recompiler (`CX86RecompilerOps`); recent `CX64RecompilerOps` commits are early single-opcode work | Fork log at `463653b3b`; `Source\Project64-core\N64System\Recompiler\x86\` production paths |

## 3. Verification of provisional observations

All eight observations are **confirmed**; none is refuted. Several carry
stronger evidence than originally stated.

1. **Full-window exec registration** — Verified: both KSEG aliases registered
   (bridge `:846-853`), making `HaveCpuExecCallbacks` pass for essentially all
   OB64 execution (fast path `ScriptSystem.h:132-163`).
2. **TracePageGeneration is small** — Verified: mask, bounds check, one array
   read (`Debugger.cpp:227-237`). Its *call position* (before the range test)
   is the only questionable aspect, and with full-window registration even that
   is moot.
3. **Known execution avoids Duktape but pays native overhead** — Verified, and
   stronger than stated: the pre-suppression segment includes the critical
   section (W7), environment build (W3), and the marker-ring record build and
   write (W9). Ring work runs before suppression, not after.
4. **One callback can carry instruction + edge** — Verified: a single event
   exposes both `newInstruction` and `newEdge`
   (`ScriptAPI_events.cpp:1000-1001`), and the condition returns true if either
   fired (`:843`). Script-call count therefore bounds fact count from below…
   i.e., calls ≤ novel facts per step.
5. **Batching targets storms, not the warm floor** — Verified: known steps
   return false before any script interaction (`W10-W12` return false paths),
   so no batching scheme changes warm-path work.
6. **Delayed batching must preserve interleaving** — Verified structurally:
   `pushOrderedEvent` assigns one monotonic `bridgeSequence` across all streams
   at enqueue time (bridge `:485-502`), the recorder rejects replay/reorder and
   proves created/drained/dropped conservation per poll (`recorder.py:1092-1117`),
   and ingestion keys idempotence on exact sequence contracts. Any deferred
   flush must assign sequences at observation time or buffer all lanes
   together.
7. **Block entry ≠ all compiled instructions executed** — Verified:
   `CCodeBlock` maintains a CFG of `CCodeSection`s linked at compile time
   (`CodeBlock.h:82,:111-134`); entering a block executes one runtime path.
   Branch-likely annulment, delay slots, mid-section exceptions, and indirect
   exits each break straight-line assumptions independently.
8. **No cached-interpreter; direct page pointer retained** — Verified:
   `m_InstructionPtr` refreshes only on 4 KiB crossings
   (`InterpreterOps.cpp:101-105,:152-155`) and dispatch is a jump table
   (`:138`). The classic cached-interpreter speedup claim does not transfer to
   this loop without new decode-cache and invalidation machinery.

## 4. Existing measurement facilities (no changes needed)

| Facility | What it separates | Location |
|---|---|---|
| `trace status` counters | Native callback invocations vs emitted vs suppressed coverage; suppressed-known instruction/edge counts; unresolved counts; dropped-by-stream | Bridge `traceStatus()`, `:645-662` |
| `inputCaptureStatus` | Input samples vs transitions vs consecutively-suppressed samples | Bridge `:664-674` |
| Recorder `PollResult` timing | Per-poll `drain_ms`, inter-poll interval, longest drain stall, queue high-water | `recorder.py:1130-1144,:1164-1209` |
| Frontier/status command | Loaded frontier sizes (instructions/edges/DMA) for expected suppression ratios | Bridge `noveltyFrontierStatus()` via `frontier status`, `:1581-1592` |
| Project64 FPS display / OS-level frame timing | End-to-end FPS for A/B binary comparison | External to capture code |
| Existing binary variants | ObserveOnly / FullNovelty / DirectExact / HotExact / plain `Project64.exe` in the same runtime tree isolate capture-stage contributions | `Bin\Win32\Release_totalresolver_64656\` |

## 5. Ranked measurement plan (costs not separable today)

1. **Variant A/B on identical input** (existing binaries, no code change): same
   savestate, same timed gameplay segment across all six exes. Splits:
   interpreter baseline (plain exe vs ObserveOnly), generic-dispatch overhead
   (ObserveOnly vs HotExact family), residual novelty-filter differences
   (HotExact vs DirectExact/FullNovelty). Record FPS externally; record
   `trace status` deltas to normalize novelty exposure.
2. **Warm-vs-storm attribution using existing counters**: run one session that
   first replays known content, then enters new content; correlate
   `suppressedKnownInstructions` growth (≈ warm-path instruction count) against
   `nativeCallbacks` growth (storm call count) and observed FPS segments.
3. **Host-side share**: enable recorder `PollResult` collection during the same
   sessions; `drain_ms` and queue high-water bound transport/host contribution
   (expected small, must be shown).
4. **Remaining inseparable residue**: within the native warm path, W3/W7/W9/W10
   cannot be attributed further without touching code. Smallest proposed
   instrumentation (describe-only, per boundaries): temporary
   `QueryPerformanceCounter` bracket pairs around the four segments inside
   `CPUStepStarted` (env build; dispatch+guard; condition+ring; novelty
   lookups), aggregated into four process-lifetime accumulators printed by a
   debug command — or, with zero source change, an ETW/`xperf`/profiler sampling
   session attributing samples among those four symbol ranges. Either yields
   the split; the profiler option requires no rebuild.
5. **DMA volume profile**: `trace status` emitted-DMA counts plus staging DB
   `event_time_content_size` distribution quantify N6/N7 exposure per session
   type (loading screens versus battle play).

## 6. Ranked optimization hypotheses

### 6.a Warmed known path

1. **Gate continuous marker-ring retention behind armed-marker state**
   (removes W9's per-instruction build/write whenever no marker window is
   pending). Highest ratio of removal to risk among small changes; retention
   becomes a session choice.
2. **Dedicated native fast path bypassing generic dispatch** (collapses W3+W7+W8
   into one lock-free routine modeled on the existing cached-info pattern;
   builds JS payloads only for emitted facts). Medium effort; touches the most
   invariant-rich layer.
3. **Slim the context record** (defer physical resolution and frame reads until
   a window is actually taken). Independent micro-reduction; composes with 1.
4. **Recompiler section-level coverage** (eliminates items W1–W13 wholesale by
   instrumenting runtime `CCodeSection` entries and taken exits instead of
   interpreter steps). Strategic endgame; requires its own design doc,
   invalidation-path proof, and structural audit; compile-time links are
   candidate edges until taken.

### 6.b Novel-event storms

1. **Unified native ordered emission ring with bulk drain** (all lanes append
   observation-time sequenced compact records; one packed delivery per drain or
   VI boundary preserving enqueue order; explicit loss ranges; protocol bump).
   Removes per-fact Duktape transitions and shrinks N2/N3 exposure.
2. **Retire the duplicate JS-side `seenInstructions` layer once native
   suppression is authoritative** (N3), keeping its counters fed from native
   decisions instead.
3. **Binary or base64 DMA payload transport instead of hex text** (N7 halves+
   payload size; protocol and schema change with ingest-side compatibility).
4. **Watch-event snapshot trimming** (N5): semantic decision — downstream
   consumers currently receive register snapshots on watch hits; reduction
   requires confirming consumer needs first.

## 7. Correctness risks per optimization

| Optimization | Principal risks |
|---|---|
| Ring-retention gating | Before-window history exists only while retention enabled; retrospective markers placed without prior retention lose their "before" side by design and must fail closed rather than emit short windows silently. `TakeExecutionContextWindow` validation (`ScriptTypes.h:299-309`) must keep rejecting malformed windows. |
| Native fast path bypassing dispatch | Races currently serialized by `m_InstancesCS` (instance stop/disable mid-step, callback removal sweeps) need an equivalent happens-before story; behavior when the sole frontier callback is removed mid-session must remain fail-closed. Suppression decisions move closer to the CPU thread; any state shared with JS-facing structures needs defined ownership. |
| Record slimming | Unresolved-placement records must still distinguish resolved/unresolved physical addresses exactly as today (`ScriptAPI_events.cpp:1050-1056` null semantics); losing that distinction corrupts ingestion typing. |
| Recompiler coverage | Section-entry/taken-exit instrumentation must prove equivalence with interpreter-derived edges across branch-likely annulment, delay slots, exceptions, and indirect exits; every code-mutation invalidation path (stores, DMA into code regions, resets) must either re-instrument or invalidate coverage state; ordering against DMA/watch/controller events must survive; interpreter fallback path must stay available for verification. Compile-time successor links are candidates, never observations. |
| Unified ordered ring | Sequence assignment must occur exactly once per event at observation; buffering must not reorder across lanes; overflow must extend the existing dropped-range ledger honestly; protocol bump demands bridge/client compatibility tests per `tools/total_resolver/AGENTS.md`. |
| Removing JS dedupe layer | `emittedCoverage`/`suppressedCoverage` accounting and unresolved representatives currently derive partly from this layer (bridge `:645-662`); counters must be re-derived from native decisions or reports change meaning. |
| Payload encoding change | Staging schema interns hex-uppercase content today (`capture_db.py:457`); encodings enter the persisted contract (`content_encoding`) and knowledge ingestion expectations — dual-format acceptance or migration required. |
| Watch trimming | Pure semantic regression risk for consumers relying on register context. |

## 8. Explicit unknowns requiring empirical measurement

- Percentage split of the warmed floor among interpreter baseline, dispatch/
  guard, ring recording, and novelty lookups (measurement plan §5.1/§5.4).
- Absolute Duktape-transition cost per call on this host (§5.2 correlates call
  counts with FPS; per-call cost remains inferred).
- Real-frequency of queue overflow (`droppedByStream`) during representative
  storms; current sessions show explicit loss ranges only historically.
- Typical DMA copy-volume distribution per gameplay hour (§5.5) and its share
  of storm cost versus instruction storms.
- Whether GLideN64/audio plugin overhead differs measurably between plain and
  TR-built executables (variant A/B will reveal this incidentally).
- Actual per-call Duktape GC pressure during long storms (heap statistics were
  not inspected in this census).

## Boundaries compliance

Only this report file was written. No capture code, tooling, configuration,
tests, schemas, or other documentation was modified; no branches, commits, or
patches were created; Project64 was not launched or controlled; no capture was
started or stopped; no knowledge database was ingested, imported, selected, or
migrated; no builds, tests, or benchmarks were run. All three repositories'
pre-existing dirty state is preserved exactly as found and itemized above.
