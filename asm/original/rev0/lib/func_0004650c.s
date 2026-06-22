/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004650C..0x00046520 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46518 + delay 0x4651C */
func_0004650c:
/* 0x0004650C 0x800B610C 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046510 0x800B6110 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046514 0x800B6114 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046518 0x800B6118 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004651C 0x800B611C 0x90423AC3 */ .word 0x90423AC3 # lbu $v0, 0x3AC3($v0)
