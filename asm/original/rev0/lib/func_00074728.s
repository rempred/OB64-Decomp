/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00074728..0x00074738 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from parent file 11: lbu $v0,0x14($a0) / ori 0x80 / jr $ra at 0x74730 / sb $v0,0x14($a0) delay slot. Next word 0x74738 starts another frameless leaf. */
func_00074728:
/* 0x00074728 0x800E4328 0x90820014 */ .word 0x90820014 # lbu $v0, 0x14($a0)
/* 0x0007472C 0x800E432C 0x34420080 */ .word 0x34420080 # ori $v0, $v0, 0x0080
/* 0x00074730 0x800E4330 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00074734 0x800E4334 0xA0820014 */ .word 0xA0820014 # sb $v0, 0x14($a0)
