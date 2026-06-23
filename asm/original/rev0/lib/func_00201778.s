/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201778..0x00201798 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. lui/lw/sll/addu; jr$ra@0x00201790 + delay lbu@0x00201794. */
func_00201778:
/* 0x00201778 0x80271378 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x0020177C 0x8027137C 0x8C630688 */ .word 0x8C630688 # lw $v1, 0x688($v1)
/* 0x00201780 0x80271380 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00201784 0x80271384 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201788 0x80271388 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x0020178C 0x8027138C 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00201790 0x80271390 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201794 0x80271394 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
