/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E800..0x0004E82C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004E800; prologue, jr $ra at 0x0004E824 + delay 0x0004E828 */
/* function boundary candidate: func_0004E800, size=52, kind=prologue */
func_0004E800:
/* 0x0004E800 0x800BE400 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E804 0x800BE404 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E808 0x800BE408 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004E80C 0x800BE40C 0x0C066342 */ .word 0x0C066342 # jal 0x80198D08
/* 0x0004E810 0x800BE410 0xA020FC18 */ .word 0xA020FC18 # sb $zero, -0x3E8($at)
/* 0x0004E814 0x800BE414 0x3402800D */ .word 0x3402800D # ori $v0, $zero, 0x800D
/* 0x0004E818 0x800BE418 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004E81C 0x800BE41C 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004E820 0x800BE420 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E824 0x800BE424 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E828 0x800BE428 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
