/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002D7D0..0x0002D7E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002D7D0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
ceil_f32:
/* function boundary candidate: func_0002D7D0, size=12, kind=leaf */
func_0002D7D0:
/* 0x0002D7D0 0x8009D3D0 0x4600638E */ .word 0x4600638E # ceil.w.s $f14, $f12
/* 0x0002D7D4 0x8009D3D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002D7D8 0x8009D3D8 0x46807020 */ .word 0x46807020 # cvt.s.w $f0, $f14
/* 0x0002D7DC 0x8009D3DC 0x00000000 */ .word 0x00000000 # nop
