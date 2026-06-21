/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB30..0x0002AB40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB30 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSetWatchLo:
/* function boundary candidate: func_0002AB30, size=16, kind=leaf */
func_0002AB30:
/* 0x0002AB30 0x8009A730 0x40849000 */ .word 0x40849000 # mtc0 $a0, $18
/* 0x0002AB34 0x8009A734 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AB38 0x8009A738 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB3C 0x8009A73C 0x00000000 */ .word 0x00000000 # nop
