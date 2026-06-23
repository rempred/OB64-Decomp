/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BF98..0x0020BFA4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf get-accessor: lui 8019, jr $ra, lbu 0x7B62. Ends jr $ra @0x0020BF9C + delay 0x0020BFA0; last word 0x0020BFA0 ends the slice at 0x0020BFA4. */
/* 0x0020BF98 0x8027BB98 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0020BF9C 0x8027BB9C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BFA0 0x8027BBA0 0x90427B62 */ .word 0x90427B62 # lbu $v0, 0x7B62($v0)
