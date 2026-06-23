/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0A30..0x001F0A54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18 @1F0A30; jal 0x801C5938 with a1=0; jr$ra@1F0A4C + delay addiu $sp,0x18 @1F0A50. */
/* function boundary candidate: func_001F0A30, size=36, kind=prologue */
func_001F0A30:
/* 0x001F0A30 0x80260630 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001F0A34 0x80260634 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001F0A38 0x80260638 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x001F0A3C 0x8026063C 0x2484B1F0 */ .word 0x2484B1F0 # addiu $a0, $a0, -0x4E10
/* 0x001F0A40 0x80260640 0x0C07164E */ .word 0x0C07164E # jal 0x801C5938
/* 0x001F0A44 0x80260644 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x001F0A48 0x80260648 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001F0A4C 0x8026064C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F0A50 0x80260650 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
