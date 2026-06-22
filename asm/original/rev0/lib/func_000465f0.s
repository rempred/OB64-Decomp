/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000465F0..0x00046604 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sh store), jr $ra at 0x465FC + delay 0x46600 */
func_000465f0:
/* 0x000465F0 0x800B61F0 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x000465F4 0x800B61F4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000465F8 0x800B61F8 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000465FC 0x800B61FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046600 0x800B6200 0xA4263AC0 */ .word 0xA4263AC0 # sh $a2, 0x3AC0($at)
