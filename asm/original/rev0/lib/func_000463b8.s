/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000463B8..0x000463D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index math, sb store), jr $ra at 0x463D0 + delay 0x463D4 */
func_000463b8:
/* 0x000463B8 0x800B5FB8 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000463BC 0x800B5FBC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000463C0 0x800B5FC0 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000463C4 0x800B5FC4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000463C8 0x800B5FC8 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000463CC 0x800B5FCC 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000463D0 0x800B5FD0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000463D4 0x800B5FD4 0xA02671F1 */ .word 0xA02671F1 # sb $a2, 0x71F1($at)
