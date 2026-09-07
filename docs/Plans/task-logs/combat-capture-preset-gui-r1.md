# Combat capture preset GUI r1

Status: completed for independent review; all writes released. Initial phase was read-only inspection while awaiting the Director sole-writer release. Claim created atomically before other writes; production edits/tests began only after that release. GUI/runtime operation remained prohibited throughout.

## Read-only implementation plan

Add combat-selector-v1 with only func_00201778, exact full 32-byte signature and function size, all-invocation focused entry/return, no pointer or stack guesses, and an additional 32-byte generic execution-state watch derived from resolved placements. The latter is explicitly unqualified without matching signature/invocation evidence; it cannot imply a caller/origin name. Preserve cutscene profile serialization and defaults for existing programmatic callers.

Carry preset definition into session metadata and recorder settings through the existing profile resolution/revalidation boundary. Add a durable in-window controller selection and a readonly GUI dropdown for the next focused capture, default Combat in the GUI while preserving legacy controller focused=True behavior. Distinguish ordinary coverage from selected-preset start. Snapshot selection before async dispatch; changing it never mutates an existing capture.

Focused tests will cover both choices and actual distinct watch settings, metadata, placement/signature rejection, old-profile compatibility, active-state preservation and dropdown event persistence using a headless fake UI binding (no GUI launch). Read-only current knowledge resolution may verify retained placement if needed, after status/verify; no runtime/database mutation.

Tooling changes require independent review. No structural boundaries, source ownership, build/verification implementation or normalization change is planned; full-ROM structural audit is inapplicable. Any changed API file invalidates the old ignored adapter API manifest; preserve it and document reviewed production preset as replacement only after fresh acceptance.

## Completed result

Status: complete for independent tooling review; review pending. All production/report writes released at terminal handoff. No GUI or runtime was launched by this assignment.

The claim was created at 2026-09-07T02:06:11.2142545Z for COMBAT-CAPTURE-PRESET-GUI-20260907-01, /root/combat_discovery on local, Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Initial release 7f0793f authorized only inspection and task-local writes. Production edits/tests began only after explicit Director writer release, with W5 frozen intake 43d0821. Inactive src/lib/combat_pose_metadata.c and all matching sources/configuration remained untouched.

### Effective preset and GUI selection

Added `combat-selector-v1`: one uninterpreted selector target, z64 0x00201778..0x00201798, full signature 3C03801D8C6306880004104000441021004510210062182103E0000890620000, all-invocation entry/return, zero stack words and no pointer guesses. Profile resolution uses current exact retained placements rather than a hardcoded runtime address. Additional generic 32-byte instruction-context watches are derived from those same placements and remain separate from signature-qualified focused events and ordinary coverage. Invalid signatures/sizes and incomplete source/destination placements fail closed; duplicate retained placements deduplicate, distinct complete placements remain distinct candidates.

The readonly GUI dropdown defaults to Combat for the next selected-preset start. Its event writes the controller's durable in-window selection; rebuilding the binding restores that selection. The GUI snapshots the chosen ID before asynchronous dispatch. Selecting another preset changes no current session, runtime hook or database. Start Coverage Only remains ordinary coverage; Start Selected Preset dispatches the selected profile. Cutscene Studio remains available, with unchanged legacy serialization, default programmatic focused=True behavior, pointer targets, and unbounded manual duration. Selection persists within this GUI instance, not across process restarts.

The existing session preparation/worker revalidation boundary serializes and compares the complete selected profile, including instruction watches and budget. Actual recorder settings install both Combat watch types. Query metadata retains focused profile/target IDs and manifests retain explicit generic watch definitions; a displayed profile name is not substituted for effective configuration.

### Duration and lifecycle

Combat automatically exits its observation loop after a 60-second monotonic budget from instrumentation readiness. It uses the recorder's existing should_stop hook, then the existing stop-owned-instrumentation, bounded drain, close and verification lifecycle. Manual stop remains effective. It does not pause gameplay. Startup, bridge operations and shutdown/drain can extend wall-clock duration. Cutscene and ordinary capture still call the original unbounded run path.

Unlike the earlier task-local adapter's first-entry stopping convenience, the GUI preset continues until manual stop or this fixed budget, allowing subsequent instruction context within the bounded window. This is a newly reviewed production behavior; the old adapter review is evidence for the watch method, not automatic acceptance of this integration. Capacity/loss reporting, capture contracts, owned-watch removal and deferred GUI ingestion remain in the existing recorder/session implementation. No new watch protocol, capture schema, mapping acceptance or semantic promotion rule was added.

