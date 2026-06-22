/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005214C..0x0005219C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf: reads arg regs (sll/sra sign-extend a1..a3), reads stack 0x10/0x14($sp), stores into struct at $a0. jr $ra at 0x52194 + delay 0x52198. Split from over-merged parent. */
func_0005214c:
/* 0x0005214C 0x800C1D4C 0x00063400 */ .word 0x00063400 # sll $a2, $a2, 16
/* 0x00052150 0x800C1D50 0x00063403 */ .word 0x00063403 # sra $a2, $a2, 16
/* 0x00052154 0x800C1D54 0xAC850010 */ .word 0xAC850010 # sw $a1, 0x10($a0)
/* 0x00052158 0x800C1D58 0xAC86003C */ .word 0xAC86003C # sw $a2, 0x3C($a0)
/* 0x0005215C 0x800C1D5C 0x8FA30010 */ .word 0x8FA30010 # lw $v1, 0x10($sp)
/* 0x00052160 0x800C1D60 0x00073C00 */ .word 0x00073C00 # sll $a3, $a3, 16
/* 0x00052164 0x800C1D64 0x00073C03 */ .word 0x00073C03 # sra $a3, $a3, 16
/* 0x00052168 0x800C1D68 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x0005216C 0x800C1D6C 0xA4820028 */ .word 0xA4820028 # sh $v0, 0x28($a0)
/* 0x00052170 0x800C1D70 0x34028000 */ .word 0x34028000 # ori $v0, $zero, 0x8000
/* 0x00052174 0x800C1D74 0xAC870040 */ .word 0xAC870040 # sw $a3, 0x40($a0)
/* 0x00052178 0x800C1D78 0xA4820026 */ .word 0xA4820026 # sh $v0, 0x26($a0)
/* 0x0005217C 0x800C1D7C 0x8FA20014 */ .word 0x8FA20014 # lw $v0, 0x14($sp)
/* 0x00052180 0x800C1D80 0x00031C00 */ .word 0x00031C00 # sll $v1, $v1, 16
/* 0x00052184 0x800C1D84 0x00031C03 */ .word 0x00031C03 # sra $v1, $v1, 16
/* 0x00052188 0x800C1D88 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0005218C 0x800C1D8C 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x00052190 0x800C1D90 0xAC830044 */ .word 0xAC830044 # sw $v1, 0x44($a0)
/* 0x00052194 0x800C1D94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00052198 0x800C1D98 0xAC820048 */ .word 0xAC820048 # sw $v0, 0x48($a0)
