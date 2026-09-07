# Capture startup correction R1

Partially completed and blocked on the remaining scope. The generic focused-watch parser correction passes offline wire tests. Failed-start ownership and durable preservation remain unimplemented. The Director will assign that work as R2 before routing the coherent result for Critical review.

## Identity and authority

- Task: combat-capture-startup-correction, revision 1.
- Launch: COMBAT-CAPTURE-STARTUP-CORRECTION-20260907-01.
- Worker: /root/compilation_groups_design, Astra Medium.
- Director: /root; native task 01a07262-aeca-7341-ad10-2dba705ff988; local.
- Canonical source baseline: 469a1416918592749d61dc34e3e079796f7b673c.
- Ready assignment: 5cc280c21a972f6bd4e14c0fd5470c7c26be20e0.
- Canonical HEAD at release preparation: abdf94a74c48a38d21c18774715d13fc254c3e60.
- Parent baseline and current HEAD: f940a2825ac97453746d3e9cef9c5cabc60a8dd2.

The fresh claim was created atomically before other writes. Input authentication and the writer check preceded production changes. W7 had released production ownership. Unrelated parent changes remain preserved.

## Implemented correction

The JavaScript focusedwatch parser now uses a dedicated strict stack-count parser. It accepts decimal integer tokens from zero through 128. Zero remains an explicit count. Missing, malformed, fractional, negative, signed, trailing-junk, nonnumeric and out-of-range tokens fail.

The unrelated positive-only parseCount helper remains unchanged. No Combat profile value was changed. The Python serializer already emitted valid zero counts and remains unchanged.

The existing JavaScript VM harness now counts stack-memory reads. A new Python test feeds actual serialized client commands into the actual bridge command parser. The native API and memory remain synthetic test fixtures.

Changed production/test paths:

| Root | Path | Result SHA256 |
|---|---|---|
| Parent | tools/project64/ob64_pj64_bridge.js | BF798A2E941D0FD25116633220AA84AFEC421597730308E9B824B6D131EDD771 |
| Canonical | tools/total_resolver/tests/bridge_110_harness.js | 6DA2D3F7E9F44E1AC0C378E16B9EBE008112376A845B20C6D6B7FF439572E787 |
| Canonical | tools/total_resolver/tests/test_startup_wire.py | E7680C094BBED6C27E3C60613648230D5778C2B126FB1339FF00A2BD9C2A7901 |

The assigned claim, this report and the ignored evidence root are the only other task writes.

## Offline verification

Two focused tests passed. The command was:

```text
python -m unittest tools.total_resolver.tests.test_startup_wire tools.total_resolver.tests.test_active_bridge -v
```

TEMP and TMP pointed inside build/total-resolver/combat-capture-startup-correction-r1/tmp. PYTHONDONTWRITEBYTECODE was 1. No real database was opened.

The serializer/parser test exercised counts 0, 1, 8, 32 and 128. Each case produced paired entry/return evidence. Zero caused no stack-memory reads. Positive counts caused exactly twice the requested reads across the pair.

JavaScript rejected -1, 1.5, 1junk, 129, true, NaN, Infinity, +1, 1e1 and a missing token. Python rejected negative, oversized, fractional, Boolean and trailing-junk arguments. Existing positive-only drain and unwatch commands still rejected zero.

The unchanged cutscene case passed native opcode filtering, first-per-frame suppression, paired invocation identity, pointer bytes and floating-point register capture. The existing protocol, baseline, coverage, DMA, cold-boot and ordering harness also passed.

The preserved original bridge input failed the same actual Python zero-count wire with `invalid count: 0`. This expected negative result is retained separately. Git whitespace checks passed for canonical changes and the exact parent bridge path.

These tests establish offline parser behavior. They do not establish native runtime behavior, deployment readiness or failed-start lifecycle acceptance. No lifecycle correction or lifecycle verification was performed under this partial result.

## Remaining causal gap

The current loaded startup path clears started before its rollback. The session worker drains only when started remains true. A partial startup can therefore leave queued evidence after the session becomes interrupted.

The cold-start path also crosses partially armed and partially adopted instrumentation states. A general correction must cover failures before and after baseline acquisition in both startup modes.

The current poll method destructively drains before checking the returned epoch. The JavaScript drain command removes events with queue.splice before delivering its response. A preceding status read cannot atomically bind the later mutation to one epoch or owner.

A same-epoch owner change is a distinct problem. The bridge currently has no recorder session identity that authenticates cleanup operations. Local worker metadata alone cannot prove that queued evidence and active instrumentation still belong to that worker.

