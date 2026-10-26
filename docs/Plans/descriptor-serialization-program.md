# Descriptor and record serialization family

Authorized October 26, 2026, starting main `06a7a658`. The accepted E1 archive
`build/accepted-builds/equipment-e1/` is the protected exact-ROM reference.
Current ownership is in [the Director cursor](cursors/director.md).

**Acceptance, October 26:** D2 passed and was committed at `5eb22b4d`.
D1's [complete integration](../audit/2026-10-26-descriptor-d1-integration.md)
passed structural audit, fresh compilation and exact-ROM verification at CURRENT
`88F9BA72`, committed at `f7c5091e`. The revised outcome below is accepted: four
PURE_C wrappers plus one HYBRID_C exact encoder, with its original PURE_C goal
still unresolved. Both workers released ownership and are retired; no follow-on
wave is assigned. D1's 34,049-file proof archive was independently rehashed with
zero mismatches, and safe cleanup removed 5,513,299,838 bytes. Live CURRENT,
fresh proof and baseline remain available. Nothing was pushed.
The remaining sections are historical scope and execution decisions, not restart
instructions. Any future encoder PURE_C work needs a fresh assignment.

## Scope

Two complete waves cover seven remaining physical owners, 1,888 bytes. Sizes
describe physical owners, not necessarily single logical functions.

| Wave | Target | ROM interval, end exclusive | Bytes |
|---|---|---|---:|
| D1: codec and record wrappers | `boot_bitstream_descriptor_encode` | `4894..4AC8` | 564 |
| D1 | `func_00042dc4` | `42DC4..42E64` | 160 |
| D1 | `func_00042e64` | `42E64..42F68` | 260 |
| D1 | `func_00042f68` | `42F68..43000` | 152 |
| D1 | `func_00043000` | `43000..43100` | 256 |
| D2: shared record-byte converters | `func_00050918` | `50918..509F4` | 220 |
| D2 | `func_000509f4` | `509F4..50B08` | 276 |

**October 26 outcome decision under Joe's delegated direction:** after Sol/Muse
consultation, fresh encoder diagnostics and an independent structural ruling,
Astra authorizes evaluation of the existing whole-owner `HYBRID_C` fallback for
the encoder: readable known body plus openly retained original suffix, conserving
all 564 bytes and leaving its logical interpretation unresolved. If that representation
passes existing guards, independent structural/config review and complete-wave gates,
the explicit revised D1 outcome is four `PURE_C` wrappers and one `HYBRID_C exact`
encoder. The encoder receives no official matching-C credit; its original PURE_C
objective remains unresolved. No owner is dropped, no new function/padding classification
is invented, and no generic retained-remainder tooling is authorized by this decision.

D1 totals 1,392 bytes; D2 totals 496 bytes. Preserve complete membership, without
per-function acceptance waves. Existing assembly callees provide stable interfaces,
so both waves can proceed independently and either ready wave can integrate first.

The four wrappers are all direct encoder/decoder callers found by the whole-ROM
aligned JAL census. The first pair uses table `80187444`, 100 records at
`80193BC0`, stride `0x38`; the second uses `80187618`, records at `80195560`,
stride `0x34`. Both pairs use converters at runtime `8017AA18` and `8017AAF4`.
This bounds the assigned family; it does not rule out indirect calls or encompass
every save-game/text operation. Other converter callees, preceding `func_00042d40`
and following accessors remain stable dependencies. Report proven coupled producers
before changing scope; adjacency alone does not add targets.

Protect the accepted PURE_C decoder (416 bytes), cursor helpers (800 bytes), and
complete LZSS owner (2,668 bytes). The screenshot's LZSS status is historical.
Earlier programs remain complete and cutscenes remain a draft.

## Structural prerequisite

