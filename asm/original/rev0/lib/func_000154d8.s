/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000154D8..0x0001551C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000154D8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000154d8:
/* 0x000154D8 0x800850D8 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x000154DC 0x800850DC 0x24639B64 */ .word 0x24639B64 # addiu $v1, $v1, -0x649C
/* 0x000154E0 0x800850E0 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x000154E4 0x800850E4 0x1040000B */ .word 0x1040000B # beq $v0, $zero, 0x80085114
/* 0x000154E8 0x800850E8 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x000154EC 0x800850EC 0x00602021 */ .word 0x00602021 # move $a0, $v1
/* 0x000154F0 0x800850F0 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x000154F4 0x800850F4 0x8C430000 */ .word 0x8C430000 # lw $v1, 0x0($v0)
/* 0x000154F8 0x800850F8 0x00A3102A */ .word 0x00A3102A # slt $v0, $a1, $v1
/* 0x000154FC 0x800850FC 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x80085104
/* 0x00015500 0x80085100 0x00602821 */ .word 0x00602821 # move $a1, $v1
/* 0x00015504 0x80085104 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x00015508 0x80085108 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x0001550C 0x8008510C 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x800850F0
/* 0x00015510 0x80085110 0x00000000 */ .word 0x00000000 # nop
/* 0x00015514 0x80085114 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015518 0x80085118 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
