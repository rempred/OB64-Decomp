/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8DAC..0x001F8DC4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag set accessor: lui/addiu/lw/sltiu/jr$ra/sw (delay). 6 words. */
/* 0x001F8DAC 0x802689AC 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x001F8DB0 0x802689B0 0x246307CC */ .word 0x246307CC # addiu $v1, $v1, 0x7CC
/* 0x001F8DB4 0x802689B4 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x001F8DB8 0x802689B8 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x001F8DBC 0x802689BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8DC0 0x802689C0 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
