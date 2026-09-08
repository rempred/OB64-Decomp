# Copyable Pro research request

Investigate three remaining pure-C matching problems in the US Rev 0 Ogre Battle 64 decompilation. Start with this published handoff and follow its source/report links:

https://github.com/rempred/OB64-Decomp/blob/main/docs/research/w8-pro-research/README.md

Read the evidence brief, repository AGENTS.md, docs/WORKFLOW.md and docs/SOURCE_POLICY.md, then the current C, included headers and original assembly for func_001F3C00, func_001F6098 and func_0020DB10. Use source baseline commit 3815708b and check the source hashes in the brief. If repository access fails, say which files could not be read instead of inferring their contents.

We need new, technically grounded source hypotheses and experiments for a local matching worker. The compiler is pinned KMC GCC 2.7.2, not modern GCC. Existing work already includes allocator instrumentation with candidate-specific output agreement, guided decomp-permuter experiments, m2c/Kuna comparisons, and extensive lifetime/type/loop variations. Research relevant historical compiler implementation or primary documentation where it could resolve a specific uncertainty. Cite precise repository evidence and external primary sources separately.

Prioritize:

1. 3C00: whether the useful final command-cursor lifetime interaction found in R7 can transfer to the preserved D037 best source context. Distinguish the actual packet endpoint, primary row, tile and strip values from physical register reuse.
2. 6098: the unexplained 48-byte frame gap and two groups of three unused retail stack positions, separately from remaining geometry/texture-row lifetimes. The current candidate has 23 accessed homes and no COMBINE_USE events.
3. DB10: the 552-versus-560 frame gap and the independent outer actorIndex clear versus five array-base setup instructions. Three comparison-only homes are explained in the current candidate; a failed 560-byte-frame candidate merely adds an accessed latch spill. Correct biased machine address bases must not be translated into invalid one-before-array C pointers.

Do not just recommend “trace the allocator,” “use a permuter,” “try different scopes,” or “make a smaller reproducer.” Specify what new information or source relationship the proposal tests beyond the preserved experiments. Missing local build artifacts are not accessible from their hashes; request only an exact bounded excerpt if it would change your conclusion.

For each of at most five ranked proposals, provide:

- Target and exact current source region, with a source link.
- Relevant observed facts and citations, distinguished from your hypothesis.
- The earlier closest experiment and the substantive difference in this proposal.
- A small conceptual C change or precise experiment specification; preserve real operations, value domains, evaluation requirements and defined behavior.
- Predicted observable consequences: compiler stage, allocation class, actual spill/access pattern, instruction order, extent, relocations or byte comparison. Include outcomes that would weaken the hypothesis.
- The smallest local run or evidence excerpt required, and what remains uncertain without it.

Supported multi-step experiments may pass through worse intermediate results; a worse score alone does not disprove a source structure. Preserve current best candidates. Reject fabricated padding, dummy references, inline assembly, register bindings, invented callee effects, symbol-specific tool exceptions and changes to accepted boundaries, compiler identity or linker rules. External decomp source expression, comments or config must not be copied into the canonical repository. External work may identify facts or hypotheses for independent verification.

Return a concise evidence-backed recommendation and an explicit list of unresolved questions. Do not claim matching from a heuristic score, right frame size, or plausible C. Only the local canonical gates can establish PURE_C classification, sole ownership, placement, actual relocations, exact target bytes and exact complete ROM. All fourteen W8 targets remain one final verification wave. This research request does not authorize repository writes, production compiler changes or runtime captures.
