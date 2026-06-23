/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280398..0x002803B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small wrapper addiu $sp,-0x18; jal 0x8022874C with lui/addiu $a0 ptr. Ends jr $ra @0x002803B0 + delay @0x002803B4. Next 2 words are a separate frameless leaf. */
/* function boundary candidate: func_00280398, size=40, kind=prologue */
func_00280398:
/* 0x00280398 0x802EFF98 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0028039C 0x802EFF9C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002803A0 0x802EFFA0 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x002803A4 0x802EFFA4 0x0C08A1D3 */ .word 0x0C08A1D3 # jal 0x8022874C
/* 0x002803A8 0x802EFFA8 0x2484B5EC */ .word 0x2484B5EC # addiu $a0, $a0, -0x4A14
/* 0x002803AC 0x802EFFAC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002803B0 0x802EFFB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002803B4 0x802EFFB4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
