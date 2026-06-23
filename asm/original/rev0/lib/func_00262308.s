/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262308..0x00262328 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (record field init: sh 0x7/0x708, sw zero). jr$ra@0x262320 + delay 0x262324. */
/* 0x00262308 0x802D1F08 0x24020007 */ .word 0x24020007 # addiu $v0, $zero, 0x7
/* 0x0026230C 0x802D1F0C 0xA4820008 */ .word 0xA4820008 # sh $v0, 0x8($a0)
/* 0x00262310 0x802D1F10 0x24020708 */ .word 0x24020708 # addiu $v0, $zero, 0x708
/* 0x00262314 0x802D1F14 0xAC800004 */ .word 0xAC800004 # sw $zero, 0x4($a0)
/* 0x00262318 0x802D1F18 0xA480000A */ .word 0xA480000A # sh $zero, 0xA($a0)
/* 0x0026231C 0x802D1F1C 0xAC82000C */ .word 0xAC82000C # sw $v0, 0xC($a0)
/* 0x00262320 0x802D1F20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262324 0x802D1F24 0xAC800010 */ .word 0xAC800010 # sw $zero, 0x10($a0)
