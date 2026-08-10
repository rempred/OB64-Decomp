# KMC `la` plus direct `jal` identifier-grammar correction evidence

Date: 2026-08-09 local / 2026-08-10 UTC

## Scope and review basis

This is the focused correction record for rejected structural commit
`5ec46d3f1513b76a21dd983fb6c57c2f98504242`. That commit and
`docs/audit/2026-08-09-kmc-la-direct-jal-dialect-structural-evidence.md` remain intact as the
reviewed historical record; this document supersedes their broad bare-assembler-symbol rule and
current adapter hash claims. The independent review and its adversarial and GNU grammar-edge
reports identified five eligibility failures: current-location and section address operands,
named-register direct calls, a register-valued `la` address operand, and a current-location direct
call.

The starting repository state was:

```text
git rev-parse HEAD
5ec46d3f1513b76a21dd983fb6c57c2f98504242

git status --short --branch
## main...origin/main [ahead 17]
```

Both commands exited `0`; the worktree was clean. No reviewed commit was amended, reverted, or
erased.

## Corrected contract

Schema 2 and dialect identity `kmc-compiler-assembly-dialect-v2` remain compatible with the
intended two-rule design. The ordered rules are now:

1. `move-numeric-gpr-gpr-to-addu-zero`;
2. `la-gpr4-undefined-c-linkage-identifier-direct-jal-c-linkage-identifier-delay-slot`.

The second rule accepts an address symbol and direct-call target only when each matches the exact
C-linkage identifier grammar `[A-Za-z_][A-Za-z0-9_]*`. The address symbol must also remain undefined
within the translation unit. This excludes current-location (`.`), section and dot-prefixed local
assembler names, expressions/addends, relocation syntax, and all register tokens from eligibility.
Register-valued `la` address operands reject before a transformation decision or proof can be
recorded. Valid GNU register-target `jal` statements remain byte-identical exclusions.

The rule remains target-, symbol-, and callee-blind. It encodes no p3064 symbol, generated address
symbol, call target, or expected transformation count. The existing numeric `move` rule is
unchanged, and `HYBRID_C` remains opaque byte-identical passthrough with zero total and per-rule
transformations.

The authenticated identity chain is:

| Artifact | SHA-256 |
|---|---|
| `tools/lib/compiler_assembly_dialect.js` | `74EBB644F3B9A659C3AD91F179EB70CE531E2373714686D110C7FC42B3C5C74C` |
| `config/compiler-assembly-dialect.json` | `1F79D759E80CA4670811787C0DAE4EC2CC1D572E4E63EEF4AB6EBF82ED39A3C2` |

`config/matching-c-targets.json` pins the latter value. GNU assembler 2.39 remains the production
assembler. The historical KMC assembler remains an authenticated behavioral oracle only.

## Direct observations

- The dialect unit suite passed the supported adjacent external-symbol case and every prior move
  regression. It exercised 65 conventional named/numeric register forms as byte-identical direct
  `jal` exclusions and the same 65 forms as rejected register-valued `la` address operands.
- The five reviewer failures have permanent tests. `la $4,.`, `la $4,.data`, and `jal .` now remain
  byte-identical with zero new-rule transformations; `jal $ra` and `jal $t9` also remain
  byte-identical; `la $4,$a0` rejects before a result is returned.
- The GNU binutils smoke suite assembled both raw and adapter output for valid exclusions and
  compared instruction words. The current-location address case preserved
  `0x3C040000 0x0C000000 0x24840000`; raw and adapted `.text` shared SHA-256
  `B599B6193DA30E3228AC9F9054E3F94463BC3555B2398F6D98A111CF8F89CC12`.
- The section-address case preserved those same three words. The current-location call preserved
  `0x3C040000 0x24840000 0x0C000002 0x00000000`. Representative zero, assembler-temporary, value,
  argument, temporary, saved, kernel, global-pointer, stack-pointer, frame-pointer, return-address,
  and numeric register-call forms all had identical raw and adapted instruction words and zero
  new-rule transformations.
- The LF-normalized staged-tree checkout passed the full dialect suite. Its two authenticated
  hybrid fixture hashes were
  `33E82D7DFA3D2EE903DC94BA32D589A6A5E32B2808F6D4798ECB045285712A14` and
  `167DABAC2DC84D94CA00FA0E091F7B73897C6041BD5000881FF95A2ADE0223BE`.
  The test also synthesized and verified the authenticated CRLF forms, proving byte-identical
  passthrough for each physical line-ending representation without weakening production hashing.
