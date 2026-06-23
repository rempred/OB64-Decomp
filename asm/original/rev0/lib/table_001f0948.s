/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0948..0x001F0960 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 RAM pointers in the 0x801ACC band (0x801ACC50, 0x801ACC48, 0x801ACC6C, 0x801ACD28, 0x801ACCF0, 0x801ACD18). Overlay-relocated runtime addresses; RAM column not authoritative.. */
/* 0x001F0948 0x80260548 0x801ACC50 */ .word 0x801ACC50 # lb $k0, -0x33B0($zero)
/* 0x001F094C 0x8026054C 0x801ACC48 */ .word 0x801ACC48 # lb $k0, -0x33B8($zero)
/* 0x001F0950 0x80260550 0x801ACC6C */ .word 0x801ACC6C # lb $k0, -0x3394($zero)
/* 0x001F0954 0x80260554 0x801ACD28 */ .word 0x801ACD28 # lb $k0, -0x32D8($zero)
/* 0x001F0958 0x80260558 0x801ACCF0 */ .word 0x801ACCF0 # lb $k0, -0x3310($zero)
/* 0x001F095C 0x8026055C 0x801ACD18 */ .word 0x801ACD18 # lb $k0, -0x32E8($zero)
