# Combat capture preset GUI review r1

Verdict: **Revision required**.

Result: the combined Combat preset and GUI integration satisfies the no-time-limit requirement and the ordinary loaded-ROM route, but the before-ROM route omits the Combat generic instruction-context watch while advertising it in the selected profile metadata.

Consequence: Director `/root` must not treat the GUI preset as accepted or launch it as the finished reviewed result. A user who selects Combat together with **Arm before manually loading the ROM** would receive only the signature-qualified focused entry/return watch, not the requested 32-byte generic instruction context.

Director action: route one narrow production correction, preserve the unaffected evidence below, freeze a new combined subject, and return only the corrected cold-boot watch installation/ownership path for focused re-review.

## Frozen subject and eligibility

The reviewed combined implementation is canonical commit `986ce568024376bbb703e6b49a3671a8c672606a`, including R1 `d9e80f05b0f57aa5f7901cd43af6ba9fdebb3ab6`. The pre-feature comparison is `43d0821946b9db79a23f625a628ecb368370b3f0`.

The ready assignment is canonical commit `096b9d708cf6e58c5e88e673b9c7ba416c0dd996`. Its launch ID, assignment revision, receiving task, Director, native task, and local host matched activation.

The R2 report SHA-256 matched `9DB412579C2BE3C20295277717BA39DA6477C0249D0CF8B63066D6C8CB2DDC2A`. The R2 `artifact-manifest.json` SHA-256 matched `F87CF570D8D52DF0AC9A1AC30E97A2BE6B3F3D64C6527FF15EAEC93E6946E5CF`.

The frozen R1 report and manifest also retained their stated hashes, `9CA59C9773763CDDDA85BB4F3024EE85DADE5D6DC076CF775AFFA87563250FF1` and `1F9B589598DC2957C98DB83840B76FC8A1D4C6F3E490C01FD670F4070E77D2FA`. Their 60-second behavior is superseded historical evidence.

The worker reported completion and released all writes. Matching remained paused for this tooling review. The six production paths were unchanged from the frozen subject through inspected HEAD `5c76c14a86ade98f1c20d04d69f40e40518836b4`.

The assigned claim, report, and ignored root were absent at activation. I created the complete permanent claim first, at `2026-09-07T02:30:59.639Z`. Its SHA-256 is `18BA173F82AB9A9DFBB2C36A4BA15396A679A7256E30BEBE5F59E88DB99FDB76`.

The review remained eligible under the `NORMAL` inventory profile. I produced neither worker result and found no overlapping owner of the frozen production subject or reviewer paths.

## Scope and claims reviewed

I reviewed the complete six-path change from `43d0821` through `986ce56`:

- `tools/total_resolver/focused_capture.py`
- `tools/total_resolver/capture_gui.py`
- `tools/total_resolver/sessions.py`
- `tools/total_resolver/cli.py`
- `tools/total_resolver/README.md`
- `tools/total_resolver/tests/test_combat_preset.py`

I checked the actual dependency paths in the unchanged recorder, capture store, derived product, ingestion, and focused-query code only where needed to verify the changed wiring.

The material claims were:

- the displayed Combat or Cutscene choice reaches the profile resolver, session metadata, worker revalidation, recorder settings, installed watches, stored definitions, and query metadata;
- selection is validated, remains the next-start choice, and is frozen before asynchronous GUI dispatch;
- ordinary coverage remains separate from selected-preset capture and an existing capture is not changed;
- Combat resolves only the reviewed selector identity and qualified retained ranges, preserving ownership, loss, capacity, and semantic limits;
- Cutscene and historical captures remain compatible; and
- Combat has no duration or first-hit stop and continues until manual Stop, explicit shutdown, or an existing terminal error.

## Review method

I read the current required repository and Total Resolver guides, the completed R1/R2 assignments and reports, the final six-path diff, and the relevant capture/profile documentation.

I recomputed the two assigned R2 evidence hashes and every frozen six-path source hash. The current files matched the R2 artifact manifest and the frozen commit.

I traced both GUI start buttons through `CaptureWorkflowController.start`, `create_session`, serialized profile metadata, worker re-resolution, `RecorderSettings`, and the recorder's loaded-ROM and before-ROM startup paths.

