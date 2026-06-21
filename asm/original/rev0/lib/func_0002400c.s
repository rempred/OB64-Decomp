/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002400C..0x00024040 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0002400C, size=44, kind=prologue */
func_0002400C:
/* 0x0002400C 0x80093C0C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00024010 0x80093C10 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00024014 0x80093C14 0x0C0269D0 */ .word 0x0C0269D0 # jal 0x8009A740
/* 0x00024018 0x80093C18 0x00000000 */ .word 0x00000000 # nop
/* 0x0002401C 0x80093C1C 0x1440FFFD */ .word 0x1440FFFD # bne $v0, $zero, 0x80093C14
/* 0x00024020 0x80093C20 0x00000000 */ .word 0x00000000 # nop
/* 0x00024024 0x80093C24 0x0C0269D8 */ .word 0x0C0269D8 # jal 0x8009A760
/* 0x00024028 0x80093C28 0x24040125 */ .word 0x24040125 # addiu $a0, $zero, 0x125
/* 0x0002402C 0x80093C2C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00024030 0x80093C30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00024034 0x80093C34 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x00024038 0x80093C38 0x00000000 */ .word 0x00000000 # nop
/* 0x0002403C 0x80093C3C 0x00000000 */ .word 0x00000000 # nop
