/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AC11C..0x002AC14C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-folded forward: lui $v0,0x8023 / lw $v0,-0x568C read by lw $a0,0x19F0($v0) at 0x002AC130 before reload. Body frame -0x18 (glabel func_002AC124). jr $ra at 0x002AC144 + delay. */
func_002AC11C:
/* 0x002AC11C 0x8031BD1C 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AC120 0x8031BD20 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)

/* function boundary candidate: func_002AC124, size=40, kind=prologue */
func_002AC124:
/* 0x002AC124 0x8031BD24 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AC128 0x8031BD28 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AC12C 0x8031BD2C 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002AC130 0x8031BD30 0x8C4419F0 */ .word 0x8C4419F0 # lw $a0, 0x19F0($v0)
/* 0x002AC134 0x8031BD34 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AC138 0x8031BD38 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002AC13C 0x8031BD3C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AC140 0x8031BD40 0xAC4019F0 */ .word 0xAC4019F0 # sw $zero, 0x19F0($v0)
/* 0x002AC144 0x8031BD44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AC148 0x8031BD48 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
