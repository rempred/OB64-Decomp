/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C110..0x0005C140 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf bit-test: index math on $a0, lbu 0x7168 table, srav+andi. Ends jr $ra at 0x5C138 with delay-slot andi at 0x5C13C. */
func_0005c110:
/* 0x0005C110 0x800CBD10 0x04810002 */ .word 0x04810002 # bgez $a0, 0x800CBD1C
/* 0x0005C114 0x800CBD14 0x00801821 */ .word 0x00801821 # move $v1, $a0
/* 0x0005C118 0x800CBD18 0x24830007 */ .word 0x24830007 # addiu $v1, $a0, 0x7
/* 0x0005C11C 0x800CBD1C 0x000318C3 */ .word 0x000318C3 # sra $v1, $v1, 3
/* 0x0005C120 0x800CBD20 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0005C124 0x800CBD24 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0005C128 0x800CBD28 0x90427168 */ .word 0x90427168 # lbu $v0, 0x7168($v0)
/* 0x0005C12C 0x800CBD2C 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0005C130 0x800CBD30 0x00831823 */ .word 0x00831823 # subu $v1, $a0, $v1
/* 0x0005C134 0x800CBD34 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x0005C138 0x800CBD38 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C13C 0x800CBD3C 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
