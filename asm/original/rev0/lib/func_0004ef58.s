/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EF58..0x0004EF60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless stub: jr $ra at 0x0004EF58 + delay nop 0x0004EF5C; un-merged from parent 0x0004EF34 */
func_0004ef58:
/* 0x0004EF58 0x800BEB58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EF5C 0x800BEB5C 0x00000000 */ .word 0x00000000 # nop
