# Combat capture GUI launch r1

Status: completed; GUI left open for Joe. All assigned writes and launch ownership released.

Launch COMBAT-CAPTURE-GUI-LAUNCH-20260907-01, ready e0e54f4, worker /root/combat_discovery on local; Director /root / native 01a07262-aeca-7341-ad10-2dba705ff988. Complete fresh claim created atomically with CreateNew before writes/launch. Joe's existing explicit GUI-launch request authorized this operation; no capture authority was used or created.

Authenticated Accepted review b30a6c5 report SHA256 11184999494ABFB6C7C85658DB17D03B7298C666FDACAC9CD856DC64BDA59ED6 and R3 manifest SHA256 77E7159A603E9A4414BF762F1771E0CAFD11A9D3D0A7785B23D3C002007ACB91. All seven current tooling files match the reviewed subject. Exact values are in authentication.json. No production changes or tests were needed.

Executed from canonical C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp with Start-Process WindowStyle Normal:
`C:\Users\Joe\Documents\Hermes\hermes-agent\venv\Scripts\python.exe -B -m tools.total_resolver gui --port 64656 --log "C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\total-resolver\combat-capture-gui-launch-r1\gui.log"`

Launcher PID 28832 spawned child PID 34508 at C:\Users\Joe\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none\python.exe with the same arguments. After three seconds, the child had responding visible application window title `OB64 Total Resolver Capture`, nonzero handle 2295448. stderr was empty. GUI log records successful controller initialization on port 64656 at 2026-09-07T02:52:52.402Z. The retained session ID was read normally by GUI initialization; no session was started or changed.

Combat is selected by the authenticated startup code and bound to the readonly dropdown before the event loop. This launch did not use GUI automation to inspect/click the selection. Process/window evidence proves startup and responsiveness, not a screenshot-based rendering review. Existing headless binding tests and Accepted review establish the startup selection path. Capture has no time limit and no first-hit stop; it waits for Joe's explicit Start action and later manual Stop.

No existing GUI process matched the read-only prelaunch command inventory. No existing process was terminated, seized or altered. No Project64 launch/control, bridge call, Start action, live watch, capture, ingestion, metadata edit, selected database mutation or cleanup occurred. GUI remains open; its diagnostic log/stdout/stderr can continue changing after this handoff, so their handoff hashes are snapshots, not promised final runtime identities.

Evidence: ignored build/total-resolver/combat-capture-gui-launch-r1/ contains authentication.json, existing-gui-processes.json, launch.json, startup-window.json, process-tree.json, stdout.txt, stderr.txt and gui.log. Artifact-manifest.json records handoff snapshot hashes plus final report and claim. Evidence grade: verified authentication and process/window startup; review pending for this operational record. No selector execution/provenance claim follows.

Failures: none. Protocol deviations: none. Proposed documentation changes: none. No Computer Use, raw GUI automation, new agents, branches/worktrees, staging, commits or push. All writes/launch ownership released to /root; leave GUI open for Joe.
