/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000465C0..0x000465DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x465C0), jr $ra at 0x465D4 + delay 0x465D8 */
/* function boundary candidate: func_000465C0, size=148, kind=prologue */
func_000465C0:
/* 0x000465C0 0x800B61C0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000465C4 0x800B61C4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000465C8 0x800B61C8 0x0C05C1E5 */ .word 0x0C05C1E5 # jal 0x80170794
/* 0x000465CC 0x800B61CC 0x00000000 */ .word 0x00000000 # nop
/* 0x000465D0 0x800B61D0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000465D4 0x800B61D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000465D8 0x800B61D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
