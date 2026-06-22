/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000458D4..0x000458F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x458E8 */
func_000458d4:
/* 0x000458D4 0x800B54D4 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000458D8 0x800B54D8 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000458DC 0x800B54DC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000458E0 0x800B54E0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000458E4 0x800B54E4 0x9042C426 */ .word 0x9042C426 # lbu $v0, -0x3BDA($v0)
/* 0x000458E8 0x800B54E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000458EC 0x800B54EC 0x000211C2 */ .word 0x000211C2 # srl $v0, $v0, 7
