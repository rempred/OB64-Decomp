# Target selection: matching C high-value wave 2

## Status

The selected target is `boot_state_slot_flagged_dispatch_lookup`, with original
symbol `func_00007688`. The selection is review-pending and is not an
acceptance verdict.

## Baseline

| Repository | Starting branch | Starting HEAD | Scope result |
|---|---|---|---|
| Parent research repository | `main` | `1e22de1041be2480e8b1e789aedad4e24b7fae39` | Read-only; unchanged |
| Canonical decomp repository | `main` | `697f54a1f3d3048b302cf72205dc4d7ad9f9f376` | Target source, matching-C configuration, and task evidence are in scope |

The explicit Phase 5A setup baseline passed before source edits. The baseline
used the required accepted product root and produced the canonical ROM
SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Selected function

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_state_slot_flagged_dispatch_lookup` | Scans six state-slot records and dispatches flagged records | `0x00007688..0x00007768` | z64 ROM range | Accepted 224-byte function owner and matching-C target |
| `boot_state_slot_flagged_dispatch_lookup` | Fixed boot code entry | `0x80077288..0x80077368` | boot RAM virtual range | Early-boot linear placement |
| `g_state_slot_status` | Status halfword tested before the scan | `0x800C4C26` | boot RAM virtual address | `0xFFFF` suppresses the record scan |
| `g_state_slot_records` | First of six 0xA8-byte state-slot records | `0x800E82C8` | boot RAM virtual address | Record flag and mode-byte reads |
| `boot_state_slot_record_step` | Processes one matching slot | `0x80077F88` | boot RAM virtual address | Direct dispatch callee |
| `boot_state_slot_noop_return_tail` | Preliminary no-op return call | `0x80077F80` | boot RAM virtual address | Direct call before status test |

The accepted Phase 5/7 owner row is row `67`, primary ID
`primary:3604e08f7eac09f922ae`, section `.ob64.r0067`, and assembly chunk `0`.
The owner is `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s`.

## Requirement proof

| Assignment requirement | Direct evidence |
|---|---|
| Preferred scheduler, movement, or resolver path | The target is the boot state-slot callback path and scans records before dispatching matching slots. |
| Accepted function boundary | The Phase 5/7 semantic row, assembly manifest, and local dossier agree on one 224-byte owner. |
| Target size | The z64 range contains 224 bytes, which exceeds 168 and remains below 512. |
| Not known-library code | The target is a state-slot helper in the boot game path, not a library owner. |
| Structural features | The body has two non-leaf calls, a six-record loop, and several decision branches. |
| Reuse or centrality | The callback-dispatch helper at `0x000069D8` calls this helper, which then reaches the per-record step at `0x80077F88`. |
| Bounded review slice | One early-boot function, one assembly owner, and two accepted direct-call aliases are involved. |

The preferred-path requirement is satisfied. No resource-loader fallback was
used, so a fallback candidate rejection record is not required.

## Supporting artifacts

- Original assembly: `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s`
- Boundary dossier: `docs/dossiers/boot-state-slot-flagged-dispatch-lookup.md`
- Accepted owner model: `config/phase7/conventional-build.json`, row `67`
- Tracked assembly manifest: `asm/original/rev0/manifest.json`, chunk `0`
- Parent structural evidence: `..\\scripts\\ob64_functions.json` and
  `..\\scripts\\ob64_symbols_v2.json`, function key `0x00007688`
