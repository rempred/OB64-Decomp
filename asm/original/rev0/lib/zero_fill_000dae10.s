/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DAE10..0x000DAE28 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 consecutive zero words (alignment/padding before the RAM-pointer table).. */
/* 0x000DAE10 0x8014AA10 0x00000000 */ .word 0x00000000 # nop
/* 0x000DAE14 0x8014AA14 0x00000000 */ .word 0x00000000 # nop
/* 0x000DAE18 0x8014AA18 0x00000000 */ .word 0x00000000 # nop
/* 0x000DAE1C 0x8014AA1C 0x00000000 */ .word 0x00000000 # nop
/* 0x000DAE20 0x8014AA20 0x00000000 */ .word 0x00000000 # nop
/* 0x000DAE24 0x8014AA24 0x00000000 */ .word 0x00000000 # nop
