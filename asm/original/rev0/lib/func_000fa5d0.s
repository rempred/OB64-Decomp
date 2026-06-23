/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FA5D0..0x000FA5E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Empty stub leaf: jr ra @0xFA5D0 + nop; trailing nops 0xFA5D8/0xFA5DC are alignment. */
/* 0x000FA5D0 0x8016A1D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FA5D4 0x8016A1D4 0x00000000 */ .word 0x00000000 # nop
/* 0x000FA5D8 0x8016A1D8 0x00000000 */ .word 0x00000000 # nop
/* 0x000FA5DC 0x8016A1DC 0x00000000 */ .word 0x00000000 # nop
