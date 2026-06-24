/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002C1000_002D1000.s
 * z64 range: 0x002C4834..0x002C4848 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (5 words) between texture/graphics objects. parsed (all-zero).. */
/* 0x002C4834 0x80334434 0x00000000 */ .word 0x00000000 # nop
/* 0x002C4838 0x80334438 0x00000000 */ .word 0x00000000 # nop
/* 0x002C483C 0x8033443C 0x00000000 */ .word 0x00000000 # nop
/* 0x002C4840 0x80334440 0x00000000 */ .word 0x00000000 # nop
/* 0x002C4844 0x80334444 0x00000000 */ .word 0x00000000 # nop
