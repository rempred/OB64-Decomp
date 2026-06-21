/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002D7E0..0x0002D7F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002D7E0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
floor_f32:
/* function boundary candidate: func_0002D7E0, size=12, kind=leaf */
func_0002D7E0:
/* 0x0002D7E0 0x8009D3E0 0x4600638F */ .word 0x4600638F # floor.w.s $f14, $f12
/* 0x0002D7E4 0x8009D3E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002D7E8 0x8009D3E8 0x46807020 */ .word 0x46807020 # cvt.s.w $f0, $f14
/* 0x0002D7EC 0x8009D3EC 0x00000000 */ .word 0x00000000 # nop
