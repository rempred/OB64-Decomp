/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FE2C8..0x000FE2DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 0x000FE2C8 0x8016DEC8 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x000FE2CC 0x8016DECC 0xA4850010 */ .word 0xA4850010 # sh $a1, 0x10($a0)
/* 0x000FE2D0 0x8016DED0 0xA4860012 */ .word 0xA4860012 # sh $a2, 0x12($a0)
/* 0x000FE2D4 0x8016DED4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FE2D8 0x8016DED8 0xA4870014 */ .word 0xA4870014 # sh $a3, 0x14($a0)
