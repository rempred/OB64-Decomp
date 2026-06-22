/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EF10..0x0004EF18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless stub: jr $ra at 0x0004EF10 + delay nop 0x0004EF14; split from parent gap 0x0004EF08..0x0004EF18 */
func_0004ef10:
/* 0x0004EF10 0x800BEB10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EF14 0x800BEB14 0x00000000 */ .word 0x00000000 # nop
