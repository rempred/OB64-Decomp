/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00024C30..0x00024C60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00024C30, size=40, kind=prologue */
func_00024C30:
/* 0x00024C30 0x80094830 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00024C34 0x80094834 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00024C38 0x80094838 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x00024C3C 0x8009483C 0x24849BC8 */ .word 0x24849BC8 # addiu $a0, $a0, -0x6438
/* 0x00024C40 0x80094840 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00024C44 0x80094844 0x0C024E04 */ .word 0x0C024E04 # jal 0x80093810
/* 0x00024C48 0x80094848 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00024C4C 0x8009484C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00024C50 0x80094850 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00024C54 0x80094854 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x00024C58 0x80094858 0x00000000 */ .word 0x00000000 # nop
/* 0x00024C5C 0x8009485C 0x00000000 */ .word 0x00000000 # nop
