/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00019E10..0x00019E30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00019E10, size=24, kind=leaf */
func_00019E10:
/* 0x00019E10 0x80089A10 0x3C02800E */ .word 0x3C02800E # lui $v0, 0x800E
/* 0x00019E14 0x80089A14 0x8C4279A4 */ .word 0x8C4279A4 # lw $v0, 0x79A4($v0)
/* 0x00019E18 0x80089A18 0x1440FFFD */ .word 0x1440FFFD # bne $v0, $zero, 0x80089A10
/* 0x00019E1C 0x80089A1C 0x00000000 */ .word 0x00000000 # nop
/* 0x00019E20 0x80089A20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00019E24 0x80089A24 0x00000000 */ .word 0x00000000 # nop
/* 0x00019E28 0x80089A28 0x00000000 */ .word 0x00000000 # nop
/* 0x00019E2C 0x80089A2C 0x00000000 */ .word 0x00000000 # nop
