/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B3D4..0x0023B3E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf un-merged from func_0023B274's tail: jr$ra@0x0023B3D4 + delay lbu$v0,0xA4($a0)@0x0023B3D8. Trailing alignment nop @0x0023B3DC attaches here. */
/* 0x0023B3D4 0x802AAFD4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B3D8 0x802AAFD8 0x908200A4 */ .word 0x908200A4 # lbu $v0, 0xA4($a0)
/* 0x0023B3DC 0x802AAFDC 0x00000000 */ .word 0x00000000 # nop
