# Total Resolver R3 implementation status

Status: **Protocol 0.12 native structural/DMA delta and pre-ROM capture are implemented**
Updated: 2026-08-19

This page records the current implementation boundary. It does not claim that all game paths have
been observed or that a machine transition proves a semantic interpretation.

## Current persistent workflow

One selected SQLite database accumulates unique machine facts across sessions. An active run first
writes an isolated staging database. Normal stop drains and closes the stage, verifies its ROM,
protocol, bridge epoch, sequence continuity, dropped ranges, and required event-time DMA bytes,
derives a delta outside the knowledge transaction, then atomically merges facts, affected
materialized rows, the ledger entry, and the next frontier.

Normal capture disables the duplicate NDJSON event mirror. Finalization no longer computes a
logical hash over every staging table, hashes the entire SQLite file, or builds the raw timeline
twice. A small context manifest is written without capture/file/mirror digests. Validation reads
canonical payloads, exact referenced bytes, machine ordering, and required metadata directly from
SQLite.

Schema 2 stores:

- physical-address plus exact-opcode instruction facts;
- exact source/destination instruction edges and calls derived from those edges;
- compact page and instruction/edge generation witnesses as session context;
- DMA placements with exact event-time destination bytes and per-session witnesses;
- effective P1 input transitions tied to the session;
- unresolved observations when placement/generation cannot be established;
- incremental overlay-atlas, runtime-provenance, and resolver function materializations; and
- a successful-ingestion ledger and checkpointed frontier.

Known executable structure is silent on replay. Whole mutable pages no longer own instructions and
are neither read nor emitted by the protocol 0.12 execution callback. The native predecessor
tracker still observes known prefixes, so a later new tail or new caller edge is retained.

Capture is restricted to vanilla OB64's lower 4 MiB of RDRAM; Project64 may allocate either 4 or
8 MiB. The upper 4 MiB is ignored. Project64 takes one atomic native 4 MiB copy before the first
captured instruction. Complete static-function byte matches from that
census add resident placement evidence for code that has not executed and was not observed in a
DMA. Census placement never becomes an execution or loader claim.

A power-on session can now be armed before Project64 has a loaded ROM or allocated N64 RDRAM.
Project64 calls the bridge synchronously at `EMU_STARTED`, after fresh RDRAM exists and before
`ExecuteInterpret()`. The bridge validates the expected Rev 0 CRC and interpreter core, installs
the snapshot/execution/input/DMA hooks, and makes the 4 MiB snapshot the first ordered event. The
worker then verifies the exact normalized ROM file identity before the stage can be accepted.

## Identity and indexing policy

Cryptographic capture integrity is not a persistent session/knowledge acceptance class.
Executable keys are compared directly:

- instruction: physical instruction address and four opcode bytes;
- edge: exact source instruction, exact destination instruction, and edge kind;
- call: exact call edge plus uniquely resolved function endpoints.

Large DMA blobs use CRC32 only as a candidate-bucket accelerator, followed by exact BLOB equality.
Forced collisions cannot merge content. The canonical ROM SHA-256 remains the repository-required
Rev 0 target identity. Direct canonical-row comparison, not a logical hash, is the rebuild oracle.

Page generation is context only. The same address/opcode in another generation does not create a
new structural fact. A missing placement or generation is captured conservatively as unresolved
instead of being treated as known.

Runtime instruction attribution is independently byte-confirmed. A nominal-VRAM or
contemporaneous-DMA candidate may set an instruction's ROM offset/function only when the observed
opcode equals all four bytes at that ROM offset. Address-only nominal matches remain candidates;
mismatches retain the exact instruction and compact unresolved context. Ingestion repeats the byte
check, and database verification checks every mapped row and function range.

## Observation-only boundary

The recorder receives a narrow ObservationOnlyPj64Client facade. The facade exposes observation
and recorder-owned instrumentation only. It does not expose RAM writes, controller injection,
pause/resume, stepping, state load/save, ROM lifecycle, global clear, or memory dump commands.
Captured knowledge and byte evidence are passed only through this facade during recorder runs.

The broader Project64 bridge still supports explicitly invoked research controls for tools outside
the recorder. Tests verify that those methods are absent from the recorder facade and that recorder
source never invokes mutation commands.

## Real migration result

The three previously accepted valid sessions were replayed into
build/total-resolver/knowledge/total-resolver-v2.sqlite beside the schema-1 database. Raw sessions
and historical products were not changed. The schema-2 database was selected only after its
checkpoint and all materializations verified.

| Measure | Schema 1 page-owned model | Schema 2 structural model |
|---|---:|---:|
| Sessions | 3 | 3 |
| Executable owners/pages | 5,260 exact page contents | 165 physical pages |
| Instructions | 278,340 | 73,725 |
| Edges | 319,569 | 78,300 |
| Calls | 31,283 | 2,562 |
| DMA placements | 18,095 | 18,095 |
| Controller transitions | 487 | 487 |

The former repeated-menu protocol 0.9 session now contributes 1,712 new instructions and 1,915
new edges, exactly matching the address/opcode diagnostic, and contributes zero new physical
pages. Under schema 1 it appeared to add 34,832 instructions because 792 changing full-page images
were treated as distinct code owners.

The deterministic repair command replayed all three ledger entries into a separate database.
Every canonical table was exactly row-equivalent to the incremental database. Both databases pass
independent materialization, frontier, opcode-byte, foreign-key, and SQLite health checks.

