/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00044040..0x00044074 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue func (addiu sp,-0x18); jr $ra at 0x4406C, restore 0x44070 */
/* function boundary candidate: func_00044040, size=52, kind=prologue */
func_00044040:
/* 0x00044040 0x800B3C40 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00044044 0x800B3C44 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00044048 0x800B3C48 0x30A500FF */ .word 0x30A500FF # andi $a1, $a1, 0x00FF
/* 0x0004404C 0x800B3C4C 0x000510C0 */ .word 0x000510C0 # sll $v0, $a1, 3
/* 0x00044050 0x800B3C50 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00044054 0x800B3C54 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00044058 0x800B3C58 0x3C048018 */ .word 0x3C048018 # lui $a0, 0x8018
/* 0x0004405C 0x800B3C5C 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x00044060 0x800B3C60 0x0C05B910 */ .word 0x0C05B910 # jal 0x8016E440
/* 0x00044064 0x800B3C64 0x90847C4D */ .word 0x90847C4D # lbu $a0, 0x7C4D($a0)
/* 0x00044068 0x800B3C68 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004406C 0x800B3C6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00044070 0x800B3C70 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
