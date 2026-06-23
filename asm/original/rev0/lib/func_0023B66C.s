/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B66C..0x0023B680 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf un-merged from the 0x0023B594 block: sh$zero,0xC($a0); jr$ra@0x0023B670 + delay sh$zero,0xE($a0)@0x0023B674. Two trailing alignment nops @0x0023B678/0x0023B67C attach here as padding. */
/* 0x0023B66C 0x802AB26C 0xA480000C */ .word 0xA480000C # sh $zero, 0xC($a0)
/* 0x0023B670 0x802AB270 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B674 0x802AB274 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x0023B678 0x802AB278 0x00000000 */ .word 0x00000000 # nop
/* 0x0023B67C 0x802AB27C 0x00000000 */ .word 0x00000000 # nop
