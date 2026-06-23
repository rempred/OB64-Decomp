/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00162698..0x001626C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then a short mixed block with embedded zeros: 0x00005A17,0xCEF3FFFF,0x00000000,0x0000FFFF,0x00000000,0x00000000,0x00000000,0x00000000. Mostly small values and 0xFFFF sentinels; trailing zero words. HYPOTHESIS: tiny header/control record with zero padding. [name-token: data_00162698_block_DF]. */
/* 0x00162698 0x801D2298 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x0016269C 0x801D229C 0x00000000 */ .word 0x00000000 # nop
/* 0x001626A0 0x801D22A0 0x00005A17 */ .word 0x00005A17 # dsrav $t3, $zero, $zero
/* 0x001626A4 0x801D22A4 0xCEF3FFFF */ .word 0xCEF3FFFF # op_0x33
/* 0x001626A8 0x801D22A8 0x00000000 */ .word 0x00000000 # nop
/* 0x001626AC 0x801D22AC 0x0000FFFF */ .word 0x0000FFFF # dsra32 $ra, $zero, 31
/* 0x001626B0 0x801D22B0 0x00000000 */ .word 0x00000000 # nop
/* 0x001626B4 0x801D22B4 0x00000000 */ .word 0x00000000 # nop
/* 0x001626B8 0x801D22B8 0x00000000 */ .word 0x00000000 # nop
/* 0x001626BC 0x801D22BC 0x00000000 */ .word 0x00000000 # nop
