/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DDF58..0x000DDF60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 2 zero words separating the pointer table from the trailing packed blob. Only 2 words (< 3) so not a zero_fill; kept as a tiny data padding part to preserve byte-exact contiguity.. */
/* 0x000DDF58 0x8014DB58 0x00000000 */ .word 0x00000000 # nop
/* 0x000DDF5C 0x8014DB5C 0x00000000 */ .word 0x00000000 # nop
