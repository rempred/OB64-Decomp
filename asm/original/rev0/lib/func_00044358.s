/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00044358..0x00044370 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lbu in delay slot); jr $ra at 0x44368, end before prologue 0x44370 */
func_00044358:
/* 0x00044358 0x800B3F58 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0004435C 0x800B3F5C 0x00042100 */ .word 0x00042100 # sll $a0, $a0, 4
/* 0x00044360 0x800B3F60 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00044364 0x800B3F64 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00044368 0x800B3F68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004436C 0x800B3F6C 0x9042AA80 */ .word 0x9042AA80 # lbu $v0, -0x5580($v0)
