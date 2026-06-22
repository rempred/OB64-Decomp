/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C140..0x0005C184 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf bit-test: -1 guard beq, index math, lbu 0x7AE7 table, srav/andi/xori. Ends jr $ra at 0x5C17C with delay slot nop at 0x5C180. */
func_0005c140:
/* 0x0005C140 0x800CBD40 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0005C144 0x800CBD44 0x1082000D */ .word 0x1082000D # beq $a0, $v0, 0x800CBD7C
/* 0x0005C148 0x800CBD48 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0005C14C 0x800CBD4C 0x04810002 */ .word 0x04810002 # bgez $a0, 0x800CBD58
/* 0x0005C150 0x800CBD50 0x00801821 */ .word 0x00801821 # move $v1, $a0
/* 0x0005C154 0x800CBD54 0x24830007 */ .word 0x24830007 # addiu $v1, $a0, 0x7
/* 0x0005C158 0x800CBD58 0x000318C3 */ .word 0x000318C3 # sra $v1, $v1, 3
/* 0x0005C15C 0x800CBD5C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0005C160 0x800CBD60 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0005C164 0x800CBD64 0x90427AE7 */ .word 0x90427AE7 # lbu $v0, 0x7AE7($v0)
/* 0x0005C168 0x800CBD68 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0005C16C 0x800CBD6C 0x00831823 */ .word 0x00831823 # subu $v1, $a0, $v1
/* 0x0005C170 0x800CBD70 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x0005C174 0x800CBD74 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0005C178 0x800CBD78 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x0005C17C 0x800CBD7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C180 0x800CBD80 0x00000000 */ .word 0x00000000 # nop
