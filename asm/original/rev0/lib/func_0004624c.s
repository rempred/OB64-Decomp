/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004624C..0x0004625C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui), jr $ra at 0x46254 + delay 0x46258 */
func_0004624c:
/* 0x0004624C 0x800B5E4C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046250 0x800B5E50 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046254 0x800B5E54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046258 0x800B5E58 0x90421010 */ .word 0x90421010 # lbu $v0, 0x1010($v0)
