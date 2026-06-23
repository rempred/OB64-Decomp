/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205220..0x00205228 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: jr$ra at 0x00205220 + delay nop at 0x00205224. Standalone return stub inside the gap before func_00205230; split per frameless-leaf rule. */
/* 0x00205220 0x80274E20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00205224 0x80274E24 0x00000000 */ .word 0x00000000 # nop
