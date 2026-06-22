/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046144..0x00046168 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x46160 */
func_00046144:
/* 0x00046144 0x800B5D44 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00046148 0x800B5D48 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004614C 0x800B5D4C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00046150 0x800B5D50 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046154 0x800B5D54 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00046158 0x800B5D58 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004615C 0x800B5D5C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00046160 0x800B5D60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046164 0x800B5D64 0x94225578 */ .word 0x94225578 # lhu $v0, 0x5578($at)
