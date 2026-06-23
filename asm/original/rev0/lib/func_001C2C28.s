/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C2C28..0x001C2C54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001C2C28, size=44, kind=prologue */
func_001C2C28:
/* 0x001C2C28 0x80232828 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C2C2C 0x8023282C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001C2C30 0x80232830 0x0C05FCCD */ .word 0x0C05FCCD # jal 0x8017F334
/* 0x001C2C34 0x80232834 0x24045501 */ .word 0x24045501 # addiu $a0, $zero, 0x5501
/* 0x001C2C38 0x80232838 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80232848
/* 0x001C2C3C 0x8023283C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C2C40 0x80232840 0x0C05F0BF */ .word 0x0C05F0BF # jal 0x8017C2FC
/* 0x001C2C44 0x80232844 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x001C2C48 0x80232848 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001C2C4C 0x8023284C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C2C50 0x80232850 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