A failed response or failed file write after destructive drain can lose the only available batch. Reconstructing a baseline from current RAM would invent event-time evidence. The acquired original baseline must be preserved separately before unsafe cleanup or closure.

The existing recover_session path returns immediately for an already-closed record. It cannot establish a closed failed-start residual export. R1 adds no export command and makes no claim that historical residue is safely recoverable.

Relevant unchanged code:

- tools/total_resolver/recorder.py:632, start and its rollback boundary.
- tools/total_resolver/recorder.py:650 and :675, pre-ROM arm and capture adoption.
- tools/total_resolver/recorder.py:931, best-effort instrumentation rollback.
- tools/total_resolver/recorder.py:1187, destructive drain before epoch validation.
- tools/total_resolver/sessions.py:856, cleanup conditional on started.
- tools/total_resolver/sessions.py:1140, existing open-session recovery.
- Parent tools/project64/ob64_pj64_bridge.js:2134, destructive queue removal.

## Director scope decision and R2 boundary

The Director explicitly assigned the ownership/preservation protocol to fresh R2 scope. R1 must freeze the parser result and release writes. This is a scope decision, not an automatic approval rejection or a request for Joe's permission.

The proposed R2 mechanism needs an atomic session identity established while the queue and instrumentation are unowned. Cleanup must reject a different identity or epoch before mutation. It must remain valid when normal startup never completes.

Durable failed-start preservation needs a nondestructive read, durable sidecar write and guarded acknowledgment, or an independently justified equivalent. Tests must cover ownership changes, epoch changes, transport failures and file failures. They must preserve actual failure evidence.

An explicit closed-session export must preserve the closed database. It must require established failed-start ownership, the same epoch and no active owner. Raw event ordering, sequence ranges, drop ranges and status identities must remain available. It must not ingest or assert continuity.

Historical failures without the required ownership proof must fail closed. R2 must not invent a retrospective session token or lost baseline bytes. This report proposes requirements and a possible mechanism; it does not accept a new protocol design.

## Lineage and deployment boundary

The parent HEAD bridge SHA256 is 2271A074789995D73645B274D6EF7BE1B7824D0A9B9BB4ADFA97E0E965A01F08.

The selected pre-existing input SHA256 is 1133A66C5C5743B8B40F1CC410A6EB8A64639CAC2E750B74F6DFBC48186EBF1F. Its authoring task and full implementation acceptance remain unknown. Its bytes were preserved before correction.

The source candidate SHA256 is BF798A2E941D0FD25116633220AA84AFEC421597730308E9B824B6D131EDD771. It includes the selected pre-existing lineage and the narrow parser correction. Fresh Critical review must cover the full parent HEAD-to-result bridge delta.

The external deployed script remains unchanged at SHA256 7F87A8EA02DE7DA566AC201C32BFEC4FCCC7FA114F91C44D6E88FCFCD8DEEAC7. Its path is C:/Users/Joe/Projects/project64/Bin/Win32/Release_totalresolver_64656/Scripts/000_ob64_pj64_bridge.js.

No script or executable was deployed. No GUI, Project64, live queue, real database, capture, native build or runtime operation occurred. No accepted configuration identity, matching source, compiler, linker, source-policy or structural input changed. No Git mutation occurred.

Manual capture duration and manual Stop remain unchanged. The parser candidate is not a complete deployment candidate. R2 and Critical review must precede a separately authorized deployment/recovery assignment. That assignment must bind the final source and deployed hashes coherently. R1 does not update activeBridge.sha256 or activeNativeRuntime.bridgeScriptSha256.

## Evidence index

All generated evidence is under build/total-resolver/combat-capture-startup-correction-r1/:

- bridge-parent-head.js: exact parent baseline blob.
- bridge-input.js: authenticated pre-existing selected input.
- bridge-parser-result.js: exact parser candidate snapshot.
- bridge-preexisting.patch: parent baseline to selected input.
- bridge-correction.patch: selected input to parser candidate.
- bridge-full-parent-delta.patch: complete parent baseline to candidate.
- python-serialized-wire.json: actual Python serializer commands.
- original-parser-negative.txt: retained expected failure on original input.
- tests-01.txt: both passing focused tests.
- parser-checkpoint-identities.json: source and deployed identities.
- evidence-index.json: final evidence identities and reproduction context.

No durable canonical documentation change is proposed before the complete correction passes review. R2 should document the accepted ownership, failed-start and residual-export contract after review.

All assigned production, test, report and evidence writes are released at this terminal handoff. Frozen predecessor reports and the existing claim remain unchanged.
