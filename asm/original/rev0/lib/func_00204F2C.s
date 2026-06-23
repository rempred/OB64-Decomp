/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00204F2C..0x00204F34 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: jr$ra at 0x00204F2C + delay nop at 0x00204F30. Separate tiny stub; split per frameless-leaf rule. */
/* 0x00204F2C 0x80274B2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00204F30 0x80274B30 0x00000000 */ .word 0x00000000 # nop
