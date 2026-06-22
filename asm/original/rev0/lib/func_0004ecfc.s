/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004ECFC..0x0004ED30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* preamble-orphan folded: lui/lbu at 0x0004ECFC read-before-write of -0x3E8(0x8019) consumed by bne at 0x0004ED08; prologue at 0x0004ED04, jr $ra at 0x0004ED28 + delay 0x0004ED2C */
func_0004ecfc:
/* 0x0004ECFC 0x800BE8FC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004ED00 0x800BE900 0x9042FC18 */ .word 0x9042FC18 # lbu $v0, -0x3E8($v0)

/* function boundary candidate: func_0004ED04, size=44, kind=prologue */
func_0004ED04:
/* 0x0004ED04 0x800BE904 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004ED08 0x800BE908 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800BE918
/* 0x0004ED0C 0x800BE90C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004ED10 0x800BE910 0x0C082C0C */ .word 0x0C082C0C # jal 0x8020B030
/* 0x0004ED14 0x800BE914 0x00000000 */ .word 0x00000000 # nop
/* 0x0004ED18 0x800BE918 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0004ED1C 0x800BE91C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004ED20 0x800BE920 0xA022FC18 */ .word 0xA022FC18 # sb $v0, -0x3E8($at)
/* 0x0004ED24 0x800BE924 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004ED28 0x800BE928 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004ED2C 0x800BE92C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
