/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165D9C..0x00165E00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed small-byte array (values 0x00..0x03) with a trailing 0xFFFFFF00/0x00000001 marker. Looks like a per-entry index/level/count map. Raw words: 0x00000000(pad at 0x165D9C), 0x01020203, 0x03030202, 0x01020202, 0x02010100, 0x02020202, 0x01010101, then 0xFFFFFF00, 0x00000001, 0x00000000, 0x00000000. Hypothesis (marked as such): byte-indexed lookup/length table.. */
/* 0x00165D9C 0x801D599C 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DA0 0x801D59A0 0x01020203 */ .word 0x01020203 # sra $zero, $v0, 8
/* 0x00165DA4 0x801D59A4 0x03030202 */ .word 0x03030202 # srl $zero, $v1, 8
/* 0x00165DA8 0x801D59A8 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DAC 0x801D59AC 0x01020202 */ .word 0x01020202 # srl $zero, $v0, 8
/* 0x00165DB0 0x801D59B0 0x02010100 */ .word 0x02010100 # sll $zero, $at, 4
/* 0x00165DB4 0x801D59B4 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DB8 0x801D59B8 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x00165DBC 0x801D59BC 0x00000202 */ .word 0x00000202 # srl $zero, $zero, 8
/* 0x00165DC0 0x801D59C0 0x02020202 */ .word 0x02020202 # srl $zero, $v0, 8
/* 0x00165DC4 0x801D59C4 0x01010101 */ .word 0x01010101 # special_0x01
/* 0x00165DC8 0x801D59C8 0x02020102 */ .word 0x02020102 # srl $zero, $v0, 4
/* 0x00165DCC 0x801D59CC 0x02020200 */ .word 0x02020200 # sll $zero, $v0, 8
/* 0x00165DD0 0x801D59D0 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DD4 0x801D59D4 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x00165DD8 0x801D59D8 0x01010102 */ .word 0x01010102 # srl $zero, $at, 4
/* 0x00165DDC 0x801D59DC 0x02020201 */ .word 0x02020201 # special_0x01
/* 0x00165DE0 0x801D59E0 0x02020102 */ .word 0x02020102 # srl $zero, $v0, 4
/* 0x00165DE4 0x801D59E4 0x02020202 */ .word 0x02020202 # srl $zero, $v0, 8
/* 0x00165DE8 0x801D59E8 0x02010202 */ .word 0x02010202 # srl $zero, $at, 8
/* 0x00165DEC 0x801D59EC 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DF0 0x801D59F0 0xFFFFFF00 */ .word 0xFFFFFF00 # sd $ra, -0x100($ra)
/* 0x00165DF4 0x801D59F4 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x00165DF8 0x801D59F8 0x00000000 */ .word 0x00000000 # nop
/* 0x00165DFC 0x801D59FC 0x00000000 */ .word 0x00000000 # nop
