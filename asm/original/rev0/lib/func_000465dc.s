/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000465DC..0x000465F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sb store), jr $ra at 0x465E8 + delay 0x465EC */
func_000465dc:
/* 0x000465DC 0x800B61DC 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x000465E0 0x800B61E0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000465E4 0x800B61E4 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000465E8 0x800B61E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000465EC 0x800B61EC 0xA0263AC3 */ .word 0xA0263AC3 # sb $a2, 0x3AC3($at)
