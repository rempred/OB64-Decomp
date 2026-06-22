/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004645C..0x0004647C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x4645C), single fn, jr $ra at 0x46474 + delay 0x46478 */
/* function boundary candidate: func_0004645C, size=32, kind=prologue */
func_0004645C:
/* 0x0004645C 0x800B605C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00046460 0x800B6060 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00046464 0x800B6064 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00046468 0x800B6068 0x0C05CAC4 */ .word 0x0C05CAC4 # jal 0x80172B10
/* 0x0004646C 0x800B606C 0x30C500FF */ .word 0x30C500FF # andi $a1, $a2, 0x00FF
/* 0x00046470 0x800B6070 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046474 0x800B6074 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046478 0x800B6078 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
