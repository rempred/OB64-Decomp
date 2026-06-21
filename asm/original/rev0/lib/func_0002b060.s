/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002B060..0x0002B070 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0002B060, size=12, kind=leaf */
func_0002B060:
/* 0x0002B060 0x8009AC60 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x0002B064 0x8009AC64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002B068 0x8009AC68 0x8C42BBD0 */ .word 0x8C42BBD0 # lw $v0, -0x4430($v0)
/* 0x0002B06C 0x8009AC6C 0x00000000 */ .word 0x00000000 # nop
