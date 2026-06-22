/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E344..0x0004E360 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004E344; prologue, jr $ra at 0x0004E358 + delay 0x0004E35C */
/* function boundary candidate: func_0004E344, size=40, kind=prologue */
func_0004E344:
/* 0x0004E344 0x800BDF44 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E348 0x800BDF48 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E34C 0x800BDF4C 0x0C06A82D */ .word 0x0C06A82D # jal 0x801AA0B4
/* 0x0004E350 0x800BDF50 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E354 0x800BDF54 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E358 0x800BDF58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E35C 0x800BDF5C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
