/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046334..0x0004633C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x46334 + delay 0x46338 (move $v0,$zero) */
func_00046334:
/* 0x00046334 0x800B5F34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046338 0x800B5F38 0x00001021 */ .word 0x00001021 # move $v0, $zero
