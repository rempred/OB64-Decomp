# Combat selector observation preparation r1

Status: **completed preparation; bounded method prepared, runtime/input prerequisites unavailable**. Proposal and new interpretations remain review pending. No capture was authorized or performed. Writes released to Director /root at terminal handoff.

Plan: authenticate frozen retrieval; inspect documented runtime and focused-capture capabilities; use only read-only health/status checks; prepare a minimal run proposal or exact missing prerequisite. No capture or runtime control is authorized.

## Result and Director route

The current knowledge miss leaves the selector's consumer-provenance gate open. Existing recorder APIs can support a bounded qualified invocation/caller observation and a targeted follow-up for pointer origin. A production profile or bridge change is not established as necessary for that claim. The standard CLI's profile list is narrower than the supported recorder API.

The Director can assign a bounded run adapter that uses existing RecorderSettings, ResolvedFocusedWatch and WatchSpec facilities. Keep it in an assigned ignored runtime output root. It must preserve normal recorder preflight, staging, watch ownership, exact placement, and deferred ingestion. Inspect and validate the adapter before any capture approval request. No production change or new focused profile is required by this proposal.

A capture request is premature until that adapter is reviewable and a legitimate route is selected. The missing runtime input is an identified gameplay/state route that reaches this selector, or an explicitly exploratory route with a bounded stopping rule. The existing placement records do not identify such a route. Do not ask Joe to reproduce an invented menu action. No bridge is currently reachable at the configured endpoint.

## Assignment, inputs and baseline

Assignment: combat-selector-observation-preparation r1. Launch: COMBAT-SELECTOR-OBSERVATION-PREPARATION-20260906-01. Worker: /root/combat_discovery, local. Director: /root, native task 01a07262-aeca-7341-ad10-2dba705ff988.

The assigned claim, report and ignored output root were absent. The complete claim was created using FileMode.CreateNew before other writes, then read back. Its timestamp is 2026-09-07T00:05:43.7192635Z. Parent main is e445991cc357a56e9d8f3d3866c247d6f52e1634. The assignment named canonical main c956bef; the read-only HEAD check during preparation returned 837c74cd29069d811aa6cee644746e1b1484db83 after concurrent Director integrations. No overlapping report changes occurred. These shared ref updates do not confer ownership of another worker's files.

The frozen r2 report at 1f68aa0 remains untouched and under independent review. The current-knowledge retrieval is frozen at 6b89bf345d2399c98191573f3774c1d164f46601. Its ignored retrieval.json was authenticated against SHA-256 59C104ECCE02494E1F0F47DE15394269F688B361F9AC2705B5AFC41CA9408C13. This preparation uses that frozen verified result; it did not query or mutate the current knowledge database again.

Required guides, README, persistent-coverage decision and implementation status were read. Applicable capability sources are tools/total_resolver/focused_capture.py, pj64_client.py and the authenticated parent tools/project64/ob64_pj64_bridge.js. Exact source hashes are in build/combat-selector-observation-preparation-r1/input-identities.json. No external decomp/source-comparison material was read.

## Interpretation of the knowledge miss

The frozen query covers database 023E881A-314D-4398-9E22-1E05952A3537, schema 5, ledger 17, with 17 accepted captured sessions. Its 26-check verification passed. The selector has two placement facts, zero instruction facts, zero exact edges and zero execution sessions. Its placed-not-executed label describes these stored facts. It does not establish non-execution in uncaptured play or dead code.

The two current placement facts are separate from the earlier offline atlas's 244 placements. Neither provides caller registers, target provenance or an input route. The global known-activity mechanism cannot recover target execution when the selected database has no target instruction fact. Historical suppressed events and unplayed content remain outside the package.

Leading interpretation: no qualified invocation exists in this selected captured corpus. Plausible alternatives include a reachable but unplayed path, invocation lost outside accepted observation coverage, or an unused routine. The frozen result does not distinguish these alternatives. One signature-qualified invocation falsifies an unused-routine hypothesis. Another finite miss does not establish it.

## Exact observation target

