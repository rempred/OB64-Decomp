/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001AC90..0x0001ACBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001AC90, size=44, kind=prologue */
func_0001AC90:
/* 0x0001AC90 0x8008A890 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001AC94 0x8008A894 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001AC98 0x8008A898 0x8C83000C */ .word 0x8C83000C # lw $v1, 0xC($a0)
/* 0x0001AC9C 0x8008A89C 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x0001ACA0 0x8008A8A0 0x8C660004 */ .word 0x8C660004 # lw $a2, 0x4($v1)
/* 0x0001ACA4 0x8008A8A4 0x8C440000 */ .word 0x8C440000 # lw $a0, 0x0($v0)
/* 0x0001ACA8 0x8008A8A8 0x0C025988 */ .word 0x0C025988 # jal 0x80096620
/* 0x0001ACAC 0x8008A8AC 0x8C450004 */ .word 0x8C450004 # lw $a1, 0x4($v0)
/* 0x0001ACB0 0x8008A8B0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001ACB4 0x8008A8B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001ACB8 0x8008A8B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
