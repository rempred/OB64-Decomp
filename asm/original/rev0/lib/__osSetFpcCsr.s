/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB10..0x0002AB20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB10 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSetFpcCsr:
/* function boundary candidate: func_0002AB10, size=16, kind=leaf */
func_0002AB10:
/* 0x0002AB10 0x8009A710 0x4442F800 */ .word 0x4442F800 # cfc1 $v0, $31
/* 0x0002AB14 0x8009A714 0x44C4F800 */ .word 0x44C4F800 # ctc1 $a0, $31
/* 0x0002AB18 0x8009A718 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB1C 0x8009A71C 0x00000000 */ .word 0x00000000 # nop
