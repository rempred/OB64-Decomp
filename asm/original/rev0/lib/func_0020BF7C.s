/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BF7C..0x0020BF8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf get-accessor: lui/lbu 8019.76D8, jr $ra, andi 0x08. Ends jr $ra @0x0020BF84 + delay 0x0020BF88. */
/* 0x0020BF7C 0x8027BB7C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0020BF80 0x8027BB80 0x904276D8 */ .word 0x904276D8 # lbu $v0, 0x76D8($v0)
/* 0x0020BF84 0x8027BB84 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BF88 0x8027BB88 0x30420008 */ .word 0x30420008 # andi $v0, $v0, 0x0008
