/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281840..0x00281860 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE float64 constant pool, 4 doubles: 0x3FE0000000000000=0.5, 0x3FE0000000000000=0.5, 0x4064000000000000=160.0, 0x405E000000000000=120.0 (half of 320x240 / screen-related constants).. */
/* 0x00281840 0x802F1440 0x3FE00000 */ .word 0x3FE00000 # lui $zero, 0x0000
/* 0x00281844 0x802F1444 0x00000000 */ .word 0x00000000 # nop
/* 0x00281848 0x802F1448 0x3FE00000 */ .word 0x3FE00000 # lui $zero, 0x0000
/* 0x0028184C 0x802F144C 0x00000000 */ .word 0x00000000 # nop
/* 0x00281850 0x802F1450 0x40640000 */ .word 0x40640000 # cop0_0x03
/* 0x00281854 0x802F1454 0x00000000 */ .word 0x00000000 # nop
/* 0x00281858 0x802F1458 0x405E0000 */ .word 0x405E0000 # cop0_0x02
/* 0x0028185C 0x802F145C 0x00000000 */ .word 0x00000000 # nop
