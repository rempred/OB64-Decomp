/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042C3C..0x00042C50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, entry lui $v0,0x8018/lbu; jr $ra at 0x42C48 + delay sb */
func_00042c3c:
/* 0x00042C3C 0x800B283C 0x3C028018 */ .word 0x3C028018 # lui $v0, 0x8018
/* 0x00042C40 0x800B2840 0x90427021 */ .word 0x90427021 # lbu $v0, 0x7021($v0)
/* 0x00042C44 0x800B2844 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042C48 0x800B2848 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042C4C 0x800B284C 0xA0207021 */ .word 0xA0207021 # sb $zero, 0x7021($at)
