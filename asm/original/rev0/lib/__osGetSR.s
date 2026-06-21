/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AAF0..0x0002AB00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AAF0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osGetSR:
/* function boundary candidate: func_0002AAF0, size=12, kind=leaf */
func_0002AAF0:
/* 0x0002AAF0 0x8009A6F0 0x40026000 */ .word 0x40026000 # mfc0 $v0, $12
/* 0x0002AAF4 0x8009A6F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AAF8 0x8009A6F8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AAFC 0x8009A6FC 0x00000000 */ .word 0x00000000 # nop
