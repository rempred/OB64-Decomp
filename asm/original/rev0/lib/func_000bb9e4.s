/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BB9E4..0x000BB9F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; 4-instr: lbu 0x11($a0); sltiu; jr $ra @0xBB9EC; xori delay. */
func_000bb9e4:
/* 0x000BB9E4 0x8012B5E4 0x90820011 */ .word 0x90820011 # lbu $v0, 0x11($a0)
/* 0x000BB9E8 0x8012B5E8 0x2C420051 */ .word 0x2C420051 # sltiu $v0, $v0, 0x51
/* 0x000BB9EC 0x8012B5EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BB9F0 0x8012B5F0 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
