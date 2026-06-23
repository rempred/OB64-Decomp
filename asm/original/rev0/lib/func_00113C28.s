/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x00113C28..0x00113C60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed (addiu $sp,-0x18). jr $ra at 0x113C58 + delay slot addiu $sp,0x18 at 0x113C5C; true end 0x113C60. Parent end 0x113C68 over-included the next function's preamble (0x113C60-0x113C64) which is split off. */
/* function boundary candidate: func_00113C28, size=56, kind=prologue */
func_00113C28:
/* 0x00113C28 0x80183828 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00113C2C 0x8018382C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00113C30 0x80183830 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x00113C34 0x80183834 0x24040800 */ .word 0x24040800 # addiu $a0, $zero, 0x800
/* 0x00113C38 0x80183838 0x3C013D4C */ .word 0x3C013D4C # lui $at, 0x3D4C
/* 0x00113C3C 0x8018383C 0x3421CCCD */ .word 0x3421CCCD # ori $at, $at, 0xCCCD
/* 0x00113C40 0x80183840 0x44810000 */ .word 0x44810000 # mtc1 $at, $f0
/* 0x00113C44 0x80183844 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00113C48 0x80183848 0xAC220CAC */ .word 0xAC220CAC # sw $v0, 0xCAC($at)
/* 0x00113C4C 0x8018384C 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00113C50 0x80183850 0xE42039A4 */ .word 0xE42039A4 # swc1 $f0, 0x39A4($at)
/* 0x00113C54 0x80183854 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00113C58 0x80183858 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00113C5C 0x8018385C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
