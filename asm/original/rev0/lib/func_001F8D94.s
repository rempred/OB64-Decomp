/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8D94..0x001F8DAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag set accessor: lui/addiu/lw/sltiu/jr$ra/sw (delay). 6 words. */
/* 0x001F8D94 0x80268994 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x001F8D98 0x80268998 0x2463079C */ .word 0x2463079C # addiu $v1, $v1, 0x79C
/* 0x001F8D9C 0x8026899C 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x001F8DA0 0x802689A0 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x001F8DA4 0x802689A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8DA8 0x802689A8 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
