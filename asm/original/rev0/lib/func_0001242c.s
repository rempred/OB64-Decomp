/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001242C..0x00012434 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001242C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001242c:
/* 0x0001242C 0x8008202C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012430 0x80082030 0xAC850010 */ .word 0xAC850010 # sw $a1, 0x10($a0)
