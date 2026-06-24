/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B5D58..0x002B5D8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (non-prologue fall-through). Loads 0x80231A44 ptr, compares fields 0x0/0x4, returns boolean. j 0x80240F84 then jr $ra@0x002B5D84 + nop delay@0x002B5D88. */
func_002B5D58:
/* 0x002B5D58 0x80325958 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B5D5C 0x8032595C 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002B5D60 0x80325960 0x8C421A44 */ .word 0x8C421A44 # lw $v0, 0x1A44($v0)
/* 0x002B5D64 0x80325964 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x80325974
/* 0x002B5D68 0x80325968 0x00000000 */ .word 0x00000000 # nop
/* 0x002B5D6C 0x8032596C 0x080903E1 */ .word 0x080903E1 # j 0x80240F84
/* 0x002B5D70 0x80325970 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002B5D74 0x80325974 0x8C430000 */ .word 0x8C430000 # lw $v1, 0x0($v0)
/* 0x002B5D78 0x80325978 0x8C420004 */ .word 0x8C420004 # lw $v0, 0x4($v0)
/* 0x002B5D7C 0x8032597C 0x0043102A */ .word 0x0043102A # slt $v0, $v0, $v1
/* 0x002B5D80 0x80325980 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x002B5D84 0x80325984 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B5D88 0x80325988 0x00000000 */ .word 0x00000000 # nop
