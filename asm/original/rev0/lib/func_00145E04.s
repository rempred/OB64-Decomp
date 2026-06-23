/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145E04..0x00145E18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: load -0x25E0, xor $a0, sltiu==0 predicate; jr $ra at 0x00145E10 + delay sltiu $v0 at 0x00145E14. */
/* 0x00145E04 0x801B5A04 0x3C028020 */ .word 0x3C028020 # lui $v0, 0x8020
/* 0x00145E08 0x801B5A08 0x8C42DA20 */ .word 0x8C42DA20 # lw $v0, -0x25E0($v0)
/* 0x00145E0C 0x801B5A0C 0x00441026 */ .word 0x00441026 # xor $v0, $v0, $a0
/* 0x00145E10 0x801B5A10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145E14 0x801B5A14 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
