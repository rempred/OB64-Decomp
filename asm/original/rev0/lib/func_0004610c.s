/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004610C..0x00046128 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x46120 */
func_0004610c:
/* 0x0004610C 0x800B5D0C 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00046110 0x800B5D10 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x00046114 0x800B5D14 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00046118 0x800B5D18 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004611C 0x800B5D1C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00046120 0x800B5D20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046124 0x800B5D24 0x90223BF3 */ .word 0x90223BF3 # lbu $v0, 0x3BF3($at)
