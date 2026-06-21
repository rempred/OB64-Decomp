/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB20..0x0002AB30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB20 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSetSR:
/* function boundary candidate: func_0002AB20, size=16, kind=leaf */
func_0002AB20:
/* 0x0002AB20 0x8009A720 0x40846000 */ .word 0x40846000 # mtc0 $a0, $12
/* 0x0002AB24 0x8009A724 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AB28 0x8009A728 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB2C 0x8009A72C 0x00000000 */ .word 0x00000000 # nop
