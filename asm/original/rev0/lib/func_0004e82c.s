/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E82C..0x0004E834 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf stub (jr $ra at 0x0004E82C + nop delay) un-merged from parent 0x0004E800 */
func_0004e82c:
/* 0x0004E82C 0x800BE42C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E830 0x800BE430 0x00000000 */ .word 0x00000000 # nop
