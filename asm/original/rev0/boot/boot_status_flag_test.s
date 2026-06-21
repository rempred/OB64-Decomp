/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00002B38_00011000.s
 * z64 range: 0x00002D44..0x00002D7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00002D44, size=56, kind=prologue */
func_00002D44:
/* 0x00002D44 0x80072944 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00002D48 0x80072948 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x00002D4C 0x8007294C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00002D50 0x80072950 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x00002D54 0x80072954 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00002D58 0x80072958 0x3C10800B */ .word 0x3C10800B # lui $s0, 0x800B
/* 0x00002D5C 0x8007295C 0x9210EF9A */ .word 0x9210EF9A # lbu $s0, -0x1066($s0)
/* 0x00002D60 0x80072960 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x00002D64 0x80072964 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00002D68 0x80072968 0x32020004 */ .word 0x32020004 # andi $v0, $s0, 0x0004
/* 0x00002D6C 0x8007296C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00002D70 0x80072970 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00002D74 0x80072974 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00002D78 0x80072978 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
