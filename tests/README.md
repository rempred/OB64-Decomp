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
node tests/multi_owner_text.js
node tests/multi_owner_phase8.js
node tests/func_002A0EF0_structure.js
node tests/local_tools.js
node tests/source_policy.js
node tests/binutils_smoke.js
node tests/word_asm_smoke.js
node tests/matching_workbench.js
node tests/compiler_text_functions.js
node tests/func_002861C8_structure.js
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
or missing reviewed relocation contracts, checks explicit compiler text-function partitions,
shared auxiliary-row coverage, the canonical-to-legacy migration bridge, and fail-closes malformed
logical multi-owner target censuses. `tests/multi_owner_text.js` proves that one relocatable function
can be split into preserved accepted owner sections without changing its instruction bytes, symbol
extent, relocations, or final linked bytes; it also exercises the GNU 2.6 cross-section branch
limitation and split-specific mutation controls.

`tests/compiler_text_functions.js` rejects missing, extra, moved, resized, exported, hidden, or
wrong-section compiler-local entries. `tests/func_002861C8_structure.js` pins the complete accepted
owner and control-flow census, distinguishes the internal-only `+0x134` entry from the externally
called local `+0x230` entry, and proves the six-entry compiler table plus final eight-byte assembly
tail.
`tests/multi_owner_phase8.js` activates only the logical target against the verified Phase 7
baseline with a generated exact `HYBRID_C` fixture. It drives both chunk prunes, one split object,
the real linker/map and proof path, and an exact complete ROM. The generated source is explicitly
test-only: it is not written to canonical target configuration and makes no matching-C claim.
`tests/func_002A0EF0_structure.js` independently checks the accepted target extent, sole direct
entry, sole return, successor boundary, every cross-owner control-flow edge, and the branch/delay
slot that straddles the preserved p5366/p5367 seam.

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
