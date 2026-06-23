/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B2664..0x001B2670 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 trailing zero words immediately before func_001B2670 prologue (addiu $sp,$sp,-0x30 at 0x1B2670).. */
/* 0x001B2664 0x80222264 0x00000000 */ .word 0x00000000 # nop
/* 0x001B2668 0x80222268 0x00000000 */ .word 0x00000000 # nop
/* 0x001B266C 0x8022226C 0x00000000 */ .word 0x00000000 # nop
