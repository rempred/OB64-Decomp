---
task_id: combat-selector-external-transfer-retrieval
revision: 1
status: completed
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-SELECTOR-EXTERNAL-TRANSFER-RETRIEVAL-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-selector-external-transfer-retrieval-r1.claim.json
---

# Retrieve encoded external direct-transfer candidates for the selector

Use Sol High in eligible retrieval worker /root/combat_data_retrieval.
Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988, local.
Read both AGENTS.md files and parent docs/Worker-workflow.md.
This assignment is literal retrieval and parsing only. Do not establish caller semantics or new placement.

Determine whether existing frozen records already enumerate encoded J/JAL words outside descriptor 10 for all selector instructions.
If that exact wider search is already recorded, authenticate and return its bounded result without repeating it.
Otherwise retrieve the four-byte-aligned J/JAL encodings for RAM 801BE2E8..801BE308, end exclusive, from the complete verified normalized ROM.
Those are the eight instruction addresses of func_00201778, z64 ROM 00201778..00201798.
State the address-region assumption in constructing J-type target encodings; a raw word match is not an established transfer.
For each hit, record its exact ROM offset, raw word and any already-recorded owner/section/placement fields.
Distinguish hits inside the previously searched descriptor-10 text from hits outside it. Retain data or unclassified hits explicitly.
Do not infer that an external hit executes with the selector loaded, is reachable, or calls the selector.
If there are no hits, report only the exact encoding/alignment/ROM search result; do not infer selector non-use.

Accepted discovery: 1f68aa0 reviewed at 024a971; docs/Plans/combat-discovery-r2.md and build/combat-discovery-r2/selector-evidence.json.
Its published direct-edge census is bounded to descriptor-10 text; verify the actual evidence fields before extending that boundary.
Accepted later inputs: publication correction 99a793b / review 242af7f and JR research 3d485f0 / review da01b8d.
Those preserve external and dynamic origins as unresolved. Do not repeat their table, JALR, pointer-literal or decoded-resource investigations.
Reuse an exact prior wider result if found. Do not perform a general corpus search or indirect dataflow research.
Original ROM identity and unchanged accepted structural records control this retrieval. Current matching inputs are excluded.

Create the fresh claim atomically before writes, recording receiver, Director, host, launch and input identities.
Own only that claim, docs/Plans/task-logs/combat-selector-external-transfer-retrieval-r1.md and ignored build/combat-selector-external-transfer-retrieval-r1/.
Bounded parsers under the output root and in-memory ROM normalization are permitted. Keep generated bulk evidence ignored.
No source/config changes, compiler execution, linking, build, verifier, source-policy generation, runtime, GUI, bridge or database operations.
No capture, queue, recovery or ingestion. No technical acceptance or canonical semantic propagation follows from raw candidate retrieval.
You are not alone; preserve W7's sole production writer and every disjoint change. Do not revert others' work.
No agents, staging, commits, push, branches or worktrees. Preserve all frozen terminal records.
Return exact records, input/search boundaries and any missing fields directly to /root through collaboration.
Never use native app sends/readbacks. Release all writes at terminal handoff.
