/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C5C40..0x001C5C58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small debug-label string span around dedasi-style labels; decoded in the chunk data index.. */
/* 0x001C5C40 0x80235840 0x64656461 */ .word 0x64656461 # daddiu $a1, $v1, 0x6461
/* 0x001C5C44 0x80235844 0x73695F30 */ .word 0x73695F30 # op_0x1C
/* 0x001C5C48 0x80235848 0x30300000 */ .word 0x30300000 # andi $s0, $at, 0x0000
/* 0x001C5C4C 0x8023584C 0x64656461 */ .word 0x64656461 # daddiu $a1, $v1, 0x6461
/* 0x001C5C50 0x80235850 0x73695F30 */ .word 0x73695F30 # op_0x1C
/* 0x001C5C54 0x80235854 0x30310000 */ .word 0x30310000 # andi $s1, $at, 0x0000
