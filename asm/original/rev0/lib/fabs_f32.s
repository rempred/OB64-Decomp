/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002D7B0..0x0002D7C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002D7B0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
fabs_f32:
/* function boundary candidate: func_0002D7B0, size=8, kind=leaf */
func_0002D7B0:
/* 0x0002D7B0 0x8009D3B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002D7B4 0x8009D3B4 0x46006005 */ .word 0x46006005 # abs.s $f0, $f12
/* 0x0002D7B8 0x8009D3B8 0x00000000 */ .word 0x00000000 # nop
/* 0x0002D7BC 0x8009D3BC 0x00000000 */ .word 0x00000000 # nop
