/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B1504..0x001B1510 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12-byte zero-fill alignment island: three 0x00000000 (nop) words at 0x1B1504/0x1B1508/0x1B150C. Sits after func_001B1070's return +delay and before func_001B1518's entry. Not executed.. */
/* 0x001B1504 0x80221104 0x00000000 */ .word 0x00000000 # nop
/* 0x001B1508 0x80221108 0x00000000 */ .word 0x00000000 # nop
/* 0x001B150C 0x8022110C 0x00000000 */ .word 0x00000000 # nop
