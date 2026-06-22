/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000462D0..0x000462F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index math, andi+sltiu tail), jr $ra at 0x462EC + delay 0x462F0 */
func_000462d0:
/* 0x000462D0 0x800B5ED0 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000462D4 0x800B5ED4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000462D8 0x800B5ED8 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000462DC 0x800B5EDC 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000462E0 0x800B5EE0 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000462E4 0x800B5EE4 0x942251CC */ .word 0x942251CC # lhu $v0, 0x51CC($at)
/* 0x000462E8 0x800B5EE8 0x30420006 */ .word 0x30420006 # andi $v0, $v0, 0x0006
/* 0x000462EC 0x800B5EEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000462F0 0x800B5EF0 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
