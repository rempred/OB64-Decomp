/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165F80..0x00165F8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three small index/count words preceding the token block. Raw words: 0x0000000B, 0x00000016, 0x00000021 (11,22,33 — even +0x0B stride, likely offsets/counts). Hypothesis (marked as such): index triplet.. */
/* 0x00165F80 0x801D5B80 0x0000000B */ .word 0x0000000B # special_0x0B
/* 0x00165F84 0x801D5B84 0x00000016 */ .word 0x00000016 # dsrlv $zero, $zero, $zero
/* 0x00165F88 0x801D5B88 0x00000021 */ .word 0x00000021 # move $zero, $zero
