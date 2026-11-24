# OB64 Agent Bridge

This local HTTP bridge belongs to the historical GUI coordination workflow.
Current Director-managed programs use [native event delivery](../../docs/WORKFLOW.md#director-event-continuity).
The following commands document the earlier bridge and its ignored `build/agent-bridge/` records.

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
    reviewDoc = 'docs/reviews/REVIEW_2026-06-22_chunk07-data-code-data-code.md'
    frontier = '0x00081000'
    message = 'Chunk 7 source-owned, review handoff committed; ready for coordinator review and next prompt.'
  } | ConvertTo-Json -Compress)
```

Agent review-complete ping:

```powershell
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Uri 'http://127.0.0.1:17776/agent/review-complete' `
  -Body (@{
    agentName = 'Claude GUI'
    reviewDoc = 'docs/reviews/REVIEW_2026-06-22_chunk07-data-code-data-code.md'
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
  document reviewed. Newer prompts should include `payload.reviewDoc`; the
  coordinator can then review it and paste the next-run prompt directly.
- `review_complete`: compatibility event for older two-step prompts where the
  agent created the review handoff after a separate follow-up prompt.
- `agent_error`: the agent hit a blocker and wants the monitor/reviewer to inspect.

## Limits

The bridge records local events. Its former coordinator polled `/events`, used
desktop control to paste a prompt into the external chat, and marked the event handled.
