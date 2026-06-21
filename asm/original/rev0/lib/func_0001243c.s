/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001243C..0x00012448 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001243C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001243c:
/* 0x0001243C 0x8008203C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012440 0x80082040 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012444 0x80082044 0xAC249B8C */ .word 0xAC249B8C # sw $a0, -0x6474($at)
