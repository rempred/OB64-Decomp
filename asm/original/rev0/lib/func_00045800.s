/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045800..0x00045820 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45818 */
func_00045800:
/* 0x00045800 0x800B5400 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045804 0x800B5404 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045808 0x800B5408 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004580C 0x800B540C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045810 0x800B5410 0x9042C424 */ .word 0x9042C424 # lbu $v0, -0x3BDC($v0)
/* 0x00045814 0x800B5414 0x00021102 */ .word 0x00021102 # srl $v0, $v0, 4
/* 0x00045818 0x800B5418 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004581C 0x800B541C 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
