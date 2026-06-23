/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281830..0x00281840 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small packed ints: 0x001E00F0 (=30/240 as 16-bit halves), 0x000000F0 (=240), then 8 bytes zero. Likely scalar config values; cannot fully type.. */
/* 0x00281830 0x802F1430 0x001E00F0 */ .word 0x001E00F0 # tge $zero, $s8
/* 0x00281834 0x802F1434 0x000000F0 */ .word 0x000000F0 # tge $zero, $zero
/* 0x00281838 0x802F1438 0x00000000 */ .word 0x00000000 # nop
/* 0x0028183C 0x802F143C 0x00000000 */ .word 0x00000000 # nop
