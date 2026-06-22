/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000464AC..0x000464BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui, sb store), jr $ra at 0x464B4 + delay 0x464B8 */
func_000464ac:
/* 0x000464AC 0x800B60AC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000464B0 0x800B60B0 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000464B4 0x800B60B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000464B8 0x800B60B8 0xA0263681 */ .word 0xA0263681 # sb $a2, 0x3681($at)
