/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280FF0..0x00281000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Four packed records at chunk end, stride 4 bytes as two 16-bit halves: 0x0280/0x01E0 (=640/480) and 0x01FF/0x0004; pattern repeats twice (dimension/extent pairs, exact type unknown).. */
/* 0x00280FF0 0x802F0BF0 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x00280FF4 0x802F0BF4 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
/* 0x00280FF8 0x802F0BF8 0x028001E0 */ .word 0x028001E0 # add $zero, $s4, $zero
/* 0x00280FFC 0x802F0BFC 0x01FF0004 */ .word 0x01FF0004 # sllv $zero, $ra, $t7
