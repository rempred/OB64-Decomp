/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00024040..0x00024060 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00024040, size=28, kind=prologue */
func_00024040:
/* 0x00024040 0x80093C40 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00024044 0x80093C44 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00024048 0x80093C48 0x0C0269D8 */ .word 0x0C0269D8 # jal 0x8009A760
/* 0x0002404C 0x80093C4C 0x24040400 */ .word 0x24040400 # addiu $a0, $zero, 0x400
/* 0x00024050 0x80093C50 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00024054 0x80093C54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00024058 0x80093C58 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0002405C 0x80093C5C 0x00000000 */ .word 0x00000000 # nop
