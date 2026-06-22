/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000462F4..0x00046314 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x462F4), jr $ra at 0x4630C + delay 0x46310 */
/* function boundary candidate: func_000462F4, size=72, kind=prologue */
func_000462F4:
/* 0x000462F4 0x800B5EF4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000462F8 0x800B5EF8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000462FC 0x800B5EFC 0x0C05CAEF */ .word 0x0C05CAEF # jal 0x80172BBC
/* 0x00046300 0x800B5F00 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00046304 0x800B5F04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00046308 0x800B5F08 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x0004630C 0x800B5F0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046310 0x800B5F10 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
