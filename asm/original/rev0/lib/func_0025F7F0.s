/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F7F0..0x0025F7F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Empty frameless leaf stub: jr$ra at 0x0025F7F0 + delay nop. */
/* 0x0025F7F0 0x802CF3F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F7F4 0x802CF3F4 0x00000000 */ .word 0x00000000 # nop
