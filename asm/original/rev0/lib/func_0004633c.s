/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004633C..0x00046358 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x4633C), jr $ra at 0x46350 + delay 0x46354 */
/* function boundary candidate: func_0004633C, size=96, kind=prologue */
func_0004633C:
/* 0x0004633C 0x800B5F3C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00046340 0x800B5F40 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00046344 0x800B5F44 0x0C061884 */ .word 0x0C061884 # jal 0x80186210
/* 0x00046348 0x800B5F48 0x00000000 */ .word 0x00000000 # nop
/* 0x0004634C 0x800B5F4C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046350 0x800B5F50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046354 0x800B5F54 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
