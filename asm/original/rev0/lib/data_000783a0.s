/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x000783A0..0x000783B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 16-byte small index/byte array: 0x001F1C1F 0x1E1F1E1F 0x1F1E1F1E 0x1F000000. Values are small bytes 0x1C-0x1F (glyph/spacing index bytes), trailing 0x000000. Not pointers, not ASCII.. */
/* 0x000783A0 0x800E7FA0 0x001F1C1F */ .word 0x001F1C1F # ddivu $zero, $ra
/* 0x000783A4 0x800E7FA4 0x1E1F1E1F */ .word 0x1E1F1E1F # bgtz $s0, 0x800EF824
/* 0x000783A8 0x800E7FA8 0x1F1E1F1E */ .word 0x1F1E1F1E # bgtz $t8, 0x800EFC24
/* 0x000783AC 0x800E7FAC 0x1F000000 */ .word 0x1F000000 # bgtz $t8, 0x800E7FB0
