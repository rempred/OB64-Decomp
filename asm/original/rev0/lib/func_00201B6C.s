/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201B6C..0x00201B8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor (offset +2). jr$ra@0x00201B84 + delay lh@0x00201B88. */
func_00201B6C:
/* 0x00201B6C 0x8027176C 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201B70 0x80271770 0x8C6306A8 */ .word 0x8C6306A8 # lw $v1, 0x6A8($v1)
/* 0x00201B74 0x80271774 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00201B78 0x80271778 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201B7C 0x8027177C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00201B80 0x80271780 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201B84 0x80271784 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201B88 0x80271788 0x84420002 */ .word 0x84420002 # lh $v0, 0x2($v0)
