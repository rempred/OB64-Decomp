/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000122C8..0x000122F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_000122C8, size=40, kind=prologue */
func_000122C8:
/* 0x000122C8 0x80081EC8 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x000122CC 0x80081ECC 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000122D0 0x80081ED0 0xAFA40014 */ .word 0xAFA40014 # sw $a0, 0x14($sp)
/* 0x000122D4 0x80081ED4 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x000122D8 0x80081ED8 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x000122DC 0x80081EDC 0x0C020885 */ .word 0x0C020885 # jal 0x80082214
/* 0x000122E0 0x80081EE0 0xA3A20010 */ .word 0xA3A20010 # sb $v0, 0x10($sp)
/* 0x000122E4 0x80081EE4 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x000122E8 0x80081EE8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000122EC 0x80081EEC 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
