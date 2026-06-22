/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DC80..0x0004DCAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DCA4 + delay 0x0004DCA8 */
/* function boundary candidate: func_0004DC80, size=44, kind=prologue */
func_0004DC80:
/* 0x0004DC80 0x800BD880 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DC84 0x800BD884 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DC88 0x800BD888 0x0C05C1E5 */ .word 0x0C05C1E5 # jal 0x80170794
/* 0x0004DC8C 0x800BD88C 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0004DC90 0x800BD890 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800BD8A0
/* 0x0004DC94 0x800BD894 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DC98 0x800BD898 0x0C068683 */ .word 0x0C068683 # jal 0x801A1A0C
/* 0x0004DC9C 0x800BD89C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DCA0 0x800BD8A0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DCA4 0x800BD8A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DCA8 0x800BD8A8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
