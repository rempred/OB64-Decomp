# Combat capture preset GUI r2

Status: completed for independent tooling review; review pending. All assigned writes released. No GUI or runtime launched.

## Assignment and frozen predecessor

Launch COMBAT-CAPTURE-PRESET-GUI-20260907-02, ready a50a6ff, worker /root/combat_discovery on local, Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Complete claim created atomically with CreateNew at 2026-09-07T02:24:50.9337485Z before other writes. Sole production tooling release follows W5 release 43d0821 and frozen R1 d9e80f0. Final inspected HEAD 1fc76a399972f7c38ea633a465db89277d5f191e. Director-owned prompt/status changes were preserved.

Joe explicitly directed: "Do not have a capture time limit". This correction removes R1's unaccepted duration behavior; it requires no further user confirmation. R1 report SHA256 9CA59C9773763CDDDA85BB4F3024EE85DADE5D6DC076CF775AFFA87563250FF1 and ignored manifest SHA256 1F9B589598DC2957C98DB83840B76FC8A1D4C6F3E490C01FD670F4070E77D2FA were rechecked unchanged. All other frozen adapter/preparation/research records remain untouched.

## Complete combined result

The GUI offers Combat: selector investigation and Cutscene Studio in a readonly dropdown for the next focused capture. GUI default is Combat. Binding writes durable controller selection, restores it on rebinding and snapshots it before async dispatch. Selection does not change an existing session. Start Coverage Only preserves ordinary coverage; Start Selected Preset sends the actual selected profile ID into session preparation and worker resolution. Legacy controller focused=True defaults to cutscene unless a selection is explicitly changed; CLI supports explicit profile IDs.

Combat `combat-selector-v1` resolves the reviewed 32-byte func_00201778 at z64 0x00201778..0x00201798 through complete retained placements. Full exact signature is 3C03801D8C6306880004104000441021004510210062182103E0000890620000. It captures all-invocation focused entry/return, zero stack words and no assumed argument pointers, plus one separate generic 32-byte instruction-context watch per distinct qualified retained range. Duplicate ranges deduplicate; partial source/destination, wrong size/signature and absent targets reject. This keeps normal coverage, signature-qualified invocation evidence and raw generic instruction context distinct.

Session metadata/manifests contain actual profile IDs, targets and instruction watch definitions. The worker revalidates serialized profile equality and passes both watch sets to RecorderSettings. Cutscene's targets, serialization, programmatic compatibility and manual duration remain unchanged. R1's verified read-only ledger-19 resolution (historical evidence only) found 15 cutscene placement triggers/11 targets and one Combat focused plus one generic watch at live 0x801BE2E8..0x801BE308. R2 did not query or mutate any live runtime or selected database.

### Manual duration correction

Removed maximum_seconds from the profile dataclass, maximumSeconds/budget from serialized manifests and the Combat duration assignment. Removed _run_capture_window and its time.monotonic deadline predicate. Session worker now calls original `recorder.run()` directly, with no maximum polls or should_stop callback. No first-hit stopping predicate exists in this production route. Activity, including selector hits, does not end capture. Capture continues until manual Stop, explicit shutdown or an existing terminal error.

Updated GUI label/help and README to say manual Stop with no time limit. There is no duration setting. Existing RPC/startup waits, bounded cleanup/drain safety timeouts, capacity/loss checks and recorder-owned watch cleanup remain unchanged. Manual stop follows the existing instrumentation stop/drain/close/verify path and never pauses gameplay. Deferred GUI ingestion remains unchanged. No timer is replaced by a hit count or another automatic duration gate.

### Evidence limits

A signature-qualified entry establishes an invocation, not caller/target origin or behavior. Generic hits at reused overlay addresses remain unqualified without a connected signature/invocation chain. RA alone cannot establish a tail caller. Caller/target origin needs connected callsite/delay/actual-target and definition/load evidence. The focused return event precedes jr-ra's delay-slot v0 load; it is not the final returned byte. Stronger behavior naming needs downstream result/use evidence. A miss describes only the observed route and manual start-to-stop window. All new observations remain live-unreviewed.

