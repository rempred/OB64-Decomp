/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB00..0x0002AB10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB00 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSetCompare:
/* function boundary candidate: func_0002AB00, size=12, kind=leaf */
func_0002AB00:
/* 0x0002AB00 0x8009A700 0x40845800 */ .word 0x40845800 # mtc0 $a0, $11
/* 0x0002AB04 0x8009A704 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB08 0x8009A708 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AB0C 0x8009A70C 0x00000000 */ .word 0x00000000 # nop
