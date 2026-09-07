# Combat capture startup r4

Status: completed bounded diagnosis; correction/deployment and live recovery remain unperformed. All assigned writes released for a fresh scoped correction. No production or external source/runtime changes.

## Authority and evidence

Launch COMBAT-CAPTURE-PRESET-GUI-20260907-04, ready 161916d, task combat-capture-preset-gui revision 4, worker /root/combat_discovery on local; Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Complete claim created atomically before writes. Initial work was read-only while W5 terminalized; Director then reported release at ddf86c9 and directed this result to freeze diagnosis before a new cross-repository correction. Parent/external paths stayed read-only throughout.

Failed GUI run: 20260907T030928.940105Z-127f5fec, beforeRom=false, combat-selector-v1, bridge epoch 1A079C8AF20-F79E5FFB. Preserved GUI log reports Pj64Error invalid count: 0, then later ordinary and Combat retries refused a nonempty unified queue. These records are evidence, not authorization to retry or drain. Copies/hashes of failed manifest, worker and verification records are in this task's evidence root. SQLite inspection used mode=ro and immutable=1 against the closed failed database with zero WAL length; no source database write occurred.

## Exact root cause

The failed session manifest specifies zero stack words and no pointer snapshots. The real Pj64Client.install_focused_watch serializer produces:

`focusedwatch 0x801BE2E8 0x801BE308 0x3C03801D 3C03801D8C6306880004104000441021004510210062182103E0000890620000 combat-selector-v1 selector-byte-accessor 3197 0x201778 all - 0`

This is reconstructed exactly from preserved target fields through the production serializer; no historical raw wire log is claimed. The real parser in parent tools/project64/ob64_pj64_bridge.js dispatches focusedwatch's final token through parseCount(parts[11],32). parseCount rejects values below 1, producing invalid count: 0. Python profile/client permit 0..128 and Combat intentionally requests zero to avoid ungrounded stack memory observations. Changing the preset to an arbitrary positive number would change the requested evidence and hide the actual contract defect.

Both the current canonical parent script and deployed script reproduce the exact rejection in the existing Node VM bridge harness, which executes their real line-oriented parser and command handler. The base harness's existing positive-stack test still passes, explaining why prior harness/fake-client tests missed zero. Prior Python fake clients accepted any focused install and therefore did not establish wire compatibility.

The actual JS consumer readStackWords clamps to 0..128, loops zero times for count zero and returns an empty words array. An isolated evaluation of that exact function body returned zero words with zero memory reads. focusedPacket calls it at entry/return; native events.onopcode receives address/opcode/mask/callback and no stack-count argument. Thus the identified defect is JavaScript parsing, not native zero-stack ABI support. No C++ change or binary rebuild is indicated by this path.

## Required correction/deployment scope

A fresh assignment should authorize a generic bounded nonnegative integer parser specifically for focused stack count, accepting 0..128, and use it for focusedwatch's stack token. Preserve existing positive-count validation for function IDs, drain limits, watch IDs and other positive-only commands. Reject negative, fractional, malformed/trailing-junk and greater-than-128 stack counts; do not accept values merely because parseInt truncates them. Preserve no-stack semantics and positive Cutscene counts. Preserve manual capture with no time or first-hit limit.

Exact external write scopes needed:

- Parent canonical bridge: C:\Users\Joe\Projects\OgreBattlel64\tools\project64\ob64_pj64_bridge.js, current SHA256 1133A66C5C5743B8B40F1CC410A6EB8A64639CAC2E750B74F6DFBC48186EBF1F.
- Authenticated deployed script: C:\Users\Joe\Projects\project64\Bin\Win32\Release_totalresolver_64656\Scripts\000_ob64_pj64_bridge.js, current SHA256 7F87A8EA02DE7DA566AC201C32BFEC4FCCC7FA114F91C44D6E88FCFCD8DEEAC7. Preserve its configured port 64656; canonical source uses its own configured port.
- Canonical config/total-resolver/sources.json must bind new activeBridge.sha256 and activeNativeRuntime.bridgeScriptSha256 only after exact source/deployed verification. Unchanged native source set, executable hash, build identity and protocol semantics must not be fabricated or bypassed.
- Canonical tests/test_active_bridge.py, bridge_110_harness.js and relevant client/recorder lifecycle tests should execute serialized zero-stack and positive-stack commands through the actual parser, observe entry/return empty-stack payloads, reject invalid counts and prove unchanged positive-only commands. Test both startup modes and failure ownership/draining. Existing fixtures alone are insufficient if they never pass through the deployed parser.

