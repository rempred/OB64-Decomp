/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BBAD0..0x000BBADC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf stub (3-word): lui 0x8019; jr $ra @0xBBAD4; lbu 0x6AE9 delay. */
func_000bbad0:
/* 0x000BBAD0 0x8012B6D0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000BBAD4 0x8012B6D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BBAD8 0x8012B6D8 0x90426AE9 */ .word 0x90426AE9 # lbu $v0, 0x6AE9($v0)
