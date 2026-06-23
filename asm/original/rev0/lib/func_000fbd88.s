/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FBD88..0x000FBDAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frame -0x18; single jal 0x801AEE94; jr $ra@0x000FBDA4. */
/* function boundary candidate: func_000FBD88, size=36, kind=prologue */
func_000FBD88:
/* 0x000FBD88 0x8016B988 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000FBD8C 0x8016B98C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000FBD90 0x8016B990 0x3C05801B */ .word 0x3C05801B # lui $a1, 0x801B
/* 0x000FBD94 0x8016B994 0x24A5436C */ .word 0x24A5436C # addiu $a1, $a1, 0x436C
/* 0x000FBD98 0x8016B998 0x0C06BBA5 */ .word 0x0C06BBA5 # jal 0x801AEE94
/* 0x000FBD9C 0x8016B99C 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000FBDA0 0x8016B9A0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000FBDA4 0x8016B9A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FBDA8 0x8016B9A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
