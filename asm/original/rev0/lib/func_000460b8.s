/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000460B8..0x000460D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lhu in delay), jr $ra at 0x460CC */
func_000460b8:
/* 0x000460B8 0x800B5CB8 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000460BC 0x800B5CBC 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000460C0 0x800B5CC0 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000460C4 0x800B5CC4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000460C8 0x800B5CC8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000460CC 0x800B5CCC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000460D0 0x800B5CD0 0x94223BD8 */ .word 0x94223BD8 # lhu $v0, 0x3BD8($at)
