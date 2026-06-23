/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x0016C8B8..0x0016C8DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed fn (addiu $sp,-0x18); calls 0x80179018 and 0x8021B89C; jr $ra at 0x0016C8D4 with delay-slot addiu $sp,0x18 at 0x0016C8D8. Parent idx15 over-merged this with the following frameless leaf. */
/* function boundary candidate: func_0016C8B8, size=212, kind=prologue */
func_0016C8B8:
/* 0x0016C8B8 0x801DC4B8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0016C8BC 0x801DC4BC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0016C8C0 0x801DC4C0 0x0C05E406 */ .word 0x0C05E406 # jal 0x80179018
/* 0x0016C8C4 0x801DC4C4 0x00000000 */ .word 0x00000000 # nop
/* 0x0016C8C8 0x801DC4C8 0x0C086E27 */ .word 0x0C086E27 # jal 0x8021B89C
/* 0x0016C8CC 0x801DC4CC 0x00000000 */ .word 0x00000000 # nop
/* 0x0016C8D0 0x801DC4D0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0016C8D4 0x801DC4D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0016C8D8 0x801DC4D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
