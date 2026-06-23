/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C5034..0x001C5068 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001C5034, size=52, kind=prologue */
func_001C5034:
/* 0x001C5034 0x80234C34 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C5038 0x80234C38 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x001C503C 0x80234C3C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x001C5040 0x80234C40 0x0C061858 */ .word 0x0C061858 # jal 0x80186160
/* 0x001C5044 0x80234C44 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x001C5048 0x80234C48 0x8E020008 */ .word 0x8E020008 # lw $v0, 0x8($s0)
/* 0x001C504C 0x80234C4C 0x24420004 */ .word 0x24420004 # addiu $v0, $v0, 0x4
/* 0x001C5050 0x80234C50 0xAE020008 */ .word 0xAE020008 # sw $v0, 0x8($s0)
/* 0x001C5054 0x80234C54 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001C5058 0x80234C58 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001C505C 0x80234C5C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001C5060 0x80234C60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C5064 0x80234C64 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
