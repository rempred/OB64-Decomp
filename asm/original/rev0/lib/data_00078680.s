/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00078680..0x00078698 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two small packed byte tables (24 bytes): 00010102 02030404 05050000 (monotonic ramp indices) and 00020405 06080000 00000000 (step/index bytes). Glyph-width or progression index arrays; not pointers, not ASCII.. */
/* 0x00078680 0x800E8280 0x00000101 */ .word 0x00000101 # special_0x01
/* 0x00078684 0x800E8284 0x02030404 */ .word 0x02030404 # sllv $zero, $v1, $s0
/* 0x00078688 0x800E8288 0x05050000 */ .word 0x05050000 # regimm_0x05 $t0, 0x800E828C
/* 0x0007868C 0x800E828C 0x00020405 */ .word 0x00020405 # special_0x05
/* 0x00078690 0x800E8290 0x06080000 */ .word 0x06080000 # tgei $s0, 0x0
/* 0x00078694 0x800E8294 0x00000000 */ .word 0x00000000 # nop
