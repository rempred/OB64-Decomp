/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DEB4..0x0004DED0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DEC8 + delay 0x0004DECC */
/* function boundary candidate: func_0004DEB4, size=28, kind=prologue */
func_0004DEB4:
/* 0x0004DEB4 0x800BDAB4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DEB8 0x800BDAB8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DEBC 0x800BDABC 0x0C06B378 */ .word 0x0C06B378 # jal 0x801ACDE0
/* 0x0004DEC0 0x800BDAC0 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DEC4 0x800BDAC4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DEC8 0x800BDAC8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DECC 0x800BDACC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
