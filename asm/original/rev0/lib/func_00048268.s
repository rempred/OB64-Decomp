/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00048268..0x00048294 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* small prologue function; single jr $ra at 0x4828C + delay (0x48290 addiu sp). */
/* function boundary candidate: func_00048268, size=44, kind=prologue */
func_00048268:
/* 0x00048268 0x800B7E68 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004826C 0x800B7E6C 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x00048270 0x800B7E70 0x24847B00 */ .word 0x24847B00 # addiu $a0, $a0, 0x7B00
/* 0x00048274 0x800B7E74 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00048278 0x800B7E78 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x0004827C 0x800B7E7C 0x24050064 */ .word 0x24050064 # addiu $a1, $zero, 0x64
/* 0x00048280 0x800B7E80 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00048284 0x800B7E84 0xA02036A8 */ .word 0xA02036A8 # sb $zero, 0x36A8($at)
/* 0x00048288 0x800B7E88 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004828C 0x800B7E8C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00048290 0x800B7E90 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
