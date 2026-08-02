# Target selection

## Status and result

Target selection is complete and review-pending. The selected owner is
`func_00269470`, an 808-byte overlay function with a seven-way dispatch table,
two indirect callbacks, linked state fields, and broad runtime reuse. The
selection advances the matching-C path into a richer state-transition shape.
No action is required from Joe during worker intake.

## Baseline and identity

| Item | Recorded value |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave4-20260802` revision 1 |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and HEAD | `main`, `d398c23f4163e807039c45956a4ed25c4698b641` |
| Parent repository HEAD | `355236254220eb8ab6f0146868c643ad409287b7`; read-only |
| Integration repository HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Phase 5A product root | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Setup baseline | PASS; `build/setup/verify-setup-report.json` reports `ok: true` and 21 passing checks |
| Setup report SHA-256 | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The parent HEAD differs from the assignment snapshot. The parent remained
read-only, so this difference did not change the canonical mission surface.

## Selection input identities

| Input | SHA-256 | Evidence role |
|---|---|---|
| `asm/original/rev0/lib/func_00269470.s` | `8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB` | Original byte source |
| `asm/original/rev0/lib/func_00269798.s` | `not separately hashed in this slice` | Boundary successor |
| Descriptor 12 raw input | `998FF913EC9C6AC3D5BDD3C3C24F78D0225D8C70D3F64AF0CC100CCAAA3BFBAA` | Overlay placement source |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` | Overlay mapping configuration |
| `config/splat/us_rev0.semantic.json` | `1BC788145E625600756004CF53673A322616C4FEBFC5102788ACDEFA0F050574` | Semantic linker configuration |
| Overlay linker input set | `9090891B8C0277CB1B97F5EE958163FF050DFBDD5AEBB5B5BF8D6429BA42ABB6` | Accepted placement inputs |
| Candidate context JSON | `FDEA07210B34B8C1D2BF73AAA20B04CA747ABD3D4A1AACAFCB1F125D28DB3AD3` | Independent selection context |

## Selection requirements

| Requirement | Result | Evidence |
|---|---|---|
| Exactly one target | PASS | This record selects only `func_00269470`. |
| More than 524 z64 ROM bytes | PASS | The owner spans 808 bytes. |
| At most 896 z64 ROM bytes | PASS | The owner ends after 808 bytes. |
| Preferred movement, map-control, scheduler, or state-transition path | PASS | The owner implements state-field dispatch, callback invocation, and state propagation across mission-briefing and combat snapshots. |
| Accepted, unambiguous boundary | PASS | The source owner spans `0x00269470..0x00269798`; the target ends at `jr $ra` plus its stack-restore delay slot, followed by `func_00269798`. |
| Not known-library code | PASS | The owner lies in overlay descriptor 12 game code and has no library name or standard-library rule. |
| At least four listed structural features | PASS | The function has multiple non-leaf calls, a multiway dispatch, linked tables and pointers, two callbacks, and state propagation across several fields. |
| One bounded review slice | PASS | The function has one accepted executable slice, no secondary entry, and one direct caller. |
| Reuse, centrality, or research leverage | PASS | The accepted function context records use in `mission_briefing` and `combat`; direct assembly resolves 14 callees and two indirect calls. |

## Structural evidence

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_00269470` | Seven-way state handler with callback dispatch | `0x00269470..0x00269798` | z64 ROM range, end exclusive | Selected C owner |
| `func_00269470` | Same owner placement | `0x802148C0..0x80214BE8` | overlay descriptor 12 runtime range | Linked target placement |
| `g_func_00269470_dispatch_table` | Seven-entry indirect dispatch table | `0x80220BA0` | overlay runtime virtual address | `jr $v0` table base at owner offset `0x38` |
| `func_00269470_callback` | State callback loaded from field offset `0x70` | `s0+0x70` | overlay-relative state-subobject field | Two `jalr` call sites at owner offsets `0x64` and `0x304` |
| `func_00269798` | Adjacent display-command wrapper | `0x00269798..0x002697DC` | z64 ROM range | Boundary successor |

Direct assembly observations establish the selected shape:

1. The owner allocates a `0x30`-byte frame and preserves `s0` through `s2` plus `ra`.
2. It masks the selector to 16 bits and rejects values outside seven entries.
3. It loads a seven-entry table and jumps indirectly through the selected entry.
4. It tests state flags at offsets `0x4A`, `0x5C`, and `0xA` relative to the state subobject.
5. It invokes two function pointers loaded from state offset `0x70`.
6. It scans a bounded pointer array using a count at the pointed record offset `0x4`.
7. It updates state fields at offsets `0x8`, `0x40`, `0x4A`, `0x64`, `0x66`, `0x68`, and `0x6C`.
8. It calls 14 statically resolved non-leaf targets across the seven dispatch paths.

The runtime address is overlay-relative. The early-boot linear mapping is not
used for this owner. Descriptor 12 maps z64 ROM `0x0025EE90..0x00275850` to
runtime virtual range `0x8020A2E0..0x802210C0`.

## Rejected candidates

The candidate scan covered valid executable owners between 525 and 896 bytes.
These representative preferred-path candidates were rejected before selecting
the current state-transition owner:

| Candidate | Size | Rejection reason |
|---|---:|---|
| `func_00134CD4` | 724 | Its direct evidence shows encounter/display-list consumption and no accepted scheduler or state-transition role. |
| `func_002532A8` | 872 | Its FP command dispatcher has three accepted secondary entries and no loop or callback evidence. |
| `func_001B8A0C` | 720 | Its six listed secondary entries create a boundary-risk slice. |
| `func_001A7D74` | 888 | Its ten listed secondary entries create a boundary-risk slice. |
| `func_001526AC` | 644 | Its seven listed secondary entries create a boundary-risk slice. |

The selected candidate did not require a fallback to a generic resource or
decode target. No movement or map-control owner had stronger accepted evidence
than the selected state-transition owner in this bounded size range.

## Claim record

### Claim

`func_00269470` is the strongest eligible Wave 4 matching-C target.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and context

Static Rev 0 target selection for one overlay-relocated function. This record
does not prove gameplay semantics for the selector, state fields, or callbacks.

### Supporting artifacts

- `asm/original/rev0/lib/func_00269470.s`
- `asm/original/rev0/lib/func_00269798.s`
- `C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\func_00269470-context.json`
- `C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\func_00269470-context.md`
- `config/splat/us_rev0.semantic.json`
- `config/overlays/us_rev0.json`
- `build/setup/verify-setup-report.json`

### Independent corroboration

The accepted owner model identifies row `4801`, section `.ob64.r4801`, chunk
`38`, one executable overlay slice, and overlay descriptor `12`.

### Competing interpretation

The function may be a stateful display or resource handler rather than a
general scheduler. Its dispatch table, callbacks, and state-field updates still
establish the required state-transition selection value.

### Falsifier

An accepted boundary correction, relocation mismatch, or independent byte
mismatch would invalidate this selection.

### Known limits

The selection has no runtime mutation proof. The structural name remains
appropriate until accepted semantic evidence supports a stronger name.

### Product consequence

The target is suitable for one fresh Critical matching-C review slice. No editor
change or gameplay semantic claim is authorized by this worker result.
