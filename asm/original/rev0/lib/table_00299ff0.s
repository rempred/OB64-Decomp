/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00299FF0..0x0029A01C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 11 words, 0x8023E3xx descending 0x8023E300->0x8023E2D8; pointers into 0x8023Exxx pool.. */
/* 0x00299FF0 0x80309BF0 0x8023E300 */ .word 0x8023E300 # lb $v1, -0x1D00($at)
/* 0x00299FF4 0x80309BF4 0x8023E2FC */ .word 0x8023E2FC # lb $v1, -0x1D04($at)
/* 0x00299FF8 0x80309BF8 0x8023E2F8 */ .word 0x8023E2F8 # lb $v1, -0x1D08($at)
/* 0x00299FFC 0x80309BFC 0x8023E2F4 */ .word 0x8023E2F4 # lb $v1, -0x1D0C($at)
/* 0x0029A000 0x80309C00 0x8023E2F0 */ .word 0x8023E2F0 # lb $v1, -0x1D10($at)
/* 0x0029A004 0x80309C04 0x8023E2EC */ .word 0x8023E2EC # lb $v1, -0x1D14($at)
/* 0x0029A008 0x80309C08 0x8023E2E8 */ .word 0x8023E2E8 # lb $v1, -0x1D18($at)
/* 0x0029A00C 0x80309C0C 0x8023E2E4 */ .word 0x8023E2E4 # lb $v1, -0x1D1C($at)
/* 0x0029A010 0x80309C10 0x8023E2E0 */ .word 0x8023E2E0 # lb $v1, -0x1D20($at)
/* 0x0029A014 0x80309C14 0x8023E2DC */ .word 0x8023E2DC # lb $v1, -0x1D24($at)
/* 0x0029A018 0x80309C18 0x8023E2D8 */ .word 0x8023E2D8 # lb $v1, -0x1D28($at)
