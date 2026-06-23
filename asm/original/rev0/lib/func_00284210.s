/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00284210..0x0028422C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame-0x18 accessor: jal 0x80227FD8 with $a1=1. Ends jr$ra@0x284224 + delay addiu$sp,0x18@0x284228. The two words at 0x28422C (lui$a0;lw) belong to the NEXT function's preamble, not this one. */
/* function boundary candidate: func_00284210, size=28, kind=prologue */
func_00284210:
/* 0x00284210 0x802F3E10 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00284214 0x802F3E14 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00284218 0x802F3E18 0x0C089FF6 */ .word 0x0C089FF6 # jal 0x80227FD8
/* 0x0028421C 0x802F3E1C 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x00284220 0x802F3E20 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00284224 0x802F3E24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00284228 0x802F3E28 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
