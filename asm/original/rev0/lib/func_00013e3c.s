/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00013E3C..0x00013E74 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00013E3C, size=56, kind=prologue */
func_00013E3C:
/* 0x00013E3C 0x80083A3C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00013E40 0x80083A40 0x18C00009 */ .word 0x18C00009 # blez $a2, 0x80083A68
/* 0x00013E44 0x80083A44 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00013E48 0x80083A48 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00013E4C 0x80083A4C 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80083A5C
/* 0x00013E50 0x80083A50 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00013E54 0x80083A54 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00013E58 0x80083A58 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x00013E5C 0x80083A5C 0x0066102A */ .word 0x0066102A # slt $v0, $v1, $a2
/* 0x00013E60 0x80083A60 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x80083A48
/* 0x00013E64 0x80083A64 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x00013E68 0x80083A68 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x00013E6C 0x80083A6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00013E70 0x80083A70 0x00000000 */ .word 0x00000000 # nop
