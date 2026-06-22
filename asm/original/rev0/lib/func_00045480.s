/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045480..0x00045498 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45490 */
func_00045480:
/* 0x00045480 0x800B5080 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045484 0x800B5084 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045488 0x800B5088 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004548C 0x800B508C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045490 0x800B5090 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045494 0x800B5094 0x9042C427 */ .word 0x9042C427 # lbu $v0, -0x3BD9($v0)
