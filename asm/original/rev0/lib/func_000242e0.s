/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x000242E0..0x000242E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000242E0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000242e0:
/* 0x000242E0 0x80093EE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000242E4 0x80093EE4 0x24820078 */ .word 0x24820078 # addiu $v0, $a0, 0x78
