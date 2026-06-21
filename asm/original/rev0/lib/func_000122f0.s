/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000122F0..0x00012320 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_000122F0, size=48, kind=prologue */
func_000122F0:
/* 0x000122F0 0x80081EF0 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x000122F4 0x80081EF4 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x000122F8 0x80081EF8 0xAFA40014 */ .word 0xAFA40014 # sw $a0, 0x14($sp)
/* 0x000122FC 0x80081EFC 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012300 0x80081F00 0xAC241834 */ .word 0xAC241834 # sw $a0, 0x1834($at)
/* 0x00012304 0x80081F04 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x00012308 0x80081F08 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x0001230C 0x80081F0C 0x0C020885 */ .word 0x0C020885 # jal 0x80082214
/* 0x00012310 0x80081F10 0xA3A20010 */ .word 0xA3A20010 # sb $v0, 0x10($sp)
/* 0x00012314 0x80081F14 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x00012318 0x80081F18 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001231C 0x80081F1C 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
