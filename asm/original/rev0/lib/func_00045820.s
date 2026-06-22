/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045820..0x00045840 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45838 */
func_00045820:
/* 0x00045820 0x800B5420 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045824 0x800B5424 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045828 0x800B5428 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004582C 0x800B542C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045830 0x800B5430 0x9042C424 */ .word 0x9042C424 # lbu $v0, -0x3BDC($v0)
/* 0x00045834 0x800B5434 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x00045838 0x800B5438 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004583C 0x800B543C 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