The encoder's full accepted owner is `.ob64.r0035`, 564 bytes. Only `4894..4AB8`
(548 bytes) is a reviewed logical body; `4AB8..4AC8` remains unknown coverage.
The current `config/logical-functions.json` and
[September census](../audit/2026-09-23-boot-decode-body-census.md) supersede the
[older dossier](../dossiers/boot-bitstream-descriptor-encode.md). The
[trial](../audit/2026-09-23-boot-decompression-trial.md) reports historical isolated
body equality, which is not full-owner acceptance. D1 recovered its source from
the retained September 24 transcript into `build/matching/descriptor-d1/recovered-4894-h1.c`;
the sibling `historical-encode-extracts.json` records provenance and historical
results. The original GoldOx scratch root is missing. Revalidate recovered source
under current contracts before treating any old comparison as current evidence.

Director's initial bounded structural research found no newer accepted resolution.
Existing follow-up already scanned mapped executable slices and address construction;
repeating negative scans or compiling an empty-function lookalike is insufficient.
The current finding blocks structural classification/activation, not private
source investigation. Following Joe's instruction to consult Muse and decide,
Astra keeps the full five-member D1 assignment and authorizes a fresh supported
548-byte logical-body comparison of the recovered C, with current accepted
declarations and authenticated inputs. Preserve the historical file. If needed,
one distinct native-object capture may assemble untouched compiler output with
the unchanged pinned executable/flags to observe genuine extent and alignment.
The 564-byte reference remains conserved; this is diagnostic, not partial acceptance.

Positive contextualized tail entry or authenticated original object/symbol/debug
provenance can justify reconsideration. Evidence from natural C reconstruction may
also be submitted for independent structural evaluation; deterministic compiler
symbols or exact bytes alone do not establish the retail partition. Do not require
proof of original C spelling before investigation. Every proposed interpretation
still needs independent justification and applicable structural review/audit before
activation. No dummy functions solely to generate bytes, synthetic padding, guard
bypasses, partial-owner activation or retained-unknown-remainder tooling is approved.
A failed finite trial is not proof of pure-C impossibility or authority to close the
wave. Sol/Muse own source-bound reconstruction hypotheses; Director owns structural
decisions and separately scoped tooling. Preserve readable source and counterexamples.

D1 starts the four wrappers while resolving this prerequisite. A subsequently
approved native-object capture and independent evidence review confirmed that
untouched `func_00043000` compiler output naturally produces one 244-byte function
in a 256-byte, 16-aligned native section with twelve zero tail bytes. The unchanged
generic `nativeTextTail` schema2 census passes, with all 14 relocations and body
bytes conserved. Evidence is `build/matching/descriptor-d1/native43000/capture-result.json`.
This supports proposing the existing contract at full D1 integration; canonical
binding, linked ownership/bytes, fresh compilation, full-ROM verification and the
prescribed structural audit/review remain required. It does not classify the
separate encoder tail. Current accepted runtime is `8016D100..8016D200`.
D2 uses current 220/276-byte owners rather than stale extraction-header sizes.
Uncertainty about the encoder must not stop unaffected matching. D1 remains
unfinished until its complete assignment passes; four wrappers alone do not close it.

## Workers and execution

Launch used two fresh **top-level Sol 6.1 Extra High** threads on main, with D2
the sole production writer and D1 private-only. D2 is now accepted/committed at
`5eb22b4d`, cleaned and retired. Its explicit release transfers sole production
source/config/build/shared-workbench ownership to the same unfinished D1 worker;
current cursor is `docs/Plans/cursors/descriptor-d1.md`. D1 keeps candidates in
`build/matching/descriptor-d1`. No branches or worktrees. Drain affected native
checks before shared-input changes, then promptly release them. Private editing
and reasoning can continue during drains.

The encoder's private comparison rejected the accepted `src/boot/bitstream.h`
dependency before candidate compilation because private mode permits only `include/`
headers. D1 is authorized to run the same single reviewed548 diagnostic through
the existing standard workbench, omitting `--scratch-root`, under its sole shared-output
ownership. This uses normal repository-local dependency authentication; no private
guard/header/tool changes. Record newly created standard-run paths, charge them to
the same scratch budget and clean only those owned artifacts when appropriate.
This operational permission does not activate the encoder or weaken its gates.

