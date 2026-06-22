/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046090..0x000460B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index, lbu in delay) un-merged from parent 0x45F30; jr $ra at 0x460B0 */
func_00046090:
/* 0x00046090 0x800B5C90 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00046094 0x800B5C94 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046098 0x800B5C98 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x0004609C 0x800B5C9C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000460A0 0x800B5CA0 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000460A4 0x800B5CA4 0x246371F2 */ .word 0x246371F2 # addiu $v1, $v1, 0x71F2
/* 0x000460A8 0x800B5CA8 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000460AC 0x800B5CAC 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x000460B0 0x800B5CB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000460B4 0x800B5CB4 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
