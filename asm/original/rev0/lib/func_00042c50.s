/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042C50..0x00042C5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, entry lui $at,0x8018; jr $ra at 0x42C54 + delay sb */
func_00042c50:
/* 0x00042C50 0x800B2850 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00042C54 0x800B2854 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042C58 0x800B2858 0xA0247020 */ .word 0xA0247020 # sb $a0, 0x7020($at)
