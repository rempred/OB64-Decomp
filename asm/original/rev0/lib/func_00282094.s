/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00282094..0x002820C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue; jal sequence; jr at 0x2820B8 + delay 0x2820BC. Ends before the lui/lbu preamble of the next function. */
/* function boundary candidate: func_00282094, size=44, kind=prologue */
func_00282094:
/* 0x00282094 0x802F1C94 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00282098 0x802F1C98 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0028209C 0x802F1C9C 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x002820A0 0x802F1CA0 0x00000000 */ .word 0x00000000 # nop
/* 0x002820A4 0x802F1CA4 0x0C08B9E9 */ .word 0x0C08B9E9 # jal 0x8022E7A4
/* 0x002820A8 0x802F1CA8 0x00000000 */ .word 0x00000000 # nop
/* 0x002820AC 0x802F1CAC 0x0C05E324 */ .word 0x0C05E324 # jal 0x80178C90
/* 0x002820B0 0x802F1CB0 0x00000000 */ .word 0x00000000 # nop
/* 0x002820B4 0x802F1CB4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002820B8 0x802F1CB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002820BC 0x802F1CBC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
