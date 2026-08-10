# KMC `la` plus direct `jal` dialect structural evidence

Worker status: all assigned implementation and verification gates passed. Independent structural
review is still required before this change is treated as accepted canonical evidence.

## Scope and starting baseline

The worker observed HEAD `67ccd027e4f1bde87bde37e02a2ae0021c63cadd` and a clean tracked
working tree before editing. The branch was `main`, ahead of `origin/main` by 16 commits. No reset,
clean, branch change, or unrelated-file edit was performed.

The authenticated starting identities matched the assignment:

| Item | Observed SHA-256 |
|---|---|
| Schema-1 dialect manifest | `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331` |
| Starting dialect implementation | `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12` |
| Exact Rev 0 ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

The tracked p3064 source was not edited. Its before-and-after SHA-256 is
`C8FB860DF5234A8DCF563F05F767BAA35108DF27A110E845810726B167D66081`.

## Implemented contract

The compiler-assembly dialect is now schema 2 with identity
`kmc-compiler-assembly-dialect-v2` and these ordered rules:

1. `move-numeric-gpr-gpr-to-addu-zero`;
2. `la-gpr4-undefined-bare-symbol-direct-jal-delay-slot`.

The first rule retains its complete numeric-register `move $N,$M` to `addu $N,$M,$0` behavior.
The second rule is target-blind. It recognizes only an unlabeled bare-symbol `la $4,symbol` whose
next emitted statement is an unlabeled direct bare-symbol `jal target`, where the address symbol is
undefined in the translation unit and the effective assembler state is reorder, macro, and
nonvolatile. The authenticated manifest independently pins the compiler and GNU assembler
identities, accepted non-PIC/no-abicalls/`-G0`/MIPS3/gp32 configuration, and production flags.

The emitted sequence is:

```asm
.set noreorder
lui   $4,%hi(symbol)
jal   target
addiu $4,$4,%lo(symbol)
.set reorder
```

The temporary mode guard prevents GNU assembler 2.39 from moving the explicit delay-slot
instruction and restores the only eligible prior effective mode, reorder. Valid excluded
sequences remain byte-identical. Malformed or dangerous syntax and unsupported statement or mode
forms fail closed.

Proof schema 2 records the dialect identity, ordered rule identities, manifest and implementation
hashes, total transformations, and per-rule transformations. Strict verification independently
recreates the adapted assembly, section-adjusted assembly, proof, object verdict, and target
verdict. Aggregate reports derive per-rule totals from unique verified target proofs.

`HYBRID_C` remains opaque byte-identical passthrough with zero total and per-rule transformations.
`UNKNOWN` and `ASM` reject, as do pure outputs with inline-assembly markers.

## Direct observations

- The final dialect manifest SHA-256 is
  `666B6A863B8DAC10BB85774D66D9E536DED393FD706A1EF233539ACEBBB6D9EA`.
- The final dialect implementation SHA-256 is
  `1598CDDD50ED22EFE33FDC76322D6D305A0A43110C35F5BB8BFDD7206420919C`.
- GNU assembler remains `GNU assembler (GNU Binutils) 2.39`, SHA-256
  `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697`, with
  `-EB -mips3 -32`.
- The minimal positive emits bytes `3C0400000C00000024840000` and logical relocations HI16 at
  `0x0` to the address symbol, MIPS26 at `0x4` to the call target, and LO16 at `0x8` to the address
  symbol.
- The authenticated generated candidate recorded 36 move transformations and four new-rule
  transformations. Its adapted assembly SHA-256 is
  `BD6F1386EB0CB27AD891F87A8F3A6D56D14A7EB228E700D3BACC7BCF7A8DA53E`.
- That candidate assembled to 372 instructions and 1,488 `.text` bytes with SHA-256
  `98106A16C7A6F9C0120168E216C3D2FF0EE0006352AB834F4D5C6C1E05F7C047`.
  It had zero instruction-word differences from the authenticated historical KMC object and 71
  logically identical `.rel.text` entries by offset, type, and resolved symbol.
