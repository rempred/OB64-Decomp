# After-action report: high-value matching-C wave 3

## Outcome

The worker result is complete and review-pending. `func_0000BC8C` now has an
independently derived 524-byte C implementation with exact linked bytes,
relocations, placement, and full-ROM reproduction. The Director must intake
the uncommitted result and route fresh Critical review. No action is required
from Joe during worker intake.

No commit, push, publication, or acceptance verdict was made.

## Assignment and boundary

The mission covered one high-value matching-C target in `OB64 Decomp`. The
worker modified only the canonical decomp repository. The parent repository,
integration repository, original assembly, master ROM, editor, emulator, RAM,
controller input, savestates, and protected integration work root remained
read-only.

The canonical repository started on `main` at
`b0768ff413f6d31c7d80988ecda941fcd2487462`. The parent repository started at
`bed88d069e2f61b941c34907bc49f868de6f6e93`. The integration evidence repository
started at `b22815518f060425519c08df19b617af8b5099a7`.

All changes remain uncommitted for Director intake.

## Target selection

The selected owner is an accepted early-boot resolver and load-preparation
function. It satisfies the size, boundary, library, structural-feature, and
preferred-path requirements.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_record_resolve_load` | Per-record resource resolver and load preparation | `0x0000BC8C..0x0000BE98` | z64 ROM range, end exclusive | Exact 524-byte owner |
| `boot_resource_record_resolve_load` | Runtime placement of the owner | `0x8007B88C..0x8007BA98` | boot RAM virtual range, end exclusive | Accepted early-boot placement |
| `g_resource_template` | Resource initialization template | `0x800AE27C` | boot RAM virtual address | Linked `HI16` and `LO16` aliases |
| `g_resource_directory_table` | Directory pointer table | `0x800A8750` | boot RAM virtual address | Effective signed-low-half address |
| `func_0000BE98` | Resource operation dispatcher | `0x8007BA98` | boot RAM virtual address | Six-argument call target |

The accepted dossier labels the directory table `0x800B8750`. The original
pair uses `lui 0x800B` and sign-extended `addiu 0x8750`. The effective linker
alias is therefore `0x800A8750`, which preserves the original high-half word.

The target contains multiple calls, a path scan, a directory loop, type
branches, result checks, and diagnostic paths. It has no secondary entry.

Movement candidates were not selected because accepted local evidence did not
prove a bounded movement owner. The resolver path satisfied the preferred-path
requirement without a fallback selection.

## Independent derivation

The source is `src/boot/boot_resource_record_resolve_load.c`. It derives the
function from local assembly, ROM bytes, and accepted project evidence.

The C body models these behaviors:

- It allocates a `0x138`-byte scratch frame.
- It preserves record, context, buffer, and match-count register roles.
- It handles the high-bit flagged record path.
- It normalizes slash-prefixed `K` and `X` paths.
- It selects the default path when the scan reaches a terminator.
- It scans the type `0x8000` directory table.
- It counts successful directory-entry matches.
- It initializes the selected buffer and calls the dispatcher.
- It validates the result through record offsets `0x118` and `0x116`.
- It preserves the type-specific and common diagnostic paths.

Constrained inline assembly preserves exact `addu` encodings, branch order,
and delay slots. It does not copy the original instruction body.

The original assembly SHA-256 is
`B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E`.

The final source SHA-256 is
`1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068`.

## Verification

The accepted KMC compiler and binutils produced the final object. Phase 8 then
linked all four configured C owners and preserved the original fallback owners.

| Gate | Result | Evidence |
|---|---|---|
| Pre-edit setup baseline | PASS; 21 checks passed | Initial explicit-root setup report |
| Selected target boundary | PASS; 524 bytes | Row `107`, section `.ob64.r0107` |
| Compiled object | PASS; 524-byte `.text` | Object SHA-256 `5302930D9D0E9D22D8AEF4EF57C2B57B111E37DDB2882362EF6C1427BFED09B0` |
| Linked target | PASS; exact bytes | Target SHA-256 `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424` |
| Target relocations | PASS; 21 `.rel.text` and one `.rel.pdr` | Root A `verification.json` |
| All configured C targets | PASS; four exact owners | Root A `verification.json` |
| Accepted owner preservation | PASS | `acceptedRowsPreserved: 7242`; `acceptedSlicesPreserved: 7251` |
| Overlay preservation | PASS | `overlayDescriptorsPreserved: 19` |
| Original fallback ownership | PASS | `originalAssemblyTargetsNotLinked: true` |
| Full canonical ROM | PASS | ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Root A and root B | PASS; identities match | `reproducibility.json` |
| Post-edit setup | PASS; 21 checks passed | Setup report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

Root A build report SHA-256 is
`13A7469457B5909905E34C8DF8E7F2DE96B13628709C7987142B9390D5516FD1`.

Root A verification report SHA-256 is
`8AAF145E4FEA0B71708B6665D4AAC53FDAB116E007000B4AC204C582CA1A174E`.

The reproducibility report SHA-256 is
`71D72748C64FC22A69B57158032F0A5EF7021FD5EC5EBFA82EA8094E8D268BA3`.

## Correction and protocol deviations

The first setup wrapper exceeded the shell tool's 124-second timeout after the
report had completed. The report was valid. The exact Node processes were
stopped. The unchanged exact setup command later passed in 282.9 seconds.

The first Phase 8 build found 17 one-byte differences inside the selected
target. Three linked aliases were wrong. KMC also emitted `or` copies where
the original used `addu`. The worker corrected those values and reran the full
build and verification.

The first reproducibility invocation used `verify-report.json`. The comparer
requires `verification.json`. Both verifiers were rerun with the required name.
The corrected comparer then passed.

These deviations did not alter the final canonical result. Failed external
outputs are not used as completion evidence.

## Changed surfaces

The worker changed the following canonical source and configuration files:

- `src/boot/boot_resource_record_resolve_load.c`
- `config/phase8/matching-c.json`

The worker added these handoff records:

- `docs/matching-c/high-value-wave3-20260802/target-selection.md`
- `docs/matching-c/high-value-wave3-20260802/independent-derivation.md`
- `docs/matching-c/high-value-wave3-20260802/task-log.md`
- `docs/matching-c/high-value-wave3-20260802/evidence-index.md`
- `docs/matching-c/high-value-wave3-20260802/aar/20260802-ob64-matching-c-high-value-wave3-aar.md`

The retained original assembly was not changed. Generated build artifacts stay
outside the canonical repository.

## Limits and review state

The result proves static byte identity, relocation identity, link placement,
and reproducible full-ROM output. It does not prove runtime behavior or the
meaning of every record field, directory entry, or diagnostic string.

All material claims are `Supported` before independent review. The result is
`review-pending`. The worker did not accept its own result.

The Director must freeze the coherent uncommitted result and route it for fresh
Critical review. After acceptance, the Director may update canonical status
documents. This worker did not edit those status documents.
