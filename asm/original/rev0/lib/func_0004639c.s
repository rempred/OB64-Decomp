/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004639C..0x000463B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x4639C), jr $ra at 0x463B0 + delay 0x463B4 */
/* function boundary candidate: func_0004639C, size=192, kind=prologue */
func_0004639C:
/* 0x0004639C 0x800B5F9C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000463A0 0x800B5FA0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000463A4 0x800B5FA4 0x0C05BF9E */ .word 0x0C05BF9E # jal 0x8016FE78
/* 0x000463A8 0x800B5FA8 0x00C02821 */ .word 0x00C02821 # move $a1, $a2
/* 0x000463AC 0x800B5FAC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000463B0 0x800B5FB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000463B4 0x800B5FB4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
