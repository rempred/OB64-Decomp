/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AAD0..0x0002AAE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AAD0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
osGetCause:
/* function boundary candidate: func_0002AAD0, size=12, kind=leaf */
func_0002AAD0:
/* 0x0002AAD0 0x8009A6D0 0x40026800 */ .word 0x40026800 # mfc0 $v0, $13
/* 0x0002AAD4 0x8009A6D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AAD8 0x8009A6D8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AADC 0x8009A6DC 0x00000000 */ .word 0x00000000 # nop
