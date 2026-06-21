/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000122A4..0x000122C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_000122A4, size=36, kind=prologue */
func_000122A4:
/* 0x000122A4 0x80081EA4 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x000122A8 0x80081EA8 0xAFA40014 */ .word 0xAFA40014 # sw $a0, 0x14($sp)
/* 0x000122AC 0x80081EAC 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x000122B0 0x80081EB0 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x000122B4 0x80081EB4 0x0C020885 */ .word 0x0C020885 # jal 0x80082214
/* 0x000122B8 0x80081EB8 0xA3A00010 */ .word 0xA3A00010 # sb $zero, 0x10($sp)
/* 0x000122BC 0x80081EBC 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x000122C0 0x80081EC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000122C4 0x80081EC4 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
