/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046520..0x00046534 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x4652C + delay 0x46530 */
func_00046520:
/* 0x00046520 0x800B6120 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046524 0x800B6124 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046528 0x800B6128 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004652C 0x800B612C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046530 0x800B6130 0x94423AC0 */ .word 0x94423AC0 # lhu $v0, 0x3AC0($v0)
