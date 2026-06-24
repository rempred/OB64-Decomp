/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B1014..0x002B1028 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless accessor: lui $v0,0x8023 / lw $v0,-0x568C($v0) / lw $v0,0x1BB0($v0) / jr$ra@0x002B1020 + delay sltiu $v0,$v0,0x1@0x002B1024. */
func_002B1014:
/* 0x002B1014 0x80320C14 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B1018 0x80320C18 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002B101C 0x80320C1C 0x8C421BB0 */ .word 0x8C421BB0 # lw $v0, 0x1BB0($v0)
/* 0x002B1020 0x80320C20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B1024 0x80320C24 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
