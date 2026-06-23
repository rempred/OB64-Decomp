/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x001019D4..0x00101A10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small packed-index data run, mostly 0x000x0004 / 0x00010000 / zero pad pattern: 0x00000004, 0x00000005, 0x00040004, 0x00010000, 0x00010004, 0x00000000, 0x00020004, 0x00010000, 0x00030004, 0x00000000, 0x00040004, 0x00000000, 0x00010004, 0x00010000. Looks like packed (index, count=4) pairs with zero separators. No field names asserted. [name-token: data_001019D4_packed_smallint]. */
/* 0x001019D4 0x801715D4 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x001019D8 0x801715D8 0x00000005 */ .word 0x00000005 # special_0x05
/* 0x001019DC 0x801715DC 0x00040004 */ .word 0x00040004 # sllv $zero, $a0, $zero
/* 0x001019E0 0x801715E0 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x001019E4 0x801715E4 0x00010004 */ .word 0x00010004 # sllv $zero, $at, $zero
/* 0x001019E8 0x801715E8 0x00000000 */ .word 0x00000000 # nop
/* 0x001019EC 0x801715EC 0x00020004 */ .word 0x00020004 # sllv $zero, $v0, $zero
/* 0x001019F0 0x801715F0 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x001019F4 0x801715F4 0x00030004 */ .word 0x00030004 # sllv $zero, $v1, $zero
/* 0x001019F8 0x801715F8 0x00000000 */ .word 0x00000000 # nop
/* 0x001019FC 0x801715FC 0x00040004 */ .word 0x00040004 # sllv $zero, $a0, $zero
/* 0x00101A00 0x80171600 0x00000000 */ .word 0x00000000 # nop
/* 0x00101A04 0x80171604 0x00010004 */ .word 0x00010004 # sllv $zero, $at, $zero
/* 0x00101A08 0x80171608 0x00010000 */ .word 0x00010000 # sll $zero, $at, 0
/* 0x00101A0C 0x8017160C 0x00000000 */ .word 0x00000000 # nop
