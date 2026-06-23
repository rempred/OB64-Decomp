/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027CFC8..0x0027CFD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf (3 words) un-merged from idx15. sh zero,0xE($a0); jr $ra at 0x27CFCC, delay 0x27CFD0 (sh zero,0x10($a0)). */
func_0027CFC8:
/* 0x0027CFC8 0x802ECBC8 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x0027CFCC 0x802ECBCC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027CFD0 0x802ECBD0 0xA4800010 */ .word 0xA4800010 # sh $zero, 0x10($a0)
