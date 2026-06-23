/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002878C0..0x002878F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent file 2 prologue addiu $sp,-0x28. Small wrapper: lhu fields of $a0, jal 0x8022B5EC, jr $ra at 0x002878EC + delay 0x002878F0. */
/* function boundary candidate: func_002878C0, size=52, kind=prologue */
func_002878C0:
/* 0x002878C0 0x802F74C0 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x002878C4 0x802F74C4 0xAFBF0020 */ .word 0xAFBF0020 # sw $ra, 0x20($sp)
/* 0x002878C8 0x802F74C8 0x94870004 */ .word 0x94870004 # lhu $a3, 0x4($a0)
/* 0x002878CC 0x802F74CC 0x94820006 */ .word 0x94820006 # lhu $v0, 0x6($a0)
/* 0x002878D0 0x802F74D0 0xAFA50014 */ .word 0xAFA50014 # sw $a1, 0x14($sp)
/* 0x002878D4 0x802F74D4 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x002878D8 0x802F74D8 0xAFA60018 */ .word 0xAFA60018 # sw $a2, 0x18($sp)
/* 0x002878DC 0x802F74DC 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x002878E0 0x802F74E0 0x0C08AD7B */ .word 0x0C08AD7B # jal 0x8022B5EC
/* 0x002878E4 0x802F74E4 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x002878E8 0x802F74E8 0x8FBF0020 */ .word 0x8FBF0020 # lw $ra, 0x20($sp)
/* 0x002878EC 0x802F74EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002878F0 0x802F74F0 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
