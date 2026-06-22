/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000514B0..0x000514BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0,0x8019; jr $ra at 0x514B4; delay addiu $v0,-0x2B0. Un-merged from over-merged parent idx1 cluster. */
func_000514b0:
/* 0x000514B0 0x800C10B0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000514B4 0x800C10B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000514B8 0x800C10B8 0x2442FD50 */ .word 0x2442FD50 # addiu $v0, $v0, -0x2B0
