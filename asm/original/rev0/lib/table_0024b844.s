/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024B844..0x0024B854 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pointer table, 4 entries, RAM 0x8016 band: 0x8016DF88, 0x8016DFDC, 0x8016E030, 0x8016E084 (stride 0x54). Overlay RAM addresses.. */
/* 0x0024B844 0x802BB444 0x8016DF88 */ .word 0x8016DF88 # lb $s6, -0x2078($zero)
/* 0x0024B848 0x802BB448 0x8016DFDC */ .word 0x8016DFDC # lb $s6, -0x2024($zero)
/* 0x0024B84C 0x802BB44C 0x8016E030 */ .word 0x8016E030 # lb $s6, -0x1FD0($zero)
/* 0x0024B850 0x802BB450 0x8016E084 */ .word 0x8016E084 # lb $s6, -0x1F7C($zero)
