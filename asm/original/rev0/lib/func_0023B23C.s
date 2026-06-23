/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B23C..0x0023B244 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf: jr$ra@0x0023B23C + delay nop@0x0023B240. No-op stub. */
/* 0x0023B23C 0x802AAE3C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B240 0x802AAE40 0x00000000 */ .word 0x00000000 # nop
