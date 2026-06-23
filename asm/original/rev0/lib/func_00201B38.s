/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201B38..0x00201B4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. lui/lw/addu; jr$ra@0x00201B44 + delay lbu@0x00201B48. */
func_00201B38:
/* 0x00201B38 0x80271738 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00201B3C 0x8027173C 0x8C4206A4 */ .word 0x8C4206A4 # lw $v0, 0x6A4($v0)
/* 0x00201B40 0x80271740 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201B44 0x80271744 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201B48 0x80271748 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
