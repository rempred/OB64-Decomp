/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002D7C0..0x0002D7D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002D7C0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
sqrt_f64:
/* function boundary candidate: func_0002D7C0, size=8, kind=leaf */
func_0002D7C0:
/* 0x0002D7C0 0x8009D3C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002D7C4 0x8009D3C4 0x46206004 */ .word 0x46206004 # sqrt.d $f0, $f12
/* 0x0002D7C8 0x8009D3C8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002D7CC 0x8009D3CC 0x00000000 */ .word 0x00000000 # nop