After two protocol 0.10 captures, the five-session database was replayed beside the selected copy
under the byte-confirmed mapping rule. The former copy contained 22,039 instruction mappings whose
stored opcode did not equal the proposed ROM offset. The repaired database retains the same 94,053
instruction facts, 100,131 edges, 171 physical pages, 29,065 DMA placements, five-session ledger,
and exact frontier identity. It contains 71,702 byte-confirmed mapped instructions with zero opcode
or function-range mismatches; unsupported derived calls decreased from 3,308 to 2,719. The 26,303
unresolved rows are compact per-exact-issue representatives rather than 262,930 repeated witnesses.
A second clean ledger replay was directly row-equivalent and the repaired database was selected.
The former database and repair outputs remain beside it.

## Capture-volume and startup measurements

The production bridge is exercised inside a Node fake-emulator harness; this never launches or
controls Project64.

| Measurement | First capture | Exact replay |
|---|---:|---:|
| Canonical instruction/edge facts | 3 | 0 |
| Structural trace events | 2 | 0 |
| Full 4 KiB reads on execution path | 0 | 0 |
| Exact known DMA events | n/a | 0 |

The startup census is one 4,194,304-byte staging payload by design; it replaces an incomplete
40 KiB safety-page census and is placement evidence rather than a repeated execution stream.

The selected six-session database exports 241,862 instructions, 260,557 edges, and 141,683 exact
DMA facts into a 129,815,139-byte native frontier. On the measured host, SQLite-to-memory export
took 1.676 seconds and atomic binary writing took 0.423 seconds. Both are capture-start work, not
per-event emulator-thread work.

The same harness retains a known-prefix/new-tail transition, a new caller into a known
destination, relocated identical code, a changed opcode at a reused address, and missing-generation
fallback. It also verifies unified event order, event-time DMA bytes, explicit dropped ranges, and
protocol identity.

The current protocol 0.12 harness also proves that an exact known DMA produces zero bridge events,
while the same transfer metadata with changed destination bytes produces one event containing
those event-time bytes. With Project64 configured for an 8 MiB allocation, the harness additionally
proves that execution and DMA activity in the upper 4 MiB produces zero bridge events while the
atomic baseline remains exactly 4 MiB. The Win32 Release native fork compiles, passes its
clang-format gate, and links in the isolated runtime as
`Project64-TotalResolver-4MiBWindow.exe`. A real FPS comparison remains deliberately pending: it
requires Joe to start that binary and perform the same controlled play path. No emulator was
launched or controlled for this work.

## Automated acceptance coverage

The test suite proves:

- exact session replay is idempotent and emits zero already-known structural facts;
- page/generation churn does not multiply executable facts;
- known prefix plus new tail and new caller-to-known-callee edges survive;
- identical opcode bytes at different physical placements stay distinct;
- changed opcodes at a reused address stay distinct;
- opcode-mismatched nominal/ROM mappings fail before ingestion and fail database verification;
- forced fingerprint collisions require exact byte comparison;
- ambiguous placement/generation falls back to capture/unresolved storage;
- interrupted ingestion rolls back completely;
- queue overflow has explicit dropped sequence ranges;
- older protocol clients and capture windows other than the lower 4 MiB fail closed against
  protocol 0.12; 4 and 8 MiB Project64 allocations are accepted after ROM load;
- powered-off capture accepts only zero allocated RDRAM with no loaded ROM, installs all hooks
  before the first interpreter instruction, and rejects a wrong ROM before capture begins;
- incremental materializations equal a direct exact-row full rebuild;
- controller transitions retain session context;
- the recorder facade does not expose mutation methods; and
- Total Resolver tests and the ordinary exact-ROM workflow have no Project64 dependency.

The current host invocation of `node tools/verify.js` reached the ordinary workflow without
Project64, then failed closed at its independent pinned-host gate: Windows PowerShell is now
5.1.26100.9168 rather than the recorded 5.1.26100.8972, and its automation assembly is GAC-loaded
rather than present beside `powershell.exe`. No ROM build result is claimed from that invocation;
the Total Resolver changes do not touch the build/toolchain path.

## Historical products

Frozen pre-R3 overlay/runtime atlases and previously generated accepted/candidate products remain
historical/reference inputs. Schema 2 does not overwrite or silently promote them. The selected
persistent database is live-unreviewed research knowledge, not accepted source ownership.

## Current limits

- Coverage is incomplete and biased toward paths actually played.
- Static calls, residency, sampled PCs, exact execution, placement, field candidates, resource
  ancestry, and human semantics remain different evidence classes.
- Capture schemas 3 and 4 retain historically named SHA columns and content references for compatibility.
  Existing candidate references are confirmed by exact bytes. New session manifests contain
  context only; legacy payload/manifest/file/mirror hash mismatches are diagnostic and cannot reject
  an otherwise structurally valid session.
- Controller input and frame/time data are context, not canonical machine ordering.
- Page generations supplied by native Project64 are contextual observations, not proof that every
  possible RDRAM writer was observed.
- DMA ordering alone cannot prove transient destination contents; exact event-time destination
  bytes therefore remain required.
- Exact opcode equality rejects false ROM mappings but does not by itself prove human semantics or
  distinguish every coincidental common instruction; nominal-only matches therefore remain
  supported live-unreviewed mappings rather than accepted structural ownership.
- Closed raw sessions are not automatically deleted. The persistent marginal structural delta can
  approach zero while session context and one ledger entry remain.

No capture is active. A future controlled repeat should begin only after the target screen has
settled and Joe explicitly says capture is ready, so cold-boot coverage is not mistaken for a menu
delta.
