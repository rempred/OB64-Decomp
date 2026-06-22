/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000495E0..0x00049604 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui $v0/lbu 0x36E0 ptr select; jr $ra at 0x000495FC + delay 0x00049600. Un-merged from parent idx64/idx65 leadingGap. */
func_000495e0:
/* 0x000495E0 0x800B91E0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000495E4 0x800B91E4 0x904236E0 */ .word 0x904236E0 # lbu $v0, 0x36E0($v0)
/* 0x000495E8 0x800B91E8 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000495EC 0x800B91EC 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800B91FC
/* 0x000495F0 0x800B91F0 0x2463F330 */ .word 0x2463F330 # addiu $v1, $v1, -0xCD0
/* 0x000495F4 0x800B91F4 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000495F8 0x800B91F8 0x2463F344 */ .word 0x2463F344 # addiu $v1, $v1, -0xCBC
/* 0x000495FC 0x800B91FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049600 0x800B9200 0x00601021 */ .word 0x00601021 # move $v0, $v1
