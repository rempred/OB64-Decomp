# OB64 Agent Bridge

This is a tiny local-only HTTP bridge for coordinating long decomp agent runs.
It records completion events under ignored `build/agent-bridge/`. A Codex
heartbeat monitor can poll the bridge, tailor the next prompt, and paste it into
the external GUI agent chat.

Start it from the repo root:

```powershell
node tools/agent_bridge/agent_bridge_server.js --port 17776
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:17776/health
```

Agent run-complete ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://127.0.0.1:17776/agent/run-complete' `
  -Body (@{
    agentName = 'Claude GUI'
    runSlug = 'chunk7-source-ownership'
    frontier = '0x00081000'
    message = 'Chunk 7 source-owned and committed; ready for review handoff prompt.'
  } | ConvertTo-Json -Compress)
```

Agent review-complete ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://127.0.0.1:17776/agent/review-complete' `
  -Body (@{
    agentName = 'Claude GUI'
    reviewDoc = 'docs/REVIEW_2026-06-22_chunk7-source-ownership.md'
    frontier = '0x00081000'
    message = 'Review handoff is committed; ready for tailored next chunk prompt.'
  } | ConvertTo-Json -Compress)
```

Read pending events:

```powershell
Invoke-RestMethod 'http://127.0.0.1:17776/events?status=new'
```

Mark an event handled:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://127.0.0.1:17776/events/<event-id>/handled' `
  -Body (@{ note = 'Pasted follow-up prompt into Claude GUI.' } | ConvertTo-Json -Compress)
```

## Event Types

- `run_complete`: the agent says source work is done and needs the review-handoff
  prompt.
- `review_complete`: the agent says the review handoff exists and needs a tailored
  next-run prompt.
- `agent_error`: the agent hit a blocker and wants the monitor/reviewer to inspect.

## Limits

The bridge only records local events. It does not directly control Claude or any
GUI window. The active Codex coordinator thread or a heartbeat automation must
poll `/events`, tailor the prompt from repo state, use desktop control to paste
into the correct GUI chat, and then mark the event handled.
