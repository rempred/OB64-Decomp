/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001ACBC..0x0001ACE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001ACBC, size=44, kind=prologue */
func_0001ACBC:
/* 0x0001ACBC 0x8008A8BC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001ACC0 0x8008A8C0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001ACC4 0x8008A8C4 0x8C82000C */ .word 0x8C82000C # lw $v0, 0xC($a0)
/* 0x0001ACC8 0x8008A8C8 0x8C430000 */ .word 0x8C430000 # lw $v1, 0x0($v0)
/* 0x0001ACCC 0x8008A8CC 0x8C450004 */ .word 0x8C450004 # lw $a1, 0x4($v0)
/* 0x0001ACD0 0x8008A8D0 0x8C460008 */ .word 0x8C460008 # lw $a2, 0x8($v0)
/* 0x0001ACD4 0x8008A8D4 0x0C025AA4 */ .word 0x0C025AA4 # jal 0x80096A90
/* 0x0001ACD8 0x8008A8D8 0x8C640000 */ .word 0x8C640000 # lw $a0, 0x0($v1)
/* 0x0001ACDC 0x8008A8DC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001ACE0 0x8008A8E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001ACE4 0x8008A8E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
