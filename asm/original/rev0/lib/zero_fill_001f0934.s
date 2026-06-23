/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0934..0x001F0948 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 20-byte all-zero pad between the credits string pool and the first RAM-pointer table.. */
/* 0x001F0934 0x80260534 0x00000000 */ .word 0x00000000 # nop
/* 0x001F0938 0x80260538 0x00000000 */ .word 0x00000000 # nop
/* 0x001F093C 0x8026053C 0x00000000 */ .word 0x00000000 # nop
/* 0x001F0940 0x80260540 0x00000000 */ .word 0x00000000 # nop
/* 0x001F0944 0x80260544 0x00000000 */ .word 0x00000000 # nop
