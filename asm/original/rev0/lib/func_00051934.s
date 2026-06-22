/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051934..0x00051940 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0,0x8019; jr $ra at 0x51938; delay addiu $v0,-0x260. Last leaf of parent idx6 cluster; next is prologue at 0x51940. */
func_00051934:
/* 0x00051934 0x800C1534 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00051938 0x800C1538 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005193C 0x800C153C 0x2442FDA0 */ .word 0x2442FDA0 # addiu $v0, $v0, -0x260
