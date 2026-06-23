/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0A78..0x001F0A9C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18 @1F0A78; jal 0x801C5938 with a1=2; jr$ra@1F0A94 + delay @1F0A98. */
/* function boundary candidate: func_001F0A78, size=36, kind=prologue */
func_001F0A78:
/* 0x001F0A78 0x80260678 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001F0A7C 0x8026067C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001F0A80 0x80260680 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x001F0A84 0x80260684 0x2484B1F0 */ .word 0x2484B1F0 # addiu $a0, $a0, -0x4E10
/* 0x001F0A88 0x80260688 0x0C07164E */ .word 0x0C07164E # jal 0x801C5938
/* 0x001F0A8C 0x8026068C 0x24050002 */ .word 0x24050002 # addiu $a1, $zero, 0x2
/* 0x001F0A90 0x80260690 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001F0A94 0x80260694 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F0A98 0x80260698 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
