/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045878..0x00045898 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45890 */
func_00045878:
/* 0x00045878 0x800B5478 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0004587C 0x800B547C 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045880 0x800B5480 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045884 0x800B5484 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045888 0x800B5488 0x9042C425 */ .word 0x9042C425 # lbu $v0, -0x3BDB($v0)
/* 0x0004588C 0x800B548C 0x00021102 */ .word 0x00021102 # srl $v0, $v0, 4
/* 0x00045890 0x800B5490 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045894 0x800B5494 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
