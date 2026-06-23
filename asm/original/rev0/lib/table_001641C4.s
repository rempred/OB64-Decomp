/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x001641C4..0x00164214 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, all targets 0x8016xxxx (and one 0x8016DFxx group). 20 contiguous 4-byte pointers, monotonic within sub-runs. Raw words: 0x8016F65C, 0x8016F6AC, 0x8016F6FC, ... 0x8016DF88, 0x8016DFDC, ... 0x8016F8B4, 0x8016F8CC. Overlay caveat: these are RAM addresses; the RAM-decode column is a wrong linear map.. */
/* 0x001641C4 0x801D3DC4 0x8016F65C */ .word 0x8016F65C # lb $s6, -0x9A4($zero)
/* 0x001641C8 0x801D3DC8 0x8016F6AC */ .word 0x8016F6AC # lb $s6, -0x954($zero)
/* 0x001641CC 0x801D3DCC 0x8016F6FC */ .word 0x8016F6FC # lb $s6, -0x904($zero)
/* 0x001641D0 0x801D3DD0 0x8016F74C */ .word 0x8016F74C # lb $s6, -0x8B4($zero)
/* 0x001641D4 0x801D3DD4 0x8016F79C */ .word 0x8016F79C # lb $s6, -0x864($zero)
/* 0x001641D8 0x801D3DD8 0x8016F7EC */ .word 0x8016F7EC # lb $s6, -0x814($zero)
/* 0x001641DC 0x801D3DDC 0x8016DF88 */ .word 0x8016DF88 # lb $s6, -0x2078($zero)
/* 0x001641E0 0x801D3DE0 0x8016DFDC */ .word 0x8016DFDC # lb $s6, -0x2024($zero)
/* 0x001641E4 0x801D3DE4 0x8016E030 */ .word 0x8016E030 # lb $s6, -0x1FD0($zero)
/* 0x001641E8 0x801D3DE8 0x8016E084 */ .word 0x8016E084 # lb $s6, -0x1F7C($zero)
/* 0x001641EC 0x801D3DEC 0x8016DC2C */ .word 0x8016DC2C # lb $s6, -0x23D4($zero)
/* 0x001641F0 0x801D3DF0 0x8016DCD4 */ .word 0x8016DCD4 # lb $s6, -0x232C($zero)
/* 0x001641F4 0x801D3DF4 0x8016DD74 */ .word 0x8016DD74 # lb $s6, -0x228C($zero)
/* 0x001641F8 0x801D3DF8 0x8016F83C */ .word 0x8016F83C # lb $s6, -0x7C4($zero)
/* 0x001641FC 0x801D3DFC 0x8016F854 */ .word 0x8016F854 # lb $s6, -0x7AC($zero)
/* 0x00164200 0x801D3E00 0x8016F86C */ .word 0x8016F86C # lb $s6, -0x794($zero)
/* 0x00164204 0x801D3E04 0x8016F884 */ .word 0x8016F884 # lb $s6, -0x77C($zero)
/* 0x00164208 0x801D3E08 0x8016F89C */ .word 0x8016F89C # lb $s6, -0x764($zero)
/* 0x0016420C 0x801D3E0C 0x8016F8B4 */ .word 0x8016F8B4 # lb $s6, -0x74C($zero)
/* 0x00164210 0x801D3E10 0x8016F8CC */ .word 0x8016F8CC # lb $s6, -0x734($zero)
