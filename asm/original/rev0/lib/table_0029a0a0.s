/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A0A0..0x0029A0B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 5 words, 0x8022E4xx ascending 0x8022E480->0x8022E4B0 (step 0xC); pointers into 0x8022Exxx pool. (Word @0x29A0B4 is 0 padding.). */
/* 0x0029A0A0 0x80309CA0 0x8022E480 */ .word 0x8022E480 # lb $v0, -0x1B80($at)
/* 0x0029A0A4 0x80309CA4 0x8022E48C */ .word 0x8022E48C # lb $v0, -0x1B74($at)
/* 0x0029A0A8 0x80309CA8 0x8022E498 */ .word 0x8022E498 # lb $v0, -0x1B68($at)
/* 0x0029A0AC 0x80309CAC 0x8022E4A4 */ .word 0x8022E4A4 # lb $v0, -0x1B5C($at)
/* 0x0029A0B0 0x80309CB0 0x8022E4B0 */ .word 0x8022E4B0 # lb $v0, -0x1B50($at)
/* 0x0029A0B4 0x80309CB4 0x00000000 */ .word 0x00000000 # nop
