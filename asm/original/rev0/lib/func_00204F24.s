/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00204F24..0x00204F2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: jr$ra at 0x00204F24 + delay nop at 0x00204F28. Separate fall-through entry after the prior function's delay slot; split per frameless-leaf rule. */
/* 0x00204F24 0x80274B24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00204F28 0x80274B28 0x00000000 */ .word 0x00000000 # nop
