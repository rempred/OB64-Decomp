/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025FC94..0x0025FCB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18; sign-extends $a0 (sll/sra 16), jal 0x8020E850, jr $ra at 0x0025FCAC + delay addiu$sp,0x18. */
/* function boundary candidate: func_0025FC94, size=32, kind=prologue */
func_0025FC94:
/* 0x0025FC94 0x802CF894 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025FC98 0x802CF898 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025FC9C 0x802CF89C 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0025FCA0 0x802CF8A0 0x0C083A14 */ .word 0x0C083A14 # jal 0x8020E850
/* 0x0025FCA4 0x802CF8A4 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0025FCA8 0x802CF8A8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025FCAC 0x802CF8AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025FCB0 0x802CF8B0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
