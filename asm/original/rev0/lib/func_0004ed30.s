/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004ED30..0x0004ED60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* preamble-orphan folded: lui/lbu at 0x0004ED30 read-before-write consumed by beq at 0x0004ED3C; prologue at 0x0004ED38, jr $ra at 0x0004ED58 + delay 0x0004ED5C */
func_0004ed30:
/* 0x0004ED30 0x800BE930 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004ED34 0x800BE934 0x9042FC18 */ .word 0x9042FC18 # lbu $v0, -0x3E8($v0)

/* function boundary candidate: func_0004ED38, size=40, kind=prologue */
func_0004ED38:
/* 0x0004ED38 0x800BE938 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004ED3C 0x800BE93C 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BE94C
/* 0x0004ED40 0x800BE940 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004ED44 0x800BE944 0x0C082C26 */ .word 0x0C082C26 # jal 0x8020B098
/* 0x0004ED48 0x800BE948 0x00000000 */ .word 0x00000000 # nop
/* 0x0004ED4C 0x800BE94C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004ED50 0x800BE950 0xA020FC18 */ .word 0xA020FC18 # sb $zero, -0x3E8($at)
/* 0x0004ED54 0x800BE954 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004ED58 0x800BE958 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004ED5C 0x800BE95C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
