/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000149B0..0x000149B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000149B0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000149b0:
/* 0x000149B0 0x800845B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000149B4 0x800845B4 0x24A20002 */ .word 0x24A20002 # addiu $v0, $a1, 0x2
