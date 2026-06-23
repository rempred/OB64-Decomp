/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B24C..0x0023B274 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18 @0x0023B24C. sll/sra$a0 sign-extend, jal 0x801C8FE8, sb 1 at 0xD0($v0). Ends jr$ra@0x0023B26C + delay addiu$sp,0x18@0x0023B270. */
/* function boundary candidate: func_0023B24C, size=40, kind=prologue */
func_0023B24C:
/* 0x0023B24C 0x802AAE4C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0023B250 0x802AAE50 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0023B254 0x802AAE54 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0023B258 0x802AAE58 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0023B25C 0x802AAE5C 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0023B260 0x802AAE60 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x0023B264 0x802AAE64 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0023B268 0x802AAE68 0xA04300D0 */ .word 0xA04300D0 # sb $v1, 0xD0($v0)
/* 0x0023B26C 0x802AAE6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B270 0x802AAE70 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
