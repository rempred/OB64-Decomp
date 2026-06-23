/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205228..0x00205230 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: jr$ra at 0x00205228 + delay nop at 0x0020522C. Standalone return stub; split per frameless-leaf rule. */
/* 0x00205228 0x80274E28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020522C 0x80274E2C 0x00000000 */ .word 0x00000000 # nop
