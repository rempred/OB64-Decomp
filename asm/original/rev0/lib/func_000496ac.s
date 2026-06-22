/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000496AC..0x000496B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless bare stub: jr $ra at 0x000496AC + delay nop 0x000496B0. Un-merged from parent idx65. */
func_000496ac:
/* 0x000496AC 0x800B92AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000496B0 0x800B92B0 0x00000000 */ .word 0x00000000 # nop
