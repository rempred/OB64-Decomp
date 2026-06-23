/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001E9154..0x001E9170 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: prologue addiu $sp,-0x18, sw $ra, jal 0x801994C0, restore, jr $ra @0x001E9168 + delay slot addiu $sp,+0x18 @0x001E916C. Slice end. */
/* function boundary candidate: func_001E9154, size=28, kind=prologue */
func_001E9154:
/* 0x001E9154 0x80258D54 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001E9158 0x80258D58 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001E915C 0x80258D5C 0x0C066530 */ .word 0x0C066530 # jal 0x801994C0
/* 0x001E9160 0x80258D60 0x00000000 */ .word 0x00000000 # nop
/* 0x001E9164 0x80258D64 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001E9168 0x80258D68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001E916C 0x80258D6C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
