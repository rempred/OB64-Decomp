/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00155CF0..0x00155D14 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word read-before-write preamble (lui $a0,0x8021 / lw $a0,0x4F5C at 0x00155CF0-0x00155CF4) feeding inner prologue func_00155CF8 (addiu $sp,-0x18) which passes $a0 to jal 0x800712C4 before writing it. Body jr $ra 0x00155D0C + delay 0x00155D10. */
func_00155CF0:
/* function boundary candidate: func_00155CF0, size=36, kind=leaf */
func_00155CF0:
/* 0x00155CF0 0x801C58F0 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x00155CF4 0x801C58F4 0x8C844F5C */ .word 0x8C844F5C # lw $a0, 0x4F5C($a0)

/* function boundary candidate: func_00155CF8, size=180, kind=prologue */
func_00155CF8:
/* 0x00155CF8 0x801C58F8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00155CFC 0x801C58FC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00155D00 0x801C5900 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00155D04 0x801C5904 0x00000000 */ .word 0x00000000 # nop
/* 0x00155D08 0x801C5908 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00155D0C 0x801C590C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00155D10 0x801C5910 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
