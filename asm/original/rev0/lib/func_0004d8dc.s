/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D8DC..0x0004D8F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D8F0 + delay 0x4D8F4. */
/* function boundary candidate: func_0004D8DC, size=28, kind=prologue */
func_0004D8DC:
/* 0x0004D8DC 0x800BD4DC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D8E0 0x800BD4E0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D8E4 0x800BD4E4 0x0C06C02C */ .word 0x0C06C02C # jal 0x801B00B0
/* 0x0004D8E8 0x800BD4E8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004D8EC 0x800BD4EC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D8F0 0x800BD4F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D8F4 0x800BD4F4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
