/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001E9138..0x001E9154 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: prologue addiu $sp,-0x18, sw $ra, jal 0x80199460, restore, jr $ra @0x001E914C + delay slot addiu $sp,+0x18 @0x001E9150. */
/* function boundary candidate: func_001E9138, size=28, kind=prologue */
func_001E9138:
/* 0x001E9138 0x80258D38 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001E913C 0x80258D3C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001E9140 0x80258D40 0x0C066518 */ .word 0x0C066518 # jal 0x80199460
/* 0x001E9144 0x80258D44 0x00000000 */ .word 0x00000000 # nop
/* 0x001E9148 0x80258D48 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001E914C 0x80258D4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001E9150 0x80258D50 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
