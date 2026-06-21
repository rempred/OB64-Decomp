/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002CBC0..0x0002CBCC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002CBC0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
srand:
/* function boundary candidate: func_0002CBC0, size=12, kind=leaf */
func_0002CBC0:
/* 0x0002CBC0 0x8009C7C0 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0002CBC4 0x8009C7C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CBC8 0x8009C7C8 0xAC2447D0 */ .word 0xAC2447D0 # sw $a0, 0x47D0($at)
