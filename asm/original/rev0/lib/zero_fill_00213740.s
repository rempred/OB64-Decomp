/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213740..0x00213750 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 words all-zero leading pad (.word 0x00000000 x4).. */
/* 0x00213740 0x80283340 0x00000000 */ .word 0x00000000 # nop
/* 0x00213744 0x80283344 0x00000000 */ .word 0x00000000 # nop
/* 0x00213748 0x80283348 0x00000000 */ .word 0x00000000 # nop
/* 0x0021374C 0x8028334C 0x00000000 */ .word 0x00000000 # nop
