/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000514E0..0x000514EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0; jr $ra at 0x514E4; delay addiu $v0,-0x274. Last leaf of parent idx1 cluster; next is prologue at 0x514EC. */
func_000514e0:
/* 0x000514E0 0x800C10E0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000514E4 0x800C10E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000514E8 0x800C10E8 0x2442FD8C */ .word 0x2442FD8C # addiu $v0, $v0, -0x274
