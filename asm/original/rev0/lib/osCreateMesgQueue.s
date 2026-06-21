/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023970..0x000239A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023970 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
osCreateMesgQueue:
/* function boundary candidate: func_00023970, size=36, kind=leaf */
func_00023970:
/* 0x00023970 0x80093570 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00023974 0x80093574 0x2442A790 */ .word 0x2442A790 # addiu $v0, $v0, -0x5870
/* 0x00023978 0x80093578 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x0002397C 0x8009357C 0xAC820004 */ .word 0xAC820004 # sw $v0, 0x4($a0)
/* 0x00023980 0x80093580 0xAC800008 */ .word 0xAC800008 # sw $zero, 0x8($a0)
/* 0x00023984 0x80093584 0xAC80000C */ .word 0xAC80000C # sw $zero, 0xC($a0)
/* 0x00023988 0x80093588 0xAC860010 */ .word 0xAC860010 # sw $a2, 0x10($a0)
/* 0x0002398C 0x8009358C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023990 0x80093590 0xAC850014 */ .word 0xAC850014 # sw $a1, 0x14($a0)
/* 0x00023994 0x80093594 0x00000000 */ .word 0x00000000 # nop
/* 0x00023998 0x80093598 0x00000000 */ .word 0x00000000 # nop
/* 0x0002399C 0x8009359C 0x00000000 */ .word 0x00000000 # nop
