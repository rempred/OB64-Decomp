/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA050..0x001BA074 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed init helper. addiu$sp,-0x18; saves $ra; lui$a0,0x8023 + addiu -0x5E10 to point at table 0x8022A1F0; jal 0x80093380 (memset/clear, a1=0x20); jr$ra@0x1BA06C + delay addiu$sp,0x18 at 0x1BA070. */
func_001BA050:
/* function boundary candidate: func_001BA050, size=240, kind=prologue */
func_001BA050:
/* 0x001BA050 0x80229C50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BA054 0x80229C54 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001BA058 0x80229C58 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x001BA05C 0x80229C5C 0x2484A1F0 */ .word 0x2484A1F0 # addiu $a0, $a0, -0x5E10
/* 0x001BA060 0x80229C60 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BA064 0x80229C64 0x24050020 */ .word 0x24050020 # addiu $a1, $zero, 0x20
/* 0x001BA068 0x80229C68 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001BA06C 0x80229C6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA070 0x80229C70 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