The worker's affected offline command passed all 44 tests:

`python -B -m unittest tools.total_resolver.tests.test_combat_preset tools.total_resolver.tests.test_focused_capture tools.total_resolver.tests.test_capture_gui tools.total_resolver.tests.test_recorder tools.total_resolver.tests.test_sessions tools.total_resolver.tests.test_pj64_client`

`git diff --check 43d0821..986ce56` passed.

I added one reviewer-owned offline falsifier using the repository fake clients and real `CaptureStore`, `RecorderSettings`, and `Pj64CaptureRecorder`. It sent the same one generic and one focused watch set through loaded-ROM and before-ROM starts.

The loaded-ROM route issued both `watch` and `focused watch` and recorded both definitions. The before-ROM route issued only `focused watch` and recorded only the focused definition.

The same checker confirmed that `run_session_worker` calls `recorder.run()` with no arguments or keywords, the removed duration tokens are absent from the production route, and a recorder loop continued through 401 simulated seconds until the fixture requested manual stop.

No GUI, socket, emulator, capture, existing session, selected database, ROM build, or user state was touched.

## Adversarial-test admissibility

The dual-start falsifier was an **Acceptance test**.

1. Assigned claim: either supported start mode installs the complete selected Combat watch set described by the profile and session metadata.
2. Supported producer: `run_session_worker` creates `RecorderSettings` from the resolved profile, then the existing recorder starts through loaded-ROM or before-ROM capture.
3. Ordinary sequence: select Combat, optionally arm before ROM, prepare the session, start or arm the recorder, obtain the baseline, install owned watches, capture until Stop, and remove owned watches.
4. Material consequence: omitting one watch changes the evidence captured while the manifest still claims that watch was selected.
5. Smallest falsifier: one generic `WatchSpec` and one signature-qualified `ResolvedFocusedWatch` passed through both recorder start modes with the supported fake clients.
6. Evidence grade: verified offline implementation behavior. It establishes no real runtime reachability, selector execution, caller origin, or game semantics.
7. Threat model: all writes stayed in a temporary directory under the reviewer-owned ignored root. The clients made no socket connection. Production source and existing databases remained read-only.

The long-running manual-stop fixture was also an **Acceptance test**. Its smallest falsifier was four active polls spanning 401 simulated seconds, with the store requesting Stop only on the fourth. It confirms the production recorder loop has no inherited 60-second or first-hit exit predicate; it does not measure real runtime timing.

## Finding

### F1 — before-ROM Combat capture omits the generic instruction-context watch

Severity: **blocking**.

`ResolvedFocusedProfile.to_dict()` advertises Combat's `instructionContextWatches`. `run_session_worker` passes those watches into `RecorderSettings.watches` and passes the signature-qualified targets into `RecorderSettings.focused_watches`.

The ordinary loaded-ROM startup iterates `settings.watches`, installs and records each generic watch, then calls `_install_focused_watches()`.

The before-ROM path reaches `await_cold_boot_start()` after the ROM and baseline are ready. That path records the native definitions and calls only `_install_focused_watches()`. It never installs or records `settings.watches`.

The independent fixture reproduced the mismatch:

| Start mode | Generic bridge watch | Focused bridge watch | Stored Combat definitions |
|---|---:|---:|---:|
| Loaded ROM | yes | yes | 2 |
| Arm before ROM | **no** | yes | **1** |

This is not a display-only issue. The GUI exposes the before-ROM checkbox alongside the selected Combat preset, and the session's frozen profile metadata still contains the missing generic watch. The resulting capture would be materially weaker than the user-visible selection and manifest state promise.

The worker tests cover before-ROM capture without a generic `settings.watches` entry and Combat watch installation only through the loaded-ROM start. Their 44-test pass therefore does not exercise this combination.

## Unaffected review results

These results passed and should be reused during the narrow correction review.

### No capture time limit

R2 removed `maximum_seconds`, `maximumSeconds`, the capture-policy budget, and `_run_capture_window`. The worker calls `recorder.run()` directly with no `maximum_polls` or `should_stop`.

No focused hit is consulted as a stop condition. The independent recorder fixture passed four active polls over 401 simulated seconds and stopped only after `CaptureStore.request_stop()`.

