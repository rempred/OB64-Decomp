/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E33E0..0x000E3400 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 zero words; block separator within the graphics stream.. */
/* 0x000E33E0 0x80152FE0 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33E4 0x80152FE4 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33E8 0x80152FE8 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33EC 0x80152FEC 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33F0 0x80152FF0 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33F4 0x80152FF4 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33F8 0x80152FF8 0x00000000 */ .word 0x00000000 # nop
/* 0x000E33FC 0x80152FFC 0x00000000 */ .word 0x00000000 # nop
