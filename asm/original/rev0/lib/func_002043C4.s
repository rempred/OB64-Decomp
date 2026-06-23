/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x002043C4..0x002043E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: addiu $sp,-0x20; jal 0x801C0F50; jr$ra at 0x002043D8 + delay addiu $sp,0x20 at 0x002043DC. */
/* function boundary candidate: func_002043C4, size=28, kind=prologue */
func_002043C4:
/* 0x002043C4 0x80273FC4 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x002043C8 0x80273FC8 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x002043CC 0x80273FCC 0x0C0703D4 */ .word 0x0C0703D4 # jal 0x801C0F50
/* 0x002043D0 0x80273FD0 0xAFA00010 */ .word 0xAFA00010 # sw $zero, 0x10($sp)
/* 0x002043D4 0x80273FD4 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x002043D8 0x80273FD8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002043DC 0x80273FDC 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
