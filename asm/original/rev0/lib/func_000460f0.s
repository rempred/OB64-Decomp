/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000460F0..0x0004610C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x46104 */
func_000460f0:
/* 0x000460F0 0x800B5CF0 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000460F4 0x800B5CF4 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000460F8 0x800B5CF8 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000460FC 0x800B5CFC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046100 0x800B5D00 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00046104 0x800B5D04 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046108 0x800B5D08 0x90223BD2 */ .word 0x90223BD2 # lbu $v0, 0x3BD2($at)
