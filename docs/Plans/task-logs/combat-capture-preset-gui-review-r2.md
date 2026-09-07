# Combat capture preset GUI review r2

Verdict: **Accepted**.

Result: frozen correction `03063b4646961d2b2794f0eea3c56f83f3efb646` resolves R1 finding F1. Both supported startup modes now install and record the complete configured Combat watch set, remove both owned watches on normal Stop, and clean up an already-installed generic watch if focused installation fails.

Consequence: Director `/root` may freeze this review and launch the GUI with Combat selected under Joe's existing authority. This acceptance does not start or approve a capture and establishes no selector execution, caller origin, or behavior.

Director action: preserve the reviewed seven-path subject and launch only the GUI. Starting a capture remains a separate user action.

## Frozen subject and eligibility

The correction subject is `03063b4646961d2b2794f0eea3c56f83f3efb646` against rejected combined predecessor `986ce568024376bbb703e6b49a3671a8c672606a`.

The ready review assignment is `964d506accf58106b401280a374ccc3c8bd4b901`. The R3 report SHA-256 matched `54591FCBEDF44FFF22DBB3156DE5D1C856D53B974286CE9C9722D6E464B9C0C2`. Its artifact-manifest SHA-256 matched `77E7159A603E9A4414BF762F1771E0CAFD11A9D3D0A7785B23D3C002007ACB91`.

The frozen R1 review report retained SHA-256 `9315A722FE657A4AAF6A892492881BC151ACD51D6452525D29202E68E21F9782`. The worker completed R3 and released all writes.

Only `tools/total_resolver/recorder.py` and `tools/total_resolver/tests/test_combat_preset.py` changed. The GUI, profile, sessions, CLI, and README paths retained their reviewed R2 identities. All seven paths remained equal to `03063b4` through inspected HEAD `77ad607824158ffaa437629d47fc0e0289dac63a`.

The assigned claim, report, and ignored root were absent at activation. I created the complete permanent claim first at `2026-09-07T02:47:37.483Z`. Its SHA-256 is `761D333CBC91E9A47756E60E99E490CCEC7725BB026DA8A33CE0FCE9838A3E45`.

The review remained eligible under the `NORMAL` inventory profile. I produced neither correction and found no overlapping owner.

## Proportional review method

I reused R1's unaffected review evidence after recomputing the R1 report identity and all seven R3 tooling identities.

I inspected the complete two-file correction. The existing generic installation loop is now one `_install_configured_watches()` helper. Loaded-ROM startup calls it in the same location as before. Before-ROM startup calls it after ROM identity, baseline, capture, input, and DMA readiness checks.

The before-ROM adoption phase now routes any native-definition, configured-watch, or startup-drain failure through the existing rollback path. It resets recorder started state and removes recorder-owned watch, capture, and DMA hooks.

I reran the frozen R1 falsifier's isolated producers against fresh reviewer fixtures. I also added independent normal-stop and partial-focused-install failure checks for both startup modes.

Four narrow production regressions passed:

`python -B -m unittest tools.total_resolver.tests.test_combat_preset.CombatPresetTests.test_before_rom_installs_records_and_removes_both_combat_watches tools.total_resolver.tests.test_combat_preset.CombatPresetTests.test_both_start_modes_roll_back_generic_watch_when_focused_install_fails tools.total_resolver.tests.test_combat_preset.CombatPresetTests.test_actual_recorder_installs_both_combat_watches_and_removes_only_owned tools.total_resolver.tests.test_combat_preset.CombatPresetTests.test_combat_continues_past_old_budget_until_manual_stop`

All four passed in 1.077 seconds. The worker's hashed final evidence records 46 passing affected tests. The two-file `git diff --check` passed.

The first reviewer checker invocation failed before exercising subject code because its nested disposable directories did not yet exist. I corrected only the reviewer-owned harness; the next clean fixture passed. No frozen or production file changed.

## Adversarial-test admissibility

The dual-start and partial-failure checks were **Acceptance tests**.

