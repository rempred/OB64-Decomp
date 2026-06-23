/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002907F8..0x00290810 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless accessor: reads 0x23C flag, xori, jr$ra@0x290808 + delay sltu $v0,$zero,$v0@0x29080C (boolean getter). */
/* 0x002907F8 0x803003F8 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x002907FC 0x803003FC 0x8C42DE30 */ .word 0x8C42DE30 # lw $v0, -0x21D0($v0)
/* 0x00290800 0x80300400 0x9042023C */ .word 0x9042023C # lbu $v0, 0x23C($v0)
/* 0x00290804 0x80300404 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x00290808 0x80300408 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029080C 0x8030040C 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
