/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012400..0x00012408 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012400 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012400:
/* 0x00012400 0x80082000 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012404 0x80082004 0x8C820004 */ .word 0x8C820004 # lw $v0, 0x4($a0)
