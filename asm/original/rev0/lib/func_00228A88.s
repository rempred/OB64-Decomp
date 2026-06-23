/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00228A88..0x00228AC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* TRUE entry is the 2-word preamble at 0x00228A88 (lui $v1,0x800F; lw $v1,-0x6460($v1)) folded FORWARD: the addiu$sp,-0x18 prologue at 0x00228A90 reads $v1 ('addiu $v0,$v1,0x8' @0x00228A9C) before writing it. Frame leaf: advances head ptr, writes FA000000/-1 words, jal 0x801E4028. jr$ra@0x00228AC0 + delay@0x00228AC4. */
func_00228A88:
/* 0x00228A88 0x80298688 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x00228A8C 0x8029868C 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)

/* function boundary candidate: func_00228A90, size=56, kind=prologue */
func_00228A90:
/* 0x00228A90 0x80298690 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00228A94 0x80298694 0x24840024 */ .word 0x24840024 # addiu $a0, $a0, 0x24
/* 0x00228A98 0x80298698 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00228A9C 0x8029869C 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x00228AA0 0x802986A0 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x00228AA4 0x802986A4 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x00228AA8 0x802986A8 0x3C02FA00 */ .word 0x3C02FA00 # lui $v0, 0xFA00
/* 0x00228AAC 0x802986AC 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x00228AB0 0x802986B0 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x00228AB4 0x802986B4 0x0C07900A */ .word 0x0C07900A # jal 0x801E4028
/* 0x00228AB8 0x802986B8 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
/* 0x00228ABC 0x802986BC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00228AC0 0x802986C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00228AC4 0x802986C4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