1. Assigned claim: both supported startup modes install, record, own, and remove every configured generic and focused watch.
2. Supported producer: the resolved Combat profile enters `RecorderSettings`, then `Pj64CaptureRecorder` starts with a loaded ROM or adopts the bridge's before-ROM capture.
3. Ordinary sequence: establish the baseline, install configured generic then focused watches, capture until manual Stop, remove owned IDs, drain, and close. A startup failure invokes recorder rollback.
4. Material consequence: omitting or leaking a watch would recreate F1 or leave instrumentation active after a rejected start.
5. Smallest falsifier: one generic and one focused watch through each start mode, plus failure of the focused install after the generic install succeeds.
6. Evidence grade: verified offline implementation behavior only.
7. Threat model: repository fake clients and temporary capture stores under the reviewer-owned ignored root. No socket, GUI, runtime, existing database, or user state was touched.

The reused manual-stop check remained an **Acceptance test** at its earlier boundary: four active polls crossed 401 simulated seconds and stopped only after the store's explicit request.

## Results

There are no blocking or nonblocking correction findings.

| Check | Loaded ROM | Before ROM |
|---|---:|---:|
| Generic watch installed | yes | yes |
| Focused watch installed | yes | yes |
| Both definitions recorded | yes | yes |
| Normal Stop removed IDs | `[2, 1]` | `[2, 1]` |
| Both removal sequences recorded | yes | yes |
| Focused-install failure removed generic ID | yes | yes |
| Failure disabled capture and DMA | yes | yes |
| Failure left recorder stopped | yes | yes |

The correction is generic. It does not branch on Combat, alter addresses, weaken ROM/baseline qualification, or change watch-ID validation.

Watch capacity, queue/loss accounting, reverse-order ownership cleanup, continuity behavior, and bounded cleanup waits remain on the existing recorder path.

Joe's no-time-limit requirement remains satisfied. The unchanged session worker calls `recorder.run()` without `maximum_polls` or `should_stop`; no deadline or first-hit condition was added. The independent manual-stop fixture again ran past the former 60-second boundary.

R1's unaffected findings remain accepted: the visible readonly dropdown maps to the actual validated profile ID; selection is frozen before background dispatch; ordinary and selected-preset capture stay distinct; Combat retains exact signature/size/placement qualification and separate raw instruction context; Cutscene and historical captures remain compatible; metadata/query IDs and evidence limits remain intact.

## Evidence and limits

Reviewer evidence is under `build/total-resolver/combat-capture-preset-gui-review-r2/`.

- `review_correction.py` SHA-256: `55105F47771B0D92A5EAE5403F5225BFEE5722C0A8A066BC94094143F35616DD`
- `review-correction.json` SHA-256: `693E618EF31DA36E7B66C5466C3AC04E1C71F63727529BBACE83370333B3F99B`
- `focused-tests.txt` SHA-256: `47AAC7A8E3FECFE667BF924C63376C8081321F0FC8B56F007EBB681754FB46A6`

Visual rendering, live runtime cost, current residency, selector reachability, caller origin, and consumer provenance remain untested. Generic hits remain raw leads unless connected to signature-qualified invocation evidence. Focused return remains before the `jr ra` delay-slot result load.

No GUI, runtime, capture, live watch, existing session/database, ROM build, matching review, production correction, staging, commit, push, branch, worktree, or agent operation occurred.

## Exact route

Director `/root` on host `local` must:

1. Freeze this Accepted report and its ignored evidence package.
2. Record F1 as resolved by exact subject `03063b4`.
3. Preserve the seven reviewed tooling identities and the explicit no-duration behavior.
4. Launch the Capture GUI with Combat selected under Joe's existing request.
5. Do not start a capture on Joe's behalf without separate authority.
6. Keep all selector execution, caller/target origin, and behavior claims open until qualifying runtime evidence is captured and reviewed.

The reviewer releases the claim, report, and ignored evidence writes after the terminal collaboration handoff.
