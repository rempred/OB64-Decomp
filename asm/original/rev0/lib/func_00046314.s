/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046314..0x00046324 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui), jr $ra at 0x4631C + delay 0x46320 */
func_00046314:
/* 0x00046314 0x800B5F14 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046318 0x800B5F18 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004631C 0x800B5F1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046320 0x800B5F20 0x9042367C */ .word 0x9042367C # lbu $v0, 0x367C($v0)
