/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026756C..0x002675B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD: true entry is the lui $v1,0x800F/lw $v1,-0x6460($v1) preamble at 0x0026756C that the addiu $sp,-0x18 body (0x00267574) reads before writing ($v1 at 0x00267580 addiu $v0,$v1,0x8). Calls 0x80212840. */
func_0026756C:
/* 0x0026756C 0x802D716C 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x00267570 0x802D7170 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)

/* function boundary candidate: func_00267574, size=64, kind=prologue */
func_00267574:
/* 0x00267574 0x802D7174 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00267578 0x802D7178 0x24840018 */ .word 0x24840018 # addiu $a0, $a0, 0x18
/* 0x0026757C 0x802D717C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00267580 0x802D7180 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x00267584 0x802D7184 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x00267588 0x802D7188 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x0026758C 0x802D718C 0x3C02DE00 */ .word 0x3C02DE00 # lui $v0, 0xDE00
/* 0x00267590 0x802D7190 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x00267594 0x802D7194 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00267598 0x802D7198 0x244205B0 */ .word 0x244205B0 # addiu $v0, $v0, 0x5B0
/* 0x0026759C 0x802D719C 0x0C084A10 */ .word 0x0C084A10 # jal 0x80212840
/* 0x002675A0 0x802D71A0 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
/* 0x002675A4 0x802D71A4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002675A8 0x802D71A8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002675AC 0x802D71AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002675B0 0x802D71B0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
