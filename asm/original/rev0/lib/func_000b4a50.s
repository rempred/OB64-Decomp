/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B4A50..0x000B4A70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* andi+jal 0x801C7E90 wrapper; jr $ra at 0xB4A68; ends before next func's lui/lw orphan. */
/* function boundary candidate: func_000B4A50, size=32, kind=prologue */
func_000B4A50:
/* 0x000B4A50 0x80124650 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B4A54 0x80124654 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B4A58 0x80124658 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x000B4A5C 0x8012465C 0x0C071FA4 */ .word 0x0C071FA4 # jal 0x801C7E90
/* 0x000B4A60 0x80124660 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x000B4A64 0x80124664 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B4A68 0x80124668 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B4A6C 0x8012466C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