## Changes and review scope

R2 edits five paths: tools/total_resolver/focused_capture.py, capture_gui.py, sessions.py, README.md and tests/test_combat_preset.py. The combined R1+R2 review also includes the retained R1 cli.py help change, making six production paths. Recorder implementation, bridge APIs, capture/query schemas and matching foundations are unchanged. Inactive W5 src/lib/combat_pose_metadata.c, all matching source/ASM, configuration and verification tooling were preserved.

Independent tooling review is required for the combined preset/GUI integration. No docs/AUDIT.md structural trigger applies: no normalization, baserom contract, function boundary, owner, overlay descriptor, compiler/linker/build or matching verifier changed. No full ROM build was run.

The frozen ignored selector adapter's API authentication remains stale for capture_gui.py, cli.py, focused_capture.py and sessions.py; current versus frozen hashes are recorded. Do not edit its frozen manifest or inherit its earlier Accepted verdict for this changed code. The production preset becomes the replacement route only after fresh independent acceptance. Joe-authorized GUI launch belongs to a separate post-review assignment; no capture permission is inferred.

## Verification

Eight focused tests passed initially. Final affected command:
`python -B -m unittest tools.total_resolver.tests.test_combat_preset tools.total_resolver.tests.test_focused_capture tools.total_resolver.tests.test_capture_gui tools.total_resolver.tests.test_recorder tools.total_resolver.tests.test_sessions tools.total_resolver.tests.test_pj64_client`

44 tests passed in 4.826 seconds. The corrected lifecycle test advances four nonempty activity polls across 400 simulated seconds; only the fourth poll requests the store's explicit manual stop, and the original recorder loop stops on that request. No runtime client commands occur. Metadata tests reject presence of maximumSeconds/budget; both preset choices, exact signatures/placements, actual dual Combat watch installation, owned removal, GUI selection/rebinding, unrelated current-session preservation and selected ID propagation remain covered. Existing recorder/session/client closure, rollback, error and compatibility tests pass.

git diff --check passed. Search across the four production modules and README found no maximum_seconds, maximumSeconds, 60-second preset labels, _run_capture_window or should_stop injection (rg exit 1 means no matches). Existing recorder optional should_stop API remains intact for unrelated callers, but this preset route does not supply it. No test failed during R2. A read-only parent Git diff initially used canonical 43d0821 in the parent repository and failed as an unknown revision; the query was corrected to the actual parent reference and did not affect code or evidence.

Visual/interactive GUI inspection remains deferred by assignment until accepted review and separate launch. Headless selector/controller tests prove state propagation and preserved selection, not final visual rendering. No new capture, selector trigger or consumer-provenance result is claimed.

## Evidence index, limits and handoff

Ignored root build/total-resolver/combat-capture-preset-gui-r2/: tests.txt; validation.json (resolved executable, command, results and lifecycle facts); stale-api-bindings.json; combined-tooling.patch (all six paths versus 43d0821); artifact-manifest.json (exact current source, report, claim and evidence hashes). R1 ignored real-profile outputs remain frozen historical references, including their now-rejected duration field; they do not describe R2 duration.

Evidence grade: verified offline implementation/test observations, independent review pending. Falsifiers include selected IDs not reaching installed watches, a capture deadline or first-hit stop remaining in the production route, changed Cutscene behavior, or partial placement accepted. Runtime cost/reachability and semantic provenance remain untested.

Protocol deviations: none. Documentation proposal: included scoped README manual-duration update only. No GUI/runtime launch, control, live watches/capture, selected database/session mutation, source matching/build, Computer Use, agents, staging, commits, push, branches or worktrees. All production/report writes released to /root for independent review; separate authorized GUI launch follows acceptance.
