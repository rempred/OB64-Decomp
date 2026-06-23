/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165E30..0x00165E50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 single-precision const pool: 0x3F866666 (1.05), 0x3F800000 (1.0), 0x3F733333 (0.95) x2, 0x3F800000 (1.0), 0x3F866666 (1.05), then 0x00000000. Small multiplier/ratio table.. */
/* 0x00165E30 0x801D5A30 0x00000000 */ .word 0x00000000 # nop
/* 0x00165E34 0x801D5A34 0x3F866666 */ .word 0x3F866666 # lui $a2, 0x6666
/* 0x00165E38 0x801D5A38 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x00165E3C 0x801D5A3C 0x3F733333 */ .word 0x3F733333 # lui $s3, 0x3333
/* 0x00165E40 0x801D5A40 0x3F733333 */ .word 0x3F733333 # lui $s3, 0x3333
/* 0x00165E44 0x801D5A44 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x00165E48 0x801D5A48 0x3F866666 */ .word 0x3F866666 # lui $a2, 0x6666
/* 0x00165E4C 0x801D5A4C 0x00000000 */ .word 0x00000000 # nop
