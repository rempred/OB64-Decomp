/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262C54..0x00262C64 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless accessor (lw FE8; jr$ra; sh $a0,+0x1A). jr$ra@0x262C5C + delay 0x262C60. */
/* 0x00262C54 0x802D2854 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00262C58 0x802D2858 0x8C420FE8 */ .word 0x8C420FE8 # lw $v0, 0xFE8($v0)
/* 0x00262C5C 0x802D285C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262C60 0x802D2860 0xA444001A */ .word 0xA444001A # sh $a0, 0x1A($v0)
