/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00228A44..0x00228A88 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame leaf (addiu $sp,-0x18). Loads 0x800F-0x6460 head ptr, advances it +8, writes FA000000 / 00FF00FF GBI words, jal 0x801E3A48. jr$ra@0x00228A80 + delay addiu$sp,0x18@0x00228A84. Ends at 0x00228A88: the trailing lui$v1/lw$v1 pair belongs to the NEXT function as a read-before-write preamble. */
/* function boundary candidate: func_00228A44, size=68, kind=prologue */
func_00228A44:
/* 0x00228A44 0x80298644 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00228A48 0x80298648 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x00228A4C 0x8029864C 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)
/* 0x00228A50 0x80298650 0x3C0700FF */ .word 0x3C0700FF # lui $a3, 0x00FF
/* 0x00228A54 0x80298654 0x34E700FF */ .word 0x34E700FF # ori $a3, $a3, 0x00FF
/* 0x00228A58 0x80298658 0x24840024 */ .word 0x24840024 # addiu $a0, $a0, 0x24
/* 0x00228A5C 0x8029865C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00228A60 0x80298660 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x00228A64 0x80298664 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x00228A68 0x80298668 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x00228A6C 0x8029866C 0x3C02FA00 */ .word 0x3C02FA00 # lui $v0, 0xFA00
/* 0x00228A70 0x80298670 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x00228A74 0x80298674 0x0C078E92 */ .word 0x0C078E92 # jal 0x801E3A48
/* 0x00228A78 0x80298678 0xAC670004 */ .word 0xAC670004 # sw $a3, 0x4($v1)
/* 0x00228A7C 0x8029867C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00228A80 0x80298680 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00228A84 0x80298684 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
