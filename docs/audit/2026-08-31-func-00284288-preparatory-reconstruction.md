# `func_00284288` preparatory reconstruction

## Scope and evidence boundary

This is the successor research phase for the accepted single function at ROM
`0x00284288..0x002861C8` and live range
`0x802282B8..0x8022A1F8`. The 8,000-byte boundary, one-function identity,
placement, and assembly owner are unchanged. The frozen E8EB93F candidate and
its dossier were inputs only and were not amended.

All results below are static retail, accepted-source, linkage, compiler, or
scratch-object evidence. They do not prove semantics, linked C ownership,
Matching C, or complete-ROM identity. No full-ROM build or verifier was run.

## Durable and generated artifacts

- `docs/audit/evidence/2026-08-31-func-00284288-preparatory/case-cfg-map.json`
  is the reviewed dispatch contract.
- `docs/audit/evidence/2026-08-31-func-00284288-preparatory/command-map.csv`
  is the compact 153-command ledger. It records retail ROM/live entry, region
  blocks, entry successors, cursor/stream facts, calls, memory accesses, shared
  exit, and successor-skeleton comparison fields.
- `docs/audit/evidence/2026-08-31-func-00284288-preparatory/prototype-ledger.csv`
  reconciles all retail direct-call sites.
- `docs/audit/evidence/2026-08-31-func-00284288-preparatory/coverage-summary.json`
  contains machine-readable coverage and whole-function retail metrics.
- `build/matching/targets/func_00284288/research/` holds the bulky command
  evidence, complete case-CFG reports, annotated skeleton, compiler input, and
  m2c reproduction outputs. It remains ignored.

## Command map

The accepted dispatch was symbolically executed from offset `+0x0080` to the
first body at `+0x0894`. The command word is in `$v1`; `$s6 = 2` and `$s7 = 1`
are the only fixed nonzero dispatch inputs. A command fails closed if a branch
condition requires an unknown register, an unsupported control form occurs, or
the route escapes the declared bounds. Shared body entries are permitted; each
command still has one deterministic retail entry.

Coverage is 153/153 commands. All have retail ROM/live entries, region blocks,
entry successors, calls, memory/global observations, and an exit/tail result.
Static cursor analysis found one fixed argument-slot count for 141 commands.
The remaining 12 are explicitly unknown or path-variable:

`0x1C`, `0x2A`, `0x2C`, `0x59`, `0x7D`, `0x92`, `0x95`, `0x96`, `0xBB`,
`0x80000000`, `0x80000001`, and `0x80000003`.

Stream slots are four bytes: retail forms the current address from `cursor * 4`
and the exact neighboring `func_002861C8` accepts `s32 *stream`. Narrow
signed/unsigned reads are recorded only when a direct retail load supports
them. Other signedness remains `unknown`; the map does not infer command
semantics from layout alone.

## Prototype and data-model audit

Retail contains 145 direct external call instructions, zero indirect calls, and
137 unique callee labels. The ledger represents all 145 sites. Each row records
the canonical assembly label/address, accepted target metadata when uniquely
available, active matching-source linkage, predecessor declaration, strongest
repository definition, call-site argument registers/stack slots, return use,
and an evidence-strength class.

- 18 unique callees have strong accepted/fixed-neighbor C-definition evidence.
- 119 retain weak predecessor-declaration plus retail ABI evidence.
- No call site or callee is absent from the ledger.
- 70 overlay-runtime call sites cannot be mapped uniquely to a fixed accepted
  target entry because the live overlay address alone is not a unique ROM
  owner. Their labels and call-site ABI remain recorded; their types are not
  strengthened.

Fourteen predecessor declarations differ materially from the strongest
definition. The successor adopts supported no-argument declarations for
`func_0001a050`, `func_00283654`, `func_00283694`, `func_002836A4`,
`func_00283740`, `func_00283B30`, and `func_0029C19C`; it also adopts supported
return/width information for `func_00283E14`, `func_00283FA8`,
`func_0029D790`, `func_0029DF04`, `func_002A053C`, and `func_002A05DC`.

`func_002A08C0` is intentionally mixed evidence. Its accepted callee definition
has eight parameters and an `s32` return, but retail materializes five stack
arguments in addition to `$a0..$a3`: nine caller arguments. The successor keeps
the ninth `s32` call argument and adopts the supported `s32` return and first
eight parameter types. Dropping the ninth argument would contradict the call
site even though the callee body does not consume it.

The successor's central model is limited to facts supported by retail and the
exact `func_002861C8` control:

- `stream` is `s32 *` and `cursor` is a signed word index;
- the six-word local parser state names word 0 as `nesting`, word 3 as
  `stop_requested`, and word 5 as `scan_mode`;
- words 1, 2, and 4 remain unknown; and
- central result, scan-mode, command-address, and cursor-byte-offset variables
  are named by their observed roles. Per-command m2c temporaries remain pending
  deliberate reconstruction.

