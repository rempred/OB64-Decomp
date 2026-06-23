/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201E08..0x00201E38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18@0x201E08. jal 0x801BE9A8 then mult/mflo; returns jr@0x00201E30 + delay addiu$sp,0x18@0x00201E34. */
/* function boundary candidate: func_00201E08, size=248, kind=prologue */
func_00201E08:
/* 0x00201E08 0x80271A08 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00201E0C 0x80271A0C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00201E10 0x80271A10 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00201E14 0x80271A14 0x0C06FA6A */ .word 0x0C06FA6A # jal 0x801BE9A8
/* 0x00201E18 0x80271A18 0x00C08021 */ .word 0x00C08021 # move $s0, $a2
/* 0x00201E1C 0x80271A1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00201E20 0x80271A20 0x00500018 */ .word 0x00500018 # mult $v0, $s0
/* 0x00201E24 0x80271A24 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00201E28 0x80271A28 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00201E2C 0x80271A2C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00201E30 0x80271A30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201E34 0x80271A34 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
