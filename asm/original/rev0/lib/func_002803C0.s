/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x002803C0..0x00280410 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan fold of func_002803D0: 4-word read-before-write preamble @0x002803C0-0x002803CC (lui/lw $a0 from 0x8023CB20, lui/lw $a1 from 0x800F9BA0 GBI cursor) feeding the body @0x002803D0 (addiu $sp,-0x18) which does sw $v0,0($a1) before writing $a1. GBI FA00 store + jal 0x8022A488. Ends jr $ra @0x00280408 + delay @0x0028040C. */
func_002803C0:
/* 0x002803C0 0x802EFFC0 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x002803C4 0x802EFFC4 0x8C84CB20 */ .word 0x8C84CB20 # lw $a0, -0x34E0($a0)
/* 0x002803C8 0x802EFFC8 0x3C05800F */ .word 0x3C05800F # lui $a1, 0x800F
/* 0x002803CC 0x802EFFCC 0x8CA59BA0 */ .word 0x8CA59BA0 # lw $a1, -0x6460($a1)

/* function boundary candidate: func_002803D0, size=64, kind=prologue */
func_002803D0:
/* 0x002803D0 0x802EFFD0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002803D4 0x802EFFD4 0x3C02FA00 */ .word 0x3C02FA00 # lui $v0, 0xFA00
/* 0x002803D8 0x802EFFD8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002803DC 0x802EFFDC 0xACA20000 */ .word 0xACA20000 # sw $v0, 0x0($a1)
/* 0x002803E0 0x802EFFE0 0x8C830020 */ .word 0x8C830020 # lw $v1, 0x20($a0)
/* 0x002803E4 0x802EFFE4 0x24A20008 */ .word 0x24A20008 # addiu $v0, $a1, 0x8
/* 0x002803E8 0x802EFFE8 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x002803EC 0x802EFFEC 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x002803F0 0x802EFFF0 0x90620019 */ .word 0x90620019 # lbu $v0, 0x19($v1)
/* 0x002803F4 0x802EFFF4 0x2403FF00 */ .word 0x2403FF00 # addiu $v1, $zero, -0x100
/* 0x002803F8 0x802EFFF8 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x002803FC 0x802EFFFC 0x0C08A922 */ .word 0x0C08A922 # jal 0x8022A488
/* 0x00280400 0x802F0000 0xACA20004 */ .word 0xACA20004 # sw $v0, 0x4($a1)
/* 0x00280404 0x802F0004 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00280408 0x802F0008 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028040C 0x802F000C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
