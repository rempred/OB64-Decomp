/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046604..0x00046618 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sb store), jr $ra at 0x46610 + delay 0x46614 */
func_00046604:
/* 0x00046604 0x800B6204 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046608 0x800B6208 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0004660C 0x800B620C 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x00046610 0x800B6210 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046614 0x800B6214 0xA0263AC2 */ .word 0xA0263AC2 # sb $a2, 0x3AC2($at)
