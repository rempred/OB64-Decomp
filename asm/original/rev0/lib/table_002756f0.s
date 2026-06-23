/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x002756F0..0x00275704 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Overlay handler pointer table: 5 RAM code pointers 0x8020E6A4, 0x8020E74C, 0x8020E760, 0x8020E760, 0x8020E770.. */
/* 0x002756F0 0x802E52F0 0x8020E6A4 */ .word 0x8020E6A4 # lb $zero, -0x195C($at)
/* 0x002756F4 0x802E52F4 0x8020E74C */ .word 0x8020E74C # lb $zero, -0x18B4($at)
/* 0x002756F8 0x802E52F8 0x8020E760 */ .word 0x8020E760 # lb $zero, -0x18A0($at)
/* 0x002756FC 0x802E52FC 0x8020E760 */ .word 0x8020E760 # lb $zero, -0x18A0($at)
/* 0x00275700 0x802E5300 0x8020E770 */ .word 0x8020E770 # lb $zero, -0x1890($at)