- The generated candidate's one `la $4`; `sw`; direct `jal` control remained unchanged and was
  recorded in the candidate report. Raw ELF objects were not byte-identical.
- The canonical generated report records 37 active targets: five `PURE_C` and 32 `HYBRID_C`.
  It records 17 existing move transformations and zero new-rule transformations. Generated status
  remains authoritative for these changing counts.
- p3063 remains exact `PURE_C`, with exactly 14 move transformations, zero new-rule
  transformations, and linked-target SHA-256
  `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.
- `func_0002CD70` remains exact `HYBRID_C` passthrough. Both protected words remain
  `0x00801025`; its linked-target SHA-256 is
  `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.
- Canonical p3064 remains exact `HYBRID_C` passthrough with zero transformations under both rules.
  Its raw and adapted compiler assembly share SHA-256
  `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC`; its linked target SHA-256
  is `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B`.
- Every active target remained exact, and the complete rebuilt ROM remained byte-identical to the
  authenticated Rev 0 ROM.

## Interpretation

The authenticated historical KMC assembler behavior supports only the implemented adjacent
external-symbol `$4` plus direct-`jal` subset. GNU assembler 2.39 remains the production assembler;
the historical KMC assembler is only the authenticated behavioral oracle.

`-O2` remains the pinned production compiler configuration. It is not a demonstrated historical
eligibility requirement: the independently reviewed KMC `-O0` case also performed the swap.

Instruction words and logical relocations are the relevant cross-assembler evidence. Raw ELF
identity is intentionally not required because the authenticated KMC and GNU objects differ in
container metadata, physical relocation ordering, symbol indices, `.pdr`, flags, alignment, and
section layout.

## Remaining limits

The rule does not cover other registers, local address symbols, labeled statements, `jalr`,
intervening emitted statements or directives, noreorder or nomacro input, expressions/addends,
unsupported relocation syntax, PIC/GOT/GP-relative/small-data/MIPS16/Release 6 or unverified ABI
modes, or dependency and hazard shapes outside the authenticated subset.

The frozen external candidate is generated evidence only. It was not copied into the repository,
the diagnostic script was not copied or promoted, canonical p3064 was not activated or classified
as `PURE_C`, and this work does not claim p3064 complete.

## Verification commands and exit codes

These commands were run from the repository root. Every listed command exited `0`.

```text
node tools\source_policy.js
node tests\source_policy.js
node tests\active_targets.js
node tests\compiler_assembly_dialect.js
node tests\binutils_smoke.js
node tools\build.js
node tests\phase8_matching_c.js --output C:\Users\Joe\.codex\ob64-decomp-current\current\35e6ed6e8c6bf98b82845cb3\build
node tests\workflow_acceptance.js --output C:\Users\Joe\.codex\ob64-decomp-current\current\35e6ed6e8c6bf98b82845cb3\build
node tools\verify.js
node tools\audit.js
git diff --check
```

The authenticated full-candidate command was:

```text
node tests\compiler_assembly_dialect_candidate.js --compiler-assembly "C:\Users\Joe\.codex\ob64-p3064-allocator-diagnostic-20260809-r1\rtl-inspect\best.compiler.s" --historical-object "C:\Users\Joe\.codex\ob64-p3064-xp-vm-setup-20260809-203842-32227774d9f6\runs\guest-attempt2\extracted\FULL\full.o" --output "build\compiler-assembly-dialect\authenticated-full-candidate" --expected-compiler-assembly-sha256 A66BD7D20ED211A89010CCF16A974E753FCBFE5C546A9F7AFE51B79B74776BD9 --expected-text-sha256 98106A16C7A6F9C0120168E216C3D2FF0EE0006352AB834F4D5C6C1E05F7C047 --expected-move-transformations 36 --expected-la-jal-transformations 4 --expected-intervening-controls 1 --expected-instructions 372 --expected-rel-text 71
```

