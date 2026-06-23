/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024B3BC..0x0024B3C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf / empty stub: jr$ra@0x0024B3BC + delay nop@0x0024B3C0. Fall-through entry after the prior function's return-delay slot, so a separate function. */
/* 0x0024B3BC 0x802BAFBC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0024B3C0 0x802BAFC0 0x00000000 */ .word 0x00000000 # nop
