# tests

Tests for extraction, byte-order normalization, parser behavior, segment
splitting, and ROM compare tooling belong here.

Matching tests should compare generated outputs against local `baserom/` inputs
without requiring the ROM to be committed.

`node tests/diff_exactness.js` checks final linked-byte exactness independently
from asm-differ aliases. It also covers malformed target-section failures and
the final-linked-byte requirement for relocated targets.

Run the compiler-assembly dialect tests directly from the repository root:

```powershell
node tests/compiler_assembly_dialect.js
node tests/active_targets.js
node tests/source_policy.js
node tests/binutils_smoke.js
node tests/word_asm_smoke.js
```

Use a completed external Phase 8 build for the artifact and fail-closed suites:

```powershell
node tests/phase8_matching_c.js --output <phase8-output>
node tests/workflow_acceptance.js --output <phase8-output>
```

Compare the frozen pre-migration workflow with a completed external build:

```powershell
node tests/workflow_parity.js --old-root <frozen-workflow-root> --new-output <phase8-output>
```

The dialect suite covers numeric-register moves, line endings, hostile syntax, authentic hybrid
output, byte-identical passthrough, and deterministic proofs. Integration tests recreate proofs,
derive counts, reject stale schemas, and protect the `func_0002CD70` OR words.