It exited `0`. The source-policy tests, dialect unit and hostile-input tests, GNU relocation smoke
test, active-target pin tests, phase-8 proof tests, stale-schema workflow tests, normal verifier,
and heavyweight audit all passed. The final heavyweight audit completed in 720.1 seconds with
`Structural protections: PASS`, `CURRENT exact ROM: PASS`, and `RESULT: AUDIT PASS`.

## Reports, hashes, and output roots

| Artifact | SHA-256 |
|---|---|
| `build/source-policy/report.json` | `2B681A53AEF80C28E838DAF0DE0A19255DC2F7B610C207F6E6B5603B39E03667` |
| `build/toolchain-smoke/binutils-smoke-report.json` | `9B9A772A8A006F11A9B02F6F30555CBDC4C190D8A88F004F66C209A3ED0E67C3` |
| Authenticated candidate `verification.json` | `4A405FCE4E808B306E19CAC4B8C0703E09DD49C4E963F0B7291870D2BEE30C0D` |
| External canonical `build-report.json` | `F374BF6B1513859B5EAFC5FA64B421BB6DEB4332C22B06D1F281D88E34948EE9` |
| `build/setup/verify-setup-report.json` | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| `build/current/verification.json` | `001A9CA8681D66FE2A6F138614661BBB926599C0FE8B3B669B5E1F552AC099A7` |
| `build/audit/report.json` | `609193C6B17039FD7F2EDA8B9C59EE92E178E44281E33ACB0D79E9CEBB86D989` |

The canonical build output root was
`C:\Users\Joe\.codex\ob64-decomp-current\current\35e6ed6e8c6bf98b82845cb3\build`.
The audit's independent fresh-compilation root was
`C:\Users\Joe\.codex\ob64-decomp-current\verification\35e6ed6e8c6bf98b82845cb3-1786326927028`.
The generated candidate output root was
`build\compiler-assembly-dialect\authenticated-full-candidate`.

The frozen generated compiler assembly was 10,920 bytes with SHA-256
`A66BD7D20ED211A89010CCF16A974E753FCBFE5C546A9F7AFE51B79B74776BD9`. The historical KMC object
was 3,740 bytes with SHA-256
`AD7ABA388A684C6F5E2939741EA4923E93565BF14496FEEE61F1C19BF608C183`. The generated GNU object
was 4,136 bytes with SHA-256
`8E02BC26F195EE99EDF63D00BCDF91EC1CA7D03AD020053EEE732B8CC792D5B9`.

## Changed files

- `config/compiler-assembly-dialect.json` — versioned dialect contract and ordered rules.
- `config/matching-c-targets.json` — authenticated manifest hash pin.
- `config/README.md` — schema-2 contract description.
- `tools/lib/compiler_assembly_dialect.js` — parser, mode tracking, rewrite, counts, and proof schema.
- `tools/lib/active_targets.js` — versioned ordered rule identity.
- `tools/lib/phase8_matching_c.js` — per-rule build, recreation, proof, and aggregate verification.
- `tools/audit.js` — per-rule and hybrid-passthrough audit invariants.
- `tests/compiler_assembly_dialect.js` — rule, exclusion, malformed-input, class, and proof tests.
- `tests/compiler_assembly_dialect_candidate.js` — generated-evidence GNU/KMC comparison.
- `tests/binutils_smoke.js` — explicit instruction and HI16/MIPS26/LO16 relocation smoke test.
- `tests/active_targets.js` — stale schema and ordered-rules rejection.
- `tests/phase8_matching_c.js` — canonical proof, p3063, p3064, and OR regressions.
- `docs/WORKFLOW.md` — current dialect workflow.
- `docs/SOURCE_POLICY.md` — current adapter eligibility and passthrough policy.
- `docs/AUDIT.md` — current structural audit requirements.
- `docs/TOOLCHAIN.md` — GNU production/KMC oracle contract.
- `docs/audit/2026-08-09-kmc-la-direct-jal-dialect-structural-evidence.md` — this focused worker evidence.

No placement, ownership, segmentation, compiler identity, assembler identity, linker rule, active C
source, generated matching count, function queue, or unrelated subsystem document changed.
