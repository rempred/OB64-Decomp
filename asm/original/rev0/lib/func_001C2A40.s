/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C2A40..0x001C2A6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001C2A40, size=44, kind=prologue */
func_001C2A40:
/* 0x001C2A40 0x80232640 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C2A44 0x80232644 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001C2A48 0x80232648 0x0C05FCCD */ .word 0x0C05FCCD # jal 0x8017F334
/* 0x001C2A4C 0x8023264C 0x24045500 */ .word 0x24045500 # addiu $a0, $zero, 0x5500
/* 0x001C2A50 0x80232650 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80232660
/* 0x001C2A54 0x80232654 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2A58 0x80232658 0x0C05F0BF */ .word 0x0C05F0BF # jal 0x8017C2FC
/* 0x001C2A5C 0x8023265C 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x001C2A60 0x80232660 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001C2A64 0x80232664 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C2A68 0x80232668 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
