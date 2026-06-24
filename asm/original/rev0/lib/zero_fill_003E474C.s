/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_003E1000_003F1000.s
 * z64 range: 0x003E474C..0x003E4768 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (7 words) between Section A asset objects. parsed (all-zero).. */
/* 0x003E474C 0x8045434C 0x00000000 */ .word 0x00000000 # nop
/* 0x003E4750 0x80454350 0x00000000 */ .word 0x00000000 # nop
/* 0x003E4754 0x80454354 0x00000000 */ .word 0x00000000 # nop
/* 0x003E4758 0x80454358 0x00000000 */ .word 0x00000000 # nop
/* 0x003E475C 0x8045435C 0x00000000 */ .word 0x00000000 # nop
/* 0x003E4760 0x80454360 0x00000000 */ .word 0x00000000 # nop
/* 0x003E4764 0x80454364 0x00000000 */ .word 0x00000000 # nop
