/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EC10..0x0004EC3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue frame 0x18, jr $ra at 0x0004EC34 + delay 0x0004EC38 */
/* function boundary candidate: func_0004EC10, size=44, kind=prologue */
func_0004EC10:
/* 0x0004EC10 0x800BE810 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004EC14 0x800BE814 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004EC18 0x800BE818 0x0C05E418 */ .word 0x0C05E418 # jal 0x80179060
/* 0x0004EC1C 0x800BE81C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EC20 0x800BE820 0x0C01DB8B */ .word 0x0C01DB8B # jal 0x80076E2C
/* 0x0004EC24 0x800BE824 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EC28 0x800BE828 0x0C05EF70 */ .word 0x0C05EF70 # jal 0x8017BDC0
/* 0x0004EC2C 0x800BE82C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EC30 0x800BE830 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004EC34 0x800BE834 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EC38 0x800BE838 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
