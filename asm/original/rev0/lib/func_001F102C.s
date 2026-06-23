/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F102C..0x001F1050 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless push helper (no addiu$sp prologue): lui/lw/lw, increments count word, jr$ra@0x1F1048 + delay sw@0x1F104C. Un-merged from the parent over-merge. */
func_001F102C:
/* 0x001F102C 0x80260C2C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F1030 0x80260C30 0x8C42E8BC */ .word 0x8C42E8BC # lw $v0, -0x1744($v0)
/* 0x001F1034 0x80260C34 0x8C4352BC */ .word 0x8C4352BC # lw $v1, 0x52BC($v0)
/* 0x001F1038 0x80260C38 0x24650001 */ .word 0x24650001 # addiu $a1, $v1, 0x1
/* 0x001F103C 0x80260C3C 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x001F1040 0x80260C40 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x001F1044 0x80260C44 0xAC4552BC */ .word 0xAC4552BC # sw $a1, 0x52BC($v0)
/* 0x001F1048 0x80260C48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F104C 0x80260C4C 0xAC6451E4 */ .word 0xAC6451E4 # sw $a0, 0x51E4($v1)