Script deployment must follow fresh scoped authority and independent review. Replacing the file does not change an already-loaded script instance. Before any reload/restart, preserve residual evidence from the old epoch. Then a separately authorized bridge reload/relaunch produces a new epoch; authenticate health and correct script/binary identities, require clean queue/no old owners, preserve Joe's game/setup requirements and reopen reviewed GUI code if its process is stale. Do not automatically retry capture or close Joe's current GUI. Existing fake tests and older Accepted adapter/preset reviews do not authenticate new deployed bytes.

## Why retries encounter residual events

Loaded-ROM start prepares native coverage/DMA/baseline and installs the generic watch before focusedwatch fails. Recorder.start sets started=false and calls rollback, removing owned IDs and stopping DMA/capture. Those stops can leave stop-time summary events queued; rollback does not drain. Session worker's exception path drains only when recorder.started is true, so it skips drain in this failure and closes the session interrupted. Subsequent observation preflight correctly rejects nonempty queue rather than silently discarding or attributing its events to a new session.

The failed database contains 2 stored host events, 0 emulator events and 4 watch definitions (native definitions plus generic watch; no successful focused definition). Stored closure is interrupted and continuity broken. No claim is made about current live queue contents, count or epoch: this assignment made no live call. The GUI's later errors establish only that those attempts observed a nonempty queue.

The existing recover_session command is not a solution for this already-closed record: after opening its store, it immediately returns session_status whenever closure_status is not open. Running session recover on this ID would not drain the residual queue. Changing its closed row to open, deleting evidence, global clear, or treating restart as continuous would falsify provenance and is not proposed.

## Concrete preservation/recovery route

1. Preserve the failed records and old-epoch evidence before any bridge reload. The task already copied/hash-bound the small failed records; the future recovery owner should preserve the database and record exact live epoch/queue status under explicit recovery authority.
2. A fresh guarded residual-recovery operation is needed for the already-interrupted case. Export the queue into a new ignored sidecar linked to this failed session and exact epoch, with raw ordered responses, sequence/drop ranges, before/after status and hashes. Require no active owner, same epoch and established failed-start ownership; stop on conflict/epoch change. Do not rewrite the frozen failed database, infer continuity, ingest or attribute residual events to a new capture. Draining is a live mutation and remains separately unperformed/unapproved here.
3. Baseline bytes were read/released into the dead worker before normal startup drain. Queue export cannot invent those lost bytes; preserve any available raw baseline reference and explicitly mark missing payload/sequence evidence. The old session remains interrupted even if residual export empties the queue. An authorized restart without preservation would lose pending evidence and must not be called recovery.
4. For future startup failures, a generic lifecycle correction should drain owned residual events before closing interrupted, even after instrumentation rollback, while retaining the worker's baseline bytes and exact ownership/epoch/cursor. Exercise failures after generic install and focused parse rejection in both startup modes. Do not weaken the nonempty-queue gate or indiscriminately drain an unrelated session. This is a necessary follow-on design/test scope, not an implemented remedy here.
5. After preserved recovery, reviewed script deployment and explicit reload, authenticate clean readiness before Joe chooses a new capture. Capture still has manual Stop and no duration limit.

## Reproduction, limits and handoff

Ignored build/total-resolver/combat-capture-startup-r4/: rejected-wire.txt; zero-stack-reproduction.js (task-local augmented copy of existing harness); parser-0.txt/parser-1.txt and parser-reproduction.json (both real scripts); zero-stack-consumer.js/json; failed-manifest.json, failed-worker.json, failed-verification.json and failed-record-identities.json; failed-db-readonly.json; artifact-manifest.json.

Both exact parser reproductions passed while proving the expected invalid-count rejection; their full base protocol harness also passed. Exact zero-stack JS consumer probe passed. Initial task-local injection targeted console.log but the harness used process.stdout.write, so its output parser failed before a rejection claim was produced; corrected the task-local injection point and reran both real scripts successfully. No production workaround or permissive test replacement was made.

Root-cause evidence grade: verified static/wire/parser reproduction, review pending. Falsifier: the reconstructed manifest command differs from the production serializer or deployed parser accepts its zero token; both were explicitly checked. Native rebuild need is not indicated by inspected callback boundary; runtime behavior after a corrected deployment remains untested. No stronger selector execution/caller/origin conclusion follows.

Protocol deviations: none. Proposed durable changes are the focused zero-stack parser contract and provenance-preserving failed-start recovery guidance/tests described above, for new scoped assignment. All production/external files and frozen records unchanged. No live bridge/queue/session/database/control/capture/GUI operation, Computer Use, agents, builds, staging, commits, push, branches or worktrees. All task writes released to /root for cross-repository correction/recovery routing.
