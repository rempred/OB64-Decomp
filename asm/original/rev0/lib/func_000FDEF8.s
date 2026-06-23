/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FDEF8..0x000FDF0C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 0x000FDEF8 0x8016DAF8 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x000FDEFC 0x8016DAFC 0xA4850010 */ .word 0xA4850010 # sh $a1, 0x10($a0)
/* 0x000FDF00 0x8016DB00 0xA4860012 */ .word 0xA4860012 # sh $a2, 0x12($a0)
/* 0x000FDF04 0x8016DB04 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FDF08 0x8016DB08 0xA4870014 */ .word 0xA4870014 # sh $a3, 0x14($a0)