| Stable name | Meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Selector owner func_00201778 | Unsigned byte accessor; arguments unnamed | [00201778,00201798) | normalized z64 ROM | accepted function identity 3197 |
| Selector entry | Accepted descriptor-10 placement | 801BE2E8 / physical 001BE2E8 | KSEG0 / RDRAM | prospective exact entry trigger |
| Selector root word | Pointer loaded by the accessor | 801D0688 | KSEG0 RAM | must observe pointer and provenance |
| Selector return instruction | jr ra before the byte load | 801BE300 / ROM 00201790 | KSEG0 / z64 | existing focused return snapshot occurs here |
| Selector result load | lbu v0,0(v1), in return delay slot | 801BE304 / ROM 00201794 | KSEG0 / z64 | actual result appears only after this instruction |
| Selector data publisher | Raw resource base plus header entry +8 | ROM 00201C34..00201CAC | z64 instruction offsets | static root-publication chain |

The complete 32-byte entry signature is 3C03801D8C6306880004104000441021004510210062182103E0000890620000. The observation must check all bytes, not only the common first opcode 3C03801D. Source identity is normalized US Rev 0 SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A, CRC pair E6419BC5/69011DE3. The raw resource is key 00315736; copied bytes and header entry +8 establish the proposed data root. No argument-domain filter such as 0..2 is justified.

## Existing capabilities and exact gaps

| Required evidence | Existing capability | Remaining gap |
|---|---|---|
| Exact executed callsite, delay slot and actual target | Normal protocol-0.17 coverage records atomic call triples; other incoming transfers retain exact edges. | This can identify a positive caller only if the route executes under capture and placement is qualified. |
| Entry signature, RA and a0/a1 | Focused watches check exact signatures and retain full GPR state. RecorderSettings.focused_watches accepts exact ResolvedFocusedWatch objects. | Standard session CLI exposes only cutscene-studio-v1, excluding this selector. Use a bounded existing-API adapter with independently checked exact placement metadata. This is not an unavailable bridge feature. |
| Root pointer and selected address | A generic exec watch over the eight selector instructions records GPR state; the focused pre-return snapshot also records v1/v0. | At ROM 00201780, v1 is the loaded root. At pre-return, v1 is effective address and v0 is 3*a0+a1. These are sufficient machine-state views; a selected-byte snapshot is additional behavioral evidence. |
| Actual returned v0, if pursuing behavior | Focused return snapshot occurs immediately before jr ra's delay slot. | This owner's lbu result has not happened yet. A pre-delay v0 must not be labeled its return value. This extra observation is not required merely to identify caller/target origin. |
| Target-pointer origin | Atomic coverage identifies actual caller/target; generic recorder-owned exec/read watches retain registers and available memory-event values. | If the first observation does not expose the definition, inspect that caller's exact code and prepare one narrower follow-up. Instrument the particular definition/load and transfer path. Do not claim origin from RA alone or disconnected PCs. |

Source anchors: focused_capture.py lines 28–41 constrain pointer recipes; lines 136–194 define the only supported target/profile list; lines 204–216 reject another profile. pj64_client.py lines 450–502 exposes the lower-level exact focused-watch installation method. The parent bridge's regSnapshot, pushEvent, eventRecord, addWatch, addFocusedWatch and focusedPacket implement the stated packet/phase contracts.

RecorderSettings.watches and recorder.py lines 836–864 install generic WatchSpec entries, record their definitions, and retain recorder ownership. The bridge's pushEvent snapshots GPRs synchronously. The ordinary coverage stream supplies exact opcode/call/edge identity alongside these state packets. A bounded adapter can therefore use the existing generic path; it must not preinstall foreign watches because recorder preflight requires a pristine bridge.

There is no demonstrated generic-capability blocker to the consumer-provenance claim. The first observation may still be insufficient if the target came from an unobserved producer. In that case the exact missing definition becomes the next bounded watch target; each new run needs separate approval. Do not use asynchronous reads as event-time state, poll for RA then assume the tiny invocation waited, or create fabricated function ranges. Tail jumps need actual incoming-edge evidence. Interior entries need explicit entry-state coverage. Loss or unmatched invocations remain incomplete evidence.

