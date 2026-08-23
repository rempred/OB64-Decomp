# tests

Tests for extraction, byte-order normalization, parser behavior, segment
splitting, and ROM compare tooling belong here.

Matching tests should compare generated outputs against local `baserom/` inputs
without requiring the ROM to be committed.

`node tests/diff_exactness.js` checks final linked-byte exactness independently
from asm-differ aliases. It also covers malformed target-section failures and
the final-linked-byte requirement for relocated targets.

Run the toolchain and source-policy tests directly from the repository root:

```powershell
node tests/active_targets.js
node tests/local_tools.js
node tests/source_policy.js
node tests/binutils_smoke.js
node tests/word_asm_smoke.js
node tests/matching_workbench.js
```

`tests/matching_workbench.js` covers deterministic mismatch classes,
collision-safe family grouping, exact target/context fixtures, store
idempotence and rollback, canonical-source/provenance separation, retry after
failed compilation, atomic compile-plus-comparison insertion, compiler-probe
comparison, the m2c adapter, narrow post-generation transforms, shared
generation/compile reuse, per-function ruleset-ensemble attribution, and
bounded default sweep/selector output.
It uses a temporary SQLite database for mutation tests.

When the local baserom, pinned m2c checkout, compiler, and GNU tools are
available, also run:

```powershell
node tests/matching_workbench_integration.js
```

The integration fixture authenticates the real local m2c/KMC/GNU chain,
generates and scratch-compiles `memcpy_bytewise` to exact bytes, exercises a
multi-ruleset preparation with shared generation/compilation, and verifies
cached repetition without losing ruleset provenance. This is deliberately not
a substitute for canonical linked/full-ROM verification. Sweep resume and
membership behavior are covered by the unit suite above.

`tests/active_targets.js` also validates the shared matching-C symbol registry, rejects malformed
or missing reviewed relocation contracts, and checks the canonical-to-legacy migration bridge.

Use a completed external Phase 8 build for the artifact and fail-closed suites:

```powershell
node tests/phase8_matching_c.js --output <phase8-output>
node tests/workflow_acceptance.js --output <phase8-output>
```

Compare the frozen pre-migration workflow with a completed external build:

```powershell
node tests/workflow_parity.js --old-root <frozen-workflow-root> --new-output <phase8-output>
```

The GNU 2.6 suite authenticates the complete production bundle and covers historical
numeric/named-register moves, explicit retail OR, ordinary-C COP1 forms and the uppercase-prefix
falsifier, calls and relocations, custom sections, macros/conditionals, linker LMA/`PT_LOAD`
behavior, binary extraction, an exact tracked assembly chunk, and retired-dependency rejection.
Integration tests recreate source-to-object proofs, distinguish load-relevant from discarded
ancillary relocations, reject stale schemas, and protect the `func_0002CD70` OR words.
