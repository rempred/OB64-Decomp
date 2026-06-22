/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004649C..0x000464AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui, sb store), jr $ra at 0x464A4 + delay 0x464A8 */
func_0004649c:
/* 0x0004649C 0x800B609C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000464A0 0x800B60A0 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000464A4 0x800B60A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000464A8 0x800B60A8 0xA026367C */ .word 0xA026367C # sb $a2, 0x367C($at)
