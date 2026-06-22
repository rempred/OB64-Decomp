/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046270..0x00046280 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui), jr $ra at 0x46278 + delay 0x4627C */
func_00046270:
/* 0x00046270 0x800B5E70 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046274 0x800B5E74 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046278 0x800B5E78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004627C 0x800B5E7C 0x90425480 */ .word 0x90425480 # lbu $v0, 0x5480($v0)
