# Paired Claude consultation

Run `python tools/consult_claude.py --prompt-file <UTF-8-file>` from your assigned Codex worker, or supply UTF-8 stdin. The inherited `CODEX_THREAD_ID` owns one persistent Claude session. Optional `--worker-id` must match it. Every later problem resumes that same UUID; never edit mappings, borrow another worker's session or create a replacement pairing after failure.

The adapter uses the fixed repository cwd/config, a scrubbed environment, Max subscription authentication (`claude.ai` / `firstParty`), and explicit `claude-opus-5-5 --effort xhigh`. Keep extra usage OFF. Read/Grep/Glob, restricted/safe mode, dontAsk and strict MCP isolation are retained. Present/uncertain managed policy refuses. Model and effort are requested configuration; xhigh is not independently measured, and list-price cost metadata is not billing proof.

Claude owns native history. The adapter does not parse JSONL, pin CLI patch versions, adopt history hashes or restore backups. A successful call requires a clean owned EOF0 and a successful final JSON result for the saved UUID with nonempty answer. Extra JSON fields are tolerated; supplied modelUsage must contain requested Opus output but may include auxiliary models. One worker lock and the existing owned Windows Job protect calls; timeout/output bounds remain, without a tight turn-count cap.

## Pending calls

Failure preserves the same session and pending attempt. Do not automatically resend. Choose one explicit action once the native client/process is closed:

- `python tools/consult_claude.py --recover recover-completed` accepts an already-completed successful current result without another model call.
- `python tools/consult_claude.py --recover abandon-pending` preserves available prompt/output/error/receipt and pending evidence, accepts no answer, and permits a distinct new prompt on the same UUID. It refuses while the owned process tree is live or its closure cannot be established.

New outputs live in the worker's `attempts/<attempt-id>/` directory identified by pending state. Older root-level receipts remain recoverable in place; abandonment preserves them before clearing pending. Historical backup/hash fields and files are retained artifacts, not acceptance authority. Successful recovery cannot be repeated after pending clears.

A UUID is saved before dispatch. An auth/preflight failure before a possible first model launch leaves it eligible for its initial `--session-id`. Once possible launch is durably recorded, all later calls use `--resume`; a missing native session becomes an explicit error, never an automatic creation fallback or resend. Route unresolved failures through native Codex coordination. Ordinary explicit recovery/abandonment does not require a new failure-specific protocol.

## Manual inspection

Inspect only your own saved UUID while the worker is idle and its `owner.lock` is held for the entire native interactive session. Use the fixed repository cwd and the wrapper's scrubbed child environment (including fixed `CLAUDE_CONFIG_DIR`); the tested native command is:

```text
claude.exe --restricted --safe-mode --model claude-opus-5-5 --effort xhigh --tools Read,Grep,Glob --permission-mode dontAsk --strict-mcp-config --disallowedTools mcp__* --resume <own-UUID>
```

Do not send a model prompt merely to inspect history. Ctrl+O shows history; double Ctrl+D within 800 ms exits. Close the interactive client before consulting again. Native metadata changes require no hash adoption. The lock cannot protect an independently launched manual client that ignores it.

Claude supplies advice; Sol owns implementation. Keep inter-worker coordination in native Codex messaging and existing stop/attention watchers. Do not rebuild a transcript grammar around this adapter. Real session recall and billing behavior remain separate from offline mocked tests; retained acceptance evidence is in the Director's existing cursor and consultation records.
