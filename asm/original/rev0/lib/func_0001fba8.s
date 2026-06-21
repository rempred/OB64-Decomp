/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FBA0..0x0001FBCC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FBA0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001fba8:
/* 0x0001FBA0 0x8008F7A0 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x0001FBA4 0x8008F7A4 0x8C42A710 */ .word 0x8C42A710 # lw $v0, -0x58F0($v0)

/* function boundary candidate: func_0001FBA8, size=36, kind=prologue */
func_0001FBA8:
/* 0x0001FBA8 0x8008F7A8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001FBAC 0x8008F7AC 0x14400004 */ .word 0x14400004 # bne $v0, $zero, 0x8008F7C0
/* 0x0001FBB0 0x8008F7B0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001FBB4 0x8008F7B4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x0001FBB8 0x8008F7B8 0x0C023E48 */ .word 0x0C023E48 # jal 0x8008F920
/* 0x0001FBBC 0x8008F7BC 0xAC24A710 */ .word 0xAC24A710 # sw $a0, -0x58F0($at)
/* 0x0001FBC0 0x8008F7C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001FBC4 0x8008F7C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FBC8 0x8008F7C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
