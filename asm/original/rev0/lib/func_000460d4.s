/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000460D4..0x000460F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lbu in delay), jr $ra at 0x460E8 */
func_000460d4:
/* 0x000460D4 0x800B5CD4 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000460D8 0x800B5CD8 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000460DC 0x800B5CDC 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000460E0 0x800B5CE0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000460E4 0x800B5CE4 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000460E8 0x800B5CE8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000460EC 0x800B5CEC 0x90223BD1 */ .word 0x90223BD1 # lbu $v0, 0x3BD1($at)
