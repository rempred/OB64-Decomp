/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262840..0x0026285C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (record reset: sh 0x100, sw zero x4). jr$ra@0x262854 + delay 0x262858. */
/* 0x00262840 0x802D2440 0x24020100 */ .word 0x24020100 # addiu $v0, $zero, 0x100
/* 0x00262844 0x802D2444 0xA4820008 */ .word 0xA4820008 # sh $v0, 0x8($a0)
/* 0x00262848 0x802D2448 0xAC800004 */ .word 0xAC800004 # sw $zero, 0x4($a0)
/* 0x0026284C 0x802D244C 0xAC800014 */ .word 0xAC800014 # sw $zero, 0x14($a0)
/* 0x00262850 0x802D2450 0xAC800010 */ .word 0xAC800010 # sw $zero, 0x10($a0)
/* 0x00262854 0x802D2454 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262858 0x802D2458 0xAC80000C */ .word 0xAC80000C # sw $zero, 0xC($a0)
