/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002831E0..0x00283224 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Leaf handler; j 0x80227248 tail-return internal. Ends jr $ra @0x0028321C + delay @0x00283220. */
/* function boundary candidate: func_002831E0, size=68, kind=prologue */
func_002831E0:
/* 0x002831E0 0x802F2DE0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002831E4 0x802F2DE4 0x24020007 */ .word 0x24020007 # addiu $v0, $zero, 0x7
/* 0x002831E8 0x802F2DE8 0x14820006 */ .word 0x14820006 # bne $a0, $v0, 0x802F2E04
/* 0x002831EC 0x802F2DEC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002831F0 0x802F2DF0 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x002831F4 0x802F2DF4 0x0C03AA0E */ .word 0x0C03AA0E # jal 0x800EA838
/* 0x002831F8 0x802F2DF8 0x2484B0B0 */ .word 0x2484B0B0 # addiu $a0, $a0, -0x4F50
/* 0x002831FC 0x802F2DFC 0x08089C92 */ .word 0x08089C92 # j 0x80227248
/* 0x00283200 0x802F2E00 0x00000000 */ .word 0x00000000 # nop
/* 0x00283204 0x802F2E04 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x00283208 0x802F2E08 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x0028320C 0x802F2E0C 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x00283210 0x802F2E10 0x0C03AA21 */ .word 0x0C03AA21 # jal 0x800EA884
/* 0x00283214 0x802F2E14 0x8C84A8A8 */ .word 0x8C84A8A8 # lw $a0, -0x5758($a0)
/* 0x00283218 0x802F2E18 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0028321C 0x802F2E1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283220 0x802F2E20 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
