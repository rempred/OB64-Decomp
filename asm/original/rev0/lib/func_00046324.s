/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046324..0x00046334 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui), jr $ra at 0x4632C + delay 0x46330 */
func_00046324:
/* 0x00046324 0x800B5F24 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046328 0x800B5F28 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004632C 0x800B5F2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046330 0x800B5F30 0x90423681 */ .word 0x90423681 # lbu $v0, 0x3681($v0)
