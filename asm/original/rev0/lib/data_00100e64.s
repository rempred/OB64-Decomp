/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100E64..0x00100E94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12-word prefix/header of the float-record table that follows. Mix of integer-valued IEEE-754 floats (0xC2CE0000=-103, 0xC2AC0000=-86, 0xC2A00000=-80, 0xC1F00000=-30, 0xC2700000=-60, 0xC1C00000=-24, 0x40A00000=5, 0x41F00000=30) interleaved with 0x00000000 padding words. Same word kind as the 0x50-stride records below but not aligned to their header marker. HYPOTHESIS: header/first (irregular) entry of the float parameter table.. */
/* 0x00100E64 0x80170A64 0xC2CE0000 */ .word 0xC2CE0000 # ll $t6, 0x0($s6)
/* 0x00100E68 0x80170A68 0xC2AC0000 */ .word 0xC2AC0000 # ll $t4, 0x0($s5)
/* 0x00100E6C 0x80170A6C 0xC2A00000 */ .word 0xC2A00000 # ll $zero, 0x0($s5)
/* 0x00100E70 0x80170A70 0xC1F00000 */ .word 0xC1F00000 # ll $s0, 0x0($t7)
/* 0x00100E74 0x80170A74 0x00000000 */ .word 0x00000000 # nop
/* 0x00100E78 0x80170A78 0x00000000 */ .word 0x00000000 # nop
/* 0x00100E7C 0x80170A7C 0xC2700000 */ .word 0xC2700000 # ll $s0, 0x0($s3)
/* 0x00100E80 0x80170A80 0xC1C00000 */ .word 0xC1C00000 # ll $zero, 0x0($t6)
/* 0x00100E84 0x80170A84 0x40A00000 */ .word 0x40A00000 # cop0_0x05
/* 0x00100E88 0x80170A88 0x41F00000 */ .word 0x41F00000 # cop0_0x0F
/* 0x00100E8C 0x80170A8C 0x00000000 */ .word 0x00000000 # nop
/* 0x00100E90 0x80170A90 0x00000000 */ .word 0x00000000 # nop
