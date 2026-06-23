/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001497D0..0x001497D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf stub: jr $ra 0x001497D0 + delay nop 0x001497D4. Split out of the over-merged parent part. */
/* 0x001497D0 0x801B93D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001497D4 0x801B93D4 0x00000000 */ .word 0x00000000 # nop
