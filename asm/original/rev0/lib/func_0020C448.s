/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C448..0x0020C478 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed wrapper addiu$sp,-0x18; jal 0x8016FA34 with four lhu args; jr$ra at C470/delay C474. */
/* function boundary candidate: func_0020C448, size=112, kind=prologue */
func_0020C448:
/* 0x0020C448 0x8027C048 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020C44C 0x8027C04C 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0020C450 0x8027C050 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020C454 0x8027C054 0x94440036 */ .word 0x94440036 # lhu $a0, 0x36($v0)
/* 0x0020C458 0x8027C058 0x94450038 */ .word 0x94450038 # lhu $a1, 0x38($v0)
/* 0x0020C45C 0x8027C05C 0x9446003A */ .word 0x9446003A # lhu $a2, 0x3A($v0)
/* 0x0020C460 0x8027C060 0x0C05BE8D */ .word 0x0C05BE8D # jal 0x8016FA34
/* 0x0020C464 0x8027C064 0x9447003C */ .word 0x9447003C # lhu $a3, 0x3C($v0)
/* 0x0020C468 0x8027C068 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020C46C 0x8027C06C 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x0020C470 0x8027C070 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C474 0x8027C074 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
