/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00228D6C..0x00228D90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Align nop (0x00228D6C) + 6 RAM pointers in the 0x801D overlay band: 0x801D85C4, 0x801D92E0, 0x801D202C, 0x801DF9D8, 0x801DF404, 0x801D0854 (0x00228D70..0x00228D88), then 2 trailing nops (0x00228D88..0x00228D90). Pointer-table entries (overlay RAM addresses), not code.. */
/* 0x00228D6C 0x8029896C 0x00000000 */ .word 0x00000000 # nop
/* 0x00228D70 0x80298970 0x801D85C4 */ .word 0x801D85C4 # lb $sp, -0x7A3C($zero)
/* 0x00228D74 0x80298974 0x801D92E0 */ .word 0x801D92E0 # lb $sp, -0x6D20($zero)
/* 0x00228D78 0x80298978 0x801D202C */ .word 0x801D202C # lb $sp, 0x202C($zero)
/* 0x00228D7C 0x8029897C 0x801DF9D8 */ .word 0x801DF9D8 # lb $sp, -0x628($zero)
/* 0x00228D80 0x80298980 0x801DF404 */ .word 0x801DF404 # lb $sp, -0xBFC($zero)
/* 0x00228D84 0x80298984 0x801D0854 */ .word 0x801D0854 # lb $sp, 0x854($zero)
/* 0x00228D88 0x80298988 0x00000000 */ .word 0x00000000 # nop
/* 0x00228D8C 0x8029898C 0x00000000 */ .word 0x00000000 # nop