Selected-byte and actual post-delay-result evidence serve a stronger behavioral interpretation. Current argument-pointer recipes accept only a0..a3 and cannot directly snapshot the selector's v1 target. A generic memory-read event may retain a value when supplied, but its callback phase must be checked before claiming the loaded byte. Once a caller/return destination is known and the route reproducible, existing generic watches can target the real continuation to capture post-delay v0. If this is not practically capturable, report that extra semantic limit; do not make it a precondition for identifying a caller.

## Read-only runtime readiness

The only live-related commands executed were documented read-only checks:

| Command | Result | Meaning |
|---|---|---|
| python -B -m tools.total_resolver doctor | PASS; optional historical R2 database SKIP | configured native source/binary and deployed bridge files authenticated; no live connection tested |
| python -B -m tools.total_resolver pj64 health --port 64656 | exit 2, connection refused | configured endpoint unavailable at this check |
| python -B -m tools.total_resolver pj64 status --port 64656 | exit 2, connection refused | current ROM/core/watch ownership cannot be read |
| python -B -m tools.total_resolver session status | latest session closed; workerAlive false | historical recorder worker is not active; not proof that all emulator instances are unowned |

The latest closed session is 20260828T033034.240275Z-edf668ed, ended 2026-08-28T03:36:06.939Z. It records protocol 0.16 and an older protocol017-r1 knowledge path. Its human label is Akka Castle Formation cutscene capture 2. Neither that label nor the old frontier replaces the selected r3 knowledge identity or supplies a selector trigger.

The authenticated configured executable is C:/Users/Joe/Projects/project64/Bin/Win32/Release_totalresolver_64656/Project64-TR-CallAware.exe. The deployed port is 64656 and required protocol is 0.17.0. A refused connection is an availability failure, not game evidence or permission to launch another instance. No process was started, stopped, enumerated for takeover, or controlled.

The verified master ROM is a legitimate existing input. Its availability and identity were checked in frozen r2; the future run must recheck the actual loaded ROM. No state/route with demonstrated selector execution is present in the assigned evidence. Broad savestate/ROM scans were not repeated, and no state was manufactured, loaded or modified.

## Conditional minimal run contract

This is a concrete adapter/run contract for a later assignment, not an approved run. Runtime availability and input selection remain missing prerequisites.

The first adapter configuration uses exactly one ResolvedFocusedWatch for function ID 3197, z64 [00201778,00201798), live [801BE2E8,801BE308), entry opcode 3C03801D and the complete signature above. Select sample mode all, no argument-pointer recipes, and zero stack words unless a concrete caller need justifies them. Resolve the retained placement and source metadata through read-only verified knowledge before constructing this object. Do not invent a registered profile or reuse an unrelated target's identity. Retain the explicit watch configuration in staging.

Add one generic exec WatchSpec over live [801BE2E8,801BE308), size 32, labeled selector-instruction-state. This yields bounded per-instruction GPR snapshots, including the loaded root at 801BE2F0, alongside normal exact instruction/call/edge coverage. Require signature-qualified entry and complete packet ordering for attribution; generic hits at a reused overlay address alone are not selector observations. This range covers interior entries as raw leads, without silently granting them a valid function-entry interpretation.

The entry snapshot plus the actual incoming call triple/edge is the first useful observation. Inspect the identified caller's ROM instructions and captured state. If they prove the last definition or load that supplied the exact target, the invocation/caller/origin claim can be submitted for review. Otherwise report the exact producer instruction or memory slot still missing. A second separately approved adapter adds only that caller's bounded definition-to-transfer range and any justified read watch. Do not expand to all-RDRAM or whole-program GPR capture.

