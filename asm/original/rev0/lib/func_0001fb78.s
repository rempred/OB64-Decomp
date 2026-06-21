/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FB78..0x0001FBA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FB78 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001fb78:
/* 0x0001FB78 0x8008F778 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0001FB7C 0x8008F77C 0x10A20005 */ .word 0x10A20005 # beq $a1, $v0, 0x8008F794
/* 0x0001FB80 0x8008F780 0x24020006 */ .word 0x24020006 # addiu $v0, $zero, 0x6
/* 0x0001FB84 0x8008F784 0x50A20004 */ .word 0x50A20004 # beql $a1, $v0, 0x8008F798
/* 0x0001FB88 0x8008F788 0xAC860014 */ .word 0xAC860014 # sw $a2, 0x14($a0)
/* 0x0001FB8C 0x8008F78C 0x08023DE6 */ .word 0x08023DE6 # j 0x8008F798
/* 0x0001FB90 0x8008F790 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FB94 0x8008F794 0xAC860000 */ .word 0xAC860000 # sw $a2, 0x0($a0)
/* 0x0001FB98 0x8008F798 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FB9C 0x8008F79C 0x00001021 */ .word 0x00001021 # move $v0, $zero
