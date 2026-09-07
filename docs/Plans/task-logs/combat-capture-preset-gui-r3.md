# Combat capture preset GUI r3

Status: completed correction for focused independent re-review; review pending. All assigned writes released. No GUI or runtime launched.

## Authority and scope

Launch COMBAT-CAPTURE-PRESET-GUI-20260907-03, ready 4eca278, worker /root/combat_discovery on local, Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Fresh complete claim created atomically with CreateNew before writes. Director released sole production tooling ownership after reviewer completion; W5 remained paused. Frozen R2 986ce56 and review 2d94fe8 remain unchanged.

Review F1 established that before-ROM startup advertised the generic instruction watch but installed only the focused watch. This task corrects only that discrepancy and its failure cleanup. Joe's manual-duration requirement remains intact: no deadline, maximum-poll budget or first-hit stop.

## Correction

Extracted the existing generic-install loop and following focused installation into `_install_configured_watches()`. Both loaded-ROM `_start_instrumentation()` and before-ROM `await_cold_boot_start()` now call this same helper after baseline readiness. There is no Combat-specific branch or guessed address. Both routes install, record and own the actual configured generic and focused watch sets.

The before-ROM native-definition/configured-watch/startup-drain phase now catches failure and uses the existing `_rollback_instrumentation_start()` path, clearing started state as loaded-ROM startup already does. Partial generic installation is therefore removed if subsequent focused installation fails. Existing watch-ID validation, failure counters, recorder-owned ID removal, queue/loss accounting and cleanup bounds are preserved. No earlier ROM/baseline gate is weakened.

Only production `tools/total_resolver/recorder.py` and `tools/total_resolver/tests/test_combat_preset.py` changed in R3. GUI, profiles, session duration path, CLI and README remain byte-identical to R2. No matching sources, inactive W5 candidate, structural configuration, build/verification tool or database changed.

## Offline verification

Reused the exact frozen reviewer falsifier by importing its functions without invoking its main routine or writing its root. Its `loaded_start`, `cold_start`, `manual_stop` and `source_contracts` ran against fresh fixtures in this task's ignored root. Both start modes now issue `watch` and `focused watch` and record both review-generic-instructions and review-focused-entry. The manual-stop fixture still processes four active polls across 401 simulated seconds and stops only after the explicit request. Source contracts retain one argument-free recorder.run call and no removed-duration tokens.

New production regressions resolve the actual Combat profile against the offline fixture, arm before ROM, assert no premature generic install, then prove both configured definitions exist after baseline adoption. Normal stop removes only the owned IDs in reverse order and records removed_sequence for both definitions. A dual-mode failure regression rejects focused installation after the generic watch is installed and verifies generic removal, stopped capture/DMA hooks and started=false in both modes.

Final command:
`python -B -m unittest tools.total_resolver.tests.test_combat_preset tools.total_resolver.tests.test_focused_capture tools.total_resolver.tests.test_capture_gui tools.total_resolver.tests.test_recorder tools.total_resolver.tests.test_sessions tools.total_resolver.tests.test_pj64_client`

46 tests passed in 5.509 seconds. Initial 20 focused tests also passed. git diff --check passed. No test failure during R3. The reviewer falsifier intentionally had its old expected missing-watch assertion in main; this task did not run that main or rewrite it. Instead it invoked the unchanged isolated producers and asserted the corrected required result in its own evidence.

## Preserved review results and limits

Preserve the review's unaffected findings: durable dropdown selection and start snapshot, real preset ID/settings/metadata propagation, exact signature and complete-placement qualification, Cutscene compatibility, manual duration, ordinary coverage distinction and deferred ingestion. Generic hits remain raw leads; entry/RA alone does not prove caller or target origin. Focused return remains before the jr-ra delay-slot result load. No semantic conclusion or runtime observation follows from offline success.

This narrow recorder startup correction requires focused tooling re-review, not a ROM build or structural audit: no structural ownership, mapping contract, compiler/linker or matching verifier changed. GUI rendering, runtime cost/reachability and consumer provenance remain untested. User-authorized GUI launch waits for Accepted re-review and separate launch assignment.

The frozen task-local adapter stays unchanged and unauthenticated against current production APIs. R3 adds recorder.py to the already stale GUI/CLI/focused/session bindings; stale-api-bindings.json records exact frozen/current hashes. Do not edit the old manifest or inherit its acceptance.

## Evidence and handoff

Ignored root: build/total-resolver/combat-capture-preset-gui-r3/. reviewer-falsifier-rerun.json preserves dual-mode corrected output/manual stop/source contracts; tests.txt and validation.json preserve final test command/results; predecessor-identities.json authenticates frozen review/R1/R2 identities; stale-api-bindings.json records current incompatibility; correction.patch contains this two-file change; artifact-manifest.json hashes the complete current seven-path tooling subject, report/claim and evidence.

Evidence grade: verified offline correction/test observations, review pending. Falsifier: either supported startup advertises a configured watch without installation/recording/removal, partial startup leaks owned hooks, or manual capture stops automatically. No live sessions, selected databases, runtime or GUI were contacted or mutated. Test databases were isolated temporary fixtures.

Protocol deviations: none. Canonical documentation changes proposed: none; existing preset documentation is now true for both supported modes. No Computer Use, new agents, runtime control/watch/capture, production build, staging, commits, push, branches or worktrees. All production/report writes released to /root for proportional focused re-review, then separately authorized GUI launch.
