/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046618..0x0004662C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sb store), jr $ra at 0x46624 + delay 0x46628 */
func_00046618:
/* 0x00046618 0x800B6218 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x0004661C 0x800B621C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046620 0x800B6220 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x00046624 0x800B6224 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046628 0x800B6228 0xA0266B03 */ .word 0xA0266B03 # sb $a2, 0x6B03($at)
