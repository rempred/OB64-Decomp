# Boot Early Loader/State Loop

## Scope

This dossier covers the Rev 0 original-MIPS source split that follows the boot
resource allocator/tree helpers:

- `asm/original/rev0/boot/early_boot_resource_loader.s`
  `0x000022B0..0x00002798`.
- `asm/original/rev0/boot/boot_state_service_loop.s`
  `0x00002798..0x00002B38`.
- New remainder:
  `asm/original/rev0/code_00002B38_00011000.s`.

All offsets are z64 ROM offsets. In this early boot/permanent range, the simple
runtime mapping is `RAM = ROM + 0x8006FC00`.

## Evidence

Parent `../scripts/ob64_symbols_v2.json` marks `0x000022B0` as a prologue
function at RAM `0x80071EB0`, size 1,256 bytes, frame size `0x40`, active in
all seven captured states. It has labels:

- `resource loader`, domain `dma/resource`, confidence `0.75`.
- `dispatcher/state-machine`, confidence `0.6`, with 40 callees and no
  indirect-call edges in the parent call graph.

The first range ends at `0x2798`, matching the parent symbol size for
`0x22B0`. The bytes at `0x2798..0x27A0` are executable prefix instructions:

- `0x2798`: `lui v1, 0x800C`
- `0x279C`: `lbu v1, 0x4800(v1)`

Those two words feed the scanner prologue at `0x27A0`, so they are kept with
`boot_state_service_loop.s` instead of being treated as padding or attached to
the previous loader.

Parent `../scripts/ob64_symbols_v2.json` marks `0x000027A0` as a prologue at
RAM `0x800723A0`, size 920 bytes, frame size `0x20`, active in all seven
captured states. It has a secondary entry recorded at ROM `0x2B10`.

## Static Notes

`0x22B0` performs a broad boot/init sequence: it clears or copies multiple RAM
ranges, calls the permanent DMA/resource helpers, initializes allocator-backed
regions, and then enters a repeated service/update path before returning.
Because the parent symbol already labels it as `dma/resource::resource loader`,
the file name uses that conservative label.

`0x2798..0x2B38` reads state bytes under `0x800B` and `0x800C`, calls several
permanent service/display helpers, writes display-list-looking words through
the `0x800F9BA0` cursor, and contains a small secondary halt/check block at
`0x2B10`. The source-layout name `boot_state_service_loop` is intentionally
conservative; it is not yet a verified behavior name.

The next remainder starts at `0x2B38`, where the scanner reports a leaf entry
at `0x2B38` and a prologue at `0x2B40`. Keep those overlapping entries together
in the next split unless stronger evidence separates them safely.

## Verification

After the split:

- `node tests\binutils_smoke.js` passes.
- `node tools\assemble_original_mips.js` passes.
- `node tools\verify_setup.js` passes.
- The first tracked composite chunk has 17 tracked source files.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
