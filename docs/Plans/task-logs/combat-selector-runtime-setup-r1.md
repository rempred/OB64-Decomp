# Combat selector runtime setup r1

Status: blocked/incomplete setup; Joe took over. All runtime ownership and assigned writes released. No further runtime calls after Director relayed Joe's "I'll handle it".

## Assignment and scope

Launch COMBAT-SELECTOR-RUNTIME-SETUP-20260907-01, ready release 49198e4, worker /root/combat_discovery, local; Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Claim created atomically with FileMode.CreateNew at 2026-09-07T01:44:49.8158816Z, before other writes or actions. Authorized supported startup/open-ROM/load-prepared-copy/pause setup only; capture remained separately unapproved. Final Director instruction narrowed remaining work to documentation and handoff following user takeover.

## Actual actions and last known state

1. Read assignment, repository/parent guides and worker workflow, Total Resolver guide/capture material, debugger/live-watch SOP, Accepted observer review 19049cd, frozen preparation 9323e90 and working-copy result 2686971.
2. Source and working-copy SHA-256 both matched 464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583. Working copy is parent Test Savestates/combat-selector-explore-20260907-01/Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip. Master ROM normalized SHA-256 matched 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. All 48 frozen adapter API identities authenticated. No inputs were modified.
3. Doctor, knowledge status and knowledge verify passed. Latest session was closed with workerAlive false. Initial read-only process/port inventory found no Project64 process or listener on 64656. Health-before failed connection refused.
4. First task-local launcher guard asserted that controller.session_id must be null and stopped before launch. Source inspection showed active_session_id reads the retained latest-session pointer, not live ownership. Actual status established workerState closed and workerAlive false. The corrected task-local guard used those actual status fields; no shared code or session record changed.
5. Called existing CaptureWorkflowController.launch_project64 with port 64656 and task-local CaptureGuiLog. It authenticated the configured binary and deployed bridge, launched visibly through its ordinary Popen behavior, and returned PID 10184. Binary C:\Users\Joe\Projects\project64\Bin\Win32\Release_totalresolver_64656\Project64-TR-CallAware.exe, SHA-256 363C028EEF14AF1B754997675F8C1353A0D6F91C3957699990794A668444A212. Deployed script SHA-256 7F87A8EA02DE7DA566AC201C32BFEC4FCCC7FA114F91C44D6E88FCFCD8DEEAC7. No GUI automation, hidden launch, runtime replacement, or capture was used.
6. Accepted Pj64Client allow_unloaded handshake and read-only health/status/emulator-state succeeded. Observed protocol 0.17.0, epoch 1A0798BE27F-C1987E7B, interpreter, rdramSize 0, PC null, frameCount 0, no ROM, no watches, capture disabled, DMA disabled, input mask/stick/samples/events zero. emuState observed false and systemPaused null: paused game state was NOT established.
7. Before open_rom could be sent, the next client connection failed with WinError 10061/connection refused. Failure occurred entering the client context, before any open_rom invocation. No open-ROM, load-state or pause command was sent. No state readback was performed.
8. Subsequent read-only process/port inspection observed different PID 39340 at the same configured executable path owning the 64656 listener. This observation did not establish who launched it or its epoch/ROM/state. All runtime mutations stopped, and Director was notified of the changed owner. Joe then said "I'll handle it"; Director instructed immediate relinquishment and no further calls. The new instance was left untouched. No retry, cleanup, kill, close, load or status call followed takeover.

## Outcome, evidence and limits

Verified file/API authentication and supported authenticated launch; runtime setup incomplete. These are task observations with independent review pending, not semantic or capture acceptance. Last known initial epoch belongs only to the first observed bridge and must not be reused for the replacement instance. The initial interpreter/no-ROM health cannot describe the later PID. Saved PC expectation remains unavailable. No six-field post-load identity proof or actual ready capture configuration exists.

No configuration was promoted, no canonical run hash was produced, and capture approval remains absent. Frozen preparation's draft and explicitly unapproved record remain unchanged. A future capture configuration requires actual current runtime ownership/epoch, verified loaded state and relevant six-field readback, confirmed route, concrete future assignment reference and separate Joe approval of its exact canonical hash.

Selected knowledge checks refer to database 023E881A-314D-4398-9E22-1E05952A3537 and recorded K3 frontier. No knowledge/session mutation or ingestion was performed. No selector placement/execution/caller/origin result is claimed. No unrelated matching/build work was touched.

## Evidence index and verification

Ignored root build/total-resolver/combat-selector-runtime-setup-r1/ contains input-identities.json; doctor.txt; knowledge-status.txt; knowledge-verify.txt; session-status.txt; health-before.txt; launcher.log; owner-before.json; launch.json; bridge-after-launch.json. The process-change and connection-failure observations above are reconstructed from direct command outputs in this task; no nonexistent open-rom.json is claimed. Artifact manifest records final evidence, claim and report hashes.

The launch used the existing accepted controller and controls without source changes. Only owned report/claim/ignored outputs were written. No builds, tests unrelated to preparation, production edits, state edits, arbitrary RAM writes, controller inputs, watch/capture/session/database mutations, staging, commits, push, branches, worktrees or agents occurred. No approval rejection or environment gate occurred. The first overly strict ownership guard was corrected only after read-only evidence resolved the retained closed-session pointer; later unexpected runtime ownership was preserved.

Protocol deviations: none. Canonical documentation changes proposed: none. Next action: Joe handles runtime setup; Director decides any future explicitly authorized readiness assignment after user setup. This worker does not request another ownership question or perform further runtime action. All runtime setup ownership and all assigned writes released to /root.
