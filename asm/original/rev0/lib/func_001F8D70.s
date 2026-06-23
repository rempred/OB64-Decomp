/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8D70..0x001F8D88 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag set/clear accessor: lui/lw/sltiu/lui/jr$ra/sw (delay). 6 words. */
/* 0x001F8D70 0x80268970 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F8D74 0x80268974 0x8C42EAB4 */ .word 0x8C42EAB4 # lw $v0, -0x154C($v0)
/* 0x001F8D78 0x80268978 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x001F8D7C 0x8026897C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001F8D80 0x80268980 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8D84 0x80268984 0xAC22EAB4 */ .word 0xAC22EAB4 # sw $v0, -0x154C($at)