1. After adapter review, the Director assigns one runtime owner and exact port.
2. The Director selects an authenticated vanilla input and a named gameplay route with Joe.
3. Joe approves that single bounded run before capture starts.
4. Joe launches the authenticated runtime through its supported launch path when it is unavailable.
5. The runtime owner repeats doctor, health, status, knowledge status and knowledge verify.
6. If ownership, ROM, protocol, interpreter core or evidence identity fails, the owner stops before capture.
7. The owner arms the reviewed observer before the named route reaches descriptor 10.
8. Joe performs the agreed route; the observation client injects no game input.
9. Stop after draining the first qualified invocation, the route's end, or five minutes, whichever comes first.
10. The five-minute budget is proposed; approval must name the final budget and route.
11. Stop immediately for epoch change, sequence loss, signature mismatch, ownership conflict or observer overflow.
12. Close and verify isolated staging with deferred ingestion.
13. Submit the immutable invocation package for semantic review before changing any accepted selector claim.

The provenance package must include ROM/runtime/protocol identities, session/epoch/sequence metadata, and contemporaneous full-signature placement. Retain the incoming instruction, executed delay slot, target and transfer kind. Entry state must include RA, a0/a1 and registers needed to reconstruct target provenance. Retain the loaded root and effective-address states from the selector instruction watches. Origin acceptance requires a connected definition/load-to-transfer chain with necessary register/memory values. If absent, the package is partial and identifies the next watch target. An interior entry must record its exact instruction and required initial registers.

The extra behavioral package requires the addressed byte, post-delay v0, actual return destination and first relevant use. These must be tied to the invocation; the pre-delay focused return row is not a substitute. Capturing all these fields can support a later behavioral-name proposal. It is not required to claim only that a qualified caller invoked this byte accessor through a proved target origin.

Generated evidence belongs in an assigned ignored build/total-resolver/ run directory. New facts remain live-unreviewed. A name, screenshot, controller state or marker supplies context only. Zero hits is a bounded negative result; incomplete pointer origin or post-delay state is partial evidence. None closes the current gate as dead code.

A normal deferred-ingest coverage run without the adapter could discover a first caller and narrow instrumentation. It would lack the selector's argument/root snapshots. The proposed bounded adapter uses existing APIs to add those fields from the outset. Neither method guarantees an invocation when the input route is unproved.

## Required user action and its source

The Director, not this preparation worker, handles any user request. Joe must approve each concrete capture run. This requirement is explicit in tools/total_resolver/AGENTS.md: "Joe must approve each capture run before it starts." The same guide says: "Never use computer control to start Project64." Joe may also need to identify a legitimate save/gameplay route and launch or drive the runtime. Those actions are necessary because no selector trigger route or reachable bridge is established here. Approval of preparation is not capture approval.

No permission question was sent to Joe. No capture command, session start/stop, GUI operation, memory read/write probe, watch installation or database mutation was attempted.

## Verification, evidence index and handoff

Ignored package: build/combat-selector-observation-preparation-r1/. checks.json records exact read-only commands and exit codes. doctor.txt, pj64-health.txt, pj64-status.txt and session-status.txt retain literal outputs. input-identities.json freezes capability inputs. artifact-manifest.json hashes this package, excluding itself. The predecessor retrieval hash matched; source contracts and the eight selector instructions were inspected. Report/claim identity, assigned path ownership, whitespace and ignored-output status were checked. No builds or runtime tests were run.

Failed paths: both documented bridge checks received connection refusal. They were not retried through another port or control channel. One source lookup used absent/literal-wildcard paths; corrected searches located recorder.py and sessions.py. One report patch failed context validation without changing the file, then succeeded with the correct context. There was no runtime workaround or protocol deviation.

Method refinement: initial inspection of the standard focused profile suggested a capability gap. Deeper inspection found recorder-owned generic WatchSpec and explicit focused-watch configuration already supported. The final method uses those APIs and separates caller/origin evidence from optional behavioral return evidence. This does not modify frozen r2 or claim a capture has occurred.

Changed surfaces: this report/log, its fresh permanent claim, and the assigned ignored output directory only. Prior reports, plans, inventory, production tooling/source, databases and other workers' edits are preserved. No agents, branches/worktrees, staging, commits or push.

Proposed canonical change: after independent review, record the capability/input prerequisites beside the existing selector gate. Preserve func_00201778's matching obligation and frozen r2 conclusions. The Director must route instrumentation/input readiness before seeking capture approval. This worker releases all writes with the terminal handoff.
