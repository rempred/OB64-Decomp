/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005192C..0x00051934 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless 2-word leaf stub: jr $ra at 0x5192C; delay nop at 0x51930. Un-merged from over-merged parent idx6 cluster. */
func_0005192c:
/* 0x0005192C 0x800C152C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00051930 0x800C1530 0x00000000 */ .word 0x00000000 # nop
