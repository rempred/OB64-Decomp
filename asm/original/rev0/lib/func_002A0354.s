/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002A0354..0x002A0374 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* leaf wrapper; prologue addiu$sp,-0x18; ends jr$ra@0x002A036C + delay@0x002A0370. */
/* function boundary candidate: func_002A0354, size=32, kind=prologue */
func_002A0354:
/* 0x002A0354 0x8030FF54 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A0358 0x8030FF58 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002A035C 0x8030FF5C 0x0C067C5D */ .word 0x0C067C5D # jal 0x8019F174
/* 0x002A0360 0x8030FF60 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x002A0364 0x8030FF64 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002A0368 0x8030FF68 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x002A036C 0x8030FF6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A0370 0x8030FF70 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