No independently supported behavioral name was strong enough for a
`SUPPORTED_ALIAS`; the symbol remains `func_00284288`.

## Source policy and inactive ownership

`node tools/source_policy.js --target func_00284288` exits 1 with
`target does not resolve uniquely`. This is the tool's fail-closed wording for
zero matching entries as well as multiple entries: `func_00284288` is
intentionally absent from `config/matching-c-targets.json`, so no research
candidate is active. Direct use of the same authenticated classifier records
the canonical owner as `ASM` and the preserved successor source as `PURE_C`.
This separation is intentional and does not promote the successor.

## Case-aware CFG comparison

The reusable `match.js case-cfg` command aligns retail and a compiled candidate
at each command entry and named shared tail. It normalizes candidate
section-local `R_MIPS_26` jumps, resolves external calls by relocations/symbols,
and compares register-independent opcode/edge signatures. It reports expected
and actual entries, block counts, calls, successors, unmatched blocks, and
shared-tail convergence. Unknown dispatch decisions fail closed.

For successor candidate
`9ED0FDEE460C920DC9A3906DE125591A33055CC4F0175249790959EFBB8FFD16`:

- command mapping: 153/153;
- successor parity: 153/153;
- shared-tail convergence: 153/153;
- block-count parity: 125/153;
- call-symbol parity: 152/153;
- normalized block parity: 70/153; and
- per-command region totals: retail 1,007 blocks/291 calls versus candidate
  999 blocks/289 calls.

Those region totals intentionally count shared interior regions once per
command and are not whole-function metrics. The full report is
`build/matching/targets/func_00284288/research/structured-skeleton-case-cfg.json`.

The 28 commands with block-count differences are:

`0x0E`, `0x12`, `0x21`, `0x2A`, `0x2C`, `0x2D`, `0x30`, `0x3C`, `0x3E`,
`0x40`, `0x4E`, `0x54`, `0x5C`, `0x5D`, `0x77`, `0x7F`, `0x87`, `0x8E`,
`0xA5`, `0xB1`, `0xB5`, `0xBE`, `0x80000000`, `0x80000004`, `0x80000006`,
`0x80000007`, `0x80000009`, and `0x8000000A`.

All 83 commands with a normalized-block mismatch are enumerated by the
`normalized_block_parity` column of the command map; retaining that list in the
CSV avoids duplicating a changing research matrix in prose.

The sole per-command call-list mismatch is the path-expanding
`0x80000000` region, which can re-enter the parser loop. The concrete local call
discrepancy is command `0x5D`: retail owns a distinct
`func_8023BF30`/`func_802396DC` pair at ROM `0x002854FC/0x00285504`, while the
candidate cross-jumps to the pair emitted for the `0x80000006` path at candidate
offsets `+0x1DDC/+0x1DE4`. Thus command-level call symbols agree for `0x5D`, but
the whole candidate has two fewer call instructions.

## m2c label/delay-slot result

The failure is reproduced against pinned m2c commit
`3478473441a1e6da75d6bf07629452f410390ef4` (tree
`3943f2fb966096365ca19d888a85f7a0386aac17`). Removing the repository's four
analysis-only guards makes m2c exit 1 with:

`Label ._m2c_.L_8022A178before refers to a delay slot; this is currently not supported.`

The guarded input exits 0. The narrow existing adapter is therefore justified:
it inserts an analysis-only `nop` before `.L_80229E80`, `.L_80229E8C`,
`.L_80229E98`, and `.L_8022A178` when the IDO likely-branch/call-delay pattern
is present. It does not change retail bytes, canonical assembly, or candidate C.
The fixture is
`tests/fixtures/matching/func_00284288-m2c-delay-slot.json`; the reproducer is:

```text
node tools/reproduce_func_00284288_m2c_delay_slot.js --m2c-root <pinned-m2c-checkout>
```

## Structured successor and blocker

The successor skeleton is preserved at
`docs/archive/matching-c-candidates/2026-08-31-func_00284288-9ed0fdee46.c`.
It is `PURE_C` scratch source, keeps the one accepted function boundary, uses
the audited central data model/prototypes, and is paired with the 153-command
map rather than claiming recovered command semantics.

Whole-function retail metrics remain 2,000 instructions, 583 blocks, 958 edges,
and 145 calls. The successor emits 2,000 instructions in 8,000 bytes but has 578
blocks and 143 calls. It differs in 1,892 instructions/6,626 bytes and remains
`cfg-mismatch`.

The immediate 583/145 blocker is the pinned KMC GCC 2.7.2 cross-jump described
above. The frozen predecessor phase already tested structured/goto ordering,
wrapper, declaration, expression, common-label, duplicate-call, and tail-shape
families without retaining distinct call sites. This phase did not resume broad
shape guessing. The case-aware result also shows that removing the cross-jump
would fix only the two missing calls and five whole-function blocks; it would
not explain the 83 command regions with normalized block differences or the
1,892 instruction mismatches. Deliberate reconstruction should proceed through
those localized rows before any register-allocation or scheduling work.
