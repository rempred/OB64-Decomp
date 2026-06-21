/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00020BE0..0x00020BF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00020BE0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
sqrtf:
/* function boundary candidate: func_00020BE0, size=8, kind=leaf */
func_00020BE0:
/* 0x00020BE0 0x800907E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00020BE4 0x800907E4 0x46006004 */ .word 0x46006004 # sqrt.s $f0, $f12
/* 0x00020BE8 0x800907E8 0x00000000 */ .word 0x00000000 # nop
/* 0x00020BEC 0x800907EC 0x00000000 */ .word 0x00000000 # nop
