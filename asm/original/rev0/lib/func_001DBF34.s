/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001DBF34..0x001DBF68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001DBF34, size=52, kind=prologue */
func_001DBF34:
/* 0x001DBF34 0x8024BB34 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001DBF38 0x8024BB38 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001DBF3C 0x8024BB3C 0x0C066457 */ .word 0x0C066457 # jal 0x8019915C
/* 0x001DBF40 0x8024BB40 0x00000000 */ .word 0x00000000 # nop
/* 0x001DBF44 0x8024BB44 0x3C02801C */ .word 0x3C02801C # lui $v0, 0x801C
/* 0x001DBF48 0x8024BB48 0x9042A6E1 */ .word 0x9042A6E1 # lbu $v0, -0x591F($v0)
/* 0x001DBF4C 0x8024BB4C 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8024BB5C
/* 0x001DBF50 0x8024BB50 0x00000000 */ .word 0x00000000 # nop
/* 0x001DBF54 0x8024BB54 0x0C066546 */ .word 0x0C066546 # jal 0x80199518
/* 0x001DBF58 0x8024BB58 0x00000000 */ .word 0x00000000 # nop
/* 0x001DBF5C 0x8024BB5C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001DBF60 0x8024BB60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001DBF64 0x8024BB64 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
