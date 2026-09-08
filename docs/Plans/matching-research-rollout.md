# Project-wide matching research intake

Joe authorized this rollout on 2026-09-08 after identifying the gap between the accepted W8 pilot and routine use across the project. The [earlier repair/reuse plan](probe-repair-and-w8-reuse.md) remains complete; this assignment integrates its general capabilities into future matching.

Status: complete and accepted at `8191ed57` plus read-only correction `1eb6d68e`, with [independent review](task-logs/matching-research-rollout-review-r1.md). All implementation and review writes/processes are released. General matching intake and recording guidance now apply across the project on current `main`. Director's final hash check confirms all twenty restored W8 inputs remain unchanged. Commits are local and unpushed.

The [implementation report](task-logs/research-intake-rollout-r1.md) records the passing workbench suite, focused intake controls, prepare/watch output checks, and a real packet cache hit that picked up a new observation with no decompiler invocation. General matching guidance is in AGENTS.md and WORKFLOW.md; reference commands are in MATCHING_WORKBENCH.md and ANALYSIS_PACKETS.md. Guarded local-store reads leave files unchanged; pending writes or unsupported platforms make that optional supplement unavailable while archive discovery continues. The current 427 MB store took 6.819 seconds to inspect with the full guard.

## Deliverable

- A no-codegen `match.js intake <symbol>` discovers relevant archived observations on a fresh checkout and supplements them from an existing optional local store without creating one.
- Existing matching preparation/watch results and standalone analysis packets automatically present fresh prior experiments. Packet cache hits refresh this presentation without changing cached decompiler inputs, results or integrity checks.
- Records distinguish authored claims from authenticated source/target/dependency/reference identities. Missing history is normal; stale, malformed, mismatched and unavailable evidence is explicit. Optional history errors do not become compilation or decompiler acceptance gates.
- An optional identity-capture import path removes manual hash bookkeeping. Concise project-wide instructions cover consulting history and recording useful pairs, intermediates and counterexamples.

## Completion checks

Exercise discovery for multiple accepted target families, tracked-only history with no database, malformed/stale/foreign records, grouped-target read-only history, and records added after a cached analysis packet. Preserve existing group import/compile restrictions, raw decompiler inputs, source-policy and compiler contracts, and normal matching gates. Use focused tests, relevant integration checks and independent tooling review. No general reducer, new database schema, historical migration, production source experiment or full-ROM verifier is included.

Commit coherent completed work locally. This assignment supplies no new push authorization. W8 matching and the complete Combat → Squad → High Attack program remain outstanding under the sequential program.