Prepend `.toolchains/node-v24.13.1-win-x64` to process-local PATH and use its
`node.exe` for native commands. Set process-local
`OB64_WORK_ROOT=C:\Users\Joe\.codex\ob64-descriptor-20261026` in both workers.
D2 authenticates setup and creates one reusable baseline if supported commands
require missing CURRENT state. Do not change tool pins or reconstruct deleted
caches. D1 prepares source while this happens. The initial native-check dependency
ends as soon as D2 reports stable baseline inputs to Director.

At intake reconcile full disassembly, current research, bodies and accepted
placements. At the first concrete compiler symptom, query bounded shared lessons
with `--cross-limit 3` or the applicable `--symptom` and check existing symbol/table
declarations before long variation sequences. Default same-target intake alone
does not search all shared lessons. Read relevant source pairs and counterexamples.

Joe confirmed the existing **Muse subscription** on October 26; use Muse Wonder
Full / Extra High for this program, carrying forward the tested E1 setup. Each
worker has its own persistent session in
`build/consultants/descriptor-d1-muse/session.json` or `descriptor-d2-muse/session.json`.
Never reuse E1's session or another worker's ID; retain one session for that worker's
lifetime. Use `muse exec --model muse-wonder-1.0 --reasoning-effort xhigh
--preset empty --worktree off --disable-write --disable-shell --disable-web-tools
--disable-reminders --disable-request-user-input --no-foreign-personal-context
--session-id <own-ID> --prompt-file <evidence-prompt> --json`.
Read completed answers from JSON `payload_type=run.terminal.completed`, `payload.text`;
retain stdout/stderr and failures, and resume the same ID on later questions.
Use existing subscription authentication without credential/billing changes.
Sol owns matching and supplies source-bound questions. No new wrapper, communication
framework or autonomous consultant loop. This assignment-specific Muse choice also
replaces Claude's consultation/agreement role; tooling still requires explicit
Sol/Muse agreement, Astra approval and independent review. Preserve D1's failed Claude
session/evidence; do not retry the organization-rejected route. Matching difficulty
is not an indefinite hold.

Each worker needs tested native message and stop/attention routes to Director
`01a1284c-9b2b-7561-8a81-36ca34387ef8`, persistent retry/dedup state, and confirmed
actual startup. Retire routes only after acceptance and ownership release. No
Agent Mail, scheduled tasks or routine per-experiment notifications. Send complete
handoffs, approval requests and real blockers immediately through the native route.

## Acceptance and bounded storage

Use supported private comparisons, then integrate a ready complete wave and run
focused canonical linked diffs plus one whole-wave verifier without a redundant
preceding build. Require the explicit per-target source class: PURE_C wrappers and,
only under the documented revised outcome, HYBRID_C encoder. Require complete
coverage, sole expected source ownership,
exact placement/relocations/bytes, independent fresh compilation and whole-ROM
equality. Ordinary matches add no review gate; structural/tooling work retains its
required checks. Record accepted waves on main; no push is assigned.

Keep both private roots plus the shared work root under **12 GiB combined**,
reserving 2 GiB per simultaneous native operation (retained data at most 8 GiB
before two checks). Obey existing free-space admission. Keep best/latest completed
bulk comparisons and useful source/evidence; prune superseded bulk output only
after its process exits and useful source is preserved. No new quota service.

Preserve each accepted wave's complete final proof/source identities under
`build/accepted-builds/descriptor-d1/` or `descriptor-d2/`, hash-check copies, then
remove that wave's private scratch. At closeout, remove obsolete shared comparison
and cache trees after all users exit; retain live CURRENT, its fresh proof and the
reusable baseline. Protect prior E1/library archives, tools, ROMs and editor work.
Follow [safe cleanup](../WORKFLOW.md#safe-filesystem-cleanup): complete no-follow
ancestor/root/descendant census and pre/post tool authentication; links never extend
deletion authority. Record cleanup and retained size in the existing cursor.
