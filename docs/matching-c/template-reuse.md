# Template reuse and the register-allocation oracle

Research tooling from the 2026-09-23 methods study (agent-mail threads
A1-001/A1-002). Both tools are scratch-only. Neither activates a target or
replaces the canonical gates. A function becomes matching C only through the
normal wave (`diff.js` per target, then one `verify.js`).

## Template reuse (`tools/matching_studies/template_reuse/`)

Retail duplicates some compiled functions across overlays. Their instruction
words are identical except for fields that depend on placement: absolute jump
targets, and sometimes a call or data address. When one copy already has an
accepted PURE_C source, that source can often be reused for the others.

| Step | Command | Output |
|---|---|---|
| Census | `node tools/matching_studies/template_reuse/skeleton_census.js` | `build/template-reuse/skeleton-census.json` |
| Pair analysis | `node tools/matching_studies/template_reuse/pair_diff.js` | `build/template-reuse/pairs.json` |
| Instantiate + scratch gate | `node tools/matching_studies/template_reuse/instantiate.js` | `build/template-reuse/{instantiation-results.json,candidates/}` |
| Adversarial controls | `node tools/matching_studies/template_reuse/adversarial.js` | `build/template-reuse/adversarial-results.json` |
| Link-check fixtures | `node tests/template_reuse.js` | pass/fail |

Skeleton levels, used for retrieval only: S2 compares words after masking
immediate and jump fields. S1 renames registers consistently. S0 compares
opcodes only. An S2 twin is a lead, not proof of equivalence.

`pair_diff.js` classifies each differing retail word as one of:

- an internal jump, which must land at the same function-relative offset;
- an address remap, a relocated call or data reference resolved through the
  accepted placement;
- a literal difference, which is always left unresolved.

Ambiguity fails closed.

The scratch gate G1 requires all of these:

1. the source policy classifies the candidate as PURE_C;
2. the candidate object text equals the donor object text;
3. the relocation records equal the donor's under the symbol map;
4. `link_check.js` passes. It places the candidate at the target's entry VRAM
   using only registered or accepted addresses, and applies placement rules
   for overlays, load slabs and early-boot code. Every retail word must match.

G1 is research evidence. For activation, add the target to
`config/matching-c-targets.json` and take its relocation contract from the
candidate's own compiled object. Then run `diff.js` per target and one wave
`verify.js`.

First results:

- Wave 1 (`cf163c96`) accepted five functions: `func_001EA40C` and
  `func_001CE174` (overlay copies of combat-draw functions), `func_001E9E00`,
  `func_001F9170` and `func_0022431C`. The three global-clear wrappers
  (`7aba960c`) were accepted in the same study.
- Two G1 candidates are blocked by gates outside ordinary matching:
  - `func_000E595C`: its accepted owner row is 12 bytes but the function
    body is 8 bytes.
  - `func_0006f47c`: the raw linked-target load-header check matches headers
    by VRAM. Overlays 1 and 15 both place an owner at 0x8019898C, so the check
    finds two.

## Register-allocation oracle (`tools/matching_studies/regalloc_oracle/`)

`patch_gcc.js` copies the pinned KMC GCC 2.7.2 source into
`build/regalloc-oracle/gcc` and instruments `global.c` and `local-alloc.c`.
It then relinks `cc1-oracle.exe`. Set `OB64_KMC_GCC_SOURCE` and
`OB64_VCVARS` if they differ from the defaults. The hooks are controlled by
environment variables and do nothing unless set:

- `OB64_RA_TRACE=<file>`: per-pseudo allocation, allocno and quantity
  priorities, and the pseudos used by each insn;
- `OB64_RA_FORCE=<file>`: lines of the form `FUNC REGNO HARDREG`, which
  override `reg_renumber` just before reload;
- `OB64_RA_DP=1`: adds insn UID comments to the assembly.

`parity.js` must report no differences before any oracle result is trusted.
At commit time it covered 298 inputs with tracing on: 293 identical, 5 failing
identically under both compilers.

`force_check.js` maps retail register differences to pseudos. It aligns object
words with UID-annotated assembly, forces the retail assignment, and grades
the result against the accepted source's object and relocations. The
`--reference` option gives a reference-identical verdict.
`perturb_batch.js` generates scrambles that preserve semantics: sound
statement swaps and commutative operand swaps.

Findings on 24 active exact functions:

- Most sound source edits don't change the output: 31 of 38 compiled
  reference-identical.
- Allocation-only residuals were rare. One of the seven non-identical
  variants was reproduced by forcing registers.
- The rest were instruction-order effects.

Forced output is only a diagnostic. It never counts as a source solution.
