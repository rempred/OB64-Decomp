/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101AA8..0x00101AB8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Four RAM pointers in the 0x801AE8xx..0x801AE9xx band: 0x801AE8C4, 0x801AE904, 0x801AE93C, 0x801AE9B0. High word 0x801A -> RAM-pointer table. [name-token: table_ram_ptrs_801AE8]. */
/* 0x00101AA8 0x801716A8 0x801AE8C4 */ .word 0x801AE8C4 # lb $k0, -0x173C($zero)
/* 0x00101AAC 0x801716AC 0x801AE904 */ .word 0x801AE904 # lb $k0, -0x16FC($zero)
/* 0x00101AB0 0x801716B0 0x801AE93C */ .word 0x801AE93C # lb $k0, -0x16C4($zero)
/* 0x00101AB4 0x801716B4 0x801AE9B0 */ .word 0x801AE9B0 # lb $k0, -0x1650($zero)
