/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B234..0x0023B23C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf: jr$ra@0x0023B234 + delay addiu$v0,$zero,1@0x0023B238. Returns constant 1. */
/* 0x0023B234 0x802AAE34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B238 0x802AAE38 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
