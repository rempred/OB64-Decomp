# Q4 original assembly edge admission

This change applies the existing registered-padding contract to `func_0011B344`.
Physical row2327 remains ROM `0x0011B344..0x0011B430` (236 bytes), overlay7 text,
VRAM `0x801C6C04..0x801C6CF0`. Its complete 224-byte C body owns
`.ob64.r2327.s0`; the final12 bytes remain original ASM in chunk17 through
`.ob64.r2327.s1`. Both slices retain the original RX classification. The original
assembly file and its authenticated hash remain unchanged.

The ROM-backed body includes `jr ra` at `0x0011B41C` and its delay slot at
`0x0011B420`. Three original zero words follow at `0x0011B424..0x0011B430`.
Untouched pinned compiler output emits a single GLOBAL function of224 bytes in
native `.text` of224 bytes, alignment16, with zero native terminal bytes.
Ordinary section assignment produces the same224 bytes at alignment4. Therefore
the original12 bytes are retained ASM, not compiler padding or matching-C bytes.
This distinction does not assert that numerical or runtime references are absent.

The physical GLOBAL entry already has the compiler's name, `func_0011B344`.
No derived symbol interface, additional function, native tail projection or
omitted original local symbol is needed. Six actual `R_MIPS_26` calls at offsets
`28/48/68/88/A8/C4` retain `func_000016C4`. Original physical/envelope interfaces,
per-slice ownership and load mappings, and the complete236-byte union remain
required. The selected-output fields of the legacy target record migrate to224;
the independent registered-edge proof retains the full original row obligation.

Focused validation uses:

```text
node tests/registered_padding.js
node tests/registered_padding_native.js
node tests/registered_padding_scratch.js
node tests/registered_padding_q4.js
```

The Q4 fixture runs the production PURE_C compile and source-object proof paths,
an isolated link with the original retained tail, a caller relocation to the
preserved entry, and recorded/CURRENT-style full-row reconstruction. It checks
C224/ASM12 accounting and rejects missing or stale full-row proof, a missing
tail, corrupted retained bytes, and an altered execution classification. Existing
generic suites retain their cut/registry/interface/load/map/cache falsifiers.

Private focused checks passed before independent review:26 registered controls,
88 generic native controls,6 generic scratch controls, and6 Q4 controls. These
fixtures establish no complete-ROM or wave acceptance. Independent review and the
changed-input structural audit remain required; the canonical verifier must prove
the complete Q4 wave PURE_C, sole C224 ownership, original ASM12/full236, exact
placement/relocations and byte-identical retail ROM after serialized integration.
