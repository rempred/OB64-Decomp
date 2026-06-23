/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280410..0x00280460 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan fold of func_00280420: 4-word read-before-write preamble @0x00280410-0x0028041C (lui/lw $a0, lui/lw $a1 GBI cursor) feeding body @0x00280420 which uses $a1 before write. GBI FA00 store + jal 0x8022A2A8. Ends jr $ra @0x00280458 + delay @0x0028045C. */
func_00280410:
/* 0x00280410 0x802F0010 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x00280414 0x802F0014 0x8C84CB20 */ .word 0x8C84CB20 # lw $a0, -0x34E0($a0)
/* 0x00280418 0x802F0018 0x3C05800F */ .word 0x3C05800F # lui $a1, 0x800F
/* 0x0028041C 0x802F001C 0x8CA59BA0 */ .word 0x8CA59BA0 # lw $a1, -0x6460($a1)

/* function boundary candidate: func_00280420, size=64, kind=prologue */
func_00280420:
/* 0x00280420 0x802F0020 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00280424 0x802F0024 0x3C02FA00 */ .word 0x3C02FA00 # lui $v0, 0xFA00
/* 0x00280428 0x802F0028 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0028042C 0x802F002C 0xACA20000 */ .word 0xACA20000 # sw $v0, 0x0($a1)
/* 0x00280430 0x802F0030 0x8C830024 */ .word 0x8C830024 # lw $v1, 0x24($a0)
/* 0x00280434 0x802F0034 0x24A20008 */ .word 0x24A20008 # addiu $v0, $a1, 0x8
/* 0x00280438 0x802F0038 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0028043C 0x802F003C 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x00280440 0x802F0040 0x90620019 */ .word 0x90620019 # lbu $v0, 0x19($v1)
/* 0x00280444 0x802F0044 0x2403FF00 */ .word 0x2403FF00 # addiu $v1, $zero, -0x100
/* 0x00280448 0x802F0048 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x0028044C 0x802F004C 0x0C08A8AA */ .word 0x0C08A8AA # jal 0x8022A2A8
/* 0x00280450 0x802F0050 0xACA20004 */ .word 0xACA20004 # sw $v0, 0x4($a1)
/* 0x00280454 0x802F0054 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00280458 0x802F0058 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028045C 0x802F005C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
