/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x002803B8..0x002803C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf accessor split from the over-merged parent record: jr $ra @0x002803B8 + delay slot lh $v0,0x28($a0) @0x002803BC (returns halfword field 0x28). */
/* 0x002803B8 0x802EFFB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002803BC 0x802EFFBC 0x84820028 */ .word 0x84820028 # lh $v0, 0x28($a0)
