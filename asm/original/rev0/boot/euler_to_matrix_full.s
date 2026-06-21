/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010FE0..0x00011000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010FE0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
euler_to_matrix_full:
/* function boundary candidate: func_00010FE0, size=392, kind=leaf */
func_00010FE0:
/* 0x00010FE0 0x80080BE0 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010FE4 0x80080BE4 0xC4209880 */ .word 0xC4209880 # lwc1 $f0, -0x6780($at)
/* 0x00010FE8 0x80080BE8 0x44859000 */ .word 0x44859000 # mtc1 $a1, $f18

/* function boundary candidate: func_00010FEC, size=380, kind=prologue */
func_00010FEC:
/* 0x00010FEC 0x80080BEC 0x27BDFF70 */ .word 0x27BDFF70 # addiu $sp, $sp, -0x90
/* 0x00010FF0 0x80080BF0 0xF7B40060 */ .word 0xF7B40060 # sdc1 $f20, 0x60($sp)
/* 0x00010FF4 0x80080BF4 0x46009502 */ .word 0x46009502 # mul.s $f20, $f18, $f0
/* 0x00010FF8 0x80080BF8 0x44869000 */ .word 0x44869000 # mtc1 $a2, $f18
/* 0x00010FFC 0x80080BFC 0xF7B80070 */ .word 0xF7B80070 # sdc1 $f24, 0x70($sp)
