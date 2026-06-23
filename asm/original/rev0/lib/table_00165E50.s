/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165E50..0x00165E80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, targets 0x8020xxxx. 11 contiguous 4-byte pointers followed by a 0x00000000 terminator. Raw words: 0x802027A8, 0x802027B0, 0x802027B8, 0x802027C0, 0x802027C8, 0x802027D0, 0x802043EC, 0x802044C0, 0x802045E8, 0x80204660, 0x802046CC, 0x00000000. Overlay caveat: RAM addresses, not linear-mapped.. */
/* 0x00165E50 0x801D5A50 0x802027A8 */ .word 0x802027A8 # lb $zero, 0x27A8($at)
/* 0x00165E54 0x801D5A54 0x802027B0 */ .word 0x802027B0 # lb $zero, 0x27B0($at)
/* 0x00165E58 0x801D5A58 0x802027B8 */ .word 0x802027B8 # lb $zero, 0x27B8($at)
/* 0x00165E5C 0x801D5A5C 0x802027C0 */ .word 0x802027C0 # lb $zero, 0x27C0($at)
/* 0x00165E60 0x801D5A60 0x802027C8 */ .word 0x802027C8 # lb $zero, 0x27C8($at)
/* 0x00165E64 0x801D5A64 0x802027D0 */ .word 0x802027D0 # lb $zero, 0x27D0($at)
/* 0x00165E68 0x801D5A68 0x802043EC */ .word 0x802043EC # lb $zero, 0x43EC($at)
/* 0x00165E6C 0x801D5A6C 0x802044C0 */ .word 0x802044C0 # lb $zero, 0x44C0($at)
/* 0x00165E70 0x801D5A70 0x802045E8 */ .word 0x802045E8 # lb $zero, 0x45E8($at)
/* 0x00165E74 0x801D5A74 0x80204660 */ .word 0x80204660 # lb $zero, 0x4660($at)
/* 0x00165E78 0x801D5A78 0x802046CC */ .word 0x802046CC # lb $zero, 0x46CC($at)
/* 0x00165E7C 0x801D5A7C 0x00000000 */ .word 0x00000000 # nop
