/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00286524..0x00286544 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame-0x18 accessor: $a0=2, jal 0x80227FD8 with $a1=1. Ends jr$ra@0x28653C + delay addiu$sp,0x18@0x286540. */
/* function boundary candidate: func_00286524, size=32, kind=prologue */
func_00286524:
/* 0x00286524 0x802F6124 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00286528 0x802F6128 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0028652C 0x802F612C 0x24040002 */ .word 0x24040002 # addiu $a0, $zero, 0x2
/* 0x00286530 0x802F6130 0x0C089FF6 */ .word 0x0C089FF6 # jal 0x80227FD8
/* 0x00286534 0x802F6134 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x00286538 0x802F6138 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0028653C 0x802F613C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00286540 0x802F6140 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