- The authenticated frozen full candidate produced 36 move transformations and four corrected
  `la`/`jal` transformations. It assembled to 372 instructions and 1,488 `.text` bytes with
  SHA-256 `98106A16C7A6F9C0120168E216C3D2FF0EE0006352AB834F4D5C6C1E05F7C047`, zero instruction-word
  differences from the historical KMC object, and 71 logically identical `.rel.text` entries by
  offset, type, and resolved symbol. Its one `la`; `sw`; `jal` control remained untransformed.
- All 37 active targets remained exact. Canonical p3063 (`func_0019554C`) remained `PURE_C` exact
  with exactly 14 move transformations and zero new-rule transformations. Its linked target
  SHA-256 remained `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.
- `func_0002CD70` remained exact `HYBRID_C` passthrough with both protected words equal to
  `0x00801025`; its linked-target SHA-256 remained
  `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.
- Canonical p3064 (`func_001957D0`) remained exact `HYBRID_C` passthrough with zero transformations.
  Raw and adapted compiler assembly remained byte-identical at SHA-256
  `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC`; linked-target SHA-256
  remained `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B`.
- The complete rebuilt ROM remained byte-identical at SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- The heavyweight audit completed in 813.4 seconds with `Structural protections: PASS`,
  `CURRENT exact ROM: PASS`, and `RESULT: AUDIT PASS`.

## Interpretation

The strict C-linkage grammar is the narrow structural boundary supported by the authenticated
compiler-generated subset. It avoids treating GNU assembler current-location, section, local-name,
expression, and register spellings as C-linkage symbols while retaining supported external
address/direct-call sequences. Equality of instruction words and logical relocations, rather than
raw ELF identity, remains the relevant cross-assembler evidence.

`-O2` remains the pinned production compiler configuration. It is not a demonstrated historical
eligibility requirement: the independently reviewed historical KMC `-O0` case also performed the
swap.

## Remaining limits

The rule still does not cover other destination registers, locally defined address symbols,
dot-prefixed names, labeled statements, `jalr`, intervening emitted statements or directives,
noreorder or nomacro input, expressions/addends, unsupported relocation syntax,
PIC/GOT/GP-relative/small-data/MIPS16/Release 6 or unverified ABI modes, or dependency/hazard shapes
outside the authenticated subset.

The frozen candidate remains generated evidence only. It and the historical object were not
committed, no KMC tool was added to production, and no diagnostic script was copied or promoted.
Canonical p3064 was not edited, activated, or reclassified. p3064 `PURE_C` matching remains paused
until independent structural re-review accepts this correction.

## Verification commands and exit codes

Commands were run from the repository root unless an explicit root is shown.

| Command | Exit |
|---|---:|
| `node tools\source_policy.js` | 0 |
| `node tests\source_policy.js` | 0 |
| `node tests\active_targets.js` | 0 |
| `node tests\compiler_assembly_dialect.js` | 0 |
| `node tests\binutils_smoke.js` | 0 |
| `node tests\word_asm_smoke.js` | 0 |
| `node tools\build.js` (initial 10-second orchestration window) | 124 |
| `node tools\build.js` (full verification window) | 0 |
| `node tests\phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-decomp-current\current\fc83a42daf3384cfbb3972fb-retry-1786333983296\build"` | 0 |
| `node tests\workflow_acceptance.js --output "C:\Users\Joe\.codex\ob64-decomp-current\current\fc83a42daf3384cfbb3972fb-retry-1786333983296\build"` | 0 |
| `node tools\verify.js` | 0 |
| `node tools\audit.js` | 0 |
| `git diff --check` | 0 |
| `git diff --cached --check` | 0 |

The authenticated full-candidate command exited `0`:

```text
node tests\compiler_assembly_dialect_candidate.js --compiler-assembly "C:\Users\Joe\.codex\ob64-p3064-allocator-diagnostic-20260809-r1\rtl-inspect\best.compiler.s" --historical-object "C:\Users\Joe\.codex\ob64-p3064-xp-vm-setup-20260809-203842-32227774d9f6\runs\guest-attempt2\extracted\FULL\full.o" --output "build\compiler-assembly-dialect\authenticated-full-candidate" --expected-compiler-assembly-sha256 A66BD7D20ED211A89010CCF16A974E753FCBFE5C546A9F7AFE51B79B74776BD9 --expected-text-sha256 98106A16C7A6F9C0120168E216C3D2FF0EE0006352AB834F4D5C6C1E05F7C047 --expected-move-transformations 36 --expected-la-jal-transformations 4 --expected-intervening-controls 1 --expected-instructions 372 --expected-rel-text 71
```

