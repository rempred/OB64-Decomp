/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001E07C0..0x001E07F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Boundary prefix at 0x001E07C0..0x001E07C8 folded into the following parent-detected body at 0x001E07C8; classified as code, not data. */
func_001E07C0:
/* 0x001E07C0 0x802503C0 0x3C04801C */ .word 0x3C04801C # lui $a0, 0x801C
/* 0x001E07C4 0x802503C4 0x8C8494BC */ .word 0x8C8494BC # lw $a0, -0x6B44($a0)

/* function boundary candidate: func_001E07C8, size=40, kind=prologue */
func_001E07C8:
/* 0x001E07C8 0x802503C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001E07CC 0x802503CC 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x802503E4
/* 0x001E07D0 0x802503D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001E07D4 0x802503D4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001E07D8 0x802503D8 0x00000000 */ .word 0x00000000 # nop
/* 0x001E07DC 0x802503DC 0x3C01801C */ .word 0x3C01801C # lui $at, 0x801C
/* 0x001E07E0 0x802503E0 0xAC2094BC */ .word 0xAC2094BC # sw $zero, -0x6B44($at)
/* 0x001E07E4 0x802503E4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001E07E8 0x802503E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001E07EC 0x802503EC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
