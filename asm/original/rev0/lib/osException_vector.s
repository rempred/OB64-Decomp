/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029160..0x00029170 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00029160 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
osException_vector:
/* 0x00029160 0x80098D60 0x3C1A800A */ .word 0x3C1A800A # lui $k0, 0x800A
/* 0x00029164 0x80098D64 0x275A8D70 */ .word 0x275A8D70 # addiu $k0, $k0, -0x7290
/* 0x00029168 0x80098D68 0x03400008 */ .word 0x03400008 # jr $k0
/* 0x0002916C 0x80098D6C 0x00000000 */ .word 0x00000000 # nop
