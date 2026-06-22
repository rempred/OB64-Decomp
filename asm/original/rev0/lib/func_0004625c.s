/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004625C..0x00046270 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46268 + delay 0x4626C */
func_0004625c:
/* 0x0004625C 0x800B5E5C 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x00046260 0x800B5E60 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046264 0x800B5E64 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046268 0x800B5E68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004626C 0x800B5E6C 0x9442532C */ .word 0x9442532C # lhu $v0, 0x532C($v0)
