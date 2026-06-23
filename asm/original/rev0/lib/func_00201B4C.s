/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201B4C..0x00201B6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. lui/lw/sll/addu/sll/addu; jr$ra@0x00201B64 + delay lh@0x00201B68. */
func_00201B4C:
/* 0x00201B4C 0x8027174C 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201B50 0x80271750 0x8C6306A8 */ .word 0x8C6306A8 # lw $v1, 0x6A8($v1)
/* 0x00201B54 0x80271754 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00201B58 0x80271758 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201B5C 0x8027175C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00201B60 0x80271760 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201B64 0x80271764 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201B68 0x80271768 0x84420000 */ .word 0x84420000 # lh $v0, 0x0($v0)