The LF-normalized clean-checkout gate used staged index contents:

```text
git -c core.autocrlf=false -c core.eol=lf checkout-index --all --prefix=C:\Users\Joe\.codex\ob64-kmc-correction-clean-20260809-identifier-grammar\
cd C:\Users\Joe\.codex\ob64-kmc-correction-clean-20260809-identifier-grammar
node tests\compiler_assembly_dialect.js
```

The export and dialect test each exited `0`.

## Reports, hashes, and output roots

| Artifact | SHA-256 |
|---|---|
| `build/source-policy/report.json` | `67CB5FE120079796E89D64587BCE695D347D634FD799B029A78071055137B10E` |
| `build/toolchain-smoke/binutils-smoke-report.json` | `BFDC2A5203148D37D7D43C24AC9358339E58D12B251465F01051F83499149895` |
| Authenticated candidate `verification.json` | `AC7C5C256F334995B650009B114DE99FCF7E8A3BC0BE9B8CCFA64DC779624FD9` |
| External canonical `build-report.json` | `BE546CAB109ED27CD138402BE93F27FFE86A18C99900D919DC864F286827F6F8` |
| `build/setup/verify-setup-report.json` | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| `build/current/verification.json` | `1482D53A8C353CD45B1840038FBF9BE1B83A99EA569C6F33EEFEF1CD7D1DF4DC` |
| `build/audit/report.json` | `91D4560F1C991E34DB2C7DC6C17A3D50CF3D36D61FF817EBB8E37367D98A40DB` |

The canonical build/proof/workflow output root was
`C:\Users\Joe\.codex\ob64-decomp-current\current\fc83a42daf3384cfbb3972fb-retry-1786333983296\build`.
The normal verifier's independent root was
`C:\Users\Joe\.codex\ob64-decomp-current\verification\fc83a42daf3384cfbb3972fb-1786334130367`.
The audit's independent fresh-compilation root was
`C:\Users\Joe\.codex\ob64-decomp-current\verification\fc83a42daf3384cfbb3972fb-1786335020814`.
The candidate output root was `build\compiler-assembly-dialect\authenticated-full-candidate`, and
the LF-normalized staged checkout root was
`C:\Users\Joe\.codex\ob64-kmc-correction-clean-20260809-identifier-grammar`.

The frozen generated compiler assembly was 10,920 bytes at SHA-256
`A66BD7D20ED211A89010CCF16A974E753FCBFE5C546A9F7AFE51B79B74776BD9`; the historical KMC object
was 3,740 bytes at SHA-256
`AD7ABA388A684C6F5E2939741EA4923E93565BF14496FEEE61F1C19BF608C183`; and the generated GNU 2.39
object was 4,136 bytes at SHA-256
`8E02BC26F195EE99EDF63D00BCDF91EC1CA7D03AD020053EEE732B8CC792D5B9`.

## Changed files

- `config/compiler-assembly-dialect.json` — strict identifier vocabulary, rule identity, and
  authenticated implementation hash.
- `config/matching-c-targets.json` — corrected dialect-manifest hash pin.
- `tools/lib/compiler_assembly_dialect.js` — exact C-linkage predicate and pre-decision rejection
  for register-valued `la` operands.
- `tests/compiler_assembly_dialect.js` — reviewer regressions, complete conventional named/numeric
  register coverage, and LF/CRLF-portable hybrid fixture identity tests.
- `tests/binutils_smoke.js` — raw/adapted GNU instruction-word equality for valid exclusions.
- `docs/WORKFLOW.md`, `docs/SOURCE_POLICY.md`, and `docs/TOOLCHAIN.md` — corrected live dialect
  boundary descriptions.
- `docs/audit/2026-08-09-kmc-la-direct-jal-identifier-grammar-correction-evidence.md` — this focused
  correction record.

No fixture bytes, generated counts, function queue, ownership, placement, segmentation, compiler
identity, assembler identity, or linker rule changed. Independent structural re-review is still
required.
