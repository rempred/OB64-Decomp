/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DF6C..0x0004DF9C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DF94 + delay 0x0004DF98 */
/* function boundary candidate: func_0004DF6C, size=48, kind=prologue */
func_0004DF6C:
/* 0x0004DF6C 0x800BDB6C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DF70 0x800BDB70 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0004DF74 0x800BDB74 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DF78 0x800BDB78 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x0004DF7C 0x800BDB7C 0xA0227030 */ .word 0xA0227030 # sb $v0, 0x7030($at)
/* 0x0004DF80 0x800BDB80 0x0C01D217 */ .word 0x0C01D217 # jal 0x8007485C
/* 0x0004DF84 0x800BDB84 0x2404000E */ .word 0x2404000E # addiu $a0, $zero, 0xE
/* 0x0004DF88 0x800BDB88 0x0C06D68C */ .word 0x0C06D68C # jal 0x801B5A30
/* 0x0004DF8C 0x800BDB8C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DF90 0x800BDB90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DF94 0x800BDB94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DF98 0x800BDB98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
