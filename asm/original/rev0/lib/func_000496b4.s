/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000496B4..0x000496D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x000496C8 + delay 0x000496CC. Matches parent idx66. */
/* function boundary candidate: func_000496B4, size=28, kind=prologue */
func_000496B4:
/* 0x000496B4 0x800B92B4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000496B8 0x800B92B8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000496BC 0x800B92BC 0x0C05B205 */ .word 0x0C05B205 # jal 0x8016C814
/* 0x000496C0 0x800B92C0 0x00000000 */ .word 0x00000000 # nop
/* 0x000496C4 0x800B92C4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000496C8 0x800B92C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000496CC 0x800B92CC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
