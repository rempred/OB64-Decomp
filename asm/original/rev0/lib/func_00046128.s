/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046128..0x00046144 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x4613C */
func_00046128:
/* 0x00046128 0x800B5D28 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x0004612C 0x800B5D2C 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x00046130 0x800B5D30 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00046134 0x800B5D34 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046138 0x800B5D38 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x0004613C 0x800B5D3C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046140 0x800B5D40 0x90223BD4 */ .word 0x90223BD4 # lbu $v0, 0x3BD4($at)
