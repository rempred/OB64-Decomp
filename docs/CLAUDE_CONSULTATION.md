# Paired Claude consultation

Run `python tools/consult_claude.py --prompt-file <UTF-8-file>` from the assigned Codex worker. Standard input also accepts UTF-8 text. The inherited `CODEX_THREAD_ID` owns one lifetime Claude session; optional `--worker-id` must match it. Keep that identity and UUID across questions and failures. Never create a replacement session, resend a pending question or edit its mapping/history by hand.

The wrapper uses the fixed repository cwd, a scrubbed environment, `claude-opus-5-5` and requested xhigh. It admits only native Max subscription authentication (`claude.ai` / `firstParty`); keep extra usage OFF. API/provider overrides and present or uncertain managed policy refuse. Native version, authentication and successful response evidence are separate checks. Only reviewed CLI versions 2.1.292 and 2.1.296 pass the version preflight; unknown versions fail before model dispatch. Concurrent executable changes remain fail-closed. Version strings and cost metadata do not prove authentication, model behavior or billing.

Consultations allow Read/Grep/Glob with restricted/safe modes and dontAsk permissions. One worker lock and owned process tree prevent overlapping wrapper calls; a consultation has a 900-second deadline and 48-turn ceiling. Failed/uncertain calls preserve pending evidence. A successful answer requires this worker's exact fresh attempt, immutable prior history, supported native version, real model/xhigh evidence and matching terminal result. Limits and parser refusals do not authorize bypasses or automatic retries.

## Recovery

Keep the native client closed and route failures with session/attempt/evidence identities to the Director through the verified native route. Use the appropriate reviewed recovery only after the cause and outcome are established:

- `--recover recover-completed` validates the retained completed pending result and owned EOF receipt without another model call.
- `--recover restore-backup` restores only an absent previously validated transcript from its verified backup; it refuses pending turns or overwriting existing history.
- `--recover dispose-completed-high-probe --attempt-id <ID> --history-sha256 <digest>` explicitly disposes a completed, rejected high-effort control without certifying it as xhigh.
- `--recover dispose-terminal-oauth-failure --attempt-id <ID> --history-sha256 <digest>` disposes only the supported terminal expired-OAuth error. Joe handles interactive reauthentication separately; this action does not log in or retry.

Disposition preserves accepted evidence and the same UUID; only a distinct new prompt may follow. Missing/corrupt/ambiguous history, live process ownership or uncertain completion stays blocked. Current mapping, backup and process/result evidence live under `C:/Users/Joe/.local/share/ob64-claude-consult/<worker-id>/`. Protect these files and the native transcript.

## Manual transcript inspection

Pause the worker, establish ready/no pending/no owned process, and hold its worker lock throughout inspection. Use the fixed repository cwd and the wrapper's scrubbed `child_env()` environment. A bare resume command is not the tested path. In a real terminal use the fixed executable `C:/Users/Joe/.local/bin/claude.exe` with these exact arguments, replacing UUID with this worker's saved session UUID:

```text
--restricted --safe-mode --model claude-opus-5-5 --effort xhigh --tools Read,Grep,Glob --permission-mode dontAsk --strict-mcp-config --disallowedTools mcp__* --resume UUID
```

Supply no prompt. Ctrl+O views the transcript; double Ctrl+D within 800 ms exits from empty input. Wait for normal process EOF and close the native client before releasing the hold or consulting again. Never inspect concurrently, change permissions, rename/rewind the session, fork it or submit recalled text.

Opening inspection may append metadata. The wrapper can admit only 1-128 complete records / 64 KiB of strict same-session cost-state or dontAsk permission-mode metadata after the exact validated backup prefix. It rechecks native/backup bytes before dispatch and freezes the complete history into the next attempt; accepted history/answer advances only after a genuine validated reply. Metadata cannot prove client closure or carry authority. No manual hash adoption is needed or allowed. Unknown suffixes, an unvalidated/disposed baseline, changed old bytes or permission-mode inside a fresh attempt stop for evidence.

## Coordination

Use native Codex collaboration/thread messaging and the exact Director's verified stop/attention route; send actionable handoffs before ending. The Director owns tooling approval and the independent reviewer owns code review. Operational Agent Mail is retired after cutover; preserved archives remain historical evidence. See [WORKFLOW](WORKFLOW.md#director-event-continuity) for routing, and the active plan/cursor for transient acceptance evidence and ownership. The deferred storage pilot still requires its separately reviewed native authorization change.
