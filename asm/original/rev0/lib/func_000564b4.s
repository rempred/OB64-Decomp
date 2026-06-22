/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000564B4..0x000564D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent file 32. Framed leaf (addiu $sp,-0x18 prologue at 0x000564B4); jal 0x801805D0; jr $ra at 0x000564C8 with delay slot addiu $sp,0x18 at 0x000564CC. Ends at 0x000564D0 where next prologue begins. */
/* function boundary candidate: func_000564B4, size=28, kind=prologue */
func_000564B4:
/* 0x000564B4 0x800C60B4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000564B8 0x800C60B8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000564BC 0x800C60BC 0x0C060174 */ .word 0x0C060174 # jal 0x801805D0
/* 0x000564C0 0x800C60C0 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x000564C4 0x800C60C4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000564C8 0x800C60C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000564CC 0x800C60CC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
