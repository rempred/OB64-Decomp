/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0960..0x001F0970 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 16-byte all-zero gap separating the 0x801ACC pointer table from the following double constant.. */
/* 0x001F0960 0x80260560 0x00000000 */ .word 0x00000000 # nop
/* 0x001F0964 0x80260564 0x00000000 */ .word 0x00000000 # nop
/* 0x001F0968 0x80260568 0x00000000 */ .word 0x00000000 # nop
/* 0x001F096C 0x8026056C 0x00000000 */ .word 0x00000000 # nop
