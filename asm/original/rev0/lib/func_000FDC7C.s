/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FDC7C..0x000FDC90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 0x000FDC7C 0x8016D87C 0xA4800012 */ .word 0xA4800012 # sh $zero, 0x12($a0)
/* 0x000FDC80 0x8016D880 0xA4850014 */ .word 0xA4850014 # sh $a1, 0x14($a0)
/* 0x000FDC84 0x8016D884 0xA4860016 */ .word 0xA4860016 # sh $a2, 0x16($a0)
/* 0x000FDC88 0x8016D888 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FDC8C 0x8016D88C 0xA4870018 */ .word 0xA4870018 # sh $a3, 0x18($a0)
