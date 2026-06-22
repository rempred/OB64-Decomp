/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00078FF8..0x00079018 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Mixed small data (32 bytes): packed half-words 0008002E 00390000 (glyph indices), format-string fragments '%d' (25640000) and '_' (5F000000), and an offset/coord table 00140036 0058007A 009C00BE (ascending 16-bit offsets, stride 0x22), trailing zero. Mixed format-token + offset data.. */
/* 0x00078FF8 0x800E8BF8 0x0008002E */ .word 0x0008002E # dsub $zero, $zero, $t0
/* 0x00078FFC 0x800E8BFC 0x00390000 */ .word 0x00390000 # sll $zero, $t9, 0
/* 0x00079000 0x800E8C00 0x25640000 */ .word 0x25640000 # addiu $a0, $t3, 0x0
/* 0x00079004 0x800E8C04 0x5F000000 */ .word 0x5F000000 # bgtzl $t8, 0x800E8C08
/* 0x00079008 0x800E8C08 0x00140036 */ .word 0x00140036 # tne $zero, $s4
/* 0x0007900C 0x800E8C0C 0x0058007A */ .word 0x0058007A # dsrl $zero, $t8, 1
/* 0x00079010 0x800E8C10 0x009C00BE */ .word 0x009C00BE # dsrl32 $zero, $gp, 2
/* 0x00079014 0x800E8C14 0x00000000 */ .word 0x00000000 # nop
