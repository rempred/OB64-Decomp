/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262C44..0x00262C54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless accessor (lw FE8; jr$ra; lh +0x1A). jr$ra@0x262C4C + delay 0x262C50. */
/* 0x00262C44 0x802D2844 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00262C48 0x802D2848 0x8C420FE8 */ .word 0x8C420FE8 # lw $v0, 0xFE8($v0)
/* 0x00262C4C 0x802D284C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262C50 0x802D2850 0x8442001A */ .word 0x8442001A # lh $v0, 0x1A($v0)
