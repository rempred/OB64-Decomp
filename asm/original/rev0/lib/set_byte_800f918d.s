/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00019928..0x00019934 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00019928 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
set_byte_800f918d:
/* 0x00019928 0x80089528 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0001992C 0x8008952C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00019930 0x80089530 0xA024918D */ .word 0xA024918D # sb $a0, -0x6E73($at)
