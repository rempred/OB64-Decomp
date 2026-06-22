/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x0007DC00..0x0007DC08 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged 2-word frameless stub: jr $ra (0x0007DC00) + delay slot nop (0x0007DC04). Empty leaf between functions. */
func_0007dc00:
/* 0x0007DC00 0x800ED800 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007DC04 0x800ED804 0x00000000 */ .word 0x00000000 # nop
