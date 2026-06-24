/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004A1000_004B1000.s
 * z64 range: 0x004AA504..0x004AA518 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (5 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004AA504 0x8051A104 0x00000000 */ .word 0x00000000 # nop
/* 0x004AA508 0x8051A108 0x00000000 */ .word 0x00000000 # nop
/* 0x004AA50C 0x8051A10C 0x00000000 */ .word 0x00000000 # nop
/* 0x004AA510 0x8051A110 0x00000000 */ .word 0x00000000 # nop
/* 0x004AA514 0x8051A114 0x00000000 */ .word 0x00000000 # nop
