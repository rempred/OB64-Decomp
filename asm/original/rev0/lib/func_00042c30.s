/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042C30..0x00042C3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x42B2C: frameless leaf, entry lui $v0,0x8018; jr $ra at 0x42C34 + delay lbu */
func_00042c30:
/* 0x00042C30 0x800B2830 0x3C028018 */ .word 0x3C028018 # lui $v0, 0x8018
/* 0x00042C34 0x800B2834 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042C38 0x800B2838 0x90427020 */ .word 0x90427020 # lbu $v0, 0x7020($v0)
