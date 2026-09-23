# Compiler-generated curriculum and retrieval

This research tool turns existing active C sources into fresh C/assembly/object pairs using the unchanged, authenticated KMC compiler and the normal source-policy/preprocessing pipeline. Its first use is exemplar retrieval. It does not train neural weights or establish new matching-C acceptance.

```powershell
node tools/matching_studies/compiler_curriculum/build.js --limit 16 --max-bytes 1024
```

The bounded, sequential build reuses one prepared compiler session. It selects active sources deterministically, cycling through straight-line, branch and call examples rather than exhausting small leaves first. It admits only mechanically classified `PURE_C` input and supported complete scratch targets, and retains exclusions and failures. Use `--symbols symbol,symbol` for an explicit sample. Generated data goes into a fresh ignored `build/compiler-curriculum/<run>/` directory; existing runs are preserved.

Each example records authored C, untouched compiler assembly, object text and relocations, target bytes, preprocessing identity, tool identity and the scratch provenance. Curriculum stages distinguish straight-line code, control flow and calls/context. These are observations of compilation, not inferred source histories.

The exporter writes:

- `training.jsonl`: examples available to the retrieval system.
- `evaluation-queries.jsonl`: held-out queries with target bytes and identities, without their C/assembly answers.
- `evaluation-answers.jsonl`: evaluator-only answers; do not supply this file to a solver.
- `manifest.json`: inputs, compiler identity, bounds, timings and every outcome.
- `retrieval-evaluation.json`: retrieval availability and ranked donor identifiers; recovery remains unmeasured.

Whole functions/aliases, duplicate source, duplicate object or retail bytes, and the existing opcode/CFG family representation are grouped transitively before assigning five deterministic folds. Fold zero is held out. This blocks known twins from appearing on both sides of this export's split. Freeze a run for evaluation: adding examples can merge groups and change a subsequent export's split. This is not a guarantee against all semantic clones or prior model knowledge.

```powershell
node tools/matching_studies/compiler_curriculum/retrieve.js <run>/training.jsonl <run>/evaluation-queries.jsonl <symbol>
node --test tests/compiler_curriculum.js
```

Retrieval ranks opcode n-gram overlap and reports ordinary-C examples with their compiler assembly. The held-out command excludes the target, aliases, duplicate source/object/retail bytes and its structural family. Similarity is only a proposal signal: equal opcode sequences may still differ in constants, address identity or behavior. A score of one is never an exactness result.

Template-transfer experiments are owned separately under `tools/matching_studies/template_reuse/`. Their proposed substitutions require qualified address/relocation evidence and unchanged-compiler verification. A fresh source/object pair here does not revalidate the source's canonical linked/full-ROM acceptance. Production matching retains all ordinary source, ownership, placement, relocation and complete-ROM gates.

The initial joint choice with GoldOx is shared template recovery plus this compiler-verified curriculum/retrieval corpus. Full neural training and general inverse-compiler synthesis are deferred until bounded transfer results justify them. SLaDe demonstrates small-model decompilation but trained each model for 72 hours on four A100s; LLM4Decompile's published metric is test re-executability, which differs from OB64 matching-byte acceptance. See [SLaDe](https://arxiv.org/abs/2305.12520) and [LLM4Decompile](https://github.com/albertan017/LLM4Decompile).
