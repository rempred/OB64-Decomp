/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A01C..0x0029A028 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII digit string '0123456789' (bytes 30 31 32 33 34 35 36 37 38 39 00 00), 0-terminated/padded.. */
/* 0x0029A01C 0x80309C1C 0x30313233 */ .word 0x30313233 # andi $s1, $at, 0x3233
/* 0x0029A020 0x80309C20 0x34353637 */ .word 0x34353637 # ori $s5, $at, 0x3637
/* 0x0029A024 0x80309C24 0x38390000 */ .word 0x38390000 # xori $t9, $at, 0x0000
