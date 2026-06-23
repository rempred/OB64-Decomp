/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B244..0x0023B24C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf: jr$ra@0x0023B244 + delay nop@0x0023B248. No-op stub. */
/* 0x0023B244 0x802AAE44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B248 0x802AAE48 0x00000000 */ .word 0x00000000 # nop