The remaining bounded waits are startup/RPC, baseline readiness, Stop response, and drain/cleanup safety bounds. They do not impose a capture duration.

### GUI choice and per-start freezing

The GUI explicitly initializes the controller to Combat before binding the readonly dropdown. The binding maps the displayed label back to the validated profile ID.

The selected ID is copied into a local variable on the GUI thread before asynchronous dispatch. The controller passes that exact ID to `create_session`. The selector is disabled while an operation is in flight.

`Start Coverage Only` passes no focused profile. `Start Selected Preset` passes the frozen selection. Changing the dropdown updates only controller state for the next start and does not mutate an existing session.

The programmatic controller default remains Cutscene for legacy `focused=True` callers, while the GUI default is Combat as requested.

### Profile qualification and evidence limits

Combat contains one target at z64 `0x00201778..0x00201798`, the complete 32-byte signature `3C03801D8C6306880004104000441021004510210062182103E0000890620000`, all-invocation sampling, no pointer snapshots, and zero stack words.

Wrong profile IDs, signatures, sizes, incomplete source placements, incomplete destination placements, and out-of-RDRAM target ranges fail closed. Duplicate identical placement rows deduplicate. Distinct complete retained ranges become separate explicit candidates; the focused watch still performs exact signature qualification, and generic events remain described as unqualified raw context.

The recorder owns the added bridge IDs and removes only those IDs in reverse installation order. Existing queue limits, dropped-event accounting, continuity handling, and deferred ingestion remain in the ordinary recorder contract.

Focused event packets retain profile and target IDs through derived session products, ingestion, and focused queries. Generic instruction context remains separately identified through its watch definition and frozen profile manifest.

A signature-qualified entry proves only an invocation at a qualified range. Generic hits at a reused range do not prove selector identity without the connected signature/invocation evidence. Entry or `ra` alone does not prove caller or target origin. The focused return precedes the `jr ra` delay-slot load of `v0`.

### Cutscene and historical compatibility

Cutscene keeps its existing profile ID, eleven target definitions, serialization shape, no instruction-context watches, and unbounded manual run behavior.

Existing capture schemas and stored historical manifests are not rewritten. The new metadata is additive for newly selected Combat captures.

The frozen task-local adapter remains immutable and its API authentication is correctly reported stale for the four changed API files. Its earlier Accepted verdict does not authenticate this production integration.

## Evidence and limits

Reviewer evidence is under `build/total-resolver/combat-capture-preset-gui-review-r1/`.

- `review_checks.py` SHA-256: `301B3EE7E646D693AA9FCD1701A35631C66BD58F7975624EA10D6208C04C3CAC`
- `review-checks.json` SHA-256: `95FECF81AA84137BC0FEA15B154C9BB66757E3341F808345E9798A0DE36F7C69`
- `affected-tests.txt` SHA-256: `F0A6A18BACF41AA8A93D669C313DAC6E05BA4EF465EB01CD1C25284660DE9175`

Visual rendering and interactive Tk behavior remain untested by assignment. Runtime cost, current residency, selector reachability, and consumer provenance remain untested. No capture result or semantic promotion follows from this review.

## Exact next route

Director `/root` on host `local` must:

1. Record this frozen **Revision required** verdict and keep GUI launch pending.
2. Route a narrow correction that installs and records `RecorderSettings.watches` after before-ROM baseline readiness, with the same ownership, rollback, and cleanup behavior as loaded-ROM startup.
3. Add a regression using the Combat profile with `before_rom=True` that proves both the generic and signature-qualified watches are installed, recorded, and removed.
4. Preserve the accepted no-duration behavior, GUI selection snapshot, Cutscene compatibility, qualification rules, metadata, evidence limits, and all existing RPC/cleanup bounds.
5. Freeze the corrected combined subject and its exact evidence identities.
6. Reuse every unaffected result in this report and request a proportional focused re-review of the correction and both startup modes.
7. Launch the GUI with Combat selected only after that corrected result is Accepted.
8. Treat launch as GUI launch authority only; it does not authorize starting a capture or claiming selector execution, caller origin, or behavior.

The reviewer releases the claim, report, and ignored evidence writes after the terminal collaboration handoff.
