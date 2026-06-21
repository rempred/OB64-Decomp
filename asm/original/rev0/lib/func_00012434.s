/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012434..0x0001243C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012434 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012434:
/* 0x00012434 0x80082034 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012438 0x80082038 0x8C820010 */ .word 0x8C820010 # lw $v0, 0x10($a0)
