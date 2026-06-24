/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A1380..0x002A13C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Read-before-write preamble lui/lw@0x002A1380-84 folded forward into prologue addiu$sp,-0x18@0x002A1388 (addu $v0,$s0,$v0 reads preamble's $v0). Returns jr$ra@0x002A13BC + delay addiu$sp,0x18@0x002A13C0. */
func_002A1380:
/* 0x002A1380 0x80310F80 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A1384 0x80310F84 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)

/* function boundary candidate: func_002A1388, size=252, kind=prologue */
func_002A1388:
/* 0x002A1388 0x80310F88 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A138C 0x80310F8C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x002A1390 0x80310F90 0x00048080 */ .word 0x00048080 # sll $s0, $a0, 2
/* 0x002A1394 0x80310F94 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x002A1398 0x80310F98 0x02021021 */ .word 0x02021021 # addu $v0, $s0, $v0
/* 0x002A139C 0x80310F9C 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002A13A0 0x80310FA0 0x8C4400F8 */ .word 0x8C4400F8 # lw $a0, 0xF8($v0)
/* 0x002A13A4 0x80310FA4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A13A8 0x80310FA8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A13AC 0x80310FAC 0x02028021 */ .word 0x02028021 # addu $s0, $s0, $v0
/* 0x002A13B0 0x80310FB0 0xAE0000F8 */ .word 0xAE0000F8 # sw $zero, 0xF8($s0)
/* 0x002A13B4 0x80310FB4 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x002A13B8 0x80310FB8 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x002A13BC 0x80310FBC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A13C0 0x80310FC0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
