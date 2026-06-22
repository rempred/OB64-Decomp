/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EF18..0x0004EF34 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue frame 0x18, jr $ra at 0x0004EF2C + delay 0x0004EF30 */
/* function boundary candidate: func_0004EF18, size=28, kind=prologue */
func_0004EF18:
/* 0x0004EF18 0x800BEB18 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004EF1C 0x800BEB1C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004EF20 0x800BEB20 0x0C05E4D5 */ .word 0x0C05E4D5 # jal 0x80179354
/* 0x0004EF24 0x800BEB24 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EF28 0x800BEB28 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004EF2C 0x800BEB2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EF30 0x800BEB30 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
