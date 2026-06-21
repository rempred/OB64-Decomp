/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010680..0x0001068C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010680 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
set_dl_cursor:
/* function boundary candidate: func_00010680, size=12, kind=leaf */
func_00010680:
/* 0x00010680 0x80080280 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00010684 0x80080284 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010688 0x80080288 0xAC2417B0 */ .word 0xAC2417B0 # sw $a0, 0x17B0($at)
