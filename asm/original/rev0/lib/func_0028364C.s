/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028364C..0x00283654 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: bare jr$ra@0x0028364C + nop delay. Un-merged from idx32 parent over-merge. */
/* 0x0028364C 0x802F324C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283650 0x802F3250 0x00000000 */ .word 0x00000000 # nop
