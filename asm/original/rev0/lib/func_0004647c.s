/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004647C..0x0004649C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x4647C), jr $ra at 0x46494 + delay 0x46498 */
/* function boundary candidate: func_0004647C, size=84, kind=prologue */
func_0004647C:
/* 0x0004647C 0x800B607C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00046480 0x800B6080 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00046484 0x800B6084 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00046488 0x800B6088 0x0C05CADA */ .word 0x0C05CADA # jal 0x80172B68
/* 0x0004648C 0x800B608C 0x30C500FF */ .word 0x30C500FF # andi $a1, $a2, 0x00FF
/* 0x00046490 0x800B6090 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046494 0x800B6094 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046498 0x800B6098 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
