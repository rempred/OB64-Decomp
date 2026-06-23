/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0A54..0x001F0A78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18 @1F0A54; jal 0x801C5938 with a1=1; jr$ra@1F0A70 + delay @1F0A74. */
/* function boundary candidate: func_001F0A54, size=36, kind=prologue */
func_001F0A54:
/* 0x001F0A54 0x80260654 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001F0A58 0x80260658 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001F0A5C 0x8026065C 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x001F0A60 0x80260660 0x2484B1F0 */ .word 0x2484B1F0 # addiu $a0, $a0, -0x4E10
/* 0x001F0A64 0x80260664 0x0C07164E */ .word 0x0C07164E # jal 0x801C5938
/* 0x001F0A68 0x80260668 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x001F0A6C 0x8026066C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001F0A70 0x80260670 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F0A74 0x80260674 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
