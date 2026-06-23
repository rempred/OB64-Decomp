/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283DF0..0x00283E14 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless predicate leaf (SPECIAL gap): tests 0x8023A95C/0x8023A958; ends jr$ra@0x00283E0C + nop delay. */
/* 0x00283DF0 0x802F39F0 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x00283DF4 0x802F39F4 0x8C42A95C */ .word 0x8C42A95C # lw $v0, -0x56A4($v0)
/* 0x00283DF8 0x802F39F8 0x14400004 */ .word 0x14400004 # bne $v0, $zero, 0x802F3A0C
/* 0x00283DFC 0x802F39FC 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00283E00 0x802F3A00 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x00283E04 0x802F3A04 0x8C42A958 */ .word 0x8C42A958 # lw $v0, -0x56A8($v0)
/* 0x00283E08 0x802F3A08 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x00283E0C 0x802F3A0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283E10 0x802F3A10 0x00000000 */ .word 0x00000000 # nop
