/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C1A8..0x0005C1D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed prologue (addiu sp,-0x18) with jal 0x80093380. Ends jr $ra at 0x5C1C4, delay slot 0x5C1C8; trailing alignment nop at 0x5C1CC attached. */
/* function boundary candidate: func_0005C1A8, size=96, kind=prologue */
func_0005C1A8:
/* 0x0005C1A8 0x800CBDA8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0005C1AC 0x800CBDAC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0005C1B0 0x800CBDB0 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x0005C1B4 0x800CBDB4 0x24847AE7 */ .word 0x24847AE7 # addiu $a0, $a0, 0x7AE7
/* 0x0005C1B8 0x800CBDB8 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x0005C1BC 0x800CBDBC 0x24050008 */ .word 0x24050008 # addiu $a1, $zero, 0x8
/* 0x0005C1C0 0x800CBDC0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0005C1C4 0x800CBDC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C1C8 0x800CBDC8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0005C1CC 0x800CBDCC 0x00000000 */ .word 0x00000000 # nop
