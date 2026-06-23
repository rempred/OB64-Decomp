/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000EAEFC..0x000EAF10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Leading pad: 5 words, all 0x00000000 except 0x000EAF00=0x00000008. Aligns the following table block.. */
/* 0x000EAEFC 0x8015AAFC 0x00000000 */ .word 0x00000000 # nop
/* 0x000EAF00 0x8015AB00 0x00000008 */ .word 0x00000008 # jr $zero
/* 0x000EAF04 0x8015AB04 0x00000000 */ .word 0x00000000 # nop
/* 0x000EAF08 0x8015AB08 0x00000000 */ .word 0x00000000 # nop
/* 0x000EAF0C 0x8015AB0C 0x00000000 */ .word 0x00000000 # nop
