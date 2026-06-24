/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004A1000_004B1000.s
 * z64 range: 0x004AB700..0x004AB718 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (6 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004AB700 0x8051B300 0x00000000 */ .word 0x00000000 # nop
/* 0x004AB704 0x8051B304 0x00000000 */ .word 0x00000000 # nop
/* 0x004AB708 0x8051B308 0x00000000 */ .word 0x00000000 # nop
/* 0x004AB70C 0x8051B30C 0x00000000 */ .word 0x00000000 # nop
/* 0x004AB710 0x8051B310 0x00000000 */ .word 0x00000000 # nop
/* 0x004AB714 0x8051B314 0x00000000 */ .word 0x00000000 # nop
