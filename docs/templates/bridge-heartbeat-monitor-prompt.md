# Bridge Heartbeat Monitor Prompt Template

Use this as the prompt for a Codex heartbeat automation attached to the coordinator
thread. It assumes `tools/agent_bridge/agent_bridge_server.js` is running locally
and that the external agent is a separate GUI chat, usually Claude.

```text
Poll the OB64 agent bridge at `http://127.0.0.1:17776/events?status=new`.

For each new event:

1. If `type` is `run_complete`:
   - Read `docs/templates/review-handoff-prompt-template.md`.
   - Fill in the review-doc filename from `payload.runSlug` or the chunk/frontier
     details in the payload. If insufficient, use a conservative slug and exact
     range from the repo docs.
   - Use desktop control to focus the GUI agent chat identified by
     `payload.agentName` or the configured Claude GUI window.
   - Paste the resulting review handoff prompt into that chat and send it.
   - Mark the bridge event handled with a note that the review prompt was pasted
     into the GUI agent.

2. If `type` is `review_complete`:
   - Read the review doc at `payload.reviewDoc`.
   - Inspect repo status/log and the relevant current docs:
     `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
     `docs/WORKFLOW.md`, and `docs/PLATFORM.md`.
   - Tailor `docs/templates/chunk-source-ownership-run-prompt.md` for the next
     chunk/frontier, including known issues from the review, current counts,
     incoming straddlers/data continuations, and required reading.
   - Use desktop control to focus the GUI agent chat identified by
     `payload.agentName` or the configured Claude GUI window.
   - Paste the tailored next-run prompt into that chat and send it.
   - Mark the bridge event handled with a note that the tailored next prompt was
     pasted into the GUI agent.

3. If `type` is `agent_error`:
   - Read the payload and inspect the repo state.
   - Report the blocker in the coordinator thread. Do not send a new agent prompt
     unless the safe next action is clear.

If the Claude GUI window or chat input cannot be found, do not guess or type into
an unknown window. Notify the coordinator thread with the prepared prompt and leave
the event unhandled unless the user tells you to mark it handled manually.

Do not modify source files during the heartbeat unless the event explicitly calls
for prompt generation or review. Keep actions limited to reading docs/repo state,
pasting GUI prompts, and marking bridge events handled.
```
