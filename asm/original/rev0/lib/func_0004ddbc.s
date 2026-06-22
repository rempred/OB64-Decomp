/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DDBC..0x0004DDD8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DDD0 + delay 0x0004DDD4; trailing accessor un-merged at 0x0004DDD8 */
/* function boundary candidate: func_0004DDBC, size=40, kind=prologue */
func_0004DDBC:
/* 0x0004DDBC 0x800BD9BC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DDC0 0x800BD9C0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DDC4 0x800BD9C4 0x0C068EE6 */ .word 0x0C068EE6 # jal 0x801A3B98
/* 0x0004DDC8 0x800BD9C8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DDCC 0x800BD9CC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DDD0 0x800BD9D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DDD4 0x800BD9D4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
