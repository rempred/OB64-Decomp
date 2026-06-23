/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025ED6C..0x0025EDC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed mixed-data tail / sentinel region following the pointer table: 0x00010000, 0xFFFF0000 sentinel then 3 zero words; then small records 0x00001000/0x80000000, 0x00010004/0x00030002, 0xFFFFFFFC/0xFFFDFFFE, two zero words, then 0x00F40000/0x80000000, 0x00F50000/0x80000000, 0x00F60000/0x80000000 paired entries and 2 trailing zero words. Cannot fully type; appears to be small index/flag records bridging into the float pool.. */
/* 0x0025ED6C 0x802CE96C 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x0025ED70 0x802CE970 0xFFFF0000 */ .word 0xFFFF0000 # sd $ra, 0x0($ra)
/* 0x0025ED74 0x802CE974 0x00000000 */ .word 0x00000000 # nop
/* 0x0025ED78 0x802CE978 0x00000000 */ .word 0x00000000 # nop
/* 0x0025ED7C 0x802CE97C 0x00000000 */ .word 0x00000000 # nop
/* 0x0025ED80 0x802CE980 0x00001000 */ .word 0x00001000 # sll $v0, $zero, 0
/* 0x0025ED84 0x802CE984 0x80000000 */ .word 0x80000000 # lb $zero, 0x0($zero)
/* 0x0025ED88 0x802CE988 0x00010004 */ .word 0x00010004 # sllv $zero, $at, $zero
/* 0x0025ED8C 0x802CE98C 0x00030002 */ .word 0x00030002 # srl $zero, $v1, 0
/* 0x0025ED90 0x802CE990 0xFFFFFFFC */ .word 0xFFFFFFFC # sd $ra, -0x4($ra)
/* 0x0025ED94 0x802CE994 0xFFFDFFFE */ .word 0xFFFDFFFE # sd $sp, -0x2($ra)
/* 0x0025ED98 0x802CE998 0x00000000 */ .word 0x00000000 # nop
/* 0x0025ED9C 0x802CE99C 0x00000000 */ .word 0x00000000 # nop
/* 0x0025EDA0 0x802CE9A0 0x00F40000 */ .word 0x00F40000 # sll $zero, $s4, 0
/* 0x0025EDA4 0x802CE9A4 0x80000000 */ .word 0x80000000 # lb $zero, 0x0($zero)
/* 0x0025EDA8 0x802CE9A8 0x00F50000 */ .word 0x00F50000 # sll $zero, $s5, 0
/* 0x0025EDAC 0x802CE9AC 0x80000000 */ .word 0x80000000 # lb $zero, 0x0($zero)
/* 0x0025EDB0 0x802CE9B0 0x00F60000 */ .word 0x00F60000 # sll $zero, $s6, 0
/* 0x0025EDB4 0x802CE9B4 0x80000000 */ .word 0x80000000 # lb $zero, 0x0($zero)
/* 0x0025EDB8 0x802CE9B8 0x00000000 */ .word 0x00000000 # nop
/* 0x0025EDBC 0x802CE9BC 0x00000000 */ .word 0x00000000 # nop
