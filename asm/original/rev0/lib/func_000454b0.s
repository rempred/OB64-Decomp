/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000454B0..0x000454C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x454C0 */
func_000454b0:
/* 0x000454B0 0x800B50B0 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000454B4 0x800B50B4 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000454B8 0x800B50B8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000454BC 0x800B50BC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000454C0 0x800B50C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000454C4 0x800B50C4 0x8C42C40C */ .word 0x8C42C40C # lw $v0, -0x3BF4($v0)
