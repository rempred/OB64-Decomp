/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025D8A4..0x0025D8D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf. Prologue addiu $sp,-0x18; stores $a0 to 0x80220F6C, $a1 to 0x80220F68, jal 0x8020DF00. jr $ra at 0x0025D8CC + delay at 0x0025D8D0. */
/* function boundary candidate: func_0025D8A4, size=48, kind=prologue */
func_0025D8A4:
/* 0x0025D8A4 0x802CD4A4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025D8A8 0x802CD4A8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0025D8AC 0x802CD4AC 0xAC240F6C */ .word 0xAC240F6C # sw $a0, 0xF6C($at)
/* 0x0025D8B0 0x802CD4B0 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0025D8B4 0x802CD4B4 0x24848B08 */ .word 0x24848B08 # addiu $a0, $a0, -0x74F8
/* 0x0025D8B8 0x802CD4B8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025D8BC 0x802CD4BC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0025D8C0 0x802CD4C0 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0025D8C4 0x802CD4C4 0xAC250F68 */ .word 0xAC250F68 # sw $a1, 0xF68($at)
/* 0x0025D8C8 0x802CD4C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025D8CC 0x802CD4CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025D8D0 0x802CD4D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
