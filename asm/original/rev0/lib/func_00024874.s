/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00024874..0x000248AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00024874, size=56, kind=prologue */
func_00024874:
/* 0x00024874 0x80094474 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00024878 0x80094478 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0002487C 0x8009447C 0x8C840274 */ .word 0x8C840274 # lw $a0, 0x274($a0)
/* 0x00024880 0x80094480 0x8C830010 */ .word 0x8C830010 # lw $v1, 0x10($a0)
/* 0x00024884 0x80094484 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00024888 0x80094488 0x14620005 */ .word 0x14620005 # bne $v1, $v0, 0x800944A0
/* 0x0002488C 0x8009448C 0x00000000 */ .word 0x00000000 # nop
/* 0x00024890 0x80094490 0x8C820004 */ .word 0x8C820004 # lw $v0, 0x4($a0)
/* 0x00024894 0x80094494 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x00024898 0x80094498 0x0C024F10 */ .word 0x0C024F10 # jal 0x80093C40
/* 0x0002489C 0x8009449C 0xAC820004 */ .word 0xAC820004 # sw $v0, 0x4($a0)
/* 0x000248A0 0x800944A0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000248A4 0x800944A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000248A8 0x800944A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
