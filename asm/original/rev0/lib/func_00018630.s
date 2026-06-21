/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018630..0x00018640 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00018630, size=16, kind=leaf */
func_00018630:
/* 0x00018630 0x80088230 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018634 0x80088234 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x00018638 0x80088238 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001863C 0x8008823C 0xAC400000 */ .word 0xAC400000 # sw $zero, 0x0($v0)
