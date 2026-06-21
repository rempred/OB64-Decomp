/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018F80..0x00018FD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00018F80, size=80, kind=leaf */
func_00018F80:
/* 0x00018F80 0x80088B80 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018F84 0x80088B84 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)

/* function boundary candidate: func_00018F88, size=72, kind=prologue */
func_00018F88:
/* 0x00018F88 0x80088B88 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00018F8C 0x80088B8C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00018F90 0x80088B90 0x00048400 */ .word 0x00048400 # sll $s0, $a0, 16
/* 0x00018F94 0x80088B94 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00018F98 0x80088B98 0x8C420034 */ .word 0x8C420034 # lw $v0, 0x34($v0)
/* 0x00018F9C 0x80088B9C 0x00108383 */ .word 0x00108383 # sra $s0, $s0, 14
/* 0x00018FA0 0x80088BA0 0x26040024 */ .word 0x26040024 # addiu $a0, $s0, 0x24
/* 0x00018FA4 0x80088BA4 0x0C021768 */ .word 0x0C021768 # jal 0x80085DA0
/* 0x00018FA8 0x80088BA8 0x00442021 */ .word 0x00442021 # addu $a0, $v0, $a0
/* 0x00018FAC 0x80088BAC 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018FB0 0x80088BB0 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x00018FB4 0x80088BB4 0x8C420034 */ .word 0x8C420034 # lw $v0, 0x34($v0)
/* 0x00018FB8 0x80088BB8 0x02028021 */ .word 0x02028021 # addu $s0, $s0, $v0
/* 0x00018FBC 0x80088BBC 0x8E020024 */ .word 0x8E020024 # lw $v0, 0x24($s0)
/* 0x00018FC0 0x80088BC0 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00018FC4 0x80088BC4 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00018FC8 0x80088BC8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018FCC 0x80088BCC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
