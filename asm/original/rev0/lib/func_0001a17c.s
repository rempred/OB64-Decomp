/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A17C..0x0001A19C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A17C, size=32, kind=prologue */
func_0001A17C:
/* 0x0001A17C 0x80089D7C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A180 0x80089D80 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A184 0x80089D84 0x3C04800C */ .word 0x3C04800C # lui $a0, 0x800C
/* 0x0001A188 0x80089D88 0x0C025288 */ .word 0x0C025288 # jal 0x80094A20
/* 0x0001A18C 0x80089D8C 0x2484BE80 */ .word 0x2484BE80 # addiu $a0, $a0, -0x4180
/* 0x0001A190 0x80089D90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A194 0x80089D94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A198 0x80089D98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
