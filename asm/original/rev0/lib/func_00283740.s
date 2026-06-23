/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283740..0x00283748 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: bare jr$ra@0x00283740 + nop delay. */
/* 0x00283740 0x802F3340 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283744 0x802F3344 0x00000000 */ .word 0x00000000 # nop
