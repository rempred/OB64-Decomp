/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018380..0x000183C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00018380 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00018380:
/* 0x00018380 0x80087F80 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018384 0x80087F84 0x8C429E50 */ .word 0x8C429E50 # lw $v0, -0x61B0($v0)

/* function boundary candidate: func_00018388, size=60, kind=prologue */
func_00018388:
/* 0x00018388 0x80087F88 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001838C 0x80087F8C 0x1440000A */ .word 0x1440000A # bne $v0, $zero, 0x80087FB8
/* 0x00018390 0x80087F90 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00018394 0x80087F94 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018398 0x80087F98 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x0001839C 0x80087F9C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000183A0 0x80087FA0 0x14400005 */ .word 0x14400005 # bne $v0, $zero, 0x80087FB8
/* 0x000183A4 0x80087FA4 0xAC249E50 */ .word 0xAC249E50 # sw $a0, -0x61B0($at)
/* 0x000183A8 0x80087FA8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000183AC 0x80087FAC 0xAC249E54 */ .word 0xAC249E54 # sw $a0, -0x61AC($at)
/* 0x000183B0 0x80087FB0 0x0C022174 */ .word 0x0C022174 # jal 0x800885D0
/* 0x000183B4 0x80087FB4 0x00A02021 */ .word 0x00A02021 # move $a0, $a1
/* 0x000183B8 0x80087FB8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000183BC 0x80087FBC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000183C0 0x80087FC0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
