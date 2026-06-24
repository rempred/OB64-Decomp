/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002BF0F4..0x002BF118 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill gap (9 words) before the trailing graphics/texture region. parsed (all-zero).. */
/* 0x002BF0F4 0x8032ECF4 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF0F8 0x8032ECF8 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF0FC 0x8032ECFC 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF100 0x8032ED00 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF104 0x8032ED04 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF108 0x8032ED08 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF10C 0x8032ED0C 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF110 0x8032ED10 0x00000000 */ .word 0x00000000 # nop
/* 0x002BF114 0x8032ED14 0x00000000 */ .word 0x00000000 # nop
