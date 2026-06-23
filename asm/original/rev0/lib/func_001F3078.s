/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F3078..0x001F309C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small forwarding accessor, frame -0x18: moves $a0 to $a1, loads global base, tail-jal 0x801AF730. Ends jr $ra 0x001F3094 + delay 0x001F3098. */
/* function boundary candidate: func_001F3078, size=36, kind=prologue */
func_001F3078:
/* 0x001F3078 0x80262C78 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001F307C 0x80262C7C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001F3080 0x80262C80 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x001F3084 0x80262C84 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x001F3088 0x80262C88 0x0C06BDCC */ .word 0x0C06BDCC # jal 0x801AF730
/* 0x001F308C 0x80262C8C 0x2484E8A8 */ .word 0x2484E8A8 # addiu $a0, $a0, -0x1758
/* 0x001F3090 0x80262C90 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001F3094 0x80262C94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F3098 0x80262C98 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
