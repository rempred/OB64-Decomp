/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FB82C..0x000FB83C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless: clears 0x88. jr ra @0xFB834 + delay store. */
/* 0x000FB82C 0x8016B42C 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x000FB830 0x8016B430 0x8C423390 */ .word 0x8C423390 # lw $v0, 0x3390($v0)
/* 0x000FB834 0x8016B434 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FB838 0x8016B438 0xA0400088 */ .word 0xA0400088 # sb $zero, 0x88($v0)
