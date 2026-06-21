# data

Structured ROM data source belongs here.

Suggested layout:

- `tables/` - known tables converted to source forms.
- `archives/` - archive manifests and extracted source records.
- `rodata/` - read-only data split from code segments.
- `bin/` - binary includes that are not yet decoded.

Current generated proof owners live under ignored `build/source-owners/rev0/`.
Promote those into tracked `data/` only in deliberate batches, with docs saying
whether each owner is decoded data, raw ambiguous bytes, or archive/compressed
payload source.

Current tracked source owners live under `data/source-owners/rev0/`:

- `raw_header` `0x00000000..0x00001000`.
- `raw_structural_gap` `0x0063676C..0x00636784`.
- `raw_tail_data` `0x0275415B..0x0275DD40` (still ambiguous).

The tracked manifest is `data/source-owners/rev0/manifest.json`. Regenerate or
extend it with `node tools/promote_non_code_sources.js`, then verify with
`node tools/verify_setup.js`.
