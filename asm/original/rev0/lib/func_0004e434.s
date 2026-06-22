/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E434..0x0004E448 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf split from parent 0x0004E3BC; jr $ra at 0x0004E440 + sh delay 0x0004E444 */
func_0004e434:
/* 0x0004E434 0x800BE034 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004E438 0x800BE038 0x94420F30 */ .word 0x94420F30 # lhu $v0, 0xF30($v0)
/* 0x0004E43C 0x800BE03C 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0004E440 0x800BE040 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E444 0x800BE044 0xA4229C0C */ .word 0xA4229C0C # sh $v0, -0x63F4($at)
