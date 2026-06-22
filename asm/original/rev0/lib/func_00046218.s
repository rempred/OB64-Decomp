/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046218..0x00046238 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (index math sll/addu/lui), jr $ra at 0x46230 + delay 0x46234 */
func_00046218:
/* 0x00046218 0x800B5E18 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x0004621C 0x800B5E1C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046220 0x800B5E20 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00046224 0x800B5E24 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046228 0x800B5E28 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004622C 0x800B5E2C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00046230 0x800B5E30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046234 0x800B5E34 0x902271F1 */ .word 0x902271F1 # lbu $v0, 0x71F1($at)
