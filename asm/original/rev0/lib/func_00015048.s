/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015048..0x00015098 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00015048, size=80, kind=leaf */
func_00015048:
/* 0x00015048 0x80084C48 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x0001504C 0x80084C4C 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)

/* function boundary candidate: func_00015050, size=72, kind=prologue */
func_00015050:
/* 0x00015050 0x80084C50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00015054 0x80084C54 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00015058 0x80084C58 0x00048400 */ .word 0x00048400 # sll $s0, $a0, 16
/* 0x0001505C 0x80084C5C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00015060 0x80084C60 0x8C420034 */ .word 0x8C420034 # lw $v0, 0x34($v0)
/* 0x00015064 0x80084C64 0x00108383 */ .word 0x00108383 # sra $s0, $s0, 14
/* 0x00015068 0x80084C68 0x26040024 */ .word 0x26040024 # addiu $a0, $s0, 0x24
/* 0x0001506C 0x80084C6C 0x0C021326 */ .word 0x0C021326 # jal 0x80084C98
/* 0x00015070 0x80084C70 0x00442021 */ .word 0x00442021 # addu $a0, $v0, $a0
/* 0x00015074 0x80084C74 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00015078 0x80084C78 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x0001507C 0x80084C7C 0x8C420034 */ .word 0x8C420034 # lw $v0, 0x34($v0)
/* 0x00015080 0x80084C80 0x02028021 */ .word 0x02028021 # addu $s0, $s0, $v0
/* 0x00015084 0x80084C84 0x8E020024 */ .word 0x8E020024 # lw $v0, 0x24($s0)
/* 0x00015088 0x80084C88 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0001508C 0x80084C8C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00015090 0x80084C90 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015094 0x80084C94 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
