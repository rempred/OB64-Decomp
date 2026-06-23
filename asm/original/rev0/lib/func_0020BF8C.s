/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BF8C..0x0020BF98 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf get-accessor: lui 8019, jr $ra, lhu 0x7B60. Ends jr $ra @0x0020BF90 + delay 0x0020BF94. */
/* 0x0020BF8C 0x8027BB8C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0020BF90 0x8027BB90 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BF94 0x8027BB94 0x94427B60 */ .word 0x94427B60 # lhu $v0, 0x7B60($v0)
