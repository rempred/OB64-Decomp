/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x0015FB50..0x0015FB88 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word read-before-write preamble lui $a0,0x8021/lw $a0,0x4A6C($a0) @0x15FB50-0x15FB54 loads $a0 consumed by inner prologue body at 0x15FB58 (addiu $sp,-0x18). Folded FORWARD. jal 0x800712C4 x2; clears 0x4A6C. jr $ra@0x15FB80 + delay addiu $sp,0x18@0x15FB84. Ends 0x15FB88. */
func_0015FB50:
/* 0x0015FB50 0x801CF750 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0015FB54 0x801CF754 0x8C844A6C */ .word 0x8C844A6C # lw $a0, 0x4A6C($a0)

/* function boundary candidate: func_0015FB58, size=48, kind=prologue */
func_0015FB58:
/* 0x0015FB58 0x801CF758 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0015FB5C 0x801CF75C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0015FB60 0x801CF760 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0015FB64 0x801CF764 0x00000000 */ .word 0x00000000 # nop
/* 0x0015FB68 0x801CF768 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0015FB6C 0x801CF76C 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0015FB70 0x801CF770 0x8C844EAC */ .word 0x8C844EAC # lw $a0, 0x4EAC($a0)
/* 0x0015FB74 0x801CF774 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x0015FB78 0x801CF778 0xAC204A6C */ .word 0xAC204A6C # sw $zero, 0x4A6C($at)
/* 0x0015FB7C 0x801CF77C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0015FB80 0x801CF780 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0015FB84 0x801CF784 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
