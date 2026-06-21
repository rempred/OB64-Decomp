/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00025120..0x00025140 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00025120, size=20, kind=leaf */
func_00025120:
/* 0x00025120 0x80094D20 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x00025124 0x80094D24 0xAC244C40 */ .word 0xAC244C40 # sw $a0, 0x4C40($at)
/* 0x00025128 0x80094D28 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0002512C 0x80094D2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00025130 0x80094D30 0xAC254C44 */ .word 0xAC254C44 # sw $a1, 0x4C44($at)
/* 0x00025134 0x80094D34 0x00000000 */ .word 0x00000000 # nop
/* 0x00025138 0x80094D38 0x00000000 */ .word 0x00000000 # nop
/* 0x0002513C 0x80094D3C 0x00000000 */ .word 0x00000000 # nop
