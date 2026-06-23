/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028B788..0x0028B7A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny prologue addiu $sp,-0x18; single jal 0x802344D0; ends jr $ra at 0x0028B79C + delay addiu $sp,0x18 at 0x0028B7A0. Separate function; the four lui loads after the delay slot belong to the next function (preamble). */
/* function boundary candidate: func_0028B788, size=28, kind=prologue */
func_0028B788:
/* 0x0028B788 0x802FB388 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0028B78C 0x802FB38C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0028B790 0x802FB390 0x0C08D134 */ .word 0x0C08D134 # jal 0x802344D0
/* 0x0028B794 0x802FB394 0x00000000 */ .word 0x00000000 # nop
/* 0x0028B798 0x802FB398 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0028B79C 0x802FB39C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028B7A0 0x802FB3A0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
