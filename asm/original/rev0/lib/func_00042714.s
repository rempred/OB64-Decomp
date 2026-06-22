/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042714..0x0004271C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless stub leaf: jr $ra at 0x42714 + delay nop; closes gap parent 0x41F48 */
func_00042714:
/* 0x00042714 0x800B2314 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042718 0x800B2318 0x00000000 */ .word 0x00000000 # nop
