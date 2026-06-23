/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145CF4..0x00145D18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $a0,0x8020 / lw $a0,-0x25EC($a0) at 0x00145CF4-0x00145CF8 loads $a0 read by inner prologue (0x00145CFC, jal 0x800712C4) before write. Folded forward; jr $ra at 0x00145D10 + delay 0x00145D14. */
func_00145CF4:
/* 0x00145CF4 0x801B58F4 0x3C048020 */ .word 0x3C048020 # lui $a0, 0x8020

/* function boundary candidate: func_00145CF8, size=32, kind=leaf */
func_00145CF8:
/* 0x00145CF8 0x801B58F8 0x8C84DA14 */ .word 0x8C84DA14 # lw $a0, -0x25EC($a0)

/* function boundary candidate: func_00145CFC, size=64, kind=prologue */
func_00145CFC:
/* 0x00145CFC 0x801B58FC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00145D00 0x801B5900 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00145D04 0x801B5904 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00145D08 0x801B5908 0x00000000 */ .word 0x00000000 # nop
/* 0x00145D0C 0x801B590C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00145D10 0x801B5910 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145D14 0x801B5914 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
