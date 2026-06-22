/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000497AC..0x000497B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless bare stub: jr $ra at 0x000497AC + delay nop 0x000497B0. Un-merged from parent idx68. */
func_000497ac:
/* 0x000497AC 0x800B93AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000497B0 0x800B93B0 0x00000000 */ .word 0x00000000 # nop
