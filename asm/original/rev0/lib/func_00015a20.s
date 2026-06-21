/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015A20..0x00015A2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00015A20, size=12, kind=leaf */
func_00015A20:
/* 0x00015A20 0x80085620 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00015A24 0x80085624 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015A28 0x80085628 0xAC2418A0 */ .word 0xAC2418A0 # sw $a0, 0x18A0($at)
