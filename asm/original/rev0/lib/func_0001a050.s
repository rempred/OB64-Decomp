/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A050..0x0001A060 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A050, size=16, kind=leaf */
func_0001A050:
/* 0x0001A050 0x80089C50 0x24020080 */ .word 0x24020080 # addiu $v0, $zero, 0x80
/* 0x0001A054 0x80089C54 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0001A058 0x80089C58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A05C 0x80089C5C 0xAC224BD8 */ .word 0xAC224BD8 # sw $v0, 0x4BD8($at)
