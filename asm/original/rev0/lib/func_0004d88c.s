/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D88C..0x0004D8B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D8A8 + delay 0x4D8AC. */
/* function boundary candidate: func_0004D88C, size=36, kind=prologue */
func_0004D88C:
/* 0x0004D88C 0x800BD48C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D890 0x800BD490 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D894 0x800BD494 0x0C01CCDF */ .word 0x0C01CCDF # jal 0x8007337C
/* 0x0004D898 0x800BD498 0x00000000 */ .word 0x00000000 # nop
/* 0x0004D89C 0x800BD49C 0x0C072219 */ .word 0x0C072219 # jal 0x801C8864
/* 0x0004D8A0 0x800BD4A0 0x00000000 */ .word 0x00000000 # nop
/* 0x0004D8A4 0x800BD4A4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D8A8 0x800BD4A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D8AC 0x800BD4AC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