The GUI and README explicitly show the 60-second behavior. A finite miss is route/window bounded. Generic overlay-slot hits require contemporaneous signature/invocation qualification. Entry or RA alone does not establish a caller or target origin. Focused return precedes jr-ra's delay-slot load of v0 and is not the final returned byte. Caller/target origin needs a connected callsite/delay/actual-target and definition/load chain; behavior naming requires additional result/use evidence. All observations remain live-unreviewed.

### Changes and review scope

Production files: tools/total_resolver/focused_capture.py, capture_gui.py, sessions.py, cli.py, README.md; new tools/total_resolver/tests/test_combat_preset.py. Recorder implementation and bridge source are unchanged. New profile resolution also rejects a destination range shorter than the complete function, preserving the intended generic placement gate rather than accepting partial evidence.

This is tooling/profile/UI integration requiring independent review. docs/AUDIT.md structural triggers do not apply: no baserom identity rule, byte normalization, function boundary, accepted owner, overlay descriptor, compiler/linker/build or matching-verification implementation changed. No ROM build or matching verifier run was performed.

Frozen ignored adapter/preparation packages were not edited. The old adapter API manifest now fails authentication for capture_gui.py, cli.py, focused_capture.py and sessions.py; exact old/new hashes are in stale-api-bindings.json. Do not update that frozen manifest or reuse old approval. The production Combat preset is the proposed replacement route only after this new tooling review is Accepted. Joe's final GUI-launch request remains for a separate post-review Director activation, with no capture authority implied.

### Verification and evidence

Final command (also stored with its resolved Python executable in validation.json):
`python -B -m unittest tools.total_resolver.tests.test_combat_preset tools.total_resolver.tests.test_focused_capture tools.total_resolver.tests.test_capture_gui tools.total_resolver.tests.test_recorder tools.total_resolver.tests.test_sessions tools.total_resolver.tests.test_pj64_client`

44 tests passed in 5.279 seconds. Tests include Combat/cutscene distinct target sets and legacy serialization, exact signature/size rejection, incomplete source and destination rejection, duplicate and relocated placements, actual Combat focused plus generic installation and removal of only owned IDs, budget boundary and unchanged cutscene run path, session metadata, readonly dropdown event persistence/rebinding, invalid profile rejection before session creation, selected IDs reaching create_session, and preservation of an unrelated current session during selection. Existing recorder/client/session lifecycle, rollback, closure and GUI compatibility tests also pass. The budget test uses a deterministic clock (159 below the deadline, 160 at deadline); no wall-clock wait or emulator is involved.

Initial test import exposed a Windows text-encoding error in a new GUI label. The label was changed to plain ASCII; no runtime was contacted. The first 15 focused tests then passed, followed by 43 affected tests. A final destination-range rejection test and check produced the final 44-pass result. git diff --check passed. No failure was silently ignored.

Read-only knowledge status/verify passed before resolving real profiles through SQLite mode=ro and query_only. The selected ledger-19 product resolves Cutscene to 15 placement triggers across its 11 configured targets, no generic instruction watches and no duration cap; Combat resolves one trigger plus one 32-byte generic watch and a 60-second cap. Combat's resolved live range is 0x801BE2E8..0x801BE308. This is retained placement/configuration evidence only, not current residency or execution.

Latest literal capture retrieval supplied by Sol identifies Battle Capture with Field Pause as cutscene-studio-v1 with zero exact selector facts. This contextual miss motivated selectable Combat instrumentation; it is not a dead-code or reachability conclusion. This assignment performed no fresh live capture/query.

Ignored evidence root: build/total-resolver/combat-capture-preset-gui-r1/. tests.txt and validation.json preserve final tests; knowledge-status.txt and knowledge-verify.txt preserve current read-only checks; resolved-profiles.json preserves exact effective profile manifests; stale-api-bindings.json identifies invalidated frozen bindings; artifact-manifest.json hashes completed files and report/claim. UI rendering/interactive appearance was intentionally not tested because GUI launch is prohibited until post-review activation. Headless binding/controller tests establish dropdown state propagation, not visual acceptance.

Evidence grade: verified offline code/configuration/test results, review pending. Falsifiers include a dropdown ID failing to reach actual profile settings, changed cutscene manifests, missing Combat generic hooks, a deadline not ending the observation loop, or a partial placement accepted. Runtime performance, trigger reachability and consumer provenance remain untested. No semantic/product name strengthened.

Protocol deviations: none. Proposed canonical documentation change is the scoped README usage/limits update included here; no other policy changes proposed. No live GUI/runtime/control/watch/capture/session/database mutation, Computer Use, new agent, production build, staging, commit, push, branch or worktree operation occurred. All assigned writes are released to /root for independent review and subsequent separate GUI launch routing.
